/* Quest Academy overnight-fix test harness.
   Loads engine + content files in index.html order inside jsdom and asserts:
     (a) all 5 familiars render with clickable buttons (+ modal scroll CSS)
     (b) every overlay-producing function has a dismiss path
     (c) familiar assignment advances the flow with no exception
     (d) TTS voice picker prefers the right voice and falls back
     (e) no em/en dashes in user-facing strings of changed files
     (f) overworld initializes, moves the wizard, triggers battle on contact
     (g) maze dungeons: BFS solvability + difficulty ramp
     (h) full-screen stage intro: scripted beats, actors, skip flag, flow
     (i) familiars screen: every button wired, outcomes correct
     (j) maze continuity: encounter round-trip, persistent monster defeats,
         fled monsters stay, boss/seal progression intact
   Run: node tests/test.js
*/
"use strict";
var fs = require("fs");
var path = require("path");
var ROOT = path.join(__dirname, "..");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

/* ---------------- tiny assertion framework ---------------- */
var passed = 0, failed = 0, failures = [];
function ok(name, cond) {
  if (cond) { passed++; }
  else { failed++; failures.push(name); console.log("  FAIL:", name); }
}
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/* ---------------- jsdom + file loading (index.html order) ---------------- */
var dom = new JSDOM("<!DOCTYPE html><html><body>" +
  '<div id="rq-app">' +
  '<section id="screen-title" class="rq-screen rq-active"></section>' +
  '<section id="screen-classes" class="rq-screen"></section>' +
  '<section id="screen-hub" class="rq-screen"></section>' +
  '<section id="screen-subjects" class="rq-screen"></section>' +
  '<section id="screen-map" class="rq-screen"></section>' +
  '<section id="screen-overworld" class="rq-screen"></section>' +
  '<section id="screen-battle" class="rq-screen"></section>' +
  '<section id="screen-shop" class="rq-screen"></section>' +
  '<section id="screen-backpack" class="rq-screen"></section>' +
  '<section id="screen-familiars" class="rq-screen"></section>' +
  "</div></body></html>", { url: "https://localhost/" });

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = (function () {
  var s = {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(s, k) ? s[k] : null; },
    setItem: function (k, v) { s[k] = String(v); },
    removeItem: function (k) { delete s[k]; },
    clear: function () { s = {}; }
  };
})();

/* Record every addEventListener so tests can verify dismiss wiring. */
var listenerMap = new Map();
(function () {
  var proto = dom.window.EventTarget.prototype;
  var orig = proto.addEventListener;
  proto.addEventListener = function (type, fn, opts) {
    if (!listenerMap.has(this)) listenerMap.set(this, []);
    listenerMap.get(this).push({ type: type, fn: fn });
    return orig.call(this, type, fn, opts);
  };
})();
function hasClickListener(elm) {
  var l = listenerMap.get(elm) || [];
  return l.some(function (x) { return x.type === "click"; });
}

function load(f) {
  dom.window.eval(fs.readFileSync(path.join(ROOT, f), "utf8"));
}
["engine/audio.js", "engine/save.js", "engine/adaptive.js", "engine/questions.js",
 "engine/battle.js", "engine/onboarding.js", "engine/stage.js", "engine/game.js", "engine/maze.js", "engine/overworld.js",
 "content/subject-science.js", "content/subject-social.js", "content/subject-english.js",
 "content/subject-health.js", "content/subject-business.js", "content/subject-technology.js",
 "content/subject-psychology.js", "content/subject-sociology.js", "content/subject-law.js",
 "content/subject-mythology.js", "content/subject-writing.js", "content/subject-musictheory.js",
 "content/subject-arthistory.js", "content/subject-spanish.js", "content/subject-csprinc.js",
 "content/subject-math.js", "content/academy-core.js"
].forEach(load);

var W = dom.window;
var pack = W.ContentPacks.academy;

function overlays() {
  return Array.prototype.slice.call(document.querySelectorAll(".rq-overlay"));
}
function clearOverlays() {
  overlays().forEach(function (o) { o.remove(); });
  var t = document.querySelector(".rq-goaltoast");
  if (t) t.remove();
  var p = document.getElementById("rq-pointer");
  if (p) p.remove();
}
function byId(id) { return document.getElementById(id); }

var realAsk = W.RQQuestions.ask;

