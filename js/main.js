"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");

startButton.addEventListener("click", () => {
  introScreen.hidden = true;
  expeditionScreen.hidden = false;
  expeditionTitle.focus();
});
