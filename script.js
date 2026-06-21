const DPAD = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  SELECT: "Enter"
};

const steps = [
  {
    state: "state-idle",
    label: "Standby",
    title: "Point at the chair",
    copy: "\"Hey Meta, what do you think about this?\"",
    signals: ["Gaze target ready", "Waiting for prompt"],
    button: "Ask",
    spoken: "Point at the chair and ask what do you think about this."
  },
  {
    state: "state-listen",
    label: "Prompt received",
    title: "Question understood",
    copy: "Looking at the chair in front of you.",
    signals: ["Intent: opinion", "Object: chair"],
    button: "Capture",
    spoken: "Question understood. I am looking at the chair."
  },
  {
    state: "state-capture",
    label: "Simulated capture",
    title: "Chair framed",
    copy: "Photo proxy locked for this Web App prototype.",
    signals: ["Full chair visible", "Base and wheels seen"],
    button: "Analyze",
    spoken: "The chair is framed. I can see the base and wheels."
  },
  {
    state: "state-analyze",
    label: "Analysis",
    title: "Large, soft, wheeled",
    copy: "Comfort looks strong. The rolling base is the thing to think about.",
    signals: ["Comfort: high", "Movement risk: medium"],
    button: "Answer",
    spoken: "It looks comfortable, but the rolling base changes the recommendation."
  },
  {
    state: "state-answer",
    label: "Voice answer",
    title: "Yes, with placement care",
    copy: "It suits the room if it stays away from tight desk and pet routes.",
    signals: ["Buy: maybe yes", "Place: open area"],
    button: "Speak",
    spoken: "I like it, but only if you place it in an open area. The wheels make tight routes risky."
  }
];

const scene = document.getElementById("scene");
const label = document.getElementById("label");
const title = document.getElementById("title");
const copy = document.getElementById("copy");
const signals = document.getElementById("signals");
const stepCount = document.getElementById("stepCount");
const primaryBtn = document.getElementById("primaryBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const clock = document.getElementById("clock");

let currentStep = 0;

function clampStep(value) {
  if (value < 0) return steps.length - 1;
  if (value >= steps.length) return 0;
  return value;
}

function renderStep() {
  currentStep = clampStep(currentStep);
  const step = steps[currentStep];

  scene.className = `scene ${step.state}`;
  label.textContent = step.label;
  title.textContent = step.title;
  copy.textContent = step.copy;
  stepCount.textContent = `${currentStep + 1}/${steps.length}`;
  primaryBtn.textContent = step.button;

  signals.innerHTML = "";
  step.signals.forEach((signal) => {
    const item = document.createElement("li");
    item.textContent = signal;
    signals.appendChild(item);
  });
}

function nextStep() {
  currentStep = clampStep(currentStep + 1);
  renderStep();
}

function prevStep() {
  currentStep = clampStep(currentStep - 1);
  renderStep();
}

function speakCurrentStep() {
  const text = steps[currentStep].spoken;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.03;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function activatePrimary() {
  if (currentStep === steps.length - 1) {
    speakCurrentStep();
    return;
  }

  nextStep();
  speakCurrentStep();
}

function getFocusables() {
  return Array.from(document.querySelectorAll(".focusable:not([disabled])"));
}

function moveFocus(direction) {
  const focusables = getFocusables();
  const activeIndex = focusables.indexOf(document.activeElement);
  const fallbackIndex = direction === "left" || direction === "up" ? focusables.length - 1 : 0;

  if (activeIndex === -1) {
    focusables[fallbackIndex].focus();
    return;
  }

  const delta = direction === "left" || direction === "up" ? -1 : 1;
  const nextIndex = (activeIndex + delta + focusables.length) % focusables.length;
  focusables[nextIndex].focus();
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case DPAD.LEFT:
    case DPAD.UP:
      moveFocus("left");
      event.preventDefault();
      break;
    case DPAD.RIGHT:
    case DPAD.DOWN:
      moveFocus("right");
      event.preventDefault();
      break;
    case DPAD.SELECT:
      if (document.activeElement.classList.contains("focusable")) {
        document.activeElement.click();
      } else {
        activatePrimary();
      }
      event.preventDefault();
      break;
    default:
      break;
  }
});

prevBtn.addEventListener("click", prevStep);
nextBtn.addEventListener("click", nextStep);
primaryBtn.addEventListener("click", activatePrimary);

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);
renderStep();
primaryBtn.focus();
