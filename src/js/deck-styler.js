/**
 * Deck Engine - Component Color Inspector & Styler
 * Sous-responsabilité : Sélection visuelle au clic de n'importe quel composant
 * (cartes, badges, titres, boîtes, KPIs...) et modification en direct de sa
 * couleur de fond, couleur d'écriture et bordure avec la palette du Design System
 * ainsi que l'enregistrement de couleurs personnalisées réutilisables.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Styler = (function () {
  let isModeActive = false;
  let selectedElement = null;
  let currentProperty = 'background'; // 'background' | 'color' | 'borderColor'
  let popoverEl = null;
  let bannerEl = null;
  let toastEl = null;

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

  function getCustomColors() {
    try {
      const stored = localStorage.getItem('deck_styler_custom_colors');
      if (stored) return JSON.parse(stored);
      // Synchronisation initiale avec les couleurs personnalisées du thème global si existantes
      const fallback = localStorage.getItem('deck_custom_colors');
      return fallback ? JSON.parse(fallback) : [];
    } catch {
      return [];
    }
  }

  function saveCustomColors(colors) {
    try {
      localStorage.setItem('deck_styler_custom_colors', JSON.stringify(colors));
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

  function createStylerDOM() {
    if (popoverEl) return;

    // 1. Bannière d'information
    bannerEl = document.createElement('div');
    bannerEl.className = 'styler-banner';
    bannerEl.id = 'stylerBanner';
    bannerEl.innerHTML = `
      <span class="styler-banner-dot"></span>
      <span>Mode Styliseur actif — Cliquez sur un composant pour changer ses couleurs</span>
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
        <button class="styler-tab-btn" data-prop="borderColor" title="Modifier la couleur de la bordure">🔲 Bordure</button>
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

      <div class="styler-custom-row">
        <input type="color" class="styler-color-native" id="stylerColorInput" value="#E50914" title="Pipette de couleur libre">
        <input type="text" class="styler-hex-input" id="stylerHexInput" value="#E50914" placeholder="#HEX ou couleur" spellcheck="false">
        <button class="styler-action-btn primary" id="stylerApplyHexBtn" style="padding: 2px 8px; flex: initial;" title="Appliquer cette couleur au composant">Appliquer</button>
        <button class="styler-action-btn" id="stylerAddHexBtn" style="padding: 2px 8px; flex: initial;" title="Enregistrer cette nuance dans Mes Nuances Personnalisées">+ Sauvegarder</button>
      </div>

      <div class="styler-actions">
        <button class="styler-action-btn" id="stylerCopyStyleBtn" title="Copier le style inline dans le presse-papiers">
          📋 Copier style
        </button>
        <button class="styler-action-btn" id="stylerCopyHtmlBtn" title="Copier le code HTML complet du composant">
          &lt;/&gt; Copier HTML
        </button>
        <button class="styler-action-btn" id="stylerResetBtn" title="Réinitialiser les styles personnalisés">
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
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentProperty = btn.getAttribute('data-prop');
        updatePaletteLabel();
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
          showToast(`✓ Nuance ${normalizeHexColor(val)} enregistrée !`);
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

    // Réinitialiser
    popoverEl.querySelector('#stylerResetBtn')?.addEventListener('click', () => {
      if (!selectedElement) return;
      selectedElement.style.background = '';
      selectedElement.style.backgroundColor = '';
      selectedElement.style.color = '';
      selectedElement.style.borderColor = '';
      if (selectedElement.getAttribute('style') === '') {
        selectedElement.removeAttribute('style');
      }
      updateActiveSwatchHighlight();
      showToast('Styles personnalisés réinitialisés');
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
    else if (currentProperty === 'borderColor') labelEl.textContent = 'Nuancier Couleur Bordure';
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
      selectedElement.style.background = colorVal;
      selectedElement.style.backgroundColor = colorVal;
    } else if (currentProperty === 'color') {
      selectedElement.style.color = colorVal;
    } else if (currentProperty === 'borderColor') {
      selectedElement.style.borderColor = colorVal;
    }

    updateActiveSwatchHighlight();
  }

  function positionPopover(targetEl) {
    if (!popoverEl || !targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const popoverWidth = 320;
    const popoverHeight = 410;
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

    // Re-rendre les nuances personnalisées au cas où elles auraient changé
    renderCustomColors();

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
    getCustomColors
  };
})();
