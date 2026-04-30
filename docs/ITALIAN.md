# Italian Language Pack Documentation

## Overview

The Italian language pack (`languages/it/index.js`) provides grammar drill questions for Italian language learners across CEFR levels A1-C2.

For setup and installation instructions, see [SETUP.md](../SETUP.md).

## Data Source

Data is stored in JSON files at `languages/it/`:
- `a1.json` - A1 level (18 tasks)
- `a2.json` - A2 level (8 tasks)
- `b1.json` - B1 level (4 tasks)
- `b2.json` - B2 level (3 tasks)
- `c1.json` - C1 level (3 tasks)
- `c2.json` - C2 level (3 tasks)

Each JSON file contains an array of task objects with this structure:

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

### File location

The main module is at `languages/it/index.js` with JSON data files in the same directory.

### task.sentence fields

Each sentence block object:
- `text` (string): The word/phrase text
- `role` (string): Syntactic role (Soggetto, Verbo, Articolo, Complemento, etc.)
- `gender` (string, optional): "m" or "f" for nouns/articles
- `question` (string, optional): Hint shown to user. Use:
  - For verbs: infinitive (e.g., "parlare", "essere")
  - For articles: "___" (user must determine gender/number)
  - For pronouns: noun being replaced (e.g., "il ragazzo", "la ragazza")
  - For indirect objects: phrase (e.g., "a me", "a lui")

### task.replies fields

Each reply object:
- `questionIndex` (number): Which sentence block index this reply answers
- `choices` (string[]): Answer options
- `correct` (string): Correct answer
- `explanation` (string): Italian feedback explanation

---

## Module Interface

```javascript
const it = {
  meta: {
    code: 'it',
    name: 'Italian',
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  },
  
  // Generate a question (async - returns Promise)
  generateQuestion: function(level) {
    // Returns Promise resolving to Question object
  },
  
  // Load all level data
  loadAll: function() {
    // Returns Promise
  },
  
  // Get available levels
  getAvailableLevels: function() {
    // Returns string[]
  },
  
  // Get task count for level
  getTaskCount: function(level) {
    // Returns number
  }
};
```

---

## Question Object Structure

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

---

## Question Block Notation

The `question` field in sentence blocks determines what user sees:

| question value | Display | Used for |
|---------------|---------|----------|
| "parlare" | `[parlare]` | Verb - shows infinitive hint |
| "essere" | `[essere]` | Verb - shows infinitive hint |
| "___" | `[___]` | Article - user determines |
| "il ragazzo" | `[il ragazzo]` | Pronoun - shows noun |
| "a me" | `[a me]` | Indirect object |

---

## Browser Usage

```html
<script src="languages/it/index.js"></script>
<script>
  // Load all data first
  it.loadAll().then(function() {
    // Then generate questions
    it.generateQuestion('A1').then(function(q) {
      console.log(q.syntaxBlocks);
    });
  });
</script>
```

## Node.js Usage

```javascript
const it = require('./packages/it/index.js');

it.loadAll().then(function() {
  return it.generateQuestion('A1');
}).then(function(q) {
  console.log(q.category);
  console.log(q.syntaxBlocks.map(b => b.text).join(' '));
});
```

---

## Environment Detection

The module auto-detects environment:
- Browser: Uses `fetch()` to load JSON from `data/it/*.json`
- Node.js: Uses `fs.readFileSync()` to load JSON

Detection: `isBrowser = typeof document !== 'undefined'`

---

## Adding New Tasks

### 1. Edit JSON file

```json
{
  "category": { "l1": "Morfologia", "l2": "Verbi", "l3": "Coniugazione" },
  "sentence": [
    { "text": "noi", "role": "Soggetto" },
    { "text": "parliamo", "role": "Verbo", "question": "parlare" }
  ],
  "replies": [
    { 
      "questionIndex": 1, 
      "choices": ["parlo", "parli", "parla", "parlano"], 
      "correct": "parliamo", 
      "explanation": "noi + parliamo (1ª persona plurale)" 
    }
  ]
}
```

### 2. Guidelines

- `question` should show a hint, NOT the answer text
- For verbs: use infinitive ("parlare", "essere", "andare")
- For articles: use "___" (gender/number comes from following noun)
- For pronouns: use the noun being replaced
- Explanation must be in Italian

### 3. Test

```bash
node tests/italian-unit.test.js
```

---

## API Changes History

### Current (v2 - JSON-based)
- `generateQuestion(level)` returns Promise
- `loadAll()` loads all levels
- Uses `fetch()` in browser, `fs` in Node.js

### Legacy (v1 - Static data)
- `generateQuestion(level)` returns value directly
- All data embedded in `packages/it/index.js`

---

## Levels Coverage

| Level | Topics |
|-------|--------|
| A1 | Verb conjugation, articles, subject pronouns, essere/avere/andare/fare/dare/stare |
| A2 | Indirect object pronouns, reflexive verbs, passato prossimo |
| B1 | Combined pronouns, periodo ipotetico tipo 1, congiuntivo presente |
| B2 | Periodo ipotetico tipo 2, congiuntivo passato/trapassato |
| C1 | Congiuntivo imperfetto, trapassato |
| C2 | Trapassato with complex structures |