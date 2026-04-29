# GrammarDrill - Specification Document

## Project Overview

**Project Name:** GrammarDrill
**Project Type:** Mobile-optimized SPA (Single Page Application)
**Core Functionality:** A gamified grammar training app with multiple choice questions for various languages, starting with Italian.
**Target Users:** Language learners seeking quick grammar practice on mobile devices.

---

## Technology Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Architecture:** Single Page Application (SPA)
- **Storage:** LocalStorage for high scores
- **No build step required** - runs directly in browser

---

## UI/UX Specification

### Screens

1. **Start Screen**
   - App title
   - Level selector (A1-C2 dropdown)
   - Current high score display
   - "Start" button

2. **Game Screen**
   - Score display (top-left)
   - Streak counter (top-right)
   - Question prompt area
   - 4 answer buttons (2x2 grid)
   - Feedback overlay (correct/wrong + answer)
   - "Quit" button

3. **Game Over Screen**
   - "Game Over" message
   - Final score
   - Total questions answered
   - New high score indicator (if applicable)
   - "Play Again" button
   - "Home" button

### Navigation Flow

```
Start Screen → Game Screen ↔ Game Over Screen
                 ↑                      │
                 └──────────────────────┘
```

### Visual Design

**Color Palette:**
- Background: `#fafafa` (off-white)
- Primary text: `#1a1a1a` (near-black)
- Primary accent: `#2563eb` (blue)
- Correct answer: `#16a34a` (green)
- Wrong answer: `#dc2626` (red)
- Button background: `#ffffff`
- Button border: `#e5e5e5`
- Disabled/used: `#a3a3a3`

**Typography:**
- Font family: System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- Question text: 24px, medium weight
- Button text: 20px, medium weight
- Score/stats: 18px, regular weight
- Small text: 14px

**Spacing:**
- Base unit: 8px
- Screen padding: 24px
- Button gap: 12px
- Section gap: 24px

**Touch Targets:**
- Minimum button height: 64px
- Button padding: 16px
- Border radius: 12px

---

## Functionality Specification

### Core Features

1. **Level Selection**
   - Levels: A1, A2, B1, B2, C1, C2
   - Default: A1
   - Stored in session (resets on page reload)

2. **Question Generation**
   - Questions loaded from JSON files via `fetch()` API
   - Each question has: syntaxBlocks, replies with choices/correctIndex/explanation
   - Questions are multiple choice (4 options per reply slot)
   - Multi-reply questions supported (multiple replyIndex slots)

3. **Scoring System**
   - Start score: 0
   - Correct answer: +1 point
   - Wrong answer: -1 point
   - Game over: score drops to 0 or below
   - Track streak (consecutive correct answers)
   - Track total questions answered in session

4. **Answer Feedback**
   - On answer: highlight selected choice
   - Show correct answer (green if correct, red if wrong)
   - Show brief explanation (in target language)
   - Auto-advance after 1.5 seconds

5. **High Score**
   - Global high score across all levels
   - Stored in LocalStorage key: `grammadrill_highscore`
   - Displayed on start screen
   - Updated on game over if new high score

### Language Pack Interface

Each language pack lives in `/languages/<ISO_CODE>/` with:

```javascript
// /languages/<ISO_CODE>/index.js
(function() {
  'use strict';

  function loadLevelData(level) {
    var url = 'languages/' + level + '/' + level.toLowerCase() + '.json';
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      dataCache[level.toUpperCase()] = data;
      return data;
    });
  }

  var it = {
    meta: {
      code: 'it',           // ISO code
      name: 'Italian',      // Display name
      levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']  // Available levels
    },
    
    // Generate a question (async - returns Promise)
    generateQuestion: function(level) {
      return ensureLevelLoaded(level).then(function() {
        // ... generate and return question object
      });
    },
    
    loadAll: function() {
      // Load all level JSON files
      return Promise.all(levels.map(loadLevelData));
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = it;
  } else {
    window.it = it;
  }
})();
```

### Question Object Structure

