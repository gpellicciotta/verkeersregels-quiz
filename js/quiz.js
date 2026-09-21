import { CONFIG } from "./config.js";
import { el } from "./dom.js";
import { state, allQuestions } from "./state.js";
import { shuffle, getSinceBadge, formatDuration } from "./utils.js";
import { getNameParam, getQuestionCountOverride, getSinceFilter, getTypeFilter } from "./params.js";
import { setStoredPreferences } from "./preferences.js";
import { showScreen } from "./screens.js";
import { submitToSheet } from "./sheet.js";
import { setStartMode } from "./ui-mode.js";
import { t, getLang } from "./i18n.js";

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

function applyTranslation(q) {
  const overlay = translationOverlay[q.id];
  if (!overlay) return q;
  return {
    ...q,
    question: overlay.question ?? q.question,
    options: overlay.options ?? q.options,
    explanation: overlay.explanation ?? q.explanation,
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
  } else {
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

export function renderQuestion() {
  const q = applyTranslation(state.round[state.currentIndex]);
  const total = state.round.length;

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
    el.questionImage.alt = q.image ? t("quiz.image_alt_situation") : t("quiz.image_alt_sign");
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
      img.alt = t("quiz.option_img_alt", { n: idx + 1 });
      btn.appendChild(img);
    } else {
      btn.textContent = opt;
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

  const buttons = el.options.querySelectorAll(".option-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) {
      btn.classList.add("correct");
    } else if (idx === chosenIndex) {
      btn.classList.add("wrong");
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
    link.href = q.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = t("quiz.source_link_title");
    link.setAttribute("aria-label", t("quiz.source_link_aria"));

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "explanation-pill-icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "13");
    svg.setAttribute("height", "13");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6");
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "15 3 21 3 21 9");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "10");
    line.setAttribute("y1", "14");
    line.setAttribute("x2", "21");
    line.setAttribute("y2", "3");

    svg.appendChild(path);
    svg.appendChild(polyline);
    svg.appendChild(line);

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
    return `<img src="${value}" alt="${t("result.image_alt_sign")}" class="table-thumb">`;
  }
  return value;
}

export function questionCell(question) {
  const badgeInfo = getSinceBadge(question.since);
  const badgeHtml = badgeInfo ? `<span class="badge-since-desktop ${badgeInfo.className}">${badgeInfo.text}</span>` : "";
  const imgUrl = question.image || question.sign;
  const signImg = imgUrl ? `<img src="${imgUrl}" alt="${question.image ? t("result.image_alt_situation") : t("result.image_alt_sign")}" class="table-thumb">` : "";

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
