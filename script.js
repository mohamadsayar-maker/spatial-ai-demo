const app = document.getElementById("app");

const stages = [
  { name: "stage-idle", duration: 0 },
  { name: "stage-question", duration: 1300 },
  { name: "stage-scan", duration: 1700 },
  { name: "stage-measure", duration: 1700 },
  { name: "stage-room", duration: 1600 },
  { name: "stage-answer", duration: 1600 },
  { name: "stage-vr", duration: 1700 },
  { name: "stage-pets", duration: 1800 },
  { name: "stage-layout", duration: 1700 },
  { name: "stage-final", duration: 0 }
];

let index = 0;
let running = false;
let timer = null;

function showStage(nextIndex) {
  index = nextIndex;
  app.className = `app ${stages[index].name}`;
}

function stop() {
  running = false;
  clearTimeout(timer);
}

function reset() {
  stop();
  showStage(0);
}

function advance() {
  const stage = stages[index];
  if (!stage.duration || index >= stages.length - 1) {
    running = false;
    return;
  }

  timer = setTimeout(() => {
    showStage(index + 1);
    advance();
  }, stage.duration);
}

function startStoryboard() {
  if (running) return;

  if (index === stages.length - 1) {
    reset();
    return;
  }

  running = true;
  clearTimeout(timer);
  showStage(1);
  advance();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.code === "Space") {
    event.preventDefault();
    startStoryboard();
  }

  if (event.key === "Escape") {
    reset();
  }
});

document.addEventListener("click", startStoryboard);

showStage(0);
