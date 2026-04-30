const STORAGE_KEY = 'grammadrill_highscore';
const LANG_STORAGE_KEY = 'grammadrill_language';
const FEEDBACK_DELAY = 1500;

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved || 'it';
  } catch {
    return 'it';
  }
}

function saveLanguage(code) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, code);
  } catch {}
}

let currentLang = null;
let state = { score:0, streak:0, qAnswered:0, level: 'A1', language: getSavedLanguage(), q: null, currentReplyIndex: 0, done: false, categoryLock: null };

const el = {
  start: document.getElementById('start-screen'),
  game: document.getElementById('game-screen'),
  over: document.getElementById('gameover-screen'),
  hsVal: document.getElementById('high-score-value'),
  lvl: document.getElementById('level-select'),
  langSelect: document.getElementById('language-select'),
  startBtn: document.getElementById('start-btn'),
  score: document.getElementById('game-score'),
  streak: document.getElementById('game-streak'),
  btns: document.getElementById('answer-buttons'),
  fb: document.getElementById('feedback-overlay'),
  fbRes: document.getElementById('feedback-result'),
  fbExp: document.getElementById('feedback-explanation'),
  quit: document.getElementById('quit-btn'),
  finS: document.getElementById('final-score'),
  finQ: document.getElementById('final-questions'),
  newHs: document.getElementById('new-high-score'),
  again: document.getElementById('play-again-btn'),
  home: document.getElementById('home-btn'),
  catBar: document.getElementById('category-bar'),
  syntaxBlocks: document.getElementById('syntax-blocks'),
  langFlagBtn: document.getElementById('language-flag-btn'),
  langDropdown: document.getElementById('language-dropdown'),
  currentFlag: document.getElementById('current-flag'),
  levelIndicatorBtn: document.getElementById('level-indicator-btn'),
  levelDropdown: document.getElementById('level-dropdown'),
  currentLevel: document.getElementById('current-level'),
  statsScreen: document.getElementById('stats-screen'),
  statsHeaderBtn: document.getElementById('stats-header-clickable'),
  statsTitle: document.getElementById('stats-title'),
  statsResetBtn: document.getElementById('stats-reset-btn'),
  statsContent: document.getElementById('stats-content'),
  statsSessions: document.getElementById('stats-sessions'),
  statsTotalTime: document.getElementById('stats-total-time'),
  statsLastPlayed: document.getElementById('stats-last-played'),
  langStatsContent: document.getElementById('language-stats-content'),
  statsBtn: document.getElementById('stats-btn'),
  gameScoreBtn: document.getElementById('game-score-btn'),
  gameStreakBtn: document.getElementById('game-streak-btn')
};

function getHs() { try { return parseInt(localStorage.getItem(STORAGE_KEY)) || 0; } catch { return 0; } }
function setHs(s) { try { localStorage.setItem(STORAGE_KEY, s); } catch {} }

