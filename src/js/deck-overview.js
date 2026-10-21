/**
 * Deck Engine - Overview Grid Manager
 * Sous-responsabilité : Génération des vignettes du slide deck, calcul de mise
 * à l'échelle miniature 16:9, barre de glissement rapide et ouverture de la modale.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Overview = (function () {
  function getElements() {
    return {
      overviewModal: document.getElementById('overviewModal'),
      overviewGrid: document.getElementById('overviewGrid'),
      slideCountBadge: document.getElementById('overviewSlideCountBadge'),
      slider: document.getElementById('overviewRangeSlider'),
      sliderVal: document.getElementById('overviewSliderVal')
    };
  }

  function scaleOverviewThumbs() {
    const { overviewGrid } = getElements();
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

  function buildOverview() {
    const { overviewGrid, slideCountBadge, slider, sliderVal } = getElements();
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentIndex = window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0;

    if (slideCountBadge) slideCountBadge.textContent = `${totalSlides} slides`;

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
      const contentHtml = (slide.querySelector('.slide-content')?.innerHTML || '') +
        Array.from(slide.querySelectorAll('.slide-logo, .slide-bottom-logos')).map(el => el.outerHTML).join('');

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
        if (window.DeckEngine.Navigation) {
          window.DeckEngine.Navigation.goToSlide(idx);
        }
        const { overviewModal } = getElements();
        if (overviewModal) overviewModal.classList.remove('open');
      };

      overviewGrid.appendChild(card);
    });

    scaleOverviewThumbs();

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

  function toggleOverview() {
    buildOverview();
    const { overviewModal, overviewGrid } = getElements();
    if (overviewModal) {
      overviewModal.classList.toggle('open');
      if (overviewModal.classList.contains('open')) {
        setTimeout(() => {
          scaleOverviewThumbs();
          const currentIndex = window.DeckEngine.Navigation ? window.DeckEngine.Navigation.getCurrentIndex() : 0;
          const curCard = overviewGrid?.children[currentIndex];
          if (curCard) curCard.scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 50);
      }
    }
  }

  function init() {
    document.getElementById('overviewBtn')?.addEventListener('click', toggleOverview);
    document.getElementById('closeOverviewBtn')?.addEventListener('click', () => {
      const { overviewModal } = getElements();
      if (overviewModal) overviewModal.classList.remove('open');
    });

    window.addEventListener('resize', () => {
      const { overviewModal } = getElements();
      if (overviewModal && overviewModal.classList.contains('open')) {
        scaleOverviewThumbs();
      }
    });
  }

  return {
    init: init,
    build: buildOverview,
    scaleThumbs: scaleOverviewThumbs,
    toggle: toggleOverview
  };
})();

// ==========================================================================
// PALETTE DE RECHERCHE PLEIN TEXTE INSTANTANÉE (CMD + K / CTRL + K / /)
// ==========================================================================
window.DeckEngine.Search = (function () {
  let searchModal = null;
  let searchInput = null;
  let resultsContainer = null;
  let countPill = null;
  let indexedSlides = [];
  let currentResults = [];
  let selectedIndex = 0;

  function stripAccents(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function indexSlides() {
    const slides = document.querySelectorAll('.slide');
    indexedSlides = Array.from(slides).map((slide, idx) => {
      const title = slide.getAttribute('data-title') ||
        slide.querySelector('.title-slide, h1, h2, h3')?.textContent?.trim() ||
        `Slide ${idx + 1}`;

      const subtitle = slide.querySelector('.subtitle-slide, .tagline, .section-header')?.textContent?.trim() || '';
      const notes = slide.getAttribute('data-notes') || '';
      const contentEl = slide.querySelector('.slide-content');
      const text = contentEl ? contentEl.textContent.replace(/\s+/g, ' ').trim() : '';

      const tags = [];
      if (slide.querySelector('pre, code')) tags.push('Code');
      if (slide.querySelector('.quiz-box')) tags.push('Quiz');
      if (slide.querySelector('table')) tags.push('Table');
      if (slide.querySelector('.stepper-horizontal, .stepper-vertical')) tags.push('Frise');
      if (slide.querySelector('.comparison-grid, .vs-grid')) tags.push('VS');

      return {
        index: idx,
        number: idx + 1,
        title: title,
        subtitle: subtitle,
        notes: notes,
        text: text,
        tags: tags,
        searchableTitle: stripAccents(title),
        searchableSubtitle: stripAccents(subtitle),
        searchableContent: stripAccents(text + ' ' + notes)
      };
    });
  }

  function highlightMatches(text, query) {
    if (!query || !text) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      const regex = new RegExp('(' + escapedQuery + ')', 'gi');
      return escapedText.replace(regex, '<mark>$1</mark>');
    } catch (e) {
      return escapedText;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function extractSnippet(text, rawQuery) {
    if (!text) return '';
    if (!rawQuery) {
      return text.length > 90 ? text.substring(0, 90) + '...' : text;
    }

    const normText = stripAccents(text);
    const normQuery = stripAccents(rawQuery);
    const pos = normText.indexOf(normQuery);

    if (pos === -1) {
      return text.length > 90 ? text.substring(0, 90) + '...' : text;
    }

    const start = Math.max(0, pos - 35);
    const end = Math.min(text.length, pos + rawQuery.length + 55);
    let snippet = (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
    return snippet;
  }

  function performSearch(rawQuery) {
    const q = rawQuery.trim();
    const normQ = stripAccents(q);
    const terms = normQ.split(/\s+/).filter(Boolean);

    if (terms.length === 0) {
      currentResults = indexedSlides.map(s => ({
        slide: s,
        score: 1,
        snippet: s.subtitle || (s.text.substring(0, 80) + '...')
      }));
    } else {
      const matched = [];
      indexedSlides.forEach(slide => {
        let score = 0;
        let allTermsMatched = true;

        for (const term of terms) {
          let termMatch = false;
          if (slide.searchableTitle.includes(term)) {
            score += 120;
            termMatch = true;
          }
          if (slide.searchableSubtitle.includes(term)) {
            score += 60;
            termMatch = true;
          }
          if (slide.searchableContent.includes(term)) {
            score += 25;
            termMatch = true;
          }
          if (!termMatch) {
            allTermsMatched = false;
            break;
          }
        }

        if (allTermsMatched) {
          const snippetSource = slide.subtitle && stripAccents(slide.subtitle).includes(normQ)
            ? slide.subtitle
            : slide.text;
          matched.push({
            slide: slide,
            score: score,
            snippet: extractSnippet(snippetSource, q)
          });
        }
      });

      matched.sort((a, b) => b.score - a.score);
      currentResults = matched;
    }

    selectedIndex = 0;
    renderResults(q);
  }

  function renderResults(query) {
    if (!resultsContainer) return;

    if (countPill) {
      countPill.textContent = currentResults.length === 1
        ? '1 résultat'
        : `${currentResults.length} résultats`;
    }

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <div style="font-size: 1.6rem; margin-bottom: 0.4rem;">🔍</div>
          <div>Aucune slide ne correspond à votre recherche <strong>"${escapeHtml(query)}"</strong></div>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = '';
    currentResults.forEach((res, i) => {
      const s = res.slide;
      const item = document.createElement('div');
      item.className = 'search-result-item' + (i === selectedIndex ? ' selected' : '');
      item.dataset.index = i;

      const titleHtml = highlightMatches(s.title, query);
      const snippetHtml = highlightMatches(res.snippet, query);
      const tagsHtml = s.tags.map(t => `<span class="search-tag-pill">${t}</span>`).join('');

      item.innerHTML = `
        <div class="search-result-left">
          <span class="search-result-badge">Slide ${s.number}</span>
          <div class="search-result-text">
            <span class="search-result-title">${titleHtml}</span>
            <span class="search-result-snippet">${snippetHtml}</span>
          </div>
        </div>
        <div class="search-result-tags">${tagsHtml}</div>
      `;

      item.addEventListener('mouseenter', () => {
        setSelectedIndex(i);
      });

      item.addEventListener('click', () => {
        selectAndGo(i);
      });

      resultsContainer.appendChild(item);
    });

    scrollSelectedIntoView();
  }

  function setSelectedIndex(idx) {
    if (!resultsContainer || currentResults.length === 0) return;
    const items = resultsContainer.querySelectorAll('.search-result-item');
    if (items[selectedIndex]) items[selectedIndex].classList.remove('selected');
    selectedIndex = Math.max(0, Math.min(items.length - 1, idx));
    if (items[selectedIndex]) {
      items[selectedIndex].classList.add('selected');
      scrollSelectedIntoView();
    }
  }

  function scrollSelectedIntoView() {
    if (!resultsContainer) return;
    const selected = resultsContainer.querySelector('.search-result-item.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }

  function selectAndGo(idx) {
    if (!currentResults[idx]) return;
    const targetSlide = currentResults[idx].slide.index;
    if (window.DeckEngine.Navigation) {
      window.DeckEngine.Navigation.goToSlide(targetSlide);
    }
    close();
  }

  function open() {
    if (!searchModal) init();
    indexSlides();
    if (searchModal) {
      searchModal.classList.add('open');
      if (searchInput) {
        searchInput.value = '';
        performSearch('');
        setTimeout(() => searchInput.focus(), 40);
      }
    }
  }

  function close() {
    if (searchModal) {
      searchModal.classList.remove('open');
    }
  }

  function toggle() {
    if (searchModal && searchModal.classList.contains('open')) {
      close();
    } else {
      open();
    }
  }

  function isOpen() {
    return !!(searchModal && searchModal.classList.contains('open'));
  }

  function init() {
    searchModal = document.getElementById('searchModal');
    searchInput = document.getElementById('deckSearchInput');
    resultsContainer = document.getElementById('deckSearchResults');
    countPill = document.getElementById('searchResultCount');

    document.getElementById('searchBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    document.getElementById('closeSearchBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });

    searchModal?.addEventListener('click', (e) => {
      if (e.target === searchModal) close();
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((selectedIndex + 1) % Math.max(1, currentResults.length));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((selectedIndex - 1 + currentResults.length) % Math.max(1, currentResults.length));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          selectAndGo(selectedIndex);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      });
    }
  }

  return {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
    isOpen: isOpen
  };
})();

