const CONFIG = {
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
};

function showScreen(name) {
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
  const param = new URLSearchParams(window.location.search).get("since");
  if (!param) return null;
  const year = parseInt(param, 10);
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

function applyFilter() {
  const filterSince = getSinceFilter();
  state.filterSince = filterSince;
  if (filterSince !== null) {
    state.pool = allQuestions.filter(
      (q) => typeof q.since === "number" && q.since >= filterSince
    );
  } else {
    state.pool = allQuestions.slice();
  }
  updateStartScreenNotice();
}

function updateStartScreenNotice() {
  if (state.filterSince !== null) {
    const badgeInfo = getSinceBadge(state.filterSince) || {
      text: `Sinds ${state.filterSince}`,
      className: "badge-since badge-amber badge-since-amber",
    };
    const count = state.pool.length;
    if (count > 0) {
      el.filterNotice.innerHTML = `
        <span class="${badgeInfo.className}">${badgeInfo.text}</span>
        <span>Quiz gefilterd op regels gewijzigd sinds <strong>${state.filterSince}</strong> (${count} ${count === 1 ? "vraag" : "vragen"} in de selectie).</span>
      `;
      el.filterNotice.classList.remove("hidden");
      if (el.startDesc) {
        el.startDesc.textContent = `Oefen recente wetswijzigingen sinds ${state.filterSince}: ${count} ${count === 1 ? "vraag" : "vragen"} in deze selectie.`;
      }
      el.startError.classList.add("hidden");
      el.btnStart.disabled = false;
    } else {
      el.filterNotice.innerHTML = `
        <span class="badge-since badge-amber badge-since-amber">Sinds ${state.filterSince}</span>
        <span>Geen vragen gevonden voor wetswijzigingen sinds <strong>${state.filterSince}</strong>.</span>
      `;
      el.filterNotice.classList.remove("hidden");
      el.startError.textContent = `Er zijn geen quizvragen beschikbaar met wetswijzigingen sinds ${state.filterSince}.`;
      el.startError.classList.remove("hidden");
      el.btnStart.disabled = true;
    }
  } else {
    el.filterNotice.classList.add("hidden");
    el.filterNotice.innerHTML = "";
    if (el.startDesc) {
      el.startDesc.textContent = "Oefen voor je theoretisch rijexamen: 20 vragen over verkeersborden en verkeersregels.";
    }
    el.startError.classList.add("hidden");
    el.btnStart.disabled = false;
  }
}

function getQuestionCountOverride() {
  const q = parseInt(new URLSearchParams(window.location.search).get("q"), 10);
  return Number.isInteger(q) && q > 0 ? q : null;
}

function startQuiz() {
  if (!state.pool || state.pool.length === 0) {
    el.startError.textContent = "Geen vragen beschikbaar om de quiz te starten.";
    el.startError.classList.remove("hidden");
    return;
  }
  state.playerName = el.playerNameInput.value.trim();
  const desired = getQuestionCountOverride() || CONFIG.QUESTIONS_PER_ROUND;
  const count = Math.min(desired, state.pool.length);
  state.round = shuffle(state.pool).slice(0, count);
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
  el.progressFill.style.width = `${(state.currentIndex / total) * 100}%`;

  const badgeInfo = getSinceBadge(q.since);
  if (badgeInfo && el.quizBadgeWrap && el.quizBadge) {
    el.quizBadge.textContent = badgeInfo.text;
    el.quizBadge.className = badgeInfo.className;
    el.quizBadgeWrap.classList.remove("hidden");
  } else if (el.quizBadgeWrap) {
    el.quizBadgeWrap.classList.add("hidden");
  }

  el.questionText.textContent = q.question;

  const showsSignImage = q.type === "recognize";
  el.questionImageWrap.classList.toggle("hidden", !showsSignImage);
  if (showsSignImage) {
    el.questionImage.src = q.sign;
    el.questionImage.alt = "Verkeersbord";
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

  el.explanation.classList.add("hidden");
  el.explanation.textContent = "";
  el.btnNext.classList.add("hidden");
}

function selectOption(chosenIndex) {
  const q = state.round[state.currentIndex];
  const correct = chosenIndex === q.correctIndex;

  state.answers.push({
    id: q.id,
    question: q.question,
    type: q.type,
    sign: q.sign,
    since: q.since,
    chosenIndex,
    correctIndex: q.correctIndex,
    options: q.options,
    correct,
    explanation: q.explanation || "",
  });

  const buttons = el.options.querySelectorAll(".option-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctIndex) btn.classList.add("correct");
    else if (idx === chosenIndex) btn.classList.add("wrong");
  });

  if (q.explanation) {
    el.explanation.textContent = q.explanation;
    el.explanation.classList.remove("hidden");
  }

  el.quizScore.textContent = `Score: ${state.answers.filter((a) => a.correct).length}/${state.answers.length}`;
  el.btnNext.classList.remove("hidden");
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
  const signImg = question.type === "recognize" ? `<img src="${question.sign}" alt="Bord" class="table-thumb">` : "";

  if (badgeInfo) {
    return `<div class="table-question-wrap">${badgeHtml}<div>${signImg}${question.question}</div></div>`;
  }
  return signImg ? `${signImg}${question.question}` : question.question;
}

function showResult() {
  const total = state.answers.length;
  const correct = state.answers.filter((a) => a.correct).length;
  const pct = Math.round((correct / total) * 100);

  const namePart = state.playerName ? `${state.playerName}, je` : "Je";
  el.resultSummary.textContent = `${namePart} scoorde ${correct}/${total} (${pct}%).`;

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
  submitToSheet(correct, total, pct);
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

async function submitToSheet(correct, total, pct) {
  if (!CONFIG.SHEET_WEBAPP_URL) return;
  if (!state.playerName) return;
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
        datum: new Date().toISOString(),
        sleutel: CONFIG.SHEET_SECRET,
      }),
    });
  } catch (err) {
    console.warn("Kon score niet naar Google Sheet sturen:", err);
  }
}

function restart() {
  el.playerNameInput.value = state.playerName;
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
  }
}

loadQuestions()
  .then((questions) => {
    allQuestions = questions;
    applyFilter();
    checkAutoStart();
  })
  .catch((err) => {
    console.error(err);
    el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
    el.startError.classList.remove("hidden");
  });
