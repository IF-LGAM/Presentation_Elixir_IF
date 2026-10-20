/**
 * Deck Engine - Overview Grid Manager
 * Sous-responsabilité : Génération des vignettes du slide deck, calcul de mise
 * à l'échelle miniature 16:9, barre de glissement rapide et ouverture de la modale.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Overview = (function () {
  function getElements() {
    return {
      overviewModal: document.getElementById('overviewModal'),
      overviewGrid: document.getElementById('overviewGrid'),
      slideCountBadge: document.getElementById('overviewSlideCountBadge'),
      slider: document.getElementById('overviewRangeSlider'),
      sliderVal: document.getElementById('overviewSliderVal')
    };
  }

  function scaleOverviewThumbs() {
    const { overviewGrid } = getElements();
    if (!overviewGrid) return;
    const wraps = overviewGrid.querySelectorAll('.overview-thumb-wrap');
    wraps.forEach(wrap => {
      const scaler = wrap.querySelector('.overview-thumb-scaler');
      if (scaler && wrap.clientWidth > 0) {
        const s = (wrap.clientWidth - 10) / 1240;
        scaler.style.transform = `scale(${s > 0 ? s : 0.2})`;
      }
    });
  }

  function buildOverview() {
    const { overviewGrid, slideCountBadge, slider, sliderVal } = getElements();
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentIndex = window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0;

    if (slideCountBadge) slideCountBadge.textContent = `${totalSlides} slides`;

    if (slider) {
      slider.max = totalSlides;
      slider.value = currentIndex + 1;
      if (sliderVal) sliderVal.textContent = `${currentIndex + 1} / ${totalSlides}`;

      slider.oninput = (e) => {
        const targetIdx = parseInt(e.target.value, 10) - 1;
        if (sliderVal) sliderVal.textContent = `${targetIdx + 1} / ${totalSlides}`;
        const targetCard = overviewGrid.children[targetIdx];
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      };
    }

    slides.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentIndex ? 'current' : ''}`;
      card.setAttribute('data-idx', idx);

      const title = slide.getAttribute('data-title') || `Slide ${idx + 1}`;
      const contentHtml = slide.querySelector('.slide-content')?.innerHTML || '';

      card.innerHTML = `
        <div class="overview-thumb-wrap">
          <div class="overview-thumb-scaler slide-content">
            ${contentHtml}
          </div>
        </div>
        <div class="overview-card-meta">
          <div class="overview-card-badge">Slide ${idx + 1}</div>
          <div class="overview-card-title" title="${title}">${title}</div>
        </div>
      `;

      card.onclick = () => {
        if (window.DeckEngine.Navigation) {
          window.DeckEngine.Navigation.goToSlide(idx);
        }
        const { overviewModal } = getElements();
        if (overviewModal) overviewModal.classList.remove('open');
      };

      overviewGrid.appendChild(card);
    });

    scaleOverviewThumbs();

    overviewGrid.onscroll = () => {
      if (!slider || !overviewGrid.children.length) return;
      const cardHeight = overviewGrid.children[0]?.offsetHeight || 180;
      const cardsPerRow = Math.max(1, Math.floor(overviewGrid.clientWidth / 260));
      const scrolledRows = Math.floor(overviewGrid.scrollTop / cardHeight);
      const estIdx = Math.min(totalSlides, Math.max(1, (scrolledRows * cardsPerRow) + 1));
      slider.value = estIdx;
      if (sliderVal) sliderVal.textContent = `${estIdx} / ${totalSlides}`;
    };
  }

  function toggleOverview() {
    buildOverview();
    const { overviewModal, overviewGrid } = getElements();
    if (overviewModal) {
      overviewModal.classList.toggle('open');
      if (overviewModal.classList.contains('open')) {
        setTimeout(() => {
          scaleOverviewThumbs();
          const currentIndex = window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0;
          const curCard = overviewGrid?.children[currentIndex];
          if (curCard) curCard.scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 50);
      }
    }
  }

  function init() {
    document.getElementById('overviewBtn')?.addEventListener('click', toggleOverview);
    document.getElementById('closeOverviewBtn')?.addEventListener('click', () => {
      const { overviewModal } = getElements();
      if (overviewModal) overviewModal.classList.remove('open');
    });

    window.addEventListener('resize', () => {
      const { overviewModal } = getElements();
      if (overviewModal && overviewModal.classList.contains('open')) {
        scaleOverviewThumbs();
      }
    });
  }

  return {
    init: init,
    build: buildOverview,
    scaleThumbs: scaleOverviewThumbs,
    toggle: toggleOverview
  };
})();
