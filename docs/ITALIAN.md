# Italian Language Pack Documentation

## Overview

The Italian language pack (`packages/it/index.js`) provides grammar drill questions for Italian language learners across CEFR levels A1-C2.

## Module Interface

Every language pack must export an object with this structure:

```javascript
const it = {
  meta: {
    code: string,    // ISO 639-1 language code
    name: string,    // Display name
    levels: string[] // Supported CEFR levels
  },
  
  // Required: Generate a question for the given level
  generateQuestion: function(level) {
    // Returns Question object or null
  }
};

module.exports = it;
```

### Question Object Structure

```javascript
{
  // Required fields (for basic functionality)
  prompt: string,           // Question text displayed to user
  choices: string[],        // Array of 4 answer options
  correctIndex: number,    // Index of correct answer (0-3)
  explanation: string,      // Feedback after answer
  
  // Optional fields (for category/syntax display)
  category: {
    l1: string,  // Domain: "Morfologia" | "Sintassi" | "Pragmatica"
    l2: string,  // Category: "Verbi" | "Pronomi" | "Articoli" | etc.
    l3: string   // Specific topic: "Coniugazione" | "Pronome soggetto" | etc.
  },
  
  syntaxBlocks: [
    {
      text: string,           // Word/token to display
      role: string,            // Syntactic role
      case: string|null,       // Grammatical case
      gender: string|null,     // "m" or "f"
      conjugation: {
        persona: string|null,  // "1s", "2s", "3s", "1p", "2p", "3p"
        tempo: string|null,    // Tense name
        modo: string|null      // Mood name
      }
    }
  ]
}
```

---

## Data Structures

### A1_TOPICS

Base vocabulary and grammar for beginner level.

```javascript
const A1_TOPICS = {
  // Verb conjugations
  verbs: [
    { 
      v: 'essere',           // Verb infinitive
      m: 'to be',            // English meaning
      f: {                   // Conjugation forms
        io: 'sono', 
        tu: 'sei', 
        lui: 'è', 
        noi: 'siamo', 
        voi: 'siete', 
        loro: 'sono' 
      },
      tempo: 'Presente',     // Default tense
      modo: 'Indicativo'     // Default mood
    },
    // ... more verbs
  ],
  
  // Subject pronouns
  pronouns: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'],
  
  // Nouns with gender
  nouns: [
    { n: 'libro', g: 'm' },  // n=name, g=gender (m/f)
    { n: 'casa', g: 'f' },
    // ... more nouns
  ],
  
  // Basic question/answer pairs
  basicQ: [
    { 
      q: 'Che ore sono?',    // Question
      a: ['Sono le tre', ...], // Answers (a[0] is correct by index c)
      c: 0                   // Correct answer index
    }
  ]
};
```

### PRONOMI_TOPICS

Pronoun structures including subject, object, reflexive, and combined forms.

```javascript
const PRONOMI_TOPICS = {
  // Subject pronouns (same as A1_TOPICS.pronouns)
  soggetto: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'],
  
  // Direct object pronouns
  oggetto: ['mi', 'ti', 'lo', 'la', 'ci', 'vi', 'li', 'le'],
  
  // Reflexive verbs with conjugations
  riflessivi: [
    { 
      v: 'svegliarsi',       // Verb (infinitive)
      f: {                   // Conjugated forms with reflexive pronoun
        io: 'mi sveglio',
        tu: 'ti svegli',
        lui: 'si sveglia',
        noi: 'ci svegliamo',
        voi: 'vi svegliate',
        loro: 'si svegliano'
      }
    }
  ],
  
  // Combined pronoun forms
  combinati: [
    { 
      p: 'me lo',           // Display text
      correct: 'me lo',      // Correct answer
      wrongs: ['te lo', 'glielo', 'ce lo']  // Wrong options
    }
  ]
};
```

### PRONOUNS_MAP

Static mapping of pronouns to their grammatical properties.

```javascript
const PRONOUNS_MAP = {
  'io':   { role: 'Soggetto', case: 'Nominativo', gender: null },
  'tu':   { role: 'Soggetto', case: 'Nominativo', gender: null },
  'lui':  { role: 'Soggetto', case: 'Nominativo', gender: 'm' },
  'lei':  { role: 'Soggetto', case: 'Nominativo', gender: 'f' },
  'mi':   { role: 'Oggetto diretto', case: 'Accusativo', gender: null },
  'ti':   { role: 'Oggetto diretto', case: 'Accusativo', gender: null },
  'lo':   { role: 'Oggetto diretto', case: 'Accusativo', gender: 'm' },
  'la':   { role: 'Oggetto diretto', case: 'Accusativo', gender: 'f' },
  // ... more pronouns
};
```

