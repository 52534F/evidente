const fs = require('fs');

// ==================== A2 TEMPLATES ====================
const a2Templates = {
  imperfetto: [
    { verb: 'parlare', conj: { io: 'parlavo', tu: 'parlavi', lui: 'parlava', noi: 'parlavamo', voi: 'parlavate', loro: 'parlavano' }},
    { verb: 'scrivere', conj: { io: 'scrivevo', tu: 'scrivevi', lui: 'scriveva', noi: 'scrivevamo', voi: 'scrivevate', loro: 'scrivevano' }},
    { verb: 'dormire', conj: { io: 'dormivo', tu: 'dormivi', lui: 'dormiva', noi: 'dormivamo', voi: 'dormivate', loro: 'dormivano' }},
    { verb: 'leggere', conj: { io: 'leggevo', tu: 'leggevi', lui: 'leggeva', noi: 'leggevamo', voi: 'leggevate', loro: 'leggevano' }},
    { verb: 'vedere', conj: { io: 'vedevo', tu: 'vedevi', lui: 'vedeva', noi: 'vedevamo', voi: 'vedevate', loro: 'vedevano' }},
    { verb: 'finire', conj: { io: 'finivo', tu: 'finivi', lui: 'finiva', noi: 'finivamo', voi: 'finivate', loro: 'finivano' }}
  ],
  passatoProssimo: [
    { verb: 'parlare', past: 'parlato', aux: 'essere' },
    { verb: 'andare', past: 'andato', aux: 'essere' },
    { verb: 'fare', past: 'fatto', aux: 'avere' },
    { verb: 'dormire', past: 'dormito', aux: 'avere' },
    { verb: 'leggere', past: 'letto', aux: 'avere' },
    { verb: 'scrivere', past: 'scritto', aux: 'avere' }
  ],
  futuroSemplice: [
    { verb: 'parlare', conj: { io: 'parlerò', tu: 'parlerai', lui: 'parlerà', noi: 'parleremo', voi: 'parlerete', loro: 'parleranno' }},
    { verb: 'scrivere', conj: { io: 'scriverò', tu: 'scriverai', lui: 'scriverà', noi: 'scriveremo', voi: 'scriverete', loro: 'scriveranno' }},
    { verb: 'dormire', conj: { io: 'dormirò', tu: 'dormirai', lui: 'dormirà', noi: 'dormiremo', voi: 'dormirete', loro: 'dormiranno' }},
    { verb: 'finire', conj: { io: 'finirò', tu: 'finirai', lui: 'finirà', noi: 'finiremo', voi: 'finirete', loro: 'finiranno' }}
  ],
  condizionalePresente: [
    { verb: 'parlare', conj: { io: 'parlerei', tu: 'parleresti', lui: 'parlerebbe', noi: 'parleremmo', voi: 'parlereste', loro: 'parlerebbero' }},
    { verb: 'scrivere', conj: { io: 'scriverei', tu: 'scriveresti', lui: 'scriverebbe', noi: 'scriveremmo', voi: 'scrivereste', loro: 'scriverebbero' }},
    { verb: 'dormire', conj: { io: 'dormirei', tu: 'dormiresti', lui: 'dormirebbe', noi: 'dormiremmo', voi: 'dormireste', loro: 'dormirebbero' }}
  ],
  pronomiRiflessivi: [
    { verb: 'lavarsi', base: 'lavare', conj: { io: 'mi lavo', tu: 'ti lavi', lui: 'si lava', noi: 'ci laviamo', voi: 'vi lavate', loro: 'si lavano' }},
    { verb: 'alzarsi', base: 'alzare', conj: { io: 'mi alzo', tu: 'ti alzi', lui: 'si alza', noi: 'ci alziamo', voi: 'vi alzate', loro: 'si alzano' }},
    { verb: 'svegliarsi', base: 'svegliare', conj: { io: 'mi sveglio', tu: 'ti svegli', lui: 'si sveglia', noi: 'ci svegliamo', voi: 'vi svegliate', loro: 'si svegliano' }}
  ],
  pronomiOggettoDiretto: [
    { obj: 'il libro', gender: 'm', pronouns: { io: 'lo leggo', tu: 'lo leggi', lui: 'lo legge', noi: 'lo leggiamo', voi: 'lo leggete', loro: 'lo leggono' }},
    { obj: 'la penna', gender: 'f', pronouns: { io: 'la uso', tu: 'la usi', lui: 'la usa', noi: 'la usiamo', voi: 'la usate', loro: 'la usano' }},
    { obj: 'i libri', gender: 'm', pronouns: { io: 'li leggo', tu: 'li leggi', lui: 'li legge', noi: 'li leggiamo', voi: 'li leggete', loro: 'li leggono' }},
    { obj: 'le penne', gender: 'f', pronouns: { io: 'le uso', tu: 'le usi', lui: 'le usa', noi: 'le usiamo', voi: 'le usate', loro: 'le usano' }}
  ],
  comparativi: [
    { adj: 'alto', comparisons: [
      { type: 'più', obj1: 'Marco', obj2: 'Luca', result: 'più alto' },
      { type: 'meno', obj1: 'Luca', obj2: 'Marco', result: 'meno alto' },
      { type: 'come', obj1: 'Marco', obj2: 'Luca', result: 'alto come' }
    ]},
    { adj: 'basso', comparisons: [
      { type: 'più', obj1: 'Luca', obj2: 'Marco', result: 'più basso' },
      { type: 'meno', obj1: 'Marco', obj2: 'Luca', result: 'meno basso' }
    ]}
  ],
  superlativi: [
    { adj: 'alto', obj: 'Marco', among: 'della classe', result: 'il più alto' },
    { adj: 'basso', obj: 'Luca', among: 'della classe', result: 'il più basso' }
  ],
  preposizioniArticolate: [
    { prep: 'di', obj: 'il libro', result: 'del libro', gender: 'm' },
    { prep: 'a', obj: 'la scuola', result: 'alla scuola', gender: 'f' },
    { prep: 'da', obj: 'i bambini', result: 'dai bambini', gender: 'm' },
    { prep: 'in', obj: 'il parco', result: 'nel parco', gender: 'm' },
    { prep: 'su', obj: 'la tavola', result: 'sulla tavola', gender: 'f' }
  ],
  avverbiTempo: [
    { adv: 'oggi', verb: 'vado', subject: 'io' },
    { adv: 'ieri', verb: 'sono andato', subject: 'io' },
    { adv: 'domani', verb: 'andrò', subject: 'io' },
    { adv: 'sempre', verb: 'parlo', subject: 'io' },
    { adv: 'spesso', verb: 'mangio', subject: 'io' }
  ],
  numeriOrdinali: [
    { num: 'primo', obj: 'libro', gender: 'm' },
    { num: 'secondo', obj: 'giorno', gender: 'm' },
    { num: 'terzo', obj: 'piano', gender: 'm' },
    { num: 'quarto', obj: 'piano', gender: 'm' }
  ],
  passivaEssere: [
    { verb: 'leggere', pastPart: 'letto', obj: 'il libro', agent: 'da Maria' },
    { verb: 'scrivere', pastPart: 'scritto', obj: 'la lettera', agent: 'da Luigi' }
  ],
  ciImpersonale: [
    { verb: 'andare', place: 'al cinema', person: 'io' },
    { verb: 'andare', place: 'a scuola', person: 'tu' }
  ],
  ciPartitivo: [
    { obj: 'libri', num: 'due', person: 'io' },
    { obj: 'penne', num: 'tre', person: 'tu' }
  ],
  nePartitivo: [
    { obj: 'libri', num: 'due', person: 'io' },
    { obj: 'penne', num: 'tre', person: 'tu' }
  ]
};

