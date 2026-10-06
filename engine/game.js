/* Quest Academy engine: screens and navigation
   (title, classes, hub, subjects, map, battle, shop, backpack, familiars).
   Full HUD: portrait, quest tracker banner, coins, toolbar, gift box. */
(function () {
  "use strict";

  function pack() { return window.ContentPacks.academy; }
  function subject() { return window.RQSave.activeSubject(); }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) +
           "-" + ("0" + d.getDate()).slice(-2);
  }
  function randomTip() {
    var tips = pack().tips;
    return tips[Math.floor(Math.random() * tips.length)];
  }

  function showScreen(id) {
    Array.prototype.forEach.call(document.querySelectorAll(".rq-screen"), function (s) {
      s.classList.remove("rq-active");
    });
    $(id).classList.add("rq-active");
    window.scrollTo(0, 0);
  }

  function refreshCoins() {
    var c = $("rq-coin-count");
    if (c) c.textContent = window.RQSave.data.coins;
  }

  function modal(html) {
    var ov = el("div", "rq-overlay");
    ov.innerHTML = '<div class="rq-modal">' + html + "</div>";
    document.body.appendChild(ov);
    return ov;
  }

  function toast(text) {
    var t = el("div", "rq-goaltoast", text);
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("rq-show"); }, 30);
    setTimeout(function () { t.remove(); }, 2600);
  }

  var Game = {
    _tipTimer: null,
    _catchupRunning: false,

    init: function () {
      window.RQSave.load();
      this.showTitle();
    },

    /* ---------- title (with rotating loading tips) ---------- */
    showTitle: function () {
      if (this._tipTimer) { clearInterval(this._tipTimer); this._tipTimer = null; }
      var S = window.RQSave;
      var s = $("screen-title");
      var fresh = !S.data.onboardingDone;
      s.innerHTML =
        '<div class="rq-titlewrap">' +
          '<div class="rq-gamelogo">🏰📚</div>' +
          '<h1 class="rq-gametitle">Quest Academy</h1>' +
          '<p class="rq-tagline">' + pack().tagline + "</p>" +
          '<p class="rq-story">The seven grand dungeons of the Academy have gone dark. ' +
          "THE UNMAKER has shattered the 7 Seals of Knowledge and scattered them. " +
          "Six heroes must battle through every subject, defeat the bosses, " +
          "and recover every seal. Answer to cast. Learn to win!</p>" +
          '<button class="rq-bigbtn" id="t-start">⚔️ ' +
          (fresh ? "Start Adventure" : "Continue Adventure") + "</button>" +
          '<button class="rq-ghostbtn" id="t-reset">Start over (erase saved game)</button>' +
          '<div class="rq-loadingtip" id="t-tip">💡 ' + randomTip() + "</div>" +
        "</div>";
      showScreen("screen-title");
      var tipEl = $("t-tip");
      this._tipTimer = setInterval(function () {
        if (tipEl) tipEl.textContent = "💡 " + randomTip();
      }, 4000);
      $("t-start").addEventListener("click", function () {
        window.RQAudio.ensure(); window.RQAudio.SFX.click();
        if (this._tipTimer) { clearInterval(this._tipTimer); this._tipTimer = null; }
        if (window.RQSave.data.onboardingDone) Game.showClasses();
        else window.RQOnboard.start();
      }.bind(this));
      $("t-reset").addEventListener("click", function () {
        if (confirm("Erase your whole saved game and start over?")) {
          window.RQSave.reset();
          Game.showTitle();
        }
      });
    },

    /* ---------- class select ---------- */
    showClasses: function () {
      var S = window.RQSave;
      var s = $("screen-classes");
      var html = "<h2>Choose your hero</h2>" +
        '<p class="rq-sub">Each hero brings a unique fighting style to every subject. ' +
        "Switch heroes anytime at the Hall. Every hero keeps their own progress.</p>" +
        '<div class="rq-cardgrid">';
      pack().classes.forEach(function (c) {
        var h = S.hero(c.id);
        html += '<button class="rq-classcard" data-hero="' + c.id + '">' +
          '<div class="rq-classicon" style="border-color:' + c.color + '">' + c.icon + "</div>" +
          '<div class="rq-classname">' + c.name + "</div>" +
          '<div class="rq-classtrat">' + c.strategy + "</div>" +
          '<div class="rq-classlvl">Level ' + h.level + "</div>" +
          '<div class="rq-classdesc">' + c.desc + "</div></button>";
      });
      html += '</div><h2>🔒 Challenge heroes</h2>' +
        '<p class="rq-sub">Beast Within forms: harder battles, DOUBLE experience. ' +
        "Unlock one by reaching level " + pack().beastUnlockLevel + " with its hero.</p>" +
        '<div class="rq-cardgrid">';
      pack().beasts.forEach(function (b) {
        var unlocked = S.data.beastsUnlocked.indexOf(b.id) !== -1;
        var base = pack().classes.filter(function (c) { return c.id === b.baseClass; })[0];
        var h = S.hero(b.id);
        html += '<button class="rq-classcard rq-beast' + (unlocked ? "" : " rq-locked") + '" ' +
          (unlocked ? 'data-hero="' + b.id + '"' : "disabled") + ">" +
          '<div class="rq-classicon">' + (unlocked ? b.icon : "🔒") + "</div>" +
          '<div class="rq-classname">' + b.name + "</div>" +
          '<div class="rq-classtrat">' + (unlocked ? "Beast Within: " + base.title : "Reach Lv " + pack().beastUnlockLevel + " as " + base.title) + "</div>" +
          (unlocked ? '<div class="rq-classlvl">Level ' + h.level + '</div><div class="rq-classdesc">' + b.desc + "</div>"
                    : '<div class="rq-classdesc">' + b.desc + "</div>") + "</button>";
      });
      html += "</div>";
      s.innerHTML = html;
      showScreen("screen-classes");
      Array.prototype.forEach.call(s.querySelectorAll("[data-hero]"), function (card) {
        card.addEventListener("click", function () {
          window.RQAudio.SFX.click();
          S.data.activeHero = card.getAttribute("data-hero");
          S.write();
          Game.showHub();
        });
      });
    },

    /* ---------- the full HUD (hub / subjects / map screens) ---------- */
    hudHTML: function () {
      var S = window.RQSave, id = S.data.activeHero, def = S.heroDef(id), h = S.hero(id);
      var notif = (this.dailyAvailable() || window.RQGoals.pendingCount() > 0) ?
        '<span class="rq-notifdot" title="Something needs you!"></span>' : "";
      var seals = S.sealsRecovered().length;
      var daily = this.dailyAvailable();
      return '<div class="rq-hud">' +
        '<div class="rq-portrait"><span class="rq-picon">' + def.icon + "</span>" +
          '<div class="rq-pinfo"><div class="rq-pname">' + (S.data.wizardName || def.name) + "</div>" +
          '<div class="rq-plvl">Lv ' + h.level + "</div></div>" + notif + "</div>" +
        '<div class="rq-questbanner">🌟 Recover the 7 Seals: ' + seals + "/" + pack().sealCount +
          '<br><span class="rq-questobj">' + S.nextObjective() + "</span></div>" +
        '<div class="rq-coinbox">🪙 <span id="rq-coin-count">' + S.data.coins + "</span></div>" +
        '<button class="rq-giftbox' + (daily ? " rq-canclaim" : "") + '" id="hud-gift">🎁' +
          (daily ? '<span class="rq-collect">Collect!</span>' : "") + "</button>" +
        "</div>" +
        '<div class="rq-toolbar">' +
          '<button class="rq-toolbtn" data-tool="menu">☰<span>Menu</span></button>' +
          '<button class="rq-toolbtn" data-tool="backpack">🎒<span>Backpack</span></button>' +
          '<button class="rq-toolbtn" data-tool="familiars">🐾<span>Familiars</span></button>' +
          '<button class="rq-toolbtn" data-tool="quests">🎯<span>Quests</span></button>' +
          '<button class="rq-toolbtn" data-tool="shop">🛒<span>Shop</span></button>' +
          '<button class="rq-toolbtn" data-tool="map">🗺️<span>Map</span></button>' +
        "</div>";
    },
    bindHUD: function () {
      var A = window.RQAudio;
      $("hud-gift").addEventListener("click", function () { A.SFX.click(); Game.claimDaily(); });
      Array.prototype.forEach.call(document.querySelectorAll("[data-tool]"), function (btn) {
        btn.addEventListener("click", function () {
          A.SFX.click();
          var t = btn.getAttribute("data-tool");
          if (t === "menu") Game.showMenu();
          else if (t === "backpack") Game.showBackpack();
          else if (t === "familiars") Game.showFamiliars();
          else if (t === "quests") window.RQGoals.panel();
          else if (t === "shop") Game.showShop();
          else if (t === "map") Game.showSubjects();
        });
      });
    },

    /* ---------- daily reward gift box ---------- */
    dailyAvailable: function () {
      return window.RQSave.data.daily.lastClaim !== todayStr();
    },
    claimDaily: function () {
      var S = window.RQSave, A = window.RQAudio;
      var d = S.data.daily;
      if (!this.dailyAvailable()) {
        modal("<h2>🎁 Gift Box</h2>" +
          '<p class="rq-sub">Already claimed today! Your streak is ' + d.streak +
          " day" + (d.streak === 1 ? "" : "s") + ". Come back tomorrow!</p>" +
          '<button class="rq-bigbtn" id="d-ok">OK</button>')
          .querySelector("#d-ok").addEventListener("click", function () {
            this.closest(".rq-overlay").remove();
          });
        return;
      }
      var yesterday = (function () {
        var dt = new Date(); dt.setDate(dt.getDate() - 1);
        return dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) +
               "-" + ("0" + dt.getDate()).slice(-2);
      })();
      d.streak = (d.lastClaim === yesterday) ? d.streak + 1 : 1;
      d.lastClaim = todayStr();
      var coins = 20 + d.streak * 5;
      S.data.coins += coins;
      var bonusLine = "";
      if (d.streak % 5 === 0 && S.data.inventory.indexOf("ember-ring") === -1 &&
          S.hero(S.data.activeHero).gear.ring !== "ember-ring") {
        S.grantGear("ember-ring");
        var rd = S.gearDef("ember-ring");
        bonusLine = '<div class="rq-reward">' + rd.icon + " " + rd.name + "! (Backpack ➜ Equip)</div>";
      }
      S.write();
      A.SFX.chest(); setTimeout(function () { A.SFX.coin(); }, 300);
      var ov = modal("<h2>🎁 Daily Reward!</h2>" +
        '<div class="rq-reward">🪙 +' + coins + " coins</div>" + bonusLine +
        '<div class="rq-reward">🔥 ' + d.streak + "-day streak!</div>" +
        '<button class="rq-bigbtn" id="d-ok">Awesome! ➜</button>');
      ov.querySelector("#d-ok").addEventListener("click", function () {
        ov.remove();
        Game.showHub();
      });
    },

    /* ---------- menu ---------- */
    showMenu: function () {
      var ov = modal("<h2>☰ Menu</h2>" +
        '<button class="rq-bigbtn" id="m-how">📖 How to Play</button>' +
        '<button class="rq-bigbtn" id="m-wren">🦉 Talk to Professor Wren</button>' +
        '<button class="rq-bigbtn" id="m-title">🏰 Back to Title</button>' +
        '<button class="rq-ghostbtn" id="m-reset">Start over (erase saved game)</button>' +
        '<button class="rq-ghostbtn" id="m-close">Close</button>');
      function close() { ov.remove(); }
      ov.querySelector("#m-close").addEventListener("click", close);
      ov.querySelector("#m-how").addEventListener("click", function () {
        ov.remove();
        var tips = pack().tips.map(function (t) {
          return '<div class="rq-howtip">💡 ' + t + "</div>";
        }).join("");
        var ov2 = modal("<h2>📖 How to Play</h2>" + tips +
          '<button class="rq-bigbtn" id="h-ok">Got it!</button>');
        ov2.querySelector("#h-ok").addEventListener("click", function () { ov2.remove(); });
      });
      ov.querySelector("#m-wren").addEventListener("click", function () {
        ov.remove();
        var npc = pack().npcs[0];
        window.RQOnboard.dialogue("wren", [npc.tips[Math.floor(Math.random() * npc.tips.length)]]);
      });
      ov.querySelector("#m-title").addEventListener("click", function () {
        ov.remove(); Game.showTitle();
      });
      ov.querySelector("#m-reset").addEventListener("click", function () {
        if (confirm("Erase your whole saved game and start over?")) {
          window.RQSave.reset();
          ov.remove();
          Game.showTitle();
        }
      });
    },

    /* ---------- hub (the Grand Hall) ---------- */
    showHub: function () {
      var S = window.RQSave, A = window.RQAudio;
      /* one-time catch-up for migrated saves: villain scene, name, familiar */
      if (S.data.onboardingDone && !this._catchupRunning && window.RQOnboard.needsCatchup()) {
        this._catchupRunning = true;
        window.RQOnboard.catchup(function () {
          Game._catchupRunning = false;
          Game.showHub();
        });
        return;
      }
      var id = S.data.activeHero, def = S.heroDef(id), h = S.hero(id);
      var sub = subject();
      var st = S.subjectTier(id, sub.id);
      var s = $("screen-hub");
      var xpNeed = S.xpForLevel(h.level + 1), xpHave = h.xp - S.xpForLevel(h.level);
      var xpSpan = Math.max(1, xpNeed - S.xpForLevel(h.level));
      var spells = S.spellsFor(id);
      var fam = S.activeFamiliar(id);
      var famLine = fam ? fam.icon + " " + fam.name +
        (fam.stage >= 3 ? " (evolved!)" : "") : "No familiar yet";
      s.innerHTML = this.hudHTML() +
        '<div class="rq-heropanel" style="border-color:' + def.color + '">' +
          '<div class="rq-herosprite">' + def.icon + "</div>" +
          '<div class="rq-heroinfo"><h2>' + def.name + "</h2>" +
          '<div class="rq-strategy">' + def.strategy + "</div>" +
          '<div class="rq-lvlbig">Level ' + h.level + "</div>" +
          '<div class="rq-strategy">' + sub.icon + " " + sub.name + ": 📈 " +
            window.RQAdaptive.tierLabel(st.tier) + "</div>" +
          '<div class="rq-xpbar"><div class="rq-xpfill" style="width:' +
            Math.min(100, xpHave / xpSpan * 100) + '%"></div></div>' +
          '<div class="rq-stats">❤️ ' + S.maxHp(id) + " &nbsp; 🔮 " + S.maxMagic(id) +
          " &nbsp; ⚔️ " + S.power(id) + " &nbsp; 🏆 " + h.battlesWon + " wins</div>" +
          '<div class="rq-familiar">' + famLine + "</div></div>" +
        "</div>" +
        '<div class="rq-npcs">' +
          '<button class="rq-npc" data-npc="wren">🦉<span>Professor Wren</span></button>' +
          '<button class="rq-npc" data-npc="registrar">🧑‍🏫<span>the Registrar</span></button>' +
        "</div>" +
        '<div class="rq-spelllist"><h3>Spells</h3>' +
          spells.map(function (sp) {
            return '<div class="rq-spellinfo" title="' + sp.desc + '">' + sp.icon + " " + sp.name + "</div>";
          }).join("") +
          (spells.length < def.spells.length ?
            '<div class="rq-spellinfo rq-nextspell">🔒 Next spell at Lv ' + def.spells[spells.length].level + ": " +
            def.spells[spells.length].name + "</div>" : "") +
        "</div>" +
        '<div class="rq-btnrow">' +
          '<button class="rq-bigbtn" id="h-adv">🗺️ Adventure</button>' +
          '<button class="rq-bigbtn" id="h-subj">' + sub.icon + " " + sub.name + "</button>" +
        "</div><div class=\"rq-btnrow\">" +
          '<button class="rq-bigbtn" id="h-switch">🔄 Switch Hero</button>' +
        "</div>";
      showScreen("screen-hub");
      this.bindHUD();
      Array.prototype.forEach.call(s.querySelectorAll("[data-npc]"), function (btn) {
        btn.addEventListener("click", function () {
          A.SFX.click();
          var npcId = btn.getAttribute("data-npc");
          var npc = pack().npcs.filter(function (n) { return n.id === npcId; })[0];
          window.RQOnboard.dialogue(npcId,
            [npc.tips[Math.floor(Math.random() * npc.tips.length)]]);
        });
      });
      $("h-adv").addEventListener("click", function () { A.SFX.click(); Game.showMap(); });
      $("h-subj").addEventListener("click", function () { A.SFX.click(); Game.showSubjects(); });
      $("h-switch").addEventListener("click", function () { A.SFX.click(); Game.showClasses(); });
    },

    /* ---------- subject (dungeon) select: the world map with locks ---------- */
    showSubjects: function () {
      var S = window.RQSave, A = window.RQAudio;
      var s = $("screen-subjects");
      var html = this.hudHTML() +
        '<div class="rq-hubtop"><button class="rq-ghostbtn" id="s-back">← Hall</button>' +
        '<div class="rq-loadingtip">💡 ' + randomTip() + "</div></div>" +
        "<h2>🗺️ The Academy Map</h2>" +
        '<p class="rq-sub">Seven dungeons of knowledge. Each boss you defeat unlocks the next dungeon. ' +
        "Your hero trains a separate tier in each subject.</p>";
      html += this.subjectCards(S, pack().subjects.filter(function (x) { return !x.elective; }));
      var electives = pack().subjects.filter(function (x) { return x.elective; });
      var wingOpen = S.zoneUnlocked("electives");
      html += "<h2>🎭 The Electives Wing" + (wingOpen ? "" : " 🔒") + "</h2>" +
        '<p class="rq-sub">' +
        (wingOpen ? "Knowledge you can learn from anywhere. Smaller dungeons, same glory."
                  : "Locked. Beat any 2 core dungeon bosses to open this wing.") + "</p>";
      if (wingOpen && electives.length) html += this.subjectCards(S, electives);
      s.innerHTML = html;
      showScreen("screen-subjects");
      this.bindHUD();
      $("s-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-subject]"), function (card) {
        card.addEventListener("click", function () {
          var sid = card.getAttribute("data-subject");
          if (!S.zoneUnlocked(sid)) {
            A.SFX.wrong();
            toast("🔒 Locked! " + S.nextObjective());
            return;
          }
          A.SFX.click();
          S.data.activeSubject = sid;
          S.write();
          Game.showMap();
        });
      });
    },

    subjectCards: function (S, list) {
      var html = '<div class="rq-cardgrid">';
      list.forEach(function (sub) {
        var locked = !S.zoneUnlocked(sub.id);
        var st = S.subjectTier(S.data.activeHero, sub.id);
        var prog = S.zoneProgress(sub.id);
        var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
        var beaten = boss && S.data.bossesBeaten.indexOf(boss.id) !== -1;
        html += '<button class="rq-classcard' + (locked ? " rq-locked" : "") + '" data-subject="' + sub.id + '">' +
          '<div class="rq-classicon">' + (locked ? "🔒" : sub.icon) + "</div>" +
          '<div class="rq-classname">' + sub.name + "</div>" +
          '<div class="rq-classtrat">' + sub.dungeon.name + "</div>" +
          (locked
            ? '<div class="rq-classdesc">🔒 ' + S.nextObjective() + "</div>"
            : '<div class="rq-classlvl">📈 ' + window.RQAdaptive.tierLabel(st.tier) + "</div>" +
              '<div class="rq-classdesc">' + sub.dungeon.desc + "</div>" +
              '<div class="rq-zonepct">' + prog.pct + "% explored (" + prog.beaten + "/" + prog.total + ")</div>") +
          (beaten ? '<div class="rq-classlvl">👑 Boss beaten!</div>' : "") +
          "</button>";
      });
      return html + "</div>";
    },

    /* ---------- dungeon map: sequential node unlocks + New! badges ---------- */
    showMap: function () {
      var S = window.RQSave;
      var sub = subject();
      var s = $("screen-map");
      var html = this.hudHTML() +
        '<div class="rq-hubtop"><button class="rq-ghostbtn" id="m-back">← Map</button></div>' +
        "<h2>" + sub.dungeon.icon + " " + sub.dungeon.name + "</h2>" +
        '<p class="rq-sub">' + sub.dungeon.desc + "</p>" +
        '<div class="rq-nodepath">';
      var prog = S.zoneProgress(sub.id);
      html += '<div class="rq-zonepct">' + prog.pct + "% explored (" + prog.beaten + "/" + prog.total + " nodes)</div>";
      sub.nodes.forEach(function (n, i) {
        var mon = sub.monsters.filter(function (m) { return m.id === n.monster; })[0];
        var unlocked = S.nodeUnlocked(sub.id, i);
        var beaten = n.boss ? S.data.bossesBeaten.indexOf(mon.id) !== -1
                            : (S.data.zones[sub.id] || { nodesBeaten: [] }).nodesBeaten.indexOf(n.id) !== -1;
        var isNew = unlocked && S.data.seenMonsters.indexOf(mon.id) === -1;
        html += '<button class="rq-node' + (n.boss ? " rq-bossnode" : "") +
          (unlocked ? "" : " rq-nodelocked") + '" data-node="' + i + '"' +
          (unlocked ? "" : " disabled") + ">" +
          '<div class="rq-nodeicon">' + (unlocked ? mon.icon : "🔒") + "</div>" +
          '<div class="rq-nodename">' + n.name + "</div>" +
          '<div class="rq-nodemon">' + (unlocked ? mon.name : "Locked") +
          (n.boss && unlocked ? " 👹BOSS" : "") + (beaten ? " 👑" : "") +
          (isNew ? ' <span class="rq-newbadge">New!</span>' : "") + "</div></button>";
        if (i < sub.nodes.length - 1) html += '<div class="rq-pathline">⬇</div>';
      });
      html += "</div>";
      s.innerHTML = html;
      showScreen("screen-map");
      this.bindHUD();
      $("m-back").addEventListener("click", function () {
        window.RQAudio.SFX.click(); Game.showSubjects();
      });
      var self = this;
      Array.prototype.forEach.call(s.querySelectorAll("[data-node]"), function (btn) {
        btn.addEventListener("click", function () {
          var i = parseInt(btn.getAttribute("data-node"), 10);
          if (!S.nodeUnlocked(sub.id, i)) {
            window.RQAudio.SFX.wrong();
            toast("🔒 Clear the earlier nodes first!");
            return;
          }
          window.RQAudio.SFX.click();
          var n = sub.nodes[i];
          var mon = sub.monsters.filter(function (m) { return m.id === n.monster; })[0];
          self.startBattle(n, mon, sub);
        });
      });
    },

    startBattle: function (node, mon, sub) {
      var self = this;
      var heroId = window.RQSave.data.activeHero;
      if (mon.boss) {
        var ov = modal('<div class="rq-bossintro">' + mon.icon + "</div><h2>" + mon.name + "</h2>" +
          '<p class="rq-bossquote">"' + mon.intro + '"</p>' +
          '<button class="rq-bigbtn" id="boss-fight">⚔️ Fight!</button>');
        window.RQAudio.SFX.boss();
        ov.querySelector("#boss-fight").addEventListener("click", function () {
          ov.remove();
          self.launchBattle(node, mon, heroId, sub);
        });
        return;
      }
      this.launchBattle(node, mon, heroId, sub);
    },

    launchBattle: function (node, mon, heroId, sub) {
      var self = this;
      showScreen("screen-battle");
      window.RQBattles.start({
        heroId: heroId, monster: mon, subjectId: sub.id,
        nodeId: node ? node.id : null,
        allowRescue: !mon.boss,
        rescueMonster: pack().rescueMonster,
        onDone: function (res) { self.afterBattle(res, mon); }
      });
    },

    /* after(): optional continuation for scripted flows (rescue tutorial). */
    afterBattle: function (res, mon, after) {
      var S = window.RQSave, A = window.RQAudio;
      var id = S.data.activeHero, def = S.heroDef(id);
      refreshCoins();
      function finish() { if (after) after(); else Game.showHub(); }
      if (!res.victory) {
        var ov = modal("<h2>Safe retreat!</h2><p>You kept " + res.xp + " XP. " +
          "Visit the shop for potions, then try again. Heroes never give up!</p>" +
          '<button class="rq-bigbtn" id="r-ok">Back to the Hall ➜</button>');
        ov.querySelector("#r-ok").addEventListener("click", function () {
          ov.remove(); finish();
        });
        return;
      }
      var html = res.rescued ? "<h2>💚 Rescued!</h2>" : "<h2>🏆 Victory!</h2>";
      html += '<div class="rq-results"><div>✨ +' + res.xp + " XP" + (S.isBeast(id) ? " (beast double!)" : "") + "</div>" +
        "<div>🪙 +" + res.coins + " coins</div></div>";
      res.levelsGained.forEach(function (lv) {
        html += '<div class="rq-levelup">🎉 LEVEL ' + lv + "! " + def.name + " grows stronger!</div>";
        var sp = def.spells.filter(function (x) { return x.level === lv; })[0];
        if (sp) html += '<div class="rq-newspell">✨ New spell: ' + sp.icon + " " + sp.name + "!</div>";
        var fam = S.activeFamiliar(id);
        if (lv === 7 && fam && fam.stage >= 3)
          html += '<div class="rq-newspell">' + fam.icon + " " + fam.name + " evolved!</div>";
      });
      if (res.boss && res.outro) html += '<p class="rq-bossquote">"' + res.outro + '"</p>';
      /* seal + goal checks on boss wins */
      var sealsBefore = S.sealsRecovered().length;
      if (res.boss) {
        var seals = S.sealsRecovered().length;
        if (seals > sealsBefore || S.data.bossesBeaten.indexOf(res.monsterId) !== -1) {
          html += '<div class="rq-sealfan">🔮 SEAL RECOVERED! ' + seals + "/" + pack().sealCount + "</div>";
        }
        if (res.monsterId === S.coreBossId("science")) window.RQGoals.complete("first-seal");
        if (S.coreBossesBeaten() >= 2) window.RQGoals.complete("open-electives");
        /* newly unlocked zone? */
        var order = S.coreOrder(), idx = -1;
        for (var i = 0; i < order.length; i++) {
          if (S.coreBossId(order[i]) === res.monsterId) idx = i;
        }
        if (idx !== -1 && idx + 1 < order.length) {
          var nextSub = pack().subjects.filter(function (x) { return x.id === order[idx + 1]; })[0];
          html += '<div class="rq-newspell">🗺️ New dungeon unlocked: ' + nextSub.dungeon.name + "!</div>";
        }
      }
      if (res.tierMove) {
        var tLabel = window.RQAdaptive.tierLabel(res.tierMove.tier);
        html += res.tierMove.dir > 0
          ? '<div class="rq-newspell">📈 New Heights! Now training at ' + tLabel + ".</div>"
          : '<div class="rq-newspell">🌿 Secret Side Quest: now training at ' + tLabel + ".</div>";
      }
      html += '<button class="rq-bigbtn" id="r-ok">Continue ➜</button>';
      var ov2 = modal(html);
      if (res.levelsGained.length) A.SFX.levelup();
      ov2.querySelector("#r-ok").addEventListener("click", function () {
        ov2.remove();
        /* beast unlock fanfare */
        if (res.newBeasts && res.newBeasts.length && !after) {
          res.newBeasts.forEach(function (bid) {
            var b = pack().beasts.filter(function (x) { return x.id === bid; })[0];
            var bo = modal('<div class="rq-bossintro">' + b.icon + "</div>" +
              "<h2>🔓 BEAST WITHIN UNLEASHED!</h2>" +
              "<p>The <b>" + b.name + "</b> answers your call! Harder battles, DOUBLE experience. " +
              "Find it on the hero select screen.</p>" +
              '<button class="rq-bigbtn" id="u-ok">ROAR! ➜</button>');
            A.SFX.unlock();
            bo.querySelector("#u-ok").addEventListener("click", function () {
              bo.remove(); Game.showHub();
            });
          });
        } else {
          finish();
        }
      });
    },

    /* ---------- backpack: gear slots + wizard stats + inventory ---------- */
    showBackpack: function () {
      var S = window.RQSave, A = window.RQAudio;
      var id = S.data.activeHero, def = S.heroDef(id), h = S.hero(id);
      var s = $("screen-backpack");
      var slotHtml = pack().gearSlots.map(function (slot) {
        var gid = h.gear[slot], gdef = gid ? S.gearDef(gid) : null;
        return '<div class="rq-gearslot"><div class="rq-gearslotname">' +
          pack().gearSlotNames[slot] + "</div>" +
          (gdef ? '<div class="rq-gearicon">' + gdef.icon + '</div><div class="rq-gearname">' +
            gdef.name + "</div>"
                 : '<div class="rq-gearempty">Empty</div>') + "</div>";
      }).join("");
      var invHtml = S.data.inventory.length ?
        S.data.inventory.map(function (gid) {
          var gdef = S.gearDef(gid);
          if (!gdef) return "";
          return '<div class="rq-invitem"><span class="rq-gearicon">' + gdef.icon + "</span>" +
            '<div class="rq-gearname">' + gdef.name + "</div>" +
            '<div class="rq-gearstats">⚔️ +' + gdef.power + " ❤️ +" + gdef.hp + " 🔮 +" + gdef.magic + "</div>" +
            '<div class="rq-classdesc">' + gdef.desc + "</div>" +
            '<button class="rq-buybtn" data-equip="' + gid + '">Equip</button></div>';
        }).join("") :
        '<p class="rq-sub">No spare gear yet. Finish goals to earn Scholar gear!</p>';
      s.innerHTML = this.hudHTML() +
        '<div class="rq-hubtop"><button class="rq-ghostbtn" id="b-back">← Hall</button></div>' +
        "<h2>🎒 Backpack</h2>" +
        '<p class="rq-sub">Gear for ' + def.name + ". Equip it to boost your stats.</p>" +
        '<div class="rq-geargrid">' + slotHtml + "</div>" +
        '<div class="rq-wizstats"><h3>Wizard Stats</h3>' +
        '<div class="rq-stats">❤️ ' + S.maxHp(id) + " Hearts &nbsp; 🔮 " + S.maxMagic(id) +
        " Magic &nbsp; ⚔️ " + S.power(id) + " Power</div></div>" +
        "<h3>Inventory</h3>" +
        '<div class="rq-invgrid">' + invHtml + "</div>";
      showScreen("screen-backpack");
      this.bindHUD();
      $("b-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-equip]"), function (btn) {
        btn.addEventListener("click", function () {
          A.SFX.unlock();
          S.equipGear(id, btn.getAttribute("data-equip"));
          Game.showBackpack();
        });
      });
    },

    /* ---------- familiars: the petbook collection ---------- */
    showFamiliars: function () {
      var S = window.RQSave, A = window.RQAudio;
      var id = S.data.activeHero;
      var s = $("screen-familiars");
      var active = S.activeFamiliar(id);
      var entries = [];
      if (active) entries.push({ pet: active, active: true });
      S.data.petbook.forEach(function (p) {
        if (active && p.id === active.id) return;
        entries.push({ pet: p, active: false });
      });
      var cards = entries.length ? entries.map(function (e) {
        var p = e.pet;
        var rc = p.color || (pack().rarityColors || {})[p.rarity] || "#9fb2cc";
        return '<div class="rq-famcard">' +
          '<div class="rq-rarityribbon" style="background:' + rc + '">' + (p.rarity || "Common") + "</div>" +
          (p.isNew ? '<div class="rq-newbadge rq-petnew">New!</div>' : "") +
          '<div class="rq-famart">' + p.icon + "</div>" +
          '<div class="rq-famname">' + p.name + "</div>" +
          (p.stats ? '<div class="rq-famstats">⚔️ ' + p.stats.power + " ❤️ " + p.stats.hearts +
            " 🔮 " + p.stats.magic + " 💨 " + p.stats.speed + "</div>" : "") +
          (p.rescued ? '<div class="rq-rescuedstamp">Rescued</div>' : "") +
          (p.starter ? '<div class="rq-startertag">Starter</div>' : "") +
          (e.active ? '<div class="rq-activetag">⭐ In your team</div>'
                    : '<button class="rq-buybtn" data-active="' + p.id + '">Set Active</button>') +
          "</div>";
      }).join("") : '<p class="rq-sub">No familiars yet.</p>';
      s.innerHTML = this.hudHTML() +
        '<div class="rq-hubtop"><button class="rq-ghostbtn" id="f-back">← Hall</button></div>' +
        "<h2>🐾 Familiars</h2>" +
        '<p class="rq-sub">Your petbook collection. Set which familiar fights beside ' +
        S.heroDef(id).name + ".</p>" +
        '<div class="rq-famgrid">' + cards + "</div>";
      showScreen("screen-familiars");
      this.bindHUD();
      S.markPetbookSeen();
      $("f-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-active]"), function (btn) {
        btn.addEventListener("click", function () {
          A.SFX.unlock();
          var cur = S.hero(id).familiar;
          S.hero(id).familiar = { id: btn.getAttribute("data-active"),
                                  stage: cur ? cur.stage : 2 };
          S.write();
          Game.showFamiliars();
        });
      });
    },

    /* ---------- shop ---------- */
    showShop: function () {
      var S = window.RQSave, A = window.RQAudio;
      var s = $("screen-shop");
      var id = S.data.activeHero;
      var html = this.hudHTML() +
        '<div class="rq-hubtop"><button class="rq-ghostbtn" id="sh-back">← Hall</button></div>' +
        "<h2>🛒 Academy Shop</h2><p class=\"rq-sub\">Spend coins to grow stronger. Upgrades apply to " +
        S.heroDef(id).name + ".</p><div class=\"rq-shopgrid\">";
      pack().shop.forEach(function (item) {
        var owned = item.effect === "heal" || item.effect === "crystal" || item.effect === "lucky" ?
          (S.data.items[item.id] || 0) : null;
        html += '<div class="rq-shopitem"><div class="rq-shopicon">' + item.icon + "</div>" +
          '<div class="rq-shopname">' + item.name + "</div>" +
          '<div class="rq-shopdesc">' + item.desc + "</div>" +
          (owned !== null ? '<div class="rq-owned">Owned: ' + owned + "</div>" : "") +
          '<button class="rq-buybtn" data-item="' + item.id + '">Buy: 🪙' + item.cost + "</button></div>";
      });
      html += "</div>";
      s.innerHTML = html;
      showScreen("screen-shop");
      this.bindHUD();
      $("sh-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-item]"), function (btn) {
        btn.addEventListener("click", function () {
          var itemId = btn.getAttribute("data-item");
          var item = pack().shop.filter(function (x) { return x.id === itemId; })[0];
          if (S.data.coins < item.cost) {
            A.SFX.wrong();
            toast("Not enough coins! Win battles to earn more.");
            return;
          }
          S.data.coins -= item.cost;
          if (item.effect === "power") S.hero(id).bonusPower += 2;
          else if (item.effect === "maxhp") S.hero(id).bonusHp += 10;
          else if (item.effect === "elixir") { S.data.elixirTurns = 3; }
          else if (item.effect === "lucky") { S.data.luckyNext = true; }
          else S.data.items[itemId] = (S.data.items[itemId] || 0) + 1;
          S.write(); A.SFX.coin();
          Game.showShop();
        });
      });
    }
  };

  window.RQGame = Game;
})();
