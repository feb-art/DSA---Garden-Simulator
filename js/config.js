// Game state, crop data, and the default hierarchical tree template

const APP_VERSION = "0.4.0";

let pyodideInstance = null;

let gardenPlants = {}; // pos -> { name, stage (1-4), ready (bool) }

let displayActionHistory = [];

let currentCoins = 100;

let currentWater = 100;

let currentSeeds = 10;

let currentEnergy = 60;

let currentHope = 50;

let currentTreeData = null;

let isTraversing = false;

// PER-CROP SEED STOCK INVENTORY STATE
let cropSeeds = {
  "Eggplant": 2,
  "Tomato": 2,
  "Carrot": 2,
  "Corn": 2,
  "Watermelon": 2
};

// REAL CROPS SPECIFICATIONS & STAGES
const REAL_CROPS = {
  "Carrot":    { emoji: "🥕", cost: 10, waterNeed: 5,  energyNeed: 10, yield: 12 },
  "Tomato":    { emoji: "🍅", cost: 15, waterNeed: 10, energyNeed: 15, yield: 25 },
  "Eggplant":  { emoji: "🍆", cost: 20, waterNeed: 15, energyNeed: 20, yield: 35 },
  "Corn":      { emoji: "🌽", cost: 25, waterNeed: 25, energyNeed: 30, yield: 50 },
  "Watermelon":{ emoji: "🍉", cost: 30, waterNeed: 40, energyNeed: 40, yield: 80 }
};

const STAGE_EMOJIS = { 1: "🌰", 2: "🌱", 3: "🪴", 4: null };

// --- CONSISTENT TREE TEMPLATE (single source of truth for the default tree) ---
const TREE_CROP_ORDER = [
  ["Eggplant", "🍆"], ["Tomato", "🍅"], ["Carrot", "🥕"], ["Corn", "🌽"], ["Watermelon", "🍉"]
];

const TREE_STAGE_LEAVES = [
  ["Seed", "🌰"], ["Sprout", "🌱"], ["Young", "🌿"], ["Mature", null], ["Ready", "⭐"]
];

const TREE_NEED_LEAVES = [
  ["Water", "💧"], ["Fertilizer", "🌾"], ["Anti-Pest", "🛡️"]
];

function buildCropBranch(name, emoji) {
  const key = name.toLowerCase();
  return {
    id: `node-${key}`,
    emoji: emoji,
    label: name,
    children: [
      {
        id: `node-${key}-stages`,
        emoji: "📁",
        label: "Stages",
        children: TREE_STAGE_LEAVES.map(([label, e]) => ({
          id: `node-${key}-${label.toLowerCase()}`,
          emoji: e || emoji,
          label: label,
          children: []
        }))
      },
      {
        id: `node-${key}-needs`,
        emoji: "📁",
        label: "Needs",
        children: TREE_NEED_LEAVES.map(([label, e]) => ({
          id: `node-${key}-${label.toLowerCase()}`,
          emoji: e,
          label: label,
          children: []
        }))
      }
    ]
  };
}

function buildGardenTree() {
  return {
    id: "node-root",
    emoji: "🌱",
    label: "Garden Root",
    children: TREE_CROP_ORDER.map(([name, emoji]) => buildCropBranch(name, emoji))
  };
}