// ==================== B1 TEMPLATES ====================
const b1Templates = {
  periodoIpoteticoReale: [
    { ifClause: 'se piove', thenClause: 'resto a casa', conj: 'presente + presente' },
    { ifClause: 'se studio', thenClause: 'imparo', conj: 'presente + presente' },
    { ifClause: 'se hai tempo', thenClause: 'vieni', conj: 'presente + presente' }
  ],
  periodoIpoteticoPossibile: [
    { ifClause: 'se avessi tempo', thenClause: 'andrei al cinema', conj: 'imperfetto congiuntivo + condizionale' },
    { ifClause: 'se studiassi', thenClause: 'supereresti l\'esame', conj: 'imperfetto congiuntivo + condizionale' }
  ],
  congiuntivoPresente: [
    { verb: 'parlare', conj: { io: 'che io parli', tu: 'che tu parli', lui: 'che lui parli', noi: 'che noi parliamo', voi: 'che voi parliate', loro: 'che loro parlino' }},
    { verb: 'scrivere', conj: { io: 'che io scriva', tu: 'che tu scriva', lui: 'che lui scriva', noi: 'che noi scriviamo', voi: 'che voi scriviate', loro: 'che loro scrivano' }}
  ],
  congiuntivoTrapassato: [
    { verb: 'essere', pastPart: 'stato', conj: { io: 'che io sia stato', tu: 'che tu sia stato', lui: 'che lui sia stato' }},
    { verb: 'avere', pastPart: 'avuto', conj: { io: 'che io abbia avuto', tu: 'che tu abbia avuto', lui: 'che lui abbia avuto' }}
  ],
  congiuntivoIndipendenti: [
    { expr: 'bisogna che', verb: 'vada', subject: 'io' },
    { expr: 'è bene che', verb: 'studi', subject: 'tu' }
  ],
  passiva: [
    { verb: 'leggere', pastPart: 'letto', obj: 'il libro', tense: 'presente' },
    { verb: 'scrivere', pastPart: 'scritto', obj: 'la lettera', tense: 'passato' }
  ],
  ciNe: [
    { type: 'ci', verb: 'vado', place: 'al cinema', person: 'io' },
    { type: 'ne', obj: 'libri', num: 'due', person: 'io' }
  ],
  pronomiCombinati: [
    { dir: 'lo', indir: 'mi', verb: 'dà', obj: 'il libro', person: 'lui' },
    { dir: 'la', indir: 'ti', verb: 'dà', obj: 'la penna', person: 'lui' }
  ],
  condizionalePresente: [
    { verb: 'fare', conj: { io: 'farei', tu: 'faresti', lui: 'farebbe' }},
    { verb: 'dire', conj: { io: 'direi', tu: 'diresti', lui: 'direbbe' }}
  ]
};

