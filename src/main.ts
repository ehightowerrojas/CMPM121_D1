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
subtext.style.whiteSpace = "pre-line";
subtext.style.textAlign = "center";
subtext.textContent =
  "Click the button to spin the fidget spinner! (Beware the background changes on each click)\n(oh also your clicks gain 10% of your item's clicks/sec)";

app.append(title, fidgetSpinnerImage, subtext);

//-----Button & Counter Logic-----//
console.log("Counter initialized.");

// Counter Creation
let counter: number = 0;
let additionalCPS: number = 0;
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

// Displaying Clicks Per Second
const cpsElement = document.createElement("p");

app.append(counterElement, cpsElement, mainClickButton);

//-----Spinner Physics-----//
let angle = 0; // current rotation in degrees
let velocity = 0; // degrees per second
const spinImpulse = 25; // speed added per click (deg/s)
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

//-----Items-----//
const buttons = [
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "finger",
    desc: "An extra finger to help spin the spinner :D",
    cps: 1,
    currentPrice: 10,
    priceIncreaseValue: 5,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "hand",
    desc: "Why one finger when you can have a whole hand!",
    cps: 5,
    currentPrice: 50,
    priceIncreaseValue: 10,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "octopus",
    desc: "They're really good at this. Like, too good.",
    cps: 25,
    currentPrice: 1000,
    priceIncreaseValue: 100,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "two octopus",
    desc: "I mean, yeah I guess. Wait is it octopuses or octopi?",
    cps: 50,
    currentPrice: 2000,
    priceIncreaseValue: 200,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "fast-finger Johnny",
    desc: "This guy's got some MEAN spinnin' digits.",
    cps: 500,
    currentPrice: 10000,
    priceIncreaseValue: 2000,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "1961 Ferrari GT",
    desc: "like that Ferris Bueller scene! ... Bueller? Bueller?",
    cps: 2500,
    currentPrice: 100000,
    priceIncreaseValue: 100000,
    currentNumOwned: 0,
    unlocked: false,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "the Earth",
    desc: "rotates pretty fast when you think about it :o",
    cps: 10000,
    currentPrice: 750000,
    priceIncreaseValue: 500000,
    currentNumOwned: 0,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "faster-finger Joanne",
    desc: "Johnny WISHES he was her.",
    cps: 100000,
    currentPrice: 2000000,
    priceIncreaseValue: 1000000,
    currentNumOwned: 0,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "Cthulhu",
    desc: "When you think about it, it's just a really big octopus!",
    cps: 1000000,
    currentPrice: 7500000,
    priceIncreaseValue: 1500000,
    currentNumOwned: 0,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "some 2016 middle-schooler",
    desc: "too cool for school (or linear time).",
    cps: 9999999,
    currentPrice: 99999999,
    priceIncreaseValue: 9999999,
    currentNumOwned: 0,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "the universe",
    desc: "it's just spinning around, man",
    cps: 99999999,
    currentPrice: 999999999,
    priceIncreaseValue: 99999999,
    currentNumOwned: 0,
  },
  {
    nameText: document.createElement("h1"),
    descText: document.createElement("p"),
    button: document.createElement("button"),
    name: "30 middle-schoolers",
    desc: "30 times more spinning",
    cps: 999999999,
    currentPrice: 9999999999,
    priceIncreaseValue: 999999999,
    currentNumOwned: 0,
  }
];

// Adding a shop grid where users can see all purchasable items
const shopGrid = document.createElement("div");
shopGrid.className = "shopGrid";
app.append(shopGrid);

function renderItem(item: typeof buttons[number]) {
  const card = item.button.parentElement!;
  if (item.unlocked) {
    card.classList.remove("locked");
    item.nameText.textContent = item.name;
    item.descText.textContent = item.desc + "\n" + item.currentNumOwned +
      " owned";
    item.button.textContent = item.currentPrice + " clicks";
    item.button.disabled = counter < item.currentPrice; //Check if the player can afford the item
  } else {
    card.classList.add("locked");
    item.nameText.textContent = "???";
    item.descText.textContent = `Unlock at ${item.currentPrice} clicks`;
    item.button.textContent = "locked";
    item.button.disabled = true;
  }
}

for (const item of buttons) {
  const card = document.createElement("div");
  card.className = "itemCard";

  item.button.className = "itemButton";
  item.button.id = item.name;
  item.descText.style.whiteSpace = "pre-line";

  item.button.addEventListener("click", () => {
    if (!item.unlocked || counter < item.currentPrice) return;

    counter -= item.currentPrice;
    item.currentPrice += item.priceIncreaseValue;
    item.currentNumOwned++;
    additionalCPS += item.cps;
    counterElement.textContent = counter.toFixed(1);
    passiveSpin = Math.min(additionalCPS * 30, 3000);

    renderItem(item);
  });

  card.append(item.nameText, item.descText, item.button);
  shopGrid.append(card);
  renderItem(item);
}

//-----Main Click-----//
mainClickButton.addEventListener("click", () => {
  counter += 1 + additionalCPS / 10;
  counterElement.textContent = counter.toFixed(1);
  velocity = Math.min(velocity + spinImpulse, maxVelocity);

  document.body.style.backgroundColor = `hsl(${
    Math.floor(Math.random() * 360)
  }, 25%, 50%)`;
  recordClick();
});

//-----CPS Display-----//
setInterval(() => {
  cpsElement.textContent = `${
    (calculateCPS() + additionalCPS).toFixed(1)
  } clicks/sec`;
}, 100);

//-----Passive Income + Shop State-----//
function ItemsUpdate() {
  if (timerId !== null) clearInterval(timerId);

  timerId = setInterval(() => {
    counter += additionalCPS / 100; // 10ms tick → 100 ticks/sec
    counterElement.textContent = counter.toFixed(1);

    for (const item of buttons) {
      if (!item.unlocked && counter >= item.currentPrice) {
        item.unlocked = true; // permanent reveal
      }
      renderItem(item);
    }
  }, 10); // 10ms tick → 100 ticks/sec
}

ItemsUpdate();
//-----------------------//
