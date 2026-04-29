# GrammarDrill App Documentation

## Overview

GrammarDrill is a gamified grammar practice web application. The app presents multiple-choice grammar questions, tracks scores/streaks, and provides feedback with explanations.

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
│         packages/it/index.js            │
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
  
  <!-- Category Bar (optional) -->
  <div id="category-bar">
    <span class="category-badge l1"></span>
    <span class="category-sep">:</span>
    <span class="category-badge l2"></span>
    <span class="category-sep">:</span>
    <span class="category-badge l3"></span>
  </div>
  
  <!-- Syntax Blocks (optional) -->
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
  
  <!-- Feedback -->
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
  score: number,      // Current score (decreases on wrong answer)
  streak: number,     // Consecutive correct answers
  qAnswered: number,  // Total questions answered
  level: string,      // Current level (A1-C2)
  q: Question,        // Current question object
  done: boolean       // Whether current question is answered
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
      text: string,           // Word/token text
      role: string,           // Syntactic role (e.g., "Soggetto", "Verbo")
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

---

## Adding a New Language Pack

### 1. Create Package Structure

```
packages/
  +-- es/
      +-- index.js    # Spanish language module
```

### 2. Implement Required Module Interface

```javascript
// packages/es/index.js
const es = {
  meta: {
    code: 'es',
    name: 'Spanish',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']  // Must include supported levels
  },
  
  // Required: Generate a question for the given level
  generateQuestion: function(level) {
    // Return a Question object (see above)
    // Return null if level is not supported
  }
};

module.exports = es;
```

### 3. Register the Language in app.js

```javascript
const languages = {
  it: require('./packages/it/index.js'),
  es: require('./packages/es/index.js')  // Add your language
};
```

### 4. Update HTML Script Include

```html
<script src="packages/it/index.js"></script>
<script src="packages/es/index.js"></script>
<script src="app.js"></script>
```

### 5. (Optional) Add Level Selector Option

In `index.html`, add an option to the level select:

```html
<select id="level-select">
  <option value="A1">A1 - Beginner</option>
  <!-- ... existing options ... -->
  <option value="es-A1">Spanish A1</option>
</select>
```

Or implement language switching in the UI.

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

### Category & Syntax
- `.category-bar` - Container for category badges
- `.category-badge` - Individual category badge
  - `.l1` - Level 1 (domain)
  - `.l2` - Level 2 (category)  
  - `.l3` - Level 3 (topic)
- `.category-sep` - Separator between badges (`:`)
- `.syntax-blocks` - Container for syntax blocks
- `.syntax-block` - Individual syntax block card
  - `data-role` attribute for role-based styling

### Feedback
- `.feedback` - Feedback overlay container
- `.feedback.correct` - Correct answer feedback style
- `.feedback.wrong` - Wrong answer feedback style
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