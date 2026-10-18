/**
 * Deck Engine Core Navigation & Keyboard Controls
 */
function ensureDeckStructure() {
  const container = document.querySelector('.deck-container') || document.body;
  const brand = container.getAttribute('data-brand') || 'DECK';
  const fullTitle = container.getAttribute('data-title') || document.title.replace(/ - Deck Engine$/, '') || 'TITRE FORMATION';

  // Formatage du titre brand (dernier mot avec span coloré si plusieurs mots)
  const titleParts = fullTitle.trim().split(' ');
  let brandTitleHtml = fullTitle;
  if (titleParts.length > 1) {
    const lastWord = titleParts.pop();
    brandTitleHtml = `${titleParts.join(' ')} <span>${lastWord}</span>`;
  }

  // 1. Header persistant
  if (!document.querySelector('.deck-header')) {
    const header = document.createElement('header');
    header.className = 'deck-header';
    header.innerHTML = `
      <div class="brand-wrap">
        <span class="brand-pill" id="deckBrandPill">${brand}</span>
        <div class="brand-title" id="deckBrandTitle">${brandTitleHtml}</div>
      </div>

      <div class="header-center">
        <div class="slide-badge-title">
          <span class="pulse-dot"></span>
          <span id="headerSlideTitle">Introduction</span>
        </div>
        <div class="slide-counter">
          <span id="currentSlideNum">1</span> / <span id="totalSlidesNum">6</span>
        </div>
      </div>

      <div class="deck-controls">
        <button id="pdfExportBtn" class="ctrl-btn primary" title="Exporter en PDF 16:9 paysage (Touche P)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <polyline points="9 15 12 18 15 15"></polyline>
          </svg>
          <span>Export PDF</span>
        </button>

        <button id="themeToggleBtn" class="ctrl-btn" title="Basculer Mode Clair / Sombre (Touche T)">
          <span id="themeToggleIcon">☀️</span>
          <span id="themeToggleTxt">Thème</span>
        </button>

        <div class="color-picker-wrap" id="colorPickerWrap">
          <button id="colorPickerBtn" class="ctrl-btn" title="Changer la couleur d'accent du thème (Touche C)">
            <span class="color-swatch-current" id="currentColorDot"></span>
            <span>Couleur</span>
          </button>
          <div class="color-palette-popover" id="colorPalettePopover">
            <div class="palette-title">Palette d'accent</div>
            <div class="palette-swatches">
              <button class="palette-dot active" data-color="#E50914" title="Rouge Crimson (Défaut)" style="--dot-color: #E50914;"></button>
              <button class="palette-dot" data-color="#2563EB" title="Bleu Cobalt" style="--dot-color: #2563EB;"></button>
              <button class="palette-dot" data-color="#10B981" title="Vert Émeraude" style="--dot-color: #10B981;"></button>
              <button class="palette-dot" data-color="#8B5CF6" title="Violet Cyber" style="--dot-color: #8B5CF6;"></button>
              <button class="palette-dot" data-color="#F59E0B" title="Ambre & Or" style="--dot-color: #F59E0B;"></button>
              <button class="palette-dot" data-color="#EC4899" title="Rose Néon" style="--dot-color: #EC4899;"></button>
              <button class="palette-dot" data-color="#06B6D4" title="Cyan Futuriste" style="--dot-color: #06B6D4;"></button>
            </div>
            <div class="palette-custom-row">
              <span class="palette-custom-label">Sur mesure :</span>
              <input type="color" id="customColorPickerInput" value="#E50914" title="Choisir une couleur personnalisée">
            </div>
          </div>
        </div>

        <button id="speakerWindowBtn" class="ctrl-btn" title="Ouvrir la vue présentateur dual-screen (Touche S)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <span>Présentateur (S)</span>
        </button>

        <button id="speakerNotesBtn" class="ctrl-btn" title="Tiroir de notes rapide écran unique (Touche N)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>Notes (N)</span>
        </button>

        <button id="overviewBtn" class="ctrl-btn" title="Vue globale des slides (Touche O / Échap)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Grille (O)</span>
        </button>

        <button id="shortcutsBtn" class="ctrl-btn" title="Aide des raccourcis clavier (Touche ?)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>

        <button id="fullscreenBtn" class="ctrl-btn" title="Plein écran (Touche F)">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </button>
      </div>

      <div class="progress-track">
        <div id="progressFill" class="progress-fill"></div>
      </div>
    `;
    container.insertBefore(header, container.firstChild);
  }

  // 2. Footer persistant
  if (!document.querySelector('.deck-footer')) {
    const footer = document.createElement('footer');
    footer.className = 'deck-footer';
    footer.innerHTML = `
      <div style="display: flex; gap: 0.6rem; align-items: center; font-size: 0.8rem; color: var(--text-dim);">
        <span>Navigation : <kbd>&larr;</kbd> <kbd>&rarr;</kbd> ou <kbd>Espace</kbd></span>
        <span>&bull;</span>
        <span>Présentateur : <kbd>S</kbd></span>
        <span>&bull;</span>
        <span>Export : <kbd>P</kbd></span>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        <button id="prevBtn" class="ctrl-btn">&larr; Précédent</button>
        <button id="nextBtn" class="ctrl-btn">Suivant &rarr;</button>
      </div>
    `;
    container.appendChild(footer);
  }

  // 3. Drawer de Notes (Touche N)
  if (!document.getElementById('notesDrawer')) {
    const drawer = document.createElement('aside');
    drawer.id = 'notesDrawer';
    drawer.className = 'notes-drawer';
    drawer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 0.8rem; margin-bottom: 1.1rem;">
        <h3 style="font-size: 1.15rem; color: var(--text-main);">Notes de Présentation (Rapide)</h3>
        <button id="closeNotesBtn" style="background: none; border: none; color: #aaa; font-size: 1.4rem; cursor: pointer;">&times;</button>
      </div>
      <div style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 700; margin-bottom: 0.6rem;">
        Slide <span id="notesSlideIndex">1</span> sur <span id="notesTotalSlides">1</span>
      </div>
      <div id="notesContent" style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main);"></div>
    `;
    container.appendChild(drawer);
  }

  // 4. Modale Vue d'ensemble en Grille (Touche O / Echap)
  if (!document.getElementById('overviewModal')) {
    const ovModal = document.createElement('div');
    ovModal.id = 'overviewModal';
    ovModal.className = 'modal-overlay';
    ovModal.innerHTML = `
      <div class="x-card" style="max-width: 1200px; width: 95vw; max-height: 90vh; border: 1px solid var(--border-dark); box-shadow: 0 10px 45px rgba(0,0,0,0.25); display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 0.8rem; margin-bottom: 0.85rem; flex-shrink: 0; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <h3 style="font-size: 1.25rem; color: var(--text-main);">Vue d'ensemble de la présentation</h3>
            <span class="pill-tag" id="overviewSlideCountBadge">Slides</span>
          </div>

          <div class="overview-slider-bar-wrap" style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.78rem; color: var(--text-dim);">Faire défiler :</span>
            <input type="range" id="overviewRangeSlider" min="1" max="1" value="1" class="overview-range-slider" title="Faites glisser pour faire défiler rapidement les slides">
            <span id="overviewSliderVal" style="font-family: 'Fira Code', monospace; font-size: 0.85rem; color: var(--accent-primary); font-weight: 700; min-width: 48px;">1 / 1</span>
          </div>

          <button id="closeOverviewBtn" style="background: none; border: none; color: #aaa; font-size: 1.4rem; cursor: pointer; line-height: 1;">&times;</button>
        </div>
        <div id="overviewGrid" class="overview-grid"></div>
      </div>
    `;
    container.appendChild(ovModal);
  }

  // 5. Modale d'aide des Raccourcis (Touche ?)
  if (!document.getElementById('shortcutsModal')) {
    const scModal = document.createElement('div');
    scModal.id = 'shortcutsModal';
    scModal.className = 'modal-overlay';
    scModal.innerHTML = `
      <div class="x-card" style="max-width: 560px; width: 100%; border: 1px solid var(--border-dark); box-shadow: 0 10px 45px rgba(0,0,0,0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 0.8rem; margin-bottom: 1.1rem;">
          <h3 style="font-size: 1.2rem; color: var(--text-main);">Raccourcis Clavier</h3>
          <button id="closeShortcutsBtn" style="background: none; border: none; color: #aaa; font-size: 1.4rem; cursor: pointer;">&times;</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Slide suivante</span> <kbd>&rarr; / Espace</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Slide précédente</span> <kbd>&larr;</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Thème Clair / Sombre</span> <kbd>T</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Couleur d'accent</span> <kbd>C</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Mode Présentateur</span> <kbd>S</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Tiroir de Notes</span> <kbd>N</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Grille Overview</span> <kbd>O / Échap</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Plein Écran</span> <kbd>F</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
            <span>Export PDF 16:9</span> <kbd>P</kbd>
          </div>
          <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center; grid-column: span 2;">
            <span>Aide Raccourcis</span> <kbd>?</kbd>
          </div>
        </div>
      </div>
    `;
    container.appendChild(scModal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ensureDeckStructure();
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
      if (event.data && event.data.type === 'accentColor' && event.data.color) { setAccentColor(event.data.color, false); }
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
    const isLight = document.querySelector('.deck-container')?.classList.contains('theme-light') || document.body.classList.contains('theme-light');
    if (deckChannel) deckChannel.postMessage({ slideIndex: index, theme: isLight ? 'light' : 'dark' });
    localStorage.setItem('deck_sync_slide', index.toString());
  }

  // 2.2 Gestion globale du Thème (Clair / Sombre) & Persistance
  let userManualTheme = localStorage.getItem('deck_user_theme'); // 'light', 'dark', ou null

  // 2.3 Personnalisation dynamique de la Couleur du Thème (Palette en direct)
  function lightenColor(col, percent) {
    if (!col || !col.startsWith('#')) return col;
    let num = parseInt(col.replace('#', ''), 16);
    if (isNaN(num)) return col;
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const ACCENT_PRESETS = [
    { name: 'Rouge Crimson', hex: '#E50914' },
    { name: 'Bleu Cobalt', hex: '#2563EB' },
    { name: 'Vert Émeraude', hex: '#10B981' },
    { name: 'Violet Cyber', hex: '#8B5CF6' },
    { name: 'Ambre & Or', hex: '#F59E0B' },
    { name: 'Rose Néon', hex: '#EC4899' },
    { name: 'Cyan Futuriste', hex: '#06B6D4' }
  ];

  let currentAccentColor = localStorage.getItem('deck_accent_color') || '#E50914';

  function setAccentColor(colorHex, save = true) {
    if (!colorHex) return;
    currentAccentColor = colorHex;
    document.documentElement.style.setProperty('--accent-primary', colorHex);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(colorHex, 16));
    const containerEl = document.querySelector('.deck-container');
    if (containerEl) {
      containerEl.style.setProperty('--accent-primary', colorHex);
      containerEl.style.setProperty('--accent-hover', lightenColor(colorHex, 16));
    }

    if (save) {
      localStorage.setItem('deck_accent_color', colorHex);
      localStorage.setItem('deck_sync_accent_color', colorHex);
    }

    const dot = document.getElementById('currentColorDot');
    if (dot) dot.style.background = colorHex;

    const input = document.getElementById('customColorPickerInput');
    if (input) input.value = colorHex;

    document.querySelectorAll('.palette-dot').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-color')?.toLowerCase() === colorHex.toLowerCase());
    });

    if (deckChannel) {
      deckChannel.postMessage({ type: 'accentColor', color: colorHex });
    }
  }

  function cycleAccentColor() {
    const norm = currentAccentColor.toLowerCase();
    const currIdx = ACCENT_PRESETS.findIndex(p => p.hex.toLowerCase() === norm);
    const nextIdx = (currIdx + 1) % ACCENT_PRESETS.length;
    setAccentColor(ACCENT_PRESETS[nextIdx].hex, true);
  }


  function applyTheme(theme, save = true) {
    const container = document.querySelector('.deck-container') || document.body;
    const isLight = theme === 'light';
    container.classList.toggle('theme-light', isLight);
    container.classList.toggle('theme-dark', !isLight);
    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);

    if (save) {
      userManualTheme = theme;
      localStorage.setItem('deck_user_theme', theme);
    }

    if (deckChannel) {
      deckChannel.postMessage({ theme: theme });
    }
    localStorage.setItem('deck_sync_theme', theme);

    const icon = document.getElementById('themeToggleIcon');
    const txt = document.getElementById('themeToggleTxt');
    if (icon) icon.textContent = isLight ? '🌙' : '☀️';
    if (txt) txt.textContent = isLight ? 'Sombre' : 'Clair';

    // Réajustement des aperçus si l'overview est ouverte
    if (overviewModal && overviewModal.classList.contains('open')) {
      scaleOverviewThumbs();
    }
  }

  function toggleTheme() {
    const container = document.querySelector('.deck-container') || document.body;
    const isCurrentlyLight = container.classList.contains('theme-light');
    applyTheme(isCurrentlyLight ? 'dark' : 'light', true);
  }

  // Initialisation du thème : paramètre URL (?theme=light|dark) ou localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  if (themeParam === 'light' || themeParam === 'dark') {
    applyTheme(themeParam, true);
  } else if (userManualTheme) {
    applyTheme(userManualTheme, false);
  }

  const colorParam = urlParams.get('color') || urlParams.get('accent');
  if (colorParam) {
    const formattedColor = colorParam.startsWith('#') ? colorParam : ('#' + colorParam);
    setAccentColor(formattedColor, true);
  } else if (currentAccentColor) {
    setAccentColor(currentAccentColor, false);
  }

  // 2.1 Adaptation automatique du thème Clair/Foncé en fonction de la slide
  function updateAutoTheme(slide) {
    if (!slide) return;
    const container = document.querySelector('.deck-container') || document.body;

    // Priorité 1 : attribut data-theme explicite sur la slide
    const explicitTheme = slide.getAttribute('data-theme');
    if (explicitTheme) {
      applyTheme(explicitTheme, false);
      return;
    }

    // Priorité 2 : choix manuel persistant de l'utilisateur
    if (userManualTheme) {
      applyTheme(userManualTheme, false);
      return;
    }

    // 1. Détection par classe explicite si pas de data-theme
    let isLight = false;
    if (slide.classList.contains('light') || slide.classList.contains('theme-light')) {
      isLight = true;
    } else if (slide.classList.contains('dark') || slide.classList.contains('theme-dark')) {
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
    const customAccent = slide.getAttribute('data-accent');
    if (customAccent) {
      container.style.setProperty('--accent-primary', customAccent);
      const customHover = slide.getAttribute('data-accent-hover') || customAccent;
      container.style.setProperty('--accent-hover', customHover);
    } else {
      container.style.setProperty('--accent-primary', currentAccentColor);
      container.style.setProperty('--accent-hover', lightenColor(currentAccentColor, 16));
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
  window.toggleTheme = toggleTheme;
  window.applyTheme = applyTheme;

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
      case 't':
      case 'T':
        toggleTheme(); break;
      case 'c':
      case 'C':
        e.preventDefault(); cycleAccentColor(); break;
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
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  // Contrôles du sélecteur de couleur en direct
  const colorPickerBtn = document.getElementById('colorPickerBtn');
  const colorPalettePopover = document.getElementById('colorPalettePopover');
  const customColorPickerInput = document.getElementById('customColorPickerInput');

  colorPickerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPalettePopover?.classList.toggle('open');
  });

  document.querySelectorAll('.palette-dot').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const col = btn.getAttribute('data-color');
      if (col) {
        setAccentColor(col, true);
        colorPalettePopover?.classList.remove('open');
      }
    });
  });

  customColorPickerInput?.addEventListener('input', (e) => {
    setAccentColor(e.target.value, false);
  });

  customColorPickerInput?.addEventListener('change', (e) => {
    setAccentColor(e.target.value, true);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#colorPickerWrap')) {
      colorPalettePopover?.classList.remove('open');
    }
  });
  document.getElementById('speakerWindowBtn')?.addEventListener('click', () => {
    if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
    else if (window.openSpeakerWindow) window.openSpeakerWindow();
  });
  document.getElementById('speakerModeBtn')?.addEventListener('click', () => {
    if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
    else if (window.openSpeakerWindow) window.openSpeakerWindow();
  });
  document.getElementById('speakerWindowBtn')?.addEventListener('click', () => {
    if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
    else if (window.openSpeakerWindow) window.openSpeakerWindow();
  });
  document.getElementById('pdfExportBtn')?.addEventListener('click', () => window.print());
  document.getElementById('speakerNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.toggle('open'));
  document.getElementById('closeNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.remove('open'));
  document.getElementById('overviewBtn')?.addEventListener('click', toggleOverview);
  document.getElementById('closeOverviewBtn')?.addEventListener('click', () => overviewModal?.classList.remove('open'));
  document.getElementById('shortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.toggle('open'));
  document.getElementById('closeShortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.remove('open'));

  // 9. Synchronisation avant export PDF (Print)
  window.addEventListener('beforeprint', () => {
    const container = document.querySelector('.deck-container') || document.body;
    const isLight = container.classList.contains('theme-light') || (userManualTheme === 'light');
    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);
    container.classList.toggle('theme-light', isLight);
    container.classList.toggle('theme-dark', !isLight);

    slides.forEach(slide => {
      const explicitTheme = slide.getAttribute('data-theme');
      if (explicitTheme === 'light' || slide.classList.contains('light')) {
        slide.classList.add('theme-light');
        slide.classList.remove('theme-dark');
      } else if (explicitTheme === 'dark' || slide.classList.contains('dark')) {
        slide.classList.add('theme-dark');
        slide.classList.remove('theme-light');
      } else if (isLight) {
        slide.classList.add('theme-light');
        slide.classList.remove('theme-dark');
      } else {
        slide.classList.add('theme-dark');
        slide.classList.remove('theme-light');
      }
    });
  });
});