function show(s) { el.start.classList.add('hidden'); el.game.classList.add('hidden'); el.over.classList.add('hidden'); s.classList.remove('hidden'); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let availableLanguages = [];

function loadAvailableLanguages() {
  return fetch('languages/manifest.json')
    .then(r => r.json())
    .then(manifest => Promise.all(
      (manifest.languages || []).map(code =>
        fetch(`languages/${code}/language-pack.json`)
          .then(r => r.json())
          .then(meta => ({ code, meta }))
          .catch(err => {
            console.error(`Failed to load ${code}/language-pack.json:`, err);
            return null;
          })
      )
    ))
    .then(langs => {
      availableLanguages = langs.filter(l => l !== null);
      return availableLanguages;
    });
}

function loadLanguageModule(code) {
  if (window[code] && window[code].generateQuestion) {
    return Promise.resolve(window[code]);
  }
  const lang = availableLanguages.find(l => l.code === code);
  if (!lang) return Promise.reject(new Error(`Language ${code} not found`));
  const entryPoint = (lang.meta && lang.meta.entryPoint) || 'index.js';
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `languages/${code}/${entryPoint}`;
    script.onload = () => window[code] ? resolve(window[code]) : reject(new Error('Module load failed'));
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function populateLanguageSelect() {
  el.langSelect.innerHTML = '';
  availableLanguages.forEach(({ code, meta }) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${meta.symbol} ${meta.name}`;
    el.langSelect.appendChild(opt);
  });
  el.langSelect.value = state.language;
}

function populateLevelSelect(levels) {
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const available = levelOrder.filter(l => levels && levels[l]);
  el.lvl.innerHTML = '';
  available.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l;
    opt.textContent = `${l} - ${levels[l].label}`;
    el.lvl.appendChild(opt);
  });
  el.lvl.value = available.includes(state.level) ? state.level : (available[0] || 'A1');
  updateLevelIndicator();
}

function updateFlag() {
  const lang = availableLanguages.find(l => l.code === state.language);
  if (lang && lang.meta) {
    el.currentFlag.textContent = lang.meta.symbol || '';
    el.langFlagBtn.setAttribute('aria-label', `Current language: ${lang.meta.name || state.language}`);
  }
}

function selectLanguage(code) {
  if (code === state.language) return;
  state.categoryLock = null; // Reset category lock
  loadLanguageModule(code).then(module => {
    state.language = code;
    currentLang = module;
    saveLanguage(code);
    updateFlag();
    updateLevelIndicator();
    // Use availableLanguages for levels with labels (from language-pack.json)
    const langData = availableLanguages.find(l => l.code === code);
    populateLevelSelect(langData && langData.meta && langData.meta.levels || {});
    if (el.langDropdown) el.langDropdown.classList.add('hidden');
    if (!el.game.classList.contains('hidden')) {
      displayQ();
    }
  }).catch(err => {
    console.error('Failed to switch language:', err);
  });
}

function selectLevel(lvl) {
  if (lvl === state.level) return;
  state.categoryLock = null; // Reset category lock
  state.level = lvl;
  updateLevelIndicator();
  if (!el.game.classList.contains('hidden')) {
    displayQ();
  }
}

function updateLevelIndicator() {
  if (el.currentLevel) {
    el.currentLevel.textContent = state.level;
  }
}

function displayQ(retryCount) {
  if (retryCount === undefined) retryCount = 0;
  const MAX_RETRIES = 10;
  
  currentLang.generateQuestion(state.level).then(function(q) {
    if (!q) { alert('No questions'); end(); return; }
    
    // Skip disabled questions (e.g., Negazione tasks that need a new feature)
    if (q.disabled) {
      if (retryCount < MAX_RETRIES) {
        return displayQ(retryCount + 1);
      } else {
        alert('No enabled questions available. Please try a different level or category.');
        end();
        return;
      }
    }
    
    // Check category lock filter
    if (state.categoryLock && q.category) {
      const lockLevel = state.categoryLock.level;
      const lockValue = state.categoryLock.value;
      const qValue = q.category[lockLevel];
      // If question doesn't match locked category, retry
      if (!qValue || qValue.toLowerCase() !== (lockValue || '').toLowerCase()) {
        if (retryCount < MAX_RETRIES) {
          return displayQ(retryCount + 1);
        } else {
          alert('No questions matching the selected category. Unlocking category.');
          state.categoryLock = null;
          // Unlock all category levels
          el.catBar.querySelectorAll('.category-level').forEach(l => l.classList.remove('locked'));
        }
      }
    }
    
    state.q = q; state.currentReplyIndex = 0; state.done = false;

    if (q.category) {
      el.catBar.classList.remove('hidden');
      el.catBar.querySelector('.l1').textContent = q.category.l1.toLowerCase();
      el.catBar.querySelector('.l2').textContent = q.category.l2.toLowerCase();
      el.catBar.querySelector('.l3').textContent = q.category.l3.toLowerCase();
    } else {
      el.catBar.classList.add('hidden');
    }

    renderSyntaxBlocks(q, 0);
    renderButtons(q, 0);
    // Don't hide feedback - it persists until next answer
  }).catch(function(err) {
    console.error('Error loading question:', err);
    alert('Error loading question');
    end();
  });
}

function isQuestionBlock(block) {
  if (block.replyIndex !== undefined) return true;
  if (block.text === '___') return true;
  if (block.text && block.text.startsWith('[') && block.text.endsWith(']')) return true;
  return false;
}

function getReplyIndex(block) {
  if (block.replyIndex !== undefined) return block.replyIndex;
  return null;
}

function updateSyntaxBlockForReply(q, replyIndex, chosenIndex, correctIndex, isCorrect) {
  if (!q.syntaxBlocks || q.syntaxBlocks.length === 0) return;
  
  const blockIndex = q.syntaxBlocks.findIndex(b => getReplyIndex(b) === replyIndex);
  if (blockIndex === -1) return;
  
  const block = q.syntaxBlocks[blockIndex];
  const blockElement = el.syntaxBlocks.children[blockIndex];
  if (!blockElement) return;
  
  // Update text from [question hint] to correct text
  const correctText = q.replies ? q.replies[replyIndex].choices[correctIndex] : q.choices[correctIndex];
  const wordSpan = blockElement.querySelector('.word');
  if (wordSpan) {
    wordSpan.textContent = correctText;
  }
  
  // Flash red on wrong answer
  if (!isCorrect) {
    blockElement.classList.add('flash-red');
    setTimeout(() => {
      blockElement.classList.remove('flash-red');
    }, 500);
  }
}

function renderSyntaxBlocks(q, replyIndex) {
  if (q.syntaxBlocks && q.syntaxBlocks.length > 0) {
    el.syntaxBlocks.classList.remove('hidden');
    el.syntaxBlocks.innerHTML = q.syntaxBlocks.map((block, blockIndex) => {
      const blockReplyIndex = getReplyIndex(block);
      const details = [];
      if (block.case) details.push(block.case);
      if (block.gender) details.push(block.gender === 'm' ? 'm' : 'f');
      let conjugationHtml = '';
      if (block.conjugation) {
        const c = block.conjugation;
        conjugationHtml = `<div class="conjugation">${c.persona || ''} ${c.tempo || ''} ${c.modo || ''}</div>`;
      }
      let displayText = block.text || '·';
      if (displayText.startsWith('[') && displayText.endsWith(']')) {
        displayText = displayText.slice(1, -1);
      }
      // Format role: for verbs, append tense/person info
      let displayRole = block.role || 'Parola';
      if (block.role === 'Verbo' && block.conjugation) {
        const c = block.conjugation;
        const parts = [c.tempo, c.persona].filter(Boolean);
        if (parts.length > 0) {
          displayRole = `${block.role} (${parts.join(', ')})`;
        }
      }
      // Highlight active block (the one being answered)
      const isActive = blockReplyIndex === replyIndex;
      const activeClass = isActive ? ' active' : '';
      return `
        <div class="syntax-block${activeClass}" data-role="${block.role || 'Parola'}" data-reply-index="${blockReplyIndex !== null ? blockReplyIndex : ''}">
          <span class="word">${displayText}</span>
          <span class="role">${displayRole}</span>
          ${details.length > 0 ? `<span class="details">${details.join(' · ')}</span>` : ''}
          ${conjugationHtml}
        </div>
      `;
    }).join('');
  } else {
    el.syntaxBlocks.classList.add('hidden');
  }
}

function renderButtons(q, replyIndex) {
  const btns = el.btns.querySelectorAll('.answer-btn');
  let choices, correctIndex;
  if (q.replies && q.replies.length > 0 && q.replies[replyIndex]) {
    choices = q.replies[replyIndex].choices || [];
    correctIndex = q.replies[replyIndex].correctIndex;
  } else {
    choices = q.choices || [];
    correctIndex = q.correctIndex;
  }
  const sc = shuffle(choices.map((t, i) => ({ text: t, originalIndex: i })));
  btns.forEach((b, i) => {
    // Always clear previous state
    b.className = 'answer-btn';
    b.classList.remove('correct-answer', 'wrong');
    if (sc[i]) {
      b.textContent = sc[i].text;
      b.dataset.choiceIndex = sc[i].originalIndex;
      b.disabled = false;
    }
  });
}

function handle(idx) {
  if (state.done) return;
  const q = state.q;
  const ri = state.currentReplyIndex;
  let choices, correctIndex, explanation;
  if (q.replies && q.replies.length > 0 && q.replies[ri]) {
    choices = q.replies[ri].choices;
    correctIndex = q.replies[ri].correctIndex;
    explanation = q.replies[ri].explanation;
  } else {
    choices = q.choices;
    correctIndex = q.correctIndex;
    explanation = q.explanation;
  }
  const btns = el.btns.querySelectorAll('.answer-btn');
  btns.forEach(b => { b.disabled = true; });
  let isCorrect = false;
  btns.forEach(b => {
    if (parseInt(b.dataset.choiceIndex) === correctIndex) {
      b.classList.add('correct-answer');
    }
  });
  if (parseInt(btns[idx].dataset.choiceIndex) === correctIndex) {
    isCorrect = true;
  }
  if (isCorrect) {
    state.score++;
    state.streak++;
    el.fbRes.textContent = 'Correct!';
    el.fbRes.className = 'feedback correct';
    el.fb.className = 'feedback correct';
  } else {
    state.score--;
    state.streak = 0;
    el.fbRes.textContent = 'Wrong!';
    el.fbRes.className = 'feedback wrong';
    el.fb.className = 'feedback wrong';
  }
  el.fbExp.textContent = explanation;
  el.fb.classList.remove('hidden');
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;

  // Record statistics
  if (window.statsModule && q.category) {
    window.statsModule.recordAnswer(state.language, state.level, q.category, isCorrect, state.score, state.streak);
  }

  // Update corresponding syntaxBlock text and flash red if wrong
  updateSyntaxBlockForReply(q, ri, parseInt(btns[idx].dataset.choiceIndex), correctIndex, isCorrect);

  const totalReplies = (q.replies && q.replies.length) || 1;
  state.currentReplyIndex++;
  state.qAnswered++;

  if (state.currentReplyIndex < totalReplies) {
    if (isCorrect) {
      // No delay for correct answers - immediately show next reply
      renderSyntaxBlocks(q, state.currentReplyIndex);
      renderButtons(q, state.currentReplyIndex);
      // Don't hide feedback - it persists
      state.done = false;
    } else {
      // Keep delay for wrong answers
      setTimeout(() => {
        renderSyntaxBlocks(q, state.currentReplyIndex);
        renderButtons(q, state.currentReplyIndex);
        // Don't hide feedback
        state.done = false;
      }, FEEDBACK_DELAY);
    }
  } else {
    state.done = true;
    if (state.score <= 0) {
      if (isCorrect) {
        end(); // No delay for correct
      } else {
        setTimeout(end, FEEDBACK_DELAY);
      }
    } else {
      if (isCorrect) {
        displayQ(); // No delay for correct
      } else {
        setTimeout(displayQ, FEEDBACK_DELAY);
      }
    }
  }
}

function start() {
  const lvl = el.lvl.value;
  if (!currentLang) { alert('Language not loaded'); return; }
  if (!lvl) { alert('Please select a level'); return; }
  state = { score:0, streak:0, qAnswered:0, level: lvl, language: state.language, q: null, currentReplyIndex: 0, done: false };
  el.score.textContent = 0;
  el.streak.textContent = 0;
  updateLevelIndicator();
  show(el.game);
  // Start stats session
  if (window.statsModule) {
    window.statsModule.startSession();
  }
  var promise = currentLang.loadAll || function() { return Promise.resolve(); };
  promise.call(currentLang).then(function() {
    displayQ();
  });
}

function end() {
  const hs = getHs();
  const newHs = state.score > hs;
  if (newHs) setHs(state.score);
  el.finS.textContent = state.score;
  el.finQ.textContent = state.qAnswered;
  el.newHs.className = newHs ? 'new-high' : 'hidden new-high';
  // End stats session
  if (window.statsModule) {
    window.statsModule.endSession();
  }
  show(el.over);
}

let statsOpenedFromGame = false;

function showStatsScreen() {
  statsOpenedFromGame = !el.game.classList.contains('hidden');
  show(el.statsScreen);
  const stats = window.statsModule.getStats();

  // Overall stats
  el.statsSessions.textContent = stats.sessionsPlayed;
  el.statsTotalTime.textContent = window.statsModule.formatTime(stats.totalTimePlayed);
  el.statsLastPlayed.textContent = stats.lastPlayed ?
    new Date(stats.lastPlayed).toLocaleDateString() : 'Never';

  // Language stats
  let langHtml = '';
  const langCodes = Object.keys(stats.byLanguage);
  if (langCodes.length === 0) {
    langHtml = '<p class="no-stats">No statistics yet. Play a game to start tracking!</p>';
  } else {
    langCodes.forEach(code => {
      const langStats = stats.byLanguage[code];
      const langData = availableLanguages.find(l => l.code === code);
      const langName = langData ? langData.meta.name : code;
      const langSymbol = langData ? langData.meta.symbol : code;
      const accuracy = window.statsModule.getAccuracy(langStats.correctAnswers, langStats.totalQuestions);
      const accuracyClass = accuracy >= 80 ? 'accuracy-high' : accuracy >= 60 ? 'accuracy-medium' : 'accuracy-low';

      langHtml += '<div class="language-stat-block">';
      langHtml += '<div class="language-stat-header">';
      langHtml += '<span>' + langSymbol + ' ' + langName + '</span>';
      langHtml += '<span class="' + accuracyClass + '">' + accuracy + '% accuracy</span>';
      langHtml += '</div>';

      langHtml += '<div class="stat-row"><span class="label">Total Score</span><span class="value">' + langStats.totalScore + '</span></div>';
      langHtml += '<div class="stat-row"><span class="label">Highest Streak</span><span class="value">' + langStats.highestStreak + '</span></div>';
      langHtml += '<div class="stat-row"><span class="label">Questions</span><span class="value">' + langStats.totalQuestions + '</span></div>';
      langHtml += '<div class="stat-row"><span class="label">Correct</span><span class="value">' + langStats.correctAnswers + '</span></div>';

      // Per-level stats
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      levels.forEach(level => {
        if (langStats.byLevel[level]) {
          const lvlStats = langStats.byLevel[level];
          const lvlAccuracy = window.statsModule.getAccuracy(lvlStats.correct, lvlStats.questions);
          langHtml += '<div class="stat-row"><span class="label">  ' + level + '</span><span class="value">' + lvlStats.questions + ' q (' + lvlAccuracy + '%)</span></div>';
        }
      });

      langHtml += '</div>';
    });
  }

  el.langStatsContent.innerHTML = langHtml;
}

function init() {
  el.hsVal.textContent = getHs();
  loadAvailableLanguages().then(langs => {
    if (langs.length === 0) {
      console.error('No language packs found');
      return;
    }
    populateLanguageSelect();
    const savedLang = state.language;
    const langToLoad = langs.find(l => l.code === savedLang) ? savedLang : langs[0].code;
    loadLanguageModule(langToLoad).then(module => {
      currentLang = module;
      state.language = langToLoad;
      el.langSelect.value = langToLoad;
      updateFlag();
      updateLevelIndicator();
      // Use availableLanguages for levels with labels (from language-pack.json)
      const langData = availableLanguages.find(l => l.code === langToLoad);
      if (langData && langData.meta && langData.meta.levels) {
        populateLevelSelect(langData.meta.levels);
      }
      // Event listeners for language UI
      el.langSelect.addEventListener('change', (e) => {
        selectLanguage(e.target.value);
      });
      if (el.langFlagBtn) {
        el.langFlagBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (el.langDropdown) {
            el.langDropdown.classList.toggle('hidden');
            if (!el.langDropdown.classList.contains('hidden')) {
              el.langDropdown.innerHTML = availableLanguages.map(({ code, meta }) =>
                `<div class="language-option" data-lang="${code}">
                  <span>${meta.symbol || code}</span>
                  <span>${meta.name || code}</span>
                </div>`
              ).join('');
              el.langDropdown.querySelectorAll('.language-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                  const code = e.currentTarget.dataset.lang;
                  if (code) selectLanguage(code);
                });
              });
            }
          }
        });
      }
      document.addEventListener('click', (e) => {
        if (el.langDropdown && !el.langDropdown.contains(e.target) && e.target !== el.langFlagBtn) {
          el.langDropdown.classList.add('hidden');
        }
        if (el.levelDropdown && !el.levelDropdown.contains(e.target) && e.target !== el.levelIndicatorBtn) {
          el.levelDropdown.classList.add('hidden');
        }
      });
      // Event listeners for level indicator
      if (el.levelIndicatorBtn) {
        el.levelIndicatorBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (el.levelDropdown) {
            el.levelDropdown.classList.toggle('hidden');
            if (!el.levelDropdown.classList.contains('hidden') && currentLang && currentLang.meta && currentLang.meta.levels) {
              const levels = currentLang.meta.levels;
              const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
              const available = levelOrder.filter(l => levels[l]);
              el.levelDropdown.innerHTML = available.map(l =>
                `<div class="level-option" data-level="${l}">
                  <span>${l}</span>
                  <span>${levels[l].label}</span>
                </div>`
              ).join('');
              el.levelDropdown.querySelectorAll('.level-option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                  const level = e.currentTarget.dataset.level;
                  if (level) selectLevel(level);
                });
              });
            }
          }
        });
      }
      // Event listeners for category toggles
      const categoryLevels = el.catBar.querySelectorAll('.category-level');
      categoryLevels.forEach(lvl => {
        lvl.addEventListener('click', (e) => {
          const target = e.currentTarget;
          const isLocked = target.classList.contains('locked');
          // Mutual exclusion: unlock all first
          categoryLevels.forEach(l => l.classList.remove('locked'));
          if (!isLocked) {
            // Lock this category
            target.classList.add('locked');
            const level = target.classList.contains('l1') ? 'l1' :
                            target.classList.contains('l2') ? 'l2' :
                            target.classList.contains('l3') ? 'l3' : null;
            // Store both level and current value
            state.categoryLock = {
              level: level,
              value: target.textContent.trim()
            };
          } else {
            // Unlock
            state.categoryLock = null;
          }
        });
      });
    }).catch(err => {
      console.error('Failed to load initial language:', err);
    });
  }).catch(err => {
    console.error('Failed to load available languages:', err);
  });

  // Statistics screen event listeners
  if (el.statsBtn) {
    el.statsBtn.addEventListener('click', showStatsScreen);
  }
  if (el.gameScoreBtn) {
    el.gameScoreBtn.addEventListener('click', showStatsScreen);
  }
  if (el.gameStreakBtn) {
    el.gameStreakBtn.addEventListener('click', showStatsScreen);
  }
  if (el.statsHeaderBtn) {
    el.statsHeaderBtn.addEventListener('click', () => {
      if (statsOpenedFromGame) {
        show(el.game);
      } else {
        show(el.start);
      }
    });
  }
  if (el.statsResetBtn) {
    el.statsResetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        window.statsModule.resetStats();
        showStatsScreen(); // Refresh display
      }
    });
  }

  el.startBtn.addEventListener('click', start);
  el.quit.addEventListener('click', end);
  el.again.addEventListener('click', start);
  el.home.addEventListener('click', () => { el.hsVal.textContent = getHs(); show(el.start); });
  el.btns.querySelectorAll('.answer-btn').forEach(b => {
    b.addEventListener('click', () => handle(parseInt(b.dataset.index)));
  });
  show(el.start);
}

document.addEventListener('DOMContentLoaded', init);
