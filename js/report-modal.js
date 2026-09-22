import { el } from "./dom.js";
import { state, carouselState } from "./state.js";
import { submitErrorReport } from "./report-queue.js";
import { t } from "./i18n.js";

// The report button is reachable from every screen and the settings modal; this
// resolves what "context" means at the moment it was pressed. Priority matches
// visual stacking: an open settings modal sits on top of whatever screen is behind it.
function getReportContext() {
  if (el.modalConfig && !el.modalConfig.classList.contains("hidden")) {
    return { id: "", text: t("report.view_config") };
  }
  if (el.screenCarousel && !el.screenCarousel.classList.contains("hidden")) {
    const item = carouselState.items[carouselState.currentIndex];
    if (item) {
      const id = item.id || "";
      const text = item.signTitle || item.question || "";
      return { id, text };
    }
    return { id: "", text: t("report.view_carousel") };
  }
  if (el.screenQuiz && !el.screenQuiz.classList.contains("hidden")) {
    const q = state.round[state.currentIndex];
    if (q) {
      return { id: q.id || String(state.currentIndex + 1), text: q.question };
    }
    return { id: "", text: t("report.view_quiz") };
  }
  if (el.screenResult && !el.screenResult.classList.contains("hidden")) {
    return { id: "", text: t("report.view_result") };
  }
  if (el.screenAbout && !el.screenAbout.classList.contains("hidden")) {
    return { id: "", text: t("report.view_about") };
  }
  return { id: "", text: t("report.view_start") };
}

// Captured when the modal opens so submission uses the context of the screen the
// user actually pressed the button on, even if app state changes before they submit.
let currentReportContext = null;

export function openReportModal() {
  const context = getReportContext();
  currentReportContext = context;

  if (context.id) {
    el.modalQuestionId.textContent = t("report.question_prefix", { id: context.id });
    el.modalQuestionId.classList.remove("hidden");
  } else {
    el.modalQuestionId.textContent = "";
    el.modalQuestionId.classList.add("hidden");
  }
  el.modalQuestionText.textContent = context.text;
  el.reportRemark.value = "";
  el.reportIncludeContext.checked = true;
  el.modalQuestionSummary.classList.remove("hidden");
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

export function toggleReportContextVisibility() {
  el.modalQuestionSummary.classList.toggle("hidden", !el.reportIncludeContext.checked);
}

export function closeReportModal() {
  if (!el.modalReport) return;
  el.modalReport.classList.add("hidden");
  el.modalFeedback.textContent = "";
  el.modalFeedback.className = "modal-feedback hidden";
}

export function handleReportSubmit(e) {
  e.preventDefault();
  const context = currentReportContext;
  if (!context) return;

  const remark = el.reportRemark.value.trim();
  const includeContext = el.reportIncludeContext.checked;

  // Instant dismissal with zero lag
  closeReportModal();

  // Asynchronous background transmission or local enqueue
  submitErrorReport(context, remark, includeContext);
}
