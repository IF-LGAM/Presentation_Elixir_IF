/**
 * Deck Engine - Theme Manager (Catalogue des 7 Ambiances Visuelles)
 * Sous-responsabilité : Gestion des ambiances (Dark, Light, Nordic, Cyberpunk, Emerald, Navy, Sepia),
 * popover de sélection, rotation séquentielle (Touche T), persistance et synchronisation double-écran.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Theme = (function () {
  const THEMES = [
    {
      id: 'dark',
      name: 'Midnight Charcoal',
      icon: '🌑',
      defaultAccent: '#E50914',
      bg: '#141414',
      card: '#1F1F1F'
    },
    {
      id: 'light',
      name: 'Clean Slate',
      icon: '☀️',
      defaultAccent: '#2563EB',
      bg: '#F8FAFC',
      card: '#FFFFFF'
    },
    {
      id: 'nordic',
      name: 'Polar Frost',
      icon: '❄️',
      defaultAccent: '#38BDF8',
      bg: '#0F172A',
      card: '#1E293B'
    },
    {
      id: 'cyberpunk',
      name: 'Neon Matrix',
      icon: '⚡',
      defaultAccent: '#00FF9D',
      bg: '#07090E',
      card: '#111622'
    },
    {
      id: 'emerald',
      name: 'Deep Forest',
      icon: '🌲',
      defaultAccent: '#10B981',
      bg: '#06150F',
      card: '#0C241B'
    },
    {
      id: 'navy',
      name: 'Corporate Navy',
      icon: '⚓',
      defaultAccent: '#3B82F6',
      bg: '#080E1E',
      card: '#121D38'
    },
    {
      id: 'sepia',
      name: 'Editorial Warm',
      icon: '☕',
      defaultAccent: '#D97706',
      bg: '#191614',
      card: '#26221F'
    }
  ];

  let currentThemeId = 'dark';
  let userManualTheme = localStorage.getItem('deck_user_theme');

  function getThemeById(id) {
    if (!id) return THEMES[0];
    return THEMES.find(t => t.id === id) || THEMES[0];
  }

  function renderThemeList() {
    const listEl = document.getElementById('themePresetsList');
    if (!listEl) return;

    listEl.innerHTML = THEMES.map(t => `
      <button class="theme-menu-btn ${t.id === currentThemeId ? 'active' : ''}" 
              data-theme-id="${t.id}" 
              title="Activer l'ambiance ${t.name}">
        <div class="theme-btn-info">
          <span class="theme-btn-icon">${t.icon}</span>
          <span>${t.name}</span>
        </div>
        <div class="theme-preview-dots">
          <span class="theme-preview-dot" style="background: ${t.bg};" title="Fond : ${t.bg}"></span>
          <span class="theme-preview-dot" style="background: ${t.card};" title="Cartes : ${t.card}"></span>
          <span class="theme-preview-dot" style="background: ${t.defaultAccent};" title="Accentuation : ${t.defaultAccent}"></span>
        </div>
      </button>
    `).join('');
  }

  function applyTheme(themeId, save = true) {
    const themeObj = getThemeById(themeId);
    currentThemeId = themeObj.id;

    const container = document.querySelector('.deck-container') || document.body;

    // Suppression de toutes les classes de thème existantes
    THEMES.forEach(t => {
      container.classList.remove(`theme-${t.id}`);
      document.body.classList.remove(`theme-${t.id}`);
    });

    // Application de la nouvelle classe et de l'attribut data-theme
    container.classList.add(`theme-${currentThemeId}`);
    container.setAttribute('data-theme', currentThemeId);
    document.body.classList.add(`theme-${currentThemeId}`);
    document.body.setAttribute('data-theme', currentThemeId);

    // Mise à jour de l'icône et du texte dans le header
    const icon = document.getElementById('themeToggleIcon');
    const txt = document.getElementById('themeToggleTxt');
    if (icon) icon.textContent = themeObj.icon;
    if (txt) txt.textContent = themeObj.name.split(' ')[0]; // nom court ex: "Midnight", "Clean", "Polar"

    // Mise à jour visuelle des boutons dans le popover
    const allBtns = document.querySelectorAll('.theme-menu-btn');
    allBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeId === currentThemeId);
    });

    if (save) {
      userManualTheme = currentThemeId;
      localStorage.setItem('deck_user_theme', currentThemeId);

      // Si l'utilisateur n'a pas défini de couleur d'accent manuelle persistante,
      // on synchronise harmonieusement l'accent par défaut du thème
      const userSavedAccent = localStorage.getItem('deck_accent_color');
      const isDefaultThemeAccent = !userSavedAccent || THEMES.some(t => t.defaultAccent.toUpperCase() === userSavedAccent.toUpperCase());
      if (isDefaultThemeAccent && window.DeckEngine.Palette && window.DeckEngine.Palette.setAccentColor) {
        window.DeckEngine.Palette.setAccentColor(themeObj.defaultAccent, false);
      }
    }

    // Synchronisation vers console présentateur
    if (window.DeckEngine.Navigation && window.DeckEngine.Navigation.broadcastMessage) {
      window.DeckEngine.Navigation.broadcastMessage({ theme: currentThemeId });
    }
    localStorage.setItem('deck_sync_theme', currentThemeId);

    // Réajustement des aperçus si la grille d'ensemble est ouverte
    const overviewModal = document.getElementById('overviewModal');
    if (overviewModal && overviewModal.classList.contains('open') && window.DeckEngine.Overview) {
      window.DeckEngine.Overview.scaleThumbs();
    }
  }

  function cycleTheme() {
    const currentIndex = THEMES.findIndex(t => t.id === currentThemeId);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex].id, true);
  }

  function togglePopover(force) {
    const popover = document.getElementById('themePalettePopover');
    if (!popover) return;
    const shouldOpen = typeof force === 'boolean' ? force : !popover.classList.contains('open');
    popover.classList.toggle('open', shouldOpen);

    // Fermer l'autre popover (couleur d'accent) pour éviter les superpositions
    if (shouldOpen) {
      document.getElementById('colorPalettePopover')?.classList.remove('open');
    }
  }

  function updateAutoTheme(slide) {
    if (!slide) return;
    const container = document.querySelector('.deck-container') || document.body;
    const defaultDeckTheme = container.getAttribute('data-theme') || 'dark';

    // Priorité 1 : Choix manuel explicite de l'utilisateur
    if (userManualTheme) {
      applyTheme(userManualTheme, false);
    } else {
      // Priorité 2 : Surcharge locale explicite sur la slide
      const explicitTheme = slide.getAttribute('data-theme');
      if (explicitTheme && THEMES.some(t => t.id === explicitTheme)) {
        applyTheme(explicitTheme, false);
      } else if (slide.classList.contains('light') || slide.classList.contains('theme-light')) {
        applyTheme('light', false);
      } else if (slide.classList.contains('dark') || slide.classList.contains('theme-dark')) {
        applyTheme('dark', false);
      } else if (defaultDeckTheme) {
        // Priorité 3 : Thème global défini au niveau du conteneur du diaporama
        applyTheme(defaultDeckTheme, false);
      } else {
        // Priorité 4 : Détection intelligente par calcul de luminance du fond
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
    renderThemeList();

    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    const initialContainer = document.querySelector('.deck-container') || document.body;
    const configuredGlobalTheme = initialContainer.getAttribute('data-theme') || 
      (initialContainer.classList.contains('theme-light') ? 'light' : null);

    if (themeParam && THEMES.some(t => t.id === themeParam)) {
      applyTheme(themeParam, true);
    } else if (userManualTheme && THEMES.some(t => t.id === userManualTheme)) {
      applyTheme(userManualTheme, false);
    } else if (configuredGlobalTheme && THEMES.some(t => t.id === configuredGlobalTheme)) {
      applyTheme(configuredGlobalTheme, false);
    } else {
      applyTheme('dark', false);
    }

    // Clic sur le bouton d'en-tête -> Bascule le popover
    document.getElementById('themeToggleBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopover();
    });

    // Clic dans la liste des thèmes du popover
    document.getElementById('themePresetsList')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-menu-btn');
      if (btn && btn.dataset.themeId) {
        applyTheme(btn.dataset.themeId, true);
        togglePopover(false);
      }
    });

    // Clic en dehors -> Fermeture du popover
    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('themePickerWrap');
      if (wrap && !wrap.contains(e.target)) {
        togglePopover(false);
      }
    });

    // Échap -> Fermeture du popover
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        togglePopover(false);
      }
    });
  }

  return {
    init: init,
    THEMES: THEMES,
    applyTheme: applyTheme,
    cycleTheme: cycleTheme,
    toggleTheme: cycleTheme, // Alias rétrocompatible pour raccourci T
    togglePopover: togglePopover,
    updateAutoTheme: updateAutoTheme,
    getCurrentThemeId: () => currentThemeId,
    getUserManualTheme: () => userManualTheme
  };
})();

// Rétrocompatibilité globale
window.applyTheme = window.DeckEngine.Theme.applyTheme;
window.toggleTheme = window.DeckEngine.Theme.toggleTheme;