// ==================== B2 TEMPLATES ====================
const b2Templates = {
  periodoIpoteticoIrrealePresente: [
    { ifClause: 'se avessi tempo', thenClause: 'andrei', conj: 'imperfetto cong + condizionale' },
    { ifClause: 'se studiassi', thenClause: 'supererei', conj: 'imperfetto cong + condizionale' }
  ],
  periodoIpoteticoIrrealePassato: [
    { ifClause: 'se avessi avuto tempo', thenClause: 'sarei andato', conj: 'trapassato cong + condizionale passato' },
    { ifClause: 'se avessi studiato', thenClause: 'avrei superato', conj: 'trapassato cong + condizionale passato' }
  ],
  congiuntivoImperfetto: [
    { verb: 'parlare', conj: { io: 'che io parlassi', tu: 'che tu parlassi', lui: 'che lui parlasse' }},
    { verb: 'scrivere', conj: { io: 'che io scrivessi', tu: 'che tu scrivessi', lui: 'che lui scrivesse' }}
  ],
  congiuntivoTrapassato: [
    { verb: 'essere', pastPart: 'stato', conj: { io: 'che io fossi stato', tu: 'che tu fossi stato' }},
    { verb: 'avere', pastPart: 'avuto', conj: { io: 'che io avessi avuto', tu: 'che tu avessi avuto' }}
  ],
  gerundioPresente: [
    { verb: 'guardare', result: 'vedo', conj: 'guardando, vedo' },
    { verb: 'studiare', result: 'imparo', conj: 'studiando, imparo' }
  ],
  gerundioPassato: [
    { verb: 'fare', pastPart: 'fatto', result: 'esco', conj: 'avendo fatto, esco' }
  ],
  infinitoPresente: [
    { prep: 'prima di', verb: 'andare', subject: 'io' },
    { prep: 'dopo', verb: 'mangiare', subject: 'tu' }
  ],
  infinitoPassato: [
    { prep: 'dopo essere', verb: 'andato', subject: 'io' }
  ],
  relativeComplesse: [
    { antecedent: 'il libro', rel: 'di cui', verb: 'parlo', person: 'io' },
    { antecedent: 'la persona', rel: 'a cui', verb: 'penso', person: 'io' }
  ],
  siImpersonale: [
    { expr: 'si dice che', verb: 'vada', subject: 'lui' },
    { expr: 'si crede che', verb: 'sia', subject: 'lui' }
  ],
  verbiImpersonali: [
    { verb: 'piove', tense: 'presente' },
    { verb: 'bisogna', complement: 'studiare', tense: 'presente' }
  ],
  passivaVenire: [
    { verb: 'leggere', pastPart: 'letto', obj: 'il libro', tense: 'presente' },
    { verb: 'scrivere', pastPart: 'scritto', obj: 'la lettera', tense: 'passato' }
  ]
};

// ==================== C1 TEMPLATES ====================
const c1Templates = {
  congiuntivoTrapassato: [
    { verb: 'essere', pastPart: 'andato', conj: 'fossi andato vs sarei andato' },
    { verb: 'avere', pastPart: 'fatto', conj: 'avessi fatto vs avrei fatto' }
  ],
  discorsiIndiretti: [
    { main: 'dice che', verb: 'va', tense: 'presente' },
    { main: 'ha detto che', verb: 'è andato', tense: 'passato' },
    { main: 'dice che', verb: 'andrà', tense: 'futuro' },
    { main: 'dice di', verb: 'andare', tense: 'imperativo' }
  ],
  subordinate: [
    { type: 'temporale', conj: 'mentre parlavo' },
    { type: 'causale', conj: 'poiché è tardi' },
    { type: 'concessiva', conj: 'sebbene dica' },
    { type: 'finale', conj: 'perché tu vada' },
    { type: 'condizionale', conj: 'se avessi...' },
    { type: 'sostantiva', conj: 'che tu vada' }
  ],
  frasiCondizionaliAvanzate: [
    { type: 'condizionale composto', conj: 'avrei fatto se...' }
  ],
  passivaAvanzata: [
    { tense: 'tempi composti', conj: 'è stato fatto' },
    { tense: 'imperfetto', conj: 'veniva fatto' }
  ],
  concordanzaTempi: [
    { type: 'nel presente', conj: 'dico che vai' },
    { type: 'nel passato', conj: 'ho detto che andavi' }
  ]
};

// ==================== C2 TEMPLATES ====================
const c2Templates = {
  struttureComplesse: [
    { type: 'dislocazione a sinistra', conj: 'il libro, lo leggo' },
    { type: 'dislocazione a destra', conj: 'lo leggo, il libro' },
    { type: 'frasi scisse', conj: 'è il libro che leggo' }
  ],
  registri: [
    { type: 'saluti formali', formal: 'salve', informal: 'ciao' },
    { type: 'richieste formali', formal: 'potrebbe', informal: 'puoi' }
  ],
  espressioniIdiomatiche: [
    { type: 'con avere', expr: 'avere il cuore in gola' },
    { type: 'con essere', expr: 'essere al settimo cielo' }
  ],
  arcaismi: [
    { type: 'pronomi', form: 'meco', modern: 'con me' },
    { type: 'pronomi', form: 'teco', modern: 'con te' }
  ],
  stileIndirettoLibero: [
    { type: 'narrativa', expr: 'pensò: sarebbe andato' }
  ],
  concordanzaTempiAvanzata: [
    { type: 'nel presente', conj: 'complessa' },
    { type: 'nel passato', conj: 'complessa' }
  ]
};

