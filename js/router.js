export function showScreen(screenName) {
  // Hide all screens
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => screen.classList.add("hidden"));

  // Show the requested screen
  const target = document.getElementById(`screen-${screenName}`);
  if (!target) {
    throw new Error(`Screen not found: ${screenName}`);
  }
  target.classList.remove("hidden");
}