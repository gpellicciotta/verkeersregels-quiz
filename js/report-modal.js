import { el } from "./dom.js";
import { state } from "./state.js";
import { submitErrorReport } from "./report-queue.js";
import { t } from "./i18n.js";

export function openReportModal() {
  const q = state.round[state.currentIndex];
  if (!q) return;

  const id = q.id || String(state.currentIndex + 1);
  el.modalQuestionId.textContent = t("report.question_prefix", { id });
  el.modalQuestionText.textContent = q.question;
  el.reportRemark.value = "";
  el.modalFeedback.textContent = "";
  el.modalFeedback.className = "modal-feedback hidden";
  el.btnModalSubmit.disabled = false;

  if (el.modalReportDesc) {
    el.modalReportDesc.textContent = !navigator.onLine
      ? t("report.description_offline")
      : t("report.description");
  }

  el.modalReport.classList.remove("hidden");
  el.reportRemark.focus();
}

export function closeReportModal() {
  if (!el.modalReport) return;
  el.modalReport.classList.add("hidden");
  el.modalFeedback.textContent = "";
  el.modalFeedback.className = "modal-feedback hidden";
}

export function handleReportSubmit(e) {
  e.preventDefault();
  const q = state.round[state.currentIndex];
  if (!q) return;

  const remark = el.reportRemark.value.trim();

  // Instant dismissal with zero lag
  closeReportModal();

  // Asynchronous background transmission or local enqueue
  submitErrorReport(q, remark);
}
