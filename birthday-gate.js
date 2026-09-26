(() => {
  // Midnight in India, independent of the visitor's time zone.
  const opensAt = Date.parse('2026-09-27T00:00:00+05:30');
  const gate = document.querySelector('#birthday-gate');
  const units = ['days', 'hours', 'minutes', 'seconds'].map(unit => document.querySelector(`#countdown-${unit}`));
  let timer, unlocked = false, waited = false;

  function updateCountdown() {
    if (unlocked) return;
    const remaining = opensAt - Date.now();
    if (remaining <= 0) {
      unlocked = true;
      clearInterval(timer);
      gate.hidden = true;
      document.documentElement.classList.remove('birthday-locked');
      // Initialise the albums and games only once the birthday page is visible.
      for (const source of ['app.js', 'catch.js']) {
        const script = document.createElement('script');
        script.src = source; script.async = false; document.head.append(script);
      }
      if (waited) {
        const heading = document.querySelector('#hero-title');
        heading.tabIndex = -1; heading.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      return;
    }
    waited = true;
    const total = Math.ceil(remaining / 1000);
    const values = [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60];
    units.forEach((element, index) => { element.textContent = String(values[index]).padStart(2, '0'); });
  }

  updateCountdown();
  if (!unlocked) timer = setInterval(updateCountdown, 250);
  document.addEventListener('visibilitychange', updateCountdown);
  window.addEventListener('pageshow', updateCountdown);
})();
