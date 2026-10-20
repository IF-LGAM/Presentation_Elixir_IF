/**
 * Composants Interactifs Globaux (Quiz & Copie de code)
 */

// Gestion flexible et universelle des Quizz
function revealQuiz(arg1, arg2, arg3) {
  // Signature 1 : revealQuiz(this, true, 'quizExplain1')
  if (typeof arg1 === 'object' && arg1 !== null) {
    const btn = arg1;
    const isCorrect = !!arg2;
    const explainId = arg3;

    // Retirer les statuts des autres boutons du même conteneur
    const parentContainer = btn.closest('.grid-2') || btn.parentElement;
    if (parentContainer) {
      parentContainer.querySelectorAll('.quiz-opt-btn').forEach(b => {
        b.classList.remove('correct', 'wrong');
      });
    }

    btn.classList.add(isCorrect ? 'correct' : 'wrong');

    if (explainId) {
      const explain = document.getElementById(explainId);
      if (explain) explain.classList.add('visible');
    }
    return;
  }

  // Signature 2 (Héritée) : revealQuiz(qNum, selectedOpt, isCorrect)
  const qNum = arg1;
  const selectedOpt = arg2;
  const isCorrect = !!arg3;

  const explain = document.getElementById(`quizExplain${qNum}`) || document.getElementById(`quizExp${qNum}`);
  if (explain) explain.classList.add('visible');

  const activeSlide = document.querySelector('.slide.active') ||
                      document.querySelector(`.slide[data-slide="${qNum}"]`) ||
                      document.querySelector(`.slide[data-slide="5"]`);

  if (activeSlide) {
    activeSlide.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      const badge = btn.querySelector('.opt-badge')?.textContent.trim();
      if (badge === selectedOpt) {
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
      } else {
        btn.classList.remove('correct', 'wrong');
      }
    });
  }
}

// Copie dans le presse-papier avec notification toast
function copyCommand(text) {
  navigator.clipboard.writeText(text).then(() => {
    let toast = document.getElementById('copyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'copyToast';
      toast.style.cssText = 'position:fixed;bottom:35px;right:25px;background:var(--accent-primary,#15803D);color:#FFF;padding:0.6rem 1.1rem;border-radius:8px;font-weight:700;font-size:0.85rem;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:999999;transition:all 0.3s ease;transform:translateY(100px);opacity:0;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = '✔ Copié dans le presse-papier !';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 2200);
  }).catch(() => {
    alert('Commande copiée : ' + text);
  });
}

window.revealQuiz = revealQuiz;
window.copyCommand = copyCommand;

// ==========================================================================
// POINTEUR LASER VIRTUEL HAUTE VISIBILITÉ (TOUCHE L)
// ==========================================================================
window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Laser = (function () {
  let isActive = false;
  let pointerEl = null;
  let haloEl = null;
  let dotEl = null;
  let mouseX = -100;
  let mouseY = -100;
  let isMoving = false;

  function ensureElements() {
    if (pointerEl) return;
    pointerEl = document.createElement('div');
    pointerEl.id = 'deckLaserPointer';

    haloEl = document.createElement('div');
    haloEl.className = 'laser-halo';

    dotEl = document.createElement('div');
    dotEl.className = 'laser-dot';

    pointerEl.appendChild(haloEl);
    pointerEl.appendChild(dotEl);
    document.body.appendChild(pointerEl);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(renderPosition);
      }
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      if (!isActive) return;
      createRipple(e.clientX, e.clientY);
    });
  }

  function renderPosition() {
    isMoving = false;
    if (pointerEl) {
      pointerEl.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0)';
    }
  }

  function createRipple(x, y) {
    if (!pointerEl) return;
    const ripple = document.createElement('div');
    ripple.className = 'laser-ripple';
    pointerEl.appendChild(ripple);
    setTimeout(() => {
      if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 460);
  }

  function activate() {
    ensureElements();
    isActive = true;
    document.body.classList.add('laser-active');
    const btn = document.getElementById('laserToggleBtn');
    if (btn) btn.classList.add('laser-active-btn');
  }

  function deactivate() {
    isActive = false;
    document.body.classList.remove('laser-active');
    const btn = document.getElementById('laserToggleBtn');
    if (btn) btn.classList.remove('laser-active-btn');
  }

  function toggle() {
    if (isActive) deactivate();
    else activate();
  }

  function init() {
    const btn = document.getElementById('laserToggleBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    }

    document.addEventListener('mouseleave', () => {
      if (pointerEl) pointerEl.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (pointerEl && isActive) pointerEl.style.opacity = '1';
    });
  }

  return {
    init: init,
    toggle: toggle,
    activate: activate,
    deactivate: deactivate,
    isActive: () => isActive
  };
})();

