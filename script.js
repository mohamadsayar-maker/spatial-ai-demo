const app = document.getElementById("app");
const label = document.getElementById("label");
const title = document.getElementById("title");
const copy = document.getElementById("copy");
const signals = document.getElementById("signals");

const flow = [
  {
    state: "state-idle",
    label: "",
    title: "",
    copy: "",
    signals: [],
    delay: 0
  },
  {
    state: "state-framing",
    label: "",
    title: "",
    copy: "",
    signals: [],
    delay: 850
  },
  {
    state: "state-captured",
    label: "Photo captured",
    title: "Using this chair",
    copy: "The app is now acting as if the glasses took this photo.",
    signals: ["Cream leather", "Wood shell"],
    delay: 1500
  },
  {
    state: "state-analyzing",
    label: "Analyzing",
    title: "Reading form and fit",
    copy: "Checking comfort, materials, scale, and wheel risk.",
    signals: ["Comfort: high", "Base: wheeled"],
    delay: 1900
  },
  {
    state: "state-answer",
    label: "Answer",
    title: "Yes, but place it carefully",
    copy: "It looks premium and comfortable. The wheels make it better for open space than tight desk routes.",
    signals: ["Style fit: strong", "Risk: rolling base"],
    delay: 0
  }
];

let currentStep = 0;
let running = false;
let timers = [];

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

function renderStep(index) {
  currentStep = index;
  const step = flow[currentStep];
  app.className = `app ${step.state}`;
  label.textContent = step.label;
  title.textContent = step.title;
  copy.textContent = step.copy;

  signals.innerHTML = "";
  step.signals.forEach((signal) => {
    const item = document.createElement("li");
    item.textContent = signal;
    signals.appendChild(item);
  });
}

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.03;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function advanceFrom(index) {
  const nextIndex = index + 1;
  if (nextIndex >= flow.length) {
    running = false;
    speak("Yes, but place it carefully. It looks premium and comfortable. The wheels make it better for open space than tight desk routes.");
    return;
  }

  const timer = setTimeout(() => {
    renderStep(nextIndex);
    advanceFrom(nextIndex);
  }, flow[index].delay);

  timers.push(timer);
}

function triggerFakeCapture() {
  if (running) return;

  running = true;
  clearTimers();
  renderStep(1);
  advanceFrom(1);
}

function resetToIdle() {
  running = false;
  clearTimers();
  renderStep(0);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.code === "Space") {
    event.preventDefault();
    if (currentStep === flow.length - 1) {
      resetToIdle();
      return;
    }
    triggerFakeCapture();
  }

  if (event.key === "Escape") {
    resetToIdle();
  }
});

document.addEventListener("click", () => {
  if (currentStep === flow.length - 1) {
    resetToIdle();
    return;
  }
  triggerFakeCapture();
});

renderStep(0);
