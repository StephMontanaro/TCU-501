/**
 * Places available in the game.
 * Each place has a fixed route and fixed texts.
 */
export const PLACES = [
  // 1 instruction (easy)
  {
    id: "hospital",
    name: "Hospital",
    difficulty: 1,
    intro: "The hospital is across from the bank.",
    steps: ["straight", "right"],
    outro: "There it is, the hospital. Great job!",
    trafficLight: false
  },
  {
    id: "grocery-store",
    name: "Grocery Store",
    difficulty: 1,
    intro: "The grocery store is across from the park.",
    steps: ["straight", "left"],
    outro: "There it is, the grocery store. Good job!",
    trafficLight: false
  },

  // 2 instructions (medium)
  {
    id: "school",
    name: "School",
    difficulty: 2,
    intro: "The school is next to the park.",
    steps: ["straight", "left", "right"],
    outro: "There it is, the school. You did it!",
    trafficLight: false
  },
  {
    id: "police-station",
    name: "Police Station",
    difficulty: 2,
    intro: "The police station is across from the school.",
    steps: ["straight", "left", "left"],
    outro: "Here it is, the police station. Awesome!",
    trafficLight: false
  },

  // 1 instruction + traffic light (easy + action)
  {
    id: "bank",
    name: "Bank",
    difficulty: 3,
    intro: "The bank is next to the park.",
    steps: ["right"],
    outro: "There it is, the bank. Amazing!",
    trafficLight: true
  },
  {
    id: "park",
    name: "Park",
    difficulty: 3,
    intro: "The park is next to the school.",
    steps: ["left"],
    outro: "There it is, the park. Excellent!",
    trafficLight: true
  }
];

/**
 * Finds a place by its id.
 * @param {string} id
 * @returns {object|null}
 */
export function getPlaceById(id) {
  return PLACES.find((p) => p.id === id) ?? null;
}

/**
 * Returns places filtered by difficulty.
 * @param {number} difficulty
 * @returns {object[]}
 */
export function getPlacesByDifficulty(difficulty) {
  return PLACES.filter((p) => p.difficulty === difficulty);
}