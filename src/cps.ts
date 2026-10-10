// Calculates Clicks Per Second
const clickTime: number[] = [];
let ms = 1000;

// Recording player clicks
export function recordClick() {
  clickTime.push(performance.now());
  // Implementation for calculating clicks per second
}

// Now, based off the players last few clicks, we calculate an everchanging cps
export function calculateCPS() {
  const now = performance.now();
  const relevantClicks = clickTime.filter((time) => now - time < ms);
  return relevantClicks.length / (ms / 1000);
}