// ==================== GENERATION FUNCTIONS ====================
function generateA2Sentences() {
  const sentences = [];
  
  // Imperfetto
  a2Templates.imperfetto.forEach(t => {
    ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'].forEach(subj => {
      const personMap = { 'io': '1ª sing', 'tu': '2ª sing', 'lui': '3ª m sing', 'lei': '3ª f sing', 'noi': '1ª plur', 'voi': '2ª plur', 'loro': '3ª plur' };
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Imperfetto' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.conj[subj], role: 'Verbo (' + personMap[subj] + ')', question: t.verb + ' (' + subj + ')' },
          { text: 'sempre', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateVerbChoices(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: subj + ' + ' + t.verb + ' (' + personMap[subj] + ')' }]
      });
    });
  });

  // Passato Prossimo
  a2Templates.passatoProssimo.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      const aux = t.aux === 'essere' ? 'sono' : 'ho';
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Passato prossimo' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: aux + ' ' + t.past, role: 'Verbo', question: t.verb + ' (participio)' },
          { text: 'ieri', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: [aux + ' ' + t.past, 'avevo ' + t.past, 'sarò ' + t.past, 'ero ' + t.past], correct: aux + ' ' + t.past, explanation: 'Passato prossimo: ' + aux + ' + participio passato' }]
      });
    });
  });

  // Futuro Semplice
  a2Templates.futuroSemplice.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Futuro semplice' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + subj + ')' },
          { text: 'domani', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateVerbChoicesFuture(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Futuro semplice: ' + subj + ' + ' + t.verb }]
      });
    });
  });

  // Condizionale Presente
  a2Templates.condizionalePresente.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Condizionale presente' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + subj + ')' },
          { text: 'forse', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateVerbChoicesCond(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Condizionale presente: ' + subj + ' + ' + t.verb }]
      });
    });
  });

  // Pronomi Riflessivi
  a2Templates.pronomiRiflessivi.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome riflessivo' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.conj[subj], role: 'Verbo', question: t.base + ' (' + subj + ')' },
          { text: 'ogni mattina', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateReflexiveChoices(t.base, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Riflessivo: ' + subj + ' + ' + t.base }]
      });
    });
  });

  // Pronomi Oggetto Diretto
  a2Templates.pronomiOggettoDiretto.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome oggetto diretto' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.pronouns[subj], role: 'Verbo', question: t.obj + ' (' + subj + ')' },
          { text: 'velocemente', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateDirectObjChoices(t.obj, t.pronouns[subj], subj), correct: t.pronouns[subj], explanation: 'Pronome oggetto: ' + t.obj + ' → ' + getDirectPronoun(t.obj) }]
      });
    });
  });

  // Comparativi
  a2Templates.comparativi.forEach(t => {
    t.comparisons.forEach(c => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Aggettivi', l3: 'Comparativi' },
        sentence: [
          { text: c.obj1, role: 'Soggetto', gender: 'm' },
          { text: 'è', role: 'Verbo' },
          { text: c.result, role: 'Aggettivo', question: t.adj + ' (comparativo)' }
        ],
        replies: [{ questionIndex: 2, choices: [c.result, t.adj, 'il più ' + t.adj, 'il meno ' + t.adj], correct: c.result, explanation: 'Comparativo: ' + c.obj1 + ' ' + c.type + ' ' + c.obj2 }]
      });
    });
  });

  // Superlativi
  a2Templates.superlativi.forEach(t => {
    sentences.push({
      category: { l1: 'Morfologia', l2: 'Aggettivi', l3: 'Superlativi' },
      sentence: [
        { text: t.obj, role: 'Soggetto', gender: 'm' },
        { text: 'è', role: 'Verbo' },
        { text: t.result, role: 'Aggettivo', question: t.adj + ' (superlativo)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.result, t.adj, 'più ' + t.adj, 'meno ' + t.adj], correct: t.result, explanation: 'Superlativo: ' + t.obj + ' ' + t.among + ' ' + t.result }]
    });
  });

  // Preposizioni Articolate
  a2Templates.preposizioniArticolate.forEach(t => {
    sentences.push({
      category: { l1: 'Morfologia', l2: 'Preposizioni articolate', l3: 'Preposizioni articolate semplici' },
      sentence: [
        { text: 'Vado', role: 'Verbo' },
        { text: t.result, role: 'Complemento', question: t.prep + ' + ' + t.obj }
      ],
      replies: [{ questionIndex: 1, choices: [t.result, t.prep + ' ' + t.obj, 'al ' + t.obj, 'del ' + t.obj], correct: t.result, explanation: 'Preposizione articolata: ' + t.prep + ' + ' + t.obj + ' = ' + t.result }]
    });
  });

  // Avverbi di tempo
  a2Templates.avverbiTempo.forEach(t => {
    sentences.push({
      category: { l1: 'Lessico', l2: 'Espressioni di tempo', l3: 'Avverbi di tempo' },
      sentence: [
        { text: t.subject, role: 'Soggetto' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[0] + ' (infinito)' },
        { text: t.adv, role: 'Avverbio' }
      ],
      replies: [{ questionIndex: 1, choices: [t.verb, 'vado', 'faccio', 'dico'], correct: t.verb, explanation: t.adv + ': ' + t.subject + ' ' + t.verb }]
    });
  });

  // Numeri Ordinali
  a2Templates.numeriOrdinali.forEach(t => {
    sentences.push({
      category: { l1: 'Lessico', l2: 'Numeri', l3: 'Numeri ordinali' },
      sentence: [
        { text: 'È', role: 'Verbo' },
        { text: 'il', role: 'Articolo' },
        { text: t.num, role: 'Aggettivo', question: t.num + ' (' + t.obj + ')' },
        { text: t.obj, role: 'Sostantivo', gender: t.gender }
      ],
      replies: [{ questionIndex: 2, choices: [t.num, 'uno', 'primo', 'due'], correct: t.num, explanation: 'Numero ordinale: ' + t.num + ' ' + t.obj }]
    });
  });

  // Voce Passiva con Essere
  a2Templates.passivaEssere.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Voce passiva', l3: 'Passiva con essere' },
      sentence: [
        { text: t.obj, role: 'Soggetto', gender: t.agent.includes('Maria') ? 'f' : 'm' },
        { text: 'è', role: 'Verbo' },
        { text: t.pastPart, role: 'Participio', question: t.verb + ' (participio)' },
        { text: t.agent, role: 'Complemento' }
      ],
      replies: [{ questionIndex: 2, choices: [t.pastPart, t.verb, 'letto', 'scritto'], correct: t.pastPart, explanation: 'Passiva: ' + t.obj + ' è ' + t.pastPart + ' ' + t.agent }]
    });
  });

  // CI impersonale/partitivo and NE partitivo
  a2Templates.ciImpersonale.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'CI', l3: 'CI impersonale' },
      sentence: [
        { text: t.person, role: 'Soggetto' },
        { text: 'ci', role: 'CI' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[0] + ' (infinito)' },
        { text: t.place, role: 'Complemento', gender: 'm' }
      ],
      replies: [{ questionIndex: 2, choices: [t.verb, 'vado', 'faccio', 'dico'], correct: t.verb, explanation: 'CI impersonale: ' + t.person + ' ci ' + t.verb + ' ' + t.place }]
    });
  });

  a2Templates.nePartitivo.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'NE', l3: 'NE partitivo' },
      sentence: [
        { text: t.person, role: 'Soggetto' },
        { text: 'ne', role: 'NE' },
        { text: 'ho', role: 'Verbo' },
        { text: t.num, role: 'Numero', question: t.obj + ' (partitivo)' }
      ],
      replies: [{ questionIndex: 3, choices: [t.num, 'due', 'molti', 'pochi'], correct: t.num, explanation: 'NE partitivo: ' + t.person + ' ne ho ' + t.num + ' (' + t.obj + ')' }]
    });
  });

  return sentences;
}

