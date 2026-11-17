// Path Explorer: slide-in panel with a graph visualizer (BFS / DFS / Dijkstra) and the hidden Achievements tab.
// Python computes the steps (Topics 7 and 10); this file only draws them.
const Explorer = (() => {
  let graph = null, steps = [], i = -1, timer = null, label = "BFS";
  const ICON = { Gate: "🚪", Well: "⛲", Greenhouse: "🌷", Pond: "🪷", Barn: "🏡", Market: "🧺" };
  const KIND = { BFS: "Queue (FIFO)", DFS: "Stack (LIFO)", Dijkstra: "Priority queue (closest first)" };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function draw() {
    const s = steps[i];
    const edges = graph.edges.map(([a, b, w]) => {
      const [x1, y1] = graph.nodes[a], [x2, y2] = graph.nodes[b];
      return `<line class="ex-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="ex-w" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 1.5}">${w}</text>`;
    }).join("");
    const nodes = Object.entries(graph.nodes).map(([n, [x, y]]) => {
      const cls = s && s.node === n ? "cur" : s && s.visited.includes(n) ? "vis" : s && s.frontier.some((f) => f.split("(")[0] === n) ? "fr" : "";
      const d = s && s.dist && s.dist[n] !== undefined ? ` (${s.dist[n]})` : "";
      return `<g class="ex-node ${cls}"><circle cx="${x}" cy="${y}" r="6.5"/><text class="ex-i" x="${x}" y="${y + 2.2}">${ICON[n] || "🌸"}</text><text class="ex-n" x="${x}" y="${y + 11}">${esc(n + d)}</text></g>`;
    }).join("");
    $("ex-svg").innerHTML = edges + nodes;
    $("ex-kind").textContent = KIND[label] || "Frontier";
    $("ex-frontier").innerHTML = s ? (s.frontier.map((f) => `<span class="ex-chip">${esc(f)}</span>`).join("") || "<i>empty</i>") : "<i>press Step or Play</i>";
    $("ex-order").textContent = s ? s.visited.join(" → ") : "—";
    $("ex-out").textContent = s ? `${label}: visited ${s.visited.length}/${Object.keys(graph.nodes).length} spots (step ${i + 1}/${steps.length})` : `${label} ready (${steps.length} steps from Python)`;
  }
  function step() { if (i < steps.length - 1) { i++; draw(); } else stop(); }
  function stop() { clearInterval(timer); timer = null; $("ex-play").textContent = "▶ Play"; }
  function play() {
    if (timer) return stop();
    if (i >= steps.length - 1) i = -1;
    $("ex-play").textContent = "⏸ Pause";
    timer = setInterval(step, 1150 - $("ex-speed").value * 100);
  }
  function reset() { stop(); i = -1; if (graph) draw(); }
  async function switchAlgo(name) {          // asks Python (the template's explore() function) for new steps
    try {
      const out = await pyodideInstance.runPythonAsync(`json.dumps(explore("${name.toLowerCase()}"))`);
      steps = JSON.parse(out); label = name; reset();
    } catch (e) { showToast("Run Topic 7 (BFS/DFS) or Topic 10 (Dijkstra) first"); }
  }
  function open(tab) { $("explorer").classList.add("open"); show(tab || "explore"); if (graph) draw(); }
  function close() { stop(); $("explorer").classList.remove("open"); }
  function show(tab) {
    $("ex-pane-explore").hidden = tab !== "explore";
    $("ex-pane-ach").hidden = tab !== "ach";
    $("ex-tab-explore").classList.toggle("on", tab === "explore");
    $("ex-tab-ach").classList.toggle("on", tab === "ach");
    if (tab === "ach") $("ex-dot").hidden = true;
  }
  function load(g, s, name) {                // called from Python through openExplorer()
    graph = JSON.parse(g); steps = JSON.parse(s); label = name; i = -1; stop(); open("explore");
  }
  function build() {
    const root = document.createElement("div");
    root.id = "explorer";
    root.innerHTML = `<div class="ex-card"><div class="ex-head"><b>🧭 Path Explorer</b>
      <span><button id="ex-tab-explore" class="on">Explore</button><button id="ex-tab-ach">🏆 Achievements</button></span>
      <button id="ex-close" title="Close">✕</button></div>
      <div id="ex-pane-explore"><div class="ex-row">
        <button data-a="BFS">BFS</button><button data-a="DFS">DFS</button><button data-a="Dijkstra">Dijkstra</button></div>
        <svg id="ex-svg" viewBox="0 0 100 100"></svg>
        <div class="ex-row"><button id="ex-step">⏭ Step</button><button id="ex-play">▶ Play</button><button id="ex-reset">↺ Reset</button>
          <label>Speed <input id="ex-speed" type="range" min="1" max="10" value="5"></label></div>
        <div class="ex-info"><b id="ex-kind"></b><div id="ex-frontier"></div></div>
        <div class="ex-info"><b>Visited order</b><div id="ex-order">—</div></div>
        <pre id="ex-out" class="code-font"></pre></div>
      <div id="ex-pane-ach" hidden></div></div>`;
    document.body.appendChild(root);
    $("ex-pane-ach").appendChild($("achievements-panel"));      // achievements live here now
    root.addEventListener("click", (e) => { if (e.target === root) close(); });
    $("ex-close").onclick = close; $("ex-step").onclick = step; $("ex-play").onclick = play; $("ex-reset").onclick = reset;
    $("ex-tab-explore").onclick = () => show("explore"); $("ex-tab-ach").onclick = () => show("ach");
    root.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => switchAlgo(b.dataset.a)));
    const fab = document.createElement("button");
    fab.id = "ex-fab"; fab.innerHTML = '🧭 Path Explorer <span id="ex-dot" hidden></span>';
    fab.onclick = () => open("explore"); document.body.appendChild(fab);
  }
  window.addEventListener("DOMContentLoaded", build);
  return { load, open };
})();

function openExplorer(g, s, name) { Explorer.load(g, s, name); }   // bridge function used by Python

// Topic achievements: unlocked when the matching action reaches the Action History stack
const TOPIC_ACH = [
  [/Rehashed/, "collision", "Collision Master", "🔗"], [/Sorted|Ranked/, "sorter", "Sorting Pro", "🧮"],
  [/Explored/, "explorer", "Graph Explorer", "🧭"], [/Shortest path/, "shortest", "Shortest Path Found", "🗺️"],
  [/Binary search/, "searcher", "Binary Searcher", "🔎"], [/Greedy/, "greedy", "Greedy Gardener", "🤑"],
  [/DP plan/, "dp", "Memo Master", "🧠"], [/Inserted|BST/, "bst", "First BST Insert", "🌳"],
];
(() => {
  const push = window.pushAction, unlock = window.unlockAchievement;
  window.pushAction = function (a) {
    push.apply(this, arguments);
    TOPIC_ACH.forEach(([re, id, title, icon]) => { if (re.test(String(a))) window.unlockAchievement(id, title, icon); });
  };
  window.unlockAchievement = function () {
    unlock.apply(this, arguments);
    const dot = document.getElementById("ex-dot");
    if (dot && document.getElementById("ex-pane-ach").hidden) dot.hidden = false;
  };
})();
