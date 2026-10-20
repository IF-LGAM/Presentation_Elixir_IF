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
