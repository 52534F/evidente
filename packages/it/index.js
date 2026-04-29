// ============================================================
// ITALIAN LANGUAGE PACK - BROWSER VERSION
// ============================================================
// Loads data from JSON files via fetch() (browser) or fs (Node.js for testing)
// ============================================================

(function() {
  'use strict';

  var isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined';
  var isNode = typeof module !== 'undefined' && module.exports && !isBrowser;

  var SUPPORTED_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  var dataCache = {};
  var loadingPromise = null;

  function loadLevelData(level) {
    var url = 'data/it/' + level.toLowerCase() + '.json';

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