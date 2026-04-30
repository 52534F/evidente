// ============================================================
// ============================================================
// ITALIAN LANGUAGE PACK - BROWSER VERSION
// ============================================================
//
// PURPOSE:
//   Provides grammar drill questions for Italian language learners
//   across CEFR levels A1-C2.
//
// DATA SOURCE:
//   JSON files stored in the same directory as this file:
//   - a1.json (A1 level, 18 tasks)
//   - a2.json (A2 level, 8 tasks)
//   - b1.json (B1 level, 4 tasks)
//   - b2.json (B2 level, 3 tasks)
//   - c1.json (C1 level, 3 tasks)
//   - c2.json (C2 level, 3 tasks)
//
// JSON DATA FORMAT:
//   Each file contains an array of task objects:
//   {
//     "category": { "l1": "Morfologia", "l2": "Verbi", "l3": "Coniugazione" },
//     "sentence": [
//       { "text": "io", "role": "Soggetto" },
//       { "text": "parlo", "role": "Verbo", "question": "parlare" }
//     ],
//     "replies": [
//       { "questionIndex": 1, "choices": [...], "correct": "parlo", "explanation": "..." }
//     ]
//   }
//
// ENVIRONMENT DETECTION:
//   - Browser: Uses fetch() to load JSON files
//   - Node.js: Uses fs.readFileSync() to load JSON
//   - Detection: isBrowser = typeof document !== 'undefined'
//
// PUBLIC API:
//   var it = {
//     meta: { code: 'it', name: 'Italian', levels: [...] },
//     generateQuestion: function(level) -> Promise resolving to Question,
//     loadAll: function() -> Promise (pre-loads all JSON),
//     getAvailableLevels: function() -> string[],
//     getTaskCount: function(level) -> number
//   }
//
// QUESTION OBJECT (returned by generateQuestion):
//   {
//     id: "abc123",           // Hash ID
//     level: "A1",          // CEFR level
//     category: { l1: "...", l2: "...", l3: "..." },
//     syntaxBlocks: [{ text, role, gender, conjugation, replyIndex }],
//     replies: [{ choices, correctIndex, explanation }]
//   }
//
// ============================================================
// 
// DATA SOURCE:
//   JSON files stored in languages/it/ directory:
//   - a1.json (A1 level, 18 tasks)
//   - a2.json (A2 level, 8 tasks)
//   - b1.json (B1 level, 4 tasks)
//   - b2.json (B2 level, 3 tasks)
//   - c1.json (C1 level, 3 tasks)
//   - c2.json (C2 level, 3 tasks)
// 
// DATA FORMAT (JSON):
//   Each file contains an array of task objects:
//   {
//     "category": { "l1": "Morfologia", "l2": "Verbi", "l3": "Coniugazione" },
//     "sentence": [
//       { "text": "io", "role": "Soggetto" },
//       { "text": "parlo", "role": "Verbo", "question": "parlare" }
//     ],
//     "replies": [
//       { "questionIndex": 1, "choices": [...], "correct": "parlo", "explanation": "..." }
//     ]
//   }
// 
// ENVIRONMENT DETECTION:
//   - Browser: Uses fetch() to load JSON from languages/it/*.json
//   - Node.js: Uses fs.readFileSync() to load JSON
//   Detection: isBrowser = typeof document !== 'undefined'
// 
// PUBLIC API:
//   it = {
//     meta: { code: 'it', name: 'Italian', levels: [...] },
//     generateQuestion(level) -> Promise resolving to Question object,
//     loadAll() -> Promise (pre-loads all JSON files),
//     getAvailableLevels() -> string[],
//     getTaskCount(level) -> number
//   }
// 
// QUESTION OBJECT STRUCTURE:
//   {
//     id: "abc123",           // Hash ID
//     level: "A1",
//     category: { l1: "...", l2: "...", l3: "..." },
//     syntaxBlocks: [{ text, role, gender, conjugation, replyIndex }],
//     replies: [{ choices, correctIndex, explanation }]
//   }
// 
// ============================================================

