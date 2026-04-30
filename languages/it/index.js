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

  function shuffleReplyChoices(reply) {
    var correct = reply.correct;

    // Start with original choices if they exist and contain the correct answer
    var choices = reply.choices && reply.choices.indexOf(correct) !== -1
      ? reply.choices.slice()  // Use original choices
      : [correct];  // Start fresh with just correct

    // If we're starting fresh, add wrong answers from original set
    if (choices.length === 1 && reply.choices) {
      reply.choices.forEach(function(c) {
        if (c !== correct && c !== null && c !== undefined && choices.indexOf(c) === -1) {
          choices.push(c);
        }
      });
    }

    // Pad to 8 choices if needed
    if (choices.length < 8) {
      var genericPool = ['molto', 'bene', 'anche', 'sempre', 'dove', 'oggi', 'qui', 'c\'è'];
      genericPool.forEach(function(g) {
        if (choices.length < 8 && choices.indexOf(g) === -1) {
          choices.push(g);
        }
      });
    }

    // Shuffle the final choices
    choices = choices.sort(function() { return Math.random() - 0.5; });

    // Ensure correct is in choices
    if (choices.indexOf(correct) === -1) {
      choices[0] = correct;  // Force correct into the array
      choices = choices.sort(function() { return Math.random() - 0.5; });
    }

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