function generateB1Sentences() {
  const sentences = [];

  // Periodo Ipotetico Reale
  b1Templates.periodoIpoteticoReale.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Reale' },
      sentence: [
        { text: t.ifClause, role: 'Congiunzione' },
        { text: t.thenClause, role: 'Verbo', question: t.thenClause.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.thenClause, 'resto', 'vado', 'faccio'], correct: t.thenClause, explanation: 'Reale: se + indicativo → indicativo (' + t.conj + ')' }]
    });
  });

  // Periodo Ipotetico Possibile
  b1Templates.periodoIpoteticoPossibile.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Possibile' },
      sentence: [
        { text: t.ifClause, role: 'Congiunzione' },
        { text: t.thenClause, role: 'Verbo', question: t.thenClause.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.thenClause, 'andrei', 'vado', 'andavo'], correct: t.thenClause, explanation: 'Possibile: se + imperfetto cong → condizionale (' + t.conj + ')' }]
    });
  });

  // Congiuntivo Presente
  b1Templates.congiuntivoPresente.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Presente' },
        sentence: [
          { text: 'Credo che', role: 'Congiunzione' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + subj + ')' },
          { text: 'bene', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateCongiuntivoChoices(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Congiuntivo presente: che ' + subj + ' ' + t.verb }]
      });
    });
  });

  // Congiuntivo Trapassato
  b1Templates.congiuntivoTrapassato.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Trapassato' },
        sentence: [
          { text: 'Credo che', role: 'Congiunzione' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + t.pastPart + ')' }
        ],
        replies: [{ questionIndex: 1, choices: [t.conj[subj], 'sia ' + t.pastPart, 'ero ' + t.pastPart, 'sono ' + t.pastPart], correct: t.conj[subj], explanation: 'Trapassato: che ' + subj + ' ' + t.conj[subj] }]
      });
    });
  });

  // Congiuntivo in frasi indipendenti
  b1Templates.congiuntivoIndipendenti.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Congiuntivo in frasi indipendenti' },
      sentence: [
        { text: t.expr, role: 'Espressione' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[0] + ' (infinito)' },
        { text: t.subject, role: 'Soggetto' }
      ],
      replies: [{ questionIndex: 1, choices: [t.verb, 'vada', 'vado', 'andava'], correct: t.verb, explanation: t.expr + ' ' + t.subject + ' ' + t.verb }]
    });
  });

  // Passiva
  b1Templates.passiva.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Voce passiva', l3: 'Passiva con essere' },
      sentence: [
        { text: t.obj, role: 'Soggetto', gender: t.obj.includes('libro') ? 'm' : 'f' },
        { text: 'è', role: 'Verbo' },
        { text: t.pastPart, role: 'Participio', question: t.verb + ' (participio)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.pastPart, t.verb, 'letto', 'scritto'], correct: t.pastPart, explanation: 'Passiva: ' + t.obj + ' è ' + t.pastPart }]
    });
  });

  // CI/NE
  b1Templates.ciNe.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: t.type === 'ci' ? 'CI' : 'NE', l3: t.type === 'ci' ? 'CI impersonale' : 'NE partitivo' },
      sentence: [
        { text: t.person, role: 'Soggetto' },
        { text: t.type, role: t.type.toUpperCase() },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[0] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.verb, 'vado', 'faccio', 'dico'], correct: t.verb, explanation: t.type.toUpperCase() + ': ' + t.person + ' ' + t.type + ' ' + t.verb }]
    });
  });

  // Pronomi Combinati
  b1Templates.pronomiCombinati.forEach(t => {
    sentences.push({
      category: { l1: 'Morfologia', l2: 'Pronomi', l3: 'Pronome combinato' },
      sentence: [
        { text: t.person, role: 'Soggetto' },
        { text: t.dir + ' ' + t.indir, role: 'Pronome combinato' },
        { text: t.verb, role: 'Verbo', question: t.obj + ' (' + t.person + ')' }
      ],
      replies: [{ questionIndex: 1, choices: [t.dir + ' ' + t.indir, 'glielo', 'melo', 'telo'], correct: t.dir + ' ' + t.indir, explanation: 'Combinato: ' + t.person + ' ' + t.dir + ' ' + t.indir + ' ' + t.verb }]
    });
  });

  // Condizionale Presente
  b1Templates.condizionalePresente.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Morfologia', l2: 'Verbi', l3: 'Condizionale presente' },
        sentence: [
          { text: subj, role: 'Soggetto' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + subj + ')' },
          { text: 'forse', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateVerbChoicesCond(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Condizionale: ' + subj + ' ' + t.conj[subj] }]
      });
    });
  });

  return sentences;
}

