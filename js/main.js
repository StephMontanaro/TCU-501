import { showScreen } from "./router.js";

// Start in menu
showScreen("menu");

// Test buttons
// Play -> Map
//      -> Instructions
document.getElementById("btn-play").addEventListener("click", () => {
  showScreen("map");
});

document.getElementById("btn-instructions").addEventListener("click", () => {
  showScreen("instructions");
});

// Map -> Menu
//     -> Game
document.getElementById("btn-back-to-menu").addEventListener("click", () => {
  showScreen("menu");
});

document.getElementById("btn-start").addEventListener("click", () => {
  showScreen("game");
});

// Game -> End
document.getElementById("btn-finish-round").addEventListener("click", () => {
  showScreen("end");
});

// End -> Menu
//     -> Map
document.getElementById("btn-end-to-menu").addEventListener("click", () => {
  showScreen("menu");
});

document.getElementById("btn-replay").addEventListener("click", () => {
  showScreen("map");
});