(async function main() {
  console.log("Quest Academy overnight-fix tests");
  W.RQSave.load();
  /* Give the test hero a familiar so the migrated-save catch-up flow never
     fires mid-test and pollutes overlay counts. */
  W.RQSave.hero("knight").familiar = { id: "quill", stage: 2 };

  /* ================= (a) familiar grid: all 5 visible + clickable ================= */
  console.log("- (a) familiar selection");
  clearOverlays();
  W.RQOnboard.familiarChoice();
  var famBtns = document.querySelectorAll("[data-fam]");
  ok("a1: 5 familiar cards render", famBtns.length === 5);
  var ids = Array.prototype.map.call(famBtns, function (b) {
    return b.getAttribute("data-fam");
  }).sort().join(",");
  ok("a2: all five ids present incl. rare orbit", ids === "flask,orbit,quill,tome,volt");
  var allClickable = Array.prototype.every.call(famBtns, function (b) {
    return !b.disabled && hasClickListener(b);
  });
  ok("a3: every Add to Team button is enabled with a click handler", allClickable);
  var css = fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8");
  ok("a4: modal content scrolls internally", /\.rq-modal\s*\{[^}]*overflow-y:\s*auto/.test(css));
  ok("a5: overlay scrolls so tall modals stay reachable", /\.rq-overlay\s*\{[^}]*overflow-y:\s*auto/.test(css));
  ok("a6: modal centers without clipping (margin auto)", /\.rq-modal\s*\{[^}]*margin:\s*auto/.test(css));
  clearOverlays();

  /* ================= (b) every overlay has a dismiss path ================= */
  console.log("- (b) overlay dismiss paths");

  W.RQGoals.panel();
  ok("b1: goals panel opens", overlays().length === 1);
  ok("b2: goals panel Close is wired", hasClickListener(byId("rq-goals-ok")));
  byId("rq-goals-ok").click();
  ok("b3: goals panel dismisses", overlays().length === 0);

  W.RQOnboard.dialogue("wren", ["one", "two"]);
  var dn = byId("rq-dnext");
  ok("b4: dialogue Next is wired", !!dn && hasClickListener(dn));
  dn.click(); dn.click();
  ok("b5: dialogue dismisses after last line", overlays().length === 0);

  var gearAdvanced = false;
  W.RQOnboard.grantGearReward("scholars-cap", function () { gearAdvanced = true; });
  ok("b6: gear modal opens", !!byId("rq-notnow"));
  ok("b7: gear Not now is wired", hasClickListener(byId("rq-notnow")));
  byId("rq-notnow").click();
  ok("b8: gear modal dismisses and advances", gearAdvanced && overlays().length === 0);

  var villainDone = false;
  W.RQOnboard.villainCutscene(function () { villainDone = true; });
  ok("b9: villain stage renders", !!document.querySelector(".rq-villainov .rq-stage"));
  ok("b10: curtains + spotlight + floor + backdrop render",
    !!document.querySelector(".rq-curtain-left") &&
    !!document.querySelector(".rq-curtain-right") &&
    !!document.querySelector(".rq-spotlight") &&
    !!document.querySelector(".rq-stagefloor") &&
    !!document.querySelector(".rq-stagebackdrop"));
  ok("b11: unmaker starts offstage", byId("rq-vactor").classList.contains("rq-offstage"));
  byId("rq-vnext").click();
  ok("b12: unmaker enters the stage", byId("rq-vactor").classList.contains("rq-enters"));
  byId("rq-vnext").click();
  await wait(3900);
  byId("rq-vnext").click();
  ok("b13: main quest card follows cutscene", !!byId("rq-mq-ok"));
  ok("b14: story card uses ministage", !!document.querySelector(".rq-ministage"));
  byId("rq-mq-ok").click();
  ok("b15: main quest dismisses and advances", villainDone && overlays().length === 0);

  var nameDone = false;
  W.RQOnboard.namePicker(function () { nameDone = true; });
  ok("b16: name picker opens", !!byId("rq-namesave"));
  byId("rq-namesave").click();
  ok("b17: name picker reward modal follows", !!byId("rq-notnow"));
  byId("rq-notnow").click();
  ok("b18: name picker dismisses and advances", nameDone && overlays().length === 0);

  W.RQOnboard.questChainIntro();
  ok("b19: quest cards use ministage", !!document.querySelector(".rq-ministage"));
  byId("rq-qc-next").click(); byId("rq-qc-next").click(); byId("rq-qc-next").click();
  ok("b20: quest chain finishes onboarding", W.RQSave.data.onboardingDone === true);

  W.RQGame.showMenu();
  ok("b21: menu opens", overlays().length === 1);
  byId("m-close").click();
  ok("b22: menu dismisses", overlays().length === 0);
  W.RQGame.showMenu();
  byId("m-how").click();
  ok("b23: how-to sub-modal opens with dismiss", !!byId("h-ok") && hasClickListener(byId("h-ok")));
  byId("h-ok").click();
  ok("b24: how-to sub-modal dismisses", overlays().length === 0);

  W.RQGame.claimDaily();
  ok("b25: daily modal opens", !!byId("d-ok"));
  byId("d-ok").click();
  ok("b26: daily modal dismisses", overlays().length === 0);

  clearOverlays(); /* drop any earlier transient toasts */
  W.RQGoals.toast(W.RQGoals.get("win-first-battle"));
  await wait(120);
  var toast = document.querySelector(".rq-goaltoast");
  ok("b27: goal toast appears", !!toast);
  ok("b28: goal toast is tap-to-dismiss", !!toast && hasClickListener(toast));
  if (toast) toast.click();
  ok("b29: goal toast dismisses on tap", !document.querySelector(".rq-goaltoast"));

  var monDef = { id: "t1", name: "Testmon", icon: "👾", hp: 40, power: 2, xp: 20, coins: [6, 10] };
  W.RQGame.afterBattle({ victory: true, xp: 10, coins: 5, levelsGained: [],
                         newBeasts: [], boss: false, tierMove: null, monsterId: "t1" }, monDef);
  ok("b30: victory modal opens", !!byId("r-ok"));
  byId("r-ok").click();
  ok("b31: victory modal dismisses", overlays().length === 0);
  W.RQGame.afterBattle({ victory: false, xp: 3, monsterId: "t1" }, monDef);
  ok("b32: defeat modal opens", !!byId("r-ok"));
  byId("r-ok").click();
  ok("b33: defeat modal dismisses", overlays().length === 0);

  var dummy = document.createElement("div");
  document.body.appendChild(dummy);
  W.RQOnboard.pointer(dummy, "hi");
  ok("b34: guide pointer appears", !!byId("rq-pointer"));
  W.RQOnboard.clearPointer();
  ok("b35: guide pointer clears", !byId("rq-pointer"));
  ok("b36: pointer hidden while questions render (CSS)",
    css.indexOf("body.rq-asking .rq-pointer") !== -1);

  W.RQOnboard.tutorialBattle();
  var coach = byId("tut-coach");
  ok("b37: coach bubble renders", !!coach);
  ok("b38: coach bubble is tap-to-dismiss", hasClickListener(coach));
  coach.click();
  ok("b39: coach hides on tap", coach.style.display === "none");
  ok("b40: coach reopen button appears", !!byId("tut-coachreopen"));
  byId("tut-coachreopen").click();
  ok("b41: coach returns on reopen", coach.style.display === "" && !byId("tut-coachreopen"));

  /* Tier modal: stub questions, force an adaptive tier-up, backdrop-click it. */
  W.RQQuestions.ask = function () { return Promise.resolve({ correct: true }); };
  var st = W.RQSave.subjectTier("knight", "science");
  st.tier = 17; st.recent = []; st.sinceEval = 6; st.answersSinceChange = 8;
  for (var i = 0; i < 12; i++) st.recent.push({ c: 1, ms: 200, k: "choice" });
  var science = pack.subjects.filter(function (s) { return s.id === "science"; })[0];
  W.RQGame.launchBattle(null,
    { id: "tm", name: "Tiermon", icon: "👾", hp: 500, power: 1, xp: 10, coins: [1, 2] },
    "knight", science);
  var spellBtn = document.querySelector("#b-spells .rq-spell");
  ok("b42: battle spell renders", !!spellBtn);
  spellBtn.click();
  await wait(900);
  var tierOk = byId("rq-tier-ok");
  ok("b43: adaptive tier modal appears", !!tierOk);
  var tierOv = tierOk.closest(".rq-overlay");
  ok("b44: tier modal has a CTA button", hasClickListener(tierOk));
  tierOv.click();
  await wait(100);
  ok("b45: tier modal dismisses via backdrop tap", !byId("rq-tier-ok"));
  W.RQQuestions.ask = realAsk;
  clearOverlays();

  /* Spelling renderer: the "Spell it" button. */
  var qbox = document.createElement("div");
  document.body.appendChild(qbox);
  var buildQ = { kind: "build", prompt: "Spell the word:", answer: "CAT",
                 letters: ["T", "C", "A", "X"] };
  var askP = W.RQQuestions.ask(qbox, buildQ);
  ok("b46: question flags asking state", document.body.classList.contains("rq-asking"));
  var spellBtn2 = Array.prototype.filter.call(qbox.querySelectorAll("button"), function (b) {
    return b.textContent.indexOf("Spell it") !== -1;
  })[0];
  ok("b47: spelling question has a Spell it button", !!spellBtn2);
  ok("b48: Spell it is wired", !!spellBtn2 && hasClickListener(spellBtn2));
  var tiles = qbox.querySelectorAll(".rq-tile");
  function tile(ch) {
    return Array.prototype.filter.call(tiles, function (t) {
      return t.textContent === ch && t.dataset.used !== "1";
    })[0];
  }
  tile("C").click(); tile("A").click(); tile("T").click();
  await askP;
  await wait(100);
  ok("b49: asking state clears after answer", !document.body.classList.contains("rq-asking"));

  /* ================= (c) familiar assignment advances, no exception ================= */
  console.log("- (c) familiar assignment flow");
  clearOverlays();
  W.RQSave.reset();
  var threw = null;
  try {
    W.RQOnboard.familiarChoice();
    var orbitBtn = document.querySelector('[data-fam="orbit"]');
    ok("c1: rare familiar button exists", !!orbitBtn);
    orbitBtn.click();
    orbitBtn.click(); /* double-tap must be harmless */
  } catch (e) { threw = e; }
  ok("c2: no exception on assignment", threw === null);
  ok("c3: rare familiar assigned", W.RQSave.hero("knight").familiar.id === "orbit");
  ok("c4: exactly one follow-up overlay (no stacked dupes)", overlays().length === 1);
  ok("c5: Scholar's Cap reward modal follows", !!byId("rq-wear"));
  byId("rq-wear").click();
  ok("c6: villain cutscene follows reward", !!document.querySelector(".rq-villainov"));
  var hatEquipped = W.RQSave.hero("knight").gear.hat === "scholars-cap";
  var hatInBag = W.RQSave.data.inventory.indexOf("scholars-cap") !== -1;
  ok("c7: reward kept (equipped or in backpack)", hatEquipped || hatInBag);
  clearOverlays();

  /* ================= (d) TTS voice selection ================= */
  console.log("- (d) TTS voice picker");
  var spoken = [];
  /* Install the constructor inside the VM context so the bare identifier
     resolves for the eval'd engine code (a jsdom expando quirk). */
  dom.window.eval("SpeechSynthesisUtterance = function (t) {" +
    " this.text = t; this.rate = 1; this.pitch = 1; this.voice = null; };");
  function mockSynth(voiceList) {
    dom.window.speechSynthesis = {
      getVoices: function () { return voiceList; },
      speak: function (u) { spoken.push(u); },
      cancel: function () {}
    };
  }
  function V(names) {
    return names.map(function (n) {
      var parts = n.split("|");
      return { name: parts[0], lang: parts[1] };
    });
  }
  var all = V(["Microsoft David - English (United States)|en-US",
               "Google US English|en-US",
               "Google UK English Female|en-GB",
               "Samantha|en-US",
               "Plain Voice|en-US"]);
  mockSynth(all);
  ok("d1: prefers Google US English",
    W.RQAudio.Speech.pickVoice().name === "Google US English");
  mockSynth(all.slice(0, 1).concat(all.slice(2)));
  ok("d2: then Google UK English",
    W.RQAudio.Speech.pickVoice().name === "Google UK English Female");
  mockSynth(all.slice(0, 1).concat(all.slice(3)));
  ok("d3: then Microsoft natural voices",
    W.RQAudio.Speech.pickVoice().name.indexOf("Microsoft David") === 0);
  mockSynth([all[3], all[4]]);
  ok("d4: then Apple Samantha", W.RQAudio.Speech.pickVoice().name === "Samantha");
  mockSynth([all[4]]);
  ok("d5: then any en-US voice", W.RQAudio.Speech.pickVoice().name === "Plain Voice");
  mockSynth([{ name: "Voix francaise", lang: "fr-FR" }]);
  ok("d6: falls back to default voice",
    W.RQAudio.Speech.pickVoice().name === "Voix francaise");
  mockSynth([]);
  ok("d7: null when no voices", W.RQAudio.Speech.pickVoice() === null);

  mockSynth(all);
  spoken = [];
  ok("d8: say() speaks", W.RQAudio.Speech.say("hello") === true && spoken.length === 1);
  ok("d9: rate 0.95, pitch 1.0", spoken[0].rate === 0.95 && spoken[0].pitch === 1.0);
  ok("d10: best voice attached", spoken[0].voice.name === "Google US English");
  spoken = [];
  ok("d11: spell() reads letter by letter",
    W.RQAudio.Speech.spell("cat") === true && spoken[0].text === "C, A, T.");
  ok("d12: spell() rejects empty", W.RQAudio.Speech.spell("...") === false);
  delete dom.window.speechSynthesis;
  ok("d13: graceful fallback with no speechSynthesis",
    W.RQAudio.Speech.say("hi") === false);
  ok("d14: supported() is false", W.RQAudio.Speech.supported() === false);

  /* ================= (e) no em/en dashes in changed files ================= */
  console.log("- (e) dash audit");
  ["css/style.css", "engine/audio.js", "engine/questions.js", "engine/onboarding.js",
   "engine/battle.js", "engine/game.js", "engine/maze.js", "engine/overworld.js",
   "engine/stage.js", "index.html"
  ].forEach(function (f) {
    var txt = fs.readFileSync(path.join(ROOT, f), "utf8");
    ok("e: no em/en dashes in " + f,
      txt.indexOf("—") === -1 && txt.indexOf("–") === -1);
  });

  /* ================= (f) overworld ================= */
  console.log("- (f) overworld");
  var html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  ok("f1: overworld screen in index.html", html.indexOf('id="screen-overworld"') !== -1);
  ok("f2: overworld script in index.html", html.indexOf("engine/overworld.js") !== -1);
  var OW = W.RQOverworld;
  ok("f3: RQOverworld defined", !!OW);
  byId("screen-overworld").classList.remove("rq-active");
  ok("f4: locked dungeon refused", OW.open("math") === false);
  ok("f5: locked dungeon does not open", !byId("screen-overworld").classList.contains("rq-active"));
  ok("f6: open() works for unlocked dungeon", OW.open("science") === true);
  ok("f7: overworld screen activates", byId("screen-overworld").classList.contains("rq-active"));
  ok("f8: wizard sprite renders", !!byId("ow-wiz"));
  ok("f9: roaming monsters render", document.querySelectorAll(".rq-ow-mon").length >= 1);
  ok("f10: world boss roams", !!document.querySelector(".rq-ow-boss"));
  ok("f11: on-screen joystick renders", !!byId("ow-joy"));

  var x0 = OW.state().wiz.x;
  dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowRight" }));
  await wait(400);
  dom.window.dispatchEvent(new dom.window.KeyboardEvent("keyup", { key: "ArrowRight" }));
  ok("f12: wizard moves with arrow keys", OW.state().wiz.x > x0 + 5);

  var origLaunch = W.RQGame.launchBattle;
  var launchArgs = null;
  W.RQGame.launchBattle = function (node, mon, heroId, sub, onDone) {
    launchArgs = { node: node, mon: mon, heroId: heroId, sub: sub, onDone: onDone };
  };
  await wait(2100); /* let the entry grace period expire */
  var s2 = OW.state();
  s2.monsters[0].x = s2.wiz.x; s2.monsters[0].y = s2.wiz.y;
  await wait(300);
  ok("f13: monster contact launches a battle", !!launchArgs);
  ok("f14: battle routed through the game launcher",
    !!launchArgs && !!launchArgs.mon && launchArgs.sub.id === "science" &&
    typeof launchArgs.onDone === "function");
  launchArgs.onDone({ victory: true });
  await wait(150);
  ok("f15: winning returns to the overworld",
    byId("screen-overworld").classList.contains("rq-active"));

  launchArgs = null;
  await wait(2100);
  var s3 = OW.state();
  var boss = s3.monsters.filter(function (m) { return m.boss; })[0];
  ok("f16: boss present after revisit", !!boss);
  boss.x = s3.wiz.x; boss.y = s3.wiz.y;
  await wait(300);
  ok("f17: boss contact launches battle with boss node",
    !!launchArgs && launchArgs.mon.boss === true && !!launchArgs.node);
  launchArgs.onDone({ victory: false });
  W.RQGame.launchBattle = origLaunch;
  OW.stop();

  W.RQGame.showMap();
  ok("f18: map Explore button opens overworld",
    (function () { byId("m-explore").click(); return byId("screen-overworld").classList.contains("rq-active"); })());
  OW.stop();
  W.RQGame.showHub();
  ok("f19: hub Explore button opens overworld",
    (function () { byId("h-explore").click(); return byId("screen-overworld").classList.contains("rq-active"); })());
  OW.stop();

  /* ================= (g) maze dungeons ================= */
  console.log("- (g) maze dungeons");
  var MZ = W.RQMaze;
  ok("g1: RQMaze defined", !!MZ);
  var coreOrder = pack.coreOrder.slice();
  var electiveIds = ["psychology", "sociology", "law", "mythology", "writing",
    "musictheory", "arthistory", "spanish", "csprinc"];
  var allIds = coreOrder.concat(electiveIds);
  ok("g2: all 16 dungeons have maze layouts", allIds.length === 16);
  var mazes = {};
  allIds.forEach(function (id) {
    var mz = MZ.generate(id);
    mazes[id] = mz;
    ok("g3: maze solvable (BFS spawn to boss) for " + id, MZ.bossReachable(mz));
  });
  var mzA = MZ.generate("science"), mzB = MZ.generate("science");
  ok("g4: maze generation is deterministic per dungeon",
    mzA.seed === mzB.seed && mzA.optimalLen === mzB.optimalLen &&
    JSON.stringify(mzA.grid) === JSON.stringify(mzB.grid));
  var lens = allIds.map(function (id) { return mazes[id].optimalLen; });
  var minLen = Math.min.apply(null, lens);
  ok("g5: first core dungeon (science) has the shortest optimal path",
    mazes.science.optimalLen === minLen);
  var ramp = true;
  for (var gi = 1; gi < coreOrder.length; gi++) {
    if (!(mazes[coreOrder[gi]].optimalLen > mazes[coreOrder[gi - 1]].optimalLen)) ramp = false;
  }
  ok("g6: optimal path length ramps up along the core dungeon order", ramp);
  var electivesModest = electiveIds.every(function (id) {
    return mazes[id].optimalLen < mazes.math.optimalLen && mazes[id].cells <= 7;
  });
  ok("g7: electives stay easy to medium (shorter path and smaller grid than math)", electivesModest);
  var diffs = coreOrder.map(function (id) { return MZ.difficulty(id); }).join(",");
  ok("g8: core difficulties ramp 0..6", diffs === "0,1,2,3,4,5,6");
  ok("g9: entrance first step east is always open (science)",
    !MZ.isWallTile(mazes.science, 2, 1));
  ok("g10: elective dungeon locked before 2 core bosses fall",
    OW.open("psychology") === false);

  /* Overworld integration with the maze. */
  ok("g11: overworld opens on the maze", OW.open("science") === true);
  var st = OW.state();
  ok("g12: state exposes maze info", !!st.maze && st.maze.diff === 0);
  var smz = mazes.science;
  var sc = MZ.cellCenter(smz, smz.spawn.cx, smz.spawn.cy);
  ok("g13: wizard spawns at the maze entrance",
    Math.abs(st.wiz.x - sc.x) < 1 && Math.abs(st.wiz.y - sc.y) < 1);
  ok("g14: maze canvas renders", !!byId("ow-maze"));
  var sboss = st.monsters.filter(function (m) { return m.boss; })[0];
  var bc = MZ.cellCenter(smz, smz.boss.cx, smz.boss.cy);
  ok("g15: boss waits at the maze destination",
    !!sboss && Math.abs(sboss.x - bc.x) < MZ.TILE && Math.abs(sboss.y - bc.y) < MZ.TILE);
  var placedOk = st.monsters.every(function (m) {
    var t = MZ.tileAt(smz, m.x, m.y);
    return !MZ.isWallTile(smz, t.tx, t.ty) &&
      m.x >= 0 && m.y >= 0 && m.x <= smz.worldW && m.y <= smz.worldH;
  });
  ok("g16: every monster stands on a floor tile inside the maze", placedOk);
  OW.stop();

  /* ================= (h) full-screen stage intro ================= */
  console.log("- (h) stage intro");
  var ST = W.RQStage;
  ok("h1: RQStage defined with script/machine/play", !!ST && !!ST.script &&
     !!ST.createMachine && !!ST.play);
  var script = ST.script();
  ok("h2: three scenes", script.length === 3);
  ok("h3: QA's own scenes (Grand Hall / Unmaker / Quest)",
    script[0].title === "Evening in the Grand Hall" &&
    script[1].title === "The Unmaker Strikes" &&
    script[2].title === "The Quest");
  var allBeats = [];
  script.forEach(function (sc) { allBeats = allBeats.concat(sc.beats); });
  ok("h4: 15 scripted beats", allBeats.length === 15);
  var fxs = allBeats.map(function (b) { return b.fx || ""; });
  ok("h5: curtains open to set the scene", fxs.indexOf("curtains-open") !== -1);
  var unmakerLines = allBeats.filter(function (b) { return b.speaker === "THE UNMAKER"; });
  ok("h6: villain confrontation (THE UNMAKER speaks)", unmakerLines.length >= 3);
  ok("h7: seals shatter then scatter", fxs.indexOf("shatter") !== -1 &&
     fxs.indexOf("scatter") !== -1 && fxs.indexOf("shatter") < fxs.indexOf("scatter"));
  ok("h8: quest call beat present", fxs.indexOf("quest") !== -1);
  var wrenLines = allBeats.filter(function (b) { return b.speaker === "Professor Wren"; });
  ok("h9: Professor Wren guides the play", wrenLines.length >= 5);
  var dashy = allBeats.some(function (b) {
    return /—|–/.test(b.line || "") || /—|–/.test(b.nar || "");
  });
  ok("h10: no em/en dashes in stage dialogue", !dashy);

  var m1 = ST.createMachine();
  ok("h11: machine starts at scene 0 beat 0", m1.current().scene === 0 && m1.current().beat === 0);
  var steps = 0;
  while (m1.current() !== null && steps < 100) { m1.next(); steps++; }
  ok("h12: machine walks every beat to done", steps === ST.totalBeats() && m1.current() === null);
  var m2 = ST.createMachine();
  m2.skip();
  ok("h13: skip() marks the machine done", m2.current() === null);

  /* Full play-through, first viewing: no Skip button. */
  W.RQSave.reset();
  W.RQSave.data.onboardingDone = false;
  ok("h14: skip flag starts unset", W.RQSave.data.stageIntroSeen === false);
  var stageDone = false;
  ST.play(function () { stageDone = true; });
  var root = byId("rq-qffull");
  ok("h15: full-viewport stage renders", !!root);
  ok("h16: curtains + valance + spotlight + hall backdrop render",
    !!root.querySelector(".rq-qf-curtain-l") &&
    !!root.querySelector(".rq-qf-curtain-r") &&
    !!root.querySelector(".rq-qf-valance") &&
    !!root.querySelector(".rq-qf-spotlight") &&
    !!root.querySelector(".rq-qf-hall"));
  ok("h17: backdrop shows the arc of 7 seals",
    root.querySelectorAll(".rq-qf-seal").length === 7);
  ok("h18: Wren and THE UNMAKER are on stage",
    !!root.querySelector(".rq-qf-wren") && !!root.querySelector(".rq-qf-unmaker"));
  ok("h19: no Skip button on first viewing", !byId("rq-qf-skip"));
  var nextB = root.querySelector(".rq-qf-next");
  ok("h20: Next advances beats", !!nextB && hasClickListener(nextB));
  /* Wren starts offstage-left, then walks on. */
  ok("h21: Wren starts offstage", root.querySelector(".rq-qf-wren").classList.contains("rq-qf-off-l"));
  nextB.click(); nextB.click();
  ok("h22: actors move AND talk (Wren walks to center with dialogue)",
    root.querySelector(".rq-qf-wren").classList.contains("rq-qf-center") &&
    root.querySelector(".rq-qf-speaker").textContent.indexOf("Professor Wren") !== -1 &&
    root.querySelector(".rq-qf-line").textContent.length > 0);
  /* Drive the rest of the beats to the finale. */
  for (var hb = 0; hb < 20 && !stageDone; hb++) {
    var nb = root.querySelector(".rq-qf-next");
    if (!nb) break;
    nb.click();
  }
  await wait(900);
  ok("h23: play-through sets the skip flag", W.RQSave.data.stageIntroSeen === true);
  ok("h24: play-through marks the guide met", W.RQSave.data.guideMet === true);
  ok("h25: play-through reveals the main quest",
    !!(W.RQSave.data.quests.main && W.RQSave.data.quests.main.revealed));
  ok("h26: onDone fires and the stage is struck",
    stageDone === true && !byId("rq-qffull"));

  /* Replay: visible Skip button, skipping finishes immediately. */
  var skipDone = false;
  ST.play(function () { skipDone = true; });
  var skipBtn = byId("rq-qf-skip");
  ok("h27: replay shows a visible Skip button", !!skipBtn && hasClickListener(skipBtn));
  skipBtn.click();
  await wait(900);
  ok("h28: skipping finishes the intro", skipDone === true && !byId("rq-qffull"));

  /* Stage flows into onboarding: grade select follows the play. */
  W.RQSave.reset();
  W.RQSave.data.onboardingDone = false;
  var flowDone = false;
  ST.play(function () {
    W.RQOnboard.start();
    flowDone = true;
  });
  var fr = byId("rq-qffull");
  var fnb = fr.querySelector(".rq-qf-next");
  for (var fb = 0; fb < 20 && !flowDone; fb++) { fnb.click(); }
  await wait(900);
  ok("h29: stage flows into grade selection",
    flowDone === true && !!document.querySelector("[data-grade]"));
  clearOverlays();

  /* ================= (i) familiars screen: every button wired ================= */
  console.log("- (i) familiars screen buttons");
  W.RQSave.reset();
  W.RQSave.data.onboardingDone = true;
  /* Fully caught-up save so the hub never diverts into the catch-up flow. */
  W.RQSave.data.villainSceneSeen = true;
  W.RQSave.data.wizardName = "Brave Falcon";
  W.RQSave.hero("knight").familiar = { id: "quill", stage: 2 };
  W.RQSave.addToPetbook({ id: "glimmerfin", name: "Glimmerfin", icon: "🐟",
    rarity: "Common", color: "#9fb2cc",
    stats: { power: 4, hearts: 12, magic: 10, speed: 6 }, rescued: true });
  W.RQGame.showFamiliars();
  ok("i1: familiars screen renders", byId("screen-familiars").classList.contains("rq-active"));
  var famScreen = byId("screen-familiars");
  var setBtns = famScreen.querySelectorAll("[data-active]");
  ok("i2: Set Active buttons render for non-active pets", setBtns.length >= 1);
  var setWired = Array.prototype.every.call(setBtns, function (b) {
    return !b.disabled && hasClickListener(b);
  });
  ok("i3: every Set Active button is enabled with a click handler", setWired);
  var toolBtns = famScreen.querySelectorAll("[data-tool]");
  ok("i4: six toolbar buttons render", toolBtns.length === 6);
  var toolsWired = Array.prototype.every.call(toolBtns, function (b) {
    return hasClickListener(b);
  });
  ok("i5: every toolbar button has a click handler", toolsWired);
  ok("i6: Back button is wired", hasClickListener(byId("f-back")));
  ok("i7: gift box is wired", hasClickListener(byId("hud-gift")));

  /* Set Active produces the expected outcome: the hero's familiar changes. */
  var target = famScreen.querySelector('[data-active="glimmerfin"]');
  ok("i8: rescued familiar has a Set Active button", !!target);
  target.click();
  ok("i9: clicking Set Active changes the hero's familiar",
    W.RQSave.hero("knight").familiar.id === "glimmerfin");
  ok("i10: screen re-renders without a refresh",
    byId("screen-familiars").classList.contains("rq-active"));
  ok("i11: rescued stamp survives the re-render",
    byId("screen-familiars").textContent.indexOf("Rescued") !== -1);

  /* Toolbar navigation works from the familiars screen, no refresh. */
  function clickTool(name) {
    W.RQGame.showFamiliars();
    var b = byId("screen-familiars").querySelector('[data-tool="' + name + '"]');
    b.click();
  }
  clickTool("backpack");
  ok("i12: Backpack toolbar button navigates", byId("screen-backpack").classList.contains("rq-active"));
  clickTool("shop");
  ok("i13: Shop toolbar button navigates", byId("screen-shop").classList.contains("rq-active"));
  clickTool("map");
  ok("i14: Map toolbar button navigates", byId("screen-subjects").classList.contains("rq-active"));
  clickTool("menu");
  ok("i15: Menu toolbar button opens the menu", overlays().length === 1);
  byId("m-close").click();
  clickTool("quests");
  ok("i16: Quests toolbar button opens the goals panel", !!byId("rq-goals-ok"));
  byId("rq-goals-ok").click();
  clickTool("familiars");
  ok("i17: Familiars toolbar button returns", byId("screen-familiars").classList.contains("rq-active"));
  W.RQGame.showFamiliars();
  byId("f-back").click();
  ok("i18: Back button returns to the hub", byId("screen-hub").classList.contains("rq-active"));

  /* ================= (j) maze continuity ================= */
  console.log("- (j) maze continuity");
  W.RQSave.reset();
  W.RQSave.data.onboardingDone = true;
  W.RQSave.hero("knight").familiar = { id: "quill", stage: 2 };
  var origLaunchJ = W.RQGame.launchBattle;
  var launchJ = null, fakeResJ = null;
  W.RQGame.launchBattle = function (node, mon, heroId, sub, onDone) {
    launchJ = { node: node, mon: mon, heroId: heroId, sub: sub };
    onDone(fakeResJ);
  };
  function winRes(boss, monsterId) {
    return { victory: true, xp: 40, coins: 8, levelsGained: [], newBeasts: [],
             boss: !!boss, monsterId: monsterId, tierMove: null };
  }

  /* j1: encounter round-trip returns the player to identical x/y + facing. */
  ok("j1a: overworld opens", OW.open("science") === true);
  var jwiz = OW.state().wiz;
  jwiz.x = 200; jwiz.y = 140; jwiz.facing = "left";
  var roamer = OW.state().monsters.filter(function (m) { return !m.boss; })[0];
  ok("j1b: a roaming monster exists", !!roamer);
  var roamUid = roamer.uid;
  fakeResJ = winRes(false, roamer.def.id);
  OW._touchMonster(roamer);
  ok("j1c: battle launched for the touched monster",
    !!launchJ && launchJ.mon.id === roamer.def.id && launchJ.sub.id === "science");
  var after = OW.state();
  ok("j1d: back in the overworld", byId("screen-overworld").classList.contains("rq-active"));
  ok("j1e: player returns to the exact x/y",
    after.wiz.x === 200 && after.wiz.y === 140);
  ok("j1f: player keeps the same facing", after.wiz.facing === "left");
  ok("j1g: same dungeon", after.subjectId === "science");

  /* j2: defeated monster is gone and stays gone; layout is deterministic. */
  ok("j2a: defeat persisted per dungeon",
    W.RQSave.owDefeated("science").indexOf(roamUid) !== -1);
  var uidsAfter = OW.state().monsters.map(function (m) { return m.uid; });
  ok("j2b: defeated monster removed from the board", uidsAfter.indexOf(roamUid) === -1);
  OW.open("science");
  var uidsRe = OW.state().monsters.map(function (m) { return m.uid; });
  ok("j2c: still gone on reopen", uidsRe.indexOf(roamUid) === -1);
  ok("j2d: surviving monster uids are deterministic across opens",
    uidsAfter.sort().join(",") === uidsRe.sort().join(","));

  /* j3: the defeat survives a save/load cycle (refresh). */
  W.RQSave.load();
  ok("j3a: persisted defeat survives reload",
    W.RQSave.owDefeated("science").indexOf(roamUid) !== -1);
  OW.open("science");
  var uidsReload = OW.state().monsters.map(function (m) { return m.uid; });
  ok("j3b: defeated monster stays gone after save/load", uidsReload.indexOf(roamUid) === -1);

  /* j4: a fled-from monster remains on the board. */
  W.RQSave.data.owDefeated = {}; W.RQSave.write();
  OW.open("science");
  var fleeMon = OW.state().monsters.filter(function (m) { return !m.boss; })[0];
  var fleeUid = fleeMon.uid;
  fakeResJ = { victory: false, xp: 5, monsterId: fleeMon.def.id };
  OW._touchMonster(fleeMon);
  ok("j4a: back in the overworld after fleeing",
    byId("screen-overworld").classList.contains("rq-active"));
  var uidsFlee = OW.state().monsters.map(function (m) { return m.uid; });
  ok("j4b: fled-from monster remains", uidsFlee.indexOf(fleeUid) !== -1);
  ok("j4c: fled-from monster never persisted as defeated",
    W.RQSave.owDefeated("science").indexOf(fleeUid) === -1);

  /* j5: boss battle in the overworld keeps seal progression intact. */
  W.RQGame.launchBattle = function (node, mon, heroId, sub, onDone) {
    var S = W.RQSave;
    if (mon.boss && S.data.bossesBeaten.indexOf(mon.id) === -1) S.data.bossesBeaten.push(mon.id);
    if (node) S.recordNodeBeaten(sub.id, node.id);
    S.data.coins += 7; S.write();
    onDone({ victory: true, xp: 120, coins: 7, levelsGained: [], newBeasts: [],
             boss: !!mon.boss, monsterId: mon.id, tierMove: null });
  };
  OW.open("science");
  var bossM = OW.state().monsters.filter(function (m) { return m.boss; })[0];
  ok("j5a: boss roams the maze", !!bossM);
  var bossId = bossM.def.id;
  OW._touchMonster(bossM);
  ok("j5b: boss recorded beaten", W.RQSave.data.bossesBeaten.indexOf(bossId) !== -1);
  ok("j5c: seal progression intact (1 seal recovered)",
    W.RQSave.sealsRecovered().length === 1);
  ok("j5d: next dungeon unlocks (social)", W.RQSave.zoneUnlocked("social") === true);
  ok("j5e: beaten boss stays gone in the overworld",
    OW.state().monsters.filter(function (m) { return m.boss; }).length === 0 &&
    W.RQSave.owDefeated("science").indexOf("boss") !== -1);
  ok("j5f: Electives Wing still locked pre-2-bosses", OW.open("psychology") === false);
  W.RQGame.launchBattle = origLaunchJ;
  OW.stop();

  /* ---------------- summary ---------------- */
  console.log("\n" + passed + " passed, " + failed + " failed.");
  if (failed) {
    console.log("Failures:\n - " + failures.join("\n - "));
    process.exit(1);
  }
  process.exit(0);
})().catch(function (e) {
  console.log("HARNESS EXCEPTION:", e && e.stack || e);
  process.exit(2);
});
