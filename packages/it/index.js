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

const generators = [genVerb, genDefArt, genIndefArt, genBasicQ];

const it = {
  meta: { code: 'it', name: 'Italian', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
  generateQuestion: function(level) {
    if (!it.meta.levels.includes(level)) return null;
    const gen = generators[Math.floor(Math.random() * generators.length)];
    return gen();
  }
};