// ==========================================================================
// MODE BLACKOUT & WHITEOUT (TOUCHES B / W)
// ==========================================================================
window.DeckEngine.Blank = (function () {
  let activeMode = null; // 'black' | 'white' | null
  let overlayEl = null;
  let hintEl = null;

  function ensureElement() {
    if (overlayEl) return;
    overlayEl = document.getElementById('deckBlankOverlay');
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.id = 'deckBlankOverlay';

      hintEl = document.createElement('div');
      hintEl.className = 'blank-overlay-hint';
      overlayEl.appendChild(hintEl);

      document.body.appendChild(overlayEl);
    } else {
      hintEl = overlayEl.querySelector('.blank-overlay-hint');
      if (!hintEl) {
        hintEl = document.createElement('div');
        hintEl.className = 'blank-overlay-hint';
        overlayEl.appendChild(hintEl);
      }
    }

    // Un clic sur l'écran masqué réactive la vue normale
    overlayEl.addEventListener('click', () => {
      deactivate(true);
    });
  }

  function broadcastState(mode) {
    if (window.DeckEngine && window.DeckEngine.Navigation && typeof window.DeckEngine.Navigation.broadcastBlankState === 'function') {
      window.DeckEngine.Navigation.broadcastBlankState(mode);
    }
  }

  function activate(mode = 'black', notify = true) {
    ensureElement();
    activeMode = mode === 'white' ? 'white' : 'black';

    overlayEl.classList.remove('blackout-active', 'whiteout-active');
    overlayEl.classList.add(activeMode === 'white' ? 'whiteout-active' : 'blackout-active');

    if (hintEl) {
      hintEl.innerHTML = activeMode === 'white'
        ? '<span>Écran Blanc</span> &bull; <span>Cliquer ou presser Échap pour reprendre</span>'
        : '<span>Écran Noir</span> &bull; <span>Cliquer ou presser Échap pour reprendre</span>';
    }

    const btn = document.getElementById('blackoutBtn');
    if (btn) btn.classList.add('blackout-active-btn');

    if (notify) broadcastState(activeMode);
  }

  function deactivate(notify = true) {
    if (!activeMode && !overlayEl?.classList.contains('blackout-active') && !overlayEl?.classList.contains('whiteout-active')) return;
    activeMode = null;

    if (overlayEl) {
      overlayEl.classList.remove('blackout-active', 'whiteout-active');
    }

    const btn = document.getElementById('blackoutBtn');
    if (btn) btn.classList.remove('blackout-active-btn');

    if (notify) broadcastState(null);
  }

  function toggle(mode = 'black', notify = true) {
    const targetMode = mode === 'white' ? 'white' : 'black';
    if (activeMode === targetMode) {
      deactivate(notify);
    } else {
      activate(targetMode, notify);
    }
  }

  function init() {
    ensureElement();

    const btn = document.getElementById('blackoutBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle('black');
      });
    }
  }

  return {
    init: init,
    activate: activate,
    deactivate: deactivate,
    toggle: toggle,
    isActive: () => !!activeMode,
    getMode: () => activeMode
  };
})();

