import { CONFIG } from "./config.js";
import { state } from "./state.js";
import { formatDuration } from "./utils.js";

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
