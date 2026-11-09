(function () {
  const music = window.weddingData?.design?.backgroundMusic;
  if (!music?.enabled || !music.audioUrl || !/\/envelope\/?$/.test(location.pathname)) return;

  const audio = new Audio(new URL(music.audioUrl.replace(/^\//, ''), document.baseURI).href);
  audio.loop = true;
  audio.preload = 'auto';

  let prompt;
  let starting = false;

  function removePrompt() {
    prompt?.remove();
    prompt = undefined;
  }

  function showPrompt() {
    if (prompt || !document.body) return;

    prompt = document.createElement('button');
    prompt.type = 'button';
    prompt.className = 'wedding-music-prompt';
    prompt.setAttribute('aria-label', 'Play wedding music');
    prompt.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg><span>Play music</span>';
    prompt.addEventListener('click', startPlayback);
    document.body.append(prompt);
  }

  function addPromptStyles() {
    if (document.getElementById('wedding-music-prompt-styles')) return;
    const style = document.createElement('style');
    style.id = 'wedding-music-prompt-styles';
    style.textContent = `
      .wedding-music-prompt{position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:2147483000;display:flex;align-items:center;gap:10px;padding:12px 18px;border:1px solid #89947b;border-radius:999px;background:#fffaf4;color:#3f493e;box-shadow:0 5px 22px #26302630;font:600 14px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:.02em;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
      .wedding-music-prompt:hover{transform:translateY(-2px);box-shadow:0 8px 26px #26302640}
      .wedding-music-prompt:focus-visible{outline:3px solid #687a5e;outline-offset:3px}
      .wedding-music-prompt svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      @media(prefers-reduced-motion:reduce){.wedding-music-prompt{transition:none}}
    `;
    document.head.append(style);
  }

  async function startPlayback() {
    if (starting) return;
    starting = true;
    if (prompt) {
      prompt.disabled = true;
      prompt.querySelector('span').textContent = 'Starting music…';
    }
    try {
      await audio.play();
      removePrompt();
    } catch (error) {
      console.warn('Wedding music playback was blocked; tap Play music to start it.', error);
      if (prompt) {
        prompt.disabled = false;
        prompt.querySelector('span').textContent = 'Play music';
      } else {
        showPrompt();
      }
    } finally {
      starting = false;
    }
  }

  audio.addEventListener('playing', removePrompt);

  addPromptStyles();
  startPlayback();
})();
