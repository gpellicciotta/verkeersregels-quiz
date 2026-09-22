import { CONFIG } from "./config.js";
import { el } from "./dom.js";
import { state, allQuestions } from "./state.js";
import { shuffle, getSinceBadge, formatDuration, getSignCode, localizeSourceUrl } from "./utils.js";
import { getNameParam, getQuestionCountOverride, getSinceFilter, getTypeFilter } from "./params.js";
import { setStoredPreferences } from "./preferences.js";
import { showScreen } from "./screens.js";
import { submitToSheet } from "./sheet.js";
import { recordQuizResult } from "./stats.js";
import { setStartMode } from "./ui-mode.js";
import { t, getLang } from "./i18n.js";
import { createIcon } from "./icons.js";

let translationOverlay = {};

async function loadTranslations(lang) {
  if (lang === "nl") { translationOverlay = {}; return; }
  try {
    const res = await fetch(`data/translations.${lang}.json`);
    if (!res.ok) throw new Error("Could not load translations: " + res.status);
    translationOverlay = await res.json();
  } catch (err) {
    console.warn("Translation overlay load failed:", err);
    translationOverlay = {};
  }
}

export function applyTranslation(q) {
  if (!q) return q;
  const overlay = translationOverlay[q.id];
  if (!overlay) return q;
  return {
    ...q,
    question: overlay.question ?? q.question,
    options: overlay.options ?? q.options,
    explanation: overlay.explanation ?? q.explanation,
    signTitle: overlay.signTitle ?? q.signTitle,
    signExplanation: overlay.signExplanation ?? q.signExplanation,
    imageAlt: overlay.imageAlt ?? q.imageAlt,
  };
}

export { loadTranslations };

export async function loadQuestions() {
  const res = await fetch("data/questions.json");
  if (!res.ok) throw new Error("Could not load questions: " + res.status);
  const data = await res.json();
  return data.questions;
}

export function applyFilter() {
  const filterSince = state.configSince !== null && state.configSince !== undefined
    ? state.configSince
    : getSinceFilter();
  const filterType = state.configType !== null && state.configType !== undefined
    ? state.configType
    : getTypeFilter();
  state.filterSince = filterSince;
  state.filterType = filterType;

  let pool = allQuestions.slice();

  if (filterSince !== null) {
    if (state.configSince !== null && state.configSince !== undefined) {
      pool = pool.filter(
        (q) => typeof q.since === "number" && q.since > filterSince
      );
    } else {
      pool = pool.filter(
        (q) => typeof q.since === "number" && q.since >= filterSince
      );
    }
  }

  if (filterType !== null) {
    if (filterType === "sign") {
      pool = pool.filter((q) => q.type === "recognize" || q.type === "identify");
    } else {
      pool = pool.filter((q) => q.type === filterType);
    }
  }

  state.pool = pool;
  updateStartScreenNotice();
}

export function getEffectiveQuestionCount() {
  let desired;
  if (state.configCount === "all") {
    desired = state.pool ? state.pool.length : allQuestions.length;
  } else if (typeof state.configCount === "number" && state.configCount > 0) {
    desired = state.configCount;
  } else {
    desired = getQuestionCountOverride() || CONFIG.QUESTIONS_PER_ROUND;
  }
  const available = state.pool ? state.pool.length : allQuestions.length;
  return Math.min(desired, available);
}

export function updateStartScreenNotice() {
  if (el.startDesc) {
    el.startDesc.textContent = t("start.description");
  }

  if (state.currentMode === "carousel") {
    if (el.filterNotice) {
      el.filterNotice.classList.add("hidden");
    }
    if (el.startError) {
      el.startError.classList.add("hidden");
    }
    if (el.btnStart) {
      el.btnStart.disabled = false;
    }
    return;
  }

  const desired = (state.configCount === "all")
    ? (state.pool ? state.pool.length : allQuestions.length)
    : (typeof state.configCount === "number" && state.configCount > 0 ? state.configCount : (getQuestionCountOverride() || CONFIG.QUESTIONS_PER_ROUND));
  const available = state.pool ? state.pool.length : allQuestions.length;
  const effectiveCount = available > 0 ? Math.min(desired, available) : desired;

  if (el.quizModeDesc) {
    el.quizModeDesc.textContent = effectiveCount === 1
      ? t("start.quiz_mode_description_1")
      : t("start.quiz_mode_description", { count: effectiveCount });
  }

  if (el.quizProgress && effectiveCount > 0) {
    el.quizProgress.textContent = t("quiz.progress_initial", { total: effectiveCount });
  }

  if (el.filterNotice) {
    el.filterNotice.classList.add("hidden");
    el.filterNotice.innerHTML = "";
  }

  if (available > 0) {
    if (el.startError) el.startError.classList.add("hidden");
    if (el.btnStart) el.btnStart.disabled = false;
  } else if (allQuestions.length > 0) {
    if (el.startError) {
      el.startError.textContent = t("start.error_no_questions_config");
      el.startError.classList.remove("hidden");
    }
    if (el.btnStart) el.btnStart.disabled = true;
  }
}

