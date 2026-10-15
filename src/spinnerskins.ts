import spinner0 from "./assets/FidgetSpinner.svg?no-inline";
import spinner1 from "./assets/the-soldier-fidget-spinner-color-image-26.png?no-inline";
import spinner2 from "./assets/169-1691761_spinner-png-free-download-metal-fidget-fidget-spinner-removebg-preview.png?no-inline";
import spinner3 from "./assets/52823-5-rainbow-fidget-spinner-picture-png-file-hd.png?no-inline";
import spinner4 from "./assets/52210-8-rainbow-fidget-spinner-images-download-hd-png.png?no-inline";
import spinner5 from "./assets/106-1069842_rainbow-fidget-spinner-png-transparent-image-fidget-spinners-removebg-preview.png?no-inline";
import spinner6 from "./assets/images-removebg-preview.png?no-inline";

const spinnerTiers = [
  { minCPS: 0, url: spinner0, name: "Green Ms Paint" },
  { minCPS: 13, url: spinner1, name: "Blue Camo" },
  { minCPS: 240, url: spinner2, name: "Gold" },
  { minCPS: 490, url: spinner3, name: "Rainbow" },
  { minCPS: 1150, url: spinner4, name: "Spiky Rainbow" },
  { minCPS: 2500, url: spinner5, name: "Dollar Sign" },
  { minCPS: 10000, url: spinner6, name: "Dragon" },
];

let currentTier = 0;

// Set up the spinner image with the starting skin.
export function initSpinnerSkin(img: HTMLImageElement) {
  currentTier = 0;
  img.src = spinnerTiers[0].url;
  img.alt = `A ${spinnerTiers[0].name} fidget spinner`;
  img.style.objectFit = "contain";
}

// Upgrade the spinner if the player has reached a new tier
export function updateSpinnerSkin(img: HTMLImageElement, cps: number) {
  let tier = currentTier;
  while (
    tier + 1 < spinnerTiers.length &&
    cps >= spinnerTiers[tier + 1].minCPS
  ) {
    tier++;
  }
  if (tier === currentTier) return;

  currentTier = tier;
  img.src = spinnerTiers[tier].url;
  img.alt = `A ${spinnerTiers[tier].name} fidget spinner`;

  img.animate(
    [{ scale: "1" }, { scale: "1.3" }, { scale: "1" }],
    { duration: 400, easing: "ease-out" },
  );
}