function generateB2Sentences() {
  const sentences = [];

  // Periodo Ipotetico Irreale (Presente e Passato)
  b2Templates.periodoIpoteticoIrrealePresente.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Irreale presente' },
      sentence: [
        { text: t.ifClause, role: 'Congiunzione' },
        { text: t.thenClause, role: 'Verbo', question: t.thenClause.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.thenClause, 'andrei', 'vado', 'andavo'], correct: t.thenClause, explanation: 'Irreale presente: ' + t.conj }]
    });
  });

  b2Templates.periodoIpoteticoIrrealePassato.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Periodo ipotetico', l3: 'Irreale passato' },
      sentence: [
        { text: t.ifClause, role: 'Congiunzione' },
        { text: t.thenClause, role: 'Verbo', question: t.thenClause.split(' ')[2] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.thenClause, 'sarei andato', 'andrei', 'andavo'], correct: t.thenClause, explanation: 'Irreale passato: ' + t.conj }]
    });
  });

  // Congiuntivo Imperfetto
  b2Templates.congiuntivoImperfetto.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Imperfetto' },
        sentence: [
          { text: 'Credo che', role: 'Congiunzione' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + subj + ')' },
          { text: 'sempre', role: 'Avverbio' }
        ],
        replies: [{ questionIndex: 1, choices: generateCongiuntivoImperfChoices(t.verb, t.conj[subj], subj), correct: t.conj[subj], explanation: 'Imperfetto cong: che ' + subj + ' ' + t.conj[subj] }]
      });
    });
  });

  // Congiuntivo Trapassato
  b2Templates.congiuntivoTrapassato.forEach(t => {
    ['io', 'tu', 'lui'].forEach(subj => {
      sentences.push({
        category: { l1: 'Sintassi', l2: 'Congiuntivo', l3: 'Trapassato' },
        sentence: [
          { text: 'Se', role: 'Congiunzione' },
          { text: t.conj[subj], role: 'Verbo', question: t.verb + ' (' + t.pastPart + ')' }
        ],
        replies: [{ questionIndex: 1, choices: [t.conj[subj], 'fossi ' + t.pastPart, 'ero ' + t.pastPart, 'sono ' + t.pastPart], correct: t.conj[subj], explanation: 'Trapassato cong: ' + t.conj[subj] }]
      });
    });
  });

  // Gerundio
  b2Templates.gerundioPresente.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Gerundio', l3: 'Gerundio presente' },
      sentence: [
        { text: t.verb.charAt(0).toUpperCase() + t.verb.slice(1), role: 'Gerundio', question: t.verb + ' (gerundio)' },
        { text: t.result, role: 'Verbo', question: t.result.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.result, 'vedo', 'vado', 'faccio'], correct: t.result, explanation: 'Gerundio presente: ' + t.conj }]
    });
  });

  b2Templates.gerundioPassato.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Gerundio', l3: 'Gerundio passato' },
      sentence: [
        { text: 'Avendo', role: 'Gerundio' },
        { text: t.pastPart, role: 'Participio', question: t.verb + ' (participio)' },
        { text: t.result, role: 'Verbo', question: t.result.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.pastPart, 'fatto', 'faccio', 'facevo'], correct: t.pastPart, explanation: 'Gerundio passato: ' + t.conj }]
    });
  });

  // Infinito
  b2Templates.infinitoPresente.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Costruzioni all\'infinito', l3: 'Infinito presente' },
      sentence: [
        { text: t.prep, role: 'Preposizione' },
        { text: t.verb, role: 'Infinito', question: t.verb + ' (infinito)' },
        { text: t.subject, role: 'Soggetto' }
      ],
      replies: [{ questionIndex: 1, choices: [t.verb, 'vado', 'faccio', 'dico'], correct: t.verb, explanation: t.prep + ' + infinito: ' + t.subject + ' ' + t.verb }]
    });
  });

  // Relative complesse
  b2Templates.relativeComplesse.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Proposizioni relative', l3: 'Relative complesse' },
      sentence: [
        { text: t.antecedent, role: 'Antecedente', gender: 'm' },
        { text: t.rel, role: 'Relativa' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[1] + ' (infinito)' },
        { text: t.subject, role: 'Soggetto' }
      ],
      replies: [{ questionIndex: 2, choices: [t.verb, 'parlo', 'parla', 'parliamo'], correct: t.verb, explanation: 'Relativa complessa: ' + t.antecedent + ' ' + t.rel + ' ' + t.subject + ' ' + t.verb }]
    });
  });

  // SI impersonale
  b2Templates.siImpersonale.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Forme impersonali', l3: 'SI impersonale' },
      sentence: [
        { text: t.expr, role: 'Espressione' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.verb, 'vada', 'vado', 'andava'], correct: t.verb, explanation: 'SI impersonale: ' + t.expr + ' ' + t.verb }]
    });
  });

  // Verbi impersonali
  b2Templates.verbiImpersonali.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Forme impersonali', l3: 'Verbi impersonali' },
      sentence: [
        { text: t.verb.charAt(0).toUpperCase() + t.verb.slice(1), role: 'Verbo impersonale', question: t.verb + ' (infinito)' },
        { text: t.tense, role: 'Tempo' }
      ],
      replies: [{ questionIndex: 0, choices: [t.verb, 'piove', 'bisogna', 'nevisca'], correct: t.verb, explanation: 'Verbo impersonale: ' + t.verb + ' (' + t.tense + ')' }]
    });
  });

  // Passiva con venire
  b2Templates.passivaVenire.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Voce passiva avanzata', l3: 'Passiva con venire' },
      sentence: [
        { text: 'Il libro', role: 'Soggetto', gender: 'm' },
        { text: 'viene', role: 'Verbo' },
        { text: t.pastPart, role: 'Participio', question: t.verb + ' (participio)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.pastPart, 'letto', 'scritto', 'visto'], correct: t.pastPart, explanation: 'Passiva con venire: viene + participio' }]
    });
  });

  return sentences;
}

