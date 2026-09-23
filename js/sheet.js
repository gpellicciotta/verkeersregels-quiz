import { CONFIG } from "./config.js";
import { state } from "./state.js";
import { formatDuration } from "./utils.js";

/**
 * Post one finished round's score to the configured Google Sheet web app.
 *
 * Silently does nothing when no web app URL or player name is configured, and
 * swallows network errors so a failed upload never interrupts the quiz.
 *
 * @param {number} correct - Number of correctly answered questions.
 * @param {number} total - Number of questions in the round.
 * @param {number} pct - Score as a percentage.
 * @param {number} [durationSeconds] - Round duration in seconds; defaults to the state value.
 * @param {string} [formattedDuration] - Pre-formatted duration label; derived when omitted.
 * @returns {Promise<void>} Resolves once the upload attempt has finished.
 */
export async function submitToSheet(correct, total, pct, durationSeconds, formattedDuration) {
  if (!CONFIG.SHEET_WEBAPP_URL) return;
  if (!state.playerName) return;
  const duur = durationSeconds !== undefined ? durationSeconds : state.durationSeconds;
  const duurTekst = formattedDuration || formatDuration(duur);
  try {
    await fetch(CONFIG.SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        naam: state.playerName,
        score: correct,
        totaal: total,
        percentage: pct,
        duur: duur,
        duur_tekst: duurTekst,
        datum: new Date().toISOString(),
        sleutel: CONFIG.SHEET_SECRET,
      }),
    });
  } catch (err) {
    console.warn("Kon score niet naar Google Sheet sturen:", err);
  }
}
