"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");
const searchButton = document.getElementById("search-vase");
const vaseCount = document.getElementById("vase-count");
const searchFeedback = document.getElementById("search-feedback");

let foundVases = 0;

startButton.addEventListener("click", () => {
  introScreen.hidden = true;
  expeditionScreen.hidden = false;
  expeditionTitle.focus();
});

searchButton.addEventListener("click", () => {
  foundVases += 1;
  vaseCount.textContent = String(foundVases);
  searchFeedback.textContent = `Последняя находка: стеклянная ваза № ${foundVases}.`;
});
