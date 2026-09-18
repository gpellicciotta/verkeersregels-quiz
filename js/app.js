const CONFIG = {
  QUESTIONS_PER_ROUND: 20,
  // If null, no results will be propagated:
  SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbyYyBMb8KTD13MrJhOpmZIYKHCbuGD5PyiL01tdzcWNRle6juEB6Qgap1yYfmmJJ2lE/exec",
  // Moet overeenkomen met SHARED_SECRET in google-apps-script/Code.gs.
  SHEET_SECRET: "8jd6H2Byuj0HaIqL",
};

const state = {
  playerName: "",
  pool: [],
  round: [],
  currentIndex: 0,
  answers: [],
};

const el = {
  screenStart: document.getElementById("screen-start"),
  screenQuiz: document.getElementById("screen-quiz"),
  screenResult: document.getElementById("screen-result"),
  playerNameInput: document.getElementById("player-name"),
  btnStart: document.getElementById("btn-start"),
  startError: document.getElementById("start-error"),
  quizProgress: document.getElementById("quiz-progress"),
  quizScore: document.getElementById("quiz-score"),
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

function startQuiz() {
  state.playerName = el.playerNameInput.value.trim();
  const count = Math.min(CONFIG.QUESTIONS_PER_ROUND, state.pool.length);
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
  el.quizScore.textContent = `Score: ${correctSoFar}`;
  el.progressFill.style.width = `${(state.currentIndex / total) * 100}%`;

  el.questionText.textContent = q.question;

  const showsSignImage = q.type === "recognize";
  el.questionImageWrap.classList.toggle("hidden", !showsSignImage);
  if (showsSignImage) {
    el.questionImage.src = q.sign;
    el.questionImage.alt = "Verkeersbord";
  }

  el.options.innerHTML = "";
  const optionIsImage = q.type === "identify";

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

  el.quizScore.textContent = `Score: ${state.answers.filter((a) => a.correct).length}`;
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

function optionLabel(question, index) {
  if (index === -1 || index === undefined) return "-";
  const value = question.options[index];
  if (question.type === "identify") {
    const filename = value.split("/").pop();
    return filename;
  }
  return value;
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
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${a.question}</td>
      <td>${optionLabel(a, a.chosenIndex)}</td>
      <td>${optionLabel(a, a.correctIndex)}</td>
      <td class="${a.correct ? "tag-correct" : "tag-wrong"}">${a.correct ? "Juist" : "Fout"}</td>
    `;
    el.resultTableBody.appendChild(tr);
  });

  showScreen("result");
  submitToSheet(correct, total);
}

async function submitToSheet(correct, total) {
  if (!CONFIG.SHEET_WEBAPP_URL) return;
  try {
    await fetch(CONFIG.SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        naam: state.playerName || "(onbekend)",
        score: correct,
        totaal: total,
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

loadQuestions()
  .then((questions) => {
    state.pool = questions;
  })
  .catch((err) => {
    console.error(err);
    el.startError.textContent = "Vragen konden niet geladen worden. Herlaad de pagina.";
    el.startError.classList.remove("hidden");
  });
