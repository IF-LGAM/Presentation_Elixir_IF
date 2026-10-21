/**
 * Deck Engine - Component Color & Shape Inspector & Styler
 * Sous-responsabilité : Sélection visuelle au clic de n'importe quel composant
 * (cartes, badges, titres, boîtes, KPIs...) et modification en direct de sa
 * couleur de fond, couleur d'écriture, bordure, forme des angles (border-radius),
 * épaisseur et marges internes natives (padding) pour éviter que les bordures
 * ne touchent le texte.
 * Persistance automatique intégrale dans le navigateur (localStorage).
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Styler = (function () {
  let isModeActive = false;
  let selectedElement = null;
  let currentProperty = 'background'; // 'background' | 'color' | 'borderColor'
  let popoverEl = null;
  let bannerEl = null;
  let toastEl = null;

  const STORAGE_KEY_OVERRIDES = 'deck_styler_saved_overrides';
  const STORAGE_KEY_CUSTOM_COLORS = 'deck_styler_custom_colors';

  // Palette de couleurs préconfigurées du Design System
  const COLOR_PALETTE = [
    // Nuances de structure & thème
    { name: 'Fond Sombre', value: '#141414', isTheme: true },
    { name: 'Carte Sombre', value: '#1F1F1F', isTheme: true },
    { name: 'Hover Élevé', value: '#2B2B2B', isTheme: true },
    { name: 'Bordure', value: '#333333', isTheme: true },
    { name: 'Fond Code', value: '#0B0B0B', isTheme: true },
    { name: 'Blanc Pur', value: '#FFFFFF', isTheme: false },
    { name: 'Noir Absolu', value: '#000000', isTheme: false },
    // Nuances vives d'accent
    { name: 'Rouge Crimson', value: '#E50914', isTheme: false },
    { name: 'Bleu Cobalt', value: '#2563EB', isTheme: false },
    { name: 'Vert Émeraude', value: '#10B981', isTheme: false },
    { name: 'Violet Cyber', value: '#8B5CF6', isTheme: false },
    { name: 'Ambre & Or', value: '#F59E0B', isTheme: false },
    { name: 'Rose Néon', value: '#EC4899', isTheme: false },
    { name: 'Cyan Futuriste', value: '#06B6D4', isTheme: false },
    // Couleurs neutres & utilitaires
    { name: 'Gris Moyen', value: '#737373', isTheme: false },
    { name: 'Gris Muted', value: '#A3A3A3', isTheme: false },
    { name: 'Bleu Nuit', value: '#1E293B', isTheme: false },
    { name: 'Ardoise Claire', value: '#F1F5F9', isTheme: false },
    { name: 'Transparent', value: 'transparent', isTransparent: true }
  ];

  // Sélecteur des éléments cibles modifiables dans un slide
  const CANDIDATE_SELECTOR = `
    .x-card, .kpi-card, .schema-box, .terminal-box, .badge, .pill-tag,
    .btn-action, .data-table, .stepper-step, .cycle-step, .cycle-core,
    .callout, .quote-card, .quiz-opt-btn, .timeline-item, .chip,
    h1, h2, h3, h4, p, span, li, pre, code, button, td, th
  `.replace(/\s+/g, ' ').trim();

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  function normalizeHexColor(val) {
    if (!val || typeof val !== 'string') return null;
    let s = val.trim();
    if (!s.startsWith('#')) s = '#' + s;
    if (/^#[0-9A-Fa-f]{3}$/.test(s)) {
      return ('#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toUpperCase();
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) {
      return s.toUpperCase();
    }
    return null;
  }

  // Assure un padding natif suffisant pour que les lettres ne touchent jamais la bordure
  function ensureNativePadding(el) {
    if (!el) return;
    const isTextElement = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'CODE', 'PRE', 'A'].includes(el.tagName);
    if (isTextElement && (!el.style.padding || el.style.padding === '0px' || el.style.padding === '0')) {
      el.style.padding = '8px 24px';
      el.style.display = 'inline-block';
    }
  }

  // --- GESTION DES NUANCES FAVORITES ---
  function getCustomColors() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_COLORS);
      if (stored) return JSON.parse(stored);
      const fallback = localStorage.getItem('deck_custom_colors');
      return fallback ? JSON.parse(fallback) : [];
    } catch {
      return [];
    }
  }

  function saveCustomColors(colors) {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(colors));
    } catch (e) {
      console.warn('Erreur sauvegarde custom colors styler:', e);
    }
  }

  function addCustomColor(hex) {
    const norm = normalizeHexColor(hex);
    if (!norm) return false;
    let colors = getCustomColors();
    colors = colors.filter(c => c.toUpperCase() !== norm);
    colors.unshift(norm);
    if (colors.length > 14) colors.pop();
    saveCustomColors(colors);
    renderCustomColors();
    updateActiveSwatchHighlight();
    return true;
  }

  function deleteCustomColor(hex) {
    let colors = getCustomColors();
    colors = colors.filter(c => c.toUpperCase() !== hex.toUpperCase());
    saveCustomColors(colors);
    renderCustomColors();
    updateActiveSwatchHighlight();
  }

  function clearCustomColors() {
    saveCustomColors([]);
    renderCustomColors();
    updateActiveSwatchHighlight();
  }

  function renderCustomColors() {
    const customSection = popoverEl?.querySelector('#stylerCustomSection');
    const customGrid = popoverEl?.querySelector('#stylerCustomGrid');
    if (!customGrid) return;

    const colors = getCustomColors();
    if (!colors || colors.length === 0) {
      if (customSection) customSection.style.display = 'none';
      customGrid.innerHTML = '';
      return;
    }

    if (customSection) customSection.style.display = 'flex';
    customGrid.innerHTML = '';

    colors.forEach(col => {
      const itemWrap = document.createElement('div');
      itemWrap.className = 'styler-custom-item';

      const swatch = document.createElement('button');
      swatch.className = 'styler-custom-swatch';
      swatch.style.setProperty('--swatch-color', col);
      swatch.title = `Nuance personnalisée : ${col}`;
      swatch.setAttribute('data-color', col);
      swatch.addEventListener('click', () => {
        applyColor(col);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'styler-custom-delete';
      delBtn.innerHTML = '&times;';
      delBtn.title = `Supprimer la nuance ${col}`;
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCustomColor(col);
        showToast(`Nuance ${col} supprimée`);
      });

      itemWrap.appendChild(swatch);
      itemWrap.appendChild(delBtn);
      customGrid.appendChild(itemWrap);
    });
  }

  // --- PERSISTANCE AUTOMATIQUE DES STYLES DE COMPOSANTS ---
  function getElementKey(el) {
    if (!el) return null;
    const slide = el.closest('.slide');
    if (!slide) return null;

    const allSlides = Array.from(document.querySelectorAll('.slide'));
    const slideIndex = allSlides.indexOf(slide);
    if (slideIndex < 0) return null;

    if (el.id) {
      return `slide-${slideIndex}#${el.id}`;
    }

    const path = [];
    let curr = el;
    while (curr && curr !== slide) {
      const parent = curr.parentElement;
      if (!parent) break;
      const siblings = Array.from(parent.children).filter(c => c.tagName === curr.tagName);
      const index = siblings.indexOf(curr);
      const tag = curr.tagName.toLowerCase();
      path.unshift(`${tag}:nth-of-type(${index + 1})`);
      curr = parent;
    }

    return `slide-${slideIndex} > ${path.join(' > ')}`;
  }

  function getStoredOverrides() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OVERRIDES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  function saveStoredOverrides(overrides) {
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
    } catch (e) {
      console.warn('Erreur sauvegarde overrides styler:', e);
    }
  }

  function saveElementOverride(el) {
    if (!el) return;
    const key = getElementKey(el);
    if (!key) return;

    const overrides = getStoredOverrides();
    const bg = el.style.backgroundColor || el.style.background || '';
    const col = el.style.color || '';
    const border = el.style.borderColor || '';
    const radius = el.style.borderRadius || '';
    const width = el.style.borderWidth || '';
    const bstyle = el.style.borderStyle || '';
    const pad = el.style.padding || '';
    const disp = el.style.display || '';

    if (!bg && !col && !border && !radius && !width && !bstyle && !pad) {
      delete overrides[key];
    } else {
      overrides[key] = {
        background: bg,
        color: col,
        borderColor: border,
        borderRadius: radius,
        borderWidth: width,
        borderStyle: bstyle,
        padding: pad,
        display: disp
      };
    }

    saveStoredOverrides(overrides);
  }

  function removeElementOverride(el) {
    if (!el) return;
    const key = getElementKey(el);
    if (!key) return;

    const overrides = getStoredOverrides();
    if (overrides[key]) {
      delete overrides[key];
      saveStoredOverrides(overrides);
    }
  }

  function restoreAllStyles() {
    const overrides = getStoredOverrides();
    if (!overrides || Object.keys(overrides).length === 0) return;

    const allSlides = Array.from(document.querySelectorAll('.slide'));

    Object.entries(overrides).forEach(([key, styleObj]) => {
      try {
        let targetEl = null;
        if (key.startsWith('slide-')) {
          const parts = key.split(' > ');
          const slideHeader = parts[0];
          if (slideHeader.includes('#')) {
            const id = slideHeader.split('#')[1];
            targetEl = document.getElementById(id);
          } else {
            const slideIdx = parseInt(slideHeader.replace('slide-', ''), 10);
            const slide = allSlides[slideIdx];
            if (slide && parts.length > 1) {
              const relSelector = parts.slice(1).join(' > ');
              targetEl = slide.querySelector(relSelector);
            }
          }
        }

        if (targetEl && styleObj && typeof styleObj === 'object') {
          if (styleObj.background) {
            targetEl.style.background = styleObj.background;
            targetEl.style.backgroundColor = styleObj.background;
          }
          if (styleObj.color) {
            targetEl.style.color = styleObj.color;
          }
          if (styleObj.borderColor) {
            targetEl.style.borderColor = styleObj.borderColor;
          }
          if (styleObj.borderRadius) {
            targetEl.style.borderRadius = styleObj.borderRadius;
          }
          if (styleObj.borderWidth) {
            targetEl.style.borderWidth = styleObj.borderWidth;
          }
          if (styleObj.borderStyle) {
            targetEl.style.borderStyle = styleObj.borderStyle;
          }
          if (styleObj.padding) {
            targetEl.style.padding = styleObj.padding;
          } else if (styleObj.background || styleObj.borderRadius || styleObj.borderColor) {
            ensureNativePadding(targetEl);
          }
          if (styleObj.display) {
            targetEl.style.display = styleObj.display;
          }
        }
      } catch (e) {
        console.warn('Erreur restauration style pour', key, e);
      }
    });
  }

  function resetAllStyles() {
    saveStoredOverrides({});
    document.querySelectorAll('[style]').forEach(el => {
      if (el.closest('.slide')) {
        el.style.background = '';
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.borderColor = '';
        el.style.borderRadius = '';
        el.style.borderWidth = '';
        el.style.borderStyle = '';
        el.style.padding = '';
        el.style.display = '';
        if (el.getAttribute('style') === '') el.removeAttribute('style');
      }
    });
    syncBorderShapeUI();
    updateActiveSwatchHighlight();
    showToast('Tous les styles personnalisés ont été réinitialisés');
  }

  function getElementBadgeLabel(el) {
    if (!el) return 'Élément';
    const tag = el.tagName.toLowerCase();
    const classList = Array.from(el.classList)
      .filter(c => !c.startsWith('styler-'))
      .slice(0, 2)
      .map(c => '.' + c)
      .join('');
    return `<${tag}${classList}>`;
  }

  function syncBorderShapeUI() {
    if (!selectedElement || !popoverEl) return;

    // 1. Synchronisation Border Radius
    const rawRadius = selectedElement.style.borderRadius || window.getComputedStyle(selectedElement).borderRadius || '0px';
    const numRadius = parseInt(rawRadius, 10) || 0;
    const isPill = rawRadius === '9999px' || numRadius >= 100;

    const slider = popoverEl.querySelector('#stylerRadiusSlider');
    const valBadge = popoverEl.querySelector('#stylerRadiusVal');
    if (slider) slider.value = isPill ? 32 : Math.min(32, numRadius);
    if (valBadge) valBadge.textContent = isPill ? 'Pilule' : `${numRadius}px`;

    const presetBtns = popoverEl.querySelectorAll('#stylerRadiusPresets .styler-preset-btn');
    presetBtns.forEach(btn => {
      const r = btn.getAttribute('data-radius');
      if (isPill && r === '9999px') {
        btn.classList.add('active');
      } else if (!isPill && r === `${numRadius}px`) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Synchronisation Padding (Marge interne)
    const rawPad = selectedElement.style.padding || window.getComputedStyle(selectedElement).padding || '0px';
    const numPad = parseInt(rawPad, 10) || 0;
    const padSlider = popoverEl.querySelector('#stylerPaddingSlider');
    const padValBadge = popoverEl.querySelector('#stylerPaddingVal');
    if (padSlider) padSlider.value = Math.min(36, numPad);
    if (padValBadge) {
      padValBadge.textContent = selectedElement.style.padding ? selectedElement.style.padding : (numPad > 0 ? `${numPad}px` : '0px');
    }

    const padPresetBtns = popoverEl.querySelectorAll('#stylerPaddingPresets .styler-preset-btn');
    padPresetBtns.forEach(btn => {
      const p = btn.getAttribute('data-pad');
      if (selectedElement.style.padding === p || (!selectedElement.style.padding && p === '0px' && numPad === 0)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 3. Synchronisation Border Width / Style
    const rawWidth = selectedElement.style.borderWidth || window.getComputedStyle(selectedElement).borderWidth || '0px';
    const rawStyle = selectedElement.style.borderStyle || window.getComputedStyle(selectedElement).borderStyle || 'none';

    const typeBtns = popoverEl.querySelectorAll('.styler-border-type-btn');
    typeBtns.forEach(btn => {
      const w = btn.getAttribute('data-width');
      const s = btn.getAttribute('data-style');
      if (w === '0px' && (rawWidth === '0px' || rawStyle === 'none')) {
        btn.classList.add('active');
      } else if (rawWidth.includes(w.replace('px', '')) && rawStyle === s) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function createStylerDOM() {
    if (popoverEl) return;

    // 1. Bannière d'information
    bannerEl = document.createElement('div');
    bannerEl.className = 'styler-banner';
    bannerEl.id = 'stylerBanner';
    bannerEl.innerHTML = `
      <span class="styler-banner-dot"></span>
      <span>Mode Styliseur actif — Cliquez sur un composant pour modifier son style</span>
      <button class="styler-banner-close" id="stylerBannerClose" title="Quitter le styliseur (Échap)">✕</button>
    `;
    document.body.appendChild(bannerEl);

    bannerEl.querySelector('#stylerBannerClose')?.addEventListener('click', () => {
      deactivate();
    });

    // 2. Toast
    toastEl = document.createElement('div');
    toastEl.className = 'styler-toast';
    toastEl.id = 'stylerToast';
    document.body.appendChild(toastEl);

    // 3. Popover
    popoverEl = document.createElement('div');
    popoverEl.className = 'styler-popover';
    popoverEl.id = 'stylerPopover';
    popoverEl.innerHTML = `
      <div class="styler-popover-header">
        <span class="styler-tag-badge" id="stylerTagBadge">&lt;composant&gt;</span>
        <div class="styler-header-actions">
          <button class="styler-btn-icon" id="stylerParentBtn" title="Sélectionner le conteneur parent (ex: Carte entière)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button class="styler-btn-icon" id="stylerCloseBtn" title="Fermer (Échap)">✕</button>
        </div>
      </div>

      <div class="styler-tabs">
        <button class="styler-tab-btn active" data-prop="background" title="Modifier la couleur d'arrière-plan">🎨 Fond</button>
        <button class="styler-tab-btn" data-prop="color" title="Modifier la couleur du texte">✏️ Texte</button>
        <button class="styler-tab-btn" data-prop="borderColor" title="Modifier la bordure et forme des angles">🔲 Bordure & Forme</button>
      </div>

      <div>
        <div class="styler-section-title">
          <span id="stylerPaletteLabel">Nuancier Fond</span>
        </div>
        <div class="styler-swatches-grid" id="stylerSwatchesGrid"></div>
      </div>

      <div class="styler-custom-section" id="stylerCustomSection" style="display: none;">
        <div class="styler-section-title">
          <span>Mes Nuances Personnalisées</span>
          <button class="styler-clear-btn" id="stylerClearCustomBtn" title="Effacer toutes mes nuances">Effacer</button>
        </div>
        <div class="styler-custom-grid" id="stylerCustomGrid"></div>
      </div>

      <div class="styler-custom-controls">
        <div class="styler-hex-input-wrap">
          <input type="color" class="styler-color-native" id="stylerColorInput" value="#E50914" title="Pipette de couleur libre">
          <input type="text" class="styler-hex-input" id="stylerHexInput" value="#E50914" placeholder="#HEX ou couleur" spellcheck="false">
        </div>
        <div class="styler-hex-actions">
          <button class="styler-action-btn primary" id="stylerApplyHexBtn" title="Appliquer cette couleur au composant">Appliquer</button>
          <button class="styler-action-btn" id="stylerAddHexBtn" title="Enregistrer cette nuance dans Mes Nuances Personnalisées">+ Sauvegarder</button>
        </div>
      </div>

      <!-- Section Forme & Arrondi de Bordure (Visible dans l'onglet Bordure) -->
      <div class="styler-border-shape-section" id="stylerBorderShapeSection" style="display: none;">
        <div class="styler-shape-group">
          <div class="styler-section-title">
            <span>Arrondi des angles</span>
            <span class="styler-val-badge" id="stylerRadiusVal">8px</span>
          </div>
          <div class="styler-radius-slider-wrap">
            <input type="range" class="styler-range-slider" id="stylerRadiusSlider" min="0" max="32" value="8" step="1">
          </div>
          <div class="styler-radius-presets" id="stylerRadiusPresets">
            <button class="styler-preset-btn" data-radius="0px" title="Coins carrés (0px)">Carré</button>
            <button class="styler-preset-btn" data-radius="4px" title="Coins légers (4px)">Léger</button>
            <button class="styler-preset-btn active" data-radius="8px" title="Coins standards (8px)">Moyen</button>
            <button class="styler-preset-btn" data-radius="16px" title="Coins prononcés (16px)">Rond</button>
            <button class="styler-preset-btn" data-radius="9999px" title="Format pilule / ovale">Pilule</button>
          </div>
        </div>

        <div class="styler-shape-group">
          <div class="styler-section-title">
            <span>Marges internes (Padding)</span>
            <span class="styler-val-badge" id="stylerPaddingVal">8px 24px</span>
          </div>
          <div class="styler-radius-slider-wrap">
            <input type="range" class="styler-range-slider" id="stylerPaddingSlider" min="0" max="36" value="12" step="2">
          </div>
          <div class="styler-radius-presets" id="stylerPaddingPresets">
            <button class="styler-preset-btn" data-pad="0px" title="Aucun padding">0</button>
            <button class="styler-preset-btn" data-pad="4px 14px" title="Padding compact">Fin</button>
            <button class="styler-preset-btn active" data-pad="8px 24px" title="Padding équilibré">Moyen</button>
            <button class="styler-preset-btn" data-pad="14px 32px" title="Padding large">Large</button>
            <button class="styler-preset-btn" data-pad="20px 40px" title="Padding très généreux">Maxi</button>
          </div>
        </div>

        <div class="styler-shape-group">
          <div class="styler-section-title">
            <span>Épaisseur & Type</span>
          </div>
          <div class="styler-border-types" id="stylerBorderTypes">
            <button class="styler-border-type-btn" data-width="1px" data-style="solid" title="Bordure fine 1px continue">1px Net</button>
            <button class="styler-border-type-btn" data-width="2px" data-style="solid" title="Bordure moyenne 2px continue">2px Net</button>
            <button class="styler-border-type-btn" data-width="2px" data-style="dashed" title="Bordure en pointillés">Pointillés</button>
            <button class="styler-border-type-btn" data-width="0px" data-style="none" title="Aucune bordure">Sans</button>
          </div>
        </div>
      </div>

      <div class="styler-actions">
        <button class="styler-action-btn" id="stylerCopyStyleBtn" title="Copier le style inline dans le presse-papiers">
          📋 Copier style
        </button>
        <button class="styler-action-btn" id="stylerCopyHtmlBtn" title="Copier le code HTML complet du composant">
          &lt;/&gt; Copier HTML
        </button>
        <button class="styler-action-btn" id="stylerResetBtn" title="Rétablir le style par défaut de cet élément">
          🔄 Reset
        </button>
      </div>
    `;
    document.body.appendChild(popoverEl);

    // Événements du Popover
    popoverEl.querySelector('#stylerCloseBtn')?.addEventListener('click', closePopover);
    popoverEl.querySelector('#stylerParentBtn')?.addEventListener('click', selectParent);
    
    // Changement d'onglet (Fond / Texte / Bordure)
    const tabBtns = popoverEl.querySelectorAll('.styler-tab-btn');
    const shapeSection = popoverEl.querySelector('#stylerBorderShapeSection');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentProperty = btn.getAttribute('data-prop');
        
        // Affichage de la section forme uniquement dans l'onglet bordure
        if (shapeSection) {
          shapeSection.style.display = (currentProperty === 'borderColor') ? 'flex' : 'none';
        }

        updatePaletteLabel();
        updateActiveSwatchHighlight();
        if (currentProperty === 'borderColor') syncBorderShapeUI();
      });
    });

    // 1. Slider d'arrondi
    const radiusSlider = popoverEl.querySelector('#stylerRadiusSlider');
    radiusSlider?.addEventListener('input', (e) => {
      if (!selectedElement) return;
      ensureNativePadding(selectedElement);
      const val = e.target.value;
      selectedElement.style.borderRadius = `${val}px`;
      saveElementOverride(selectedElement);
      syncBorderShapeUI();
    });

    // 2. Presets d'arrondi
    const presetBtns = popoverEl.querySelectorAll('#stylerRadiusPresets .styler-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedElement) return;
        ensureNativePadding(selectedElement);
        const rad = btn.getAttribute('data-radius');
        selectedElement.style.borderRadius = rad;
        saveElementOverride(selectedElement);
        syncBorderShapeUI();
      });
    });

    // 3. Slider de padding
    const paddingSlider = popoverEl.querySelector('#stylerPaddingSlider');
    paddingSlider?.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const v = e.target.value;
      selectedElement.style.padding = `${Math.round(v * 0.55)}px ${v}px`;
      selectedElement.style.display = 'inline-block';
      saveElementOverride(selectedElement);
      syncBorderShapeUI();
    });

    // 4. Presets de padding
    const padPresetBtns = popoverEl.querySelectorAll('#stylerPaddingPresets .styler-preset-btn');
    padPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedElement) return;
        const pad = btn.getAttribute('data-pad');
        selectedElement.style.padding = pad;
        if (pad !== '0px') selectedElement.style.display = 'inline-block';
        saveElementOverride(selectedElement);
        syncBorderShapeUI();
      });
    });

    // 5. Types et épaisseurs de bordure
    const borderTypeBtns = popoverEl.querySelectorAll('.styler-border-type-btn');
    borderTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedElement) return;
        ensureNativePadding(selectedElement);
        const w = btn.getAttribute('data-width');
        const s = btn.getAttribute('data-style');
        selectedElement.style.borderWidth = w;
        selectedElement.style.borderStyle = s;
        if (w !== '0px' && !selectedElement.style.borderColor) {
          selectedElement.style.borderColor = 'var(--accent-primary)';
        }
        saveElementOverride(selectedElement);
        syncBorderShapeUI();
        updateActiveSwatchHighlight();
      });
    });

    // Génération des swatches prédéfinis
    renderSwatches();

    // Rendu des nuances personnalisées
    renderCustomColors();

    // Input native color
    const colorInput = popoverEl.querySelector('#stylerColorInput');
    const hexInput = popoverEl.querySelector('#stylerHexInput');
    colorInput?.addEventListener('input', (e) => {
      if (hexInput) hexInput.value = e.target.value.toUpperCase();
      applyColor(e.target.value);
    });

    // Bouton appliquer hex
    popoverEl.querySelector('#stylerApplyHexBtn')?.addEventListener('click', () => {
      if (hexInput && hexInput.value.trim()) {
        const val = hexInput.value.trim();
        applyColor(val);
      }
    });

    // Bouton sauvegarder hex dans mes nuances
    popoverEl.querySelector('#stylerAddHexBtn')?.addEventListener('click', () => {
      const val = hexInput?.value?.trim() || colorInput?.value;
      if (val) {
        if (addCustomColor(val)) {
          applyColor(val);
          showToast(`✓ Nuance ${normalizeHexColor(val)} enregistrée et conservée !`);
        } else {
          showToast('Code hexadécimal invalide');
        }
      }
    });

    // Bouton effacer mes nuances personnalisées
    popoverEl.querySelector('#stylerClearCustomBtn')?.addEventListener('click', () => {
      clearCustomColors();
      showToast('Nuances personnalisées effacées');
    });

    hexInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = hexInput.value.trim();
        applyColor(val);
        addCustomColor(val);
      }
    });

    // Copier le style
    popoverEl.querySelector('#stylerCopyStyleBtn')?.addEventListener('click', () => {
      if (!selectedElement) return;
      const inlineStyle = selectedElement.getAttribute('style') || '';
      if (!inlineStyle.trim()) {
        showToast('Aucun style inline personnalisé');
        return;
      }
      navigator.clipboard?.writeText(inlineStyle).then(() => {
        showToast('✓ Style CSS copié !');
      }).catch(() => {
        showToast('Style : ' + inlineStyle);
      });
    });

    // Copier le HTML
    popoverEl.querySelector('#stylerCopyHtmlBtn')?.addEventListener('click', () => {
      if (!selectedElement) return;
      selectedElement.classList.remove('styler-selected-target');
      const html = selectedElement.outerHTML;
      selectedElement.classList.add('styler-selected-target');
      navigator.clipboard?.writeText(html).then(() => {
        showToast('✓ Code HTML complet copié !');
      }).catch(() => {
        showToast('HTML copié');
      });
    });

    // Réinitialiser cet élément
    popoverEl.querySelector('#stylerResetBtn')?.addEventListener('click', () => {
      if (!selectedElement) return;
      selectedElement.style.background = '';
      selectedElement.style.backgroundColor = '';
      selectedElement.style.color = '';
      selectedElement.style.borderColor = '';
      selectedElement.style.borderRadius = '';
      selectedElement.style.borderWidth = '';
      selectedElement.style.borderStyle = '';
      selectedElement.style.padding = '';
      selectedElement.style.display = '';
      if (selectedElement.getAttribute('style') === '') {
        selectedElement.removeAttribute('style');
      }
      removeElementOverride(selectedElement);
      syncBorderShapeUI();
      updateActiveSwatchHighlight();
      showToast('Style réinitialisé pour cet élément');
    });

    // Empêcher les clics à l'intérieur du popover d'être interceptés par le document
    popoverEl.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function updatePaletteLabel() {
    const labelEl = popoverEl?.querySelector('#stylerPaletteLabel');
    if (!labelEl) return;
    if (currentProperty === 'background') labelEl.textContent = 'Nuancier Arrière-Plan';
    else if (currentProperty === 'color') labelEl.textContent = 'Nuancier Couleur du Texte';
    else if (currentProperty === 'borderColor') labelEl.textContent = 'Couleur de la Bordure';
  }

  function renderSwatches() {
    const grid = popoverEl?.querySelector('#stylerSwatchesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    COLOR_PALETTE.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'styler-swatch' + (item.isTransparent ? ' is-transparent' : '');
      btn.style.setProperty('--swatch-color', item.value);
      btn.title = item.name + (item.value !== 'transparent' ? ` (${item.value})` : '');
      btn.setAttribute('data-color', item.value);

      btn.addEventListener('click', () => {
        applyColor(item.value);
      });

      grid.appendChild(btn);
    });
  }

  function updateActiveSwatchHighlight() {
    if (!selectedElement || !popoverEl) return;
    const computedVal = window.getComputedStyle(selectedElement)[currentProperty];
    const inlineVal = selectedElement.style[currentProperty];

    const swatches = popoverEl.querySelectorAll('.styler-swatch, .styler-custom-swatch');
    swatches.forEach(s => {
      const c = s.getAttribute('data-color');
      if (inlineVal && (inlineVal.toLowerCase() === c.toLowerCase() || inlineVal === c)) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Synchronise la pipette et le champ hex
    const colorInput = popoverEl.querySelector('#stylerColorInput');
    const hexInput = popoverEl.querySelector('#stylerHexInput');
    if (inlineVal && inlineVal.startsWith('#')) {
      if (colorInput) colorInput.value = inlineVal;
      if (hexInput) hexInput.value = inlineVal.toUpperCase();
    }
  }

  function applyColor(colorVal) {
    if (!selectedElement) return;
    if (!colorVal) return;

    if (currentProperty === 'background') {
      ensureNativePadding(selectedElement);
      selectedElement.style.background = colorVal;
      selectedElement.style.backgroundColor = colorVal;
    } else if (currentProperty === 'color') {
      selectedElement.style.color = colorVal;
    } else if (currentProperty === 'borderColor') {
      ensureNativePadding(selectedElement);
      selectedElement.style.borderColor = colorVal;
      // S'il n'y a pas de bordure active, activer une bordure fine
      if (!selectedElement.style.borderWidth || selectedElement.style.borderWidth === '0px') {
        selectedElement.style.borderWidth = '1px';
        selectedElement.style.borderStyle = 'solid';
      }
    }

    // Persistance automatique immédiate dans localStorage
    saveElementOverride(selectedElement);

    updateActiveSwatchHighlight();
    syncBorderShapeUI();
  }

  function positionPopover(targetEl) {
    if (!popoverEl || !targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const popoverWidth = 326;
    const popoverHeight = 520;
    const margin = 12;

    let top = rect.bottom + margin;
    let left = rect.left;

    // Si ça déborde en bas, placer au-dessus de l'élément
    if (top + popoverHeight > window.innerHeight) {
      top = Math.max(margin + 40, rect.top - popoverHeight - margin);
    }

    // Si ça déborde à droite, aligner sur le bord droit de l'élément ou de l'écran
    if (left + popoverWidth > window.innerWidth) {
      left = Math.max(margin, window.innerWidth - popoverWidth - margin);
    }

    // Limites de sécurité
    top = Math.max(45, Math.min(top, window.innerHeight - popoverHeight - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - popoverWidth - 10));

    popoverEl.style.top = `${top}px`;
    popoverEl.style.left = `${left}px`;
  }

  function selectElement(el) {
    if (!el) return;
    createStylerDOM();

    // Nettoyer l'ancienne sélection
    if (selectedElement) {
      selectedElement.classList.remove('styler-selected-target');
    }

    selectedElement = el;
    selectedElement.classList.add('styler-selected-target');

    // Mettre à jour le badge d'en-tête
    const tagBadge = popoverEl.querySelector('#stylerTagBadge');
    if (tagBadge) tagBadge.textContent = getElementBadgeLabel(selectedElement);

    // Mettre à jour l'état du bouton parent
    const parentBtn = popoverEl.querySelector('#stylerParentBtn');
    const parentCandidate = selectedElement.parentElement?.closest('.slide.active ' + CANDIDATE_SELECTOR) ||
                            (selectedElement.parentElement?.classList.contains('slide') ? null : selectedElement.parentElement);
    if (parentBtn) {
      parentBtn.disabled = !parentCandidate;
      parentBtn.style.opacity = parentCandidate ? '1' : '0.4';
    }

    // Re-rendre les nuances personnalisées
    renderCustomColors();

    // Synchroniser les contrôles de forme et d'arrondi
    syncBorderShapeUI();

    // Ouvrir et positionner
    positionPopover(selectedElement);
    popoverEl.classList.add('open');
    updateActiveSwatchHighlight();
  }

  function selectParent() {
    if (!selectedElement) return;
    const parent = selectedElement.parentElement;
    if (parent && !parent.classList.contains('slide') && !parent.classList.contains('slides-viewport')) {
      selectElement(parent);
    }
  }

  function closePopover() {
    if (selectedElement) {
      selectedElement.classList.remove('styler-selected-target');
      selectedElement = null;
    }
    if (popoverEl) {
      popoverEl.classList.remove('open');
    }
  }

  function activate() {
    isModeActive = true;
    createStylerDOM();
    document.body.classList.add('deck-styler-mode');
    
    // Mettre à jour le bouton dans le header
    const btn = document.getElementById('elementStylerBtn');
    if (btn) btn.classList.add('active');

    showToast('Mode Styliseur activé — Cliquez sur un élément');
  }

  function deactivate() {
    isModeActive = false;
    closePopover();
    document.body.classList.remove('deck-styler-mode');
    
    const btn = document.getElementById('elementStylerBtn');
    if (btn) btn.classList.remove('active');
  }

  function toggle() {
    if (isModeActive) deactivate();
    else activate();
  }

  function init() {
    createStylerDOM();

    // Restauration automatique de tous les styles personnalisés précédemment sauvegardés
    restoreAllStyles();

    // Clic global pour intercepter les éléments quand le mode est actif
    window.addEventListener('click', (e) => {
      if (!isModeActive) return;

      // Si le clic provient de l'interface du styliseur ou du header de contrôle, ignorer
      if (e.target.closest('#stylerPopover') || 
          e.target.closest('#stylerBanner') || 
          e.target.closest('#elementStylerBtn') ||
          e.target.closest('.deck-header')) {
        return;
      }

      const activeSlide = document.querySelector('.slide.active');
      if (!activeSlide) return;

      // Cherche l'élément candidat le plus proche du clic dans le slide actif
      const target = e.target.closest(CANDIDATE_SELECTOR);
      if (target && activeSlide.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
        selectElement(target);
      } else {
        // Clic dans le vide du slide -> ferme le popover
        closePopover();
      }
    }, true); // Use capture to intercept before slide navigation!

    // Écoute des changements de slide pour refermer le popover si ouvert
    window.addEventListener('hashchange', () => {
      if (isModeActive) {
        closePopover();
      }
    });
  }

  return {
    init,
    activate,
    deactivate,
    toggle,
    isActive: () => isModeActive,
    closePopover,
    selectElement,
    addCustomColor,
    deleteCustomColor,
    getCustomColors,
    restoreAllStyles,
    resetAllStyles
  };
})();
