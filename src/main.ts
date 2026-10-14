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

//Displaying Clicks Per Second
const cpsElement = document.createElement("p");

app.append(counterElement, cpsElement, mainClickButton);

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
  },
];

for (
  let curButtonIndex = 0;
  curButtonIndex < buttons.length;
  curButtonIndex++
) {
  buttons[curButtonIndex].nameText.textContent = buttons[curButtonIndex].name;
  buttons[curButtonIndex].nameText.style.margin = "-2px";

  buttons[curButtonIndex].descText.style.whiteSpace = "pre-line";
  buttons[curButtonIndex].descText.textContent = buttons[curButtonIndex].desc +
    "\n0 owned";
  buttons[curButtonIndex].descText.style.margin = "-10px";

  buttons[curButtonIndex].button.className = "itemButton";
  buttons[curButtonIndex].button.id = buttons[curButtonIndex].name;
  buttons[curButtonIndex].button.textContent = "" +
    buttons[curButtonIndex].currentPrice + " clicks";

  Object.assign(buttons[curButtonIndex].button.style, {
    backgroundColor: "red",
    width: "100px",
    height: "50px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  });

  buttons[curButtonIndex].nameText.style.display = "none";
  buttons[curButtonIndex].descText.style.display = "none";
  buttons[curButtonIndex].button.style.display = "none";

  app.append(
    buttons[curButtonIndex].nameText,
    buttons[curButtonIndex].descText,
    buttons[curButtonIndex].button,
  );
}

ItemsUpdate();

for (
  let curButtonIndex = 0;
  curButtonIndex < buttons.length;
  curButtonIndex++
) {
  buttons[curButtonIndex].button.addEventListener("click", () => {
    if (counter >= buttons[curButtonIndex].currentPrice) {
      counter -= buttons[curButtonIndex].currentPrice;
      buttons[curButtonIndex].currentPrice +=
        buttons[curButtonIndex].priceIncreaseValue;
      buttons[curButtonIndex].currentNumOwned++;
      buttons[curButtonIndex].descText.textContent =
        buttons[curButtonIndex].desc +
        "\n" + buttons[curButtonIndex].currentNumOwned + " owned";
      buttons[curButtonIndex].button.textContent = "" +
        buttons[curButtonIndex].currentPrice + " clicks";
      additionalCPS += buttons[curButtonIndex].cps;
      counterElement.textContent = counter.toFixed(1);
    }
  });
}

mainClickButton.addEventListener("click", () => {
  counter += 1 + additionalCPS / 10;
  fidgetSpinnerImage.style.transform = "rotate(" + counter.toString() + "deg)";
  counterElement.textContent = counter.toFixed(1);
  document.body.style.backgroundColor = `hsl(${
    Math.floor(Math.random() * 360)
  }, 25%, 50%)`;
  recordClick();
});

setInterval(() => {
  cpsElement.textContent = `${
    (calculateCPS() + additionalCPS).toFixed(1)
  } clicks/sec`;
}, 100);

function ItemsUpdate() {
  if (timerId !== null) {
    clearInterval(timerId);
  }
  timerId = setInterval(() => {
    counter += additionalCPS / 100;
    fidgetSpinnerImage.style.transform = "rotate(" + counter.toString() +
      "deg)";
    console.log(counter);
    if (counterElement) {
      counterElement.textContent = counter.toFixed(1);
    }

    for (
      let curButtonIndex = 0;
      curButtonIndex < buttons.length;
      curButtonIndex++
    ) {
      if (counter >= buttons[curButtonIndex].currentPrice) {
        buttons[curButtonIndex].nameText.style.display = "block";
        buttons[curButtonIndex].descText.style.display = "block";
        buttons[curButtonIndex].button.style.display = "block";
        Object.assign(buttons[curButtonIndex].button.style, {
          backgroundColor: "green",
        });
      } else {
        Object.assign(buttons[curButtonIndex].button.style, {
          backgroundColor: "red",
        });
      }
    }
  }, 10);
}
//-----------------------//
