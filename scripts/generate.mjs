#!/usr/bin/env node
/**
 * ⚡ HTML Slide Deck Engine - CLI Generator & Validator
 * Zéro dépendance externe : fonctionne nativement avec Node.js 18+.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Lecture d'un éventuel fichier .env local sans dépendance externe
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
loadEnv();

// Aide CLI
function printHelp() {
  console.log(`
⚡ HTML Slide Deck Engine — CLI Tooling

Utilisation :
  node scripts/generate.mjs [option]
  npm run generate -- [option]
  make [commande]

Options :
  --validate [fichier]   Vérifie la conformité d'un diaporama (règles de thème, balises, notes)
  --prompt               Assemble et affiche le prompt optimisé prêt à copier pour votre IA
  --copy                 Assemble le prompt et le copie directement dans votre presse-papiers
  --ai                   Génère presentation.html via l'API (Anthropic, OpenAI ou Gemini)
  --open                 Ouvre le diaporama dans votre navigateur par défaut
  --help                 Affiche ce message d'aide

Variables d'environnement supportées pour le mode --ai :
  ANTHROPIC_API_KEY      Utilise Claude 3.5 / 3.7 Sonnet
  OPENAI_API_KEY         Utilise GPT-4o
  GEMINI_API_KEY         Utilise Gemini 2.5 Flash / Pro
`);
}

// 1. Validation & Contrôle Qualité d'une présentation
function validatePresentation(targetFile = 'presentation.html') {
  const filePath = path.resolve(ROOT_DIR, targetFile);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier introuvable : ${targetFile}`);
    console.log(`💡 Astuce : Testez sur la vitrine : node scripts/generate.mjs --validate template_presentation.html`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n🔍 Analyse de conformité : ${targetFile}`);
  console.log('─'.repeat(55));

  let errors = 0;
  let warnings = 0;

  // Contrôle deck-container
  const hasContainer = /<div class="deck-container"/i.test(content);
  if (!hasContainer) {
    console.error(`❌ Manque le conteneur racine : <div class="deck-container">`);
    errors++;
  } else {
    console.log(`✔ Conteneur racine présent (<div class="deck-container">)`);
  }

  // Contrôle des slides
  const slideRegex = /<section class="slide([^"]*)"([^>]*)>/gi;
  let match;
  let slideCount = 0;
  let forbiddenThemeCount = 0;
  let missingNotesCount = 0;
  let missingTitleCount = 0;

  while ((match = slideRegex.exec(content)) !== null) {
    slideCount++;
    const fullTag = match[0];

    // Vérification de l'interdiction de data-theme sur la slide
    if (/data-theme=/i.test(fullTag)) {
      forbiddenThemeCount++;
    }

    // Présence des notes
    if (!/data-notes=/i.test(fullTag)) {
      missingNotesCount++;
    }

    // Présence du titre
    if (!/data-title=/i.test(fullTag)) {
      missingTitleCount++;
    }
  }

  console.log(`✔ Diapositives détectées : ${slideCount}`);

  if (forbiddenThemeCount > 0) {
    console.error(`❌ ${forbiddenThemeCount} slide(s) contiennent data-theme local (Banni : le thème doit rester global pour éviter les contrastes illisibles)`);
    errors++;
  } else {
    console.log(`✔ Règle de thème respectée (aucun data-theme local sur les slides)`);
  }

  if (missingNotesCount > 0) {
    console.warn(`⚠️ ${missingNotesCount} slide(s) n'ont pas d'attribut data-notes="..." (requis pour la console orateur)`);
    warnings++;
  } else {
    console.log(`✔ Notes d'orateur présentes sur toutes les slides`);
  }

  if (missingTitleCount > 0) {
    console.warn(`⚠️ ${missingTitleCount} slide(s) n'ont pas d'attribut data-title="..."`);
    warnings++;
  } else {
    console.log(`✔ Titres présents pour la palette Spotlight et l'Overview`);
  }

  // Contrôle du Favicon / Logo d'onglet
  const hasFavicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(content) || /data-(?:logo|favicon)=/i.test(content);
  if (hasFavicon) {
    console.log(`✔ Logo / Favicon d'onglet configuré`);
  }

  // Détection des composants
  const hasMermaid = /class="mermaid"/i.test(content);
  const hasQuiz = /class="quiz-container"/i.test(content);
  const hasStepper = /class="stepper-horizontal"/i.test(content);
  const hasCircle = /class="virtuous-circle"/i.test(content);
  const hasTable = /class="data-table"/i.test(content);

  console.log('\n📊 Composants interactifs détectés :');
  if (hasStepper) console.log('  • Frise / Stepper horizontal');
  if (hasCircle) console.log('  • Cycle vertueux & flèches vectorielles');
  if (hasTable) console.log('  • Tableaux de données zébrés');
  if (hasMermaid) console.log('  • Diagrammes Mermaid.js');
  if (hasQuiz) console.log('  • Quizz QCM interactif');

  console.log('─'.repeat(55));
  if (errors === 0) {
    console.log(`🎉 Validation réussie avec succès ! (${warnings} avertissement(s))\n`);
  } else {
    console.error(`⛔ Échec de validation : ${errors} erreur(s) détectée(s).\n`);
    process.exit(1);
  }
}

// 2. Assemblage du Prompt optimisé
function buildPrompt() {
  const consignesPath = path.join(ROOT_DIR, 'CONSIGNES_TEMPLATE.md');
  const dictionnairePath = path.join(ROOT_DIR, 'COMPOSANTS_DICTIONNAIRE.md');

  if (!fs.existsSync(consignesPath) || !fs.existsSync(dictionnairePath)) {
    console.error('❌ Impossible de trouver CONSIGNES_TEMPLATE.md ou COMPOSANTS_DICTIONNAIRE.md');
    process.exit(1);
  }

  const consignes = fs.readFileSync(consignesPath, 'utf-8');
  const dictionnaire = fs.readFileSync(dictionnairePath, 'utf-8');

  return `Tu es un expert en design et développement de présentations web de classe mondiale.

MISSION :
Génère le fichier HTML complet, autonome et sans coupure nommé "presentation.html" en traduisant scrupuleusement les consignes et le plan ci-dessous.

RÈGLES CRITIQUES D'INTÉGRATION :
1. Le thème est défini UNE SEULE FOIS au global sur <div class="deck-container" data-theme="...">.
2. INTERDICTION FORMELLE d'ajouter data-theme sur les balises <section class="slide"> : toutes les slides doivent hériter du thème global pour garantir un contraste parfait (clair/sombre).
3. Chaque slide doit comporter des data-slide numérotés, un data-title descriptif et un attribut data-notes très riche et complet pour la console orateur.
4. Utilise systématiquement les classes et structures standardisées du Dictionnaire de Composants fourni ci-dessous (cartes, badges, grilles, steppers, tableaux, terminaux, cercles vertueux, Mermaid, quiz).
5. Ajoute systématiquement un lien favicon (<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">) dans le <head> et renseigne si souhaité data-logo="assets/favicon.svg" sur <div class="deck-container"> pour afficher le logo dans l'onglet du navigateur et dans l'entête.

=== CONSIGNES & PLAN DE CONTENU ===
${consignes}

=== RÉFÉRENTIEL DU DICTIONNAIRE DES COMPOSANTS ===
${dictionnaire}

Renvoie UNIQUEMENT le code HTML complet de presentation.html, prêt à être sauvegardé et exécuté.`;
}

// Copie dans le presse-papiers
function copyToClipboard(text) {
  try {
    const isMac = process.platform === 'darwin';
    const isWindows = process.platform === 'win32';
    const cmd = isMac ? 'pbcopy' : isWindows ? 'clip' : 'xclip -selection clipboard';
    execSync(cmd, { input: text });
    return true;
  } catch (err) {
    return false;
  }
}

// 3. Appel direct LLM
async function generateViaAI() {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log(`\n💡 Aucune clé API détectée dans votre environnement (.env).`);
    console.log(`📋 Génération du prompt optimisé pour votre assistant habituel...\n`);
    const prompt = buildPrompt();
    const copied = copyToClipboard(prompt);
    if (copied) {
      console.log(`✔ Le prompt complet a été copié directement dans votre presse-papiers !`);
      console.log(`👉 Collez-le simplement dans Claude 3.7 / 3.5 Sonnet, ChatGPT 4o ou Gemini 2.5.`);
    } else {
      const outPath = path.join(ROOT_DIR, '.prompt_ia.txt');
      fs.writeFileSync(outPath, prompt, 'utf-8');
      console.log(`✔ Le prompt a été sauvegardé dans le fichier : .prompt_ia.txt`);
    }
    return;
  }

  console.log(`\n🤖 Clé API détectée ! Lancement de la génération...`);
  const prompt = buildPrompt();

  let rawHtml = '';
  if (process.env.ANTHROPIC_API_KEY) {
    console.log(`⚡ Fournisseur : Anthropic (Claude)`);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    rawHtml = data.content?.[0]?.text || '';
  } else if (process.env.OPENAI_API_KEY) {
    console.log(`⚡ Fournisseur : OpenAI (GPT-4o)`);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    rawHtml = data.choices?.[0]?.message?.content || '';
  } else if (process.env.GEMINI_API_KEY) {
    console.log(`⚡ Fournisseur : Google Gemini`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    rawHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // Nettoyage des balises markdown éventuelles (```html ... ```)
  const cleanedHtml = rawHtml.replace(/^```html\s*|```\s*$/gi, '').trim();

  if (!cleanedHtml.includes('<html') || !cleanedHtml.includes('slide')) {
    console.error('❌ La réponse de l\'IA ne semble pas contenir de code HTML valide.');
    process.exit(1);
  }

  const outTarget = path.join(ROOT_DIR, 'presentation.html');
  fs.writeFileSync(outTarget, cleanedHtml, 'utf-8');
  console.log(`✔ Fichier généré avec succès : presentation.html`);
  validatePresentation('presentation.html');
}

// Point d'entrée principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--ai';

  switch (command) {
    case '--help':
    case '-h':
      printHelp();
      break;

    case '--validate':
    case '-v': {
      const target = args[1] || 'template_presentation.html';
      validatePresentation(target);
      break;
    }

    case '--prompt':
    case '-p': {
      const prompt = buildPrompt();
      console.log(prompt);
      break;
    }

    case '--copy':
    case '-c': {
      const prompt = buildPrompt();
      const ok = copyToClipboard(prompt);
      if (ok) {
        console.log(`✔ Prompt copié avec succès dans le presse-papiers !`);
      } else {
        console.log(prompt);
      }
      break;
    }

    case '--open':
    case '-o': {
      const target = args[1] || (fs.existsSync(path.join(ROOT_DIR, 'presentation.html')) ? 'presentation.html' : 'template_presentation.html');
      const isMac = process.platform === 'darwin';
      const cmd = isMac ? `open ${target}` : `xdg-open ${target}`;
      execSync(cmd, { cwd: ROOT_DIR });
      break;
    }

    case '--ai':
    default:
      await generateViaAI();
      break;
  }
}

main().catch(err => {
  console.error('Erreur inattendue :', err);
  process.exit(1);
});
