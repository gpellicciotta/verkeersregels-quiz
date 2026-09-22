export const STATS_STORAGE_KEY = "verkeersquiz_stats";

function emptyStats() {
  return {
    gamesPlayed: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    lastPlayedAt: null,
    errorCounts: {},
  };
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw);
    return {
      ...emptyStats(),
      ...parsed,
      errorCounts: (parsed && parsed.errorCounts) || {},
    };
  } catch (err) {
    console.warn("Kon speelstatistieken niet lezen uit localStorage:", err);
    return emptyStats();
  }
}

function setStoredStats(stats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn("Kon speelstatistieken niet opslaan in localStorage:", err);
  }
}

/** Fold one finished round's answers into the running localStorage-only stats. */
export function recordQuizResult(answers) {
  const stats = getStoredStats();
  if (!Array.isArray(answers) || answers.length === 0) return stats;

  stats.gamesPlayed += 1;
  stats.questionsAnswered += answers.length;
  stats.lastPlayedAt = new Date().toISOString();

  answers.forEach((answer) => {
    if (answer.correct) {
      stats.correctAnswers += 1;
      return;
    }
    stats.wrongAnswers += 1;
    if (answer.id === undefined || answer.id === null) return;
    const key = String(answer.id);
    stats.errorCounts[key] = (stats.errorCounts[key] || 0) + 1;
  });

  setStoredStats(stats);
  return stats;
}

/** Returns the most frequently wrong-answered question ids, most errors first. */
export function getMostUsedErrors(limit = 10) {
  const stats = getStoredStats();
  return Object.entries(stats.errorCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function resetStats() {
  try {
    localStorage.removeItem(STATS_STORAGE_KEY);
  } catch (err) {
    console.warn("Kon speelstatistieken niet wissen uit localStorage:", err);
  }
}
