/* Quest Academy engine: onboarding + goals.
   RQGoals: the goals/quest engine. Goals complete on game events and
   fire rewards (the Scholar gear gift sequence).
   RQOnboard: the scripted new-player opening in spec order:
   grade select -> Professor Wren intro -> free Scholar's Wand ->
   scripted tutorial battle vs Nullbyte -> level 2 victory + rewards ->
   Your Goals panel -> starter familiar choice -> THE UNMAKER cutscene ->
   rescue tutorial battle -> wizard name picker -> world map intro ->
   quest chain intro -> full HUD hub. */
(function () {
  "use strict";

  function pack() { return window.ContentPacks.academy; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ================= RQGoals: the goals engine ================= */
  var Goals = {
    defaults: function () {
      return [
        { id: "win-first-battle", title: "Win the First Battle",
          desc: "Defeat Nullbyte and finish Professor Wren's battle lesson.",
          done: false, reward: null },
        { id: "choose-familiar", title: "Choose a Familiar",
          desc: "Pick one of the 5 starter familiars to join your team.",
          done: false, reward: "scholars-cap" },
        { id: "rescue-friend", title: "Rescue a Wild Friend",
          desc: "Weaken Glimmerfin below 30% health, then press RESCUE.",
          done: false, reward: "scholars-robes" },
        { id: "pick-wizard-name", title: "Choose a Wizard Name",
          desc: "Pick your Academy name. Tip: never use your real name!",
          done: false, reward: "scholars-boots" },
        { id: "first-seal", title: "Recover the First Seal",
          desc: "Defeat DOCTOR ENTROPY and take back the Seal of Science.",
          done: false, reward: null },
        { id: "open-electives", title: "Open the Electives Wing",
          desc: "Beat any 2 core dungeon bosses to unlock new halls.",
          done: false, reward: null }
      ];
    },
    list: function () { return window.RQSave.data.goals; },
    get: function (id) {
      return this.list().filter(function (g) { return g.id === id; })[0] || null;
    },
    pendingCount: function () {
      return this.list().filter(function (g) { return !g.done; }).length;
    },
    /* Complete a goal on a game event. Fires the reward (gear gift) if any,
       then calls after(). Safe to call for already-done goals. */
    complete: function (id, after) {
      var g = this.get(id);
      if (!g) { if (after) after(); return false; }
      if (!g.done) {
        g.done = true;
        window.RQSave.write();
        this.toast(g);
        if (window.RQAudio) window.RQAudio.SFX.unlock();
      }
      if (g.reward && !g.rewardGiven) {
        g.rewardGiven = true;
        window.RQSave.write();
        window.RQOnboard.grantGearReward(g.reward, after);
      } else if (after) {
        after();
      }
      return true;
    },
    toast: function (g) {
      var t = el("div", "rq-goaltoast", "✅ Goal complete: <b>" + g.title + "</b>");
      document.body.appendChild(t);
      setTimeout(function () { t.classList.add("rq-show"); }, 30);
      setTimeout(function () { t.remove(); }, 3200);
    },
    rewardName: function (gearId) {
      var d = window.RQSave.gearDef(gearId);
      return d ? d.icon + " " + d.name : "";
    },
    /* The "Your Goals" panel. Auto-opens after the tutorial battle;
       the Quests toolbar button opens it anytime. */
    panel: function (opts) {
      opts = opts || {};
      var ov = el("div", "rq-overlay");
      var cards = this.list().map(function (g) {
        return '<div class="rq-goalcard' + (g.done ? " rq-goaldone" : "") + '">' +
          '<div class="rq-goalcheck">' + (g.done ? "✅" : "⬜") + "</div>" +
          '<div class="rq-goalbody"><div class="rq-goaltitle">' + g.title + "</div>" +
          '<div class="rq-goaldesc">' + g.desc + "</div>" +
          (g.reward ? '<div class="rq-goalreward">🎁 Reward: ' + Goals.rewardName(g.reward) + "</div>" : "") +
          '<div class="rq-goalstate">' + (g.done ? "Complete!" : "To do") + "</div></div></div>";
      }).join("");
      ov.innerHTML = '<div class="rq-modal rq-goalsmodal"><h2>🎯 Your Goals</h2>' +
        (opts.auto ? '<p class="rq-sub">New goals appear as you adventure. Finish them for gear!</p>' : "") +
        '<div class="rq-goallist">' + cards + "</div>" +
        '<button class="rq-bigbtn" id="rq-goals-ok">' +
        (opts.auto ? "Continue ➜" : "Close") + "</button></div>";
      document.body.appendChild(ov);
      $("rq-goals-ok").addEventListener("click", function () {
        ov.remove();
        if (opts.onClose) opts.onClose();
      });
    }
  };
  window.RQGoals = Goals;

  /* ================= RQOnboard: the scripted opening ================= */
  var GRADE_TIERS = { "Grade 9": 17, "Grade 10": 19, "Grade 11": 21,
                      "Grade 12": 23, "College": 25 };

  function showScreen(id) {
    Array.prototype.forEach.call(document.querySelectorAll(".rq-screen"), function (s) {
      s.classList.remove("rq-active");
    });
    $(id).classList.add("rq-active");
    window.scrollTo(0, 0);
  }

  function modal(html, wide) {
    var ov = el("div", "rq-overlay");
    ov.innerHTML = '<div class="rq-modal' + (wide ? " rq-widemodal" : "") + '">' + html + "</div>";
    document.body.appendChild(ov);
    return ov;
  }

  /* Animated hand pointer that guides every click in scripted sequences. */
  var Onboard = {
    pointerEl: null,
    pointer: function (target, text) {
      this.clearPointer();
      var p = el("div", "rq-pointer",
        '<div class="rq-pointerhand">👉</div>' +
        (text ? '<div class="rq-pointertext">' + text + "</div>" : ""));
      p.id = "rq-pointer";
      document.body.appendChild(p);
      try {
        var r = target.getBoundingClientRect();
        p.style.left = Math.max(8, r.left + r.width / 2 - 40) + "px";
        p.style.top = Math.max(8, r.top - 64) + "px";
      } catch (e) {}
      this.pointerEl = p;
      return p;
    },
    clearPointer: function () {
      var p = $("rq-pointer");
      if (p) p.remove();
      this.pointerEl = null;
    },

    /* NPC dialogue modal: lines advance one at a time. */
    dialogue: function (npcId, lines, done) {
      var npc = pack().npcs.filter(function (n) { return n.id === npcId; })[0] || pack().npcs[0];
      var i = 0;
      var ov = modal('<div class="rq-npcbig">' + npc.icon + "</div>" +
        '<div class="rq-npcname">' + npc.name + ' <span class="rq-npcrole">' + npc.role + "</span></div>" +
        '<p class="rq-npctext" id="rq-dtext"></p>' +
        '<button class="rq-bigbtn" id="rq-dnext">Next ➜</button>');
      function show() {
        $("rq-dtext").textContent = lines[i];
        $("rq-dnext").textContent = (i === lines.length - 1) ? "Let's go! ➜" : "Next ➜";
      }
      show();
      $("rq-dnext").addEventListener("click", function () {
        window.RQAudio.SFX.click();
        i++;
        if (i >= lines.length) { ov.remove(); if (done) done(); }
        else show();
      });
    },

    /* Entry point: resumes the scripted opening at the saved step. */
    start: function () {
      var S = window.RQSave;
      if (S.data.onboardingDone) { window.RQGame.showHub(); return; }
      var step = S.data.onboardingStep || "grade";
      var map = {
        grade: "gradeSelect", wren: "wrenIntro", wand: "wandGift",
        tutorial: "tutorialBattle", goals: "goalsPanelAuto",
        familiar: "familiarChoice", villain: "villainCutscene",
        rescue: "rescueBattle", name: "namePicker",
        map: "worldMapIntro", quest: "questChainIntro"
      };
      var fn = map[step] || "gradeSelect";
      this.setStep(step);
      this[fn]();
    },
    setStep: function (step) {
      window.RQSave.data.onboardingStep = step;
      window.RQSave.write();
    },

    /* ---- 1. grade select: seeds the adaptive tier ---- */
    gradeSelect: function () {
      var self = this;
      this.setStep("grade");
      var s = $("screen-title");
      var html = '<div class="rq-titlewrap"><div class="rq-gamelogo">🏰📚</div>' +
        '<h1 class="rq-gametitle">Quest Academy</h1>' +
        '<h2>What grade are you in?</h2>' +
        '<p class="rq-sub">This sets your starting challenge in every subject. ' +
        'The Academy keeps adapting after that, so there is no wrong answer.</p>';
      Object.keys(GRADE_TIERS).forEach(function (g) {
        html += '<button class="rq-bigbtn rq-gradebtn" data-grade="' + g + '">' + g + "</button>";
      });
      html += "</div>";
      s.innerHTML = html;
      showScreen("screen-title");
      Array.prototype.forEach.call(s.querySelectorAll("[data-grade]"), function (btn) {
        btn.addEventListener("click", function () {
          window.RQAudio.SFX.click();
          self.seedGrade(btn.getAttribute("data-grade"));
        });
      });
    },
    seedGrade: function (grade) {
      var S = window.RQSave;
      var tier = GRADE_TIERS[grade] || 17;
      S.data.grade = grade;
      Object.keys(S.data.heroes).forEach(function (hid) {
        pack().subjects.forEach(function (sub) {
          S.subjectTier(hid, sub.id).tier = tier;
        });
      });
      S.write();
      this.wrenIntro();
    },

    /* ---- 3. Professor Wren intro dialogue ---- */
    wrenIntro: function () {
      var self = this;
      this.setStep("wren");
      window.RQSave.data.guideMet = true;
      window.RQSave.write();
      this.dialogue("wren", [
        "Hoo! Welcome to Quest Academy, young scholar! I am Professor Wren, your guide.",
        "Answer questions to cast spells. A correct answer always hits. A wrong one just fizzles, never fear.",
        "But first, every scholar needs a wand. I have one for you... FREE!"
      ], function () { self.wandGift(); });
    },

    /* ---- 4. FREE Scholar's Wand with a Wear / Not now moment ---- */
    wandGift: function () {
      var self = this;
      this.setStep("wand");
      var S = window.RQSave;
      S.grantGear("scholars-wand");
      this.grantGearReward("scholars-wand", function () { self.tutorialBattle(); }, true);
    },

    /* Wear / Not now modal for any gear gift. firstGift tweaks the copy. */
    grantGearReward: function (gearId, after, firstGift) {
      var S = window.RQSave, A = window.RQAudio;
      var def = S.gearDef(gearId);
      var ov = modal('<div class="rq-bossintro">' + def.icon + "</div>" +
        "<h2>🎁 " + (firstGift ? "A gift from Professor Wren!" : "You earned gear!") + "</h2>" +
        '<div class="rq-gearname">' + def.name + "</div>" +
        '<p class="rq-sub">' + def.desc + "</p>" +
        '<div class="rq-gearstats">⚔️ +' + def.power + " Power &nbsp; ❤️ +" + def.hp +
        " Hearts &nbsp; 🔮 +" + def.magic + " Magic</div>" +
        '<button class="rq-bigbtn" id="rq-wear">Wear it!</button>' +
        '<button class="rq-ghostbtn" id="rq-notnow">Not now</button>');
      function done() { ov.remove(); if (after) after(); }
      $("rq-wear").addEventListener("click", function () {
        S.equipGear(S.data.activeHero, gearId);
        A.SFX.unlock();
        done();
      });
      $("rq-notnow").addEventListener("click", function () { A.SFX.click(); done(); });
    },

    /* ---- 5. scripted tutorial battle vs Nullbyte ---- */
    makeQuestion: function (subjectId) {
      var S = window.RQSave;
      var subject = pack().subjects.filter(function (x) { return x.id === subjectId; })[0] ||
                    pack().subjects[0];
      var tier = S.subjectTier(S.data.activeHero, subject.id).tier || pack().minTier || 17;
      var gens = subject.gens;
      var g = gens[Math.floor(Math.random() * gens.length)];
      var H = pack().helpers;
      var helpers = {
        pick: function (a) { return H.pick(Math.random, a); },
        shuffle: function (a) { return H.shuffle(Math.random, a); },
        sample: function (a, n, avoid) { return H.sample(Math.random, a, n, avoid); }
      };
      var q = g(tier, helpers);
      q.tier = tier;
      return q;
    },

    tutorialBattle: function () {
      var self = this, S = window.RQSave, A = window.RQAudio;
      this.setStep("tutorial");
      var heroId = S.data.activeHero, def = S.heroDef(heroId), h = S.hero(heroId);
      var mon = JSON.parse(JSON.stringify(pack().tutorialMonster));
      S.markSeen(mon.id);
      var sp = S.spellsFor(heroId)[0];
      var COST = 30;
      var state = { monHp: mon.hp, monMax: mon.hp, magic: 30, maxMagic: 60 };

      var scr = $("screen-battle");
      scr.innerHTML = "";
      var wrap = el("div", "rq-battlewrap");
      wrap.innerHTML =
        '<div class="rq-coach" id="tut-coach"><span class="rq-coachicon">🦉</span>' +
          '<span id="tut-coachtext"></span></div>' +
        '<div class="rq-arena">' +
          '<div class="rq-fighter rq-enemy"><div class="rq-sprite" id="tut-enemy">' + mon.icon + "</div>" +
          '<div class="rq-fname">' + mon.name + "</div>" +
          '<div class="rq-hpbar"><div class="rq-hpfill rq-enemyhp" id="tut-ehp"></div></div></div>' +
          '<div class="rq-vs">⚔️</div>' +
          '<div class="rq-fighter rq-hero"><div class="rq-sprite">' + def.icon + "</div>" +
          '<div class="rq-fname">' + def.name + ' <span class="rq-lvl">Lv ' + h.level + "</span></div>" +
          '<div class="rq-hpbar"><div class="rq-hpfill rq-herohp" style="width:100%"></div></div></div>' +
        "</div>" +
        '<div class="rq-magicwrap"><span class="rq-magicon">🔮</span>' +
          '<div class="rq-magicbar"><div class="rq-magicfill" id="tut-magic"></div></div>' +
          '<span class="rq-magicnum" id="tut-magicnum"></span></div>' +
        '<div class="rq-qzone" id="tut-q"></div>' +
        '<div class="rq-spellbar" id="tut-spells"></div>' +
        '<div class="rq-itembar" id="tut-items"></div>';
      scr.appendChild(wrap);
      showScreen("screen-battle");

      var card = el("button", "rq-spell", '<span class="rq-spellicon">' + sp.icon + "</span>" +
        '<span class="rq-spellname">' + sp.name + "</span>" +
        '<span class="rq-spellstats">Power ' + sp.mult.toFixed(1) + "x · Aim 100 · Recharge 0</span>" +
        '<span class="rq-spellcost">🔮 ' + COST + "</span>");
      card.type = "button"; card.id = "tut-card";
      $("tut-spells").appendChild(card);
      var med = el("button", "rq-item rq-meditate", "🧘 Meditate");
      med.type = "button"; med.id = "tut-meditate";
      $("tut-items").appendChild(med);

      function coach(t) { $("tut-coachtext").textContent = t; }
      function paint() {
        $("tut-ehp").style.width = Math.max(0, state.monHp / state.monMax * 100) + "%";
        $("tut-magic").style.width = Math.max(0, state.magic / state.maxMagic * 100) + "%";
        $("tut-magicnum").textContent = state.magic + "/" + state.maxMagic + " Magic";
        card.classList.toggle("rq-unaffordable", state.magic < COST);
      }
      function shake(elm) {
        elm.classList.remove("rq-shake"); void elm.offsetWidth; elm.classList.add("rq-shake");
      }
      paint();

      /* ask until correct: wrong answers just fizzle, never punish */
      function askQuestion(cb) {
        var q = self.makeQuestion("science");
        window.RQQuestions.ask($("tut-q"), q).then(function (res) {
          $("tut-q").innerHTML = "";
          if (res.correct) { cb(); }
          else {
            A.SFX.wrong();
            coach("Good try! That one fizzled. Here is another one!");
            setTimeout(function () { askQuestion(cb); }, 900);
          }
        });
      }

      function bigCast(dmg, after) {
        A.SFX.correct();
        card.classList.add("rq-castbig");
        setTimeout(function () { A.SFX.hit(); }, 200);
        state.monHp -= dmg;
        paint();
        shake($("tut-enemy"));
        setTimeout(function () {
          card.classList.remove("rq-castbig");
          after();
        }, 900);
      }

      /* step 0: click the card, then the target */
      coach("This is your spell card. It shows Power, Aim, and Recharge. Click it!");
      self.pointer(card, "Click your spell!");
      card.addEventListener("click", function step0() {
        card.removeEventListener("click", step0);
        A.SFX.click();
        card.classList.add("rq-cardbig");
        self.clearPointer();
        coach("Now choose a target: click " + mon.name + "!");
        var enemy = $("tut-enemy");
        self.pointer(enemy, "Click " + mon.name + "!");
        enemy.addEventListener("click", function step1() {
          enemy.removeEventListener("click", step1);
          A.SFX.click();
          self.clearPointer();
          coach("Answer the question to unleash your spell!");
          askQuestion(function () {
            state.magic -= COST;
            paint();
            bigCast(15, function () {
              coach("Direct hit! " + mon.name + " took 15 damage!");
              setTimeout(enemyFumble, 1400);
            });
          });
        });
      });

      /* scripted enemy miss */
      function enemyFumble() {
        coach(mon.name + " charges at you...");
        setTimeout(function () {
          A.SFX.wrong();
          coach(mon.name + " glitches and trips over its own code! It MISSES!");
          setTimeout(outOfMagic, 1600);
        }, 1100);
      }

      /* Out of Magic -> Meditate */
      function outOfMagic() {
        paint();
        coach("Out of Magic! Your spell card went grey. Click MEDITATE, then answer to refill your Magic.");
        self.pointer(med, "Click MEDITATE!");
        med.addEventListener("click", function stepM() {
          med.removeEventListener("click", stepM);
          A.SFX.click();
          self.clearPointer();
          askQuestion(function () {
            /* tutorial mirrors battle meditate: correct +45, wrong +15.
               Wrong answers re-ask above, so a correct answer lands here. */
            state.magic = Math.min(state.maxMagic, state.magic + 45);
            A.SFX.heal();
            paint();
            coach("Clear mind! +45 Magic. Now cast again: click your spell card!");
            self.pointer(card, "Cast again!");
            card.addEventListener("click", function step2() {
              card.removeEventListener("click", step2);
              A.SFX.click();
              state.magic -= COST;
              card.classList.add("rq-cardbig");
              paint();
              self.clearPointer();
              coach("Select a target: click " + mon.name + "!");
              var enemy = $("tut-enemy");
              self.pointer(enemy, "Click " + mon.name + "!");
              enemy.addEventListener("click", function step3() {
                enemy.removeEventListener("click", step3);
                A.SFX.click();
                self.clearPointer();
                coach("Answer to unleash it!");
                askQuestion(function () {
                  bigCast(15, function () {
                    coach("Another direct hit!");
                    setTimeout(wrenCallsItOff, 1400);
                  });
                });
              });
            });
          });
        });
      }

      /* Wren calls off the battle: friendly auto-end */
      function wrenCallsItOff() {
        self.dialogue("wren", [
          "That's enough! " + mon.name + " yields! Well fought, scholar.",
          "You have learned the heart of battle: answer, cast, and keep your Magic flowing."
        ], function () { self.victoryLevel2(); });
      }
    },

    /* ---- 6a. victory screen guaranteeing level 2 ---- */
    victoryLevel2: function () {
      var S = window.RQSave, A = window.RQAudio;
      var heroId = S.data.activeHero, def = S.heroDef(heroId);
      var need = Math.max(0, S.xpForLevel(2) - S.hero(heroId).xp);
      var gained = need > 0 ? S.addXp(heroId, need) : [];
      var coins = 20;
      S.data.coins += coins;
      S.hero(heroId).battlesWon++;
      S.write();
      A.SFX.levelup();
      setTimeout(function () { A.SFX.victory(); }, 400);
      var ov = modal('<div class="rq-victoryburst">🎉</div>' +
        '<div class="rq-star">⭐</div>' +
        "<h2>YOU REACHED LEVEL 2!</h2>" +
        '<p class="rq-sub">' + def.name + " grows stronger! The Academy celebrates its newest scholar.</p>" +
        '<button class="rq-bigbtn" id="rq-vl-ok">Claim rewards ➜</button>');
      $("rq-vl-ok").addEventListener("click", function () {
        ov.remove();
        Onboard.rewardsScreen(need, coins);
      });
    },

    /* ---- 6b. dedicated rewards screen (XP + coins) ---- */
    rewardsScreen: function (xp, coins) {
      var A = window.RQAudio;
      A.SFX.coin();
      var ov = modal("<h2>🏆 Battle Rewards</h2>" +
        '<div class="rq-results"><div>✨ +' + xp + " XP</div>" +
        "<div>🪙 +" + coins + " coins</div></div>" +
        '<button class="rq-bigbtn" id="rq-rw-ok">Awesome! ➜</button>');
      $("rq-rw-ok").addEventListener("click", function () {
        ov.remove();
        window.RQGoals.complete("win-first-battle", function () {
          Onboard.goalsPanelAuto();
        });
      });
    },

    /* ---- 7. Your Goals panel auto-opens ---- */
    goalsPanelAuto: function () {
      this.setStep("goals");
      var self = this;
      window.RQGoals.panel({ auto: true, onClose: function () { self.familiarChoice(); } });
    },

    /* ---- 8. starter familiar choice (5 options, per hero) ---- */
    familiarChoice: function (done) {
      var self = this, S = window.RQSave, A = window.RQAudio;
      this.setStep("familiar");
      var heroId = S.data.activeHero;
      var fams = pack().starterFamiliars;
      var cards = fams.map(function (f) {
        var rc = (pack().rarityColors || {})[f.rarity] || "#9fb2cc";
        return '<div class="rq-famcard">' +
          '<div class="rq-rarityribbon" style="background:' + rc + '">' + f.rarity + "</div>" +
          '<div class="rq-famart">' + f.icon + "</div>" +
          '<div class="rq-famname">' + f.name + "</div>" +
          '<div class="rq-famstats">⚔️ ' + f.stats.power + " Power &nbsp; ❤️ " + f.stats.hearts +
          " Hearts<br>🔮 " + f.stats.magic + " Magic &nbsp; 💨 " + f.stats.speed + " Speed</div>" +
          '<div class="rq-famdesc">' + f.desc + "</div>" +
          '<button class="rq-bigbtn rq-fampick" data-fam="' + f.id + '">Add to Team</button></div>';
      }).join("");
      var ov = modal("<h2>🦉 Choose your familiar!</h2>" +
        '<p class="rq-sub">Professor Wren: "Every scholar needs a companion. Pick one, it is yours to keep. It evolves at level 7!"</p>' +
        '<div class="rq-famgrid">' + cards + "</div>", true);
      Array.prototype.forEach.call(ov.querySelectorAll("[data-fam]"), function (btn) {
        btn.addEventListener("click", function () {
          var fid = btn.getAttribute("data-fam");
          var f = fams.filter(function (x) { return x.id === fid; })[0];
          S.hero(heroId).familiar = { id: fid, stage: 2 };
          S.addToPetbook({ id: fid, name: f.name, icon: f.icon, rarity: f.rarity,
                           color: (pack().rarityColors || {})[f.rarity],
                           stats: f.stats, desc: f.desc, starter: true });
          S.write();
          A.SFX.unlock();
          ov.remove();
          window.RQGoals.complete("choose-familiar", function () {
            if (done) done();
            else self.villainCutscene();
          });
        });
      });
    },

    /* ---- 9. villain cutscene: THE UNMAKER shatters the 7 Seals ---- */
    villainCutscene: function (done) {
      var self = this;
      this.setStep("villain");
      var V = pack().villain;
      var ov = el("div", "rq-overlay rq-villainov");
      ov.innerHTML = '<div class="rq-modal rq-villainmodal">' +
        '<div class="rq-villainicon">' + V.icon + "</div>" +
        "<h2>" + V.name + "</h2>" +
        '<div class="rq-villaintitle">' + V.title + "</div>" +
        '<p class="rq-sub" id="rq-vtext"></p>' +
        '<div class="rq-seals" id="rq-vseals"></div>' +
        '<button class="rq-bigbtn" id="rq-vnext">What happened? ➜</button></div>';
      document.body.appendChild(ov);
      var stage = 0;
      var texts = [
        "The 7 Seals of Knowledge kept the Academy's light burning for a thousand years.",
        "Then HE came. Watch...",
        "Shattered. Scattered across the 7 dungeons. Only a true scholar can recover them."
      ];
      $("rq-vtext").textContent = texts[0];
      $("rq-vseals").textContent = "🔮🔮🔮🔮🔮🔮🔮";
      $("rq-vnext").addEventListener("click", function () {
        window.RQAudio.SFX.click();
        stage++;
        if (stage === 1) {
          $("rq-vtext").textContent = texts[1];
          $("rq-vnext").textContent = "Watch ➜";
        } else if (stage === 2) {
          /* shatter the seals one by one */
          $("rq-vnext").style.display = "none";
          var seals = $("rq-vseals"), n = 7;
          window.RQAudio.SFX.boss();
          var iv = setInterval(function () {
            n--;
            var broken = "", whole = "";
            for (var i = 0; i < 7 - n; i++) broken += "💥";
            for (var j = 0; j < n; j++) whole += "🔮";
            seals.textContent = whole + broken;
            if (n <= 0) {
              clearInterval(iv);
              $("rq-vtext").textContent = texts[2];
              $("rq-vnext").style.display = "";
              $("rq-vnext").textContent = "I accept the quest! ➜";
            }
          }, 450);
        } else {
          ov.remove();
          self.mainQuestCard(done);
        }
      });
    },

    mainQuestCard: function (done) {
      var S = window.RQSave;
      S.data.villainSceneSeen = true;
      S.write();
      var ov = modal("<h2>🌟 MAIN QUEST</h2>" +
        '<div class="rq-questcard"><div class="rq-questtitle">Recover the 7 Seals</div>' +
        '<p class="rq-sub">THE UNMAKER shattered the 7 Seals of Knowledge. ' +
        "Each dungeon boss guards one seal. Defeat all 7 bosses, reclaim every seal, " +
        "and drive the darkness out of the Academy.</p>" +
        '<div class="rq-questprogress">Seals recovered: 0/7</div></div>' +
        '<button class="rq-bigbtn" id="rq-mq-ok">I accept! ➜</button>');
      $("rq-mq-ok").addEventListener("click", function () {
        window.RQAudio.SFX.unlock();
        ov.remove();
        if (done) done();
        else Onboard.rescueBattle();
      });
    },

    /* ---- 10. rescue tutorial battle vs Glimmerfin ---- */
    rescueBattle: function () {
      var self = this;
      this.setStep("rescue");
      showScreen("screen-battle");
      window.RQBattles.start({
        heroId: window.RQSave.data.activeHero,
        monster: pack().rescueMonster,
        subjectId: "science",
        allowRescue: true,
        rescueGuide: true,
        rescueMonster: pack().rescueMonster,
        onDone: function (res) {
          window.RQGame.afterBattle(res, pack().rescueMonster, function () {
            window.RQGoals.complete("rescue-friend", function () {
              self.namePicker();
            });
          });
        }
      });
    },

    /* ---- 11. wizard name picker ---- */
    namePicker: function (done) {
      var self = this;
      this.setStep("name");
      var adjs = pack().nameAdjectives, nouns = pack().nameNouns;
      function opts(list) {
        return list.map(function (w) { return '<option value="' + w + '">' + w + "</option>"; }).join("");
      }
      var ov = modal("<h2>✨ Choose your wizard name!</h2>" +
        '<p class="rq-namewarn">⚠️ Don\'t choose your real name!</p>' +
        '<div class="rq-namerow"><label>Adjective<br><select id="rq-adj" class="rq-namesel">' +
        opts(adjs) + '</select></label>' +
        '<label>Noun<br><select id="rq-noun" class="rq-namesel">' + opts(nouns) +
        '</select></label></div>' +
        '<button class="rq-ghostbtn" id="rq-randomname">🎲 Random</button>' +
        '<div class="rq-namepreview" id="rq-nameprev"></div>' +
        '<button class="rq-bigbtn" id="rq-namesave">That is my name! ➜</button>');
      function preview() {
        $("rq-nameprev").textContent = $("rq-adj").value + " " + $("rq-noun").value;
      }
      $("rq-adj").addEventListener("change", preview);
      $("rq-noun").addEventListener("change", preview);
      $("rq-randomname").addEventListener("click", function () {
        window.RQAudio.SFX.click();
        $("rq-adj").selectedIndex = Math.floor(Math.random() * adjs.length);
        $("rq-noun").selectedIndex = Math.floor(Math.random() * nouns.length);
        preview();
      });
      preview();
      $("rq-namesave").addEventListener("click", function () {
        var name = $("rq-adj").value + " " + $("rq-noun").value;
        window.RQSave.data.wizardName = name;
        window.RQSave.write();
        window.RQAudio.SFX.unlock();
        ov.remove();
        window.RQGoals.complete("pick-wizard-name", function () {
          if (done) done();
          else self.worldMapIntro();
        });
      });
    },

    /* ---- 12. world map intro -> the locked world map ---- */
    worldMapIntro: function () {
      var self = this;
      this.setStep("map");
      this.dialogue("wren", [
        "The Academy's dungeons lie under shadow. Only the Alchemy Depths stand open... for now.",
        "Each boss you defeat unlocks the NEXT dungeon. The Electives Wing opens after two bosses fall.",
        "Math's Infinite Tower opens last of all. Choose your first dungeon, scholar!"
      ], function () {
        window.RQGame.showSubjects();
        self.questChainIntro();
      });
    },

    /* ---- 13. quest chain intro: story cards + tracker banner ---- */
    questChainIntro: function () {
      var self = this;
      this.setStep("quest");
      var cards = [
        { icon: "🌑", title: "What happened",
          body: "THE UNMAKER shattered the 7 Seals of Knowledge and scattered them across the dungeons." },
        { icon: "🔮", title: "What the seals do",
          body: "Each seal guards a dungeon's deepest knowledge. Recovering one relights that hall forever." },
        { icon: "⚔️", title: "Battle! Level Up!",
          body: "Fight monsters, answer to cast, beat the 7 bosses, and take back every seal." }
      ];
      var i = 0;
      var ov = modal('<div class="rq-bossintro" id="rq-qc-icon"></div>' +
        '<h2 id="rq-qc-title"></h2><p class="rq-sub" id="rq-qc-body"></p>' +
        '<button class="rq-bigbtn" id="rq-qc-next">Next ➜</button>');
      function show() {
        $("rq-qc-icon").textContent = cards[i].icon;
        $("rq-qc-title").textContent = cards[i].title;
        $("rq-qc-body").textContent = cards[i].body;
        $("rq-qc-next").textContent = (i === cards.length - 1) ? "Begin! ➜" : "Next ➜";
      }
      show();
      $("rq-qc-next").addEventListener("click", function () {
        window.RQAudio.SFX.click();
        i++;
        if (i >= cards.length) {
          ov.remove();
          self.finishOnboarding();
        } else show();
      });
    },

    finishOnboarding: function () {
      var S = window.RQSave;
      S.data.onboardingDone = true;
      S.data.onboardingStep = "done";
      S.write();
      window.RQGame.showHub();
    },

    /* ---- catch-up for migrated (v1) saves: one-time new-system intros ---- */
    needsCatchup: function () {
      var S = window.RQSave;
      return !S.data.villainSceneSeen || !S.data.wizardName ||
             !S.hero(S.data.activeHero).familiar;
    },
    catchup: function (done) {
      var self = this, S = window.RQSave;
      if (!S.data.villainSceneSeen) {
        this.villainCutscene(function () { self.catchup(done); });
        return;
      }
      if (!S.data.wizardName) {
        this.namePicker(function () { self.catchup(done); });
        return;
      }
      if (!S.hero(S.data.activeHero).familiar) {
        this.familiarChoice(function () { self.catchup(done); });
        return;
      }
      if (done) done();
    }
  };
  window.RQOnboard = Onboard;
})();
