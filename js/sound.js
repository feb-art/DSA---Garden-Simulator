// Sound effects and background music (Web Audio API: no audio files, no libraries)
const Sfx = (() => {
  let ctx, master, timer = null, step = 0;
  let musicOn = localStorage.getItem("gs_music") !== "0";
  let sfxOn = localStorage.getItem("gs_sfx") !== "0";

  const init = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  };

  const tone = (f, t0, dur, type = "sine", vol = 0.12, f2) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  };
  const seq = (notes, gap, type, vol) => notes.forEach((f, i) => tone(f, ctx.currentTime + i * gap, 0.18, type, vol));

  const FX = {
    click: () => tone(660, ctx.currentTime, 0.07, "triangle", 0.08, 880),
    pop: () => tone(300, ctx.currentTime, 0.12, "sine", 0.16, 700),
    coin: () => seq([988, 1319], 0.08, "square", 0.06),
    undo: () => tone(700, ctx.currentTime, 0.2, "triangle", 0.1, 300),
    unlock: () => seq([523, 659, 784, 1047], 0.1, "triangle", 0.12),
    calamity: () => {
      for (let i = 0; i < 4; i++) {            // siren: two alternating tones
        const t = ctx.currentTime + i * 0.45;
        tone(520, t, 0.22, "square", 0.07);
        tone(390, t + 0.22, 0.22, "square", 0.07);
      }
      tone(70, ctx.currentTime, 1.6, "sawtooth", 0.12, 40);   // low rumble
    },
  };
  const play = (name) => { if (!sfxOn) return; try { init(); FX[name] && FX[name](); } catch (e) {} };

  // Soft pentatonic lullaby (C major pentatonic + a bass note every 4 beats)
  const SCALE = [262, 294, 330, 392, 440, 523, 587, 660];
  const MEL = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 7, 5, 4, 2, 0];
  const tick = () => {
    const f = SCALE[MEL[step % MEL.length]];
    tone(f, ctx.currentTime, 0.5, "sine", 0.035);
    if (step % 4 === 0) tone(f / 2, ctx.currentTime, 1.4, "triangle", 0.03);
    step++;
  };
  const setMusic = (on) => {
    musicOn = on;
    localStorage.setItem("gs_music", on ? "1" : "0");
    clearInterval(timer); timer = null;
    if (on) { init(); timer = setInterval(tick, 480); }
    refresh();
  };
  const setSfx = (on) => { sfxOn = on; localStorage.setItem("gs_sfx", on ? "1" : "0"); refresh(); };

  let bMusic, bSfx;
  const refresh = () => {
    if (!bMusic) return;
    bMusic.textContent = musicOn ? "🎵" : "🔇";
    bSfx.textContent = sfxOn ? "🔔" : "🔕";
    bMusic.title = musicOn ? "Music: on" : "Music: off";
    bSfx.title = sfxOn ? "Sound effects: on" : "Sound effects: off";
  };

  window.addEventListener("DOMContentLoaded", () => {
    const dock = document.createElement("div");
    dock.id = "audio-dock";
    bMusic = document.createElement("button");
    bSfx = document.createElement("button");
    bMusic.onclick = () => setMusic(!musicOn);
    bSfx.onclick = () => setSfx(!sfxOn);
    dock.append(bMusic, bSfx);
    document.body.appendChild(dock);
    refresh();
    // Browsers only allow sound after a user gesture, so music starts on the first click.
    document.addEventListener("pointerdown", () => { if (musicOn && !timer) setMusic(true); }, { once: true });
    document.addEventListener("click", (e) => {
      if (e.target.closest("#audio-dock")) return;
      if (e.target.closest("button, select, .garden-tile")) play("click");
    });
  });

  // Add a sound to existing game functions without editing them
  const hook = (name, fx) => {
    const f = window[name];
    if (typeof f === "function") window[name] = function (...args) { play(fx); return f.apply(this, args); };
  };
  hook("triggerCalamityWarning", "calamity");
  hook("unlockAchievement", "unlock");
  hook("buyMarketItem", "coin");
  hook("buySeed", "coin");
  hook("triggerUndo", "undo");
  hook("addPlantToGrid", "pop");
  hook("handleTileClick", "pop");

  return { play, setMusic, setSfx };
})();
