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

const VASE_TYPES = [
  "Шарообразная стеклянная ваза",
  "Цилиндрическая стеклянная ваза",
  "Каплевидная стеклянная ваза",
  "Эллиптическая стеклянная ваза",
];

const foundVases = [];
let foundShards = 0;
let searchAttempts = 0;
let searchTimer = null;

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
      const vase = `${VASE_TYPES[0]} № ${foundVases.length + 1}`;
      foundVases.push(vase);
      vaseCount.textContent = String(foundVases.length);

      const item = document.createElement("li");
      item.textContent = vase;
      vaseInventory.append(item);
      searchFeedback.textContent = `Последняя находка — ${vase}.`;
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
