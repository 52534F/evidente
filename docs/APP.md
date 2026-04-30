# GrammarDrill App Documentation

## Overview

GrammarDrill is a gamified grammar practice web application. The app presents multiple-choice grammar questions, tracks scores/streaks, and provides feedback with explanations.

For setup and installation instructions, see [SETUP.md](SETUP.md).

## Architecture

```
┌─────────────────────────────────────────┐
│              index.html                  │
│  (Start Screen / Game Screen / Over)    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│              app.js                     │
│  (Game logic, state management, DOM)     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         languages/it/index.js            │
│     (Italian language module)            │
│  - Question generators                   │
│  - Vocabulary data                      │
│  - Category/syntax metadata              │
└─────────────────────────────────────────┘
```

---

## HTML Structure

### Required DOM Elements

```html
<!-- Start Screen -->
<section id="start-screen">
  <h1>GrammarDrill</h1>
  <span id="high-score-value">0</span>
  <!-- Language Selector (populated from manifest.json) -->
  <select id="lang-select">
    <option value="it">🇮🇹 Italian</option>
  </select>
  <select id="level-select">
    <option value="A1">A1</option>
    <option value="A2">A2</option>
    <option value="B1">B1</option>
    <option value="B2">B2</option>
    <option value="C1">C1</option>
    <option value="C2">C2</option>
  </select>
  <button id="start-btn">Start</button>
</section>

<!-- Game Screen -->
<section id="game-screen">
  <header>
    <span>Score:</span> <strong id="game-score">0</strong>
    <span>Streak:</span> <strong id="game-streak">0</strong>
  </header>
  
  <!-- Language & Level Controls -->
  <div id="controls-bar">
    <!-- Flag Button with Dropdown -->
    <button id="lang-flag-btn">🇮🇹</button>
    <div id="lang-dropdown" class="dropdown hidden">
      <!-- Populated dynamically -->
    </div>
    
    <!-- CEFR Level Indicator with Dropdown -->
    <button id="level-indicator-btn">A1</button>
    <div id="level-dropdown" class="dropdown hidden">
      <!-- Populated dynamically -->
    </div>
    
    <!-- Category Bar (3-level hierarchical, clickable toggles with lock) -->
    <div id="category-bar">
      <span class="category-level l1" data-lock="false"></span>
      <span class="category-level l2" data-lock="false"></span>
      <span class="category-level l3" data-lock="false"></span>
    </div>
  </div>
  
  <!-- Syntax Blocks (optional, with flash-red on wrong answer) -->
  <div id="syntax-blocks"></div>
  
  <!-- Question -->
  <p id="question-prompt"></p>
  
  <!-- Answer Buttons -->
  <div id="answer-buttons">
    <button class="answer-btn" data-index="0"></button>
    <button class="answer-btn" data-index="1"></button>
    <button class="answer-btn" data-index="2"></button>
    <button class="answer-btn" data-index="3"></button>
  </div>
  
  <!-- Feedback (persists until next answer) -->
  <div id="feedback-overlay">
    <p id="feedback-result"></p>
    <p id="feedback-explanation"></p>
  </div>
  
  <button id="quit-btn">Quit</button>
</section>

<!-- Game Over Screen -->
<section id="gameover-screen">
  <p>Final Score: <strong id="final-score"></strong></p>
  <p>Questions Answered: <strong id="final-questions"></strong></p>
  <p id="new-high-score">New High Score!</p>
  <button id="play-again-btn">Play Again</button>
  <button id="home-btn">Home</button>
</section>
```

---

## app.js API

### Global Configuration

```javascript
const STORAGE_KEY = 'grammadrill_highscore';  // LocalStorage key for high score
const FEEDBACK_DELAY = 1500;                   // ms to wait before next question
```

### State Object

```javascript
{
  score: number,          // Current score (decreases on wrong answer)
  streak: number,         // Consecutive correct answers
  qAnswered: number,      // Total questions answered
  level: string,          // Current level (A1-C2)
  language: string,       // Current language code (e.g., 'it')
  categoryLock: {         // Category lock state for l1/l2/l3 toggles
    l1: boolean,
    l2: boolean,
    l3: boolean
  },
  q: Question,            // Current question object
  done: boolean           // Whether current question is answered
}
```

### Question Object

```javascript
{
  // Required fields
  prompt: string,           // Question text to display
  choices: string[],        // Array of 4 answer choices
  correctIndex: number,     // Index of correct answer (0-3)
  explanation: string,      // Feedback explanation
  
  // Optional fields (for category/syntax display)
  category: {
    l1: string,  // Level 1: Domain (e.g., "Morfologia", "Sintassi")
    l2: string,  // Level 2: Category (e.g., "Verbi", "Pronomi")
    l3: string   // Level 3: Topic (e.g., "Coniugazione", "Pronome soggetto")
  },
  syntaxBlocks: [
    {
      text: string,           // Word/token text (updates from [hint] to correct on answer)
      role: string,           // Syntactic role (e.g., "Soggetto", "Oggetto diretto")
                               // For verbs: "Verbo (presente, 1s)"
                               // For conjunctions/prepositions: word class
      case: string|null,       // Grammatical case (e.g., "Nominativo", "Accusativo")
      gender: string|null,     // Gender: "m" or "f"
      conjugation: {
        persona: string|null,  // Person: "1s", "2s", "3s", "1p", "2p", "3p"
        tempo: string|null,    // Tense: "Presente", "Passato", etc.
        modo: string|null      // Mood: "Indicativo", "Congiuntivo", etc.
      }
    },
    // ... more blocks
  ]
}
```

