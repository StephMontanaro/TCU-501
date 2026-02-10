/**
 * Global game state.
 * All screens read/write from here.
 */
export const gameState = {
  screen: "menu",       // "menu" | "map" | "game" | "result"
  place: null,          // selected place object
  steps: [],            // current route steps: ["straight", "left", ...]
  stepIndex: 0,         // current step index
  trafficLight: null,   // "red" | "yellow" | "green" | null
  trafficShown: false
};

/**
 * Resets the round-related state.
 */
export function resetRound() {
  gameState.steps = [];
  gameState.stepIndex = 0;
  gameState.trafficLight = null;
  gameState.score = 0;
}

/**
 * Resets the whole game (back to menu).
 */
export function resetGame() {
  gameState.screen = "menu";
  gameState.place = null;
  resetRound();
}