function generateC1Sentences() {
  const sentences = [];

  // Discorsi indiretti
  b1Templates.discorsiIndiretti.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Discorsi indiretti', l3: 'Discorsi indiretti - ' + t.tense },
      sentence: [
        { text: t.main, role: 'Principale' },
        { text: t.verb, role: 'Verbo', question: t.verb.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.verb, 'va', 'andava', 'andrà'], correct: t.verb, explanation: 'Discorso indiretto (' + t.tense + '): ' + t.main + ' ' + t.verb }]
    });
  });

  // Subordinate clauses
  b1Templates.subordinate.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Proposizioni subordinate', l3: 'Subordinata ' + t.type },
      sentence: [
        { text: t.conj, role: 'Congiunzione' },
        { text: 'lui', role: 'Soggetto' },
        { text: t.conj.split(' ').pop(), role: 'Verbo', question: t.conj.split(' ').pop() + ' (infinito)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.conj.split(' ').pop(), 'va', 'andava', 'andrà'], correct: t.conj.split(' ').pop(), explanation: 'Subordinata ' + t.type + ': ' + t.conj }]
    });
  });

  // Frasi condizionali avanzate
  b1Templates.frasiCondizionaliAvanzate.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Frasi condizionali avanzate', l3: t.type },
      sentence: [
        { text: 'Avrei', role: 'Verbo' },
        { text: t.conj.split(' ')[1], role: 'Participio', question: t.conj.split(' ')[1] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.conj.split(' ')[1], 'fatto', 'facevo', 'faccio'], correct: t.conj.split(' ')[1], explanation: t.type + ': ' + t.conj }]
    });
  });

  // Passiva avanzata
  b1Templates.passivaAvanzata.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi', l2: 'Voce passiva avanzata', l3: 'Passiva con venire - ' + t.tense },
      sentence: [
        { text: 'Il libro', role: 'Soggetto', gender: 'm' },
        { text: t.tense === 'tempi composti' ? 'è stato' : 'veniva', role: 'Verbo' },
        { text: 'letto', role: 'Participio', question: 'leggere (participio)' }
      ],
      replies: [{ questionIndex: 2, choices: ['letto', 'letto', 'leggeva', 'legge'], correct: 'letto', explanation: 'Passiva avanzata (' + t.tense + '): è stato/veniva + participio' }]
    });
  });

  // Concordanza tempi
  b1Templates.concordanzaTempi.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi avanzata', l2: 'Concordanza dei tempi', l3: 'Concordanza ' + t.type },
      sentence: [
        { text: t.conj.split(' ')[0], role: 'Verbo principale' },
        { text: 'che', role: 'Congiunzione' },
        { text: t.conj.split(' ')[2], role: 'Verbo subordinato', question: t.conj.split(' ')[2] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.conj.split(' ')[2], 'vai', 'vado', 'andava'], correct: t.conj.split(' ')[2], explanation: 'Concordanza ' + t.type + ': ' + t.conj }]
    });
  });

  return sentences;
}