### Exposed Functions

#### `init()`
Initializes the app. Must be called after DOM is ready.

```javascript
document.addEventListener('DOMContentLoaded', init);
```

#### `start()`
Starts a new game with the selected level.

```javascript
start();
// Resets state, displays first question
```

#### `end()`
Ends the current game and shows game over screen.

```javascript
end();
// Displays final score, updates high score in localStorage
```

#### `displayQ()`
Displays the next question. Called internally by `start()` and after feedback delay.

### Event Handlers

The app automatically attaches click handlers to:
- `#start-btn` - Starts game
- `#quit-btn` - Ends game
- `#play-again-btn` - Restarts game
- `#home-btn` - Returns to start screen
- `.answer-btn` - Handles answer selection
- `#lang-select` - Language selection on start screen
- `#lang-flag-btn` - Toggles language dropdown on game screen
- `#level-indicator-btn` - Toggles level dropdown on game screen
- `.category-level` - Toggles category lock state

### New DOM References

```javascript
const langSelect = document.getElementById('lang-select');        // Start screen language dropdown
const langFlagBtn = document.getElementById('lang-flag-btn');    // Game screen flag button
const langDropdown = document.getElementById('lang-dropdown');    // Language dropdown menu
const currentFlag = document.getElementById('current-flag');      // Flag display element
const levelIndicatorBtn = document.getElementById('level-indicator-btn');  // CEFR level indicator
const levelDropdown = document.getElementById('level-dropdown');  // Level dropdown menu
const currentLevel = document.getElementById('current-level');    // Level display element
```

### Language API Functions

#### `loadAvailableLanguages()`
Loads language manifest and populates language selectors.

```javascript
loadAvailableLanguages();
// Fetches languages/manifest.json and populates dropdowns
```

#### `loadLanguageModule(code)`
Dynamically loads a language module by code.

```javascript
loadLanguageModule('it');
// Loads languages/it/index.js and initializes the module
```

#### `populateLanguageSelect()`
Populates language dropdowns with available languages from manifest.

```javascript
populateLanguageSelect();
// Updates #lang-select and #lang-dropdown with available languages
```

#### `populateLevelSelect()`
Populates level dropdowns based on selected language's available levels.

```javascript
populateLevelSelect();
// Updates #level-select and #level-dropdown
```

#### `updateFlag(code)`
Updates the flag button display with the language's symbol.

```javascript
updateFlag('it');
// Sets flag button to 🇮🇹
```

#### `selectLanguage(code)`
Switches to a new language, preserving score/streak if mid-game.

```javascript
selectLanguage('it');
// Changes language, reloads UI, preserves game state
```

#### `selectLevel(level)`
Switches to a new CEFR level, preserving score/streak if mid-game.

```javascript
selectLevel('B1');
// Changes level, reloads UI, preserves game state
```

#### `updateLevelIndicator(level)`
Updates the CEFR level indicator button text.

```javascript
updateLevelIndicator('A2');
// Updates button to show "A2"
```

#### `updateSyntaxBlockForReply(replyIndex, correctText)`
Updates syntaxBlock text from [question hint] to correct text after answer.

```javascript
updateSyntaxBlockForReply(0, 'parlo');
// Updates the syntax block associated with replyIndex 0
```

#### `flashSyntaxBlock(index)`
Briefly flashes a syntax block red on wrong answer.

```javascript
flashSyntaxBlock(1);
// Flashes the syntax block at index 1 with red background
```

---

## Adding a New Language Pack

### 1. Create Package Structure

```
languages/
 +-- manifest.json       # Language registry
 +-- es/
       +-- index.js      # Spanish language module
       +-- language-pack.json  # Language pack metadata
       +-- a1.json      # Level data files
       +-- a2.json
       +-- ...
```

### 2. Update Language Manifest

Add your language to `languages/manifest.json`:

```json
{
  "languages": [
    {
      "code": "it",
      "name": "Italian",
      "symbol": "🇮🇹",
      "entryPoint": "languages/it/index.js"
    },
    {
      "code": "es",
      "name": "Spanish",
      "symbol": "🇪🇸",
      "entryPoint": "languages/es/index.js"
    }
  ]
}
```

### 3. Implement Required Module Interface

