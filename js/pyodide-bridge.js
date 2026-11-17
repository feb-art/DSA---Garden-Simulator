// Pyodide loader and Python code runner

// --- PYODIDE INTERFACE & EXECUTION ---
async function initPyodide() {
  if (pyodideInstance) return;
  const consoleEl = document.getElementById("output-console");
  if (consoleEl) consoleEl.innerHTML = '<span class="text-amber-400">Loading Pyodide WASM Engine...</span>\n';
  
  try {
    pyodideInstance = await loadPyodide();
    
    // Expose JavaScript Bridge Functions to Python
    pyodideInstance.globals.set("addPlantToGrid", addPlantToGrid);
    pyodideInstance.globals.set("updateResources", updateResources);
    pyodideInstance.globals.set("addPlantsToDropdown", addPlantsToDropdown);
    pyodideInstance.globals.set("pushAction", pushAction);
    pyodideInstance.globals.set("updateClimateQueue", updateClimateQueue);
    pyodideInstance.globals.set("openExplorer", openExplorer);
    pyodideInstance.globals.set("renderTree", renderTree);
    pyodideInstance.globals.set("unlockAchievement", unlockAchievement);
    pyodideInstance.globals.set("runTraversal", runTraversal);
    pyodideInstance.globals.set("triggerCalamityWarning", triggerCalamityWarning);
    pyodideInstance.globals.set("clearCalamityWarning", clearCalamityWarning);

    await pyodideInstance.runPythonAsync(`
import sys
from js import document

class ConsoleRedirect:
    def write(self, text):
        el = document.getElementById("output-console")
        if el:
            el.innerHTML += text.replace("\\n", "<br>")
    def flush(self): pass

sys.stdout = ConsoleRedirect()
`);
    if (consoleEl) consoleEl.innerHTML = '<span class="text-emerald-400">Python Engine Ready.</span><br>';
  } catch (err) {
    if (consoleEl) consoleEl.innerHTML = `<span class="text-red-400">Python Error: ${err.message}</span>`;
  }
}

async function runPythonCode() {
  const consoleEl = document.getElementById("output-console");
  consoleEl.innerHTML = '<span class="text-amber-400">Executing Python code...</span><br>';
  try {
    await initPyodide();
    const code = document.getElementById("code-editor").value.trim();
    await pyodideInstance.runPythonAsync(code);
  } catch (err) {
    consoleEl.innerHTML += `<span class="text-red-400">Runtime Error: ${err.message}</span>`;
  }
}
