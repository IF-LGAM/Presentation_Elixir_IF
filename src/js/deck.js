/**
 * ==========================================================================
 * HTML SLIDE DECK ENGINE - MASTER ORCHESTRATOR
 * Point d'entrée principal qui initialise et coordonne les sous-modules :
 * - DOM (deck-dom.js)
 * - Palette & Couleurs (deck-palette.js)
 * - Thèmes (deck-theme.js)
 * - Overview en grille (deck-overview.js)
 * - Navigation & Raccourcis (deck-navigation.js)
 * - Export Print / PDF (deck-print.js)
 * ==========================================================================
 */

window.DeckEngine = window.DeckEngine || {};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Injection dynamique du Chrome d'interface et des modales
  if (window.DeckEngine.DOM && typeof window.DeckEngine.DOM.ensureStructure === 'function') {
    window.DeckEngine.DOM.ensureStructure();
  } else if (typeof window.ensureDeckStructure === 'function') {
    window.ensureDeckStructure();
  }

  // 2. Initialisation de la palette d'accentuation
  if (window.DeckEngine.Palette && typeof window.DeckEngine.Palette.init === 'function') {
    window.DeckEngine.Palette.init();
  }

  // 3. Initialisation du gestionnaire de thèmes (clair / sombre)
  if (window.DeckEngine.Theme && typeof window.DeckEngine.Theme.init === 'function') {
    window.DeckEngine.Theme.init();
  }

  // 4. Initialisation de la vue d'ensemble en grille (Overview)
  if (window.DeckEngine.Overview && typeof window.DeckEngine.Overview.init === 'function') {
    window.DeckEngine.Overview.init();
  }

  // 5. Initialisation du module d'export PDF et Print
  if (window.DeckEngine.Print && typeof window.DeckEngine.Print.init === 'function') {
    window.DeckEngine.Print.init();
  }

  // 6. Initialisation de l'auto-ajustement d'échelle des slides (zéro débordement)
  if (window.DeckEngine.Fit && typeof window.DeckEngine.Fit.init === 'function') {
    window.DeckEngine.Fit.init();
  }

  // 7. Initialisation du moteur de navigation et raccourcis clavier
  if (window.DeckEngine.Navigation && typeof window.DeckEngine.Navigation.init === 'function') {
    window.DeckEngine.Navigation.init();
  }

  // 7. Câblage des contrôles d'interface complémentaires
  const notesDrawer = document.getElementById('notesDrawer');
  const shortcutsModal = document.getElementById('shortcutsModal');

  // Bouton Console Présentateur
  const openSpeaker = (e) => {
    if (e) e.preventDefault();
    if (typeof openSpeakerWindow === 'function') openSpeakerWindow();
    else if (window.openSpeakerWindow) window.openSpeakerWindow();
  };
  const spBtn = document.getElementById('speakerWindowBtn');
  if (spBtn && !spBtn.dataset.speakerBound) {
    spBtn.dataset.speakerBound = 'true';
    spBtn.addEventListener('click', openSpeaker);
  }
  const spModeBtn = document.getElementById('speakerModeBtn');
  if (spModeBtn && !spModeBtn.dataset.speakerBound) {
    spModeBtn.dataset.speakerBound = 'true';
    spModeBtn.addEventListener('click', openSpeaker);
  }

  // Tiroir de Notes rapide (écran unique)
  document.getElementById('speakerNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.toggle('open'));
  document.getElementById('closeNotesBtn')?.addEventListener('click', () => notesDrawer?.classList.remove('open'));

  // Modale Raccourcis clavier
  document.getElementById('shortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.toggle('open'));
  document.getElementById('closeShortcutsBtn')?.addEventListener('click', () => shortcutsModal?.classList.remove('open'));
});
