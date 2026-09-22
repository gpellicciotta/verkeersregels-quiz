import { CONFIG } from "./config.js";
import { state } from "./state.js";

const REPORT_QUEUE_KEY = "verkeersquiz_pending_reports";
const MAX_QUEUED_REPORTS = 50;

export function getPendingReports() {
  try {
    const raw = localStorage.getItem(REPORT_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Kon foutmeldingswachtrij niet lezen uit localStorage:", err);
    return [];
  }
}

export function savePendingReports(reports) {
  while (reports.length > MAX_QUEUED_REPORTS) {
    reports.shift();
  }
  while (reports.length > 0) {
    try {
      localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(reports));
      return true;
    } catch (err) {
      console.warn("LocalStorage vol, oudste foutmelding verwijderd:", err);
      reports.shift();
    }
  }
  try {
    localStorage.removeItem(REPORT_QUEUE_KEY);
  } catch (e) {}
  return false;
}

export function enqueueReport(payloadObj) {
  const reports = getPendingReports();
  reports.push({
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    enqueuedAt: new Date().toISOString(),
    payload: payloadObj,
  });
  savePendingReports(reports);
}

let isDrainingQueue = false;

export async function drainReportQueue() {
  if (isDrainingQueue || !navigator.onLine || !CONFIG.SHEET_WEBAPP_URL) return;
  const reports = getPendingReports();
  if (reports.length === 0) return;

  isDrainingQueue = true;
  try {
    while (reports.length > 0 && navigator.onLine) {
      const item = reports[0];
      try {
        await fetch(CONFIG.SHEET_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(item.payload),
        });
        reports.shift();
        savePendingReports(reports);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.warn("Verzenden van foutmelding uit wachtrij onderbroken:", err);
        break;
      }
    }
  } finally {
    isDrainingQueue = false;
  }
}

export function submitErrorReport(targetQuestion, remark, includeContext = true) {
  if (!CONFIG.SHEET_WEBAPP_URL || !targetQuestion) return Promise.resolve();

  const payloadData = {
    actie: "report_error",
    sleutel: CONFIG.SHEET_SECRET,
    datum: new Date().toISOString(),
    vraagId: includeContext ? targetQuestion.id || "" : "",
    vraag: includeContext ? targetQuestion.question || "" : "",
    naam: state.playerName || "Anoniem",
    opmerking: remark || "",
  };

  if (!navigator.onLine) {
    enqueueReport(payloadData);
    console.info("Offline: foutmelding opgeslagen in lokale wachtrij.");
    return Promise.resolve();
  }

  const payload = new URLSearchParams(payloadData);
  return fetch(CONFIG.SHEET_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  }).catch((err) => {
    console.warn("Verzenden mislukt; foutmelding opgeslagen in lokale wachtrij:", err);
    enqueueReport(payloadData);
  });
}
