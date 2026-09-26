const photo = (folder, name) => `assets/Swati/${folder}/WhatsApp Image 2026-09-26 at ${name}.jpeg`;
const albums = {
  first: { title: 'Our first meet · Where it all began', photos: [
    { src: photo('first_meet', '22.08.14'), alt: 'Swati at the Ganesh celebration on our first meeting' },
    { src: photo('first_meet', '22.10.13'), alt: 'A busy street outside McDonald’s, a glimpse of our first meeting' }
  ] },
  third: { title: 'Our third meet · A little closer', photos: [
    { src: photo('3rd meet', '22.08.15-2'), alt: 'The two of us smiling together at a restaurant' }
  ] },
  fourth: { title: 'Our fourth meet · More of this, please', photos: [
    { src: photo('4th_meet', '22.08.17'), alt: 'Sitting together and smiling on our fourth meeting' },
    { src: photo('4th_meet', '22.08.15-3'), alt: 'Our selfie together on the train', sideways: true },
    { src: photo('4th_meet', '22.27.00-2'), alt: 'Swati smiling with her chin resting on her hand at the restaurant' },
    { src: photo('4th_meet', '22.27.00-3'), alt: 'The two of us smiling with my arm around Swati at the restaurant' }
  ] },
  blooper: { title: 'The sweetest outtake · Still a keeper', photos: [
    { src: photo('awkward_butsweet_pic', '22.27.00'), alt: 'Our spontaneous, slightly awkward selfie together on a tree-lined street' }
  ] }
};
const albumDialog = document.querySelector('#album-dialog');
let currentAlbum, currentPhoto = 0;
function renderPhoto() {
  const entry = currentAlbum.photos[currentPhoto];
  const img = document.querySelector('#album-image');
  img.src = entry.src;
  img.alt = entry.alt;
  document.querySelector('#album-image-wrap').classList.toggle('sideways', !!entry.sideways);
  document.querySelector('#album-title').textContent = currentAlbum.title;
  document.querySelector('#album-caption').textContent = `${currentPhoto + 1} / ${currentAlbum.photos.length}`;
  document.querySelector('#prev-photo').disabled = currentPhoto === 0;
  document.querySelector('#next-photo').disabled = currentPhoto === currentAlbum.photos.length - 1;
}
document.querySelectorAll('[data-album]').forEach(button => button.addEventListener('click', () => {
  currentAlbum = albums[button.dataset.album]; currentPhoto = 0; renderPhoto(); albumDialog.showModal();
}));
function stepPhoto(direction) { currentPhoto = Math.max(0, Math.min(currentAlbum.photos.length - 1, currentPhoto + direction)); renderPhoto(); }
document.querySelector('#prev-photo').addEventListener('click', () => stepPhoto(-1));
document.querySelector('#next-photo').addEventListener('click', () => stepPhoto(1));
albumDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(event.key === 'ArrowLeft' ? -1 : 1); }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
const letter = document.querySelector('#letter-dialog');
document.querySelector('#open-letter').addEventListener('click', () => letter.showModal());
document.querySelector('#reward-button').addEventListener('click', () => document.querySelector('#reward-dialog').showModal());
document.querySelector('#read-letter').addEventListener('click', () => { document.querySelector('#reward-dialog').close(); letter.showModal(); });

const gamePhotos = [albums.first.photos[0], albums.third.photos[0], albums.fourth.photos[0], { src: photo('solo_swati', '22.08.15'), alt: 'Swati making a birthday wish' }];
const board = document.querySelector('#game-board');
let selection = [], matched = 0, busy = false, flipTimeout;
function startGame() {
  clearTimeout(flipTimeout); selection = []; matched = 0; busy = false;
  document.querySelector('#game-win').hidden = true;
  document.querySelector('#confetti').replaceChildren();
  updateProgress();
  const cards = gamePhotos.flatMap((image, pair) => [{ image, pair }, { image, pair }]);
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  board.replaceChildren();
  cards.forEach(({ image, pair }, index) => {
    const button = document.createElement('button');
    button.className = 'game-card'; button.dataset.pair = pair; button.dataset.position = index + 1;
    button.setAttribute('aria-label', `Reveal card ${index + 1}`); button.setAttribute('aria-pressed', 'false');
    const inner = document.createElement('span'); inner.className = 'card-inner'; inner.setAttribute('aria-hidden', 'true');
    const back = document.createElement('span'); back.className = 'card-back'; back.textContent = '♡';
    const front = document.createElement('span'); front.className = 'card-front';
    const img = document.createElement('img'); img.src = image.src; img.alt = ''; img.loading = 'lazy';
    front.append(img); inner.append(back, front); button.append(inner);
    button.addEventListener('click', () => flipCard(button, image.alt)); board.append(button);
  });
}
function updateProgress(message = '') {
  document.querySelector('#progress-hearts').textContent = Array.from({ length: 4 }, (_, i) => i < matched ? '♥' : '♡').join(' ');
  document.querySelector('#game-status').textContent = `${matched} of 4 pairs found${message ? ' · ' + message : ''}`;
}
function flipCard(button, description) {
  if (busy || button.classList.contains('flipped') || button.classList.contains('matched')) return;
  button.classList.add('flipped'); button.setAttribute('aria-pressed', 'true'); button.setAttribute('aria-label', `Card ${button.dataset.position}: ${description}`);
  selection.push(button);
  if (selection.length !== 2) return;
  if (selection[0].dataset.pair === selection[1].dataset.pair) {
    selection.forEach(card => { card.classList.add('matched'); card.setAttribute('aria-disabled', 'true'); card.setAttribute('aria-label', `Matched: ${card.getAttribute('aria-label')}`); });
    selection = []; matched++; updateProgress(matched === 4 ? 'Your little note is ready!' : 'A lovely match!');
    if (matched === 4) { document.querySelector('#game-win').hidden = false; celebrate(); }
  } else {
    busy = true; updateProgress('Try another little memory');
    flipTimeout = setTimeout(() => {
      selection.forEach(card => { card.classList.remove('flipped'); card.setAttribute('aria-pressed', 'false'); card.setAttribute('aria-label', `Reveal card ${card.dataset.position}`); });
      selection = []; busy = false;
    }, 1100);
  }
}
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.querySelector('#confetti');
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement('span'); heart.className = 'confetti-heart'; heart.textContent = i % 2 ? '♡' : '♥';
    heart.style.left = `${Math.random() * 100}%`; heart.style.animationDelay = `${Math.random() * .8}s`; heart.style.fontSize = `${14 + Math.random() * 18}px`;
    heart.addEventListener('animationend', () => heart.remove()); container.append(heart);
  }
}
document.querySelector('#restart').addEventListener('click', startGame);
startGame();
