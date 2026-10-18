/**
 * Console Présentateur Dual-Screen & Synchronisation
 */
function openSpeakerWindow() {
  const speakerWindow = window.open('', 'DeckSpeakerView', 'width=1180,height=760,menubar=no,toolbar=no,location=no');
  if (!speakerWindow) {
    alert('Veuillez autoriser les fenêtres pop-up pour afficher la vue Présentateur.');
    return;
  }

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const currentIndex = window.getCurrentSlideIndex ? window.getCurrentSlideIndex() : 0;

  // 1. Récupération des styles inline éventuels
  const parentStyles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');

  // 2. Récupération des données sérialisées de toutes les slides
  const slidesData = [];
  slides.forEach((s, idx) => {
    slidesData.push({
      index: idx,
      title: s.getAttribute('data-title') || `Slide ${idx + 1}`,
      notes: s.getAttribute('data-notes') || 'Aucune note disponible.',
      html: s.querySelector('.slide-content')?.innerHTML || ''
    });
  });

  // 3. Injection du code avec les styles complets et un centrage 16:9 rigide
  speakerWindow.document.open();
  speakerWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Console Présentateur - Dual Screen</title>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
  <link rel="stylesheet" href="src/css/deck.css">
  
  <style>
    /* STYLES HÉRITÉS INLINE */
    ${parentStyles}

    /* OVERRIDES & INTERFACE SPÉCIFIQUE DU PRÉSENTATEUR */
    :root {
      --sp-bg: #121212;
      --sp-panel: #1A1A1A;
      --sp-border: #333333;
    }
    html, body {
      width: 100vw !important;
      height: 100vh !important;
      background: var(--sp-bg) !important;
      color: #FFF !important;
      font-family: 'Inter', sans-serif !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    }
    header.sp-header {
      background: #181818;
      border-bottom: 1px solid var(--sp-border);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      flex-shrink: 0;
    }
    .sp-timer-wrap { display: flex; align-items: center; gap: 0.75rem; font-family: 'Fira Code', monospace; }
    .sp-timer-val { font-size: 1.25rem; font-weight: 700; color: #4ADE80; }
    .sp-clock-val { font-size: 0.95rem; color: #888888; }
    
    .sp-btn {
      background: #262626; border: 1px solid var(--sp-border); color: #FFF;
      padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer; font-size: 0.75rem; font-weight: 600;
      transition: background 0.2s;
    }
    .sp-btn:hover { background: #333; }
    .sp-btn.primary { background: #E50914; border-color: #E50914; }

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
    }
    .sp-panel-header {
      background: #161616;
      border-bottom: 1px solid var(--sp-border);
      padding: 0.5rem 1rem;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    /* Cadres d'aperçus avec centrage flex */
    .sp-preview-box {
      flex: 1;
      position: relative;
      background: #0D0D0D;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sp-preview-inner {
      width: 1240px;
      height: 700px;
      position: absolute;
      transform-origin: center center;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem;
      background: #141414;
      border: 1px solid #222;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .sp-notes-box {
      flex: 1;
      padding: 1.4rem;
      overflow-y: auto;
      font-size: 1.15rem;
      line-height: 1.65;
      color: #E5E7EB;
      white-space: pre-wrap;
    }

    footer.sp-footer {
      background: #181818;
      border-top: 1px solid var(--sp-border);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      flex-shrink: 0;
    }
    select.sp-select {
      background: #262626; border: 1px solid var(--sp-border); color: #FFF;
      padding: 0.35rem 0.75rem; border-radius: 5px; font-family: inherit; font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <header class="sp-header">
    <div style="font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.92rem;">
      CONSOLE <span style="color: #E50914;">PRÉSENTATEUR</span>
    </div>
    
    <div class="sp-timer-wrap">
      <span>⏱ <span id="timerText" class="sp-timer-val">00:00:00</span></span>
      <button id="pauseTimerBtn" class="sp-btn">Pause</button>
      <button id="resetTimerBtn" class="sp-btn">Reset</button>
      <span style="margin-left: 0.8rem;">🕒 <span id="clockText" class="sp-clock-val">--:--:--</span></span>
    </div>

    <div style="display: flex; gap: 0.4rem; align-items: center;">
      <span style="font-size: 0.75rem; color: #888;">Notes :</span>
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
          <span id="currSlideTitleTxt" style="color: #FFF;">-</span>
        </div>
        <div class="sp-preview-box" id="currentBox">
          <div id="currentSlideContent" class="sp-preview-inner slide-content"></div>
        </div>
      </div>

      <div class="sp-panel" style="flex: 0.75;">
        <div class="sp-panel-header">
          <span>Slide Suivante (Next)</span>
          <span id="nextSlideTitleTxt" style="color: #E50914;">-</span>
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
    <div style="font-size: 0.75rem; color: #888;">
      Touches Clavier actives (<kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>Espace</kbd>)
    </div>
  </footer>

  <script>
    const slidesData = ${JSON.stringify(slidesData)};
    let activeIdx = ${currentIndex};
    let currentFontSize = 1.15;

    const channel = new BroadcastChannel('deck_channel_sync');
    channel.onmessage = (e) => {
      if (e.data && typeof e.data.slideIndex === 'number') {
        updateUI(e.data.slideIndex, false);
      }
    };

    window.addEventListener('storage', (e) => {
      if (e.key === 'deck_sync_slide' && e.newValue !== null) {
        updateUI(parseInt(e.newValue, 10), false);
      }
    });

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
      const scale = Math.min((box.clientWidth - 30) / 1240, (box.clientHeight - 30) / 700);
      content.style.transform = 'scale(' + Math.max(scale, 0.1) + ')';
    }

    function updateUI(idx, notify = true) {
      if (idx < 0) idx = 0;
      if (idx >= slidesData.length) idx = slidesData.length - 1;
      activeIdx = idx;

      jumpSelect.value = activeIdx;
      document.getElementById('currSlideIdxTxt').textContent = activeIdx + 1;
      document.getElementById('currSlideTitleTxt').textContent = slidesData[activeIdx].title;
      document.getElementById('currentSlideContent').innerHTML = slidesData[activeIdx].html;
      document.getElementById('speakerNotesArea').textContent = slidesData[activeIdx].notes;

      if (activeIdx < slidesData.length - 1) {
        document.getElementById('nextSlideTitleTxt').textContent = slidesData[activeIdx + 1].title;
        document.getElementById('nextSlideContent').innerHTML = slidesData[activeIdx + 1].html;
      } else {
        document.getElementById('nextSlideTitleTxt').textContent = 'Fin de la présentation';
        document.getElementById('nextSlideContent').innerHTML = '<div style="text-align:center;color:#666;font-size:2rem;font-weight:800;">FIN DES SLIDES</div>';
      }

      scaleElement('currentBox', 'currentSlideContent');
      scaleElement('nextBox', 'nextSlideContent');

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
</html>
  `);
  speakerWindow.document.close();
}

window.openSpeakerWindow = openSpeakerWindow;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('speakerModeBtn')?.addEventListener('click', openSpeakerWindow);
});
