"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");
const searchButton = document.getElementById("search-vase");
const resetButton = document.getElementById("reset-expedition");
const vaseCount = document.getElementById("vase-count");
const searchFeedback = document.getElementById("search-feedback");

const VASE_FIND_CHANCE = 0.7;

let foundVases = 0;
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
  searchTimer = setTimeout(() => {
    if (Math.random() < VASE_FIND_CHANCE) {
      foundVases += 1;
      vaseCount.textContent = String(foundVases);
      searchFeedback.textContent = `Последняя находка: стеклянная ваза № ${foundVases}.`;
    } else {
      searchFeedback.textContent = "Поиск завершён: вазы не найдены. Попробуйте ещё раз.";
    }
    searchTimer = null;
    searchButton.removeAttribute("aria-disabled");
  }, 300);
});

resetButton.addEventListener("click", () => {
  clearTimeout(searchTimer);
  searchTimer = null;
  searchButton.removeAttribute("aria-disabled");
  foundVases = 0;
  vaseCount.textContent = "0";
  searchFeedback.textContent = "";
});
