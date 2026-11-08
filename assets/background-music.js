(function () {
  const music = window.weddingData?.design?.backgroundMusic || {
    enabled: true,
    audioUrl: 'assets/wedding-nashid.mp3',
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
  toggle.setAttribute('aria-label', 'Play background music');
  toggle.title = 'Play background music';
  toggle.innerHTML = '';
  toggle.hidden = false;
  toggle.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:20001;width:48px;height:48px;border:1px solid #929b83;border-radius:50%;background:#fffaf5;color:#41483d;box-shadow:0 3px 16px #0002;display:grid;place-items:center;cursor:pointer;padding:0';
  toggle.setAttribute('aria-pressed', 'false');
  document.body.append(toggle);

  const setPlayingState = playing => {
    const label = playing ? 'Pause background music' : 'Play background music';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg>';
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

  const onOpenGesture = event => {
    const opener = event.target instanceof Element
      ? event.target.closest('a[href$="#page-1"], a[href$="#opened"]')
      : null;
    if (!opener || toggle.contains(event.target)) return;
    if (music.showMusicToggle) toggle.hidden = false;
    startMusic();
  };
  document.addEventListener('pointerdown', onOpenGesture, true);
  document.addEventListener('click', onOpenGesture, true);

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
