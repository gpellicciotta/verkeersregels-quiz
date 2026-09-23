/** Confirmation controls for discarding an active quiz round. */
import { el } from "./dom.js";
import { cancelQuiz } from "./quiz.js";

/**
 * Bind the native dialog, which contains focus and makes the quiz inert.
 *
 * Wires the open, continue, close and stop buttons, keeps Tab focus cycling
 * inside the dialog and dismisses it on an outside click.
 *
 * @returns {void}
 */
export function initQuizCancel() {
  const dialog = el.modalQuizCancel;
  /**
   * Close the confirmation dialog without touching the running quiz.
   *
   * @returns {void}
   */
  const dismiss = () => dialog.close();

  el.btnQuizClose.addEventListener("click", () => {
    dialog.showModal();
    el.btnQuizContinue.focus();
  });
  el.btnQuizContinue.addEventListener("click", dismiss);
  el.btnQuizCancelClose.addEventListener("click", dismiss);
  el.btnQuizStop.addEventListener("click", () => {
    dialog.close();
    cancelQuiz();
  });
  // Native dialogs can hand Tab focus to browser chrome after the last control.
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const first = el.btnQuizCancelClose;
    const last = el.btnQuizStop;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
      dismiss();
    }
  });
}