```javascript
{
  id: "abc123",           // Hash ID
  level: "A1",          // CEFR level
  
  category: {
    l1: "Morfologia",   // Domain
    l2: "Verbi",        // Category
    l3: "Coniugazione" // Topic
  },
  
  syntaxBlocks: [
    {
      text: "io",                    // Display text
      role: "Soggetto",            // Syntactic role
      gender: null,              // "m" | "f" | null
      conjugation: null,          // { persona, tempo, modo } or null
      replyIndex: null            // Set if this block is a question
    }
  ],
  
  replies: [
    {
      choices: ["parlo", "parli", ...],
      correctIndex: 0,
      explanation: "Spiegazione..."
    }
  ]
}
```

### Data Source (JSON Files)

Each level has its own JSON file in the language directory:

```
languages/it/
├── index.js       # Module loader (fetch-based)
├── a1.json       # A1 level data
├── a2.json       # A2 level data
├── b1.json       # B1 level data
├── b2.json       # B2 level data
├── c1.json       # C1 level data
└── c2.json       # C2 level data
```

JSON structure:
```json
[
  {
    "category": { "l1": "Morfologia", "l2": "Verbi", "l3": "Coniugazione" },
    "sentence": [
      { "text": "io", "role": "Soggetto" },
      { "text": "parlo", "role": "Verbo", "question": "parlare" }
    ],
    "replies": [
      { "questionIndex": 1, "choices": ["parlo", "parli", "parla", "parlano"], "correct": "parlo", "explanation": "io + parlo (1ª persona singolare presente)" }
    ]
  }
]
```

**Question field rules:**
- Verbs: use infinitive ("parlare", "essere", "andare")
- Articles: use "___" (gender/number from following noun)
- Pronouns: use noun being replaced ("il ragazzo", "la ragazza")
- Indirect objects: use phrase ("a me", "a lui")

---

## Italian Language Pack

### Available Levels

| Level | Description | Topics |
|-------|-------------|--------|
| A1 | Beginner | Verb conjugation, articles, subject pronouns, essere/avere/andare/fare/dare/stare |
| A2 | Elementary | Indirect object pronouns, reflexive verbs, passato prossimo |
| B1 | Intermediate | Combined pronouns, periodo ipotetico tipo 1, congiuntivo presente |
| B2 | Upper-Intermediate | Periodo ipotetico tipo 2, congiuntivo passato/trapassato |
| C1 | Advanced | Congiuntivo imperfetto, trapassato |
| C2 | Mastery | Trapassato with complex structures |

### Question Block Notation

The `question` field in sentence blocks determines what user sees:

| question value | Display | Used for |
|---------------|---------|----------|
| "parlare" | `[parlare]` | Verb - shows infinitive hint |
| "essere" | `[essere]` | Verb - shows infinitive hint |
| "___" | `[___]` | Article - user determines |
| "il ragazzo" | `[il ragazzo]` | Pronoun - shows noun |
| "a me" | `[a me]` | Indirect object |

---

## Edge Cases

- No questions available for selected level: Show error, return to start
- LocalStorage unavailable: Graceful degradation (no high score persistence)
- All choices are the same: Shuffle to avoid trivial questions
- fetch() fails (file:// protocol): Advise user to use HTTP server

---

## Acceptance Criteria

1. ✅ App loads without errors on mobile and desktop browsers
2. ✅ Level can be selected from dropdown
3. ✅ Questions display with 4 tappable answer buttons
4. ✅ Correct answer shows green feedback
5. ✅ Wrong answer shows red feedback with correct answer
6. ✅ Score updates correctly (+1/-1)
7. ✅ Streak counter increments on correct, resets on wrong
8. ✅ Game over triggers when score ≤ 0
9. ✅ High score persists in LocalStorage
10. ✅ New high score is highlighted on game over
11. ✅ All touch targets are at least 64px tall
12. ✅ Language pack can be swapped by replacing `/languages/it/` directory
13. ✅ Questions generate asynchronously (generateQuestion returns Promise)
14. ✅ Data loads from JSON files (not embedded in JS)
15. ✅ Explanations are in target language (Italian)

---

## Development Setup

For detailed setup instructions, see [SETUP.md](SETUP.md).

Quick start:
```bash
npm install          # Install dependencies
npx playwright install chromium  # Install browsers for E2E tests
node tests/italian-unit.test.js   # Run unit tests
npm run serve       # Start dev server at localhost:3000
```