// ==========================================================================
// MOTEUR DE DIAGRAMMES MERMAID.JS (À CHAUD & ADAPTATIF)
// ==========================================================================
window.DeckEngine.Mermaid = (function () {
  let cdnPromise = null;

  function loadMermaidCDN() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (cdnPromise) return cdnPromise;

    cdnPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.async = true;
      script.onload = () => resolve(window.mermaid);
      script.onerror = (err) => {
        console.warn('Impossible de charger Mermaid.js depuis le CDN:', err);
        cdnPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });

    return cdnPromise;
  }

  function getThemeConfig() {
    const isLight = document.body.classList.contains('theme-light') || 
                    document.body.getAttribute('data-theme') === 'light';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#E50914';
    const bgDark = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#1F1F1F';
    const textColor = isLight ? '#0F172A' : '#FFFFFF';

    return {
      startOnLoad: false,
      securityLevel: 'loose',
      theme: isLight ? 'default' : 'dark',
      themeVariables: {
        primaryColor: accent,
        primaryTextColor: textColor,
        primaryBorderColor: accent,
        lineColor: accent,
        secondaryColor: isLight ? '#F1F5F9' : '#1A1A1A',
        tertiaryColor: isLight ? '#E2E8F0' : bgDark,
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: '14px',
        noteBkgColor: isLight ? '#FEF08A' : '#2A2515',
        noteTextColor: isLight ? '#713F12' : '#FEF08A'
      }
    };
  }

  let renderTimeout = null;

  function getCleanMermaidSrc(node) {
    if (node.dataset.mermaidSrc) return node.dataset.mermaidSrc;
    const clone = node.cloneNode(true);
    clone.querySelectorAll('.zoom-indicator-badge').forEach(b => b.remove());
    const raw = clone.textContent.trim();
    if (raw && !raw.startsWith('<svg')) {
      node.dataset.mermaidSrc = raw;
      return raw;
    }
    return '';
  }

  function renderAll() {
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(doRenderAll, 60);
  }

  async function doRenderAll() {
    // Cibler uniquement les diagrammes dans les diapositives, jamais dans les modales
    const nodes = document.querySelectorAll('.slide .mermaid');
    if (!nodes.length) return;

    // Sauvegarde sécurisée du code source brut avant rendu
    nodes.forEach(node => {
      getCleanMermaidSrc(node);
    });

    try {
      await loadMermaidCDN();
      if (!window.mermaid) return;

      window.mermaid.initialize(getThemeConfig());

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rawSrc = getCleanMermaidSrc(node);
        if (!rawSrc) continue;

        const id = 'mermaid-diag-' + i + '-' + Math.floor(Math.random() * 1000000);
        try {
          const { svg } = await window.mermaid.render(id, rawSrc);
          node.innerHTML = svg;
          node.classList.remove('mermaid-loading');
        } catch (renderErr) {
          console.warn('Erreur de syntaxe Mermaid:', renderErr);
          node.innerHTML = `<div style="color:#EF4444;font-size:0.85rem;font-family:'Fira Code',monospace;padding:1rem;border:1px dashed #EF4444;border-radius:6px;text-align:left;">⚠️ Erreur de rendu Mermaid : ${renderErr.message || renderErr}</div>`;
        }
      }
      if (window.DeckEngine.Zoom && typeof window.DeckEngine.Zoom.attachBadges === 'function') {
        window.DeckEngine.Zoom.attachBadges();
      }
    } catch (err) {
      console.warn('Erreur globale Mermaid:', err);
    }
  }

  function init() {
    const nodes = document.querySelectorAll('.slide .mermaid');
    if (nodes.length > 0) {
      nodes.forEach(n => {
        getCleanMermaidSrc(n);
      });
      renderAll();
    }
  }

  return {
    init: init,
    render: renderAll
  };
})();

