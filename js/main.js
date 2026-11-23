"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");
const searchButton = document.getElementById("search-vase");
const resetButton = document.getElementById("reset-expedition");
const vaseCount = document.getElementById("vase-count");
const vaseInventory = document.getElementById("vase-inventory");
const shardCount = document.getElementById("shard-count");
const attemptCount = document.getElementById("attempt-count");
const searchFeedback = document.getElementById("search-feedback");
const searchProgress = document.getElementById("search-progress");

const VASE_FIND_CHANCE = 0.7;
const SHARD_FIND_CHANCE = 0.15;
const DEFAULT_VASE_RARITY = "common";

const VASE_TYPES = [
  "Шарообразная стеклянная ваза",
  "Цилиндрическая стеклянная ваза",
  "Каплевидная стеклянная ваза",
];

const foundVases = [];
let foundShards = 0;
let searchAttempts = 0;
let searchTimer = null;

function renderVaseInventory() {
  const counts = new Map();
  for (const vase of foundVases) {
    counts.set(vase.type, (counts.get(vase.type) ?? 0) + 1);
  }

  vaseInventory.replaceChildren();
  for (const [type, count] of counts) {
    const item = document.createElement("li");
    item.textContent = `${type} × ${count}`;
    vaseInventory.append(item);
  }
}

startButton.addEventListener("click", () => {
  introScreen.hidden = true;
  expeditionScreen.hidden = false;
  expeditionTitle.focus();
});

searchButton.addEventListener("click", () => {
  if (searchTimer !== null) {
    return;
  }

  searchButton.setAttribute("aria-disabled", "true");
  searchProgress.hidden = false;
  searchTimer = setTimeout(() => {
    searchAttempts += 1;
    attemptCount.textContent = String(searchAttempts);
    const searchRoll = Math.random();
    if (searchRoll < VASE_FIND_CHANCE) {
      const vaseType = VASE_TYPES[Math.floor(Math.random() * VASE_TYPES.length)];
      foundVases.push({ type: vaseType, rarity: DEFAULT_VASE_RARITY });
      vaseCount.textContent = String(foundVases.length);
      renderVaseInventory();
      searchFeedback.textContent = `Последняя находка — ${vaseType} № ${foundVases.length}.`;
    } else if (searchRoll < VASE_FIND_CHANCE + SHARD_FIND_CHANCE) {
      const shards = 1 + Math.floor(Math.random() * 3);
      foundShards += shards;
      shardCount.textContent = String(foundShards);
      searchFeedback.textContent = `Последняя находка: стеклянные осколки (+${shards}).`;
    } else {
      searchFeedback.textContent = "Поиск завершён: ничего не найдено. Попробуйте ещё раз.";
    }
    searchTimer = null;
    searchButton.removeAttribute("aria-disabled");
    searchProgress.hidden = true;
  }, 300);
});

resetButton.addEventListener("click", () => {
  clearTimeout(searchTimer);
  searchTimer = null;
  searchButton.removeAttribute("aria-disabled");
  searchProgress.hidden = true;
  foundVases.length = 0;
  vaseInventory.replaceChildren();
  foundShards = 0;
  searchAttempts = 0;
  vaseCount.textContent = "0";
  shardCount.textContent = "0";
  attemptCount.textContent = "0";
  searchFeedback.textContent = "";
});
