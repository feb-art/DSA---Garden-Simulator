// Garden grid, seed bag dropdown, planting, harvesting, and calamity warning

// --- SANCTUARY CALAMITY ALERT WARNING ENGINE ---
function triggerCalamityWarning(eventName) {
  const alertBanner = document.getElementById("calamity-alert-banner");
  const alertText = document.getElementById("calamity-alert-text");
  const gardenView = document.getElementById("view-game");

  if (alertBanner && alertText && gardenView) {
    alertText.textContent = `CALAMITY ALERT: ${eventName || "Severe Weather Swarm"} incoming!`;
    alertBanner.classList.remove("hidden");
    gardenView.classList.add("calamity-warning-active");
    showToast(`⚠️ WARNING: ${eventName} is arriving!`);
  }
}

function clearCalamityWarning() {
  const alertBanner = document.getElementById("calamity-alert-banner");
  const gardenView = document.getElementById("view-game");
  if (alertBanner && gardenView) {
    alertBanner.classList.add("hidden");
    gardenView.classList.remove("calamity-warning-active");
  }
}

// --- SEED BAG INVENTORY & DROPDOWN MANAGEMENT ---
function populateSeedDropdown() {
  const select = document.getElementById("crop-selector");
  select.innerHTML = "";

  Object.entries(REAL_CROPS).forEach(([name, crop]) => {
    const stock = cropSeeds[name] !== undefined ? cropSeeds[name] : 0;
    const option = document.createElement("option");
    option.value = name;

    if (stock <= 0) {
      option.textContent = `${crop.emoji} ${name} (Out of Stock) — ${crop.cost}c`;
      option.className = "text-gray-400 bg-[#121811]";
    } else {
      option.textContent = `${crop.emoji} ${name} Seeds (x${stock}) — ${crop.cost}c`;
      option.className = "text-emerald-100 bg-[#1e2a1b]";
    }

    select.appendChild(option);
  });

  currentSeeds = Object.values(cropSeeds).reduce((a, b) => a + b, 0);
  updateResources(currentWater, currentSeeds, currentEnergy, currentHope, currentCoins);
}

function addPlantsToDropdown(plants) {
  if (!plants || !Array.isArray(plants)) return;
  plants.forEach(p => {
    let name, stock;
    if (Array.isArray(p)) {
      name = p[0];
      stock = p[3] !== undefined ? p[3] : p[2];
    } else if (typeof p === 'object') {
      name = p.name;
      stock = p.stock !== undefined ? p.stock : p.count;
    }
    if (name && REAL_CROPS[name] && stock !== undefined) {
      cropSeeds[name] = parseInt(stock);
    }
  });
  populateSeedDropdown();
}

// --- GAME ENGINE LOGIC & TILE INTERACTIONS ---
function addPlantToGrid(pos, name, stage = 1, ready = false) {
  if (pos >= 0 && pos < 25) {
    if (typeof stage === 'string') {
      const lower = stage.toLowerCase();
      if (lower === 'seed') stage = 1;
      else if (lower === 'sprout') stage = 2;
      else if (lower === 'young') stage = 3;
      else if (lower === 'mature') stage = 4;
      else stage = 1;
    }

    gardenPlants[pos] = {
      name: name,
      stage: Math.min(4, Math.max(1, parseInt(stage))),
      ready: Boolean(ready)
    };
    renderGarden();
    checkAutomaticMilestones();
  }
}

function renderGarden() {
  const grid = document.getElementById("garden-grid");
  grid.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    const plant = gardenPlants[i];

    let classNames = "garden-tile aspect-square bg-[#1b251a] border border-emerald-800/60 rounded-xl flex flex-col items-center justify-center cursor-pointer relative group";
    if (plant && plant.ready) classNames += " harvest-ready";

    cell.className = classNames;
    cell.onclick = () => handleTileClick(i);

    if (plant && REAL_CROPS[plant.name]) {
      const crop = REAL_CROPS[plant.name];
      let displayEmoji = STAGE_EMOJIS[plant.stage] || crop.emoji;
      let stageLabel = plant.stage === 1 ? "Seed" : plant.stage === 2 ? "Sprout" : plant.stage === 3 ? "Young" : "Mature";

      cell.innerHTML = `
            <span class="text-2xl">${displayEmoji}</span>
            <span class="text-[9px] text-emerald-300/90 font-bold mt-0.5 leading-none">${plant.name}</span>
            <span class="text-[8px] text-emerald-400/60 font-mono leading-none mt-0.5">${stageLabel}</span>
          `;

      if (plant.ready) {
        cell.innerHTML += `
              <span class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black font-extrabold text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-2 ring-yellow-200 animate-bounce" title="Ready for Harvest!">
                ⭐
              </span>
            `;
      }
    } else {
      cell.innerHTML = `<span class="text-xs text-emerald-800/40 font-mono">${i}</span>`;
    }
    grid.appendChild(cell);
  }
}

function handleTileClick(pos) {
  const selectedCrop = document.getElementById("crop-selector").value;
  const plant = gardenPlants[pos];

  if (plant) {
    if (plant.ready) {
      const crop = REAL_CROPS[plant.name];
      currentCoins += crop.yield;
      updateResources(currentWater, currentSeeds, currentEnergy, currentHope, currentCoins);  // update the coin display right away
      showToast(`+${crop.yield} coins!`);
      pushAction(`Harvested ⭐ ${plant.name} (+${crop.yield}c)`);
      delete gardenPlants[pos];
      unlockAchievement("first_harvest", "First Harvest", "🥇");
    } else if (plant.stage < 4) {
      plant.stage++;
      if (plant.stage === 4) plant.ready = true;
      pushAction(`Nurtured ${plant.name} to Stage ${plant.stage}`);
    } else {
      plant.ready = true;
      pushAction(`Marked ${plant.name} as Harvest-Ready!`);
    }
  } else {
    if (!selectedCrop) return;
    const stock = cropSeeds[selectedCrop] || 0;

    if (stock <= 0) {
      showToast(`Out of ${selectedCrop} seeds! Purchase more from the Market.`);
      return;
    }

    cropSeeds[selectedCrop]--;
    gardenPlants[pos] = { name: selectedCrop, stage: 1, ready: false };
    pushAction(`Planted ${REAL_CROPS[selectedCrop].emoji} ${selectedCrop} Seed at slot #${pos}`);
    populateSeedDropdown();
  }

  renderGarden();
  checkAutomaticMilestones();
}
