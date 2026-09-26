(() => {
  const field = document.querySelector('#catch-field');
  const heartsLayer = document.querySelector('#catch-hearts');
  const envelope = document.querySelector('#catch-envelope');
  const start = document.querySelector('#catch-start');
  const pause = document.querySelector('#catch-pause');
  const overlay = document.querySelector('#catch-overlay');
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-atomic', 'true');
  const note = document.querySelector('#catch-note');
  const scoreLabel = document.querySelector('#catch-score');
  const timeLabel = document.querySelector('#catch-time');
  const soundButton = document.querySelector('#catch-sound');
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  let soundEnabled = true, audioContext, audioVolume;
  const voices = new Set();
  try { soundEnabled = localStorage.getItem('catch-love-sound') !== 'off'; } catch {}
  function updateSoundButton() {
    soundButton.textContent = soundEnabled ? '♪ Sound on' : '♪ Sound off';
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
  }
  function unlockSound() {
    if (!soundEnabled || !AudioEngine) return;
    try {
      if (!audioContext) {
        audioContext = new AudioEngine();
        audioVolume = audioContext.createGain(); audioVolume.gain.value = .18;
        audioVolume.connect(audioContext.destination);
      }
      if (audioContext.state === 'suspended' || audioContext.state === 'interrupted') audioContext.resume().catch(() => {});
    } catch { /* The game can still run if browser audio is unavailable. */ }
  }
  function stopChime() {
    voices.forEach(voice => { try { voice.stop(); } catch {} });
    voices.clear();
  }
  function playCatchChime() {
    if (!soundEnabled || audioContext?.state !== 'running') return;
    const now = audioContext.currentTime;
    // A quiet, rising two-note chime, with a soft attack and a short bell-like tail.
    [659.25, 987.77].forEach((frequency, index) => {
      const voice = audioContext.createOscillator(), volume = audioContext.createGain();
      const at = now + index * .07;
      voice.type = 'sine'; voice.frequency.value = frequency;
      volume.gain.setValueAtTime(0, at);
      volume.gain.linearRampToValueAtTime(index ? .16 : .22, at + .012);
      volume.gain.exponentialRampToValueAtTime(.001, at + .3);
      volume.gain.linearRampToValueAtTime(0, at + .34);
      voice.connect(volume); volume.connect(audioVolume); voices.add(voice);
      voice.onended = () => { voice.disconnect(); volume.disconnect(); voices.delete(voice); };
      voice.start(at); voice.stop(at + .35);
    });
  }
  soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled; updateSoundButton();
    try { localStorage.setItem('catch-love-sound', soundEnabled ? 'on' : 'off'); } catch {}
    if (soundEnabled) unlockSound(); else stopChime();
  });
  if (!AudioEngine) { soundEnabled = false; soundButton.disabled = true; }
  updateSoundButton();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const effects = document.createElement('div');
  effects.className = 'catch-effects'; effects.setAttribute('aria-hidden', 'true'); field.append(effects);
  function animateCatch() {
    if (reducedMotion.matches) return;
    envelope.getAnimations().filter(animation => animation.id === 'catch-bounce').forEach(animation => animation.cancel());
    envelope.animate([
      { transform: 'translateX(-50%) scale(1)' },
      { transform: 'translateX(-50%) translateY(-6px) scale(1.08, .94)', offset: .4 },
      { transform: 'translateX(-50%) scale(1)' }
    ], { duration: 300, easing: 'ease-out', id: 'catch-bounce' });
    scoreLabel.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 280 });
    ['Y', 'A', 'S', 'h', '♥'].forEach((symbol, i) => {
      const spark = document.createElement('span'); spark.className = 'catch-spark';
      spark.textContent = symbol;
      spark.style.bottom = `${20 + envelopeHeight}px`;
      spark.style.left = `${x * 100}%`; spark.style.setProperty('--drift', `${(i - 2) * 18}px`);
      spark.style.setProperty('--lift', `${-45 - (2 - Math.abs(i - 2)) * 12}px`);
      spark.addEventListener('animationend', () => spark.remove(), { once: true }); effects.append(spark);
    });
  }
  const notes = [
    'I still smile at my phone when your name shows up.',
    'Every time we meet, “a little longer” feels too short.',
    'You make doing absolutely nothing together sound like a plan.',
    'If you catch me staring, I was probably about to smile.',
    'I keep saving little stories to tell you. You’re my favourite person to tell.'
  ];
  let state = 'ready', score = 0, elapsed = 0, spawnIn = 0;
  let x = .5, hearts = [], previous = 0, frame = 0;
  let fullness = 0, envelopeWidth = 70, envelopeHeight = 46;
  const keys = new Set();
  const clamp = value => {
    const margin = (envelopeWidth * 1.08 / 2 + 5) / field.clientWidth;
    return Math.max(margin, Math.min(1 - margin, value));
  };
  function fillEnvelope(dt = 0) {
    // Each heart adds a little volume; growth tapers so the envelope never crowds the board.
    const target = 1 - Math.exp(-score / 12);
    fullness = reducedMotion.matches || dt === 0 ? target : fullness + (target - fullness) * (1 - Math.exp(-10 * dt));
    envelopeWidth = 70 + 46 * fullness;
    envelopeHeight = 46 + 40 * fullness;
    envelope.style.width = `${envelopeWidth}px`;
    envelope.style.height = `${envelopeHeight}px`;
    envelope.style.borderRadius = `${2 + 7 * fullness}px`;
    envelope.style.boxShadow = `0 ${3 + 4 * fullness}px ${4 + 8 * fullness}px #b7808b33, inset 0 ${-2 - 5 * fullness}px ${4 + 6 * fullness}px #d9b6a833`;
  }
  function placeEnvelope() {
    x = clamp(x);
    envelope.style.left = `${x * 100}%`;
  }
  function ending(count) {
    // Keep the requested original for twelve; overlaps favour 5, then 3, then 2.
    if (count === 12) return 'You caught 12 hearts. Mine was already yours.';
    if (count > 0 && count % 5 === 0) return `You caught ${count} hearts. I’d still trade every one for five more minutes with you.`;
    if (count > 0 && count % 3 === 0) return `You caught ${count} hearts. Three words I’ll never get tired of: it’s you, always.`;
    if (count > 0 && count % 2 === 0) return `You caught ${count} hearts. My favourite two will always be you and me.`;
    return `You caught ${count} ${count === 1 ? 'heart' : 'hearts'}. You still make mine skip a beat.`;
  }
  function showOverlay(title, copy) {
    document.querySelector('#catch-overlay-title').textContent = title;
    document.querySelector('#catch-overlay-copy').textContent = copy;
    document.querySelector('#catch-overlay-copy').hidden = !copy;
    overlay.hidden = false;
  }
  function finish() {
    state = 'finished';
    field.dataset.state = state; effects.replaceChildren();
    keys.clear();
    heartsLayer.replaceChildren(); hearts = [];
    pause.disabled = true;
    start.disabled = false; start.textContent = 'Catch a few more? ↻';
    showOverlay(ending(score), '');
    note.hidden = true;
  }
  function tick(now) {
    if (state !== 'playing') return;
    const dt = Math.min((now - previous) / 1000, .1); previous = now;
    elapsed = Math.min(20, elapsed + dt);
    timeLabel.textContent = Math.ceil(20 - elapsed);
    if (elapsed >= 20) { finish(); return; }
    const width = field.clientWidth, height = field.clientHeight;
    fillEnvelope(dt);
    x += ((keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0)) * dt * .85;
    placeEnvelope();
    spawnIn -= dt;
    if (spawnIn <= 0) {
      const el = document.createElement('span'); el.className = 'catch-pixel-heart';
      el.style.animationDelay = `${-Math.random() * 2}s`;
      const hx = 18 + Math.random() * (width - 36);
      hearts.push({ el, x: hx / width, y: -24, speed: 65 + elapsed * 1.4 });
      heartsLayer.append(el); spawnIn = .85 - elapsed * .005;
    }
    const catchY = height - 20 - envelopeHeight;
    hearts = hearts.filter(heart => {
      const oldY = heart.y; heart.y += heart.speed * dt;
      if (oldY <= height - 20 && heart.y + 24 >= catchY && Math.abs(heart.x * width - x * width) <= envelopeWidth / 2 + 10) {
        heart.el.remove(); score++; scoreLabel.textContent = score;
        playCatchChime();
        animateCatch();
        if (score % 5 === 0) note.textContent = notes[(score / 5 - 1) % notes.length];
        return false;
      }
      if (heart.y > height + 24) { heart.el.remove(); return false; }
      heart.el.style.left = `${heart.x * 100}%`; heart.el.style.top = `${heart.y}px`;
      return true;
    });
    frame = requestAnimationFrame(tick);
  }
  function setPaused() {
    if (state !== 'playing') return;
    state = 'paused'; cancelAnimationFrame(frame); keys.clear();
    stopChime();
    field.dataset.state = state;
    pause.textContent = 'Resume';
    showOverlay('Take your time, love.', 'Your hearts will wait right here.');
    note.textContent = 'Paused. There’s no hurry when it’s us.';
  }
  start.addEventListener('click', () => {
    stopChime(); unlockSound();
    cancelAnimationFrame(frame); heartsLayer.replaceChildren(); hearts = []; keys.clear();
    effects.replaceChildren();
    score = 0; elapsed = 0; spawnIn = .35; x = .5; fillEnvelope(); placeEnvelope();
    scoreLabel.textContent = '0'; timeLabel.textContent = '20';
    state = 'playing'; overlay.hidden = true; start.disabled = true;
    field.dataset.state = state;
    pause.disabled = false; pause.textContent = 'Pause';
    note.hidden = false;
    note.textContent = 'Somehow, they all seem to be falling for you.';
    field.focus({ preventScroll: true }); previous = performance.now(); frame = requestAnimationFrame(tick);
  });
  pause.addEventListener('click', () => {
    if (state === 'playing') { setPaused(); return; }
    if (state !== 'paused') return;
    unlockSound();
    state = 'playing'; overlay.hidden = true; pause.textContent = 'Pause';
    field.dataset.state = state;
    note.textContent = 'There you are. Where were we? ♡';
    field.focus({ preventScroll: true }); previous = performance.now(); frame = requestAnimationFrame(tick);
  });
  function movePointer(event) {
    if (state !== 'playing') return;
    const rect = field.getBoundingClientRect(); x = (event.clientX - rect.left) / rect.width; placeEnvelope();
  }
  field.addEventListener('pointerdown', event => {
    if (state !== 'playing') return;
    field.setPointerCapture(event.pointerId); movePointer(event);
  });
  field.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' || field.hasPointerCapture(event.pointerId)) movePointer(event);
  });
  field.addEventListener('keydown', event => {
    if (state !== 'playing') return;
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); keys.add(event.key); }
    if (event.code === 'Space') { event.preventDefault(); setPaused(); pause.focus(); }
  });
  field.addEventListener('keyup', event => keys.delete(event.key));
  field.addEventListener('blur', () => keys.clear());
  window.addEventListener('blur', setPaused);
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(); });
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) setPaused();
  }).observe(field);
  new ResizeObserver(placeEnvelope).observe(field);
})();
