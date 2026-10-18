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

  // 7. Vue globale (Overview)
  function buildOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    slides.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentIndex ? 'current' : ''}`;
      card.innerHTML = `
        <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; margin-bottom: 0.25rem;">Slide ${idx + 1}</div>
        <div style="font-weight: 700; color: #FFF; font-size: 0.9rem;">${slide.getAttribute('data-title') || ''}</div>
      `;
      card.onclick = () => { goToSlide(idx); overviewModal.classList.remove('open'); };
      overviewGrid.appendChild(card);
    });
  }

  function toggleOverview() {
    buildOverview();
    if (overviewModal) overviewModal.classList.toggle('open');
  }

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
