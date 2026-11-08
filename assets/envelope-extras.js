(function () {
  const config = window.weddingData || {};
  const mapUrl = config.wedding?.ceremony?.mapsUrl || config.wedding?.mapsUrl;
  let mapLink;

  function update() {
    const labels = [...document.querySelectorAll('.a_GcMg')];
    const locationLabel = labels
      .filter(node => node.textContent.trim().toLowerCase() === 'location')
      .map(node => ({ node, rect: node.getBoundingClientRect() }))
      .filter(item => item.rect.width > 0 && item.rect.height > 0 && item.rect.bottom > 0 && item.rect.top < innerHeight)
      .sort((a, b) => Math.abs(a.rect.top - innerHeight * .88) - Math.abs(b.rect.top - innerHeight * .88))[0]?.node;
    if (locationLabel && mapUrl) {
      document.querySelectorAll('.sage-location-map-hit-area-legacy').forEach(node => node.remove());
      if (!mapLink) {
        mapLink = document.createElement('button');
        mapLink.type = 'button';
        mapLink.className = 'sage-location-map-hit-area';
        mapLink.setAttribute('aria-label', `Open map for ${config.wedding?.ceremony?.venue || 'the wedding venue'}`);
        mapLink.style.cssText = 'position:fixed;z-index:20050;display:block;background:transparent;border:0;padding:0;cursor:pointer';
        mapLink.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          window.open(mapUrl, '_blank', 'noopener,noreferrer');
        });
        document.body.append(mapLink);
      }
      const rect = locationLabel.getBoundingClientRect();
      const scale = Math.max(.7, Math.min(1.5, window.innerWidth / 524));
      mapLink.style.left = `${rect.left - 20 * scale}px`;
      mapLink.style.top = `${rect.top - 220 * scale}px`;
      mapLink.style.width = `${Math.max(132 * scale, rect.width + 48 * scale)}px`;
      mapLink.style.height = `${rect.height + 228 * scale}px`;
      mapLink.style.display = rect.width && rect.height ? 'block' : 'none';
    }

    const contactLines = [...document.querySelectorAll('p')].filter(node => {
      const text = node.textContent.trim();
      return /for any questions, please contact us at:/i.test(text) || /miza:.*019.*masoom:.*017/i.test(text);
    });
    const quotes = [
      '“And We created you in pairs.” — Qur’an 78:8',
      '“He placed between you affection and mercy.” — Qur’an 30:21'
    ];
    contactLines.slice(0, 2).forEach((line, index) => {
      line.textContent = quotes[index];
      line.style.cssText += ';text-align:center;white-space:normal;max-width:90%;margin-left:auto;margin-right:auto;line-height:1.5';
    });
  }

  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  update();
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, true);
})();