// ==========================================================================
// MODULE DE ZOOM INTERACTIF SUR CARTES, SCHÉMAS & CODE (CLICK TO ZOOM)
// ==========================================================================
window.DeckEngine.Zoom = (function () {
  let modalEl = null;
  let contentEl = null;

  const ZOOM_SELECTOR = [
    '.zoomable',
    '[data-zoomable="true"]',
    '.x-card',
    '.terminal-box',
    '.schema-box',
    '.mermaid:has(svg)',
    'pre:not(.no-zoom)',
    '.split-code',
    'table:not(.no-zoom)',
    '.slide-content img:not(.slide-logo img):not(.no-zoom)'
  ].join(', ');

  function ensureElements() {
    if (modalEl && contentEl) return;
    modalEl = document.getElementById('deckZoomModal');
    contentEl = document.getElementById('deckZoomContent');

    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        // Ferme si clic en dehors du contenu (sur le fond flou), sur le bouton fermer X, ou sur l'indice
        if (e.target === modalEl || e.target.closest('#closeZoomBtn') || e.target.closest('.zoom-dismiss-hint') || e.target.classList.contains('zoom-wrapper')) {
          close();
        }
      });
    }
  }

  function open(sourceEl) {
    if (!sourceEl) return;
    ensureElements();
    if (!modalEl || !contentEl) return;

    contentEl.innerHTML = '';

    if (sourceEl.tagName === 'IMG') {
      const img = document.createElement('img');
      img.src = sourceEl.src;
      img.alt = sourceEl.alt || 'Aperçu agrandi';
      contentEl.appendChild(img);
    } else {
      const clone = sourceEl.cloneNode(true);
      clone.classList.remove('zoomable');
      clone.removeAttribute('data-zoomable');

      // Nettoie les éventuelles pastilles de zoom
      clone.querySelectorAll('.zoom-indicator-badge').forEach(b => b.remove());

      // Assure que tous les fragments dans le zoom sont 100% visibles
      clone.querySelectorAll('.fragment').forEach(f => f.classList.add('visible'));

      // Supprime les styles inline de taille de police qui bloqueraient l'agrandissement
      if (clone.style && clone.style.fontSize) clone.style.fontSize = '';
      clone.querySelectorAll('[style*="font-size"]').forEach(el => {
        el.style.fontSize = '';
      });

      // Supprime les restrictions de largeur inline sur les SVG (Mermaid, etc.)
      clone.querySelectorAll('svg').forEach(svg => {
        svg.style.maxWidth = '100%';
        svg.style.width = '100%';
        svg.style.height = 'auto';
      });

      contentEl.appendChild(clone);
    }

    modalEl.classList.add('open');
  }

  function close() {
    if (modalEl && modalEl.classList.contains('open')) {
      modalEl.classList.remove('open');
      setTimeout(() => {
        if (contentEl && !modalEl.classList.contains('open')) {
          contentEl.innerHTML = '';
        }
      }, 240);
    }
  }

  function isOpen() {
    return !!(modalEl && modalEl.classList.contains('open'));
  }

  function attachBadges() {
    const candidates = document.querySelectorAll(ZOOM_SELECTOR);
    candidates.forEach(el => {
      // Éviter les éléments exclus ou appartenant à l'interface globale
      if (el.matches('[data-zoomable="false"], .no-zoom')) return;
      if (el.closest('.slide-logo, .deck-header, .deck-footer, #shortcutsModal, #searchModal, #deckZoomModal, #notesDrawer')) return;

      el.classList.add('zoomable');

      // Ne jamais insérer de pastille de badge enfant directement à l'intérieur d'un .mermaid ou d'une balise <img>
      if (el.classList.contains('mermaid') || el.tagName === 'IMG') return;

      // Insérer la pastille de zoom uniquement si absente
      if (!el.querySelector(':scope > .zoom-indicator-badge')) {
        const badge = document.createElement('span');
        badge.className = 'zoom-indicator-badge';
        badge.innerHTML = '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span>Zoom</span>';
        badge.title = 'Agrandir en plein écran (Cliquer)';
        el.appendChild(badge);
      }
    });
  }

  function init() {
    ensureElements();
    attachBadges();

    // Délégation d'événement en phase de capture (true) pour intercepter le clic avant les gestionnaires de navigation
    document.addEventListener('click', (e) => {
      // Ignorer si la modale de zoom est déjà ouverte
      if (isOpen()) return;

      // Ignorer si on clique sur un élément d'action interactif (boutons, quiz, inputs, liens)
      if (e.target.closest('a, button, input, textarea, select, .quiz-opt-btn, .ctrl-btn, .palette-dot, .nav-btn, [role="button"]')) {
        return;
      }

      // Ignorer si l'utilisateur est en train de sélectionner du texte
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length > 0) return;

      const zoomTarget = e.target.closest(ZOOM_SELECTOR);
      if (zoomTarget) {
        if (zoomTarget.matches('[data-zoomable="false"], .no-zoom')) return;
        if (zoomTarget.closest('.deck-header, .deck-footer, #shortcutsModal, #searchModal, #deckZoomModal, #notesDrawer')) return;

        e.preventDefault();
        e.stopPropagation();
        open(zoomTarget);
      }
    }, true);
  }

  return {
    init: init,
    open: open,
    close: close,
    isOpen: isOpen,
    attachBadges: attachBadges
  };
})();


