// Startup: runs once the page has loaded

// --- INITIALIZATION ---
window.onload = () => {
  document.getElementById("version-badge").textContent = "v" + APP_VERSION;
  populateMarketSeeds();
  populateSeedDropdown();
  renderGarden();
  renderActionStack();
  renderAchievementsGrid();
  
  updateClimateQueue([
    "🦗 Locust Swarm Risk (Needs Anti-Pest)",
    "🌤️ Mild Weather (Optimal Growth)"
  ]);
  
  const select = document.getElementById("topic-selector");
  Object.keys(topicTemplates).forEach(k => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = topicTemplates[k].title;
    select.appendChild(opt);
  });
  loadTopic();

  // Default consistent tree: Root → 5 crops → (Stages, Needs) → fixed leaves
  renderTree(buildGardenTree());

  lucide.createIcons();
  initPyodide().catch(err => console.error("Pyodide pre-load error:", err));
};
