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

// Counter Creation
let counter: number = 0;
const counterElement = document.createElement("span");
counterElement.id = "counter";
counterElement.textContent = "0";

//Button Creation
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

app.append(mainClickButton, counterElement);

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
}, 100);
//-----------------------//