export function startQuiz() {
  if (!state.pool || state.pool.length === 0) {
    el.startError.textContent = t("start.error_start_no_pool");
    el.startError.classList.remove("hidden");
    return;
  }
  state.startTime = Date.now();
  const nameParam = getNameParam();
  state.playerName = nameParam || (el.playerNameInput ? el.playerNameInput.value.trim() : "");
  if (!nameParam) {
    setStoredPreferences({ playerName: state.playerName });
  }
  const effectiveCount = getEffectiveQuestionCount();
  state.round = shuffle(state.pool).slice(0, effectiveCount);
  state.currentIndex = 0;
  state.answers = [];
  showScreen("quiz");
  renderQuestion();
}

export function createOptionIndicator(type) {
  const badge = document.createElement("span");
  badge.className = `option-indicator option-indicator-${type}`;

  const svg = createIcon(type === "correct" ? "check" : "close", {
    className: "option-indicator-icon",
    width: 14,
    height: 14,
    strokeWidth: 2.5,
  });

  const label = document.createElement("span");
  label.className = "option-indicator-label";
  label.textContent = type === "correct" ? t("quiz.indicator_correct") : t("quiz.indicator_wrong");

  badge.appendChild(svg);
  badge.appendChild(label);
  return badge;
}

export function renderQuestion() {
  const q = applyTranslation(state.round[state.currentIndex]);
  const total = state.round.length;

  if (el.quizStatusIndicator) {
    el.quizStatusIndicator.classList.add("hidden");
    el.quizStatusIndicator.replaceChildren();
  }

  el.quizProgress.textContent = t("quiz.progress", { n: state.currentIndex + 1, total });
  const correctSoFar = state.answers.filter((a) => a.correct).length;
  el.quizScore.textContent = t("quiz.score", { correct: correctSoFar, answered: state.answers.length });
  el.progressFill.style.width = `${((state.currentIndex + 1) / total) * 100}%`;

  const badgeInfo = getSinceBadge(q.since);
  if (badgeInfo && el.quizBadgeWrap && el.quizBadge) {
    el.quizBadge.textContent = badgeInfo.text;
    el.quizBadge.className = badgeInfo.className;
    el.quizBadgeWrap.classList.remove("hidden");
  } else if (el.quizBadgeWrap) {
    el.quizBadgeWrap.classList.add("hidden");
  }

  el.questionText.textContent = q.question;

  const imgUrl = q.image || q.sign;
  const showsImage = Boolean(imgUrl);
  el.questionImageWrap.classList.toggle("hidden", !showsImage);
  if (showsImage) {
    el.questionImage.src = imgUrl;
    if (q.image) {
      el.questionImage.alt = q.imageAlt || t("quiz.image_alt_situation");
    } else {
      const signCode = q.signCode || getSignCode(q.sign);
      el.questionImage.alt = signCode
        ? t("quiz.image_alt_sign_code", { code: signCode })
        : (q.imageAlt || t("quiz.image_alt_sign"));
    }
    el.questionImage.classList.toggle("situation-image", Boolean(q.image));
  }

  el.options.innerHTML = "";
  const optionIsImage = q.type === "identify";
  el.options.classList.toggle("options-images", optionIsImage);

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    if (optionIsImage) {
      const img = document.createElement("img");
      img.src = opt;
      const signCode = getSignCode(opt);
      img.alt = signCode
        ? t("quiz.option_img_alt_sign", { n: idx + 1, code: signCode })
        : t("quiz.option_img_alt", { n: idx + 1 });
      btn.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.className = "option-text";
      span.textContent = opt;
      btn.appendChild(span);
    }
    btn.addEventListener("click", () => selectOption(idx));
    el.options.appendChild(btn);
  });

  updateNextButtonText();

  el.explanation.classList.add("hidden");
  el.explanation.textContent = "";
  el.btnNext.classList.add("hidden");
}

