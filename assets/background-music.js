(function () {
  const music = window.weddingData?.design?.backgroundMusic || {
    enabled: true,
    audioUrl: 'assets/wedding-nasheed.mp3',
    showMusicToggle: true
  };
  if (!music?.enabled || !music.audioUrl) return;

  const audioUrl = new URL(music.audioUrl.replace(/^\//, ''), document.baseURI).href;
  const audio = new Audio(audioUrl);
  audio.loop = true;
  // Load the 6.8 MB track only after the guest chooses to play it.
  audio.preload = 'none';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'background-music-toggle';
  toggle.setAttribute('aria-label', 'Pause background music');
  toggle.title = 'Pause background music';
  toggle.textContent = '♫';
  toggle.hidden = false;
  toggle.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:20001;width:48px;height:48px;border:1px solid #929b83;border-radius:50%;background:#fffaf5;color:#41483d;box-shadow:0 3px 16px #0002;font:24px Georgia,serif;cursor:pointer';
  document.body.append(toggle);

  const setPlayingState = playing => {
    const label = playing ? 'Pause background music' : 'Play background music';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
  };

  const startMusic = () => {
    toggle.hidden = false;
    audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  };

  function isEnvelopeOpen() {
    return ['#page-1', '#opened'].includes(location.hash);
  }

  window.addEventListener('hashchange', () => {
    if (isEnvelopeOpen() && music.showMusicToggle) toggle.hidden = false;
  });

  document.addEventListener('click', event => {
    const opener = event.target instanceof Element
      ? event.target.closest('a[href$="#page-1"], a[href$="#opened"]')
      : null;
    if (!opener || toggle.contains(event.target)) return;
    if (music.showMusicToggle) toggle.hidden = false;
    startMusic();
  }, true);

  if (music.showMusicToggle) {
    toggle.addEventListener('click', () => {
      if (audio.paused) startMusic();
      else {
        audio.pause();
        setPlayingState(false);
      }
    });
  } else {
    toggle.remove();
  }
})();