```javascript
// languages/es/index.js
const es = {
  meta: {
    code: 'es',
    name: 'Spanish',
    symbol: '🇪🇸',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']  // Must include supported levels
  },
  
  // Required: Generate a question for the given level (async - returns Promise)
  generateQuestion: function(level) {
    return ensureLevelLoaded(level).then(function() {
      // Return a Question object (see above)
      // Return null if level is not supported
    });
  },
  
  loadAll: function() {
    // Load all level JSON files
    return Promise.all(levels.map(loadLevelData));
  }
};

module.exports = es;
```

### 4. Create Language Pack Metadata

```json
// languages/es/language-pack.json
{
  "version": "1.0.0",
  "language": "es",
  "name": "Spanish",
  "symbol": "🇪🇸",
  "entryPoint": "index.js",
  "levels": {
    "A1": { "taskCount": 45 },
    "A2": { "taskCount": 52 }
  }
}
```

### 5. Language Loading (Automatic)

Languages are now dynamically loaded via the manifest. No need to manually register in app.js or update HTML script includes. The app will:

1. Fetch `languages/manifest.json` on startup
2. Populate language selectors with available languages
3. Dynamically load language modules when selected

---

## CSS Classes Reference

### Screens
- `.screen` - Base screen style
- `.screen.hidden` - Hidden state (display: none)

### Buttons
- `.primary-btn` - Main action buttons (Start, Play Again)
- `.secondary-btn` - Secondary buttons (Quit, Home)
- `.answer-btn` - Answer option buttons
- `.answer-btn.correct` / `.answer-btn.wrong` - Answer feedback states
- `.answer-btn.correct-answer` - Shows correct answer after wrong choice

### Language Selector
- `.language-select` - Language dropdown on start screen
- `.language-flag-btn` - Flag button on game screen (left of category bar)
- `.language-dropdown` - Dropdown menu for language selection
- `.language-option` - Individual language option in dropdown
- `.flag-icon` - Flag emoji icon

### Level Indicator
- `.level-indicator-btn` - CEFR level button (after flag, before l1/l2/l3)
- `.level-dropdown` - Dropdown menu for level selection
- `.level-option` - Individual level option in dropdown

### Category & Syntax
- `.category-bar` - Container for category levels (interlocking arrows style)
- `.category-level` - Individual category level box (clickable toggle)
  - `.l1` - Level 1 (domain): e.g., "Morfologia"
  - `.l2` - Level 2 (category): e.g., "Pronomi"  
  - `.l3` - Level 3 (topic): e.g., "Pronome soggetto"
  - `.locked` - Applied when category is locked (prevents randomization)
- `.syntax-blocks` - Container for syntax blocks
- `.syntax-block` - Individual syntax block card
  - `data-role` attribute for role-based styling
  - `.flash-red` - Brief red flash animation on wrong answer

### Feedback
- `.feedback` - Feedback overlay container
- `.feedback.correct` - Correct answer feedback style (no auto-advance)
- `.feedback.wrong` - Wrong answer feedback style (FEEDBACK_DELAY applies)
- `.feedback.hidden` - Hidden state

---

## Example: Adding French Language Pack

```javascript
// packages/fr/index.js

const FR_TOPICS = {
  verbs: [
    { v: 'être', m: 'to be', f: { je: 'suis', tu: 'es', il: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont' } },
    { v: 'avoir', m: 'to have', f: { j': 'ai', tu: 'as', il: 'a', nous: 'avons', vous: 'avez', ils: 'ont' } }
  ]
};

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genVerb() {
  const verb = rand(FR_TOPICS.verbs);
  const pronouns = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  const pron = rand(pronouns);
  const correct = verb.f[pron];
  const wrongs = Object.values(verb.f).filter(x => x !== correct);
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  
  return {
    category: { l1: 'Morphologie', l2: 'Verbes', l3: 'Conjugaison' },
    syntaxBlocks: [
      { text: pron, role: 'Sujet', case: 'Nominatif', gender: null, conjugation: null },
      { text: '(' + verb.v + ')', role: 'Verbe', case: null, gender: null, 
        conjugation: { persona: '3s', tempo: 'Présent', mode: 'Indicatif' } }
    ],
    prompt: pron + ' (' + verb.v + ')',
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: verb.v + ' = ' + verb.m + '. ' + pron + ' = ' + correct
  };
}

const fr = {
  meta: { code: 'fr', name: 'French', levels: ['A1', 'A2', 'B1'] },
  generateQuestion: function(level) {
    if (!fr.meta.levels.includes(level)) return null;
    return genVerb();  // Or choose generator based on level
  }
};

module.exports = fr;
```

---

## Troubleshooting

### Question returns null
- Check that the level is included in `meta.levels`
- Verify the generator function returns a valid Question object

### Syntax blocks not showing
- Ensure `syntaxBlocks` array is not empty
- Check that DOM elements `#category-bar` and `#syntax-blocks` exist

### Score not updating
- Verify `correctIndex` matches the correct answer position in `choices` array
- Ensure answer buttons have correct `data-index` attributes