function generateC2Sentences() {
  const sentences = [];

  // Strutture complesse
  c2Templates.struttureComplesse.forEach(t => {
    sentences.push({
      category: { l1: 'Sintassi avanzata', l2: 'Strutture sintatiche complesse', l3: t.type },
      sentence: [
        { text: t.conj.split(',')[0], role: 'Dislocazione' },
        { text: ',', role: 'Punteggiatura' },
        { text: t.conj.split(',')[1].trim(), role: 'Verbo', question: t.conj.split(' ')[2] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.conj.split(' ')[2], 'leggo', 'leggi', 'legge'], correct: t.conj.split(' ')[2], explanation: t.type + ': ' + t.conj }]
    });
  });

  // Registri linguistici
  c2Templates.registri.forEach(t => {
    sentences.push({
      category: { l1: 'Registri linguistici', l2: 'Differenze di registro', l3: t.type },
      sentence: [
        { text: t.formal, role: 'Saluto formale', question: t.formal + ' vs ' + t.informal },
        { text: '!', role: 'Punteggiatura' }
      ],
      replies: [{ questionIndex: 0, choices: [t.formal, t.informal, 'ciao', 'salve'], correct: t.formal, explanation: 'Registro formale: ' + t.formal }]
    });
  });

  // Espressioni idiomatiche
  c2Templates.espressioniIdiomatiche.forEach(t => {
    sentences.push({
      category: { l1: 'Espressioni idiomatiche', l2: 'Modi di dire', l3: t.type },
      sentence: [
        { text: 'Lui', role: 'Soggetto', gender: 'm' },
        { text: 'ha', role: 'Verbo' },
        { text: t.expr.split('il')[1] ? 'il cuore in gola' : 'al settimo cielo', role: 'Espressione', question: t.expr + ' (espressione)' }
      ],
      replies: [{ questionIndex: 2, choices: [t.expr, 'ha il cuore in gola', 'è al settimo cielo', 'ha fame'], correct: t.expr, explanation: 'Espressione idiomatica: ' + t.expr }]
    });
  });

  // Arcaismi
  c2Templates.arcaismi.forEach(t => {
    sentences.push({
      category: { l1: 'Linguaggio letterario', l2: 'Arcaismi', l3: t.type },
      sentence: [
        { text: 'Vado', role: 'Verbo' },
        { text: t.form, role: 'Pronome arcaico', question: t.modern + ' (arcaico)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.form, t.modern, 'con me', 'con te'], correct: t.form, explanation: 'Arcaismo: ' + t.form + ' = ' + t.modern }]
    });
  });

  // Stile indiretto libero
  c2Templates.stileIndirettoLibero.forEach(t => {
    sentences.push({
      category: { l1: 'Linguaggio letterario', l2: 'Narrativa', l3: t.type },
      sentence: [
        { text: 'Pensò:', role: 'Narrativa' },
        { text: t.expr.split(': ')[1], role: 'Stile indiretto', question: t.expr.split(' ')[2] + ' (infinito)' }
      ],
      replies: [{ questionIndex: 1, choices: [t.expr.split(' ')[2], 'andato', 'andava', 'andrà'], correct: t.expr.split(' ')[2], explanation: 'Stile indiretto libero: ' + t.expr }]
    });
  });

  return sentences;
}

// ==================== HELPER FUNCTIONS ====================
function generateVerbChoices(verb, correct, subject) {
  const persons = { 'io': 'tu', 'tu': 'lui', 'lui': 'io', 'lei': 'noi', 'noi': 'voi', 'voi': 'loro', 'loro': 'io' };
  const otherPerson = persons[subject] || 'tu';
  const verbBase = verb.replace('are', 'a').replace('ere', 'e').replace('ire', 'e');
  return [correct, verbBase + 'vo', verbBase + 'va', 'faccio'];
}

function generateVerbChoicesFuture(verb, correct, subject) {
  return [correct, correct.replace('ò', 'i').replace('ai', 'a').replace('à', 'i'), 'vado', 'faccio'];
}

function generateVerbChoicesCond(verb, correct, subject) {
  return [correct, correct.replace('ei', 'i').replace('esti', 'e'), 'vado', 'faccio'];
}

function generateReflexiveChoices(base, correct, subject) {
  return [correct, 'ti ' + base, 'si ' + base, 'ci ' + base];
}

function getDirectPronoun(obj) {
  if (obj.startsWith('il ')) return 'lo';
  if (obj.startsWith('la ')) return 'la';
  if (obj.startsWith('i ')) return 'li';
  if (obj.startsWith('le ')) return 'le';
  return 'lo';
}

function generateDirectObjChoices(obj, correct, subject) {
  return [correct, 'lo leggo', 'la leggo', 'li leggo'];
}

function generateCongiuntivoChoices(verb, correct, subject) {
  return [correct, 'che ' + subject + ' parla', 'che ' + subject + ' parlo', 'che ' + subject + ' parlano'];
}

function generateCongiuntivoImperfChoices(verb, correct, subject) {
  return [correct, 'che ' + subject + ' parlava', 'che ' + subject + ' parli', 'che ' + subject + ' parla'];
}

// ==================== MAIN EXECUTION ====================
console.log('Generating lessons for all levels...\n');

// Generate and merge for each level
const generations = [
  { level: 'a2', generator: generateA2Sentences, existing: 56, target: 112 },
  { level: 'b1', generator: generateB1Sentences, existing: 36, target: 72 },
  { level: 'b2', generator: generateB2Sentences, existing: 28, target: 56 },
  { level: 'c1', generator: generateC1Sentences, existing: 22, target: 44 },
  { level: 'c2', generator: generateC2Sentences, existing: 24, target: 48 }
];

generations.forEach(g => {
  console.log('Generating ' + g.level.toUpperCase() + ' sentences...');
  const newSentences = g.generator();
  const existing = JSON.parse(fs.readFileSync('/home/rso/opencode/evidente/languages/it/' + g.level + '.json', 'utf8'));
  const merged = [...existing, ...newSentences];
  
  fs.writeFileSync('/home/rso/opencode/evidente/languages/it/' + g.level + '.json', JSON.stringify(merged, null, 2), 'utf8');
  console.log('  Existing: ' + existing.length + ', New: ' + newSentences.length + ', Total: ' + merged.length + ' (target: ' + g.target + ')');
});

// Update language-pack.json
const pack = JSON.parse(fs.readFileSync('/home/rso/opencode/evidente/languages/it/language-pack.json', 'utf8'));
['a2', 'b1', 'b2', 'c1', 'c2'].forEach(lvl => {
  const data = JSON.parse(fs.readFileSync('/home/rso/opencode/evidente/languages/it/' + lvl + '.json', 'utf8'));
  pack.levels[lvl.toUpperCase()].taskCount = data.length;
});
pack.lastUpdated = '2026-04-30';
fs.writeFileSync('/home/rso/opencode/evidente/languages/it/language-pack.json', JSON.stringify(pack, null, 2), 'utf8');

console.log('\nUpdated language-pack.json');
console.log('Done! All levels now have double the sentences.');
