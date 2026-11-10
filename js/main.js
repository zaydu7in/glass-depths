"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");
const searchButton = document.getElementById("search-vase");
const resetButton = document.getElementById("reset-expedition");
const vaseCount = document.getElementById("vase-count");
const shardCount = document.getElementById("shard-count");
const attemptCount = document.getElementById("attempt-count");
const searchFeedback = document.getElementById("search-feedback");
const searchProgress = document.getElementById("search-progress");

const VASE_FIND_CHANCE = 0.7;
const SHARD_FIND_CHANCE = 0.15;

let foundVases = 0;
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
      foundVases += 1;
      vaseCount.textContent = String(foundVases);
      searchFeedback.textContent = `Последняя находка: стеклянная ваза № ${foundVases}.`;
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
  foundVases = 0;
  foundShards = 0;
  searchAttempts = 0;
  vaseCount.textContent = "0";
  shardCount.textContent = "0";
  attemptCount.textContent = "0";
  searchFeedback.textContent = "";
});
