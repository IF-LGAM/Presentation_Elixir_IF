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

  let currentFragmentStep = -1; // -1 = aucun fragment révélé

  function getFragmentSteps(slide) {
    if (!slide) return [];
    const frags = Array.from(slide.querySelectorAll('.fragment'));
    if (frags.length === 0) return [];

    const hasIndices = frags.some(f => f.hasAttribute('data-fragment-index'));
    if (hasIndices) {
      const groups = {};
      frags.forEach(f => {
        const idx = f.hasAttribute('data-fragment-index') ? parseInt(f.getAttribute('data-fragment-index'), 10) : 999;
        if (!groups[idx]) groups[idx] = [];
        groups[idx].push(f);
      });
      return Object.keys(groups).sort((a, b) => Number(a) - Number(b)).map(k => groups[k]);
    } else {
      return frags.map(f => [f]);
    }
  }

  function updateFragmentClasses(steps, activeStepIndex) {
    steps.forEach((step, idx) => {
      const isVisible = idx <= activeStepIndex;
      const isCurrent = idx === activeStepIndex;
      step.forEach(el => {
        el.classList.toggle('visible', isVisible);
        el.classList.toggle('current-fragment', isCurrent);
      });
    });
  }

  function broadcastFragmentStep(slideIdx, stepIdx) {
    broadcastMessage({ type: 'fragmentStep', slideIndex: slideIdx, fragmentStep: stepIdx });
    try {
      localStorage.setItem('deck_sync_fragment', JSON.stringify({ slideIndex: slideIdx, fragmentStep: stepIdx, timestamp: Date.now() }));
    } catch (e) {}
  }

  function broadcastBlankState(mode) {
    try {
      if (deckChannel) deckChannel.postMessage({ type: 'blankState', mode: mode });
      localStorage.setItem('deck_sync_blank_state', JSON.stringify({ mode: mode, timestamp: Date.now() }));
    } catch (e) {}
  }

  let lastActionTime = 0;
  let lastActionKey = '';

  function handleRemoteAction(action) {
    if (!action) return;
    const now = Date.now();
    // Dé-doublonnage : évite d'exécuter 2 fois l'action si BroadcastChannel et storage se déclenchent simultanément
    if (action === lastActionKey && (now - lastActionTime) < 150) {
      return;
    }
    lastActionTime = now;
    lastActionKey = action;

    if (action === 'next') next(false);
    else if (action === 'prev') prev(false);
    else if (action === 'nextDirect') next(true);
    else if (action === 'prevDirect') prev(true);
    else if (action === 'blackout') {
      if (window.DeckEngine.Blank) window.DeckEngine.Blank.toggle('black', false);
    }
    else if (action === 'whiteout') {
      if (window.DeckEngine.Blank) window.DeckEngine.Blank.toggle('white', false);
    }
    else if (action === 'unblank') {
      if (window.DeckEngine.Blank) window.DeckEngine.Blank.deactivate(false);
    }
  }

  function initChannel() {
    try {
      deckChannel = new BroadcastChannel('deck_channel_sync');
      deckChannel.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === 'accentColor' && event.data.color) {
          if (window.DeckEngine.Palette) window.DeckEngine.Palette.setAccentColor(event.data.color, false);
        }
        if (typeof event.data.theme === 'string') {
          if (window.DeckEngine.Theme && typeof window.DeckEngine.Theme.applyTheme === 'function') {
            window.DeckEngine.Theme.applyTheme(event.data.theme, false);
          }
        }
        if (event.data.type === 'action') {
          handleRemoteAction(event.data.action);
        }
        if (event.data.type === 'fragmentStep' && event.data.slideIndex === currentIndex) {
          const steps = getFragmentSteps(slides[currentIndex]);
          currentFragmentStep = event.data.fragmentStep;
          updateFragmentClasses(steps, currentFragmentStep);
        }
        if (event.data.type === 'blank') {
          if (event.data.mode === 'black') window.DeckEngine.Blank?.activate('black', false);
          else if (event.data.mode === 'white') window.DeckEngine.Blank?.activate('white', false);
          else window.DeckEngine.Blank?.deactivate(false);
        }
        if (typeof event.data.slideIndex === 'number' && event.data.type !== 'fragmentStep') {
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
      if (event.key === 'deck_sync_theme' && event.newValue !== null) {
        if (window.DeckEngine.Theme && typeof window.DeckEngine.Theme.applyTheme === 'function') {
          window.DeckEngine.Theme.applyTheme(event.newValue, false);
        }
      }
      if (event.key === 'deck_sync_blank_action' && event.newValue !== null) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.mode === 'black') window.DeckEngine.Blank?.activate('black', false);
          else if (data.mode === 'white') window.DeckEngine.Blank?.activate('white', false);
          else window.DeckEngine.Blank?.deactivate(false);
        } catch (e) {}
      }
      if (event.key === 'deck_sync_fragment' && event.newValue !== null) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.slideIndex === currentIndex) {
            const steps = getFragmentSteps(slides[currentIndex]);
            currentFragmentStep = data.fragmentStep;
            updateFragmentClasses(steps, currentFragmentStep);
          }
        } catch (e) {}
      }
      if (event.key === 'deck_sync_action' && event.newValue !== null) {
        try {
          const data = JSON.parse(event.newValue);
          handleRemoteAction(data.action);
        } catch (e) {}
      }
    });
  }

  function broadcastMessage(msg) {
    if (deckChannel) {
      try { deckChannel.postMessage(msg); } catch (e) { }
    }
  }

  function broadcastSlide(index) {
    const curTheme = (window.DeckEngine?.Theme && typeof window.DeckEngine.Theme.getCurrentThemeId === 'function')
      ? window.DeckEngine.Theme.getCurrentThemeId()
      : (document.querySelector('.deck-container')?.getAttribute('data-theme') || 'dark');
    broadcastMessage({ slideIndex: index, theme: curTheme, fragmentStep: currentFragmentStep });
    localStorage.setItem('deck_sync_slide', index.toString());
  }

  function goToSlide(index, shouldBroadcast = true, direction = 'forward') {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev-slide');
      if (i < index) slide.classList.add('prev-slide');
    });

    currentIndex = index;
    const activeSlide = slides[currentIndex];
    if (activeSlide) activeSlide.classList.add('active');

    // Gestion de l'état des fragments sur la slide active
    const steps = getFragmentSteps(activeSlide);
    if (direction === 'backward') {
      currentFragmentStep = steps.length - 1; // Révéler tous les fragments en marche arrière
    } else {
      currentFragmentStep = -1; // Aucun fragment révélé à l'arrivée
    }
    updateFragmentClasses(steps, currentFragmentStep);

    // Détection et adaptation automatique du thème Clair/Foncé
    if (window.DeckEngine.Theme) {
      window.DeckEngine.Theme.updateAutoTheme(activeSlide);
    }

    // Auto-ajustement d'échelle dynamique pour garantir zéro débordement
    if (window.DeckEngine.Fit && activeSlide) {
      window.DeckEngine.Fit.fitSlide(activeSlide);
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

  function next(skipFragments = false) {
    const activeSlide = slides[currentIndex];
    const steps = getFragmentSteps(activeSlide);

    if (!skipFragments && steps.length > 0 && currentFragmentStep < steps.length - 1) {
      currentFragmentStep++;
      updateFragmentClasses(steps, currentFragmentStep);
      broadcastFragmentStep(currentIndex, currentFragmentStep);
      return;
    }

    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1, true, 'forward');
    }
  }

  function prev(skipFragments = false) {
    const activeSlide = slides[currentIndex];
    const steps = getFragmentSteps(activeSlide);

    if (!skipFragments && steps.length > 0 && currentFragmentStep >= 0) {
      currentFragmentStep--;
      updateFragmentClasses(steps, currentFragmentStep);
      broadcastFragmentStep(currentIndex, currentFragmentStep);
      return;
    }

    if (currentIndex > 0) {
      goToSlide(currentIndex - 1, true, 'backward');
    }
  }

  function nextSlide() {
    next(false);
  }

  function prevSlide() {
    prev(false);
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
      // Raccourci global Palette de Recherche (Cmd+K ou Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (window.DeckEngine.Search) window.DeckEngine.Search.toggle();
        return;
      }

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const notesDrawer = document.getElementById('notesDrawer');
      const overviewModal = document.getElementById('overviewModal');
      const shortcutsModal = document.getElementById('shortcutsModal');

      // Si l'écran est masqué (Blackout / Whiteout)
      if (window.DeckEngine.Blank && window.DeckEngine.Blank.isActive()) {
        if (e.key === 'Escape') {
          e.preventDefault();
          window.DeckEngine.Blank.deactivate();
          return;
        }
        if (e.key === 'b' || e.key === 'B' || e.key === '.') {
          e.preventDefault();
          window.DeckEngine.Blank.toggle('black');
          return;
        }
        if (e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          window.DeckEngine.Blank.toggle('white');
          return;
        }
        // Toute autre touche de navigation démasque l'écran et continue
        if (['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp'].includes(e.key)) {
          window.DeckEngine.Blank.deactivate();
        }
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          next(e.shiftKey);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev(e.shiftKey);
          break;
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
        case 'b':
        case 'B':
        case '.':
          if (window.DeckEngine.Blank) window.DeckEngine.Blank.toggle('black'); break;
        case 'w':
        case 'W':
          if (window.DeckEngine.Blank) window.DeckEngine.Blank.toggle('white'); break;
        case '/':
          e.preventDefault();
          if (window.DeckEngine.Search) window.DeckEngine.Search.open();
          break;
        case 't':
        case 'T':
          if (window.DeckEngine.Theme) window.DeckEngine.Theme.toggleTheme(); break;
        case 'c':
        case 'C':
          e.preventDefault();
          if (window.DeckEngine.Palette) window.DeckEngine.Palette.cycleAccentColor(); break;
        case 'i':
        case 'I':
          e.preventDefault();
          if (window.DeckEngine.Styler) window.DeckEngine.Styler.toggle(); break;
        case 's':
        case 'S':
          if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
          else if (window.openSpeakerWindow) window.openSpeakerWindow();
          break;
        case 'n':
        case 'N':
          if (notesDrawer) notesDrawer.classList.toggle('open'); break;
        case 'l':
        case 'L':
          if (window.DeckEngine.Laser) window.DeckEngine.Laser.toggle(); break;
        case 'o':
        case 'O':
          if (window.DeckEngine.Overview) window.DeckEngine.Overview.toggle(); break;
        case '?':
          if (shortcutsModal) shortcutsModal.classList.toggle('open'); break;
        case 'Escape':
          if (window.DeckEngine.Styler && window.DeckEngine.Styler.isActive()) {
            window.DeckEngine.Styler.deactivate();
            return;
          }
          if (window.DeckEngine.Zoom && window.DeckEngine.Zoom.isOpen()) {
            window.DeckEngine.Zoom.close();
            return;
          }
          if (window.DeckEngine.Search && window.DeckEngine.Search.isOpen()) {
            window.DeckEngine.Search.close();
            return;
          }
          if (window.DeckEngine.Blank && window.DeckEngine.Blank.isActive()) {
            window.DeckEngine.Blank.deactivate();
            return;
          }
          if (window.DeckEngine.Laser && window.DeckEngine.Laser.isActive()) {
            window.DeckEngine.Laser.deactivate();
            return;
          }
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
      const zoomModal = document.getElementById('deckZoomModal');
      const searchModal = document.getElementById('searchModal');
      if (overviewModal?.classList.contains('open') || 
          shortcutsModal?.classList.contains('open') || 
          notesDrawer?.classList.contains('open') ||
          zoomModal?.classList.contains('open') ||
          searchModal?.classList.contains('open') ||
          (window.DeckEngine.Zoom && window.DeckEngine.Zoom.isOpen())) {
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
    next: next,
    prev: prev,
    getCurrentIndex: () => currentIndex,
    getTotalSlides: () => totalSlides,
    getCurrentFragmentStep: () => currentFragmentStep,
    broadcastMessage: broadcastMessage,
    broadcastBlankState: broadcastBlankState,
    toggleFullscreen: toggleFullscreen
  };
})();

// Rétrocompatibilité globale
window.getCurrentSlideIndex = () => (window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0);
window.goToSlide = (idx, broadcast) => window.DeckEngine.Navigation && window.DeckEngine.Navigation.goToSlide(idx, broadcast);
window.nextSlide = () => window.DeckEngine.Navigation && window.DeckEngine.Navigation.nextSlide();
window.prevSlide = () => window.DeckEngine.Navigation && window.DeckEngine.Navigation.prevSlide();
window.next = (skip) => window.DeckEngine.Navigation && window.DeckEngine.Navigation.next(skip);
window.prev = (skip) => window.DeckEngine.Navigation && window.DeckEngine.Navigation.prev(skip);