### IPOTETICO_TOPICS

Conditional sentence patterns (periodo ipotetico).

```javascript
const IPOTETICO_TOPICS = {
  // Type 0: Reality (if + present → present)
  type0: [
    { 
      p: 'Se piove, ___ a casa.',  // Prompt template (___ = answer)
      a: ['resto', 'resterò', 'restavo'],  // Choices
      c: 0,                     // Correct index
      tempo: 'Presente',       // Tense for answer
      modo: 'Indicativo'       // Mood for answer
    }
  ],
  
  // Type 1: Future (if + future → future)
  type1: [...],
  
  // Type 2: Present unreal (if + subjunctive → conditional)
  type2: [...],
  
  // Type 3: Past unreal (if + past subjunctive → past conditional)
  type3: [...]
};
```

### CONGIUNTIVO_TOPICS

Subjunctive mood patterns.

```javascript
const CONGIUNTIVO_TOPICS = {
  // Present subjunctive
  presente: [
    { 
      v: 'credere',        // Main verb
      s: 'lavorare',       // Subordinate verb (infinitive)
      expect: 'lavori',    // Expected subjunctive form
      sentence: 'Credo che ___ italiano.'  // Full sentence template
    }
  ],
  
  // Past subjunctive
  passato: [...],
  
  // Imperfect subjunctive
  imperfetto: [...],
  
  // Past perfect subjunctive
  trapassato: [...]
};
```

---

## Helper Functions

### rand(arr)

Random element selection.

```javascript
function rand(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}
```

### shuffle(arr)

Fisher-Yates shuffle algorithm.

```javascript
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

### getPersona(pron)

Map pronoun to grammatical person.

```javascript
function getPersona(pron) {
  const m = { io: '1s', tu: '2s', lui: '3s', lei: '3s', noi: '1p', voi: '2p', loro: '3p' };
  return m[pron] || null;
}
// Returns: "1s" (1st singular), "2s" (2nd singular), "3s" (3rd singular),
//          "1p" (1st plural), "2p" (2nd plural), "3p" (3rd plural)
```

### Syntax Block Builders

Helper functions to create standardized syntax blocks.

```javascript
// Build verb syntax block
buildVerbBlock(verb, pron, form)
// Returns: { text, role: 'Verbo', case: null, gender: null, 
//            conjugation: { persona, tempo, modo } }

// Build pronoun syntax block
buildPronounBlock(pron, isRiflessivo)
// Returns: { text, role, case, gender, conjugation: null }

// Build subject syntax block
buildSoggettoBlock(pron)
// Returns: { text, role: 'Soggetto', case: 'Nominativo', gender, conjugation }

// Build article syntax block
buildArticoloBlock(art, noun)
// Returns: { text, role: 'Articolo', case, gender, conjugation }

// Build noun/complement syntax block
buildSostantivoBlock(noun)
// Returns: { text, role: 'Complemento', case, gender, conjugation }

// Build preposition syntax block
buildPreposizioneBlock(prep)
// Returns: { text, role: 'Preposizione', case, gender, conjugation }

