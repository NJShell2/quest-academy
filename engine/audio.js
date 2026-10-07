/* Quest Academy engine: audio (Web Audio SFX + speech synthesis). No audio files needed. */
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

  /* Speech: text-to-speech with smart voice selection.
     Voices load asynchronously in browsers, so we warm the cache on the
     voiceschanged event and re-pick on every utterance. Preference order:
     Google US English, Google UK English, Microsoft natural voices
     (Aria, Guy, Zira, David), Apple voices (Samantha), any en-US voice,
     any English voice, then the system default. Everything degrades
     silently when speechSynthesis is unavailable. */
  var Speech = (function () {
    function supported() {
      try { return ("speechSynthesis" in window) && !!window.speechSynthesis; }
      catch (e) { return false; }
    }
    function voices() {
      if (!supported()) return [];
      try { return window.speechSynthesis.getVoices() || []; }
      catch (e) { return []; }
    }
    function find(list, pred) {
      for (var i = 0; i < list.length; i++) {
        if (pred(list[i])) return list[i];
      }
      return null;
    }
    /* Exposed for tests: pick the best voice from the current list. */
    function pickVoice() {
      var vs = voices();
      if (!vs.length) return null;
      function nm(v) { return v.name || ""; }
      function lg(v) { return (v.lang || "").toLowerCase(); }
      var v;
      v = find(vs, function (x) { return /google us english/i.test(nm(x)); });
      if (v) return v;
      v = find(vs, function (x) { return /google uk english/i.test(nm(x)); });
      if (v) return v;
      v = find(vs, function (x) {
        return /microsoft/i.test(nm(x)) && /(aria|guy|zira|david)/i.test(nm(x));
      });
      if (v) return v;
      v = find(vs, function (x) { return /samantha/i.test(nm(x)); });
      if (v) return v;
      v = find(vs, function (x) { return lg(x) === "en-us"; });
      if (v) return v;
      v = find(vs, function (x) { return lg(x).indexOf("en") === 0; });
      if (v) return v;
      return vs[0];
    }
    function warmVoices() { voices(); }
    try {
      if (supported()) {
        warmVoices();
        var synth = window.speechSynthesis;
        if (synth.addEventListener) {
          synth.addEventListener("voiceschanged", warmVoices);
        } else {
          synth.onvoiceschanged = warmVoices;
        }
      }
    } catch (e) { /* speech unavailable, stay silent */ }

    function utter(text, opts) {
      try {
        if (!supported()) return false;
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        var v = pickVoice();
        if (v) u.voice = v;
        u.rate = (opts && opts.rate) || 0.95;
        u.pitch = (opts && opts.pitch) || 1.0;
        window.speechSynthesis.speak(u);
        return true;
      } catch (e) { return false; /* keep playing silently */ }
    }

    return {
      say: function (text) { return utter(text); },
      /* Read a word aloud letter by letter with pauses between letters. */
      spell: function (word) {
        var letters = String(word == null ? "" : word)
          .replace(/[^A-Za-z]/g, "").toUpperCase().split("");
        if (!letters.length) return false;
        return utter(letters.join(", ") + ".", { rate: 0.85 });
      },
      stop: function () {
        try { if (supported()) window.speechSynthesis.cancel(); } catch (e) {}
      },
      supported: supported,
      pickVoice: pickVoice
    };
  })();

  window.RQAudio = { SFX: SFX, Speech: Speech, ensure: ensure };
})();
