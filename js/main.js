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

document.getElementById("btn-next-step").addEventListener("click", () => {
    gameState.stepIndex += 1;
     renderCurrentStep();
});

// Game -> End
document.getElementById("btn-finish-round").addEventListener("click", () => {
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
    const nextBtn = document.getElementById("btn-next-step");

    const place = gameState.place;
    if (!place) return;

    const totalSteps = place.steps.length;

    // Reset texts
    introEl.textContent = "";
    stepEl.textContent = "";
    outroEl.textContent = "";

    // State A: Showing steps (0..totalSteps-1)
    if (gameState.stepIndex < totalSteps) {
        // Show intro with the first step
        if (gameState.stepIndex === 0) {
            introEl.textContent = place.intro;
        }

        const step = place.steps[gameState.stepIndex];
        const prefix = prefixFor(gameState.stepIndex);
        stepEl.textContent = `${prefix}, ${stepToText(step)}.`;

        nextBtn.textContent = "Next";
        nextBtn.disabled = false;
        return;
    }

    // State B: Outro
    if (gameState.stepIndex === totalSteps) {
        outroEl.textContent = place.outro;

        nextBtn.textContent = "Complete";
        nextBtn.disabled = false;
        return;
    }

    // State C: Complete
    showScreen("end");
}