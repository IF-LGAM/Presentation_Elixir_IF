/**
 * Deck Engine - Print & PDF Export Sync
 * Sous-responsabilité : Préparation du document avant impression (beforeprint),
 * harmonisation du thème clair/sombre de chaque diapositive et déclenchement de l'export.
 */

window.DeckEngine = window.DeckEngine || {};

window.DeckEngine.Print = (function () {
  function handleBeforePrint() {
    const container = document.querySelector('.deck-container') || document.body;
    const userManualTheme = window.DeckEngine.Theme ? window.DeckEngine.Theme.getUserManualTheme() : null;
    const isLight = container.classList.contains('theme-light') || container.getAttribute('data-theme') === 'light' || (userManualTheme === 'light');

    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);
    container.classList.toggle('theme-light', isLight);
    container.classList.toggle('theme-dark', !isLight);

    const slides = document.querySelectorAll('.slide');
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
  }

  function init() {
    window.addEventListener('beforeprint', handleBeforePrint);
    document.getElementById('pdfExportBtn')?.addEventListener('click', () => window.print());
  }

  return {
    init: init,
    syncPrintTheme: handleBeforePrint
  };
})();