// Build conjunction syntax block
buildCongiunzioneBlock(conn)
// Returns: { text, role: 'Congiunzione', case, gender, conjugation }
```

---

## Generator Functions

Each generator creates a question with category and syntax metadata.

### genVerb()

Verb conjugation practice.

```javascript
// Example output:
{
  category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Coniugazione' },
  syntaxBlocks: [
    { text: 'io', role: 'Soggetto', case: 'Nominativo', gender: null, conjugation: null },
    { text: '(mangiare)', role: 'Verbo', case: null, gender: null, 
      conjugation: { persona: '1s', tempo: 'Presente', modo: 'Indicativo' } }
  ],
  prompt: 'Io (mangiare)',
  choices: ['mangio', 'mangi', 'mangia', 'mangiamo'],
  correctIndex: 0,
  explanation: '"mangiare" = "to eat". io = mangio'
}
```

### genDefArt() / genIndefArt()

Article selection (definite/indefinite).

```javascript
// genDefArt() example:
{
  category: { l1: 'Morfologia', l2: 'Articoli', l3: 'Articolo definito' },
  syntaxBlocks: [
    { text: 'il', role: 'Articolo', case: null, gender: 'm', conjugation: null },
    { text: 'libro', role: 'Complemento', case: null, gender: 'm', conjugation: null }
  ],
  prompt: 'il libro',
  choices: ['il', 'lo', 'la', 'i'],
  correctIndex: 0,
  explanation: 'il is the masculine singular definite article'
}
```

### genPronSoggetto() / genPronOggetto()

Pronoun recognition.

```javascript
// genPronSoggetto() example:
{
  category: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome soggetto' },
  syntaxBlocks: [
    { text: 'noi', role: 'Soggetto', case: 'Nominativo', gender: null, conjugation: null },
    { text: '', role: 'Verbo', case: null, gender: null, 
      conjugation: { persona: '1p', tempo: 'Presente', modo: 'Indicativo' } }
  ],
  prompt: 'Pronome soggetto: io?',
  choices: ['io', 'tu', 'lui', 'lei'],
  correctIndex: 0,
  explanation: 'noi è un pronome soggetto'
}
```

### genPronRiflessivo()

Reflexive verb conjugation.

```javascript
// Example:
{
  category: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome riflessivo' },
  syntaxBlocks: [
    { text: 'mi', role: 'Riflessivo', case: null, gender: null, conjugation: null },
    { text: 'sveglio', role: 'Verbo', case: null, gender: null,
      conjugation: { persona: '1s', tempo: 'Presente', modo: 'Indicativo' } }
  ],
  prompt: 'Io (svegliarsi)',
  choices: ['mi sveglio', 'ti svegli', 'si sveglia', 'ci svegliamo'],
  correctIndex: 0,
  explanation: 'svegliarsi è un verbo riflessivo: io mi sveglio'
}
```

### genIpotetico(type)

Conditional sentences (type 0-3).

```javascript
// genIpotetico('type0') example:
{
  category: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Tipo 0' },
  syntaxBlocks: [
    { text: 'Se', role: 'Congiunzione', case: null, gender: null, conjugation: null },
    { text: 'piove', role: 'Soggetto', case: 'Nominativo', gender: null, conjugation: null },
    { text: '___', role: 'Verbo', case: null, gender: null,
      conjugation: { persona: '1s/3s', tempo: 'Presente', modo: 'Indicativo' } },
    { text: 'casa', role: 'Complemento', case: null, gender: null, conjugation: null }
  ],
  prompt: 'Tipo 0 (realtà). Se piove, ___ a casa.',
  choices: ['resto', 'resterò', 'restavo'],
  correctIndex: 0,
  explanation: 'La risposta corretta è: resto'
}
```

### genCongiuntivo(type)

Subjunctive mood (presente, passato, imperfetto, trapassato).

```javascript
// genCongiuntivo('presente') example:
{
  category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Congiuntivo presente' },
  syntaxBlocks: [
    { text: 'Credo', role: 'Verbo', case: null, gender: null,
      conjugation: { persona: '1s', tempo: 'Presente', modo: 'Indicativo' } },
    { text: 'che', role: 'Congiunzione', case: null, gender: null, conjugation: null },
    { text: '___', role: 'Verbo', case: null, gender: null,
      conjugation: { persona: '3s', tempo: 'Presente', modo: 'Congiuntivo' } }
  ],
  prompt: 'Congiuntivo presente. Credo che ___ italiano.',
  choices: ['sia', 'è', 'era', 'sarà'],
  correctIndex: 0,
  explanation: 'Dopo "credere" si usa il congiuntivo: sia'
}
```

---

## Level-Based Generator Mapping

```javascript
const generatorsA1 = [genVerb, genDefArt, genIndefArt, genBasicQ, genPronSoggetto];
const generatorsA2 = [...generatorsA1, genPronOggetto, genPronRiflessivo];
const generatorsB1 = [...generatorsA2, () => genIpotetico('type0'), () => genIpotetico('type1')];
const generatorsB2 = [...generatorsB1, () => genIpotetico('type2'), genCongiuntivoPresent, genCongiuntivoPass];
const generatorsC1 = [...generatorsB2, () => genIpotetico('type3'), genCongiuntivoImp, genCongiuntivoTrap];
const generatorsC2 = [...generatorsC1, genPronCombinato];

