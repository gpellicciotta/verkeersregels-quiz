export const STATS_STORAGE_KEY = "verkeersquiz_stats";

function emptyStats() {
  return {
    gamesPlayed: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalTimePlayedSeconds: 0,
    lastPlayedAt: null,
    errorCounts: {},
    lastQuizWrongIds: [],
  };
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw);
    const totalTime =
      typeof parsed?.totalTimePlayedSeconds === "number" && Number.isFinite(parsed.totalTimePlayedSeconds)
        ? Math.max(0, Math.round(parsed.totalTimePlayedSeconds))
        : typeof parsed?.totalDurationSeconds === "number" && Number.isFinite(parsed.totalDurationSeconds)
        ? Math.max(0, Math.round(parsed.totalDurationSeconds))
        : 0;

    return {
      ...emptyStats(),
      ...parsed,
      totalTimePlayedSeconds: totalTime,
      errorCounts: (parsed && parsed.errorCounts) || {},
      lastQuizWrongIds: Array.isArray(parsed && parsed.lastQuizWrongIds) ? parsed.lastQuizWrongIds : [],
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

/** Fold one finished round's answers and duration into the running localStorage-only stats. */
export function recordQuizResult(answers, durationSeconds = 0) {
  const stats = getStoredStats();
  if (!Array.isArray(answers) || answers.length === 0) return stats;

  const validDuration =
    typeof durationSeconds === "number" && Number.isFinite(durationSeconds) && durationSeconds > 0
      ? Math.round(durationSeconds)
      : 0;

  stats.gamesPlayed += 1;
  stats.questionsAnswered += answers.length;
  stats.totalTimePlayedSeconds = (stats.totalTimePlayedSeconds || 0) + validDuration;
  stats.lastPlayedAt = new Date().toISOString();

  const wrongIds = [];
  answers.forEach((answer) => {
    if (answer.correct) {
      stats.correctAnswers += 1;
      return;
    }
    stats.wrongAnswers += 1;
    if (answer.id === undefined || answer.id === null) return;
    const key = String(answer.id);
    stats.errorCounts[key] = (stats.errorCounts[key] || 0) + 1;
    wrongIds.push(key);
  });
  stats.lastQuizWrongIds = wrongIds;

  setStoredStats(stats);
  return stats;
}

/** Returns the accumulated total play time in seconds across finished rounds. */
export function getTotalTimePlayedSeconds() {
  return getStoredStats().totalTimePlayedSeconds;
}

/** Returns the most frequently wrong-answered question ids, most errors first. */
export function getMostUsedErrors(limit = 10) {
  const stats = getStoredStats();
  return Object.entries(stats.errorCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Returns every question id that was ever answered wrong, in no particular order. */
export function getErrorQuestionIds() {
  return Object.keys(getStoredStats().errorCounts);
}

/** True when at least one question has ever been answered wrong. */
export function hasStoredErrors() {
  return getErrorQuestionIds().length > 0;
}

/** Returns the question ids answered wrong in the most recently finished quiz. */
export function getLastQuizWrongIds() {
  return getStoredStats().lastQuizWrongIds;
}

export function resetStats() {
  try {
    localStorage.removeItem(STATS_STORAGE_KEY);
  } catch (err) {
    console.warn("Kon speelstatistieken niet wissen uit localStorage:", err);
  }
}
