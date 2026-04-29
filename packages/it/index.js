// ============================================================
// ITALIAN LANGUAGE PACK - BROWSER VERSION
// ============================================================
// Embeds all data directly for browser use
// ============================================================

(function() {
  'use strict';
  
  const DATA = {
    a1: [
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Coniugazione" },
        sentence: [
          { text: "io", role: "Soggetto" },
          { text: "parlo", role: "Verbo", question: "parlare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["parlo", "parli", "parla", "parlano"], correct: "parlo", explanation: "io + parlo (1ª persona singolare presente)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Coniugazione" },
        sentence: [
          { text: "tu", role: "Soggetto" },
          { text: "mangi", role: "Verbo", question: "mangiare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mango", "mangi", "mangia", "mangiamo"], correct: "mangi", explanation: "tu + mangiare (2ª persona singolare)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Coniugazione" },
        sentence: [
          { text: "lui", role: "Soggetto" },
          { text: "parla", role: "Verbo", question: "parlare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["parlo", "parli", "parla", "parlano"], correct: "parla", explanation: "lui + parla (3ª persona singolare)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Coniugazione" },
        sentence: [
          { text: "noi", role: "Soggetto" },
          { text: "mangiamo", role: "Verbo", question: "mangiare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mangio", "mangi", "mangia", "mangiamo"], correct: "mangiamo", explanation: "noi + mangiamo (1ª persona plurale)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Articoli", l3: "Articolo definito" },
        sentence: [
          { text: "Luigi", role: "Soggetto", gender: "m" },
          { text: "guarda", role: "Verbo" },
          { text: "il", role: "Articolo", question: "___" },
          { text: "libro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 2, choices: ["il", "lo", "la", "le"], correct: "il", explanation: "libro è maschile singolare → usa il" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Articoli", l3: "Articolo definito" },
        sentence: [
          { text: "Anna", role: "Soggetto", gender: "f" },
          { text: "legge", role: "Verbo" },
          { text: "la", role: "Articolo", question: "___" },
          { text: "ragazza", role: "Complemento", gender: "f" }
        ],
        replies: [
          { questionIndex: 2, choices: ["il", "lo", "la", "le"], correct: "la", explanation: "ragazza è femminile singolare → usa la" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Articoli", l3: "Articolo definito" },
        sentence: [
          { text: "i", role: "Articolo", question: "___" },
          { text: "ragazzi", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 0, choices: ["il", "lo", "i", "gli"], correct: "i", explanation: "ragazzi è maschile plurale → usa i" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Articoli", l3: "Articolo indefinito" },
        sentence: [
          { text: "Maria", role: "Soggetto", gender: "f" },
          { text: "compra", role: "Verbo" },
          { text: "una", role: "Articolo", question: "___" },
          { text: "casa", role: "Complemento", gender: "f" }
        ],
        replies: [
          { questionIndex: 2, choices: ["un", "uno", "una", "un'"], correct: "una", explanation: "casa è femminile singolare → usa una" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Articoli", l3: "Articolo indefinito" },
        sentence: [
          { text: "un", role: "Articolo", question: "___" },
          { text: "libro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 0, choices: ["un", "uno", "una", "un'"], correct: "un", explanation: "libro inizia per consonante → usa un" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome soggetto" },
        sentence: [
          { text: "lui", role: "Soggetto", question: "il ragazzo", gender: "m" },
          { text: "parla", role: "Verbo" }
        ],
        replies: [
          { questionIndex: 0, choices: ["io", "tu", "lui", "lei"], correct: "lui", explanation: "Usa lui per sostituire il ragazzo (soggetto maschile)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome soggetto" },
        sentence: [
          { text: "lei", role: "Soggetto", question: "la ragazza", gender: "f" },
          { text: "mangia", role: "Verbo" }
        ],
        replies: [
          { questionIndex: 0, choices: ["io", "tu", "lui", "lei"], correct: "lei", explanation: "Usa lei per sostituire la ragazza (soggetto femminile)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome soggetto" },
        sentence: [
          { text: "noi", role: "Soggetto", question: "noi" },
          { text: "parliamo", role: "Verbo" }
        ],
        replies: [
          { questionIndex: 0, choices: ["noi", "voi", "loro"], correct: "noi", explanation: "Usa noi come soggetto (1ª persona plurale)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Essere" },
        sentence: [
          { text: "io", role: "Soggetto" },
          { text: "sono", role: "Verbo", question: "essere" }
        ],
        replies: [
          { questionIndex: 1, choices: ["sono", "sei", "è", "siamo"], correct: "sono", explanation: "io sono (1ª persona di essere)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Avere" },
        sentence: [
          { text: "tu", role: "Soggetto" },
          { text: "hai", role: "Verbo", question: "avere" }
        ],
        replies: [
          { questionIndex: 1, choices: ["ho", "hai", "ha", "abbiamo"], correct: "hai", explanation: "tu hai (2ª persona di avere)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Andare" },
        sentence: [
          { text: "lui", role: "Soggetto" },
          { text: "va", role: "Verbo", question: "andare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["vado", "vai", "va", "vanno"], correct: "va", explanation: "lui va (3ª persona di andare)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Fare" },
        sentence: [
          { text: "noi", role: "Soggetto" },
          { text: "facciamo", role: "Verbo", question: "fare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["faccio", "fai", "fa", "facciamo"], correct: "facciamo", explanation: "noi facciamo (1ª persona plurale di fare)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Dare" },
        sentence: [
          { text: "loro", role: "Soggetto" },
          { text: "danno", role: "Verbo", question: "dare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["do", "dai", "dà", "danno"], correct: "danno", explanation: "loro danno (3ª persona plurale di dare)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Stare" },
        sentence: [
          { text: "voi", role: "Soggetto" },
          { text: "state", role: "Verbo", question: "stare" }
        ],
        replies: [
          { questionIndex: 1, choices: ["sto", "stai", "sta", "stiamo"], correct: "state", explanation: "voi state (2ª persona plurale di stare)" }
        ]
      }
    ],
    a2: [
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome oggetto" },
        sentence: [
          { text: "Marco", role: "Soggetto", gender: "m" },
          { text: "dà", role: "Verbo" },
          { text: "mi", role: "Oggetto indiretto", question: "a me" },
          { text: "il libro", role: "Oggetto diretto", gender: "m" }
        ],
        replies: [
          { questionIndex: 2, choices: ["mi", "ti", "gli", "le"], correct: "mi", explanation: "Usa mi per 'a me' (oggetto indiretto)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome oggetto" },
        sentence: [
          { text: "Maria", role: "Soggetto", gender: "f" },
          { text: "parla", role: "Verbo" },
          { text: "gli", role: "Oggetto indiretto", question: "a lui" },
          { text: "di noi", role: "Complemento" }
        ],
        replies: [
          { questionIndex: 2, choices: ["mi", "ti", "gli", "le"], correct: "gli", explanation: "Usa gli per 'a lui' (oggetto indiretto)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome riflessivo" },
        sentence: [
          { text: "ogni mattina", role: "Avverbio" },
          { text: "mi sveglio", role: "Verbo", question: "svegliarsi" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mi sveglio", "ti svegli", "si sveglia", "ci svegliamo"], correct: "mi sveglio", explanation: "mi + sveglio (1ª persona singolare riflessivo)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome riflessivo" },
        sentence: [
          { text: "tu", role: "Soggetto" },
          { text: "ti lavi", role: "Verbo", question: "lavarsi" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mi lavo", "ti lavi", "si lava", "ci laviamo"], correct: "ti lavi", explanation: "ti + lavi (2ª persona singolare riflessivo)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome riflessivo" },
        sentence: [
          { text: "noi", role: "Soggetto" },
          { text: "ci alziamo", role: "Verbo", question: "alzarsi" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mi alzo", "ti alzi", "si alza", "ci alziamo"], correct: "ci alziamo", explanation: "ci + alziamo (1ª persona plurale riflessivo)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome riflessivo" },
        sentence: [
          { text: "loro", role: "Soggetto" },
          { text: "si svegliano", role: "Verbo", question: "svegliarsi" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mi sveglio", "ti svegli", "si sveglia", "si svegliano"], correct: "si svegliano", explanation: "si + svegliano (3ª persona plurale riflessivo)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Passato prossimo" },
        sentence: [
          { text: "io", role: "Soggetto" },
          { text: "ho mangiato", role: "Verbo", question: "avere" }
        ],
        replies: [
          { questionIndex: 1, choices: ["mangio", "mangiato", "ho mangiato", "mangerò"], correct: "ho mangiato", explanation: "ho + participio passato (passato prossimo con avere)" }
        ]
      },
      {
        category: { l1: "Morfologia", l2: "Verbi", l3: "Passato prossimo" },
        sentence: [
          { text: "lei", role: "Soggetto" },
          { text: "ha parlato", role: "Verbo", question: "avere" }
        ],
        replies: [
          { questionIndex: 1, choices: ["parla", "parlato", "ha parlato", "parlerà"], correct: "ha parlato", explanation: "ha + participio passato (passato prossimo con avere)" }
        ]
      }
    ],
    b1: [
      {
        category: { l1: "Morfologia", l2: "Pronomi", l3: "Pronome combinato" },
        sentence: [
          { text: "Mario", role: "Soggetto", gender: "m" },
          { text: "presenta", role: "Verbo" },
          { text: "mi", role: "Oggetto indiretto", question: "mi" },
          { text: "il messaggio", role: "Oggetto diretto", question: "il messaggio" }
        ],
        replies: [
          { questionIndex: 2, choices: ["mi", "ti", "gli", "le"], correct: "mi", explanation: "Usa mi per oggetto indiretto (dativo)" },
          { questionIndex: 3, choices: ["lo", "la", "li", "le"], correct: "il messaggio", explanation: "Usa il messaggio (oggetto diretto, maschile singolare)" }
        ]
      },
      {
        category: { l1: "Sintassi", l2: "Periodo ipotetico", l3: "Tipo 1" },
        sentence: [
          { text: "Se", role: "Congiunzione" },
          { text: "domani", role: "Avverbio" },
          { text: "piove", role: "Verbo" },
          { text: "andrò", role: "Verbo", question: "andrò" },
          { text: "a casa", role: "Complemento" }
        ],
        replies: [
          { questionIndex: 3, choices: ["andrò", "vado", "resto", "andrà"], correct: "andrò", explanation: "Se + presente → futuro semplice (Tipo 1)" }
        ]
      },
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Presente" },
        sentence: [
          { text: "Credo che", role: "Congiunzione" },
          { text: "lavori", role: "Verbo", question: "lavorare" },
          { text: "italiano", role: "Complemento", gender: "m" }
],
        replies: [
          { questionIndex: 1, choices: ["lavori", "lava", "lavorava", "lavorerà"], correct: "lavori", explanation: "Credo che + congiuntivo presente" }
        ]},
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Presente" },
        sentence: [
          { text: "Spero che", role: "Congiunzione" },
          { text: "finisca", role: "Verbo", question: "finire" },
          { text: "il lavoro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["finisca", "finiva", "finirà", "finisse"], correct: "finisca", explanation: "Spero che + congiuntivo presente" }
        ]
      }
    ],
    b2: [
      {
        category: { l1: "Sintassi", l2: "Periodo ipotetico", l3: "Tipo 2" },
        sentence: [
          { text: "Se", role: "Congiunzione" },
          { text: "avessi", role: "Verbo", question: "avessi" },
          { text: "fame", role: "Complemento" },
          { text: "mangerei", role: "Verbo", question: "mangerei" },
          { text: "la pizza", role: "Complemento" }
        ],
        replies: [
          { questionIndex: 1, choices: ["avessi", "avevo", "avrò", "ho"], correct: "avessi", explanation: "Se + imperfetto congiuntivo (Tipo 2)" },
          { questionIndex: 3, choices: ["mangerei", "mangio", "mangia", "mangerò"], correct: "mangerei", explanation: "Poi + condizionale presente" }
        ]
      },
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Presente" },
        sentence: [
          { text: "Credo che", role: "Congiunzione" },
          { text: "lavori", role: "Verbo", question: "lavori" },
          { text: "bene", role: "Avverbio" }
        ],
        replies: [
          { questionIndex: 1, choices: ["lavori", "lava", "lavorava", "lavorerà"], correct: "lavori", explanation: "Credo che + congiuntivo presente" }
        ]
      },
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Trapassato" },
        sentence: [
          { text: "Se non", role: "Congiunzione" },
          { text: "avessi", role: "Verbo", question: "avessi" },
          { text: "tempo", role: "Complemento" },
          { text: "non", role: "Negazione" },
          { text: "finisse", role: "Verbo", question: "finisse" },
          { text: "il lavoro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["avessi", "avevo", "avrò", "ho"], correct: "avessi", explanation: "Se non + trapassato congiuntivo" },
          { questionIndex: 4, choices: ["finisse", "finiva", "finirà", "finito"], correct: "finisse", explanation: "Trapassato congiuntivo (3ª persona)" }
        ]
      }
    ],
    c1: [
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Presente" },
        sentence: [
          { text: "Credo che", role: "Congiunzione" },
          { text: "lavori", role: "Verbo", question: "lavori" },
          { text: "italiano", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["lavori", "lava", "lavorava", "lavorerà"], correct: "lavori", explanation: "Credo che + congiuntivo presente" }
        ]},
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Imperfetto" },
        sentence: [
          { text: "Credo che", role: "Congiunzione" },
          { text: "lavorasse", role: "Verbo", question: "lavorasse" },
          { text: "sempre", role: "Avverbio" }
        ],
        replies: [
          { questionIndex: 1, choices: ["lavorasse", "lavorava", "lavorerà", "lavori"], correct: "lavorasse", explanation: "Credo che + congiuntivo imperfetto" }
        ]},
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Trapassato" },
        sentence: [
          { text: "Se non", role: "Congiunzione" },
          { text: "avessi", role: "Verbo", question: "avessi" },
          { text: "tempo", role: "Complemento" },
          { text: ", non", role: "Congiunzione" },
          { text: "finisse", role: "Verbo", question: "finisse" },
          { text: "il lavoro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["avessi", "avevo", "avrò", "ho"], correct: "avessi", explanation: "Se non + trapassato congiuntivo" },
          { questionIndex: 4, choices: ["finisse", "finiva", "finirà", "finito"], correct: "finisse", explanation: "Trapassato congiuntivo (3ª persona)" }
        ]
      }
    ],
    c2: [
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Imperfetto" },
        sentence: [
          { text: "Credo che", role: "Congiunzione" },
          { text: "lavorasse", role: "Verbo", question: "lavorasse" },
          { text: "italiano", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["lavorasse", "lavorava", "lavorerà", "lavori"], correct: "lavorasse", explanation: "Credo che + congiuntivo imperfetto" }
        ]},
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Trapassato" },
        sentence: [
          { text: "Se non", role: "Congiunzione" },
          { text: "avesse", role: "Verbo", question: "avere" },
          { text: "tempo", role: "Complemento" },
          { text: ", non", role: "Congiunzione" },
          { text: "finisse", role: "Verbo", question: "finire" },
          { text: "il lavoro", role: "Complemento", gender: "m" }
        ],
        replies: [
          { questionIndex: 1, choices: ["avessi", "avesse", "averei", "avevo"], correct: "avessi", explanation: "Se non + trapassato congiuntivo" },
          { questionIndex: 4, choices: ["finisse", "finisse", "finirei", "finivo"], correct: "finisse", explanation: "Trapassato congiuntivo (3ª persona)" }
        ]
      },
      {
        category: { l1: "Sintassi", l2: "Congiuntivo", l3: "Trapassato" },
        sentence: [
          { text: "Bastava che", role: "Congiunzione" },
          { text: "fossi", role: "Verbo", question: "essere" },
          { text: "arrivato prima", role: "Complemento" }
        ],
        replies: [
          { questionIndex: 1, choices: ["fossi", "essere", "sarò", "sono"], correct: "fossi", explanation: "Bastava che + trapassato congiuntivo" }
        ]
      }
    ]
  };
  
  const SUPPORTED_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  
  function generateHash(task) {
    const sentenceStr = task.sentence.map(function(u) { return u.text; }).join('|');
    var repliesStr = task.replies.map(function(r) { return r.correct; }).join('|');
    var combined = sentenceStr + '|' + repliesStr;
    var hash = 0;
    for (var i = 0; i < combined.length; i++) {
      var char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }
  
  function shuffleReplyChoices(reply) {
    var others = reply.choices.filter(function(c) { return c !== reply.correct; });
    var shuffled = others.sort(function() { return Math.random() - 0.5; }).slice(0, 3);
    var choices = [reply.correct].concat(shuffled).sort(function() { return Math.random() - 0.5; });
    var result = JSON.parse(JSON.stringify(reply));
    result.choices = choices;
    result.correctIndex = choices.indexOf(reply.correct);
    return result;
  }
  
  function transformToQuestion(task) {
    var syntaxBlocks = task.sentence.map(function(unit, index) {
      var isQuestion = unit.question !== undefined && unit.question !== null;
      var block = {
        text: isQuestion ? '&lbrack;' + unit.question + '&rbrack;' : unit.text,
        role: unit.role,
        case: unit.case || null,
        gender: unit.gender || null,
        conjugation: unit.conjugation || null
      };
      if (isQuestion) {
        var reply = task.replies.find(function(r) { return r.questionIndex === index; });
        if (reply) {
          block.replyIndex = task.replies.indexOf(reply);
        }
      }
      return block;
    });
    
    var replies = task.replies.map(shuffleReplyChoices);
    
    var category = {
      l1: task.category ? task.category.l1 : 'Morfologia',
      l2: task.category ? task.category.l2 : ' grammar',
      l3: task.category ? task.category.l3 : null
    };
    
    return {
      id: task.id,
      level: task.level,
      category: category,
      syntaxBlocks: syntaxBlocks,
      replies: replies
    };
  }
  
  function generateQuestion(level) {
    level = level ? level.toUpperCase() : 'A1';
    
    if (SUPPORTED_LEVELS.indexOf(level) === -1) {
      console.warn('Unsupported level:', level);
      return null;
    }
    
    var tasks = DATA[level.toLowerCase()];
    if (!tasks || tasks.length === 0) {
      console.warn('No tasks found for level:', level);
      return null;
    }
    
    var task = tasks[Math.floor(Math.random() * tasks.length)];
    var cloned = JSON.parse(JSON.stringify(task));
    cloned.id = generateHash(task);
    cloned.level = level;
    
    return transformToQuestion(cloned);
  }
  
  function getAvailableLevels() {
    return SUPPORTED_LEVELS.slice();
  }
  
  function getTaskCount(level) {
    var tasks = DATA[level ? level.toLowerCase() : 'a1'];
    return tasks ? tasks.length : 0;
  }
  
  var it = {
    meta: {
      code: 'it',
      name: 'Italian',
      levels: SUPPORTED_LEVELS
    },
    generateQuestion: generateQuestion,
    getAvailableLevels: getAvailableLevels,
    getTaskCount: getTaskCount
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = it;
  } else {
    window.it = it;
  }
})();