export function updateNextButtonText() {
  if (!el.btnNext) return;
  const isLast = state.currentIndex === state.round.length - 1;
  const label = isLast ? t("quiz.btn_show_result") : t("quiz.btn_next");
  const textSpan = el.btnNext.querySelector(".btn-next-text");
  if (textSpan) {
    textSpan.textContent = label;
  } else {
    el.btnNext.textContent = label;
  }
  el.btnNext.setAttribute("aria-label", label);
  el.btnNext.title = label;
  el.btnNext.classList.toggle("btn-next-finish", isLast);
}

export function selectOption(chosenIndex) {
  const q = applyTranslation(state.round[state.currentIndex]);
  const correct = chosenIndex === q.correctIndex;

  state.answers.push({
    id: q.id,
    question: q.question,
    type: q.type,
    image: q.image,
    sign: q.sign,
    since: q.since,
    chosenIndex,
    correctIndex: q.correctIndex,
    options: q.options,
    correct,
    explanation: q.explanation || "",
    source: q.source || "",
  });

  if (el.quizStatusIndicator) {
    el.quizStatusIndicator.replaceChildren();
    const statusBadge = document.createElement("span");
    statusBadge.className = `quiz-status-badge quiz-status-${correct ? "correct" : "wrong"}`;

    const svg = createIcon(correct ? "check" : "close", {
      className: "quiz-status-icon",
      width: 16,
      height: 16,
      strokeWidth: 2.5,
    });

    const textSpan = document.createElement("span");
    textSpan.className = "quiz-status-text";
    textSpan.textContent = correct ? t("quiz.status_correct") : t("quiz.status_wrong");

    statusBadge.appendChild(svg);
    statusBadge.appendChild(textSpan);
    el.quizStatusIndicator.appendChild(statusBadge);
    el.quizStatusIndicator.classList.remove("hidden");
  }

  const buttons = el.options.querySelectorAll(".option-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) {
      btn.classList.add("correct");
      btn.appendChild(createOptionIndicator("correct"));
    } else if (idx === chosenIndex) {
      btn.classList.add("wrong");
      btn.appendChild(createOptionIndicator("wrong"));
    } else {
      btn.classList.add("option-hidden");
    }
  });

  renderExplanation(q);

  el.quizScore.textContent = t("quiz.score", {
    correct: state.answers.filter((a) => a.correct).length,
    answered: state.answers.length,
  });
  updateNextButtonText();
  el.btnNext.classList.remove("hidden");
  if (el.btnNext) {
    el.btnNext.focus();
  }
}

export function renderExplanation(q) {
  el.explanation.replaceChildren();

  const header = document.createElement("div");
  header.className = "explanation-header";

  const title = document.createElement("span");
  title.className = "explanation-title";
  title.textContent = t("quiz.explanation_title");
  header.appendChild(title);

  if (q.source) {
    const link = document.createElement("a");
    link.className = "explanation-link-pill";
    link.href = localizeSourceUrl(q.source, getLang());
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = t("quiz.source_link_title");
    link.setAttribute("aria-label", t("quiz.source_link_aria"));

    const svg = createIcon("externalLink", {
      className: "explanation-pill-icon",
      width: 13,
      height: 13,
      strokeWidth: 2,
    });

    const pillText = document.createElement("span");
    pillText.textContent = t("quiz.source_pill_text");

    link.appendChild(svg);
    link.appendChild(pillText);
    header.appendChild(link);
  }

  el.explanation.appendChild(header);

  if (q.explanation) {
    const p = document.createElement("p");
    p.className = "explanation-text";
    p.textContent = q.explanation;
    el.explanation.appendChild(p);
  }

  if (q.explanation || q.source) {
    el.explanation.classList.remove("hidden");
  }
}

export function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex >= state.round.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

export function optionCell(question, index) {
  if (index === -1 || index === undefined) return "-";
  const value = question.options[index];
  if (question.type === "identify") {
    const signCode = getSignCode(value);
    const alt = signCode ? t("result.image_alt_sign_code", { code: signCode }) : t("result.image_alt_sign");
    return `<img src="${value}" alt="${alt}" class="table-thumb">`;
  }
  return value;
}

