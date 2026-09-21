import { el } from "./dom.js";
import { state } from "./state.js";
import { submitErrorReport } from "./report-queue.js";

export function openReportModal() {
  const q = state.round[state.currentIndex];
  if (!q) return;

  el.modalQuestionId.textContent = q.id ? `Vraag ${q.id}` : `Vraag ${state.currentIndex + 1}`;
  el.modalQuestionText.textContent = q.question;
  el.reportRemark.value = "";
  el.modalFeedback.textContent = "";
  el.modalFeedback.className = "modal-feedback hidden";
  el.btnModalSubmit.disabled = false;

  if (el.modalReportDesc) {
    if (!navigator.onLine) {
      el.modalReportDesc.textContent = "Je bent momenteel offline. Je melding wordt lokaal bewaard en automatisch verzonden zodra je weer online bent.";
    } else {
      el.modalReportDesc.textContent = "Zie je een onjuistheid of onduidelijkheid in deze vraag of antwoorden? Geef het hier door.";
    }
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
