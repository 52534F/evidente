const STORAGE_KEY = 'grammadrill_highscore';
const FEEDBACK_DELAY = 1500;

const languages = { it };

let currentLang = null;
let state = { score: 0, streak: 0, qAnswered: 0, level: 'A1', q: null, done: false };

const el = {
  start: document.getElementById('start-screen'),
  game: document.getElementById('game-screen'),
  over: document.getElementById('gameover-screen'),
  hsVal: document.getElementById('high-score-value'),
  lvl: document.getElementById('level-select'),
  startBtn: document.getElementById('start-btn'),
  score: document.getElementById('game-score'),
  streak: document.getElementById('game-streak'),
  prompt: document.getElementById('question-prompt'),
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
  syntaxBlocks: document.getElementById('syntax-blocks')
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

function displayQ() {
  const q = currentLang.generateQuestion(state.level);
  if (!q) { alert('No questions'); end(); return; }
  state.q = q; state.done = false;

  // Render category bar
  if (q.category) {
    el.catBar.classList.remove('hidden');
    el.catBar.querySelector('.l1').textContent = q.category.l1;
    el.catBar.querySelector('.l2').textContent = q.category.l2;
    el.catBar.querySelector('.l3').textContent = q.category.l3;
  } else {
    el.catBar.classList.add('hidden');
  }

  // Render syntax blocks
  if (q.syntaxBlocks && q.syntaxBlocks.length > 0) {
    el.syntaxBlocks.classList.remove('hidden');
    el.syntaxBlocks.innerHTML = q.syntaxBlocks.map(block => {
      const details = [];
      if (block.case) details.push(block.case);
      if (block.gender) details.push(block.gender === 'm' ? 'm' : 'f');
      
      let conjugationHtml = '';
      if (block.conjugation) {
        const c = block.conjugation;
        conjugationHtml = `<div class="conjugation">${c.persona || ''} ${c.tempo || ''} ${c.modo || ''}</div>`;
      }

      return `
        <div class="syntax-block" data-role="${block.role || 'Parola'}">
          <span class="word">${block.text || '·'}</span>
          <span class="role">${block.role || 'Parola'}</span>
          ${details.length > 0 ? `<span class="details">${details.join(' · ')}</span>` : ''}
          ${conjugationHtml}
        </div>
      `;
    }).join('');
  } else {
    el.syntaxBlocks.classList.add('hidden');
  }

  el.prompt.textContent = q.prompt;
  const btns = el.btns.querySelectorAll('.answer-btn');
  const sc = shuffle(q.choices.map((t, i) => ({ text: t, originalIndex: i })));
  btns.forEach((b, i) => {
    b.textContent = sc[i].text;
    b.dataset.choiceIndex = sc[i].originalIndex;
    b.className = 'answer-btn';
    b.disabled = false;
  });
  el.fb.classList.add('hidden');
}

function handle(idx) {
  if (state.done) return;
  state.done = true; state.qAnswered++;
  const q = state.q;
  const btns = el.btns.querySelectorAll('.answer-btn');
  const correctIndex = parseInt(q.correctIndex);
  let isCorrect = false;
  btns.forEach(b => {
    b.disabled = true;
    if (parseInt(b.dataset.choiceIndex) === correctIndex) {
      b.classList.add('correct-answer');
    }
  });
  btns.forEach(b => {
    if (parseInt(b.dataset.index) === idx && parseInt(b.dataset.choiceIndex) === correctIndex) {
      isCorrect = true;
    }
  });
  if (isCorrect) {
    state.score++;
    state.streak++;
    el.fbRes.textContent = 'Correct!';
    el.fbRes.className = 'correct';
    el.fb.className = 'feedback correct';
  } else {
    state.score--;
    state.streak = 0;
    el.fbRes.textContent = 'Wrong!';
    el.fbRes.className = 'wrong';
    el.fb.className = 'feedback wrong';
  }
  el.fbExp.textContent = q.explanation;
  el.fb.classList.remove('hidden');
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;
  if (state.score <= 0) setTimeout(end, FEEDBACK_DELAY);
  else setTimeout(displayQ, FEEDBACK_DELAY);
}

function start() {
  currentLang = languages.it;
  const lvl = el.lvl.value;
  if (!currentLang.meta.levels.includes(lvl)) { alert('Level not available'); return; }
  state = { score: 0, streak: 0, qAnswered: 0, level: lvl, q: null, done: false };
  el.score.textContent = 0;
  el.streak.textContent = 0;
  show(el.game);
  displayQ();
}

function end() {
  const hs = getHs();
  const newHs = state.score > hs;
  if (newHs) setHs(state.score);
  el.finS.textContent = state.score;
  el.finQ.textContent = state.qAnswered;
  el.newHs.className = newHs ? 'new-high' : 'hidden new-high';
  show(el.over);
}

function init() {
  el.hsVal.textContent = getHs();
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