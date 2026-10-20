/**
 * Console Présentateur Dual-Screen & Synchronisation
 */

function populateSpeakerWindow(speakerWindow) {
  if (!speakerWindow) return;

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const currentIndex = window.getCurrentSlideIndex ? window.getCurrentSlideIndex() : 0;

  // Détection du thème du document parent (support des 7 ambiances)
  const KNOWN_THEMES = ['dark', 'light', 'nordic', 'cyberpunk', 'emerald', 'navy', 'sepia'];
  const THEME_ICONS = {
    dark: '🌑',
    light: '☀️',
    nordic: '❄️',
    cyberpunk: '⚡',
    emerald: '🌲',
    navy: '⚓',
    sepia: '☕'
  };

  const detectedTheme = (window.DeckEngine?.Theme && typeof window.DeckEngine.Theme.getCurrentThemeId === 'function' ? window.DeckEngine.Theme.getCurrentThemeId() : null) ||
                        document.querySelector('.deck-container')?.getAttribute('data-theme') ||
                        document.body.getAttribute('data-theme') ||
                        localStorage.getItem('deck_sync_theme') ||
                        localStorage.getItem('deck_user_theme') ||
                        (document.body.classList.contains('theme-light') ? 'light' : 'dark');
  const activeParentTheme = KNOWN_THEMES.includes(detectedTheme) ? detectedTheme : 'dark';
  const isParentLight = activeParentTheme === 'light';

  function lightenColor(col, percent) {
    if (!col || typeof col !== 'string' || !col.startsWith('#')) return col || '#FF2A2A';
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

  const containerEl = document.querySelector('.deck-container');
  const currentAccentColor = localStorage.getItem('deck_accent_color') ||
    (containerEl && getComputedStyle(containerEl).getPropertyValue('--accent-primary').trim()) ||
    getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() ||
    '#E50914';
  const currentAccentHover = lightenColor(currentAccentColor, 16);

  // 1. Récupération des styles inline éventuels
  const parentStyles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');

  // 2. Récupération des données sérialisées de toutes les slides
  const slidesData = [];
  slides.forEach((s, idx) => {
    let slideTheme = s.getAttribute('data-theme');
    if (!slideTheme) {
      if (s.classList.contains('light') || s.classList.contains('theme-light')) slideTheme = 'light';
      else if (s.classList.contains('dark') || s.classList.contains('theme-dark')) slideTheme = 'dark';
      else slideTheme = ''; // Suit dynamiquement le thème actif
    }

    const contentHtml = s.querySelector('.slide-content')?.innerHTML || '';
    const logosHtml = Array.from(s.querySelectorAll('.slide-logo, .slide-bottom-logos')).map(el => el.outerHTML).join('');

    slidesData.push({
      index: idx,
      title: s.getAttribute('data-title') || `Slide ${idx + 1}`,
      notes: s.getAttribute('data-notes') || 'Aucune note disponible.',
      theme: slideTheme,
      accent: s.getAttribute('data-accent') || '',
      accentHover: s.getAttribute('data-accent-hover') || '',
      html: contentHtml + logosHtml
    });
  });

  // 3. Injection du code avec les styles complets et centrage 16:9 rigide
  speakerWindow.document.open();
  speakerWindow.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <base href="${window.location.href}">
  <title>Console Présentateur - Dual Screen</title>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
  <link rel="stylesheet" href="src/css/deck.css">
  
  <style>
    /* STYLES HÉRITÉS DU DOCUMENT PARENT */
    ${parentStyles}

    /* VARIABLES SPÉCIFIQUES CONSOLE PRÉSENTATEUR (SOMBRE & CLAIR) */
    :root {
      --accent-primary: ${currentAccentColor};
      --accent-hover: ${currentAccentHover};
    }

    /* VARIABLES DU PRÉSENTATEUR PAR THÈME D'AMBIANCE */
    :root,
    body {
      --sp-bg: #141414;
      --sp-panel: #1F1F1F;
      --sp-panel-header: #2B2B2B;
      --sp-border: #333333;
      --sp-text: #FFFFFF;
      --sp-text-muted: #A3A3A3;
      --sp-box-bg: #0B0B0B;
      --sp-inner-border: #2B2B2B;
    }

    body.theme-light,
    body[data-theme="light"] {
      --sp-bg: #F8FAFC !important;
      --sp-panel: #FFFFFF !important;
      --sp-panel-header: #F1F5F9 !important;
      --sp-border: #E2E8F0 !important;
      --sp-text: #0F172A !important;
      --sp-text-muted: #475569 !important;
      --sp-box-bg: #E2E8F0 !important;
      --sp-inner-border: #CBD5E1 !important;
    }

    body.theme-dark,
    body[data-theme="dark"] {
      --sp-bg: #141414 !important;
      --sp-panel: #1F1F1F !important;
      --sp-panel-header: #2B2B2B !important;
      --sp-border: #333333 !important;
      --sp-text: #FFFFFF !important;
      --sp-text-muted: #A3A3A3 !important;
      --sp-box-bg: #0B0B0B !important;
      --sp-inner-border: #2B2B2B !important;
    }

    body.theme-nordic,
    body[data-theme="nordic"] {
      --sp-bg: #0F172A !important;
      --sp-panel: #1E293B !important;
      --sp-panel-header: #334155 !important;
      --sp-border: #334155 !important;
      --sp-text: #F1F5F9 !important;
      --sp-text-muted: #94A3B8 !important;
      --sp-box-bg: #090E17 !important;
      --sp-inner-border: #334155 !important;
    }

    body.theme-cyberpunk,
    body[data-theme="cyberpunk"] {
      --sp-bg: #07090E !important;
      --sp-panel: #111622 !important;
      --sp-panel-header: #192033 !important;
      --sp-border: #222C42 !important;
      --sp-text: #F0F6FC !important;
      --sp-text-muted: #8B949E !important;
      --sp-box-bg: #030407 !important;
      --sp-inner-border: #222C42 !important;
    }

    body.theme-emerald,
    body[data-theme="emerald"] {
      --sp-bg: #06150F !important;
      --sp-panel: #0C241B !important;
      --sp-panel-header: #14382B !important;
      --sp-border: #184233 !important;
      --sp-text: #ECFDF5 !important;
      --sp-text-muted: #A7F3D0 !important;
      --sp-box-bg: #030B07 !important;
      --sp-inner-border: #184233 !important;
    }

    body.theme-navy,
    body[data-theme="navy"] {
      --sp-bg: #080E1E !important;
      --sp-panel: #121D38 !important;
      --sp-panel-header: #1B2B50 !important;
      --sp-border: #233766 !important;
      --sp-text: #F8FAFC !important;
      --sp-text-muted: #94A3B8 !important;
      --sp-box-bg: #040812 !important;
      --sp-inner-border: #233766 !important;
    }

    body.theme-sepia,
    body[data-theme="sepia"] {
      --sp-bg: #191614 !important;
      --sp-panel: #26221F !important;
      --sp-panel-header: #38322E !important;
      --sp-border: #453D38 !important;
      --sp-text: #FAF5F0 !important;
      --sp-text-muted: #D6C7BC !important;
      --sp-box-bg: #0F0D0C !important;
      --sp-inner-border: #453D38 !important;
    }

    html, body {
      width: 100vw !important;
      height: 100vh !important;
      background: var(--sp-bg) !important;
      color: var(--sp-text) !important;
      font-family: 'Inter', sans-serif !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      margin: 0 !important;
      padding: 0 !important;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    header.sp-header {
      background: var(--sp-panel);
      border-bottom: 1px solid var(--sp-border);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      flex-shrink: 0;
      color: var(--sp-text);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .sp-timer-wrap { display: flex; align-items: center; gap: 0.75rem; font-family: 'Fira Code', monospace; }
    .sp-timer-val { font-size: 1.25rem; font-weight: 700; color: #10B981; }
    .sp-clock-val { font-size: 0.95rem; color: var(--sp-text-muted); }
    
    .sp-btn {
      background: var(--sp-panel-header);
      border: 1px solid var(--sp-border);
      color: var(--sp-text);
      padding: 0.35rem 0.75rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s;
      font-family: inherit;
    }
    .sp-btn:hover { background: var(--sp-border); }
    .sp-btn.primary { background: var(--accent-primary, #E50914); border-color: var(--accent-primary, #E50914); color: #FFF; }
    .sp-btn.primary:hover { opacity: 0.9; }

    main.sp-main {
      flex: 1;
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 1rem;
      padding: 1rem;
      overflow: hidden;
    }

    .sp-panel {
      background: var(--sp-panel);
      border: 1px solid var(--sp-border);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0,0,0,0.06);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .sp-panel-header {
      background: var(--sp-panel-header);
      border-bottom: 1px solid var(--sp-border);
      padding: 0.5rem 1rem;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--sp-text-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      transition: background-color 0.25s ease;
    }

    /* Cadres d'aperçus avec centrage flex */
    .sp-preview-box {
      flex: 1;
      position: relative;
      background: var(--sp-box-bg);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.25s ease;
    }

    .sp-preview-inner {
      width: 1240px;
      min-height: 700px;
      height: auto;
      position: absolute;
      transform-origin: center center;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.5rem 2.2rem;
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid var(--sp-inner-border);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: background-color 0.25s ease, color 0.25s ease;
      overflow: hidden;
    }

    /* Adaptation dynamique selon le mode d'ambiance de chaque slide dans l'aperçu */
    .sp-preview-inner.theme-light,
    .sp-preview-inner[data-theme="light"] {
      background: #F8FAFC !important;
      color: #0F172A !important;
      --bg-dark: #F8FAFC;
      --card-bg: #FFFFFF;
      --card-hover: #F1F5F9;
      --border-dark: #E2E8F0;
      --text-main: #0F172A;
      --text-muted: #475569;
      --text-dim: #94A3B8;
      --code-bg: #1E293B;
    }

    .sp-preview-inner.theme-dark,
    .sp-preview-inner[data-theme="dark"] {
      background: #141414 !important;
      color: #FFFFFF !important;
      --bg-dark: #141414;
      --card-bg: #1F1F1F;
      --card-hover: #2B2B2B;
      --border-dark: #333333;
      --text-main: #FFFFFF;
      --text-muted: #A3A3A3;
      --text-dim: #737373;
      --code-bg: #0B0B0B;
    }

    .sp-preview-inner.theme-nordic,
    .sp-preview-inner[data-theme="nordic"] {
      background: #0F172A !important;
      color: #F1F5F9 !important;
      --bg-dark: #0F172A;
      --card-bg: #1E293B;
      --card-hover: #334155;
      --border-dark: #334155;
      --text-main: #F1F5F9;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --code-bg: #090E17;
    }

    .sp-preview-inner.theme-cyberpunk,
    .sp-preview-inner[data-theme="cyberpunk"] {
      background: #07090E !important;
      color: #F0F6FC !important;
      --bg-dark: #07090E;
      --card-bg: #111622;
      --card-hover: #192033;
      --border-dark: #222C42;
      --text-main: #F0F6FC;
      --text-muted: #8B949E;
      --text-dim: #586069;
      --code-bg: #030407;
    }

    .sp-preview-inner.theme-emerald,
    .sp-preview-inner[data-theme="emerald"] {
      background: #06150F !important;
      color: #ECFDF5 !important;
      --bg-dark: #06150F;
      --card-bg: #0C241B;
      --card-hover: #14382B;
      --border-dark: #184233;
      --text-main: #ECFDF5;
      --text-muted: #A7F3D0;
      --text-dim: #6EE7B7;
      --code-bg: #030B07;
    }

    .sp-preview-inner.theme-navy,
    .sp-preview-inner[data-theme="navy"] {
      background: #080E1E !important;
      color: #F8FAFC !important;
      --bg-dark: #080E1E;
      --card-bg: #121D38;
      --card-hover: #1B2B50;
      --border-dark: #233766;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --code-bg: #040812;
    }

    .sp-preview-inner.theme-sepia,
    .sp-preview-inner[data-theme="sepia"] {
      background: #191614 !important;
      color: #FAF5F0 !important;
      --bg-dark: #191614;
      --card-bg: #26221F;
      --card-hover: #38322E;
      --border-dark: #453D38;
      --text-main: #FAF5F0;
      --text-muted: #D6C7BC;
      --text-dim: #A8998C;
      --code-bg: #0F0D0C;
    }

    .sp-notes-box {
      flex: 1;
      padding: 1.4rem;
      overflow-y: auto;
      font-size: 1.15rem;
      line-height: 1.65;
      color: var(--sp-text);
      background: var(--sp-panel);
      white-space: pre-wrap;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    footer.sp-footer {
      background: var(--sp-panel);
      border-top: 1px solid var(--sp-border);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      flex-shrink: 0;
      color: var(--sp-text-muted);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    select.sp-select {
      background: var(--sp-panel-header);
      border: 1px solid var(--sp-border);
      color: var(--sp-text);
      padding: 0.35rem 0.75rem;
      border-radius: 5px;
      font-family: inherit;
      font-size: 0.85rem;
    }
  </style>
</head>
<body class="theme-${activeParentTheme}" data-theme="${activeParentTheme}">
  <header class="sp-header">
    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.92rem; display: flex; align-items: center; gap: 0.6rem;">
      <span>CONSOLE <span style="color: var(--accent-primary, #E50914);">PRÉSENTATEUR</span></span>
      <button id="spThemeToggleBtn" class="sp-btn" title="Changer l'ambiance visuelle de la console">
        ${THEME_ICONS[activeParentTheme] || '🌑'}
      </button>
    </div>
    
    <div class="sp-timer-wrap">
      <span>⏱ <span id="timerText" class="sp-timer-val">00:00:00</span></span>
      <button id="pauseTimerBtn" class="sp-btn">Pause</button>
      <button id="resetTimerBtn" class="sp-btn">Reset</button>
      <span style="margin-left: 0.8rem;">🕒 <span id="clockText" class="sp-clock-val">--:--:--</span></span>
    </div>

    <div style="display: flex; gap: 0.4rem; align-items: center;">
      <span style="font-size: 0.75rem; color: var(--sp-text-muted);">Notes :</span>
      <button id="notesMinusBtn" class="sp-btn">A-</button>
      <button id="notesPlusBtn" class="sp-btn">A+</button>
    </div>
  </header>

  <main class="sp-main">
    <!-- Colonne Gauche : Aperçus Slides (Actuelle & Suivante) -->
    <div style="display: flex; flex-direction: column; gap: 1rem; overflow: hidden;">
      <div class="sp-panel" style="flex: 1.25;">
        <div class="sp-panel-header">
          <span>Slide Actuelle (<span id="currSlideIdxTxt">1</span> / ${totalSlides})</span>
          <span id="currSlideTitleTxt" style="color: var(--sp-text); font-weight: 700;">-</span>
        </div>
        <div class="sp-preview-box" id="currentBox">
          <div id="currentSlideContent" class="sp-preview-inner slide-content"></div>
        </div>
      </div>

      <div class="sp-panel" style="flex: 0.75;">
        <div class="sp-panel-header">
          <span>Slide Suivante (Next)</span>
          <span id="nextSlideTitleTxt" style="color: var(--accent-primary, #E50914); font-weight: 700;">-</span>
        </div>
        <div class="sp-preview-box" id="nextBox">
          <div id="nextSlideContent" class="sp-preview-inner slide-content"></div>
        </div>
      </div>
    </div>

    <!-- Colonne Droite : Notes d'orateur -->
    <div class="sp-panel">
      <div class="sp-panel-header">
        <span>Notes de l'Orateur</span>
        <span style="font-size: 0.7rem; color: #10B981;">● Synchronisé</span>
      </div>
      <div id="speakerNotesArea" class="sp-notes-box"></div>
    </div>
  </main>

  <footer class="sp-footer">
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <button id="prevSlideBtn" class="sp-btn">&larr; Précédente</button>
      <button id="nextSlideBtn" class="sp-btn primary">Suivante &rarr;</button>
      <select id="jumpSlideSelect" class="sp-select"></select>
    </div>
    <div style="font-size: 0.75rem; color: var(--sp-text-muted);">
      Touches Clavier actives (<kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>Espace</kbd>)
    </div>
  </footer>

  <script>
    const slidesData = ${JSON.stringify(slidesData).replace(/<\/script/gi, '<\\/script')};
    let activeIdx = ${currentIndex};
    let currentFontSize = 1.15;

    function lightenColor(col, percent) {
      if (!col || typeof col !== 'string' || !col.startsWith('#')) return col || '#FF2A2A';
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

    function setAccentColor(color) {
      if (!color) return;
      document.documentElement.style.setProperty('--accent-primary', color);
      document.documentElement.style.setProperty('--accent-hover', lightenColor(color, 16));
    }

    const channel = new BroadcastChannel('deck_channel_sync');
    channel.onmessage = (e) => {
      if (e.data) {
        if (typeof e.data.theme === 'string') {
          setConsoleTheme(e.data.theme);
        }
        if (e.data.type === 'accentColor' && e.data.color) {
          setAccentColor(e.data.color);
        }
        if (typeof e.data.slideIndex === 'number') {
          updateUI(e.data.slideIndex, false);
        }
      }
    };

    window.addEventListener('storage', (e) => {
      if (e.key === 'deck_sync_slide' && e.newValue !== null) {
        updateUI(parseInt(e.newValue, 10), false);
      }
      if (e.key === 'deck_sync_theme' && e.newValue !== null) {
        setConsoleTheme(e.newValue);
      }
      if ((e.key === 'deck_sync_accent_color' || e.key === 'deck_accent_color') && e.newValue) {
        setAccentColor(e.newValue);
      }
    });

    const KNOWN_THEMES = ['dark', 'light', 'nordic', 'cyberpunk', 'emerald', 'navy', 'sepia'];
    const THEME_ICONS = {
      dark: '🌑',
      light: '☀️',
      nordic: '❄️',
      cyberpunk: '⚡',
      emerald: '🌲',
      navy: '⚓',
      sepia: '☕'
    };

    function setConsoleTheme(theme) {
      const activeTheme = KNOWN_THEMES.includes(theme) ? theme : 'dark';
      KNOWN_THEMES.forEach(function (t) {
        document.body.classList.remove('theme-' + t);
      });
      document.body.classList.add('theme-' + activeTheme);
      document.body.setAttribute('data-theme', activeTheme);
      const btn = document.getElementById('spThemeToggleBtn');
      if (btn) btn.textContent = THEME_ICONS[activeTheme] || '🌑';
      updateUI(activeIdx, false);
    }

    const spThemeBtn = document.getElementById('spThemeToggleBtn');
    if (spThemeBtn) {
      spThemeBtn.onclick = () => {
        const curTheme = document.body.getAttribute('data-theme') || 'dark';
        const curIdx = KNOWN_THEMES.indexOf(curTheme);
        const nextTheme = KNOWN_THEMES[(curIdx + 1) % KNOWN_THEMES.length];
        setConsoleTheme(nextTheme);
        channel.postMessage({ theme: nextTheme });
        localStorage.setItem('deck_sync_theme', nextTheme);
      };
    }

    function sendSlideChange(idx) {
      activeIdx = idx;
      channel.postMessage({ slideIndex: activeIdx });
      localStorage.setItem('deck_sync_slide', activeIdx.toString());
      updateUI(activeIdx, false);
    }

    const jumpSelect = document.getElementById('jumpSlideSelect');
    slidesData.forEach((s, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = (idx + 1) + '. ' + s.title;
      jumpSelect.appendChild(opt);
    });
    jumpSelect.addEventListener('change', (e) => sendSlideChange(parseInt(e.target.value, 10)));

    function scaleElement(boxId, contentId) {
      const box = document.getElementById(boxId);
      const content = document.getElementById(contentId);
      if (!box || !content) return;

      const contentWidth = 1240;
      // Mesure de la hauteur naturelle réelle requise par le contenu (plancher à 700px pour préserver le 16:9)
      const naturalHeight = Math.max(700, content.offsetHeight || 0, content.scrollHeight || 0);

      const availableWidth = Math.max(20, box.clientWidth - 24);
      const availableHeight = Math.max(20, box.clientHeight - 24);

      // Calcul de l'échelle assurant que largeur et hauteur sont TOUTES LES DEUX 100% contenues
      const scale = Math.min(availableWidth / contentWidth, availableHeight / naturalHeight);
      content.style.transform = 'scale(' + Math.max(scale, 0.05) + ')';
    }

    function updateUI(idx, notify = true) {
      if (idx < 0) idx = 0;
      if (idx >= slidesData.length) idx = slidesData.length - 1;
      activeIdx = idx;

      jumpSelect.value = activeIdx;
      document.getElementById('currSlideIdxTxt').textContent = activeIdx + 1;
      document.getElementById('currSlideTitleTxt').textContent = slidesData[activeIdx].title;

      // Mise à jour de l'aperçu actuel avec le thème propre à la slide ou le thème global
      const sData = slidesData[activeIdx];
      const curElem = document.getElementById('currentSlideContent');
      const curGlobalTheme = document.body.getAttribute('data-theme') || 'dark';
      const curTheme = sData.theme || curGlobalTheme;
      KNOWN_THEMES.forEach(t => curElem.classList.remove('theme-' + t));
      curElem.classList.add('theme-' + curTheme);
      curElem.setAttribute('data-theme', curTheme);
      if (sData.accent) {
        curElem.style.setProperty('--accent-primary', sData.accent);
        curElem.style.setProperty('--accent-hover', sData.accentHover || lightenColor(sData.accent, 16));
      } else {
        curElem.style.removeProperty('--accent-primary');
        curElem.style.removeProperty('--accent-hover');
      }
      curElem.innerHTML = sData.html;

      document.getElementById('speakerNotesArea').textContent = sData.notes;

      // Mise à jour de l'aperçu suivant
      const nextElem = document.getElementById('nextSlideContent');
      if (activeIdx < slidesData.length - 1) {
        const nextData = slidesData[activeIdx + 1];
        const nextTheme = nextData.theme || curTheme;
        KNOWN_THEMES.forEach(t => nextElem.classList.remove('theme-' + t));
        nextElem.classList.add('theme-' + nextTheme);
        nextElem.setAttribute('data-theme', nextTheme);
        if (nextData.accent) {
          nextElem.style.setProperty('--accent-primary', nextData.accent);
          nextElem.style.setProperty('--accent-hover', nextData.accentHover || lightenColor(nextData.accent, 16));
        } else {
          nextElem.style.removeProperty('--accent-primary');
          nextElem.style.removeProperty('--accent-hover');
        }
        document.getElementById('nextSlideTitleTxt').textContent = nextData.title;
        nextElem.innerHTML = nextData.html;
      } else {
        document.getElementById('nextSlideTitleTxt').textContent = 'Fin de la présentation';
        KNOWN_THEMES.forEach(t => nextElem.classList.remove('theme-' + t));
        nextElem.classList.add('theme-' + curTheme);
        nextElem.setAttribute('data-theme', curTheme);
        nextElem.style.removeProperty('--accent-primary');
        nextElem.style.removeProperty('--accent-hover');
        nextElem.innerHTML = '<div style="text-align:center;color:var(--sp-text-muted);font-size:2rem;font-weight:800;padding-top:200px;">FIN DES SLIDES</div>';
      }

      scaleElement('currentBox', 'currentSlideContent');
      scaleElement('nextBox', 'nextSlideContent');

      // Deuxième passe dans une frame suivante pour garantir la mesure post-rendu
      requestAnimationFrame(() => {
        scaleElement('currentBox', 'currentSlideContent');
        scaleElement('nextBox', 'nextSlideContent');
      });

      if (notify) sendSlideChange(activeIdx);
    }

    window.addEventListener('resize', () => {
      scaleElement('currentBox', 'currentSlideContent');
      scaleElement('nextBox', 'nextSlideContent');
    });

    document.getElementById('prevSlideBtn').onclick = () => { if (activeIdx > 0) sendSlideChange(activeIdx - 1); };
    document.getElementById('nextSlideBtn').onclick = () => { if (activeIdx < slidesData.length - 1) sendSlideChange(activeIdx + 1); };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault(); if (activeIdx < slidesData.length - 1) sendSlideChange(activeIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); if (activeIdx > 0) sendSlideChange(activeIdx - 1);
      }
    });

    document.getElementById('notesPlusBtn').onclick = () => {
      currentFontSize += 0.1;
      document.getElementById('speakerNotesArea').style.fontSize = currentFontSize + 'rem';
    };
    document.getElementById('notesMinusBtn').onclick = () => {
      if (currentFontSize > 0.8) {
        currentFontSize -= 0.1;
        document.getElementById('speakerNotesArea').style.fontSize = currentFontSize + 'rem';
      }
    };

    let seconds = 0;
    let running = true;
    setInterval(() => {
      if (running) {
        seconds++;
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        document.getElementById('timerText').textContent = h + ':' + m + ':' + s;
      }
      document.getElementById('clockText').textContent = new Date().toLocaleTimeString();
    }, 1000);

    const pauseBtn = document.getElementById('pauseTimerBtn');
    pauseBtn.onclick = () => {
      running = !running;
      pauseBtn.textContent = running ? 'Pause' : 'Play';
    };
    document.getElementById('resetTimerBtn').onclick = () => {
      seconds = 0;
      document.getElementById('timerText').textContent = '00:00:00';
    };

    setTimeout(() => updateUI(activeIdx, false), 50);
  <\/script>
</body>
</html>`);
  speakerWindow.document.close();
}

function showPopupBlockedModal() {
  let modal = document.getElementById('popupBlockedModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'popupBlockedModal';
    modal.className = 'modal-overlay open';
    modal.innerHTML = `
      <div class="x-card" style="max-width: 540px; width: 92vw; border: 1.5px solid var(--accent-primary, #E50914); box-shadow: 0 10px 45px rgba(0,0,0,0.25); text-align: center; padding: 1.8rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.6rem;">🖥️</div>
        <h3 style="font-size: 1.3rem; color: var(--text-main); margin-bottom: 0.6rem;">Mode Présentateur Dual-Screen</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1.3rem;">
          Votre navigateur a bloqué l'ouverture automatique de la fenêtre pop-up.<br>
          Cliquez ci-dessous pour l'ouvrir dans un nouvel onglet, ou activez les fenêtres pop-up dans la barre d'adresse.
        </p>
        <div style="display: flex; gap: 0.65rem; justify-content: center; flex-wrap: wrap;">
          <button id="retrySpeakerPopupBtn" class="ctrl-btn primary" style="padding: 0.55rem 1.25rem; font-size: 0.9rem;">
            Ouvrir dans un nouvel onglet
          </button>
          <button id="fallbackNotesBtn" class="ctrl-btn" style="padding: 0.55rem 1rem; font-size: 0.9rem;">
            Ouvrir les notes intégrées (N)
          </button>
          <button id="closePopupBlockedBtn" class="ctrl-btn" style="padding: 0.55rem 0.8rem;">
            Fermer
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('retrySpeakerPopupBtn').onclick = () => {
      modal.classList.remove('open');
      const win = window.open('', '_blank');
      if (win) {
        populateSpeakerWindow(win);
      } else {
        alert("L'ouverture a été bloquée. Veuillez autoriser les fenêtres pop-up dans votre navigateur.");
      }
    };

    document.getElementById('fallbackNotesBtn').onclick = () => {
      modal.classList.remove('open');
      const drawer = document.getElementById('notesDrawer');
      if (drawer) drawer.classList.add('open');
    };

    document.getElementById('closePopupBlockedBtn').onclick = () => {
      modal.classList.remove('open');
    };
  } else {
    modal.classList.add('open');
  }
}

function openSpeakerWindow() {
  let speakerWindow = null;
  try {
    speakerWindow = window.open('', 'DeckSpeakerView', 'width=1180,height=760,menubar=no,toolbar=no,location=no');
  } catch (err) {
    console.warn('Erreur ouverture pop-up dimensionnée:', err);
  }

  // Fallback direct si bloqué
  if (!speakerWindow || speakerWindow.closed || typeof speakerWindow.closed === 'undefined') {
    try {
      speakerWindow = window.open('', '_blank');
    } catch (err) {
      console.warn('Erreur ouverture nouvel onglet:', err);
    }
  }

  if (!speakerWindow) {
    showPopupBlockedModal();
    return;
  }

  try {
    speakerWindow.focus();
  } catch (e) {}

  try {
    populateSpeakerWindow(speakerWindow);
  } catch (err) {
    console.error('Erreur lors du peuplement de la fenêtre présentateur:', err);
  }
}

window.openSpeakerWindow = openSpeakerWindow;

function attachSpeakerListeners() {
  ['speakerWindowBtn', 'speakerModeBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn && !btn.dataset.speakerBound) {
      btn.dataset.speakerBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSpeakerWindow();
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachSpeakerListeners);
} else {
  attachSpeakerListeners();
}
