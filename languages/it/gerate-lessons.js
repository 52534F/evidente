const fs = require('fs');
const path = require('path');

// Template sentences for A1
const a1Templates = [
  // Presente -are
  { verb: 'parlare', conjugation: { io: 'parlo', tu: 'parli', lui: 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' }},
  { verb: 'lavorare', conjugation: { io: 'lavoro', tu: 'lavori', lui: 'lavora', noi: 'lavoriamo', voi: 'lavorate', loro: 'lavorano' }},
  { verb: 'camminare', conjugation: { io: 'cammino', tu: 'cammini', lui: 'cammina', noi: 'camminiamo', voi: 'camminate', loro: 'camminano' }},
  { verb: 'nuotare', conjugation: { io: 'nuoto', tu: 'nuoti', lui: 'nuota', noi: 'nuotiamo', voi: 'nuotate', loro: 'nuotano' }},
  { verb: 'ascoltare', conjugation: { io: 'ascolto', tu: 'ascolti', lui: 'ascolta', noi: 'ascoltiamo', voi: 'ascoltate', loro: 'ascoltano' }},
  { verb: 'comprare', conjugation: { io: 'compro', tu: 'compri', lui: 'compra', noi: 'compriamo', voi: 'comprate', loro: 'comprano' }},
  
  // Presente -ere
  { verb: 'scrivere', conjugation: { io: 'scrivo', tu: 'scrivi', lui: 'scrive', noi: 'scriviamo', voi: 'scrivete', loro: 'scrivono' }},
  { verb: 'leggere', conjugation: { io: 'leggo', tu: 'leggi', lui: 'legge', noi: 'leggiamo', voi: 'leggete', loro: 'leggono' }},
  { verb: 'vedere', conjugation: { io: 'vedo', tu: 'vedi', lui: 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' }},
  { verb: 'prendere', conjugation: { io: 'prendo', tu: 'prendi', lui: 'prende', noi: 'prendiamo', voi: 'prendete', loro: 'prendono' }},
  { verb: 'chiedere', conjugation: { io: 'chiedo', tu: 'chiedi', lui: 'chiede', noi: 'chiediamo', voi: 'chiedete', loro: 'chiedono' }},
  { verb: 'mettere', conjugation: { io: 'metto', tu: 'metti', lui: 'mette', noi: 'mettiamo', voi: 'mettete', loro: 'mettono' }},
  
  // Presente -ire
  { verb: 'dormire', conjugation: { io: 'dormo', tu: 'dormi', lui: 'dorme', noi: 'dormiamo', voi: 'dormite', loro: 'dormono' }},
  { verb: 'sentire', conjugation: { io: 'sento', tu: 'senti', lui: 'sente', noi: 'sentiamo', voi: 'sentite', loro: 'sentono' }},
  { verb: 'finire', conjugation: { io: 'finisco', tu: 'finisci', lui: 'finisce', noi: 'finiamo', voi: 'finite', loro: 'finiscono' }},
  { verb: 'capire', conjugation: { io: 'capisco', tu: 'capisci', lui: 'capisce', noi: 'capiamo', voi: 'capite', loro: 'capiscono' }},
  { verb: 'pulire', conjugation: { io: 'pulisco', tu: 'pulisci', lui: 'pulisce', noi: 'puliamo', voi: 'pulite', loro: 'puliscono' }},
  { verb: 'obbedire', conjugation: { io: 'obbedisco', tu: 'obbedisci', lui: 'obbedisce', noi: 'obbediamo', voi: 'obbedite', loro: 'obbediscono' }},
  
  // Irregular verbs
  { verb: 'essere', conjugation: { io: 'sono', tu: 'sei', lui: 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }},
  { verb: 'avere', conjugation: { io: 'ho', tu: 'hai', lui: 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' }},
  { verb: 'andare', conjugation: { io: 'vado', tu: 'vai', lui: 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' }},
  { verb: 'fare', conjugation: { io: 'faccio', tu: 'fai', lui: 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' }},
  { verb: 'dare', conjugation: { io: 'do', tu: 'dai', lui: 'dà', noi: 'diamo', voi: 'date', loro: 'danno' }},
  { verb: 'stare', conjugation: { io: 'sto', tu: 'stai', lui: 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' }}
];

// Objects and complements for sentences
const objects = [
  { text: 'italiano', gender: 'm' },
  { text: 'libro', gender: 'm' },
  { text: 'penna', gender: 'f' },
  { text: 'casa', gender: 'f' },
  { text: 'cinema', gender: 'm' },
  { text: 'scuola', gender: 'f' },
  { text: 'lavoro', gender: 'm' },
  { text: 'caffè', gender: 'm' },
  { text: 'musica', gender: 'f' },
  { text: 'giornale', gender: 'm' }
];

const subjects = [
  { text: 'io', role: 'Soggetto' },
  { text: 'tu', role: 'Soggetto' },
  { text: 'lui', role: 'Soggetto', gender: 'm' },
  { text: 'lei', role: 'Soggetto', gender: 'f' },
  { text: 'noi', role: 'Soggetto' },
  { text: 'voi', role: 'Soggetto' },
  { text: 'loro', role: 'Soggetto' }
];

const adverbs = ['sempre', 'bene', 'oggi', 'molto', 'spesso', 'qui', 'là'];

function generateA1Sentences() {
  const sentences = [];
  let id = 1000; // Start with high ID to avoid conflicts
  
  // Generate present tense sentences
  a1Templates.forEach(template => {
    subjects.forEach(subj => {
      const verbForm = template.conjugation[subj.text];
      if (!verbForm) return;
      
      const obj = objects[Math.floor(Math.random() * objects.length)];
      const adv = adverbs[Math.floor(Math.random() * adverbs.length)];
      
      // Pattern 1: subject + verb + object
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Presente - ' + template.verb.split('').pop() + 're' },
        sentence: [
          { text: subj.text, role: subj.role, gender: subj.gender || null },
          { text: verbForm, role: 'Verbo (' + subj.text + ')', question: template.verb + ' (' + subj.text + ')' },
          { text: obj.text, role: 'Complemento', gender: obj.gender }
        ],
        replies: [{
          questionIndex: 1,
          choices: generateChoices(verbForm, template.verb, subj.text),
          correct: verbForm,
          explanation: subj.text + ' + ' + template.verb + ' (' + getPerson(subj.text) + ')'
        }]
      });
      
      // Pattern 2: subject + verb + adverb
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Presente - ' + template.verb.split('').pop() + 're' },
        sentence: [
          { text: subj.text, role: subj.role, gender: subj.gender || null },
          { text: verbForm, role: 'Verbo (' + subj.text + ')', question: template.verb + ' (' + subj.text + ')' },
          { text: adv, role: 'Avverbio' }
        ],
        replies: [{
          questionIndex: 1,
          choices: generateChoices(verbForm, template.verb, subj.text),
          correct: verbForm,
          explanation: subj.text + ' + ' + template.verb + ' (' + getPerson(subj.text) + ')'
        }]
      });
    });
  });
  
  return sentences;
}

function generateChoices(correct, verb, subject) {
  const persons = { 'io': 'tu', 'tu': 'lui', 'lui': 'io', 'lei': 'noi', 'noi': 'voi', 'voi': 'loro', 'loro': 'io' };
  const templates = a1Templates.find(t => t.verb === verb);
  if (!templates) return [correct, 'x', 'y', 'z'];
  
  const otherPerson = persons[subject] || 'tu';
  const incorrect = templates.conjugation[otherPerson];
  const allChoices = [correct, incorrect, 'mangio', 'parlo'];
  return [...new Set(allChoices)].slice(0, 4);
}

function getPerson(subject) {
  const map = {
    'io': '1ª persona singolare',
    'tu': '2ª persona singolare',
    'lui': '3ª persona singolare (m)',
    'lei': '3ª persona singolare (f)',
    'noi': '1ª persona plurale',
    'voi': '2ª persona plurale',
    'loro': '3ª persona plurale'
  };
  return map[subject] || subject;
}

// Generate lessons for all levels
console.log('Generating A1 sentences...');
const a1New = generateA1Sentences();
console.log('Generated ' + a1New.length + ' new A1 sentences');

// Read existing data
const a1Existing = JSON.parse(fs.readFileSync('/home/rso/opencode/evidente/languages/it/a1.json', 'utf8'));
console.log('Existing A1 sentences: ' + a1Existing.length);

// Merge and save
const a1Merged = [...a1Existing, ...a1New];
fs.writeFileSync('/home/rso/opencode/evidente/languages/it/a1.json', JSON.stringify(a1Merged, null, 2), 'utf8');
console.log('Total A1 sentences after merge: ' + a1Merged.length);

// Update language-pack.json
const pack = JSON.parse(fs.readFileSync('/home/rso/opencode/evidente/languages/it/language-pack.json', 'utf8'));
pack.levels.A1.taskCount = a1Merged.length;
pack.lastUpdated = '2026-04-30';
fs.writeFileSync('/home/rso/opencode/evidente/languages/it/language-pack.json', JSON.stringify(pack, null, 2), 'utf8');
console.log('Updated language-pack.json');

console.log('\nDone! Generated ' + a1New.length + ' new A1 sentences.');
console.log('Next steps: Generate for A2, B1, B2, C1, C2 levels.');
