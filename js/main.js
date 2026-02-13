import { showScreen } from "./router.js";
import { gameState, resetGame, resetRound } from "./state.js";
import { PLACES } from "./data/places.js";

// Start in menu
showScreen("menu");
console.log("INIT STATE:", gameState);

// Play -> Map
//      -> Instructions
document.getElementById("btn-play").addEventListener("click", () => {
    showScreen("map");
    renderPlaceButtons();
    console.log("STATE:", gameState);
    console.log("PLACES:", PLACES);
});

const INSTRUCTIONS = {
    es: [
        "Elige a dónde te diriges.",
        "Escucha con cuidado las direcciones.",
        "Sigue cada instrucción haciendo clic en la opción correcta hasta llegar a tu destino."
    ],
    en: [
        "Choose where you are going.",
        "Listen carefully to the directions.",
        "Follow each instruction by clicking the correct option until you reach your destination."
    ]
};

document.getElementById("btn-instructions").addEventListener("click", () => {
    showScreen("instructions");
    renderInstructionsScreen();
    console.log("STATE:", gameState);
});

// Map -> Menu
//     -> Game
document.addEventListener("click", (e) => {
    const action = e.target?.dataset?.action;
    if (!action) return;

    if (action === "back-to-menu") {
        showScreen("menu");
        console.log("STATE:", gameState);
    }

    if (action === "replay") {
        gameState.place = null;
        gameState.stepIndex = 0;

        showScreen("map");
        renderPlaceButtons();

        const sel = document.getElementById("map-selection");
        if (sel) sel.textContent = "";

        console.log("REPLAY -> STATE:", gameState);
    }
});

document.getElementById("btn-start").addEventListener("click", () => {
    if (!gameState.place) return;

    // Start round
    gameState.stepIndex = 0;
    gameState.trafficLight = null;
    gameState.trafficShown = false;

     if (gameState.place.trafficLight) {
        selectRandomColor();
     }

    showScreen("game");
    console.log("STATE:", gameState);

    const titleEl = document.getElementById("game-title");

    console.log("Starting game with place:", gameState.place);

    renderCurrentStep();
});

// Choose the color of the traffic light
function selectRandomColor(){
    const lights = ["red", "yellow", "green"];
    gameState.trafficLight = lights[Math.floor(Math.random() * lights.length)];
}

document.getElementById("btn-left").addEventListener("click", () => {
    submitAnswer("left");
});

document.getElementById("btn-straight").addEventListener("click", () => {
    submitAnswer("straight");
});

document.getElementById("btn-right").addEventListener("click", () => {
    submitAnswer("right");
});

document.getElementById("btn-go").addEventListener("click", () => {
    submitTrafficAnswer("go");
});

document.getElementById("btn-careful").addEventListener("click", () => {
    submitTrafficAnswer("careful");
});

document.getElementById("btn-stop").addEventListener("click", () => {
    submitTrafficAnswer("stop");
});

// Game -> End
document.getElementById("btn-complete").addEventListener("click", () => {
    showScreen("end");
    console.log("STATE:", gameState);
});

// Show instructions in english and spanish
function renderInstructionsScreen() {
    const esList = document.getElementById("instructions-es");
    const enList = document.getElementById("instructions-en");

    esList.innerHTML = "";
    enList.innerHTML = "";

    INSTRUCTIONS.es.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        esList.appendChild(li);
    });

  INSTRUCTIONS.en.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        enList.appendChild(li);
    });
}

// Show list of possible destiantions
function renderPlaceButtons() {
    const placeListEl = document.getElementById("place-list");
    const startBtn = document.getElementById("btn-start");

    placeListEl.innerHTML = "";
    startBtn.disabled = true;
    gameState.place = null;

    PLACES.forEach((place) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = place.name;

        btn.addEventListener("click", () => {
            // Save place selected
            gameState.place = place;

            document.getElementById("map-selection").innerHTML =
                `Selected destination: ${place.name}<br>
                Difficulty: ${place.difficulty}`;

            startBtn.disabled = false;
        });
        placeListEl.appendChild(btn);
    });
}

// Aswers for the directions
function submitAnswer(answer) {
    const place = gameState.place;
    if (!place) return;

    const totalSteps = place.steps.length;

    // If not more steps left, ignore clicks
    if (gameState.stepIndex >= totalSteps) return;

    const correct = place.steps[gameState.stepIndex];

    // Wrong answer: do nothing
    if (answer !== correct) return;

    // Right answer: show next direction
    gameState.stepIndex += 1;
    renderCurrentStep();
}

// Aswers for the traffic light
function submitTrafficAnswer(answer) {
  if (!gameState.trafficLight || gameState.trafficShown) return;

  let correctAnswer = "";

  if (gameState.trafficLight === "red") correctAnswer = "stop";
  if (gameState.trafficLight === "yellow") correctAnswer = "careful";
  if (gameState.trafficLight === "green") correctAnswer = "go";

  // Wrong answer: do nothing
  if (answer !== correctAnswer) return;

  // Right answer: mark semaphore and show next direction
  gameState.trafficShown = true;
  renderCurrentStep();
}

// Instructions for each step
function stepToText(step) {
    if (step === "left") return "turn left";
    if (step === "right") return "turn right";
    if (step === "straight") return "go straight";
    return step;
}

// Add prepositions to each instruction
function prefixFor(index) {
    if (index === 0) return "First";
    if (index === 1) return "Then";
    return "Next";
}

// Show current step
function renderCurrentStep() {
    const introEl = document.getElementById("game-intro");
    const stepEl = document.getElementById("game-step");
    const outroEl = document.getElementById("game-outro");

    const trafficEl = document.getElementById("game-traffic");
    const trafficControls = document.getElementById("traffic-controls");

    // Buttons
    const controlsEl = document.getElementById("game-controls");
    const completeBtn = document.getElementById("btn-complete");

    const place = gameState.place;
    if (!place) return;

    const totalSteps = place.steps.length;

    // Reset texts
    introEl.textContent = "";
    stepEl.textContent = "";
    outroEl.textContent = "";

    // Show direction buttons, hide Complete button
    controlsEl.classList.remove("hidden");
    completeBtn.classList.add("hidden");

    // Reset traffic ligth text
    trafficEl.classList.add("hidden");
    trafficControls.classList.add("hidden");
    trafficEl.textContent = "";

    // Intro
    if (gameState.stepIndex === 0) {
        introEl.textContent = place.intro;
    }

    // Trafic Light instruction
    if (gameState.trafficLight && !gameState.trafficShown) {
    controlsEl.classList.add("hidden");
    completeBtn.classList.add("hidden");

    trafficEl.textContent = `The light is ${gameState.trafficLight.toUpperCase()} now.`;
    trafficEl.classList.remove("hidden");

    trafficControls.classList.remove("hidden");
    return;
  }

    // Outro
    if (gameState.stepIndex >= totalSteps) {
        outroEl.textContent = place.outro;

        // Hide direction buttons, show Complete button
        controlsEl.classList.add("hidden");
        completeBtn.classList.remove("hidden");
        return;
    }

    // Showing steps (0..totalSteps-1)
    const step = place.steps[gameState.stepIndex];
    const prefix = prefixFor(gameState.stepIndex);
    stepEl.textContent = `${prefix}, ${stepToText(step)}.`;
}