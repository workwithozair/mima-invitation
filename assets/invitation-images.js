(() => {
  const configuredSlots = [
    {
      source: '794e1c87b58f7bbb61d4c388839a75cc.jpg',
      setting: 'envelopeCover',
      alt: 'Masoom and Miza',
    },
    {
      source: '5094924cdd06d8aa52006203596976f1.jpg',
      setting: 'hand',
      alt: 'A close-up wedding moment',
    },
    {
      source: '0b8a328dddb090477a0a243bc32980ec.jpg',
      setting: 'engagement',
      alt: 'A wedding portrait',
    },
    {
      source: '5f026a4f590d69fd3aec34edc7ea25e.jpg',
      setting: 'couple',
      alt: 'Masoom and Miza together',
    },
    {
      source: '4268230ee56c19cdcf94179a269e4006.png',
      setting: 'location',
      alt: 'Wedding venue location',
    },
  ];

  Promise.resolve(window.weddingData || fetch(new URL('data.json', document.baseURI), { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Invitation data request failed: ${response.status}`);
      return response.json();
    }))
    .then(data => {
      const images = data.images || {};
      const updateImages = () => {
        for (const slot of configuredSlots) {
          const path = images[slot.setting];
          if (!path || path.startsWith('[')) continue;

          const candidates = [...document.querySelectorAll('img')]
            .filter(candidate => !candidate.dataset.configuredImage);
          let image = candidates.find(candidate =>
            (candidate.currentSrc.includes(slot.source) || candidate.src.includes(slot.source))
          );

          if (!image) continue;

          image.dataset.configuredImage = slot.setting;
          image.alt = slot.alt;
          image.removeAttribute('srcset');
          image.src = new URL(path.replace(/^\//, ''), document.baseURI).href;
          if (slot.setting === 'location') {
            const mapUrl = data.wedding?.ceremony?.mapsUrl || data.wedding?.mapsUrl;
            image.style.cursor = 'pointer';
            image.setAttribute('role', 'link');
            image.setAttribute('tabindex', '0');
            image.setAttribute('aria-label', `Open map for ${data.wedding?.ceremony?.venue || 'the wedding venue'}`);
            const openMap = event => {
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();
              if (mapUrl) window.open(mapUrl, '_blank', 'noopener,noreferrer');
            };
            image.addEventListener('click', openMap, true);
            image.addEventListener('keydown', event => {
              if (event.key === 'Enter' || event.key === ' ') openMap(event);
            });
          }
        }
      };

      const observer = new MutationObserver(updateImages);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src'],
      });
      updateImages();
    })
    .catch(error => console.error('Could not load configured invitation images', error));
})();