(function() {
  'use strict';

  var isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined';
  var isNode = typeof module !== 'undefined' && module.exports && !isBrowser;

  var SUPPORTED_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  var dataCache = {};
  var loadingPromise = null;

  function loadLevelData(level) {
    var url = 'languages/it/' + level.toLowerCase() + '.json';

    if (isNode) {
      var fs = require('fs');
      var path = require('path');
      var fullPath = path.join(process.cwd(), url);
      var content = fs.readFileSync(fullPath, 'utf8');
      var data = JSON.parse(content);
      dataCache[level.toUpperCase()] = data;
      return Promise.resolve(data);
    }

    return fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to load ' + url);
        }
        return response.json();
      })
      .then(function(data) {
        dataCache[level.toUpperCase()] = data;
        return data;
      });
  }

  function ensureLevelLoaded(level) {
    level = level.toUpperCase();
    if (dataCache[level]) {
      return Promise.resolve(dataCache[level]);
    }
    if (!loadingPromise) {
      loadingPromise = loadLevelData(level);
    }
    return loadingPromise;
  }

  function generateHash(task) {
    var sentenceStr = task.sentence.map(function(u) { return u.text; }).join('|');
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

  // Pool of semantically different words for verb replies (each person/tense)
  var verbWordPool = {
    'io': ['parlo', 'mangio', 'vado', 'faccio', 'sono', 'ho', 'sto', 'vengo'],
    'tu': ['parli', 'mangi', 'vai', 'fai', 'sei', 'hai', 'stai', 'vieni'],
    'lui': ['parla', 'mangia', 'va', 'fa', 'è', 'ha', 'sta', 'viene'],
    'noi': ['parliamo', 'mangiamo', 'andiamo', 'facciamo', 'siamo', 'abbiamo', 'stiamo', 'veniamo'],
    'voi': ['parlate', 'mangiate', 'andate', 'fate', 'siete', 'avete', 'state', 'venite'],
    'loro': ['parlano', 'mangiano', 'vanno', 'fanno', 'sono', 'hanno', 'stanno', 'vengono']
  };

  function shuffleReplyChoices(reply) {
    var correct = reply.correct;
    var choices = [correct];

    // For verbs, use semantically different words from the pool
    // Detect if this is a verb reply by checking if correct is a verb form
    var verbMatch = Object.keys(verbWordPool).find(function(person) {
      return verbWordPool[person].indexOf(correct) !== -1;
    });

    if (verbMatch) {
      // Add 7 other verbs from the same person pool (semantically different)
      var pool = verbWordPool[verbMatch].filter(function(w) { return w !== correct; });
      // Shuffle and take 7
      var shuffled = pool.sort(function() { return Math.random() - 0.5; }).slice(0, 7);
      choices = choices.concat(shuffled);
    } else {
      // For non-verbs, use existing choices (minus correct) and pad to 8
      var others = reply.choices.filter(function(c) { return c !== correct; });
      // Add generic options to reach 8 total
      var genericPool = ['molto', 'bene', 'anche', 'sempre', 'dove', 'oggi', 'qui', 'c\u0027è'];
      var combined = others.concat(genericPool.filter(function(g) { return choices.indexOf(g) === -1; }));
      var shuffled = combined.sort(function() { return Math.random() - 0.5; }).slice(0, 7);
      choices = choices.concat(shuffled);
    }

    // Shuffle the final 8 choices
    choices = choices.sort(function() { return Math.random() - 0.5; });

    var result = JSON.parse(JSON.stringify(reply));
    result.choices = choices;
    result.correctIndex = choices.indexOf(correct);
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
      replies: replies,
      disabled: task.disabled || false,
      disabledReason: task.disabledReason || null
    };
  }

  function generateQuestion(level) {
    level = level ? level.toUpperCase() : 'A1';

    if (SUPPORTED_LEVELS.indexOf(level) === -1) {
      console.warn('Unsupported level:', level);
      return null;
    }

    var tasks = dataCache[level];
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
    var tasks = dataCache[level ? level.toUpperCase() : 'A1'];
    return tasks ? tasks.length : 0;
  }

  var it = {
    meta: {
      code: 'it',
      name: 'Italian',
      levels: SUPPORTED_LEVELS
    },
    generateQuestion: function(level) {
      return ensureLevelLoaded(level).then(function() {
        return generateQuestion(level);
      });
    },
    getAvailableLevels: getAvailableLevels,
    getTaskCount: getTaskCount,
    loadAll: function() {
      var self = this;
      var promises = SUPPORTED_LEVELS.map(function(level) {
        return loadLevelData(level);
      });
      return Promise.all(promises).then(function() {
        return self;
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = it;
  } else {
    window.it = it;
  }
})();