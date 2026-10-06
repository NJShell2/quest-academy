/* Quest Academy engine: screens and navigation
   (title, classes, hub, subjects, map, shop). */
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

  function showScreen(id) {
    Array.prototype.forEach.call(document.querySelectorAll(".rq-screen"), function (s) {
      s.classList.remove("rq-active");
    });
    $(id).classList.add("rq-active");
    window.scrollTo(0, 0);
  }

  function coinsHUD() {
    return '<div class="rq-coins">🪙 <span id="rq-coin-count">' +
      window.RQSave.data.coins + '</span></div>';
  }
  function refreshCoins() {
    var c = $("rq-coin-count");
    if (c) c.textContent = window.RQSave.data.coins;
  }

  function modal(html) {
    var ov = el("div", "rq-overlay");
    ov.innerHTML = '<div class="rq-modal">' + html + '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  var Game = {
    init: function () {
      window.RQSave.load();
      this.showTitle();
    },

    /* ---------- title ---------- */
    showTitle: function () {
      var s = $("screen-title");
      s.innerHTML =
        '<div class="rq-titlewrap">' +
          '<div class="rq-gamelogo">🏰📚</div>' +
          '<h1 class="rq-gametitle">Quest Academy</h1>' +
          '<p class="rq-tagline">' + pack().tagline + '</p>' +
          '<p class="rq-story">The seven grand dungeons of the Academy have gone dark. ' +
          'Monsters hoard the knowledge inside, from high school halls to college towers. ' +
          'Six heroes must battle through every subject and defeat the bosses ' +
          'who guard the deepest secrets. Answer to cast. Learn to win!</p>' +
          '<button class="rq-bigbtn" id="t-start">⚔️ Start Adventure</button>' +
          '<button class="rq-ghostbtn" id="t-reset">Start over (erase saved game)</button>' +
        '</div>';
      showScreen("screen-title");
      $("t-start").addEventListener("click", function () {
        window.RQAudio.ensure(); window.RQAudio.SFX.click();
        Game.showClasses();
      });
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
      var html = '<h2>Choose your hero</h2>' +
        '<p class="rq-sub">Each hero brings a unique fighting style to every subject. ' +
        'Switch heroes anytime at the Hall. Every hero keeps their own progress.</p>' +
        '<div class="rq-cardgrid">';
      pack().classes.forEach(function (c) {
        var h = S.hero(c.id);
        html += '<button class="rq-classcard" data-hero="' + c.id + '">' +
          '<div class="rq-classicon" style="border-color:' + c.color + '">' + c.icon + '</div>' +
          '<div class="rq-classname">' + c.name + '</div>' +
          '<div class="rq-classtrat">' + c.strategy + '</div>' +
          '<div class="rq-classlvl">Level ' + h.level + '</div>' +
          '<div class="rq-classdesc">' + c.desc + '</div></button>';
      });
      html += '</div><h2>🔒 Challenge heroes</h2>' +
        '<p class="rq-sub">Beast Within forms: harder battles, DOUBLE experience. ' +
        'Unlock one by reaching level ' + pack().beastUnlockLevel + ' with its hero.</p>' +
        '<div class="rq-cardgrid">';
      pack().beasts.forEach(function (b) {
        var unlocked = S.data.beastsUnlocked.indexOf(b.id) !== -1;
        var base = pack().classes.filter(function (c) { return c.id === b.baseClass; })[0];
        var h = S.hero(b.id);
        html += '<button class="rq-classcard rq-beast' + (unlocked ? '' : ' rq-locked') + '" ' +
          (unlocked ? 'data-hero="' + b.id + '"' : 'disabled') + '>' +
          '<div class="rq-classicon">' + (unlocked ? b.icon : '🔒') + '</div>' +
          '<div class="rq-classname">' + b.name + '</div>' +
          '<div class="rq-classtrat">' + (unlocked ? 'Beast Within: ' + base.title : 'Reach Lv ' + pack().beastUnlockLevel + ' as ' + base.title) + '</div>' +
          (unlocked ? '<div class="rq-classlvl">Level ' + h.level + '</div><div class="rq-classdesc">' + b.desc + '</div>'
                    : '<div class="rq-classdesc">' + b.desc + '</div>') + '</button>';
      });
      html += '</div>';
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

    /* ---------- hub (the Grand Hall) ---------- */
    showHub: function () {
      var S = window.RQSave, A = window.RQAudio;
      var id = S.data.activeHero, def = S.heroDef(id), h = S.hero(id);
      var sub = subject();
      var st = S.subjectTier(id, sub.id);
      var s = $("screen-hub");
      var xpNeed = S.xpForLevel(h.level + 1), xpHave = h.xp - S.xpForLevel(h.level);
      var xpSpan = Math.max(1, xpNeed - S.xpForLevel(h.level));
      var spells = S.spellsFor(id);
      var famName = ["No familiar yet (reach Lv 3!)", def.familiar.egg + " (will hatch at Lv 4)",
                     def.familiar.baby, def.familiar.adult][h.familiarStage];
      var famIcon = h.familiarStage === 0 ? "❔" : def.familiar.icons[h.familiarStage - 1];
      s.innerHTML =
        '<div class="rq-hubtop">' + coinsHUD() + '</div>' +
        '<div class="rq-heropanel" style="border-color:' + def.color + '">' +
          '<div class="rq-herosprite">' + def.icon + '</div>' +
          '<div class="rq-heroinfo"><h2>' + def.name + '</h2>' +
          '<div class="rq-strategy">' + def.strategy + '</div>' +
          '<div class="rq-lvlbig">Level ' + h.level + '</div>' +
          '<div class="rq-strategy">' + sub.icon + ' ' + sub.name + ': 📈 ' +
            window.RQAdaptive.tierLabel(st.tier) + '</div>' +
          '<div class="rq-xpbar"><div class="rq-xpfill" style="width:' +
            Math.min(100, xpHave / xpSpan * 100) + '%"></div></div>' +
          '<div class="rq-stats">❤️ ' + S.maxHp(id) + ' &nbsp; ⚔️ ' + S.power(id) +
          ' &nbsp; 🏆 ' + h.battlesWon + ' wins</div>' +
          '<div class="rq-familiar">' + famIcon + ' ' + famName + '</div></div>' +
        '</div>' +
        '<div class="rq-spelllist"><h3>Spells</h3>' +
          spells.map(function (sp) {
            return '<div class="rq-spellinfo" title="' + sp.desc + '">' + sp.icon + ' ' + sp.name + '</div>';
          }).join("") +
          (spells.length < def.spells.length ?
            '<div class="rq-spellinfo rq-nextspell">🔒 Next spell at Lv ' + def.spells[spells.length].level + ': ' +
            def.spells[spells.length].name + '</div>' : '') +
        '</div>' +
        '<div class="rq-btnrow">' +
          '<button class="rq-bigbtn" id="h-adv">🗺️ Adventure</button>' +
          '<button class="rq-bigbtn" id="h-subj">' + sub.icon + ' ' + sub.name + '</button>' +
        '</div><div class="rq-btnrow">' +
          '<button class="rq-bigbtn" id="h-shop">🛒 Shop</button>' +
          '<button class="rq-bigbtn" id="h-switch">🔄 Switch Hero</button>' +
        '</div>';
      showScreen("screen-hub");
      $("h-adv").addEventListener("click", function () { A.SFX.click(); Game.showMap(); });
      $("h-subj").addEventListener("click", function () { A.SFX.click(); Game.showSubjects(); });
      $("h-shop").addEventListener("click", function () { A.SFX.click(); Game.showShop(); });
      $("h-switch").addEventListener("click", function () { A.SFX.click(); Game.showClasses(); });
    },

    /* ---------- subject (dungeon) select ---------- */
    showSubjects: function () {
      var S = window.RQSave, A = window.RQAudio;
      var s = $("screen-subjects");
      var html = '<div class="rq-hubtop">' + coinsHUD() +
        '<button class="rq-ghostbtn" id="s-back">← Hall</button></div>' +
        '<h2>🗺️ Choose your dungeon</h2>' +
        '<p class="rq-sub">Seven dungeons of knowledge, from high school halls to college towers. ' +
        'Your hero trains a separate tier in each subject.</p>';
      html += this.subjectCards(S, pack().subjects.filter(function (x) { return !x.elective; }));
      var electives = pack().subjects.filter(function (x) { return x.elective; });
      if (electives.length) {
        html += '<h2>🎭 The Electives Wing</h2>' +
          '<p class="rq-sub">Knowledge you can learn from anywhere. Smaller dungeons, same glory.</p>';
        html += this.subjectCards(S, electives);
      }
      s.innerHTML = html;
      showScreen("screen-subjects");
      $("s-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-subject]"), function (card) {
        card.addEventListener("click", function () {
          A.SFX.click();
          S.data.activeSubject = card.getAttribute("data-subject");
          S.write();
          Game.showHub();
        });
      });
    },

    subjectCards: function (S, list) {
      var html = '<div class="rq-cardgrid">';
      list.forEach(function (sub) {
        var st = S.subjectTier(S.data.activeHero, sub.id);
        var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
        var beaten = boss && S.data.bossesBeaten.indexOf(boss.id) !== -1;
        html += '<button class="rq-classcard" data-subject="' + sub.id + '">' +
          '<div class="rq-classicon">' + sub.icon + '</div>' +
          '<div class="rq-classname">' + sub.name + '</div>' +
          '<div class="rq-classtrat">' + sub.dungeon.name + '</div>' +
          '<div class="rq-classlvl">📈 ' + window.RQAdaptive.tierLabel(st.tier) + '</div>' +
          '<div class="rq-classdesc">' + sub.dungeon.desc + '</div>' +
          (beaten ? '<div class="rq-classlvl">👑 Boss beaten!</div>' : '') +
          '</button>';
      });
      return html + '</div>';
    },

    /* ---------- dungeon map ---------- */
    showMap: function () {
      var S = window.RQSave;
      var sub = subject();
      var s = $("screen-map");
      var html = '<div class="rq-hubtop">' + coinsHUD() +
        '<button class="rq-ghostbtn" id="m-back">← Hall</button></div>' +
        '<h2>' + sub.dungeon.icon + ' ' + sub.dungeon.name + '</h2>' +
        '<p class="rq-sub">' + sub.dungeon.desc + '</p>' +
        '<div class="rq-nodepath">';
      sub.nodes.forEach(function (n, i) {
        var mon = sub.monsters.filter(function (m) { return m.id === n.monster; })[0];
        var beaten = S.data.bossesBeaten.indexOf(mon.id) !== -1 && n.boss;
        html += '<button class="rq-node' + (n.boss ? ' rq-bossnode' : '') + '" data-node="' + i + '">' +
          '<div class="rq-nodeicon">' + mon.icon + '</div>' +
          '<div class="rq-nodename">' + n.name + '</div>' +
          '<div class="rq-nodemon">' + mon.name + (n.boss ? ' 👹BOSS' : '') +
          (beaten ? ' 👑' : '') + '</div></button>';
        if (i < sub.nodes.length - 1) html += '<div class="rq-pathline">⬇</div>';
      });
      html += '</div>';
      s.innerHTML = html;
      showScreen("screen-map");
      $("m-back").addEventListener("click", function () {
        window.RQAudio.SFX.click(); Game.showHub();
      });
      var self = this;
      Array.prototype.forEach.call(s.querySelectorAll("[data-node]"), function (btn) {
        btn.addEventListener("click", function () {
          window.RQAudio.SFX.click();
          var n = sub.nodes[parseInt(btn.getAttribute("data-node"), 10)];
          var mon = sub.monsters.filter(function (m) { return m.id === n.monster; })[0];
          self.startBattle(n, mon, sub);
        });
      });
    },

    startBattle: function (node, mon, sub) {
      var self = this;
      var heroId = window.RQSave.data.activeHero;
      if (mon.boss) {
        var ov = modal('<div class="rq-bossintro">' + mon.icon + '</div><h2>' + mon.name + '</h2>' +
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
        onDone: function (res) { self.afterBattle(res, mon); }
      });
    },

    afterBattle: function (res, mon) {
      var S = window.RQSave, A = window.RQAudio;
      var id = S.data.activeHero, def = S.heroDef(id);
      refreshCoins();
      if (!res.victory) {
        var ov = modal('<h2>Safe retreat!</h2><p>You kept ' + res.xp + ' XP. ' +
          'Visit the shop for potions, then try again. Heroes never give up!</p>' +
          '<button class="rq-bigbtn" id="r-ok">Back to the Hall ➜</button>');
        ov.querySelector("#r-ok").addEventListener("click", function () {
          ov.remove(); Game.showHub();
        });
        return;
      }
      var html = '<h2>🏆 Victory!</h2>' +
        '<div class="rq-results"><div>✨ +' + res.xp + ' XP' + (S.isBeast(id) ? ' (beast double!)' : '') + '</div>' +
        '<div>🪙 +' + res.coins + ' coins</div></div>';
      res.levelsGained.forEach(function (lv) {
        html += '<div class="rq-levelup">🎉 LEVEL ' + lv + '! ' + def.name + ' grows stronger!</div>';
        var sp = def.spells.filter(function (x) { return x.level === lv; })[0];
        if (sp) html += '<div class="rq-newspell">✨ New spell: ' + sp.icon + ' ' + sp.name + '!</div>';
        var h = S.hero(id);
        if (lv === 3) html += '<div class="rq-newspell">🥚 A familiar egg appeared! It will hatch at level 4.</div>';
        if (lv === 4 && h.familiarStage >= 2) html += '<div class="rq-newspell">' + def.familiar.icons[1] + ' Your egg hatched into ' + def.familiar.baby + '!</div>';
        if (lv === 7 && h.familiarStage >= 3) html += '<div class="rq-newspell">' + def.familiar.icons[2] + ' ' + def.familiar.baby + ' evolved into ' + def.familiar.adult + '!</div>';
      });
      if (res.boss && res.outro) html += '<p class="rq-bossquote">"' + res.outro + '"</p>';
      if (res.tierMove) {
        var tLabel = window.RQAdaptive.tierLabel(res.tierMove.tier);
        html += res.tierMove.dir > 0
          ? '<div class="rq-newspell">📈 New Heights! Now training at ' + tLabel + '.</div>'
          : '<div class="rq-newspell">🌿 Secret Side Quest: now training at ' + tLabel + '.</div>';
      }
      html += '<button class="rq-bigbtn" id="r-ok">Continue ➜</button>';
      var ov2 = modal(html);
      if (res.levelsGained.length) A.SFX.levelup();
      ov2.querySelector("#r-ok").addEventListener("click", function () {
        ov2.remove();
        /* beast unlock fanfare */
        if (res.newBeasts && res.newBeasts.length) {
          res.newBeasts.forEach(function (bid) {
            var b = pack().beasts.filter(function (x) { return x.id === bid; })[0];
            var bo = modal('<div class="rq-bossintro">' + b.icon + '</div>' +
              '<h2>🔓 BEAST WITHIN UNLEASHED!</h2>' +
              '<p>The <b>' + b.name + '</b> answers your call! Harder battles, DOUBLE experience. ' +
              'Find it on the hero select screen.</p>' +
              '<button class="rq-bigbtn" id="u-ok">ROAR! ➜</button>');
            A.SFX.unlock();
            bo.querySelector("#u-ok").addEventListener("click", function () {
              bo.remove(); Game.showHub();
            });
          });
        } else {
          Game.showHub();
        }
      });
    },

    /* ---------- shop ---------- */
    showShop: function () {
      var S = window.RQSave, A = window.RQAudio;
      var s = $("screen-shop");
      var id = S.data.activeHero;
      var html = '<div class="rq-hubtop">' + coinsHUD() +
        '<button class="rq-ghostbtn" id="sh-back">← Hall</button></div>' +
        '<h2>🛒 Academy Shop</h2><p class="rq-sub">Spend coins to grow stronger. Upgrades apply to ' +
        S.heroDef(id).name + '.</p><div class="rq-shopgrid">';
      pack().shop.forEach(function (item) {
        var owned = item.effect === "heal" || item.effect === "crystal" || item.effect === "lucky" ?
          (S.data.items[item.id] || 0) : null;
        html += '<div class="rq-shopitem"><div class="rq-shopicon">' + item.icon + '</div>' +
          '<div class="rq-shopname">' + item.name + '</div>' +
          '<div class="rq-shopdesc">' + item.desc + '</div>' +
          (owned !== null ? '<div class="rq-owned">Owned: ' + owned + '</div>' : '') +
          '<button class="rq-buybtn" data-item="' + item.id + '">Buy: 🪙' + item.cost + '</button></div>';
      });
      html += '</div>';
      s.innerHTML = html;
      showScreen("screen-shop");
      $("sh-back").addEventListener("click", function () { A.SFX.click(); Game.showHub(); });
      Array.prototype.forEach.call(s.querySelectorAll("[data-item]"), function (btn) {
        btn.addEventListener("click", function () {
          var itemId = btn.getAttribute("data-item");
          var item = pack().shop.filter(function (x) { return x.id === itemId; })[0];
          if (S.data.coins < item.cost) {
            A.SFX.wrong();
            alert("Not enough coins! Win battles to earn more.");
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
