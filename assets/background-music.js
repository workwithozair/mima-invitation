(function () {
  const music = window.weddingData?.design?.backgroundMusic;
  if (!music?.enabled || !music.audioUrl) return;

  const envelopePage = /\/envelope\/?$/.test(location.pathname);
  if (!envelopePage) {
    const rememberOpenGesture = event => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      const label = [link.textContent, link.getAttribute('aria-label')].filter(Boolean).join(' ').toLowerCase();
      if (link.hash === '#page-1' || label.includes('click to open')) {
        sessionStorage.setItem('playWeddingMusicOnEnvelope', '1');
      }
    };
    document.addEventListener('pointerdown', rememberOpenGesture, true);
    document.addEventListener('click', rememberOpenGesture, true);
    return;
  }

  if (sessionStorage.getItem('playWeddingMusicOnEnvelope') !== '1') return;
  sessionStorage.removeItem('playWeddingMusicOnEnvelope');

  const audio = new Audio(new URL(music.audioUrl.replace(/^\//, ''), document.baseURI).href);
  audio.loop = true;
  audio.preload = 'none';
  audio.play().catch(error => console.warn('Wedding music could not autoplay on this browser.', error));
})();
