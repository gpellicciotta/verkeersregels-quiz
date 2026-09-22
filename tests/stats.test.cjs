/** Execute the localStorage-only play-stats logic in Node against a fake localStorage. */
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { test } = require("node:test");

function makeLocalStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
}

const statsUrl = pathToFileURL(path.join(__dirname, "../js/stats.js")).href;

test("recordQuizResult accumulates games, answers, and per-question error counts", async () => {
  globalThis.localStorage = makeLocalStorage();
  const { recordQuizResult, getStoredStats, getMostUsedErrors, resetStats } = await import(statsUrl);
  resetStats();

  recordQuizResult([
    { id: "q1", correct: true },
    { id: "q2", correct: false },
  ]);
  recordQuizResult([
    { id: "q2", correct: false },
    { id: "q3", correct: false },
  ]);

  const stats = getStoredStats();
  assert.equal(stats.gamesPlayed, 2);
  assert.equal(stats.questionsAnswered, 4);
  assert.equal(stats.correctAnswers, 1);
  assert.equal(stats.wrongAnswers, 3);
  assert.equal(stats.errorCounts.q2, 2);
  assert.equal(stats.errorCounts.q3, 1);
  assert.ok(stats.lastPlayedAt);

  assert.deepEqual(getMostUsedErrors(1), [{ id: "q2", count: 2 }]);
});

test("recordQuizResult ignores empty rounds and getStoredStats survives corrupt storage", async () => {
  globalThis.localStorage = makeLocalStorage();
  const { recordQuizResult, getStoredStats, resetStats } = await import(statsUrl);
  resetStats();

  recordQuizResult([]);
  assert.equal(getStoredStats().gamesPlayed, 0);

  globalThis.localStorage.setItem("verkeersquiz_stats", "{not json");
  const stats = getStoredStats();
  assert.equal(stats.gamesPlayed, 0);
  assert.deepEqual(stats.errorCounts, {});
});

test("resetStats clears accumulated stats back to zero", async () => {
  globalThis.localStorage = makeLocalStorage();
  const { recordQuizResult, getStoredStats, resetStats } = await import(statsUrl);

  recordQuizResult([{ id: "q1", correct: false }]);
  assert.equal(getStoredStats().gamesPlayed, 1);

  resetStats();
  assert.equal(getStoredStats().gamesPlayed, 0);
});

test("getErrorQuestionIds/hasStoredErrors/getLastQuizWrongIds track error-review helpers", async () => {
  globalThis.localStorage = makeLocalStorage();
  const {
    recordQuizResult,
    getErrorQuestionIds,
    hasStoredErrors,
    getLastQuizWrongIds,
    resetStats,
  } = await import(statsUrl);
  resetStats();

  assert.equal(hasStoredErrors(), false);
  assert.deepEqual(getErrorQuestionIds(), []);
  assert.deepEqual(getLastQuizWrongIds(), []);

  recordQuizResult([
    { id: "q1", correct: true },
    { id: "q2", correct: false },
  ]);
  assert.equal(hasStoredErrors(), true);
  assert.deepEqual(getErrorQuestionIds(), ["q2"]);
  assert.deepEqual(getLastQuizWrongIds(), ["q2"]);

  recordQuizResult([
    { id: "q3", correct: false },
    { id: "q4", correct: true },
  ]);
  assert.deepEqual(getErrorQuestionIds().sort(), ["q2", "q3"]);
  assert.deepEqual(getLastQuizWrongIds(), ["q3"], "lastQuizWrongIds reflects only the most recent round");

  recordQuizResult([{ id: "q5", correct: true }]);
  assert.deepEqual(getLastQuizWrongIds(), [], "a fully correct round clears lastQuizWrongIds");
});
