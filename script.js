const DPAD = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  SELECT: "Enter"
};

const steps = [
  {
    state: "state-c",
    eyebrow: "Ready",
    title: "Check the chair before buying",
    copy: "Compare the chair footprint with your room, VR area, and pet routes.",
    facts: ["84 x 82 cm footprint", "Wheeled swivel base"],
    button: "Start"
  },
  {
    state: "state-a",
    eyebrow: "Placement A",
    title: "Desk area is risky",
    copy: "The wheels land near Katy's usual resting spot behind the desk.",
    facts: ["Pet risk: high", "Desk route crowded"],
    button: "Compare"
  },
  {
    state: "state-a",
    eyebrow: "VR space",
    title: "Open area drops 32%",
    copy: "This placement pushes into the clear movement zone used for VR.",
    facts: ["Before: 26.4 m2", "After: 17.9 m2"],
    button: "Next option"
  },
  {
    state: "state-b",
    eyebrow: "Placement B",
    title: "Sofa side is only okay",
    copy: "It looks natural, but it still creates a tight route around the rug.",
    facts: ["Visual fit: good", "Route: pinched"],
    button: "Next option"
  },
  {
    state: "state-c",
    eyebrow: "Placement C",
    title: "Window side is best",
    copy: "It preserves the VR zone and keeps the desk area clear for Katy.",
    facts: ["VR zone preserved", "Pet route safer"],
    button: "Recommend"
  },
  {
    state: "state-c",
    eyebrow: "Recommendation",
    title: "Buy it if it goes by the window",
    copy: "The chair fits your room, but placement matters because it has wheels.",
    facts: ["Best option: window", "Avoid: desk area"],
    button: "Restart"
  }
];

const viewport = document.getElementById("viewport");
const eyebrow = document.getElementById("eyebrow");
const title = document.getElementById("title");
const copy = document.getElementById("copy");
const facts = document.getElementById("facts");
const stepIndex = document.getElementById("stepIndex");
const selectBtn = document.getElementById("selectBtn");
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

  viewport.classList.remove("state-a", "state-b", "state-c");
  viewport.classList.add(step.state);
  eyebrow.textContent = step.eyebrow;
  title.textContent = step.title;
  copy.textContent = step.copy;
  stepIndex.textContent = `${currentStep + 1}/${steps.length}`;
  selectBtn.textContent = step.button;

  facts.innerHTML = "";
  step.facts.forEach((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    facts.appendChild(item);
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

function activatePrimary() {
  if (currentStep === steps.length - 1) {
    currentStep = 0;
    renderStep();
    return;
  }
  nextStep();
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
selectBtn.addEventListener("click", activatePrimary);

function updateClock() {
  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 1000);
renderStep();
selectBtn.focus();
