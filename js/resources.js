// Bridge: resources, action stack (undo), and climate queue

function updateResources(water, seeds, energy, hope, coins) {
  if (typeof water === "object" && water !== null) {
    const args = water;
    currentWater = args.water !== undefined ? args.water : currentWater;
    currentSeeds = args.seeds !== undefined ? args.seeds : currentSeeds;
    currentEnergy = args.energy !== undefined ? args.energy : currentEnergy;
    currentHope = args.hope !== undefined ? args.hope : currentHope;
    currentCoins = args.coins !== undefined ? args.coins : currentCoins;
  } else {
    currentWater = water !== undefined ? water : currentWater;
    currentSeeds = seeds !== undefined ? seeds : currentSeeds;
    currentEnergy = energy !== undefined ? energy : currentEnergy;
    currentHope = hope !== undefined ? hope : currentHope;
    currentCoins = coins !== undefined ? coins : currentCoins;
  }

  const waterMax = 200, seedsMax = 100, energyMax = 120, hopeMax = 100;

  document.getElementById("water-text").innerText = `${currentWater}/${waterMax} L`;
  document.getElementById("water-bar").style.width = `${Math.min(100, (currentWater / waterMax) * 100)}%`;

  document.getElementById("seeds-text").innerText = `${currentSeeds}/${seedsMax}`;
  document.getElementById("seeds-bar").style.width = `${Math.min(100, (currentSeeds / seedsMax) * 100)}%`;

  document.getElementById("energy-text").innerText = `${currentEnergy}/${energyMax} Wh`;
  document.getElementById("energy-bar").style.width = `${Math.min(100, (currentEnergy / energyMax) * 100)}%`;

  document.getElementById("hope-text").innerText = `${currentHope}/${hopeMax}`;
  document.getElementById("hope-bar").style.width = `${Math.min(100, (currentHope / hopeMax) * 100)}%`;

  document.getElementById("coins-text").innerText = `${currentCoins} Coins`;
  checkAutomaticMilestones();
}

function pushAction(action) {
  displayActionHistory.push(action);
  if (displayActionHistory.length > 10) displayActionHistory.shift();
  renderActionStack();
}

function renderActionStack() {
  const container = document.getElementById("action-stack");
  container.innerHTML = "";
  [...displayActionHistory].reverse().forEach(act => {
    const div = document.createElement("div");
    div.className = "bg-[#182417] border-l-2 border-emerald-400 px-2.5 py-1.5 rounded text-[11px] text-emerald-100 flex items-center justify-between";
    div.innerHTML = `<span>${act}</span> <span class="text-[9px] text-emerald-500 font-mono">LIFO</span>`;
    container.appendChild(div);
  });
}

function triggerUndo() {
  if (displayActionHistory.length > 0) {
    const undone = displayActionHistory.pop();
    renderActionStack();
    showToast(`Undone: ${undone}`);
  } else {
    showToast("Action stack is empty.");
  }
}

function updateClimateQueue(events) {
  const container = document.getElementById("climate-queue");
  container.innerHTML = "";
  if (!events || !events.length) {
    container.innerHTML = '<div class="text-[11px] text-emerald-400/50 italic">FIFO queue empty.</div>';
    clearCalamityWarning();
    return;
  }

  events.forEach((event, idx) => {
    const div = document.createElement("div");
    div.className = "p-2 bg-[#211a14] border border-amber-900/60 rounded-xl text-xs flex items-center justify-between";
    div.innerHTML = `
          <span class="font-semibold text-amber-200">${event}</span>
          <span class="text-[9px] bg-amber-950 text-amber-400 border border-amber-800/60 px-1.5 py-0.5 rounded">FIFO #${idx+1}</span>
        `;
    container.appendChild(div);
  });

  const frontEvent = events[0];
  if (frontEvent && (frontEvent.includes("Locust") || frontEvent.includes("Heat Wave") || frontEvent.includes("Acid Rain"))) {
    triggerCalamityWarning(frontEvent);
  } else {
    clearCalamityWarning();
  }
}
