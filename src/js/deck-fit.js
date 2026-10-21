/**
 * HTML SLIDE DECK ENGINE - AUTO-FIT & DYNAMIC SCALING
 * Sous-responsabilité : Mesure du contenu réel de chaque diapositive et
 * application d'une mise à l'échelle adaptative (transform: scale) centrée
 * et fluide, pour garantir 0 débordement quel que soit le volume de contenu
 * ou la résolution de l'écran.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Fit = (function () {
  let isEnabled = true;

  /**
   * Ajuste l'échelle d'une slide spécifique pour qu'elle tienne parfaitement dans l'écran
   */
  function fitSlide(slide) {
    if (!isEnabled || !slide) return;
    const content = slide.querySelector('.slide-content');
    if (!content) return;

    // 1. Réinitialisation temporaire de la transformation pour mesurer les dimensions naturelles
    const prevTransition = content.style.transition;
    content.style.transition = 'none';
    content.style.transform = 'none';

    // 2. Mesure de la zone disponible dans le conteneur de slide
    const slideH = slide.clientHeight || slide.offsetHeight;
    const slideW = slide.clientWidth || slide.offsetWidth;

    // Détection de logos de bas de slide ou pied de page
    const logoEls = slide.querySelectorAll('.slide-logo, .slide-bottom-logos');
    const hasGlobalLogos = document.querySelector('.deck-container[data-logo-left], .deck-container[data-logo-center], .deck-container[data-logo-right]');
    const hasLogos = logoEls.length > 0 || !!hasGlobalLogos;

    if (hasLogos) {
      slide.classList.add('has-bottom-logo');
    }

    // Prise en charge universelle des redimensionnements directs (data-size, style="height: ...", height="...")
    let maxLogoHeight = 0;
    logoEls.forEach(el => {
      const customSize = el.getAttribute('data-size') || el.dataset?.size;
      if (customSize) {
        el.style.setProperty('--logo-height', customSize);
      }
      const img = el.querySelector('img, svg');
      if (img) {
        const imgSize = img.getAttribute('data-size') || img.dataset?.size;
        if (imgSize) {
          img.style.setProperty('--logo-height', imgSize);
          el.style.setProperty('--logo-height', imgSize);
        }
        if (img.getAttribute('height')) {
          const hAttr = img.getAttribute('height');
          const hVal = isNaN(hAttr) ? hAttr : `${hAttr}px`;
          el.style.setProperty('--logo-height', hVal);
        }
      }
      const measuredH = el.offsetHeight || (img ? img.offsetHeight : 0) || 26;
      if (measuredH > maxLogoHeight) maxLogoHeight = measuredH;
    });

    // Marges de sécurité dynamiques pour garantir zéro chevauchement avec le header et les logos
    const padTop = 16;
    const logoReserve = hasLogos ? Math.max(76, maxLogoHeight + 44) : 20;
    const padBottom = logoReserve;
    const padSide = 36;

    const availableHeight = slideH - padTop - padBottom;
    const availableWidth = slideW - padSide;

    // 3. Mesure de la hauteur et largeur réelles non réduites du contenu
    const naturalHeight = Math.max(content.scrollHeight, content.offsetHeight);
    const naturalWidth = Math.max(content.scrollWidth, content.offsetWidth);

    // 4. Calcul du ratio d'échelle idéal
    if (availableHeight > 60 && naturalHeight > 0 && availableWidth > 60 && naturalWidth > 0) {
      const scaleH = availableHeight / naturalHeight;
      const scaleW = availableWidth / naturalWidth;
      let scale = Math.min(1, scaleH, scaleW);

      // Si le contenu déborde, on applique la mise à l'échelle
      if (scale < 0.985) {
        // Seuil plancher de lisibilité (0.55)
        const effectiveScale = Math.max(0.55, scale);
        content.style.transform = `scale(${effectiveScale.toFixed(4)})`;
        content.style.transformOrigin = 'center center';

        // Si le contenu est excessivement long même à 0.55, défilement d'appoint
        if (scale < 0.55) {
          slide.style.overflowY = 'auto';
          slide.style.justifyContent = 'flex-start';
          slide.style.paddingTop = '1.25rem';
        } else {
          slide.style.overflowY = 'hidden';
          slide.style.justifyContent = 'center';
          slide.style.paddingTop = '';
        }
      } else {
        content.style.transform = '';
        content.style.transformOrigin = '';
        slide.style.overflowY = 'hidden';
        slide.style.justifyContent = 'center';
        slide.style.paddingTop = '';
      }
    }

    // 5. Restauration de la transition fluide après calcul
    requestAnimationFrame(() => {
      content.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  /**
   * Ajuste la diapositive active actuelle
   */
  function fitCurrent() {
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
      fitSlide(activeSlide);
    }
  }

  /**
   * Ajuste toutes les diapositives
   */
  function fitAll() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => fitSlide(slide));
  }

  let resizeTimer = null;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      fitAll();
    }, 50);
  }

  function init() {
    // 1. Calcul initial sur toutes les slides
    fitAll();

    // 2. Calcul dès que les polices Google Fonts sont prêtes
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fitAll();
      });
    }

    // 3. Écouteurs de redimensionnement et plein écran
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);
    document.addEventListener('webkitfullscreenchange', handleResize);

    // 4. Calcul au chargement complet des assets et images
    window.addEventListener('load', () => fitAll());
  }

  return {
    init: init,
    fitSlide: fitSlide,
    fitCurrent: fitCurrent,
    fitAll: fitAll,
    setEnabled: function (val) { isEnabled = val; }
  };
})();
