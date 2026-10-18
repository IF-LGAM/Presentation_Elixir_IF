/**
 * Deck Engine Core Navigation & Keyboard Controls
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialisation des variables de navigation
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Éléments du Header
  const currentSlideNumEl = document.getElementById('currentSlideNum');
  const totalSlidesNumEl = document.getElementById('totalSlidesNum');
  const progressFill = document.getElementById('progressFill');
  const headerSlideTitle = document.getElementById('headerSlideTitle');

  // Modales & Panels
  const notesDrawer = document.getElementById('notesDrawer');
  const notesContent = document.getElementById('notesContent');
  const notesSlideIndex = document.getElementById('notesSlideIndex');
  const notesTotalSlides = document.getElementById('notesTotalSlides');
  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const shortcutsModal = document.getElementById('shortcutsModal');

  if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;
  if (notesTotalSlides) notesTotalSlides.textContent = totalSlides;

  // 2. Synchronisation temps réel (BroadcastChannel + Fallback localStorage)
  let deckChannel = null;
  try {
    deckChannel = new BroadcastChannel('deck_channel_sync');
    deckChannel.onmessage = (event) => {
      if (event.data && typeof event.data.slideIndex === 'number') {
        goToSlide(event.data.slideIndex, false);
      }
    };
  } catch (err) {
    console.warn('BroadcastChannel non supporté, fallback storage actif');
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'deck_sync_slide' && event.newValue !== null) {
      const idx = parseInt(event.newValue, 10);
      if (!isNaN(idx)) goToSlide(idx, false);
    }
  });

  function broadcastSlide(index) {
    if (deckChannel) deckChannel.postMessage({ slideIndex: index });
    localStorage.setItem('deck_sync_slide', index.toString());
  }

  // 2.1 Adaptation automatique du thème Clair/Foncé en fonction de la slide
  function updateAutoTheme(slide) {
    if (!slide) return;
    const container = document.querySelector('.deck-container') || document.body;

    // 1. Détection prioritaire par attributs ou classes explicites
    let isLight = false;
    const explicitTheme = slide.getAttribute('data-theme') || document.body.getAttribute('data-theme');
    if (explicitTheme === 'light' || slide.classList.contains('light') || slide.classList.contains('theme-light')) {
      isLight = true;
    } else if (explicitTheme === 'dark' || slide.classList.contains('dark') || slide.classList.contains('theme-dark')) {
      isLight = false;
    } else {
      // 2. Détection intelligente transparente par calcul de luminance du fond
      const targets = [slide, slide.querySelector('.slide-content'), slide.querySelector('.x-card')].filter(Boolean);
      for (const el of targets) {
        const bg = window.getComputedStyle(el).backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
          const r = parseInt(m[1], 10);
          const g = parseInt(m[2], 10);
          const b = parseInt(m[3], 10);
          const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
          if (a > 0.1 && (r > 0 || g > 0 || b > 0 || bg.includes('rgb'))) {
            const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            isLight = lum > 0.55;
            break;
          }
        }
      }
    }

    if (isLight) {
      container.classList.add('theme-light');
      container.classList.remove('theme-dark');
    } else {
      container.classList.add('theme-dark');
      container.classList.remove('theme-light');
    }

    // Propagation automatique d'une couleur d'accent propre à la slide si présente
    const customAccent = slide.getAttribute('data-accent') || slide.style.getPropertyValue('--accent-primary');
    if (customAccent) {
      container.style.setProperty('--accent-primary', customAccent);
      const customHover = slide.getAttribute('data-accent-hover') || customAccent;
      container.style.setProperty('--accent-hover', customHover);
    } else {
      container.style.removeProperty('--accent-primary');
      container.style.removeProperty('--accent-hover');
    }
  }

  // 3. Cœur de la navigation
  function goToSlide(index, shouldBroadcast = true) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev-slide');
      if (i < index) slide.classList.add('prev-slide');
    });

    currentIndex = index;
    const activeSlide = slides[currentIndex];
    if (activeSlide) activeSlide.classList.add('active');

    // Détection et adaptation automatique du thème Clair/Foncé en fonction de la slide
    updateAutoTheme(activeSlide);

    // Mise à jour de l'interface
    if (currentSlideNumEl) currentSlideNumEl.textContent = currentIndex + 1;
    if (progressFill) progressFill.style.width = `${((currentIndex + 1) / totalSlides) * 100}%`;
    const title = activeSlide ? (activeSlide.getAttribute('data-title') || `Slide ${currentIndex + 1}`) : `Slide ${currentIndex + 1}`;
    if (headerSlideTitle) headerSlideTitle.textContent = title;

    // Mise à jour des notes d'orateur
    if (notesSlideIndex) notesSlideIndex.textContent = currentIndex + 1;
    if (notesContent && activeSlide) {
      notesContent.textContent = activeSlide.getAttribute('data-notes') || 'Aucune note spécifique rédigée pour cette slide.';
    }

    history.replaceState(null, null, `#slide-${currentIndex + 1}`);

    // Notification des fenêtres synchronisées
    if (shouldBroadcast) broadcastSlide(currentIndex);

    // Mise à jour de la grille d'overview
    document.querySelectorAll('.overview-card').forEach((card, idx) => {
      card.classList.toggle('current', idx === currentIndex);
    });
  }

  function nextSlide() { if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1); }
  function prevSlide() { if (currentIndex > 0) goToSlide(currentIndex - 1); }

  // Expose global helpers
  window.getCurrentSlideIndex = () => currentIndex;
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // 4. Initialisation via Hash URL
  if (window.location.hash.startsWith('#slide-')) {
    const num = parseInt(window.location.hash.replace('#slide-', ''), 10);
    if (!isNaN(num) && num >= 1 && num <= totalSlides) goToSlide(num - 1, false);
    else goToSlide(0, false);
  } else if (window.location.hash === '#overview') {
    goToSlide(0, false);
    setTimeout(toggleOverview, 100);
  } else {
    goToSlide(0, false);
  }

  // 5. Gestion des raccourcis clavier
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault(); nextSlide(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prevSlide(); break;
      case 'Home':
        e.preventDefault(); goToSlide(0); break;
      case 'End':
        e.preventDefault(); goToSlide(totalSlides - 1); break;
      case 'p':
      case 'P':
        e.preventDefault(); window.print(); break;
      case 'f':
      case 'F':
        toggleFullscreen(); break;
      case 's':
      case 'S':
        if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
        else if (window.openSpeakerWindow) window.openSpeakerWindow();
        break;
      case 'n':
      case 'N':
        if (notesDrawer) notesDrawer.classList.toggle('open'); break;
      case 'o':
      case 'O':
        toggleOverview(); break;
      case '?':
        if (shortcutsModal) shortcutsModal.classList.toggle('open'); break;
      case 'Escape':
        if (overviewModal) overviewModal.classList.remove('open');
        if (shortcutsModal) shortcutsModal.classList.remove('open');
        if (notesDrawer) notesDrawer.classList.remove('open');
        break;
    }
  });

  // 6. Plein écran
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  // 7. Vue globale (Overview) avec prévisualisation 16:9 et barre de défilement
  function buildOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    const slideCountBadge = document.getElementById('overviewSlideCountBadge');
    if (slideCountBadge) slideCountBadge.textContent = `${totalSlides} slides`;

    const slider = document.getElementById('overviewRangeSlider');
    const sliderVal = document.getElementById('overviewSliderVal');
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
        goToSlide(idx);
        overviewModal.classList.remove('open');
      };

      overviewGrid.appendChild(card);
    });

    scaleOverviewThumbs();

    // Mettre à jour la barre de glissement au scroll de la grille
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

  function scaleOverviewThumbs() {
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

  function toggleOverview() {
    buildOverview();
    if (overviewModal) {
      overviewModal.classList.toggle('open');
      if (overviewModal.classList.contains('open')) {
        setTimeout(() => {
          scaleOverviewThumbs();
          const curCard = overviewGrid.children[currentIndex];
          if (curCard) curCard.scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 50);
      }
    }
  }

  window.addEventListener('resize', () => {
    if (overviewModal && overviewModal.classList.contains('open')) {
      scaleOverviewThumbs();
    }
  });
  // 8. Boutons d'interface
  document.getElementById('prevBtn')?.addEventListener('click', prevSlide);
  document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
  document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
  document.getElementById('pdfExportBtn')?.addEventListener('click', () => window.print());
  document.getElementById('speakerNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.toggle('open'));
  document.getElementById('closeNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.remove('open'));
  document.getElementById('overviewBtn')?.addEventListener('click', toggleOverview);
  document.getElementById('closeOverviewBtn')?.addEventListener('click', () => overviewModal?.classList.remove('open'));
  document.getElementById('shortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.toggle('open'));
  document.getElementById('closeShortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.remove('open'));
});