export function questionCell(question) {
  const badgeInfo = getSinceBadge(question.since);
  const badgeHtml = badgeInfo ? `<span class="badge-since-desktop ${badgeInfo.className}">${badgeInfo.text}</span>` : "";
  const imgUrl = question.image || question.sign;
  let alt = "";
  if (question.image) {
    alt = question.imageAlt || t("result.image_alt_situation");
  } else if (question.sign) {
    const signCode = question.signCode || getSignCode(question.sign);
    alt = signCode ? t("result.image_alt_sign_code", { code: signCode }) : (question.imageAlt || t("result.image_alt_sign"));
  }
  const signImg = imgUrl ? `<img src="${imgUrl}" alt="${alt}" class="table-thumb">` : "";

  if (badgeInfo) {
    return `<div class="table-question-wrap">${badgeHtml}<div>${signImg}${question.question}</div></div>`;
  }
  return signImg ? `${signImg}${question.question}` : question.question;
}

export function showResult() {
  state.endTime = Date.now();
  const durationOverride = parseInt(new URLSearchParams(window.location.search).get("duration"), 10);
  if (Number.isInteger(durationOverride) && durationOverride > 0) {
    state.durationSeconds = durationOverride;
  } else {
    state.durationSeconds = Math.max(
      1,
      Math.round((state.endTime - (state.startTime || state.endTime)) / 1000)
    );
  }
  const formattedDuration = formatDuration(state.durationSeconds);

  const total = state.answers.length;
  const correct = state.answers.filter((a) => a.correct).length;
  const pct = Math.round((correct / total) * 100);

  el.resultSummary.textContent = state.playerName
    ? t("result.summary_name", { name: state.playerName, correct, total, pct, duration: formattedDuration })
    : t("result.summary_no_name", { correct, total, pct, duration: formattedDuration });

  el.resultTableBody.innerHTML = "";
  state.answers.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.className = a.correct ? "correct-row" : "wrong-row";
    const userAnsLabel = a.correct ? t("result.your_correct_label") : t("result.your_answer_label");
    const badgeInfo = getSinceBadge(a.since);
    const sinceBadgeMobileHtml = badgeInfo ? `<span class="badge-since-mobile ${badgeInfo.className}">${badgeInfo.text}</span>` : "";
    const resultBadgeHtml = `<span class="badge-result ${a.correct ? "badge-result-correct" : "badge-result-wrong"}">${a.correct ? t("result.badge_correct") : t("result.badge_wrong")}</span>`;
    tr.innerHTML = `
      <td class="col-num" data-label="${t("result.table_col_num")}">${i + 1}</td>
      <td class="col-question" data-label="${t("result.table_col_q_aria", { n: i + 1 })}">${questionCell(a)}</td>
      <td class="col-user-ans" data-label="${userAnsLabel}">${optionCell(a, a.chosenIndex)}</td>
      <td class="col-correct-ans" data-label="${t("result.table_col_correct_ans_aria")}">${optionCell(a, a.correctIndex)}</td>
      <td class="col-result"><div class="result-badges-wrap">${sinceBadgeMobileHtml}${resultBadgeHtml}</div></td>
    `;
    el.resultTableBody.appendChild(tr);
  });

  showScreen("result");
  if (total > 0 && correct === total) showConfetti();
  recordQuizResult(state.answers);
  submitToSheet(correct, total, pct, state.durationSeconds, formattedDuration);
}

export function showConfetti() {
  const colors = ["#1a56db", "#1a7f37", "#f59e0b", "#c81e1e", "#7c3aed"];
  const layer = document.createElement("div");
  layer.id = "confetti-layer";
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 4000);
}

/** Discard an abandoned round without creating or submitting results. */
export function cancelQuiz() {
  state.round = [];
  state.answers = [];
  state.currentIndex = 0;
  restart();
  el.btnStart.focus();
}

export function restart() {
  state.startTime = null;
  state.endTime = null;
  state.durationSeconds = 0;
  const nameParam = getNameParam();
  if (el.playerNameInput) {
    el.playerNameInput.value = nameParam || state.playerName;
  }
  updateNextButtonText();
  applyFilter();
  showScreen("start");
  setStartMode(state.currentMode);
}
