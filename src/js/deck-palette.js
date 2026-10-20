/**
 * Deck Engine - Palette & Accent Color Manager
 * Sous-responsabilité : Gestion des nuances d'accent, presets vibrants,
 * pipette visuelle, saisie de code hexadécimal, historique et persistance.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Palette = (function () {
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

  function lightenColor(col, percent) {
    if (!col || typeof col !== 'string' || !col.startsWith('#')) return col;
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
      const stored = localStorage.getItem('deck_custom_colors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveCustomColors(colors) {
    try {
      localStorage.setItem('deck_custom_colors', JSON.stringify(colors));
    } catch (e) {
      console.warn('Erreur sauvegarde custom colors:', e);
    }
  }

  function renderCustomColors() {
    const customSection = document.getElementById('customColorsSection');
    const customSwatches = document.getElementById('customSwatches');
    if (!customSwatches) return;

    const colors = getCustomColors();
    if (!colors || colors.length === 0) {
      if (customSection) customSection.style.display = 'none';
      customSwatches.innerHTML = '';
      return;
    }

    if (customSection) customSection.style.display = 'flex';
    customSwatches.innerHTML = colors.map(col => `
      <div class="custom-dot-wrap">
        <button class="palette-dot ${col.toUpperCase() === currentAccentColor.toUpperCase() ? 'active' : ''}" 
                data-color="${col}" 
                title="${col}" 
                style="--dot-color: ${col};"></button>
        <button class="custom-dot-delete" data-delete-color="${col}" title="Supprimer ${col}">&times;</button>
      </div>
    `).join('');
  }

  function addCustomColor(hex) {
    const norm = normalizeHexColor(hex);
    if (!norm) return false;
    const colors = getCustomColors();
    if (!colors.map(c => c.toUpperCase()).includes(norm)) {
      colors.unshift(norm);
      if (colors.length > 14) colors.pop();
      saveCustomColors(colors);
    }
    renderCustomColors();
    return true;
  }

  function setAccentColor(colorHex, save = true) {
    if (!colorHex) return;
    const norm = normalizeHexColor(colorHex) || colorHex;
    currentAccentColor = norm;
    document.documentElement.style.setProperty('--accent-primary', norm);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(norm, 16));
    const containerEl = document.querySelector('.deck-container');
    if (containerEl) {
      containerEl.style.setProperty('--accent-primary', norm);
      containerEl.style.setProperty('--accent-hover', lightenColor(norm, 16));
    }

    if (save) {
      localStorage.setItem('deck_accent_color', norm);
      localStorage.setItem('deck_sync_accent_color', norm);
    }

    const dot = document.getElementById('currentColorDot');
    if (dot) dot.style.background = norm;

    const input = document.getElementById('customColorPickerInput');
    if (input) input.value = norm;

    const hexInput = document.getElementById('hexColorInput');
    if (hexInput && document.activeElement !== hexInput) {
      hexInput.value = norm.toUpperCase();
    }

    document.querySelectorAll('.palette-dot').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-color')?.toUpperCase() === norm.toUpperCase());
    });

    if (window.DeckEngine.Navigation && window.DeckEngine.Navigation.broadcastMessage) {
      window.DeckEngine.Navigation.broadcastMessage({ type: 'accentColor', color: norm });
    }

    // Ré-adaptation des diagrammes Mermaid à la nouvelle couleur d'accent
    if (window.DeckEngine.Mermaid && typeof window.DeckEngine.Mermaid.render === 'function') {
      window.DeckEngine.Mermaid.render();
    }
  }

  function cycleAccentColor() {
    const customColors = getCustomColors();
    const allPresets = [...ACCENT_PRESETS, ...customColors.map(c => ({ name: c, hex: c }))];
    const norm = currentAccentColor.toUpperCase();
    const currIdx = allPresets.findIndex(p => p.hex.toUpperCase() === norm);
    const nextIdx = (currIdx + 1) % allPresets.length;
    setAccentColor(allPresets[nextIdx].hex, true);
  }

  function handleApplyHexColor() {
    const hexInput = document.getElementById('hexColorInput');
    const hexInputWrap = document.getElementById('hexInputWrap');
    const customColorPickerInput = document.getElementById('customColorPickerInput');
    const colorPalettePopover = document.getElementById('colorPalettePopover');

    const raw = hexInput?.value || '';
    const norm = normalizeHexColor(raw);
    if (norm) {
      hexInputWrap?.classList.remove('invalid');
      addCustomColor(norm);
      setAccentColor(norm, true);
      if (hexColorInput) hexColorInput.value = norm;
      if (customColorPickerInput) customColorPickerInput.value = norm;
      colorPalettePopover?.classList.remove('open');
    } else {
      hexInputWrap?.classList.add('invalid');
      setTimeout(() => hexInputWrap?.classList.remove('invalid'), 800);
    }
  }

  function handleAddHexColor() {
    const hexInput = document.getElementById('hexColorInput');
    const hexInputWrap = document.getElementById('hexInputWrap');
    const customColorPickerInput = document.getElementById('customColorPickerInput');
    const addHexColorBtn = document.getElementById('addHexColorBtn');

    const raw = hexInput?.value || '';
    const norm = normalizeHexColor(raw);
    if (norm) {
      hexInputWrap?.classList.remove('invalid');
      addCustomColor(norm);
      if (hexColorInput) hexColorInput.value = norm;
      if (customColorPickerInput) customColorPickerInput.value = norm;
      if (addHexColorBtn) {
        const origText = addHexColorBtn.textContent;
        addHexColorBtn.textContent = '✓ Ajouté';
        setTimeout(() => { if (addHexColorBtn) addHexColorBtn.textContent = origText; }, 1200);
      }
    } else {
      hexInputWrap?.classList.add('invalid');
      setTimeout(() => hexInputWrap?.classList.remove('invalid'), 800);
    }
  }

  function init() {
    renderCustomColors();

    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorPalettePopover = document.getElementById('colorPalettePopover');
    const customColorPickerInput = document.getElementById('customColorPickerInput');
    const hexColorInput = document.getElementById('hexColorInput');
    const applyHexColorBtn = document.getElementById('applyHexColorBtn');
    const addHexColorBtn = document.getElementById('addHexColorBtn');
    const hexInputWrap = document.getElementById('hexInputWrap');

    colorPickerBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = colorPalettePopover?.classList.toggle('open');
      if (isOpen) {
        if (hexColorInput) hexColorInput.value = currentAccentColor.toUpperCase();
        if (customColorPickerInput) customColorPickerInput.value = currentAccentColor;
        renderCustomColors();
      }
    });

    colorPalettePopover?.addEventListener('click', (e) => {
      const dot = e.target.closest('.palette-dot');
      if (dot) {
        e.stopPropagation();
        const col = dot.getAttribute('data-color');
        if (col) {
          setAccentColor(col, true);
          if (hexColorInput) hexColorInput.value = col.toUpperCase();
          if (customColorPickerInput) customColorPickerInput.value = col;
        }
        colorPalettePopover?.classList.remove('open');
        return;
      }

      const delBtn = e.target.closest('.custom-dot-delete');
      if (delBtn) {
        e.stopPropagation();
        const colToDelete = delBtn.getAttribute('data-delete-color');
        if (colToDelete) {
          const colors = getCustomColors().filter(c => c.toUpperCase() !== colToDelete.toUpperCase());
          saveCustomColors(colors);
          renderCustomColors();
        }
        return;
      }
    });

    customColorPickerInput?.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase();
      if (hexColorInput) hexColorInput.value = val;
    });

    customColorPickerInput?.addEventListener('change', (e) => {
      const val = e.target.value.toUpperCase();
      if (hexColorInput) hexColorInput.value = val;
      setAccentColor(val, true);
      addCustomColor(val);
      colorPalettePopover?.classList.remove('open');
    });

    hexColorInput?.addEventListener('input', (e) => {
      const norm = normalizeHexColor(e.target.value);
      if (norm) {
        hexInputWrap?.classList.remove('invalid');
        if (customColorPickerInput) customColorPickerInput.value = norm;
      }
    });

    hexColorInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApplyHexColor();
      }
    });

    applyHexColorBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleApplyHexColor();
    });

    addHexColorBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAddHexColor();
    });

    document.getElementById('clearCustomColorsBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      saveCustomColors([]);
      renderCustomColors();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#colorPickerWrap')) {
        colorPalettePopover?.classList.remove('open');
      }
    });

    // Initialisation depuis l'URL ou le localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const colorParam = urlParams.get('color') || urlParams.get('accent');
    if (colorParam) {
      const formattedColor = colorParam.startsWith('#') ? colorParam : ('#' + colorParam);
      setAccentColor(formattedColor, true);
    } else if (currentAccentColor) {
      setAccentColor(currentAccentColor, false);
    }
  }

  return {
    init: init,
    setAccentColor: setAccentColor,
    cycleAccentColor: cycleAccentColor,
    getCurrentColor: () => currentAccentColor,
    lightenColor: lightenColor,
    normalizeHexColor: normalizeHexColor
  };
})();

window.setAccentColor = window.DeckEngine.Palette.setAccentColor;
