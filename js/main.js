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

document.getElementById("btn-instructions").addEventListener("click", () => {
    showScreen("instructions");
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

    showScreen("game");
    console.log("STATE:", gameState);

    const titleEl = document.getElementById("game-title");

    console.log("Starting game with place:", gameState.place);

    renderCurrentStep();
});

document.getElementById("btn-left").addEventListener("click", () => {
    submitAnswer("left");
});

document.getElementById("btn-straight").addEventListener("click", () => {
    submitAnswer("straight");
});

document.getElementById("btn-right").addEventListener("click", () => {
    submitAnswer("right");
});

// Game -> End
document.getElementById("btn-complete").addEventListener("click", () => {
    showScreen("end");
    console.log("STATE:", gameState);
});

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

    // Outro
    if (gameState.stepIndex >= totalSteps) {
        outroEl.textContent = place.outro;

        // Hide direction buttons, show Complete button
        controlsEl.classList.add("hidden");
        completeBtn.classList.remove("hidden");
        return;
    }

    // Intro
    if (gameState.stepIndex === 0) {
        introEl.textContent = place.intro;
    }

    // Showing steps (0..totalSteps-1)
    const step = place.steps[gameState.stepIndex];
    const prefix = prefixFor(gameState.stepIndex);
    stepEl.textContent = `${prefix}, ${stepToText(step)}.`;
}