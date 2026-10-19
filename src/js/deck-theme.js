/**
 * Deck Engine - Theme Manager (Clair / Sombre)
 * Sous-responsabilité : Gestion du thème global (Dark/Light), détection automatique
 * par slide, calcul de luminance, persistance localStorage et synchronisation.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Theme = (function () {
  let userManualTheme = localStorage.getItem('deck_user_theme'); // 'light', 'dark', ou null

  function applyTheme(theme, save = true) {
    const container = document.querySelector('.deck-container') || document.body;
    const isLight = theme === 'light';
    container.classList.toggle('theme-light', isLight);
    container.classList.toggle('theme-dark', !isLight);
    container.setAttribute('data-theme', theme);
    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);
    document.body.setAttribute('data-theme', theme);

    if (save) {
      userManualTheme = theme;
      localStorage.setItem('deck_user_theme', theme);
    }

    if (window.DeckEngine.Navigation && window.DeckEngine.Navigation.broadcastMessage) {
      window.DeckEngine.Navigation.broadcastMessage({ theme: theme });
    }
    localStorage.setItem('deck_sync_theme', theme);

    const icon = document.getElementById('themeToggleIcon');
    const txt = document.getElementById('themeToggleTxt');
    if (icon) icon.textContent = isLight ? '🌙' : '☀️';
    if (txt) txt.textContent = isLight ? 'Sombre' : 'Clair';

    // Réajustement des aperçus si l'overview est ouverte
    const overviewModal = document.getElementById('overviewModal');
    if (overviewModal && overviewModal.classList.contains('open') && window.DeckEngine.Overview) {
      window.DeckEngine.Overview.scaleThumbs();
    }
  }

  function toggleTheme() {
    const container = document.querySelector('.deck-container') || document.body;
    const isCurrentlyLight = container.classList.contains('theme-light') || container.getAttribute('data-theme') === 'light';
    applyTheme(isCurrentlyLight ? 'dark' : 'light', true);
  }

  function updateAutoTheme(slide) {
    if (!slide) return;
    const container = document.querySelector('.deck-container') || document.body;
    const defaultDeckTheme = container.getAttribute('data-theme') || 'dark';

    // Priorité 1 : Choix manuel explicite de l'utilisateur (touche T ou bouton Thème)
    if (userManualTheme) {
      applyTheme(userManualTheme, false);
    } else {
      // Priorité 2 : Surcharge locale explicite sur la slide (exception ponctuelle)
      const explicitTheme = slide.getAttribute('data-theme');
      if (explicitTheme) {
        applyTheme(explicitTheme, false);
      } else if (slide.classList.contains('light') || slide.classList.contains('theme-light')) {
        applyTheme('light', false);
      } else if (slide.classList.contains('dark') || slide.classList.contains('theme-dark')) {
        applyTheme('dark', false);
      } else if (defaultDeckTheme) {
        // Priorité 3 : Thème global défini au niveau du conteneur du diaporama (.deck-container)
        applyTheme(defaultDeckTheme, false);
      } else {
        // Priorité 4 : Détection intelligente transparente par calcul de luminance du fond
        let isLight = false;
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
        applyTheme(isLight ? 'light' : 'dark', false);
      }
    }

    // Propagation automatique d'une couleur d'accent propre à la slide si présente
    const customAccent = slide.getAttribute('data-accent');
    const currentAccentColor = window.DeckEngine.Palette ? window.DeckEngine.Palette.getCurrentColor() : '#E50914';
    const lighten = window.DeckEngine.Palette ? window.DeckEngine.Palette.lightenColor : (c => c);

    if (customAccent) {
      container.style.setProperty('--accent-primary', customAccent);
      const customHover = slide.getAttribute('data-accent-hover') || customAccent;
      container.style.setProperty('--accent-hover', customHover);
    } else {
      container.style.setProperty('--accent-primary', currentAccentColor);
      container.style.setProperty('--accent-hover', lighten(currentAccentColor, 16));
    }
  }

  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    const initialContainer = document.querySelector('.deck-container') || document.body;
    const configuredGlobalTheme = initialContainer.getAttribute('data-theme') || (initialContainer.classList.contains('theme-light') ? 'light' : null);

    if (themeParam === 'light' || themeParam === 'dark') {
      applyTheme(themeParam, true);
    } else if (userManualTheme) {
      applyTheme(userManualTheme, false);
    } else if (configuredGlobalTheme) {
      applyTheme(configuredGlobalTheme, false);
    } else {
      applyTheme('dark', false);
    }

    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  }

  return {
    init: init,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme,
    updateAutoTheme: updateAutoTheme,
    getUserManualTheme: () => userManualTheme
  };
})();

// Rétrocompatibilité globale
window.applyTheme = window.DeckEngine.Theme.applyTheme;
window.toggleTheme = window.DeckEngine.Theme.toggleTheme;
