const CONFIG = {
  VERSION: "v2.0.0",
  QUESTIONS_PER_ROUND: 20,
  // If null, no results will be propagated:
  SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbyYyBMb8KTD13MrJhOpmZIYKHCbuGD5PyiL01tdzcWNRle6juEB6Qgap1yYfmmJJ2lE/exec",
  // Moet overeenkomen met SHARED_SECRET in google-apps-script/Code.gs.
  SHEET_SECRET: "8jd6H2Byuj0HaIqL",
};

let allQuestions = [];

const state = {
  playerName: "",
  pool: [],
  round: [],
  currentIndex: 0,
  answers: [],
  filterSince: null,
  startTime: null,
  endTime: null,
  durationSeconds: 0,
};

const el = {
  screenStart: document.getElementById("screen-start"),
  screenQuiz: document.getElementById("screen-quiz"),
  screenResult: document.getElementById("screen-result"),
  playerNameInput: document.getElementById("player-name"),
  btnStart: document.getElementById("btn-start"),
  startError: document.getElementById("start-error"),
  startDesc: document.getElementById("start-desc"),
  filterNotice: document.getElementById("filter-notice"),
  quizProgress: document.getElementById("quiz-progress"),
  quizScore: document.getElementById("quiz-score"),
  quizBadgeWrap: document.getElementById("quiz-badge-wrap"),
  quizBadge: document.getElementById("quiz-badge"),
  progressFill: document.getElementById("progress-fill"),
  questionText: document.getElementById("question-text"),
  questionImageWrap: document.getElementById("question-image-wrap"),
  questionImage: document.getElementById("question-image"),
  options: document.getElementById("options"),
  explanation: document.getElementById("explanation"),
  btnNext: document.getElementById("btn-next"),
  resultSummary: document.getElementById("result-summary"),
  resultTableBody: document.getElementById("result-table-body"),
  btnPrint: document.getElementById("btn-print"),
  btnRestart: document.getElementById("btn-restart"),
  btnReportError: document.getElementById("btn-report-error"),
  modalReport: document.getElementById("modal-report"),
  btnModalClose: document.getElementById("btn-modal-close"),
  btnModalCancel: document.getElementById("btn-modal-cancel"),
  btnModalSubmit: document.getElementById("btn-modal-submit"),
  formReport: document.getElementById("form-report"),
  modalQuestionId: document.getElementById("modal-question-id"),
  modalQuestionText: document.getElementById("modal-question-text"),
  modalReportDesc: document.querySelector("#modal-report .modal-desc"),
  reportRemark: document.getElementById("report-remark"),
  modalFeedback: document.getElementById("modal-feedback"),
  btnVersion: document.getElementById("btn-version"),
  btnInstall: document.getElementById("btn-install"),
  offlineIndicator: document.getElementById("offline-indicator"),
  modalChangelog: document.getElementById("modal-changelog"),
  btnChangelogClose: document.getElementById("btn-changelog-close"),
  btnChangelogDismiss: document.getElementById("btn-changelog-dismiss"),
  changelogBody: document.getElementById("changelog-body"),
};

function showScreen(name) {
  closeReportModal();
  closeChangelogModal();
  el.screenStart.classList.toggle("hidden", name !== "start");
  el.screenQuiz.classList.toggle("hidden", name !== "quiz");
  el.screenResult.classList.toggle("hidden", name !== "result");
}

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function loadQuestions() {
  const res = await fetch("data/questions.json");
  if (!res.ok) throw new Error("Kon vragenbestand niet laden: " + res.status);
  const data = await res.json();
  return data.questions;
}

function getSinceBadge(since) {
  if (!since || typeof since !== "number") return null;
  const currentYear = new Date().getFullYear();
  const diff = currentYear - since;
  const isRecent = diff <= 5;
  return {
    year: since,
    text: `Sinds ${since}`,
    className: isRecent ? "badge-since badge-amber badge-since-amber" : "badge-since badge-blue badge-since-blue",
    isRecent,
  };
}

function getSinceFilter() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const param = params.get("since") || params.get("sinds") || params.get("s");
  if (!param) return null;
  const year = parseInt(param, 10);
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

