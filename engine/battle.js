/* Quest Academy engine: turn-based battle loop (Prodigy-style).
   Answer subject questions to cast spells. Wrong answers only fumble
   your turn; they never damage you. */
(function () {
  "use strict";

  function pack() { return window.ContentPacks.academy; }
  function $(id) { return document.getElementById(id); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function ri(a, b) { return Math.floor(rnd(a, b + 1)); }

  function heroName(id) { return window.RQSave.heroDef(id).name; }

  var Battle = {
    /* opts: { heroId, monster, subjectId, onDone(result) } */
    start: function (opts) {
      var S = window.RQSave, A = window.RQAudio;
      var heroId = opts.heroId, def = S.heroDef(heroId), h = S.hero(heroId);
      var subjectId = opts.subjectId || S.data.activeSubject;
      var subject = pack().subjects.filter(function (x) { return x.id === subjectId; })[0] ||
                    pack().subjects[0];
      var mon = JSON.parse(JSON.stringify(opts.monster));
      var state = {
        heroHp: S.maxHp(heroId), heroMax: S.maxHp(heroId),
        monHp: mon.hp, monMax: mon.hp,
        cooldowns: {}, streak: 0, best: 0,
        familiarHealUsed: false, over: false,
        xpEarned: 0, coinsEarned: 0
      };
      var famStage = h.familiarStage;
      var famDmg = famStage >= 3 ? 4 : famStage >= 2 ? 2 : 0;

      /* ---- layout ---- */
      var scr = $("screen-battle");
      scr.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "rq-battlewrap";
      wrap.innerHTML =
        '<div class="rq-arena">' +
          '<div class="rq-fighter rq-enemy"><div class="rq-sprite" id="b-enemy-sprite">' + mon.icon + '</div>' +
          '<div class="rq-fname">' + mon.name + '</div>' +
          '<div class="rq-hpbar"><div class="rq-hpfill rq-enemyhp" id="b-enemy-hp"></div></div></div>' +
          '<div class="rq-vs">⚔️</div>' +
          '<div class="rq-fighter rq-hero"><div class="rq-sprite" id="b-hero-sprite">' + def.icon + '</div>' +
          '<div class="rq-fname">' + def.name + ' <span class="rq-lvl">Lv ' + h.level + '</span>' +
          (famStage >= 2 ? ' <span class="rq-fam" title="Familiar">' + def.familiar.icons[famStage - 1] + '</span>' : '') + '</div>' +
          '<div class="rq-hpbar"><div class="rq-hpfill rq-herohp" id="b-hero-hp"></div></div></div>' +
        '</div>' +
        '<div class="rq-bmsg" id="b-msg">A wild ' + mon.name + ' appears!</div>' +
        '<div class="rq-qzone" id="b-q"></div>' +
        '<div class="rq-spellbar" id="b-spells"></div>' +
        '<div class="rq-itembar" id="b-items"></div>';
      scr.appendChild(wrap);

      var msgEl = $("b-msg"), qEl = $("b-q");

      function paint() {
        $("b-enemy-hp").style.width = Math.max(0, state.monHp / state.monMax * 100) + "%";
        $("b-hero-hp").style.width = Math.max(0, state.heroHp / state.heroMax * 100) + "%";
      }
      function say(t) { msgEl.textContent = t; }
      function shake(id) {
        var e = $(id);
        e.classList.remove("rq-shake"); void e.offsetWidth; e.classList.add("rq-shake");
      }
      paint();
      if (mon.boss) { A.SFX.boss(); }
      renderSpells(); renderItems();

      /* ---- spell bar ---- */
      function renderSpells() {
        var bar = $("b-spells"); bar.innerHTML = "";
        var spells = S.spellsFor(heroId);
        spells.forEach(function (sp, i) {
          var b = document.createElement("button");
          b.className = "rq-spell"; b.type = "button";
          var cd = state.cooldowns[sp.name] || 0;
          b.innerHTML = '<span class="rq-spellicon">' + sp.icon + '</span><span>' + sp.name + '</span>' +
            (cd > 0 ? '<span class="rq-cd">' + cd + '</span>' : '');
          b.disabled = cd > 0 || state.over;
          b.title = sp.desc;
          b.addEventListener("click", function () { playerCast(sp); });
          bar.appendChild(b);
        });
      }

      function renderItems() {
        var bar = $("b-items"); bar.innerHTML = "";
        var items = [["potion", "🧪"], ["crystal", "💎"]];
        items.forEach(function (pair) {
          var id = pair[0];
          if ((S.data.items[id] || 0) <= 0) return;
          var b = document.createElement("button");
          b.className = "rq-item"; b.type = "button";
          b.textContent = pair[1] + " x" + S.data.items[id];
          b.addEventListener("click", function () { useItem(id); });
          bar.appendChild(b);
        });
        if (famStage >= 2 && !state.familiarHealUsed) {
          var fb = document.createElement("button");
          fb.className = "rq-item"; fb.type = "button";
          fb.textContent = def.familiar.icons[famStage - 1] + " Heal";
          fb.addEventListener("click", function () {
            state.familiarHealUsed = true;
            var amt = Math.round(state.heroMax * 0.3);
            state.heroHp = Math.min(state.heroMax, state.heroHp + amt);
            A.SFX.heal(); paint(); renderItems();
            say(def.familiar.baby + " heals you for " + amt + "!");
            setTimeout(enemyTurn, 900);
          });
          bar.appendChild(fb);
        }
      }

      function useItem(id) {
        if (state.over || (S.data.items[id] || 0) <= 0) return;
        S.data.items[id]--; S.write();
        if (id === "potion") {
          var amt = Math.round(state.heroMax * 0.5);
          state.heroHp = Math.min(state.heroMax, state.heroHp + amt);
          A.SFX.heal(); say("Potion! +" + amt + " health.");
        } else if (id === "crystal") {
          state.cooldowns = {};
          A.SFX.streak(); say("Magic crystal! All spells ready again!");
        }
        paint(); renderSpells(); renderItems();
      }

      /* ---- question generation: the hero's adaptive tier in this SUBJECT
             picks the content. Questions come from the dungeon's subject,
             not from the hero class. ---- */
      function makeQuestion() {
        var tier = S.subjectTier(heroId, subject.id).tier || pack().minTier || 17;
        var gens = subject.gens;
        var g = gens[ri(0, gens.length - 1)];
        var H = pack().helpers;
        var helpers = {
          pick: function (a) { return H.pick(Math.random, a); },
          shuffle: function (a) { return H.shuffle(Math.random, a); },
          sample: function (a, n, avoid) { return H.sample(Math.random, a, n, avoid); }
        };
        var q = g(tier, helpers);
        q.tier = tier;
        return q;
      }

      /* ---- player turn ---- */
      function playerCast(sp) {
        if (state.over) return;
        A.ensure(); A.SFX.click();
        $("b-spells").innerHTML = ""; $("b-items").innerHTML = "";
        say("Cast " + sp.name + "! Answer to unleash it...");
        var q = makeQuestion();
        var t0 = Date.now();
        window.RQQuestions.ask(qEl, q).then(function (res) {
          qEl.innerHTML = "";
          var ms = Date.now() - t0;
          var move = window.RQAdaptive.record(heroId, subject.id, { correct: res.correct, ms: ms, kind: q.kind });
          if (res.correct) {
            state.streak++; state.best = Math.max(state.best, state.streak);
            var elixirMult = S.data.elixirTurns > 0 ? 2 : 1;
            var dmg = Math.round(sp.mult * S.power(heroId) * rnd(0.9, 1.15) * elixirMult) + famDmg;
            state.monHp -= dmg;
            A.SFX.correct(); setTimeout(function () { A.SFX.hit(); }, 150);
            shake("b-enemy-sprite");
            var sTxt = state.streak >= 3 ? " 🔥 Streak x" + state.streak + "!" : "";
            say(sp.name + " hits for " + dmg + "!" + sTxt);
            if (state.streak === 5 || state.streak === 10) {
              A.SFX.streak();
              say(sTxt + " Amazing! The crowd goes wild!");
            }
            if (S.data.elixirTurns > 0) S.data.elixirTurns--;
            /* cooldowns only matter once the hero knows 2+ spells;
               with a single spell there must always be something to cast */
            if (S.spellsFor(heroId).length > 1) state.cooldowns[sp.name] = 2;
          } else {
            state.streak = 0;
            A.SFX.wrong();
            say(res.timedOut ? "Too slow! The spell fizzles... shake it off!" :
                              "Fumbled! The spell fizzles... no worries, try the next one!");
          }
          paint();
          Object.keys(state.cooldowns).forEach(function (k) {
            if (state.cooldowns[k] > 0) state.cooldowns[k]--;
          });
          if (state.monHp <= 0) { victory(move); return; }
          if (move) { showTierModal(move, continueTurn); return; }
          continueTurn();
        });

        function continueTurn() {
          setTimeout(function () { if (!state.over) { renderSpells(); renderItems(); } }, 700);
          setTimeout(function () { if (!state.over) enemyTurn(); }, 1100);
        }
      }

      /* ---- adaptive tier change: always positive framing ---- */
      function showTierModal(move, done) {
        var copy = window.RQAdaptive.copyFor(move);
        if (move.dir > 0) A.SFX.levelup(); else A.SFX.heal();
        var ov = document.createElement("div");
        ov.className = "rq-overlay";
        ov.innerHTML =
          '<div class="rq-modal"><div class="rq-bossintro">' + copy.icon + "</div>" +
          "<h2>" + copy.title + "</h2><p>" + copy.body + "</p>" +
          '<button class="rq-bigbtn" id="rq-tier-ok">' + copy.cta + " ➜</button></div>";
        document.body.appendChild(ov);
        $("rq-tier-ok").addEventListener("click", function () {
          ov.remove(); done();
        });
      }

      /* ---- enemy turn ---- */
      function enemyTurn() {
        if (state.over) return;
        if (Math.random() < 0.18) {
          say(mon.name + " fumbles its attack! Lucky!");
          setTimeout(function () { if (!state.over) { renderSpells(); renderItems(); } }, 800);
          return;
        }
        var dmg = Math.max(1, Math.round(mon.power * rnd(0.7, 1.2)));
        state.heroHp -= dmg;
        A.SFX.enemyHit(); shake("b-hero-sprite");
        say(mon.name + " hits you for " + dmg + "!");
        paint();
        if (state.heroHp <= 0) { defeat(); return; }
        setTimeout(function () { if (!state.over) { renderSpells(); renderItems(); } }, 800);
      }

      /* ---- endings ---- */
      function victory(move) {
        state.over = true;
        A.SFX.victory();
        var xp = mon.xp, coins = ri(mon.coins[0], mon.coins[1]);
        if (S.data.luckyNext) { coins *= 2; S.data.luckyNext = false; }
        var streakBonus = state.best >= 5 ? (state.best - 4) * 2 : 0;
        coins += streakBonus;
        state.xpEarned = xp; state.coinsEarned = coins;
        S.data.coins += coins;
        var gained = S.addXp(heroId, xp);
        h.battlesWon++;
        S.data.bestStreak = Math.max(S.data.bestStreak, state.best);
        if (mon.boss && S.data.bossesBeaten.indexOf(mon.id) === -1) {
          S.data.bossesBeaten.push(mon.id);
        }
        S.write();
        var newly = S.checkBeastUnlocks();
        say("Victory! +" + xp + " XP, +" + coins + " coins!");
        setTimeout(function () {
          showChest(coins, function () {
            opts.onDone({ victory: true, xp: xp, coins: coins,
                          levelsGained: gained, newBeasts: newly,
                          boss: !!mon.boss, outro: mon.outro,
                          tierMove: move || null });
          });
        }, 1200);
      }

      function defeat() {
        state.over = true;
        A.SFX.wrong();
        var consolation = Math.round(mon.xp / 3);
        S.addXp(heroId, consolation);
        S.write();
        say("You retreat to fight another day... (kept " + consolation + " XP)");
        setTimeout(function () {
          opts.onDone({ victory: false, xp: consolation });
        }, 1800);
      }

      /* ---- treasure chest ---- */
      function showChest(coins, done) {
        S.data.chestsOpened++; S.write();
        var ov = document.createElement("div");
        ov.className = "rq-overlay";
        var bonus = Math.random() < 0.3;
        var itemName = "", itemIcon = "";
        if (bonus) {
          var it = Math.random() < 0.5 ? "potion" : "crystal";
          S.data.items[it] = (S.data.items[it] || 0) + 1; S.write();
          itemName = it === "potion" ? "Healing Potion" : "Magic Crystal";
          itemIcon = it === "potion" ? "🧪" : "💎";
        }
        ov.innerHTML =
          '<div class="rq-modal rq-chestmodal">' +
            '<div class="rq-chest" id="rq-chesticon">🎁</div>' +
            '<h2>Treasure Chest!</h2>' +
            '<div class="rq-chestrewards" id="rq-chestrewards" style="display:none">' +
              '<div class="rq-reward">🪙 +' + coins + ' coins</div>' +
              (bonus ? '<div class="rq-reward">' + itemIcon + ' ' + itemName + '!</div>' : '') +
            '</div>' +
            '<button class="rq-bigbtn" id="rq-chestopen">Open it!</button>' +
          '</div>';
        document.body.appendChild(ov);
        $("rq-chestopen").addEventListener("click", function () {
          A.SFX.chest(); setTimeout(function () { A.SFX.coin(); }, 300);
          $("rq-chesticon").textContent = "💰";
          $("rq-chesticon").classList.add("rq-chestopen");
          $("rq-chestrewards").style.display = "block";
          $("rq-chestopen").textContent = "Awesome! ➜";
          $("rq-chestopen").onclick = function () {
            ov.remove(); done();
          };
        });
      }
    }
  };

  window.RQBattles = Battle;
})();
