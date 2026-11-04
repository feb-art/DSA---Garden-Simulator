// Achievements data and unlock logic

// ACHIEVEMENTS COLLECTION SYSTEM
const achievements = [
  { id: "first_harvest", title: "First Harvest", desc: "Harvested your first mature crop", icon: "🥇", type: "Medal", unlocked: false },
  { id: "locust_survivor", title: "Locust Survivor", desc: "Protected garden from a pest swarm", icon: "🛡️", type: "Certificate", unlocked: false },
  { id: "all_crops", title: "Botanical Master", desc: "Grew all 5 real crop types", icon: "🏆", type: "Certificate", unlocked: false },
  { id: "day_10", title: "Decade Steward", desc: "Reached Day 10 of cultivation", icon: "📜", type: "Certificate", unlocked: false },
  { id: "coins_100", title: "Harvest Tycoon", desc: "Accumulated 100+ Market Coins", icon: "💰", type: "Medal", unlocked: false }
];

function unlockAchievement(id, title, icon) {
  let ach = achievements.find(a => a.id === id);
  if (!ach) {
    ach = { id: id, title: title || id, desc: "Custom Python Milestone", icon: icon || "🏆", type: "Medal", unlocked: true };
    achievements.push(ach);
  } else {
    if (ach.unlocked) return;
    ach.unlocked = true;
    if (title) ach.title = title;
    if (icon) ach.icon = icon;
  }

  renderAchievementsGrid();
  showToast(`🏆 Medal Unlocked: ${ach.title}`);
}

function renderAchievementsGrid() {
  const container = document.getElementById("achievements-trophy-grid");
  const countEl = document.getElementById("trophy-count");
  container.innerHTML = "";

  let unlockedCount = 0;

  achievements.forEach(ach => {
    if (ach.unlocked) unlockedCount++;

    const card = document.createElement("div");
    card.className = `trophy-card p-2.5 rounded-xl border flex items-center justify-between transition ${
          ach.unlocked ? "unlocked unlock-animated" : "locked"
        }`;

    card.innerHTML = `
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${ach.unlocked ? ach.icon : "🔒"}</span>
            <div>
              <div class="text-xs font-bold ${ach.unlocked ? "text-yellow-200" : "text-emerald-500/70"}">${ach.title}</div>
              <div class="text-[10px] ${ach.unlocked ? "text-emerald-300/80" : "text-emerald-600/50"}">${ach.desc}</div>
            </div>
          </div>
          <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
            ach.unlocked ? "bg-yellow-950/80 text-yellow-300 border border-yellow-700/60" : "bg-emerald-950/30 text-emerald-700"
          }">${ach.type}</span>
        `;
    container.appendChild(card);
  });

  countEl.textContent = `${unlockedCount}/${achievements.length} Medals`;
}

function checkAutomaticMilestones() {
  if (currentCoins >= 100) unlockAchievement("coins_100", "Harvest Tycoon", "💰");
  
  const grownTypes = new Set(Object.values(gardenPlants).map(p => p.name));
  if (grownTypes.size >= 5) unlockAchievement("all_crops", "Botanical Master", "🏆");
}
