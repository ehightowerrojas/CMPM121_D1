// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import fidgetSpinnerUrl from "./assets/FidgetSpinner.svg?no-inline";
import { calculateCPS, recordClick } from "./cps.ts";
import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

const title = document.createElement("h1");
title.textContent = "Fidget Spinner Simulator?";

const fidgetSpinnerImage = document.createElement("img");
fidgetSpinnerImage.src = fidgetSpinnerUrl;
fidgetSpinnerImage.alt = "An artisanally drawn forest green fidget spinner";
fidgetSpinnerImage.width = 200;
fidgetSpinnerImage.height = 200;

const subtext = document.createElement("p");
subtext.textContent =
  "Click the button to spin the fidget spinner! (Beware the background changes on each click)";

app.append(title, fidgetSpinnerImage, subtext);

//-----Button & Counter Logic-----//
console.log("Counter initialized.");

// Recurring Counter Creation
let hasItem = false;

// how many times has a user clicked item1
let item1ClickCount: number = 0;

// Counter Creation
let counter: number = 0;
let timerId: ReturnType<typeof setInterval> | null = null;
const counterElement = document.createElement("span");
counterElement.id = "counter";
counterElement.textContent = "0";

// Main Button Creation
const mainClickButton = document.createElement("button");
mainClickButton.className = "mainButton";
mainClickButton.id = "Increment";
mainClickButton.textContent = "Spin Me!";
Object.assign(mainClickButton.style, {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
});

// Item1 Button Creation
const item1Button = document.createElement("button");
item1Button.className = "itemButton";
item1Button.id = "Item1";
item1Button.textContent = "+1 CPS";
Object.assign(item1Button.style, {
  width: "100px",
  height: "50px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
});

app.append(mainClickButton, item1Button, counterElement);

// Clicking Logic
const item1BaseCost = 100;
const item1Growth = 1.13;
let item1Cost = item1BaseCost;

item1Button.addEventListener("click", () => {
  hasItem = true;
  item1ClickCount += 1;
  Item1Effect();
});
mainClickButton.addEventListener("click", () => {
  counter += 1;
  fidgetSpinnerImage.style.transform = "rotate(" + counter.toString() + "deg)";
  counterElement.textContent = counter.toString();
  document.body.style.backgroundColor = `hsl(${
    Math.floor(Math.random() * 360)
  }, 25%, 50%)`;
  recordClick();
});

//Displaying Clicks Per Second
const cpsElement = document.createElement("p");
app.append(cpsElement);

setInterval(() => {
  cpsElement.textContent = `${calculateCPS().toFixed(1)} clicks/sec`;
  updateItem1Cost();
}, 100);

//-----Spinner Physics-----//
let angle = 0; // current rotation in degrees
let velocity = 0; // degrees per second
const spinInpulse = 25; // speed added per click (deg/s)
const friction = 0.6; // fraction of speed lost per second (0..1)
const maxVelocity = 25000;
let passiveSpin = 0; // constant spin from items (deg/s)

let lastTime = performance.now();

function animate(now: number) {
  const dt = (now - lastTime) / 1000; // seconds since last frame
  lastTime = now;

  // Frame-rate-independent decay
  velocity *= Math.pow(1 - friction, dt);
  if (velocity < 1) velocity = 0;

  angle = (angle + (velocity + passiveSpin) * dt) % 360;
  fidgetSpinnerImage.style.transform = `rotate(${angle}deg)`;

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Hint to the browser that this element animates
fidgetSpinnerImage.style.willChange = "transform";

//-----Clicking Logic-----//
mainClickButton.addEventListener("click", () => {
  counter += 1;
  counterElement.textContent = counter.toString();
  velocity = Math.min(velocity + spinInpulse, maxVelocity);

  document.body.style.backgroundColor = `hsl(${
    Math.floor(Math.random() * 360)
  }, 25%, 50%)`;
  recordClick();
});

function updateItem1Cost() {
  const price = Math.ceil(item1Cost);
  item1Button.textContent = `+1 CPS (${price})`;
  item1Button.disabled = counter < price;
  item1Button.style.opacity = item1Button.disabled ? "0.5" : "1";
  item1Button.style.cursor = item1Button.disabled ? "not-allowed" : "pointer";
}

item1Button.addEventListener("click", () => {
  const price = Math.ceil(item1Cost);
  if (counter < price) return console.log("Not enough clicks to buy item 1");

  counter -= price; // deduct the cost from the counter
  counterElement.textContent = counter.toString();

  hasItem = true;
  item1ClickCount += 1;
  item1Cost *= item1Growth;
  Item1Effect();
  updateItem1Cost();
});

updateItem1Cost();

function Item1Effect() {
  if (timerId !== null) clearInterval(timerId);

  if (hasItem) {
    // Visual: a steady, smooth spin that scales with items owned
    passiveSpin = 30 * item1ClickCount;

    // Logic: the counter still ticks once per second
    timerId = setInterval(() => {
      counter += item1ClickCount;
      counterElement.textContent = counter.toString();
    }, 1000);
  } else {
    passiveSpin = 0;
    timerId = null;
  }
}
//-----------------------//
