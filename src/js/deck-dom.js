/**
 * Deck Engine - DOM Chrome & Modal Injection
 * Sous-responsabilité : Génération et injection dynamique du Header, Footer,
 * Modale d'Overview, Drawer de Notes et Modale des Raccourcis.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.DOM = (function () {
  function setupFavicon(container) {
    const rawLogo = (container.getAttribute('data-logo') || '').trim();
    const rawFavicon = (container.getAttribute('data-favicon') || '').trim();
    const target = rawFavicon || rawLogo;

    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const isEmoji = (str) => /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u.test(str) && !str.includes('/') && !str.includes('.');

    if (target) {
      if (isEmoji(target)) {
        link.type = 'image/svg+xml';
        link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${target}</text></svg>`;
      } else {
        if (target.endsWith('.svg')) link.type = 'image/svg+xml';
        else if (target.endsWith('.png')) link.type = 'image/png';
        link.href = target;
      }
    } else if (!link.getAttribute('href')) {
      // Favicon vectoriel par défaut (évite l'onglet vide ou le globe par défaut)
      link.type = 'image/svg+xml';
      link.href = 'assets/favicon.svg';
    }
  }

  function ensureStructure() {
    const container = document.querySelector('.deck-container') || document.body;
    const brand = container.getAttribute('data-brand') || 'DECK';
    const fullTitle = container.getAttribute('data-title') || document.title.replace(/ - Deck Engine$/, '') || 'TITRE FORMATION';

    // 0. Configuration automatique ou personnalisée du favicon d'onglet
    setupFavicon(container);

    // Support du logo d'entête (data-logo)
    const logoAttr = (container.getAttribute('data-logo') || '').trim();
    const isEmojiLogo = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u.test(logoAttr) && !logoAttr.includes('/') && !logoAttr.includes('.');
    let logoHtml = '';
    if (logoAttr) {
      if (isEmojiLogo) {
        logoHtml = `<span class="brand-logo-emoji" id="deckBrandLogo">${logoAttr}</span>`;
      } else {
        logoHtml = `<img class="brand-logo-img" id="deckBrandLogo" src="${logoAttr}" alt="Logo">`;
      }
    }

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
          ${logoHtml}
          <span class="brand-pill" id="deckBrandPill">${brand}</span>
          <div class="brand-title" id="deckBrandTitle">${brandTitleHtml}</div>
        </div>

        <div class="header-center">
          <div class="slide-badge-title">
            <span class="pulse-dot"></span>
            <span id="headerSlideTitle">Introduction</span>
          </div>
          <div class="slide-counter">
            <span id="currentSlideNum">1</span> / <span id="totalSlidesNum">1</span>
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

          <div class="theme-picker-wrap" id="themePickerWrap">
            <button id="themeToggleBtn" class="ctrl-btn" title="Changer d'ambiance visuelle (Touche T)">
              <span id="themeToggleIcon">🌑</span>
              <span id="themeToggleTxt">Thème</span>
            </button>
            <div class="theme-palette-popover" id="themePalettePopover">
              <div class="palette-title">Ambiances Visuelles</div>
              <div class="theme-menu-list" id="themePresetsList"></div>
            </div>
          </div>

          <div class="color-picker-wrap" id="colorPickerWrap">
            <button id="colorPickerBtn" class="ctrl-btn" title="Changer la couleur d'accent du thème (Touche C)">
              <span class="color-swatch-current" id="currentColorDot"></span>
              <span>Couleur</span>
            </button>
            <div class="color-palette-popover" id="colorPalettePopover">
              <div class="palette-title">Palette d'accent</div>
              <div class="palette-swatches" id="presetSwatches">
                <button class="palette-dot active" data-color="#E50914" title="Rouge Crimson (Défaut)" style="--dot-color: #E50914;"></button>
                <button class="palette-dot" data-color="#2563EB" title="Bleu Cobalt" style="--dot-color: #2563EB;"></button>
                <button class="palette-dot" data-color="#10B981" title="Vert Émeraude" style="--dot-color: #10B981;"></button>
                <button class="palette-dot" data-color="#8B5CF6" title="Violet Cyber" style="--dot-color: #8B5CF6;"></button>
                <button class="palette-dot" data-color="#F59E0B" title="Ambre & Or" style="--dot-color: #F59E0B;"></button>
                <button class="palette-dot" data-color="#EC4899" title="Rose Néon" style="--dot-color: #EC4899;"></button>
                <button class="palette-dot" data-color="#06B6D4" title="Cyan Futuriste" style="--dot-color: #06B6D4;"></button>
              </div>

              <div class="palette-custom-section" id="customColorsSection" style="display: none;">
                <div class="palette-title" style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Mes couleurs</span>
                  <button id="clearCustomColorsBtn" class="palette-clear-btn" title="Effacer mes couleurs personnalisées">Effacer</button>
                </div>
                <div class="palette-swatches" id="customSwatches"></div>
              </div>

              <div class="palette-custom-row">
                <div class="palette-custom-label">Couleur personnalisée (Hex) :</div>
                <div class="palette-hex-control">
                  <div class="hex-input-wrap" id="hexInputWrap">
                    <input type="color" id="customColorPickerInput" value="#E50914" title="Pipette / Sélecteur visuel">
                    <input type="text" id="hexColorInput" value="#E50914" placeholder="#HEX" maxlength="7" spellcheck="false" title="Entrez un code hexadécimal (ex: #3B82F6 ou 3B82F6)">
                  </div>
                  <button id="applyHexColorBtn" class="palette-action-btn primary" title="Appliquer immédiatement cette couleur (Touche Entrée)">Appliquer</button>
                  <button id="addHexColorBtn" class="palette-action-btn secondary" title="Ajouter à Mes couleurs sans l'appliquer">+ Ajouter</button>
                </div>
              </div>
            </div>
          </div>

          <button id="elementStylerBtn" class="ctrl-btn" title="Inspecteur & Styliseur de composants (Touche I)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Styliser (I)</span>
          </button>

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

          <button id="laserToggleBtn" class="ctrl-btn" title="Activer / Désactiver le Pointeur Laser Virtuel (Touche L)">
            <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #FF1E1E; box-shadow: 0 0 6px #FF1E1E;"></span>
            <span>Laser (L)</span>
          </button>

          <button id="blackoutBtn" class="ctrl-btn" title="Masquer l'écran / Écran Noir (Touche B ou .)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>Noir (B)</span>
          </button>

          <button id="searchBtn" class="ctrl-btn" title="Rechercher dans les slides (Cmd+K / Ctrl+K / /)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Recherche (⌘K)</span>
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
        <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 11px; color: var(--text-dim);">
          <span>Navigation : <kbd>&larr;</kbd> <kbd>&rarr;</kbd> ou <kbd>Espace</kbd></span>
          <span>&bull;</span>
          <span>Présentateur : <kbd>S</kbd></span>
          <span>&bull;</span>
          <span>Export : <kbd>P</kbd></span>
        </div>
        <div style="display: flex; gap: 0.35rem;">
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
              <span>Suivant / Fragment</span> <kbd>&rarr; / Espace</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Précédent / Fragment</span> <kbd>&larr;</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center; grid-column: span 2;">
              <span>Saut direct de slide (sans fragments)</span> <kbd>Shift + &rarr; / &larr;</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Ambiance Visuelle (7 thèmes)</span> <kbd>T</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Couleur d'accent</span> <kbd>C</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Styliser un composant</span> <kbd>I</kbd>
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
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Pointeur Laser Virtuel</span> <kbd>L</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Écran Noir (Blackout)</span> <kbd>B / .</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>Écran Blanc (Whiteout)</span> <kbd>W</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
              <span>En Plein Écran : Navigation</span> <kbd>Clic / Molette</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center; grid-column: span 2;">
              <span>Palette de Recherche Rapide</span> <kbd>⌘K / Ctrl+K ou /</kbd>
            </div>
            <div style="background: var(--card-hover); padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid var(--border-dark); color: var(--text-main); display: flex; justify-content: space-between; align-items: center; grid-column: span 2;">
              <span>Aide Raccourcis</span> <kbd>?</kbd>
            </div>
          </div>
        </div>
      `;
      container.appendChild(scModal);
    }

    // 5b. Overlay de masquage Écran Noir / Blanc (Touches B / W)
    if (!document.getElementById('deckBlankOverlay')) {
      const blankOverlay = document.createElement('div');
      blankOverlay.id = 'deckBlankOverlay';
      blankOverlay.innerHTML = '<div class="blank-overlay-hint"></div>';
      container.appendChild(blankOverlay);
    }

    // 5c. Palette de Recherche Rapide (Cmd + K / Ctrl + K)
    if (!document.getElementById('searchModal')) {
      const searchModal = document.createElement('div');
      searchModal.id = 'searchModal';
      searchModal.className = 'modal-overlay search-modal-overlay';
      searchModal.innerHTML = `
        <div class="x-card search-palette-box">
          <div class="search-input-wrap">
            <svg class="search-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="deckSearchInput" class="search-input-field" placeholder="Rechercher par mot-clé, titre, code, concept..." autocomplete="off" spellcheck="false">
            <span id="searchResultCount" class="search-count-pill">0 slides</span>
            <button id="closeSearchBtn" class="search-close-btn" title="Fermer (Échap)">&times;</button>
          </div>
          <div id="deckSearchResults" class="search-results-list"></div>
          <div class="search-palette-footer">
            <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> Naviguer</span>
            <span>&bull;</span>
            <span><kbd>Entrée</kbd> Ouvrir</span>
            <span>&bull;</span>
            <span><kbd>Échap</kbd> Fermer</span>
          </div>
        </div>
      `;
      container.appendChild(searchModal);
    }

    // 5d. Modale de Zoom Interactif (Click to Zoom)
    if (!document.getElementById('deckZoomModal')) {
      const zoomModal = document.createElement('div');
      zoomModal.id = 'deckZoomModal';
      zoomModal.className = 'zoom-modal-overlay';
      zoomModal.innerHTML = `
        <button id="closeZoomBtn" class="zoom-close-btn" title="Fermer le zoom (Échap)">&times;</button>
        <div class="zoom-wrapper">
          <div id="deckZoomContent" class="zoom-content-box"></div>
          <div class="zoom-dismiss-hint">Cliquer en dehors ou presser Échap pour fermer</div>
        </div>
      `;
      container.appendChild(zoomModal);
    }

    // 6. Injection automatique des logos de pied de slide (bas gauche, milieu, bas droite)
    // Lit data-logo-left, data-logo-center, data-logo-right sur .deck-container ou sur chaque .slide
    const globalLogos = {
      left: container.getAttribute('data-logo-left'),
      center: container.getAttribute('data-logo-center'),
      right: container.getAttribute('data-logo-right')
    };

    const slides = container.querySelectorAll('.slide');
    slides.forEach(slide => {
      if (slide.hasAttribute('data-no-logo') || slide.hasAttribute('data-no-logos')) {
        return;
      }

      const positions = ['left', 'center', 'right'];
      positions.forEach(pos => {
        const logoAttr = slide.getAttribute(`data-logo-${pos}`) || globalLogos[pos];
        if (!logoAttr) return;

        // Éviter de dupliquer si déjà présent dans le HTML
        const existing = slide.querySelector(`.slide-logo.bottom-${pos}, .slide-logo.${pos}, .slide-bottom-logos .logo-group.${pos}`);
        if (existing) return;

        const logoContainer = document.createElement('div');
        logoContainer.className = `slide-logo bottom-${pos}`;

        // Support d'une ou plusieurs URLs séparées par des virgules
        const sources = logoAttr.split(',').map(s => s.trim()).filter(Boolean);
        sources.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = `Logo ${pos}`;
          img.className = 'slide-logo-img';
          logoContainer.appendChild(img);
        });

        const customSize = slide.getAttribute('data-logo-size') || container.getAttribute('data-logo-size');
        if (customSize) {
          logoContainer.style.setProperty('--logo-height', customSize);
        }

        slide.appendChild(logoContainer);
        slide.classList.add('has-bottom-logo');
      });

      if (slide.querySelector('.slide-logo, .slide-bottom-logos')) {
        slide.classList.add('has-bottom-logo');
      }
    });
  }

  return {
    ensureStructure: ensureStructure
  };
})();

// Rétrocompatibilité globale
window.ensureDeckStructure = window.DeckEngine.DOM.ensureStructure;
