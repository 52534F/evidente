// ============================================================
// ITALIAN LANGUAGE PACK - REFACTORED
// ============================================================
// Data → Helpers → Generators → Export
// ============================================================

// ------------------------------------------------------------
// SECTION 1: DATA - All vocabulary and topic data
// ------------------------------------------------------------

const DATA = {
  // A1 Level - Basic vocabulary
  nouns: [
    { n: 'libro', g: 'm' }, { n: 'ragazzo', g: 'm' }, { n: 'casa', g: 'f' }, { n: 'macchina', g: 'f' },
    { n: 'tavolo', g: 'm' }, { n: 'sedia', g: 'f' }, { n: 'uomo', g: 'm' }, { n: 'donna', g: 'f' },
    { n: 'amico', g: 'm' }, { n: 'ragazza', g: 'f' }, { n: 'italiano', g: 'm' }, { n: 'italiana', g: 'f' }
  ],
  
  verbs: [
    { v: 'essere', m: 'to be', f: { io: 'sono', tu: 'sei', lui: 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'avere', m: 'to have', f: { io: 'ho', tu: 'hai', lui: 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'mangiare', m: 'to eat', f: { io: 'mangio', tu: 'mangi', lui: 'mangia', noi: 'mangiamo', voi: 'mangiate', loro: 'mangiano' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'bere', m: 'to drink', f: { io: 'bevo', tu: 'beve', lui: 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'andare', m: 'to go', f: { io: 'vado', tu: 'vai', lui: 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'fare', m: 'to do', f: { io: 'faccio', tu: 'fai', lui: 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'parlare', m: 'to speak', f: { io: 'parlo', tu: 'parli', lui: 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'vedere', m: 'to see', f: { io: 'vedo', tu: 'vedi', lui: 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'dare', m: 'to give', f: { io: 'do', tu: 'dai', lui: 'dà', noi: 'diamo', voi: 'date', loro: 'danno' }, tempo: 'Presente', modo: 'Indicativo' },
    { v: 'stare', m: 'to stay', f: { io: 'sto', tu: 'stai', lui: 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' }, tempo: 'Presente', modo: 'Indicativo' }
  ],
  
  pronouns: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'],
  
  subjects: ['Luigi', 'Maria', 'Mario', 'Anna'],
  
  // Verbs by tense/type for various generators
  ipotetico: {
    type1: { sentence: 'Se domani piove [andare] a casa', choices: ['andrò', 'vado', 'resto', 'andrà'], correct: 'andrò' },
    type2: { 
      sentence: 'Se [avere] fame [mangiare] la pizza',
      choicesCond: ['avessi', 'avevo', 'avrò', 'ho'],
      choicesMangiare: ['mangerei', 'mangio', 'mangia', 'mangerò'],
      correctCond: 'avessi',
      correctMangiare: 'mangerei'
    },
    type3: {
      sentence: 'Se [avere] [mangiare], non [avere] fame',
      choicesAvere1: ['avessi', 'avevo', 'avrò', 'ho'],
      choicesMangiare: ['mangiato', 'mangio', 'mangia', 'mangerò'],
      choicesAvere2: ['avrei', 'ero', 'sarò', 'sono'],
      correctAvere1: 'avessi',
      correctMangiare: 'mangiato',
      correctAvere2: 'avrei'
    }
  },
  
  congiuntivo: {
    presente: { sentence: 'Credo che [lavorare] italiano', choices: ['lavori', 'lava', 'lavorava', 'lavorerà'], correct: 'lavori' },
    passato: { sentence: 'Spero che [finire] il lavoro', choices: ['finisca', 'finiva', 'finirà', 'finisse'], correct: 'finisca' },
    imperfetto: { sentence: 'Credo che [lavorare] italiano', choices: ['lavorasse', 'lavorava', 'lavor��', 'lavorerà'], correct: 'lavorasse' },
    trapassato: {
      sentence: 'Se non [avere] tempo, non [finire] il lavoro',
      choicesAv: ['avessi', 'avevo', 'avrò', 'ho'],
      choicesFin: ['finisse', 'finiva', 'finirà', 'finito'],
      correctAv: 'avessi',
      correctFin: 'finisse'
    }
  },
  
  reflexiveVerbs: [
    { v: 'svegliarsi', f: { io: 'mi sveglio', tu: 'ti svegli', lui: 'si sveglia', noi: 'ci svegliamo', voi: 'vi svegliate', loro: 'si svegliano' } },
    { v: 'lavarsi', f: { io: 'mi lavo', tu: 'ti lavi', lui: 'si lava', noi: 'ci laviamo', voi: 'vi lavate', loro: 'si lavano' } },
    { v: 'alzarsi', f: { io: 'mi alzo', tu: 'ti alzi', lui: 'si alza', noi: 'ci alziamo', voi: 'vi alzate', loro: 'si alzano' } }
  ]
};

// ------------------------------------------------------------
// SECTION 2: HELPER FUNCTIONS - Reusable code components
// ------------------------------------------------------------

// Basic array helpers
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mapping helpers
function getPersona(pron) {
  const m = { io: '1s', tu: '2s', lui: '3s', lei: '3s', noi: '1p', voi: '2p', loro: '3p' };
  return m[pron] || null;
}

// Syntax block builders
const BLOCK = {
  // Context blocks (no answer - just display)
  soggetto: (text, gender = null) => ({ text, role: 'Soggetto', case: 'Nominativo', gender, conjugation: null }),
  verbo: (text, persona = '3s', tempo = 'Presente', modo = 'Indicativo') => ({ text, role: 'Verbo', case: null, gender: null, conjugation: { persona, tempo, modo } }),
  articolo: (text, gender) => ({ text, role: 'Articolo', case: null, gender, conjugation: null }),
  complemento: (text, gender) => ({ text, role: 'Complemento', case: null, gender, conjugation: null }),
  avverbio: (text) => ({ text, role: 'Avverbio', case: null, gender: null, conjugation: null }),
  
  // Answer blocks - wraps text in brackets with replyIndex
  answer: (text, role, replyIndex, options = {}) => ({
    text: '[' + text + ']',
    role,
    case: options.case || null,
    gender: options.gender || null,
    replyIndex,
    conjugation: options.conjugation || null
  }),
  
  // Legacy answer with underscore
  placeholder: (role, replyIndex, options = {}) => ({
    text: '___',
    role,
    case: options.case || null,
    gender: options.gender || null,
    replyIndex,
    conjugation: options.conjugation || null
  })
};

// Reply builder - creates reply object with shuffled choices
function CREATE_REPLY(correct, wrongs, explanation) {
  const choices = shuffle([correct, ...wrongs]);
  return {
    choices,
    correctIndex: choices.indexOf(correct),
    explanation
  };
}

// Categories
const CAT = {
  MORFOLOGIA_VERBI: { l1: 'Morfologia', l2: 'Verbi', l3: 'Coniugazione' },
  MORFOLOGIA_ARTICOLI_DEFINITO: { l1: 'Morfologia', l2: 'Articoli', l3: 'Articolo definito' },
  MORFOLOGIA_ARTICOLI_INDEFINITO: { l1: 'Morfologia', l2: 'Articoli', l3: 'Articolo indefinito' },
  MORFOLOGIA_PRONOMI_SOGGETTO: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome soggetto' },
  MORFOLOGIA_PRONOMI_OGGETTO: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome oggetto' },
  MORFOLOGIA_PRONOMI_RIFLESSIVO: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome riflessivo' },
  MORFOLOGIA_PRONOMI_COMBINATO: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome combinato' },
  SINTASSI_IPOTETICO_TIPO1: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Tipo 1' },
  SINTASSI_IPOTETICO_TIPO2: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Tipo 2' },
  SINTASSI_IPOTETICO_TIPO3: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Tipo 3' },
  SINTASSI_CONGIUNTIVO: { l1: 'Sintassi', l2: 'Congiuntivo', l3: null }
};

// ------------------------------------------------------------
// SECTION 3: GENERATORS - Each uses helpers and DATA
// ------------------------------------------------------------

function genVerb() {
  const verb = rand(DATA.verbs);
  const pron = rand(DATA.pronouns);
  const correct = verb.f[pron];
  if (!correct) return genVerb();
  const wrongs = Object.values(verb.f).filter(x => x !== correct && x);
  if (wrongs.length < 3) return genVerb();
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  if (choices.length < 4 || choices.some(c => !c)) return genVerb();
  
  return {
    category: CAT.MORFOLOGIA_VERBI,
    syntaxBlocks: [
      BLOCK.soggetto(pron),
      BLOCK.answer(verb.v, 'Verbo', 0)
    ],
    replies: [CREATE_REPLY(correct, wrongs.slice(0, 3), '"' + verb.v + '" = "' + verb.m + '". ' + pron + ' = ' + correct)]
  };
}

function genDefArt() {
  const noun = rand(DATA.nouns);
  const correct = noun.g === 'm' ? ('libro,ragazzo,tavolo,amico'.includes(noun.n) ? 'il' : 'lo') : 'la';
  const opts = ['il', 'lo', 'la', 'i', 'gli', 'le'].filter(x => x !== correct);
  const subject = rand(DATA.subjects);
  const verb = rand(['parla', 'guarda', 'ascolta']);
  
  return {
    category: CAT.MORFOLOGIA_ARTICOLI_DEFINITO,
    syntaxBlocks: [
      BLOCK.soggetto(subject, 'm'),
      BLOCK.verbo(verb),
      BLOCK.answer(correct + ' ' + noun.n, 'Articolo', 0, { gender: noun.g })
    ],
    replies: [CREATE_REPLY(correct, opts.slice(0, 3), correct + ' is the ' + (noun.g === 'm' ? 'masculine' : 'feminine') + ' article')]
  };
}

function genIndefArt() {
  const noun = rand(DATA.nouns);
  const correct = noun.g === 'm' ? (noun.n === 'libro' ? 'un' : 'uno') : (noun.n === 'auto' ? "un'" : 'una');
  const opts = ['un', 'uno', 'una', "un'"].filter(x => x !== correct);
  const subject = rand(DATA.subjects);
  const verb = rand(['compra', 'vede', 'lega']);
  
  return {
    category: CAT.MORFOLOGIA_ARTICOLI_INDEFINITO,
    syntaxBlocks: [
      BLOCK.soggetto(subject, 'm'),
      BLOCK.verbo(verb),
      BLOCK.answer(correct + ' ' + noun.n, 'Articolo', 0, { gender: noun.g })
    ],
    replies: [CREATE_REPLY(correct, opts.slice(0, 3), correct + ' is the indefinite article')]
  };
}

function genPronSoggetto() {
  const nouns = [{ n: 'il ragazzo', g: 'm' }, { n: 'la ragazza', g: 'f' }];
  const noun = rand(nouns);
  const correct = noun.g === 'm' ? 'lui' : 'lei';
  const wrongs = ['io', 'tu', 'noi', 'voi'].filter(x => x !== correct);
  
  return {
    category: CAT.MORFOLOGIA_PRONOMI_SOGGETTO,
    syntaxBlocks: [
      BLOCK.answer(noun.n, 'Soggetto', 0, { gender: noun.g }),
      BLOCK.verbo('parla')
    ],
    replies: [CREATE_REPLY(correct, wrongs.slice(0, 3), correct + ' replaces ' + noun.n)]
  };
}

function genPronOggetto() {
  const recipient = rand(['Anna', 'Luigi', 'Maria', 'Marco']);
  const pronouns = ['mi', 'gli', 'le', 'li'];
  const correct = rand(pronouns);
  const wrongs = pronouns.filter(x => x !== correct);
  
  return {
    category: CAT.MORFOLOGIA_PRONOMI_OGGETTO,
    syntaxBlocks: [
      BLOCK.soggetto('Marco', 'm'),
      BLOCK.verbo('dà'),
      BLOCK.answer('il libro a ' + recipient, 'Oggetto', 0, { gender: 'm' })
    ],
    replies: [CREATE_REPLY(correct, wrongs, correct + ' replaces il libro a ' + recipient)]
  };
}

function genPronRiflessivo() {
  const verb = rand(DATA.reflexiveVerbs);
  const pronouns = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];
  const pron = rand(pronouns);
  const correct = verb.f[pron];
  if (!correct) return genPronRiflessivo();
  const wrongs = Object.values(verb.f).filter(x => x !== correct);
  
  return {
    category: CAT.MORFOLOGIA_PRONOMI_RIFLESSIVO,
    syntaxBlocks: [
      BLOCK.avverbio('ogni mattina'),
      BLOCK.answer(verb.v + ', ' + pron, 'Verbo', 0)
    ],
    replies: [CREATE_REPLY(correct, wrongs.slice(0, 3), pron + ' ' + correct + ' = ' + verb.v)]
  };
}

function genPronCombinato() {
  const dativoPronouns = ['mi', 'ti', 'gli', 'le', 'ci', 'vi'];
  const accusativoPronouns = ['lo', 'la', 'li', 'le'];
  const correctDativo = rand(dativoPronouns);
  const correctAccusativo = rand(accusativoPronouns);
  const choiceDativo = shuffle([correctDativo, ...dativoPronouns.filter(x => x !== correctDativo)]);
  const choiceAccusativo = shuffle([correctAccusativo, ...accusativoPronouns.filter(x => x !== correctAccusativo)]);
  
  return {
    category: CAT.MORFOLOGIA_PRONOMI_COMBINATO,
    syntaxBlocks: [
      BLOCK.soggetto('Mario', 'm'),
      BLOCK.verbo('presenta'),
      BLOCK.answer('a me', 'Oggetto indiretto', 0),
      BLOCK.answer('il messaggio', 'Oggetto diretto', 1)
    ],
    replies: [
      CREATE_REPLY(correctDativo, choiceDativo.filter(x => x !== correctDativo), correctDativo + ' replaces a me'),
      CREATE_REPLY(correctAccusativo, choiceAccusativo.filter(x => x !== correctAccusativo), correctAccusativo + ' replaces il messaggio')
    ]
  };
}

function genIpotetico(type) {
  const config = DATA.ipotetico[type];
  if (!config) return genIpotetico('type1');
  
  // Extract bracketed content using regex
  const brackets = config.sentence.match(/\[([^\]]+)\]/g) || [];
  
  if (type === 'type1') {
    const verb = brackets[0] ? brackets[0].slice(1, -1) : '';
    return {
      category: CAT.SINTASSI_IPOTETICO_TIPO1,
      syntaxBlocks: [
        BLOCK.soggetto('Se domani piove'),
        BLOCK.answer(verb, 'Verbo', 0),
        BLOCK.complemento('a casa')
      ],
      replies: [CREATE_REPLY(config.correct, config.choices.filter(x => x !== config.correct), 'After future se, use future: ' + config.correct)]
    };
  }
  
  if (type === 'type2') {
    const verb1 = brackets[0] ? brackets[0].slice(1, -1) : '';
    const verb2 = brackets[1] ? brackets[1].slice(1, -1) : '';
    return {
      category: CAT.SINTASSI_IPOTETICO_TIPO2,
      syntaxBlocks: [
        BLOCK.soggetto('Se'),
        BLOCK.answer(verb1, 'Verbo', 0),
        BLOCK.complemento('fame'),
        BLOCK.answer(verb2, 'Verbo', 1),
        BLOCK.complemento('la pizza')
      ],
      replies: [
        CREATE_REPLY(config.correctCond, config.choicesCond.filter(x => x !== config.correctCond), 'Se + imperfetto congiuntivo: ' + config.correctCond),
        CREATE_REPLY(config.correctMangiare, config.choicesMangiare.filter(x => x !== config.correctMangiare), 'Then conditional: ' + config.correctMangiare)
      ]
    };
  }
  
  if (type === 'type3') {
    const verb1 = brackets[0] ? brackets[0].slice(1, -1) : '';
    const verb2 = brackets[1] ? brackets[1].slice(1, -1) : '';
    const verb3 = brackets[2] ? brackets[2].slice(1, -1) : '';
    return {
      category: CAT.SINTASSI_IPOTETICO_TIPO3,
      syntaxBlocks: [
        BLOCK.soggetto('Se'),
        BLOCK.answer(verb1, 'Verbo', 0),
        BLOCK.answer(verb2, 'Verbo', 1),
        BLOCK.soggetto(', non'),
        BLOCK.answer(verb3, 'Verbo', 2),
        BLOCK.complemento('fame')
      ],
      replies: [
        CREATE_REPLY(config.correctAvere1, config.choicesAvere1.filter(x => x !== config.correctAvere1), 'Trapassato congiuntivo: ' + config.correctAvere1),
        CREATE_REPLY(config.correctMangiare, config.choicesMangiare.filter(x => x !== config.correctMangiare), 'Participio passato: ' + config.correctMangiare),
        CREATE_REPLY(config.correctAvere2, config.choicesAvere2.filter(x => x !== config.correctAvere2), 'Condizionale passato: ' + config.correctAvere2)
      ]
    };
  }
  
  return genIpotetico('type1');
}

function genCongiuntivo(type) {
  const config = DATA.congiuntivo[type];
  if (!config) return genCongiuntivo('presente');
  
  // Extract content from brackets
  const bracketMatch = config.sentence.match(/\[([^\]]+)\]/);
  const verb = bracketMatch ? bracketMatch[1] : '';
  
  // Simple types (presente, passato, imperfetto)
  if (type !== 'trapassato') {
    return {
      category: { ...CAT.SINTASSI_CONGIUNTIVO, l3: type.charAt(0).toUpperCase() + type.slice(1) },
      syntaxBlocks: [
        BLOCK.verbo(config.sentence.split('[')[0].trim()),
        BLOCK.answer(verb, 'Verbo', 0),
        BLOCK.complemento(config.sentence.split(']')[1].trim())
      ],
      replies: [CREATE_REPLY(config.correct, config.choices.filter(x => x !== config.correct), 'After "' + (type === 'presente' ? 'credere' : type === 'passato' ? 'sperare' : 'credere') + '", use ' + type + ': ' + config.correct)]
    };
  }
  
  // trapassato has two replies
  const brackets = config.sentence.match(/\[([^\]]+)\]/g) || [];
  const verb1 = brackets[0] ? brackets[0].slice(1, -1) : '';
  const verb2 = brackets[1] ? brackets[1].slice(1, -1) : '';
  return {
    category: { ...CAT.SINTASSI_CONGIUNTIVO, l3: 'Trapassato' },
    syntaxBlocks: [
      BLOCK.soggetto('Se non'),
      BLOCK.answer(verb1, 'Verbo', 0),
      BLOCK.answer(verb2, 'Verbo', 1),
      BLOCK.complemento('il lavoro')
    ],
    replies: [
      CREATE_REPLY(config.correctAv, config.choicesAv.filter(x => x !== config.correctAv), 'Trapassato: ' + config.correctAv),
      CREATE_REPLY(config.correctFin, config.choicesFin.filter(x => x !== config.correctFin), 'Trapassato: ' + config.correctFin)
    ]
  };
}

// ------------------------------------------------------------
// SECTION 4: EXPORT - Generator mappings and module export
// ------------------------------------------------------------

const GENERATORS = {
  A1: [genVerb, genDefArt, genIndefArt, genPronSoggetto],
  A2: [genPronOggetto, genPronRiflessivo],
  B1: [genPronCombinato, () => genIpotetico('type1')],
  B2: [() => genIpotetico('type2'), () => genIpotetico('type3'), genCongiuntivo],
  C1: [() => genCongiuntivo('presente'), () => genCongiuntivo('passato')],
  C2: [() => genCongiuntivo('imperfetto'), () => genCongiuntivo('trapassato')]
};

const it = {
  meta: { code: 'it', name: 'Italian', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
  generateQuestion: function(level) {
    const gens = GENERATORS[level];
    if (!gens) return null;
    return rand(gens)();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = it;
}