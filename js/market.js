// Market panel (seeds and gardening supplies)

function populateMarketSeeds() {
  const container = document.getElementById("market-seeds-list");
  container.innerHTML = "";
  Object.entries(REAL_CROPS).forEach(([name, crop]) => {
    const btn = document.createElement("button");
    btn.className = "p-2 bg-[#1b251a] hover:bg-[#253324] border border-emerald-800/50 rounded-xl flex items-center justify-between transition text-left";
    btn.onclick = () => buySeed(name, crop);
    btn.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-lg">${crop.emoji}</span>
            <div>
              <div class="text-xs font-semibold text-emerald-100">${name} Seeds (+2)</div>
              <div class="text-[10px] text-emerald-400/70">W:${crop.waterNeed}L | E:${crop.energyNeed}Wh</div>
            </div>
          </div>
          <span class="text-xs font-bold text-yellow-300 bg-yellow-950/50 px-2 py-1 rounded-lg border border-yellow-800/50">${crop.cost}c</span>
        `;
    container.appendChild(btn);
  });
}

function buySeed(cropName, crop) {
  if (currentCoins < crop.cost) {
    showToast("Insufficient coins!");
    return;
  }
  currentCoins -= crop.cost;
  cropSeeds[cropName] = (cropSeeds[cropName] || 0) + 2;
  pushAction(`Purchased ${crop.emoji} ${cropName} Seeds (+2) (-${crop.cost}c)`);
  populateSeedDropdown();
  updateResources(currentWater, currentSeeds, currentEnergy, currentHope, currentCoins);  // show the deducted coins right away
}

function buyMarketItem(type, cost, label) {
  if (currentCoins < cost) {
    showToast("Insufficient coins!");
    return;
  }
  currentCoins -= cost;
  if (type === 'water') currentWater = Math.min(200, currentWater + 50);
  if (type === 'fertilizer') currentEnergy = Math.min(120, currentEnergy + 20);
  if (type === 'mulch') currentHope = Math.min(100, currentHope + 10);
  if (type === 'pesticide') {
    unlockAchievement("locust_survivor", "Locust Survivor", "🛡️");
    clearCalamityWarning();
    showToast("Anti-pest shield applied! Calamity mitigated.");
  }

  pushAction(`Purchased ${label} (-${cost}c)`);
  updateResources(currentWater, currentSeeds, currentEnergy, currentHope, currentCoins);
}