const generatorsByLevel = {
  A1: generatorsA1,
  A2: generatorsA2,
  B1: generatorsB1,
  B2: generatorsB2,
  C1: generatorsC1,
  C2: generatorsC2
};
```

### Topics by Level

| Level | Topics |
|-------|--------|
| A1 | Verb conjugation, definite/indefinite articles, basic questions, subject pronouns |
| A2 | + direct object pronouns, reflexive verbs |
| B1 | + conditional type 0 & 1 |
| B2 | + conditional type 2, subjunctive present/past |
| C1 | + conditional type 3, subjunctive imperfect/past perfect |
| C2 | + combined pronouns |

---

## Adding New Topics

### 1. Add Vocabulary to Topic Structure

```javascript
// Example: Adding new verbs to A1_TOPICS
A1_TOPICS.verbs.push({
  v: 'leggere',
  m: 'to read',
  f: { io: 'leggo', tu: 'leggi', lui: 'legge', noi: 'leggiamo', voi: 'leggete', loro: 'leggono' },
  tempo: 'Presente',
  modo: 'Indicativo'
});
```

### 2. Create Generator Function

```javascript
function genNewTopic() {
  const item = rand(NEW_TOPICS.items);
  const correct = item.correct;
  const wrongs = item.wrongs;
  const choices = shuffle([correct, ...wrongs]);
  
  return {
    category: { l1: 'Morfologia', l2: 'NewCategory', l3: 'NewTopic' },
    syntaxBlocks: [
      // Build appropriate syntax blocks
      { text: correct, role: 'NewRole', case: 'Case', gender: 'm/f', conjugation: {...} }
    ],
    prompt: item.prompt,
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: item.explanation
  };
}
```

### 3. Add to Level Mapping

```javascript
// Add to specific level generator array
const generatorsB1 = [...generatorsA2, () => genIpotetico('type0'), () => genIpotetico('type1'), genNewTopic];
```

---

## Syntactic Role Reference

| Role | Italian | Description |
|------|---------|-------------|
| Soggetto | Subject | io, tu, lui... |
| Oggetto diretto | Direct object | mi, ti, lo, la... |
| Oggetto indiretto | Indirect object | a me, a te... |
| Riflessivo | Reflexive | mi, ti, si... (reflexive) |
| Verbo | Verb | Conjugated verb |
| Articolo | Article | il, lo, la, un... |
| Complemento | Complement/Noun | Nouns and complements |
| Preposizione | Preposition | a, di, in, con... |
| Congiunzione | Conjunction | se, che, quando... |
| Interrogativo | Interrogative | chi, dove, come... |

---

## Conjugation Reference

### Persona (Person)

| Code | Italian | English |
|------|---------|---------|
| 1s | 1ª persona singolare | I |
| 2s | 2ª persona singolare | you (singular) |
| 3s | 3ª persona singolare | he/she/it |
| 1p | 1ª persona plurale | we |
| 2p | 2ª persona plurale | you (plural) |
| 3p | 3ª persona plurale | they |

### Tempo (Tense)

- Presente (Present)
- Passato (Past)
- Passato prossimo (Present perfect)
- Imperfetto (Imperfect)
- Trapassato (Past perfect)
- Futuro (Future)
- Condizionale (Conditional)

### Modo (Mood)

- Indicativo (Indicative)
- Congiuntivo (Subjunctive)
- Condizionale (Conditional)
- Imperativo (Imperative)

---

## Examples

### Full Question Object

```javascript
{
  category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Coniugazione' },
  syntaxBlocks: [
    { text: 'lui', role: 'Soggetto', case: 'Nominativo', gender: 'm', conjugation: null },
    { text: '(essere)', role: 'Verbo', case: null, gender: null,
      conjugation: { persona: '3s', tempo: 'Presente', modo: 'Indicativo' } }
  ],
  prompt: 'Lui (essere)',
  choices: ['è', 'sono', 'sei', 'siamo'],
  correctIndex: 0,
  explanation: '"essere" = "to be". lui = è'
}
```

### Testing a Generator

```javascript
const it = require('./packages/it/index.js');

// Generate a B2 question
const q = it.generateQuestion('B2');

console.log('Category:', q.category.l1, '>', q.category.l2, '>', q.category.l3);
console.log('Prompt:', q.prompt);
console.log('Correct answer:', q.choices[q.correctIndex]);

// Expected output:
// Category: Morfologia > Pronomi > Pronome oggetto
// Prompt: Pronome oggetto: "a me" →
// Correct answer: mi (or whichever is correct)
```