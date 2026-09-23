import { CONFIG } from "./config.js";
import { state } from "./state.js";

const REPORT_QUEUE_KEY = "verkeersquiz_pending_reports";
const MAX_QUEUED_REPORTS = 50;

/**
 * Read the locally queued error reports from localStorage.
 *
 * @returns {Array<{id: string, enqueuedAt: string, payload: Object}>} Queued reports,
 *          or an empty array when nothing is stored or the value cannot be parsed.
 */
export function getPendingReports() {
  try {
    const raw = localStorage.getItem(REPORT_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to read report queue from localStorage:", err);
    return [];
  }
}

/**
 * Persist the report queue, dropping the oldest entries when storage is full.
 *
 * The array is trimmed to the maximum queue length and then shrunk further while
 * localStorage keeps rejecting the write.
 *
 * @param {Array<Object>} reports - Queue to store; mutated in place while trimming.
 * @returns {boolean} True when the queue was stored, false when nothing could be kept.
 */
export function savePendingReports(reports) {
  while (reports.length > MAX_QUEUED_REPORTS) {
    reports.shift();
  }
  while (reports.length > 0) {
    try {
      localStorage.setItem(REPORT_QUEUE_KEY, JSON.stringify(reports));
      return true;
    } catch (err) {
      console.warn("LocalStorage full, dropped oldest error report:", err);
      reports.shift();
    }
  }
  try {
    localStorage.removeItem(REPORT_QUEUE_KEY);
  } catch (e) {}
  return false;
}

/**
 * Append one report payload to the local queue for later delivery.
 *
 * @param {Object} payloadObj - Form fields to post once a connection is available.
 * @returns {void}
 */
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

/**
 * Send the queued reports one by one while the connection holds.
 *
 * Does nothing when a drain is already running, when offline or when no web app
 * URL is configured. Sending stops at the first failure so the remaining reports
 * stay queued, and successfully sent entries are removed right away.
 *
 * @returns {Promise<void>} Resolves once the queue is empty or draining stopped.
 */
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
        console.warn("Sending queued error report interrupted:", err);
        break;
      }
    }
  } finally {
    isDrainingQueue = false;
  }
}

/**
 * Submit one error report, falling back to the local queue when it cannot be sent.
 *
 * @param {{id: string, text: string}} context - Reported item as resolved by the report modal.
 * @param {string} remark - Free-text remark entered by the user.
 * @param {boolean} [includeContext=true] - When false, the question id and text are omitted.
 * @returns {Promise<void>} Resolves once the report was sent or queued.
 */
export function submitErrorReport(context, remark, includeContext = true) {
  if (!CONFIG.SHEET_WEBAPP_URL || !context) return Promise.resolve();

  const payloadData = {
    actie: "report_error",
    sleutel: CONFIG.SHEET_SECRET,
    datum: new Date().toISOString(),
    vraagId: includeContext ? context.id || "" : "",
    vraag: includeContext ? context.text || "" : "",
    naam: state.playerName || "Anoniem",
    opmerking: remark || "",
  };

  if (!navigator.onLine) {
    enqueueReport(payloadData);
    console.info("Offline: error report saved to local queue.");
    return Promise.resolve();
  }

  const payload = new URLSearchParams(payloadData);
  return fetch(CONFIG.SHEET_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  }).catch((err) => {
    console.warn("Sending failed; error report saved to local queue:", err);
    enqueueReport(payloadData);
  });
}
