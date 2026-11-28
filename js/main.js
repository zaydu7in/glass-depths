"use strict";

const introScreen = document.getElementById("intro-screen");
const expeditionScreen = document.getElementById("expedition-screen");
const expeditionTitle = document.getElementById("expedition-title");
const startButton = document.getElementById("start-expedition");
const searchButton = document.getElementById("search-vase");
const resetButton = document.getElementById("reset-expedition");
const sortInventoryButton = document.getElementById("sort-inventory");
const rarityFilter = document.getElementById("rarity-filter");
const vaseCount = document.getElementById("vase-count");
const vaseInventory = document.getElementById("vase-inventory");
const shardCount = document.getElementById("shard-count");
const attemptCount = document.getElementById("attempt-count");
const searchFeedback = document.getElementById("search-feedback");
const searchProgress = document.getElementById("search-progress");
const vaseDetails = document.getElementById("vase-details");
const vaseDetailsTitle = document.getElementById("vase-details-title");
const vaseDetailsText = document.getElementById("vase-details-text");
const closeVaseDetailsButton = document.getElementById("close-vase-details");

const VASE_FIND_CHANCE = 0.7;
const SHARD_FIND_CHANCE = 0.15;
const VASE_RARITIES = [
  { id: "common", weight: 0.7 },
  { id: "uncommon", weight: 0.25 },
  { id: "rare", weight: 0.05 },
];

const VASE_RARITY_LABELS = {
  common: "обычная",
  uncommon: "необычная",
  rare: "редкая",
};

const RARITY_SORT_ORDER = {
  rare: 0,
  uncommon: 1,
  common: 2,
};

const VASE_TYPE_DESCRIPTIONS = {
  "Шарообразная стеклянная ваза": "Округлая ваза с мягкими линиями, созданная для устойчивости в глубине шахты.",
  "Цилиндрическая стеклянная ваза": "Высокая ваза с ровными стенками, в которой свет отражается длинными полосами.",
  "Каплевидная стеклянная ваза": "Ваза с плавно сужающимся верхом, похожая на застывшую стеклянную каплю.",
};

const VASE_TYPES = [
  "Шарообразная стеклянная ваза",
  "Цилиндрическая стеклянная ваза",
  "Каплевидная стеклянная ваза",
];

const foundVases = [];
let foundShards = 0;
let searchAttempts = 0;
let searchTimer = null;
let isInventorySortedByRarity = false;
let lastSelectedVaseButton = null;
let selectedRarity = "all";

function rollVaseRarity(randomValue = Math.random()) {
  let upperBound = 0;
  for (const rarity of VASE_RARITIES) {
    upperBound += rarity.weight;
    if (randomValue < upperBound) {
      return rarity.id;
    }
  }

  return VASE_RARITIES[VASE_RARITIES.length - 1].id;
}

function showVaseDetails(type, rarity, button) {
  lastSelectedVaseButton = button;
  vaseDetailsText.textContent = `${type} — ${VASE_RARITY_LABELS[rarity]}. ${VASE_TYPE_DESCRIPTIONS[type]}`;
  vaseDetails.hidden = false;
  vaseDetailsTitle.focus();
}

function renderVaseInventory() {
  const groups = new Map();
  for (const vase of foundVases) {
    const key = `${vase.type}:${vase.rarity}`;
    const group = groups.get(key) ?? { ...vase, count: 0 };
    group.count += 1;
    groups.set(key, group);
  }

  let inventoryGroups = [...groups.values()];
  if (selectedRarity !== "all") {
    inventoryGroups = inventoryGroups.filter(({ rarity }) => rarity === selectedRarity);
  }
  if (isInventorySortedByRarity) {
    inventoryGroups.sort(
      (first, second) => RARITY_SORT_ORDER[first.rarity] - RARITY_SORT_ORDER[second.rarity],
    );
  }

  vaseInventory.replaceChildren();
  for (const { type, rarity, count } of inventoryGroups) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "inventory__item";
    button.type = "button";
    button.textContent = `${type} — ${VASE_RARITY_LABELS[rarity]} × ${count}`;
    button.addEventListener("click", () => showVaseDetails(type, rarity, button));
    item.append(button);
    vaseInventory.append(item);
  }
}

closeVaseDetailsButton.addEventListener("click", () => {
  vaseDetails.hidden = true;
  lastSelectedVaseButton?.focus();
});

rarityFilter.addEventListener("change", () => {
  selectedRarity = rarityFilter.value;
  vaseDetails.hidden = true;
  lastSelectedVaseButton = null;
  renderVaseInventory();
});

sortInventoryButton.addEventListener("click", () => {
  isInventorySortedByRarity = !isInventorySortedByRarity;
  sortInventoryButton.setAttribute("aria-pressed", String(isInventorySortedByRarity));
  sortInventoryButton.textContent = isInventorySortedByRarity
    ? "Вернуть порядок находок"
    : "Сортировать по редкости";
  renderVaseInventory();
});

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
      foundVases.push({ type: vaseType, rarity: rollVaseRarity() });
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
  vaseDetails.hidden = true;
  lastSelectedVaseButton = null;
  foundShards = 0;
  searchAttempts = 0;
  vaseCount.textContent = "0";
  shardCount.textContent = "0";
  attemptCount.textContent = "0";
  searchFeedback.textContent = "";
});
