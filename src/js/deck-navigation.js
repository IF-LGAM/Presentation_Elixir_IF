/**
 * Deck Engine - Core Navigation & Keyboard Controls
 * Sous-responsabilité : Moteur d'avancement des slides, raccourcis clavier,
 * synchronisation inter-fenêtres (BroadcastChannel & storage) et plein écran.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Navigation = (function () {
  let slides = [];
  let totalSlides = 0;
  let currentIndex = 0;
  let deckChannel = null;

  function initChannel() {
    try {
      deckChannel = new BroadcastChannel('deck_channel_sync');
      deckChannel.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === 'accentColor' && event.data.color) {
          if (window.DeckEngine.Palette) window.DeckEngine.Palette.setAccentColor(event.data.color, false);
        }
        if (typeof event.data.slideIndex === 'number') {
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
  }

  function broadcastMessage(msg) {
    if (deckChannel) {
      try { deckChannel.postMessage(msg); } catch (e) { }
    }
  }

  function broadcastSlide(index) {
    const isLight = document.querySelector('.deck-container')?.classList.contains('theme-light') || document.body.classList.contains('theme-light');
    broadcastMessage({ slideIndex: index, theme: isLight ? 'light' : 'dark' });
    localStorage.setItem('deck_sync_slide', index.toString());
  }

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

    // Détection et adaptation automatique du thème Clair/Foncé
    if (window.DeckEngine.Theme) {
      window.DeckEngine.Theme.updateAutoTheme(activeSlide);
    }

    // Mise à jour de l'interface du Header
    const currentSlideNumEl = document.getElementById('currentSlideNum');
    const progressFill = document.getElementById('progressFill');
    const headerSlideTitle = document.getElementById('headerSlideTitle');

    if (currentSlideNumEl) currentSlideNumEl.textContent = currentIndex + 1;
    if (progressFill) progressFill.style.width = `${((currentIndex + 1) / totalSlides) * 100}%`;
    const title = activeSlide ? (activeSlide.getAttribute('data-title') || `Slide ${currentIndex + 1}`) : `Slide ${currentIndex + 1}`;
    if (headerSlideTitle) headerSlideTitle.textContent = title;

    // Mise à jour des notes d'orateur (Drawer)
    const notesSlideIndex = document.getElementById('notesSlideIndex');
    const notesContent = document.getElementById('notesContent');
    if (notesSlideIndex) notesSlideIndex.textContent = currentIndex + 1;
    if (notesContent && activeSlide) {
      notesContent.textContent = activeSlide.getAttribute('data-notes') || 'Aucune note spécifique rédigée pour cette slide.';
    }

    history.replaceState(null, null, `#slide-${currentIndex + 1}`);

    // Notification des fenêtres synchronisées
    if (shouldBroadcast) broadcastSlide(currentIndex);

    // Mise à jour de la grille d'overview si ouverte
    document.querySelectorAll('.overview-card').forEach((card, idx) => {
      card.classList.toggle('current', idx === currentIndex);
    });
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  function toggleFullscreen() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFs) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => { });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const notesDrawer = document.getElementById('notesDrawer');
      const overviewModal = document.getElementById('overviewModal');
      const shortcutsModal = document.getElementById('shortcutsModal');

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
        case 't':
        case 'T':
          if (window.DeckEngine.Theme) window.DeckEngine.Theme.toggleTheme(); break;
        case 'c':
        case 'C':
          e.preventDefault();
          if (window.DeckEngine.Palette) window.DeckEngine.Palette.cycleAccentColor(); break;
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
          if (window.DeckEngine.Overview) window.DeckEngine.Overview.toggle(); break;
        case '?':
          if (shortcutsModal) shortcutsModal.classList.toggle('open'); break;
        case 'Escape':
          if (overviewModal) overviewModal.classList.remove('open');
          if (shortcutsModal) shortcutsModal.classList.remove('open');
          if (notesDrawer) notesDrawer.classList.remove('open');
          break;
      }
    });
  }

  function isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.body.classList.contains('is-fullscreen'));
  }

  function initMouse() {
    // 1. Clic gauche pour avancer en mode plein écran (type télécommande/clicker)
    window.addEventListener('click', (e) => {
      if (!isFullscreenActive()) return;

      // Si une modale ou un panneau latéral est ouvert, ne pas changer de slide
      const overviewModal = document.getElementById('overviewModal');
      const shortcutsModal = document.getElementById('shortcutsModal');
      const notesDrawer = document.getElementById('notesDrawer');
      if (overviewModal?.classList.contains('open') || 
          shortcutsModal?.classList.contains('open') || 
          notesDrawer?.classList.contains('open')) {
        return;
      }

      // Si l'utilisateur est en train de sélectionner du texte, ne pas changer de slide
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText && selectedText.length > 0) return;

      // Ignorer si le clic cible un élément interactif (liens, boutons, quiz, inputs)
      const interactive = e.target.closest('a, button, input, textarea, select, .quiz-opt-btn, .ctrl-btn, .palette-dot, [role="button"], .repo-link, .btn-action, .link-card');
      if (interactive) return;

      // Clic gauche principal en plein écran -> slide suivante
      if (e.button === 0) {
        nextSlide();
      }
    });

    // 2. Molette de la souris / Trackpad avec debounce en mode plein écran
    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
      if (!isFullscreenActive()) return;

      const overviewModal = document.getElementById('overviewModal');
      const notesDrawer = document.getElementById('notesDrawer');
      if (overviewModal?.classList.contains('open') || notesDrawer?.classList.contains('open')) {
        return;
      }

      const now = Date.now();
      if (now - lastWheelTime < 450) return;

      if (Math.abs(e.deltaY) > 35) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
  }

  function init() {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    const totalSlidesNumEl = document.getElementById('totalSlidesNum');
    const notesTotalSlides = document.getElementById('notesTotalSlides');
    if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;
    if (notesTotalSlides) notesTotalSlides.textContent = totalSlides;

    initChannel();
    initKeyboard();
    initMouse();

    // Boutons de navigation directe
    document.getElementById('prevBtn')?.addEventListener('click', prevSlide);
    document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
    document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);

    // Synchronisation de l'état plein écran
    const syncFullscreenState = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      document.documentElement.classList.toggle('is-fullscreen', isFs);
      document.body.classList.toggle('is-fullscreen', isFs);
      const container = document.querySelector('.deck-container');
      if (container) {
        container.classList.toggle('is-fullscreen', isFs);
        container.setAttribute('data-fullscreen', isFs ? 'true' : 'false');
      }
    };
    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('webkitfullscreenchange', syncFullscreenState);

    // Initialisation via Hash URL
    if (window.location.hash.startsWith('#slide-')) {
      const num = parseInt(window.location.hash.replace('#slide-', ''), 10);
      if (!isNaN(num) && num >= 1 && num <= totalSlides) goToSlide(num - 1, false);
      else goToSlide(0, false);
    } else if (window.location.hash === '#overview') {
      goToSlide(0, false);
      setTimeout(() => {
        if (window.DeckEngine.Overview) window.DeckEngine.Overview.toggle();
      }, 100);
    } else {
      goToSlide(0, false);
    }
  }

  return {
    init: init,
    goToSlide: goToSlide,
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    getCurrentIndex: () => currentIndex,
    getTotalSlides: () => totalSlides,
    broadcastMessage: broadcastMessage,
    toggleFullscreen: toggleFullscreen
  };
})();

// Rétrocompatibilité globale
window.getCurrentSlideIndex = () => (window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0);
window.goToSlide = (idx, broadcast) => window.DeckEngine.Navigation && window.DeckEngine.Navigation.goToSlide(idx, broadcast);
window.nextSlide = () => window.DeckEngine.Navigation && window.DeckEngine.Navigation.nextSlide();
window.prevSlide = () => window.DeckEngine.Navigation && window.DeckEngine.Navigation.prevSlide();
