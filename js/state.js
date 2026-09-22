export let allQuestions = [];

export function setAllQuestions(questions) {
  allQuestions = questions;
}

export const state = {
  currentMode: "quiz",
  playerName: "",
  pool: [],
  round: [],
  currentIndex: 0,
  answers: [],
  filterSince: null,
  filterType: null,
  configCount: null,
  configType: null,
  configSince: null,
  alwaysIncludeLastErrors: false,
  startTime: null,
  endTime: null,
  durationSeconds: 0,
};

export const carouselState = {
  isActive: false,
  items: [],
  currentIndex: 0,
  delayMs: 8000,
  filterSince: null,
  isPaused: false,
  animFrameId: null,
  slideStartTime: 0,
  elapsedBeforePause: 0,
};
