const A1_TOPICS = {
  verbs: [
    { v: 'essere', m: 'to be', f: { io: 'sono', tu: 'sei', lui: 'è', noi: 'siamo', voi: 'siete', loro: 'sono' } },
    { v: 'avere', m: 'to have', f: { io: 'ho', tu: 'hai', lui: 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' } },
    { v: 'mangiare', m: 'to eat', f: { io: 'mangio', tu: 'mangi', lui: 'mangia', noi: 'mangiamo', voi: 'mangiate', loro: 'mangiano' } },
    { v: 'bere', m: 'to drink', f: { io: 'bevo', tu: 'bevi', lui: 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' } },
    { v: 'andare', m: 'to go', f: { io: 'vado', tu: 'vai', lui: 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' } },
    { v: 'fare', m: 'to do', f: { io: 'faccio', tu: 'fai', lui: 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' } },
    { v: 'parlare', m: 'to speak', f: { io: 'parlo', tu: 'parli', lui: 'parla', noi: 'parliamo', voi: 'parlate', loro: 'parlano' } },
    { v: 'vedere', m: 'to see', f: { io: 'vedo', tu: 'vedi', lui: 'vede', noi: 'vediamo', voi: 'vedete', loro: 'vedono' } },
    { v: 'dare', m: 'to give', f: { io: 'do', tu: 'dai', lui: 'dà', noi: 'diamo', voi: 'date', loro: 'danno' } },
    { v: 'stare', m: 'to stay', f: { io: 'sto', tu: 'stai', lui: 'sta', noi: 'stiamo', voi: 'state', loro: 'stanno' } }
  ],
  pronouns: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'],
  nouns: [
    { n: 'libro', g: 'm' }, { n: 'ragazzo', g: 'm' }, { n: 'casa', g: 'f' }, { n: 'macchina', g: 'f' },
    { n: 'tavolo', g: 'm' }, { n: 'sedia', g: 'f' }, { n: 'uomo', g: 'm' }, { n: 'donna', g: 'f' },
    { n: 'amico', g: 'm' }, { n: 'ragazza', g: 'f' }, { n: 'italiano', g: 'm' }, { n: 'italiana', g: 'f' }
  ],
  basicQ: [
    { q: 'Che ore sono?', a: ['Sono le tre', "Sono l'una", 'È mezzogiorno', 'È tardi'], c: 0 },
    { q: "Chi è?", a: ['Sono Marco', 'È italiano', 'È un libro', 'Va bene'], c: 0 },
    { q: 'Dove vai?', a: ['Vado a casa', 'Sto bene', 'Ho fame', 'Parlo italiano'], c: 0 },
    { q: 'Come stai?', a: ['Sto bene, grazie', 'Ho fame', 'Vado via', 'Sono content'], c: 0 },
    { q: 'Cosa fai?', a: ['Studio italiano', 'Sono a casa', 'Ho un libro', 'Faccio bene'], c: 0 }
  ]
};

const PRONOMI_TOPICS = {
  soggetto: ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'],
  oggetto: ['mi', 'ti', 'lo', 'la', 'ci', 'vi', 'li', 'le'],
  riflessivi: [
    { v: 'svegliarsi', f: { io: 'mi sveglio', tu: 'ti svegli', lui: 'si sveglia', noi: 'ci svegliamo', voi: 'vi svegliate', loro: 'si svegliano' } },
    { v: 'lavarsi', f: { io: 'mi lavo', tu: 'ti lavi', lui: 'si lava', noi: 'ci laviamo', voi: 'vi lavate', loro: 'si lavano' } },
    { v: 'alzarsi', f: { io: 'mi alzo', tu: 'ti alzi', lui: 'si alza', noi: 'ci alziamo', voi: 'vi alzate', loro: 'si alzano' } },
    { v: 'sedersi', f: { io: 'mi siedo', tu: 'ti siedi', lui: 'si siede', noi: 'ci sediamo', voi: 'vi sedete', loro: 'si siedono' } },
    { v: 'divertirsi', f: { io: 'mi diverto', ti: 'ti diverte', lui: 'si diverte', noi: 'ci divertiamo', voi: 'vi divertite', loro: 'si divertono' } }
  ],
  combinati: [
    { p: 'me lo', correct: 'me lo', wrongs: ['te lo', 'glielo', 'ce lo'] },
    { p: 'me la', correct: 'me la', wrongs: ['te la', 'gliela', 'ce la'] },
    { p: 'me li', correct: 'me li', wrongs: ['te li', 'glieli', 'ce li'] },
    { p: 'me le', correct: 'me le', wrongs: ['te le', 'gliele', 'ce le'] },
    { p: 'te lo', correct: 'te lo', wrongs: ['me lo', 'glielo', 've lo'] },
    { p: 'te la', correct: 'te la', wrongs: ['me la', 'gliela', 've la'] },
    { p: 'glielo', correct: 'glielo', wrongs: ['me lo', 'te lo', 've lo'] },
    { p: 'gliela', correct: 'gliela', wrongs: ['me la', 'te la', 've la'] }
  ]
};

const IPOTETICO_TOPICS = {
  type0: [
    { p: 'Se piove, ___ a casa.', a: ['resto', 'resterò', 'restavo'], c: 0 },
    { p: 'Se hai fame, ___ qualcosa.', a: ['mangi', 'mangerai', 'mangevi'], c: 0 },
    { p: 'Se sei stanco, ___ a riposare.', a: ['vai', 'andrai', 'andavi'], c: 0 },
    { p: 'Se fa freddo, ___ il cappotto.', a: ['metto', 'metterò', 'mettevo'], c: 0 },
    { p: 'Se hai tempo, ___ a trovarmi.', a: ['vieni', 'verrai', 'venivi'], c: 0 }
  ],
  type1: [
    { p: 'Se domani ___ bene, ___ al mare.', a: ['farà', 'andrò', 'vado'], c: 1 },
    { p: 'Se domani ___ il treno, ___ in ritardo.', a: ['perderai', 'arriverò', 'arrivo'], c: 1 },
    { p: 'Se sarai gentile, ___ tutto.', a: ['otterrai', 'ottengo', 'ottiene'], c: 1 },
    { p: 'Se ___ presto, ___ prima.', a: ['partirai', 'arriverai', 'arrivo'], c: 1 },
    { p: 'Se ___ i compiti, ___ al cinema.', a: ['farai', 'potrai', 'puoi'], c: 1 }
  ],
  type2: [
    { p: 'Se ___ italiano, ___ meglio.', a: ['sapessi', 'saprei', 'so'], c: 1 },
    { p: 'Se ___ a Roma, ___ al Colosseo.', a: ['andassi', 'andrei', 'vado'], c: 1 },
    { p: 'Se ___ più alto, ___ nel team.', a: ['fossi', 'sarei', 'sono'], c: 1 },
    { p: 'Se ___ fame, ___ qualcosa.', a: ['avessi', 'avrei', 'ho'], c: 1 },
    { p: 'Se ___ il tempo, ___ in spiaggia.', a: ['facesse', 'farei', 'faccio'], c: 1 }
  ],
  type3: [
    { p: 'Se ___ studiato, ___ l\'esame.', a: ['avessi studiato', 'avrei studiato', 'ho studiato'], c: 1 },
    { p: 'Se ___ partito prima, ___ in tempo.', a: ['fosse partito', 'sarebbe partito', 'è partito'], c: 1 },
    { p: 'Se mi ___ chiamato, ___ subito.', a: ['avessi', 'avrei', 'ho'], c: 1 },
    { p: 'Se ___ stato più attento, ___ l\'errore.', a: ['fossi stato', 'sarei stato', 'sono stato'], c: 1 },
    { p: 'Se ___ mangiato di meno, ___ meglio.', a: ['avessi mangiato', 'avrei mangiato', 'ho mangiato'], c: 1 }
  ]
};

const CONGIUNTIVO_TOPICS = {
  presente: [
    { v: 'credere', s: 'lavorare', expect: 'lavori', sentence: 'Credo che ___ italiano.' },
    { v: 'sperare', s: 'venire', expect: 'venga', sentence: 'Spero che ___ alla festa.' },
    { v: 'dubitare', s: 'essere', expect: 'sia', sentence: 'Dubito che ___ a casa.' },
    { v: 'volere', s: 'parlare', expect: 'parli', sentence: 'Voglio che ___ con lui.' },
    { v: 'desiderare', s: 'avere', expect: 'abbia', sentence: 'Desidero che ___ tempo.' }
  ],
  passato: [
    { v: 'credere', s: 'finire', expect: 'abbia finito', sentence: 'Credo che ___ il lavoro.' },
    { v: 'sperare', s: 'arrivare', expect: 'sia arrivato', sentence: 'Spero che ___ in orario.' },
    { v: 'dubitare', s: 'vincere', expect: 'abbia vinto', sentence: 'Dubito che ___ la partita.' },
    { v: 'pensare', s: 'partire', expect: 'sia partito', sentence: 'Penso che ___ già.' },
    { v: 'essere sicuro', s: 'fare', expect: 'abbia fatto', sentence: 'Sono sicuro che ___ i compiti.' }
  ],
  imperfetto: [
    { v: 'volere', s: 'parlare', expect: 'parlasse', sentence: 'Volevo che ___ a tutti.' },
    { v: 'desiderare', s: 'andare', expect: 'andasse', sentence: 'Desideravo che ___ al cinema.' },
    { v: 'sperare', s: 'esserci', expect: 'fosse', sentence: 'Speravo che ___qui.' },
    { v: 'credere', s: 'sapere', expect: 'sapesse', sentence: 'Credevo che ___ tutto.' },
    { v: 'preferire', s: 'rimanere', expect: 'rimanesse', sentence: 'Preferivo che ___ a cena.' }
  ],
  trapassato: [
    { v: 'pentirsi', s: 'lavorare', expect: 'avesse lavorato', sentence: 'Mi pentivo che non ___ di più.' },
    { v: 'sperare', s: 'vedere', expect: 'avesse visto', sentence: 'Speravo che ___ il film.' },
    { v: 'volere', s: 'capire', expect: 'avesse capito', sentence: 'Avrei voluto che ___ tutto.' },
    { v: 'pensare', s: 'arrivare', expect: 'fosse arrivato', sentence: 'Pensavo che già ___.' },
    { v: 'essere felice', s: 'vincere', expect: 'avesse vinto', sentence: 'Sarei stato felice se ___ il premio.' }
  ]
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genVerb() {
  const verb = rand(A1_TOPICS.verbs);
  const pron = rand(A1_TOPICS.pronouns);
  const correct = verb.f[pron];
  const wrongs = Object.values(verb.f).filter(x => x !== correct);
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  return {
    prompt: pron.charAt(0).toUpperCase() + pron.slice(1) + ' (' + verb.v + ')',
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: '"' + verb.v + '" = "' + verb.m + '". ' + pron + ' = ' + correct
  };
}

function genDefArt() {
  const noun = rand(A1_TOPICS.nouns);
  const plural = Math.random() > 0.5;
  let correct;
  if (noun.g === 'm') {
    correct = plural ? (noun.n[0] === 'i' ? 'gli' : 'i') : ('libro,ragazzo,tavolo,amico'.includes(noun.n) ? 'il' : 'lo');
  } else {
    correct = plural ? 'le' : 'la';
  }
  const opts = ['il', 'lo', 'la', 'i', 'gli', 'le'].filter(x => x !== correct);
  const choices = shuffle([correct, ...opts.slice(0, 3)]);
  return {
    prompt: correct + ' ' + noun.n + (plural ? 'i' : ''),
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: correct + ' is the ' + (noun.g === 'm' ? 'masculine' : 'feminine') + ' ' + (plural ? 'plural' : 'singular') + ' article'
  };
}

function genIndefArt() {
  const noun = rand(A1_TOPICS.nouns);
  let correct;
  if (noun.g === 'm') {
    correct = noun.n === 'libro' || noun.n === 'tavolo' ? 'un' : 'uno';
  } else {
    correct = noun.n === 'auto' || noun.n === 'amica' ? "un'" : 'una';
  }
  const opts = ['un', 'uno', 'una', "un'"].filter(x => x !== correct);
  const choices = shuffle([correct, ...opts.slice(0, 3)]);
  return {
    prompt: correct + ' ' + noun.n,
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: correct + ' is the indefinite article for ' + (noun.g === 'm' ? 'a masculine' : 'a feminine') + ' noun'
  };
}

function genBasicQ() {
  const q = rand(A1_TOPICS.basicQ);
  const choices = shuffle([...q.a]);
  return {
    prompt: q.q,
    choices: choices,
    correctIndex: choices.indexOf(q.a[q.c]),
    explanation: 'The correct answer is "' + q.a[q.c] + '"'
  };
}

function genPronSoggetto() {
  const randomPronouns = shuffle([...PRONOMI_TOPICS.soggetto]).slice(0, 4);
  const correct = rand(PRONOMI_TOPICS.soggetto);
  const wrongs = PRONOMI_TOPICS.soggetto.filter(x => x !== correct);
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  return {
    prompt: 'Pronome soggetto: ' + rand(['io', 'tu', 'lui/lei'].slice(0,3)) + '?',
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: correct + ' è un pronome soggetto'
  };
}

function genPronOggetto() {
  const correct = rand(PRONOMI_TOPICS.oggetto);
  const wrongs = PRONOMI_TOPICS.oggetto.filter(x => x !== correct);
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  return {
    prompt: 'Pronome oggetto: "a me" →',
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: correct + ' è un pronome oggetto'
  };
}

function genPronRiflessivo() {
  const verb = rand(PRONOMI_TOPICS.riflessivi);
  const pronouns = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];
  const pron = rand(pronouns);
  const correct = verb.f[pron];
  const wrongs = Object.values(verb.f).filter(x => x !== correct);
  const choices = shuffle([correct, ...shuffle(wrongs).slice(0, 3)]);
  return {
    prompt: pron.charAt(0).toUpperCase() + pron.slice(1) + ' (' + verb.v + ')',
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: verb.v + ' è un verbo riflessivo: ' + pron + ' ' + correct
  };
}

function genPronCombinato() {
  const item = rand(PRONOMI_TOPICS.combinati);
  const choices = shuffle([item.correct, ...item.wrongs]);
  return {
    prompt: 'forma combinata: "a me" + "lo" →',
    choices: choices,
    correctIndex: choices.indexOf(item.correct),
    explanation: item.correct + ' è la forma combinata corretta'
  };
}

function genIpotetico(type) {
  const items = IPOTETICO_TOPICS[type];
  const q = rand(items);
  const choices = shuffle([...q.a]);
  const typeNames = { type0: 'Tipo 0 (realtà)', type1: 'Tipo 1 (futuro)', type2: 'Tipo 2 (irrealtà presente)', type3: 'Tipo 3 (irrealtà passata)' };
  return {
    prompt: typeNames[type] + '. ' + q.p,
    choices: choices,
    correctIndex: choices.indexOf(q.a[q.c]),
    explanation: 'La risposta corretta è: ' + q.a[q.c]
  };
}

function genCongiuntivo(type) {
  const items = CONGIUNTIVO_TOPICS[type];
  const item = rand(items);
  const correct = item.expect;
  const wrongs = [];
  const allWrongs = {
    presente: ['lavorava', 'lavorerà', 'lavorerebbe', 'lavorano'],
    passato: ['ha finit o', 'finiva', 'finirà', 'finisse'],
    imperfetto: ['lavorò', 'lavorerà', 'lavora', 'lavorano'],
    trapassato: ['ha finito', 'finiva', 'finirà', 'finisse']
  };
  const generatedWrongs = [];
  const irregulars = {
    presente: ['sia', 'venga', 'abbiano', 'parli'],
    passato: ['sia arrivato', 'è arrivato', 'arrivava', 'arriverà'],
    imperfetto: ['andasse', 'andò', 'andrà', 'va'],
    trapassato: ['fosse arrivato', 'arrivò', 'arriverà', 'arrivava']
  };
  if (irregulars[type]) {
    wrongs.push(...irregulars[type]);
  }
  while (wrongs.length < 3) {
    const w = rand(['alternate', 'wrong form']);
    if (!wrongs.includes(w) && w !== correct) wrongs.push(w);
  }
  const choices = shuffle([correct, ...wrongs.slice(0, 3)]);
  const typeNames = {
    presente: 'Congiuntivo presente',
    passato: 'Congiuntivo passato',
    imperfetto: 'Congiuntivo imperfetto',
    trapassato: 'Congiuntivo trapassato'
  };
  return {
    prompt: typeNames[type] + '. ' + item.sentence.replace('___', '___'),
    choices: choices,
    correctIndex: choices.indexOf(correct),
    explanation: 'Dopo "' + item.v + '" si usa il congiuntivo: ' + correct
  };
}

const generatorsA1 = [genVerb, genDefArt, genIndefArt, genBasicQ, genPronSoggetto];
const generatorsA2 = [...generatorsA1, genPronOggetto, genPronRiflessivo];
const generatorsB1 = [...generatorsA2, () => genIpotetico('type0'), () => genIpotetico('type1')];
const generatorsB2 = [...generatorsB1, () => genIpotetico('type2'), genCongiuntivoPresent, genCongiuntivoPass];
const generatorsC1 = [...generatorsB2, () => genIpotetico('type3'), genCongiuntivoImp, genCongiuntivoTrap];
const generatorsC2 = [...generatorsC1, genPronCombinato];

function genCongiuntivoPresent() { return genCongiuntivo('presente'); }
function genCongiuntivoPass() { return genCongiuntivo('passato'); }
function genCongiuntivoImp() { return genCongiuntivo('imperfetto'); }
function genCongiuntivoTrap() { return genCongiuntivo('trapassato'); }

const generatorsByLevel = {
  A1: generatorsA1,
  A2: generatorsA2,
  B1: generatorsB1,
  B2: generatorsB2,
  C1: generatorsC1,
  C2: generatorsC2
};

const it = {
  meta: { code: 'it', name: 'Italian', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
  generateQuestion: function(level) {
    const gens = generatorsByLevel[level];
    if (!gens) return null;
    const gen = rand(gens);
    return gen();
  }
};

module.exports = it;