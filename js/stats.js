export const STATS_STORAGE_KEY = "verkeersquiz_stats";

/**
 * Build a zeroed statistics record used as the baseline for stored values.
 *
 * @returns {{gamesPlayed: number, questionsAnswered: number, correctAnswers: number,
 *          wrongAnswers: number, totalTimePlayedSeconds: number, lastPlayedAt: string|null,
 *          errorCounts: Record<string, number>, lastQuizWrongIds: Array<string>}} Empty stats.
 */
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

/**
 * Read the play statistics from localStorage, normalizing missing or legacy fields.
 *
 * The older `totalDurationSeconds` field is migrated to `totalTimePlayedSeconds`, and
 * unreadable storage yields empty statistics rather than an error.
 *
 * @returns {Object} Complete statistics record with every field present.
 */
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
    console.warn("Failed to read play statistics from localStorage:", err);
    return emptyStats();
  }
}

/**
 * Persist the statistics record, logging and swallowing storage failures.
 *
 * @param {Object} stats - Complete statistics record to store.
 * @returns {void}
 */
function setStoredStats(stats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn("Failed to save play statistics to localStorage:", err);
  }
}

/**
 * Fold one finished round's answers and duration into the running localStorage-only stats.
 *
 * Counts the round, updates the correct and wrong totals, increments the per-question
 * error counts and replaces the list of ids answered wrong in the last quiz.
 *
 * @param {Array<{id: (string|number|undefined), correct: boolean}>} answers - Answers of the round.
 * @param {number} [durationSeconds=0] - Round duration; non-positive values add no time.
 * @returns {Object} Updated statistics record, unchanged when there were no answers.
 */
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

/**
 * Returns the accumulated total play time in seconds across finished rounds.
 *
 * @returns {number} Total play time in seconds.
 */
export function getTotalTimePlayedSeconds() {
  return getStoredStats().totalTimePlayedSeconds;
}

/**
 * Returns the most frequently wrong-answered question ids, most errors first.
 *
 * @param {number} [limit=10] - Maximum number of entries to return.
 * @returns {Array<{id: string, count: number}>} Question ids with their error counts.
 */
export function getMostUsedErrors(limit = 10) {
  const stats = getStoredStats();
  return Object.entries(stats.errorCounts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Returns every question id that was ever answered wrong, in no particular order.
 *
 * @returns {Array<string>} Question ids with at least one recorded error.
 */
export function getErrorQuestionIds() {
  return Object.keys(getStoredStats().errorCounts);
}

/**
 * True when at least one question has ever been answered wrong.
 *
 * @returns {boolean} Whether any error was ever recorded.
 */
export function hasStoredErrors() {
  return getErrorQuestionIds().length > 0;
}

/**
 * Returns the question ids answered wrong in the most recently finished quiz.
 *
 * @returns {Array<string>} Question ids answered wrong in the last round.
 */
export function getLastQuizWrongIds() {
  return getStoredStats().lastQuizWrongIds;
}

/**
 * Remove all stored play statistics.
 *
 * @returns {void}
 */
export function resetStats() {
  try {
    localStorage.removeItem(STATS_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear play statistics from localStorage:", err);
  }
}
