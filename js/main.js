import { showScreen } from "./router.js";
import { gameState, resetGame, resetRound } from "./state.js";
import { PLACES } from "./data/places.js";

// Start in menu
showScreen("menu");
console.log("INIT STATE:", gameState);

// Test buttons
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
});

document.getElementById("btn-start").addEventListener("click", () => {
    if (!gameState.place) return;
    showScreen("game");
    console.log("STATE:", gameState);

    const titleEl = document.getElementById("game-title");
    titleEl.textContent = `${gameState.place.intro}`;

    console.log("Starting game with place:", gameState.place);
});

// Game -> End
document.getElementById("btn-finish-round").addEventListener("click", () => {
    showScreen("end");
    console.log("STATE:", gameState);
});

// End -> Menu (back-to-menu)
//     -> Map
/*document.getElementById("btn-end-to-menu").addEventListener("click", () => {
    showScreen("menu");
    console.log("STATE:", gameState);
});*/

document.getElementById("btn-replay").addEventListener("click", () => {
    showScreen("map");
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