function getTypeFilter() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("type") || params.get("t");
  if (!raw) return null;
  const val = raw.trim().toLowerCase();
  if (["situation", "situatie", "situaties", "foto", "photo", "fotos", "photos"].includes(val)) {
    return "situation";
  }
  if (["recognize", "herkennen"].includes(val)) {
    return "recognize";
  }
  if (["identify", "identificeren"].includes(val)) {
    return "identify";
  }
  if (["rule", "regel", "regels"].includes(val)) {
    return "rule";
  }
  if (["sign", "signs", "bord", "borden", "verkeersborden"].includes(val)) {
    return "sign";
  }
  return null;
}

function applyFilter() {
  const filterSince = getSinceFilter();
  const filterType = getTypeFilter();
  state.filterSince = filterSince;
  state.filterType = filterType;

  let pool = allQuestions.slice();

  if (filterSince !== null) {
    pool = pool.filter(
      (q) => typeof q.since === "number" && q.since >= filterSince
    );
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

function getQuestionCountOverride() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("q") || params.get("quantity");
  if (!raw) return null;
  const q = parseInt(raw, 10);
  return Number.isInteger(q) && q > 0 ? q : null;
}

function getEffectiveQuestionCount() {
  const desired = getQuestionCountOverride() || CONFIG.QUESTIONS_PER_ROUND;
  const available = state.pool ? state.pool.length : allQuestions.length;
  return Math.min(desired, available);
}

function updateStartScreenNotice() {
  const desired = getQuestionCountOverride() || CONFIG.QUESTIONS_PER_ROUND;
  const available = state.pool ? state.pool.length : allQuestions.length;
  const effectiveCount = Math.min(desired, available);

  if (el.quizProgress && effectiveCount > 0) {
    el.quizProgress.textContent = `Vraag 1/${effectiveCount}`;
  }

  const hasSince = state.filterSince !== null;
  const hasType = state.filterType !== null;

  if (hasSince || hasType) {
    const badgesHtml = [];
    const descParts = [];

    if (hasType) {
      const typeLabels = {
        situation: "Verkeerssituaties (foto's)",
        recognize: "Verkeersborden herkennen",
        identify: "Verkeersborden identificeren",
        sign: "Alle verkeersborden",
        rule: "Verkeersregels",
      };
      const label = typeLabels[state.filterType] || state.filterType;
      badgesHtml.push(`<span class="badge-since badge-blue badge-since-blue">${label}</span>`);
      descParts.push(`type: ${label.toLowerCase()}`);
    }

    if (hasSince) {
      const badgeInfo = getSinceBadge(state.filterSince) || {
        text: `Sinds ${state.filterSince}`,
        className: "badge-since badge-amber badge-since-amber",
      };
      badgesHtml.push(`<span class="${badgeInfo.className}">${badgeInfo.text}</span>`);
      descParts.push(`wetswijzigingen sinds ${state.filterSince}`);
    }

    const filterSummary = descParts.join(" en ");

    if (available > 0) {
      el.filterNotice.innerHTML = `
        ${badgesHtml.join(" ")}
        <span>Quiz gefilterd op <strong>${filterSummary}</strong> (${effectiveCount} ${effectiveCount === 1 ? "vraag" : "vragen"} in de selectie).</span>
      `;
      el.filterNotice.classList.remove("hidden");
      if (el.startDesc) {
        el.startDesc.textContent = `Oefen ${filterSummary}: ${effectiveCount} ${effectiveCount === 1 ? "vraag" : "vragen"} in deze selectie.`;
      }
      el.startError.classList.add("hidden");
      el.btnStart.disabled = false;
    } else {
      el.filterNotice.innerHTML = `
        ${badgesHtml.join(" ")}
        <span>Geen vragen gevonden voor de filter <strong>${filterSummary}</strong>.</span>
      `;
      el.filterNotice.classList.remove("hidden");
      if (el.startDesc) {
        el.startDesc.textContent = `Oefen ${filterSummary}: 0 vragen in deze selectie.`;
      }
      el.startError.textContent = `Er zijn geen quizvragen beschikbaar voor ${filterSummary}.`;
      el.startError.classList.remove("hidden");
      el.btnStart.disabled = true;
    }
  } else {
    el.filterNotice.classList.add("hidden");
    el.filterNotice.innerHTML = "";
    if (el.startDesc) {
      el.startDesc.textContent = `Oefen voor je theoretisch rijexamen: ${effectiveCount} ${effectiveCount === 1 ? "vraag" : "vragen"} over verkeersborden en verkeersregels.`;
    }
    el.startError.classList.add("hidden");
    el.btnStart.disabled = effectiveCount === 0;
  }
}

function startQuiz() {
  if (!state.pool || state.pool.length === 0) {
    el.startError.textContent = "Geen vragen beschikbaar om de quiz te starten.";
    el.startError.classList.remove("hidden");
    return;
  }
  state.startTime = Date.now();
  state.playerName = el.playerNameInput.value.trim();
  const effectiveCount = getEffectiveQuestionCount();
  state.round = shuffle(state.pool).slice(0, effectiveCount);
  state.currentIndex = 0;
  state.answers = [];
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = state.round[state.currentIndex];
  const total = state.round.length;

  el.quizProgress.textContent = `Vraag ${state.currentIndex + 1}/${total}`;
  const correctSoFar = state.answers.filter((a) => a.correct).length;
  el.quizScore.textContent = `Score: ${correctSoFar}/${state.answers.length}`;
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
    el.questionImage.alt = q.image ? "Verkeerssituatie" : "Verkeersbord";
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
      img.alt = `Optie ${idx + 1}`;
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

function updateNextButtonText() {
  if (!el.btnNext) return;
  const isLast = state.currentIndex === state.round.length - 1;
  const label = isLast ? "Toon resultaat" : "Volgende vraag";
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

function selectOption(chosenIndex) {
  const q = state.round[state.currentIndex];
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

  el.quizScore.textContent = `Score: ${state.answers.filter((a) => a.correct).length}/${state.answers.length}`;
  updateNextButtonText();
  el.btnNext.classList.remove("hidden");
}

function renderExplanation(q) {
  el.explanation.replaceChildren();

  const header = document.createElement("div");
  header.className = "explanation-header";

  const title = document.createElement("span");
  title.className = "explanation-title";
  title.textContent = "Toelichting";
  header.appendChild(title);

  if (q.source) {
    const link = document.createElement("a");
    link.className = "explanation-link-pill";
    link.href = q.source;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Bekijk officieel wetsartikel in de Wegcode";
    link.setAttribute("aria-label", "Bekijk officieel wetsartikel in de Wegcode");

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
    pillText.textContent = "Wegcode ↗";

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

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex >= state.round.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function optionCell(question, index) {
  if (index === -1 || index === undefined) return "-";
  const value = question.options[index];
  if (question.type === "identify") {
    return `<img src="${value}" alt="Bord" class="table-thumb">`;
  }
  return value;
}

function questionCell(question) {
  const badgeInfo = getSinceBadge(question.since);
  const badgeHtml = badgeInfo ? `<span class="${badgeInfo.className}">${badgeInfo.text}</span>` : "";
  const imgUrl = question.image || question.sign;
  const signImg = imgUrl ? `<img src="${imgUrl}" alt="${question.image ? "Situatie" : "Bord"}" class="table-thumb">` : "";

  if (badgeInfo) {
    return `<div class="table-question-wrap">${badgeHtml}<div>${signImg}${question.question}</div></div>`;
  }
  return signImg ? `${signImg}${question.question}` : question.question;
}

function formatDuration(seconds) {
  const s = Math.max(1, Math.round(seconds || 1));
  const min = Math.floor(s / 60);
  const remSec = s % 60;
  if (min === 0) {
    return `${remSec} sec`;
  }
  if (remSec === 0) {
    return `${min} min`;
  }
  return `${min} min ${remSec} sec`;
}

function showResult() {
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

  const namePart = state.playerName ? `${state.playerName}, je` : "Je";
  el.resultSummary.textContent = `${namePart} scoorde ${correct}/${total} (${pct}%) in ${formattedDuration}.`;

  el.resultTableBody.innerHTML = "";
  state.answers.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.className = a.correct ? "correct-row" : "wrong-row";
    const userAnsLabel = a.correct ? "Jouw Juiste Antwoord" : "Jouw antwoord";
    tr.innerHTML = `
      <td class="col-num" data-label="Vraag nr.">${i + 1}</td>
      <td class="col-question" data-label="Vraag Nr. ${i + 1}">${questionCell(a)}</td>
      <td class="col-user-ans" data-label="${userAnsLabel}">${optionCell(a, a.chosenIndex)}</td>
      <td class="col-correct-ans" data-label="Juist antwoord">${optionCell(a, a.correctIndex)}</td>
      <td class="col-result"><span class="badge-result ${a.correct ? "badge-result-correct" : "badge-result-wrong"}">${a.correct ? "Juist" : "Fout"}</span></td>
    `;
    el.resultTableBody.appendChild(tr);
  });

  showScreen("result");
  if (total > 0 && correct === total) showConfetti();
  submitToSheet(correct, total, pct, state.durationSeconds, formattedDuration);
}

function showConfetti() {
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

async function submitToSheet(correct, total, pct, durationSeconds, formattedDuration) {
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

const REPORT_QUEUE_KEY = "verkeersquiz_pending_reports";
const MAX_QUEUED_REPORTS = 50;

function getPendingReports() {
  try {
    const raw = localStorage.getItem(REPORT_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Kon foutmeldingswachtrij niet lezen uit localStorage:", err);
    return [];
  }
}

function savePendingReports(reports) {
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

function enqueueReport(payloadObj) {
  const reports = getPendingReports();
  reports.push({
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    enqueuedAt: new Date().toISOString(),
    payload: payloadObj,
  });
  savePendingReports(reports);
}

let isDrainingQueue = false;

async function drainReportQueue() {
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

function submitErrorReport(targetQuestion, remark) {
  if (!CONFIG.SHEET_WEBAPP_URL || !targetQuestion) return Promise.resolve();

  const payloadData = {
    actie: "report_error",
    sleutel: CONFIG.SHEET_SECRET,
    datum: new Date().toISOString(),
    vraagId: targetQuestion.id || "",
    vraag: targetQuestion.question || "",
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

function openReportModal() {
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

function closeReportModal() {
  if (!el.modalReport) return;
  el.modalReport.classList.add("hidden");
  el.modalFeedback.textContent = "";
  el.modalFeedback.className = "modal-feedback hidden";
}

function handleReportSubmit(e) {
  e.preventDefault();
  const q = state.round[state.currentIndex];
  if (!q) return;

  const remark = el.reportRemark.value.trim();

  // Instant dismissal with zero lag
  closeReportModal();

  // Asynchronous background transmission or local enqueue
  submitErrorReport(q, remark);
}

let changelogHtmlCache = null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInlineMarkdown(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

function renderChangelogMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;

  function closeList() {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line === "---") {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      continue;
    }

    if (line.startsWith(">")) {
      closeList();
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      const title = escapeHtml(line.slice(3).trim());
      html += `<h4 class="changelog-version-title">${title}</h4>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += '<ul class="changelog-list">';
        inList = true;
      }
      const content = line.slice(2).trim();
      const match = content.match(/^([A-Za-z]+):\s*(.*)$/);
      if (match) {
        const area = escapeHtml(match[1]);
        const desc = formatInlineMarkdown(match[2]);
        html += `<li><span class="changelog-badge changelog-badge-${area.toLowerCase()}">${area}</span> ${desc}</li>`;
      } else {
        html += `<li>${formatInlineMarkdown(content)}</li>`;
      }
      continue;
    }

    closeList();
    html += `<p class="changelog-p">${formatInlineMarkdown(line)}</p>`;
  }

  closeList();
  return html;
}

async function loadChangelog() {
  if (changelogHtmlCache) {
    el.changelogBody.innerHTML = changelogHtmlCache;
    return;
  }
  el.changelogBody.innerHTML = '<p class="changelog-loading">Versiegeschiedenis laden...</p>';
  try {
    const res = await fetch("CHANGELOG.md");
    if (!res.ok) throw new Error("Kon CHANGELOG.md niet laden: " + res.status);
    const md = await res.text();
    changelogHtmlCache = renderChangelogMarkdown(md);
    el.changelogBody.innerHTML = changelogHtmlCache;
  } catch (err) {
    console.warn("Changelog laden mislukt:", err);
    el.changelogBody.innerHTML = `
      <p class="error">Kon versiegeschiedenis niet laden.</p>
      <p class="modal-desc">Bekijk <a href="CHANGELOG.md" target="_blank" rel="noopener noreferrer">CHANGELOG.md</a> direct.</p>
    `;
  }
}

function openChangelogModal() {
  if (!el.modalChangelog) return;
  el.modalChangelog.classList.remove("hidden");
  loadChangelog();
  if (el.btnChangelogClose) el.btnChangelogClose.focus();
}

function closeChangelogModal() {
  if (!el.modalChangelog) return;
  el.modalChangelog.classList.add("hidden");
  if (el.btnVersion) el.btnVersion.focus();
}

function restart() {
  state.startTime = null;
  state.endTime = null;
  state.durationSeconds = 0;
  el.playerNameInput.value = state.playerName;
  updateNextButtonText();
  applyFilter();
  showScreen("start");
}

el.btnStart.addEventListener("click", () => {
  if (!state.pool || state.pool.length === 0) {
    el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
    el.startError.classList.remove("hidden");
    return;
  }
  startQuiz();
});
el.btnNext.addEventListener("click", nextQuestion);
el.btnRestart.addEventListener("click", restart);
el.btnPrint.addEventListener("click", () => window.print());
el.btnReportError.addEventListener("click", openReportModal);
el.btnModalClose.addEventListener("click", closeReportModal);
el.btnModalCancel.addEventListener("click", closeReportModal);
el.formReport.addEventListener("submit", handleReportSubmit);
el.modalReport.addEventListener("click", (e) => {
  if (e.target === el.modalReport) closeReportModal();
});

if (el.btnVersion) {
  el.btnVersion.textContent = CONFIG.VERSION;
  el.btnVersion.addEventListener("click", openChangelogModal);
}
if (el.btnChangelogClose) el.btnChangelogClose.addEventListener("click", closeChangelogModal);
if (el.btnChangelogDismiss) el.btnChangelogDismiss.addEventListener("click", closeChangelogModal);
if (el.modalChangelog) {
  el.modalChangelog.addEventListener("click", (e) => {
    if (e.target === el.modalChangelog) closeChangelogModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (el.modalReport && !el.modalReport.classList.contains("hidden")) {
      closeReportModal();
    }
    if (el.modalChangelog && !el.modalChangelog.classList.contains("hidden")) {
      closeChangelogModal();
    }
  }
});

function checkAutoStart() {
  const params = new URLSearchParams(window.location.search);
  const autotest = params.get("autotest");
  if (autotest === "results" || autotest === "results-mixed") {
    startQuiz();
    while (state.currentIndex < state.round.length) {
      const q = state.round[state.currentIndex];
      if (autotest === "results-mixed" && state.currentIndex % 2 === 1) {
        selectOption((q.correctIndex + 1) % q.options.length);
      } else {
        selectOption(q.correctIndex);
      }
      state.currentIndex++;
    }
    showResult();
  } else if (params.get("autostart") === "1") {
    startQuiz();
    if (params.get("answer") === "correct") {
      const q = state.round[state.currentIndex];
      selectOption(q.correctIndex);
    } else if (params.get("answer") === "wrong") {
      const q = state.round[state.currentIndex];
      selectOption((q.correctIndex + 1) % q.options.length);
    }
    if (params.get("report") === "1") {
      openReportModal();
    }
  } else if (params.get("modal") === "changelog" || params.get("autotest") === "changelog" || params.get("changelog") === "1") {
    openChangelogModal();
  }
}

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (el.btnInstall) {
    el.btnInstall.classList.remove("hidden");
  }
});

if (el.btnInstall) {
  el.btnInstall.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === "accepted") {
      deferredInstallPrompt = null;
      el.btnInstall.classList.add("hidden");
    }
  });
}

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  if (el.btnInstall) {
    el.btnInstall.classList.add("hidden");
  }
  console.info("PWA succesvol geïnstalleerd.");
});

function updateOnlineStatus() {
  const isOnline = typeof navigator.onLine === "boolean" ? navigator.onLine : true;
  if (el.offlineIndicator) {
    el.offlineIndicator.classList.toggle("hidden", isOnline);
  }
}

window.addEventListener("online", () => {
  updateOnlineStatus();
  drainReportQueue();
});

window.addEventListener("offline", () => {
  updateOnlineStatus();
});

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            if (worker) {
              worker.addEventListener("statechange", () => {
                if (worker.state === "installed" && navigator.serviceWorker.controller) {
                  console.info("Nieuwe versie van de quiz beschikbaar.");
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("Service Worker registratie mislukt:", err);
        });
    });
  }
}

registerServiceWorker();
updateOnlineStatus();

loadQuestions()
  .then((questions) => {
    allQuestions = questions;
    applyFilter();
    checkAutoStart();
    drainReportQueue();
  })
  .catch((err) => {
    console.error(err);
    el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
    el.startError.classList.remove("hidden");
  });

