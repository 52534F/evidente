/**
 * Statistics Module for GrammaDrill
 * Tracks and persists user statistics in localStorage
 */

const STATS_KEY = 'grammadrill_stats';

function getDefaultStats() {
  return {
    sessionsPlayed: 0,
    totalTimePlayed: 0,
    lastPlayed: null,
    sessionStartTime: null,
    byLanguage: {}
  };
}

function getStats() {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return getDefaultStats();
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

function initLanguageStats(stats, langCode) {
  if (!stats.byLanguage[langCode]) {
    stats.byLanguage[langCode] = {
      totalScore: 0,
      highestStreak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      byLevel: {},
      byCategory: {}
    };
  }
  return stats.byLanguage[langCode];
}

function initLevelStats(langStats, level) {
  if (!langStats.byLevel[level]) {
    langStats.byLevel[level] = {
      questions: 0,
      correct: 0,
      score: 0
    };
  }
  return langStats.byLevel[level];
}

function initCategoryStats(langStats, category) {
  if (!langStats.byCategory[category]) {
    langStats.byCategory[category] = {
      questions: 0,
      correct: 0
    };
  }
  return langStats.byCategory[category];
}

function startSession() {
  const stats = getStats();
  stats.sessionStartTime = Date.now();
  saveStats(stats);
}

function endSession() {
  const stats = getStats();
  if (stats.sessionStartTime) {
    const duration = Date.now() - stats.sessionStartTime;
    stats.totalTimePlayed += duration;
    stats.sessionsPlayed++;
    stats.lastPlayed = new Date().toISOString();
    stats.sessionStartTime = null;
  }
  saveStats(stats);
}

function recordAnswer(langCode, level, category, isCorrect, score, streak) {
  const stats = getStats();
  const langStats = initLanguageStats(stats, langCode);

  // Update language totals
  langStats.totalQuestions++;
  langStats.totalScore = score;
  if (streak > langStats.highestStreak) {
    langStats.highestStreak = streak;
  }
  if (isCorrect) {
    langStats.correctAnswers++;
  }

  // Update level stats
  const levelStats = initLevelStats(langStats, level);
  levelStats.questions++;
  if (isCorrect) levelStats.correct++;
  levelStats.score = score;

  // Update category stats
  if (category) {
    const categories = [category.l1, category.l2, category.l3].filter(Boolean);
    categories.forEach(cat => {
      const catStats = initCategoryStats(langStats, cat);
      catStats.questions++;
      if (isCorrect) catStats.correct++;
    });
  }

  stats.lastPlayed = new Date().toISOString();
  saveStats(stats);
}

function getAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function resetStats() {
  localStorage.removeItem(STATS_KEY);
}

// Export for use in app.js
window.statsModule = {
  getStats,
  saveStats,
  startSession,
  endSession,
  recordAnswer,
  getAccuracy,
  formatTime,
  resetStats
};
