/* Reading Quest engine: audio (Web Audio SFX + speech synthesis). No audio files needed. */
(function () {
  "use strict";
  var ctx = null;

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === "suspended") { ctx.resume(); }
    return ctx;
  }

  function tone(freq, t0, dur, type, vol) {
    var c = ensure(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    var t = c.currentTime + (t0 || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  var SFX = {
    click: function () { tone(660, 0, 0.08, "triangle", 0.12); },
    correct: function () { tone(523, 0, 0.12, "sine", 0.2); tone(659, 0.09, 0.12, "sine", 0.2); tone(784, 0.18, 0.2, "sine", 0.2); },
    wrong: function () { tone(220, 0, 0.2, "sawtooth", 0.08); tone(175, 0.12, 0.25, "sawtooth", 0.08); },
    hit: function () { tone(180, 0, 0.15, "square", 0.12); tone(90, 0.05, 0.2, "square", 0.1); },
    enemyHit: function () { tone(300, 0, 0.12, "sawtooth", 0.1); },
    levelup: function () {
      var n = [523, 659, 784, 1046, 784, 1046];
      n.forEach(function (f, i) { tone(f, i * 0.11, 0.22, "triangle", 0.2); });
    },
    chest: function () { tone(392, 0, 0.15, "triangle", 0.18); tone(587, 0.12, 0.15, "triangle", 0.18); tone(880, 0.24, 0.3, "triangle", 0.2); },
    coin: function () { tone(988, 0, 0.08, "square", 0.08); tone(1319, 0.07, 0.15, "square", 0.08); },
    heal: function () { tone(440, 0, 0.2, "sine", 0.15); tone(554, 0.15, 0.25, "sine", 0.15); },
    boss: function () { tone(110, 0, 0.4, "sawtooth", 0.15); tone(82, 0.3, 0.5, "sawtooth", 0.15); },
    victory: function () {
      var n = [523, 523, 659, 784, 1046];
      n.forEach(function (f, i) { tone(f, i * 0.13, 0.25, "triangle", 0.2); });
    },
    streak: function () { tone(784, 0, 0.1, "sine", 0.18); tone(1046, 0.08, 0.18, "sine", 0.18); },
    unlock: function () {
      var n = [392, 523, 659, 784, 1046, 1319];
      n.forEach(function (f, i) { tone(f, i * 0.1, 0.25, "sawtooth", 0.12); });
    }
  };

  var Speech = {
    say: function (text) {
      try {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.rate = 0.85; u.pitch = 1.1;
        window.speechSynthesis.speak(u);
      } catch (e) { /* audio unavailable, keep playing silently */ }
    },
    stop: function () {
      try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) {}
    }
  };

  window.RQAudio = { SFX: SFX, Speech: Speech, ensure: ensure };
})();
