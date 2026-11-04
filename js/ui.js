// Tabs, topic selector, console output, and toast messages

function loadTopic() {
  const key = document.getElementById("topic-selector").value;
  document.getElementById("code-editor").value = topicTemplates[key].code;
}

function switchTab(tab) {
  document.getElementById("view-game").classList.toggle("hidden", tab !== "game");
  document.getElementById("view-code").classList.toggle("hidden", tab !== "code");
  
  document.getElementById("tab-game").classList.toggle("bg-[#283623]", tab === "game");
  document.getElementById("tab-game").classList.toggle("text-emerald-100", tab === "game");
  
  document.getElementById("tab-code").classList.toggle("bg-[#283623]", tab === "code");
  document.getElementById("tab-code").classList.toggle("text-emerald-100", tab === "code");
}

function printConsole(msg) {
  const el = document.getElementById("output-console");
  if (el) el.innerHTML += `<br><span class="text-cyan-300">${msg}</span>`;
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-6 right-6 bg-emerald-900 border border-emerald-400 text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 text-xs font-semibold animate-bounce";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
