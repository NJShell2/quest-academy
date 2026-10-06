/* Quest Academy engine: save system. Per-hero progress, per-subject tiers,
   shared coins. localStorage only. No accounts, no network.
   The save namespace is unique to Quest Academy so it can never collide
   with Reading Quest saves.

   Schema v3 adds: wizardName, grade, onboarding state, guide flags,
   hero.familiar (object, replacing familiarStage), hero.gear slots,
   inventory, goals, quests, petbook, seenMonsters, zone progress,
   daily reward state. v1 saves migrate automatically. */
(function () {
  "use strict";
  var KEY = "quest-academy-save-v1";
  var SAVE_VERSION = 3;

  function pack() { return window.ContentPacks.academy; }

  function freshTier() {
    return { tier: (pack().minTier || 17), recent: [],
             answersSinceChange: 0, sinceEval: 0 };
  }

  function freshGear() {
    var g = {};
    pack().gearSlots.forEach(function (s) { g[s] = null; });
    return g;
  }

  function freshHero() {
    var h = { xp: 0, level: 1, bonusPower: 0, bonusHp: 0,
              familiar: null, gear: freshGear(), battlesWon: 0, tiers: {} };
    pack().subjects.forEach(function (s) { h.tiers[s.id] = freshTier(); });
    return h;
  }

  function defaultGoals() {
    return window.RQGoals ? window.RQGoals.defaults() : [];
  }

  function fresh() {
    var s = { v: SAVE_VERSION, coins: 25, activeHero: "knight",
              activeSubject: pack().subjects[0].id,
              wizardName: "", grade: null,
              onboardingDone: false, onboardingStep: "grade",
              guideMet: false, villainSceneSeen: false,
              heroes: {}, beastsUnlocked: [], bossesBeaten: [],
              chestsOpened: 0, bestStreak: 0,
              items: { potion: 1, crystal: 0, elixir: 0, lucky: 0 },
              luckyNext: false, elixirTurns: 0,
              inventory: [], goals: defaultGoals(),
              quests: { sealsRecovered: [] },
              petbook: [], seenMonsters: [], zones: {},
              daily: { lastClaim: "", streak: 0 } };
    pack().classes.forEach(function (c) { s.heroes[c.id] = freshHero(); });
    pack().beasts.forEach(function (b) { s.heroes[b.id] = freshHero(); });
    return s;
  }

  /* Build a migrated "classic" familiar from the old familiarStage. */
  function classicFamiliar(heroId, stage) {
    var def = pack().classes.filter(function (c) { return c.id === heroId; })[0];
    if (!def) {
      var b = pack().beasts.filter(function (x) { return x.id === heroId; })[0];
      if (b) def = pack().classes.filter(function (c) { return c.id === b.baseClass; })[0];
    }
    if (!def) return null;
    var idx = Math.min(3, Math.max(1, stage)) - 1;
    return {
      id: "classic-" + heroId, stage: stage,
      name: stage >= 3 ? def.familiar.adult : def.familiar.baby,
      icon: def.familiar.icons[idx],
      rarity: "Common",
      stats: { power: 3, hearts: 10, magic: 8, speed: 5 },
      classic: true
    };
  }

  function migrateV1(old) {
    var n = fresh();
    ["coins", "activeHero", "activeSubject", "beastsUnlocked", "bossesBeaten",
     "chestsOpened", "bestStreak", "items", "luckyNext", "elixirTurns"
    ].forEach(function (k) {
      if (old[k] !== undefined) n[k] = old[k];
    });
    Object.keys(old.heroes || {}).forEach(function (id) {
      var oh = old.heroes[id];
      if (!n.heroes[id]) n.heroes[id] = freshHero();
      var nh = n.heroes[id];
      ["xp", "level", "bonusPower", "bonusHp", "battlesWon"].forEach(function (k) {
        if (oh[k] !== undefined) nh[k] = oh[k];
      });
      pack().subjects.forEach(function (sub) {
        if (oh.tiers && oh.tiers[sub.id]) nh.tiers[sub.id] = oh.tiers[sub.id];
      });
      var stage = oh.familiarStage || 0;
      nh.familiar = stage > 0 ? classicFamiliar(id, stage) : null;
      nh.gear = freshGear();
    });
    /* Veterans skip the scripted opening but meet the new systems once. */
    n.onboardingDone = true;
    n.onboardingStep = "done";
    n.villainSceneSeen = false;
    /* Mark already-earned early goals so veterans are not asked to redo them. */
    var anyBattles = Object.keys(n.heroes).some(function (id) {
      return n.heroes[id].battlesWon > 0;
    });
    var anyFamiliar = Object.keys(n.heroes).some(function (id) {
      return !!n.heroes[id].familiar;
    });
    n.goals.forEach(function (g) {
      if (g.id === "win-first-battle" && anyBattles) g.done = true;
      if (g.id === "choose-familiar" && anyFamiliar) g.done = true;
    });
    n.v = SAVE_VERSION;
    return n;
  }

  function ensureTiers(s) {
    Object.keys(s.heroes).forEach(function (id) {
      pack().subjects.forEach(function (sub) {
        if (!s.heroes[id].tiers) s.heroes[id].tiers = {};
        if (!s.heroes[id].tiers[sub.id]) s.heroes[id].tiers[sub.id] = freshTier();
      });
      if (!s.heroes[id].gear) s.heroes[id].gear = freshGear();
      if (!Array.isArray(s.heroes[id].familiar) && s.heroes[id].familiar === undefined) {
        s.heroes[id].familiar = null;
      }
    });
    if (!Array.isArray(s.inventory)) s.inventory = [];
    if (!Array.isArray(s.goals)) s.goals = defaultGoals();
    if (!s.quests) s.quests = { sealsRecovered: [] };
    if (!Array.isArray(s.petbook)) s.petbook = [];
    if (!Array.isArray(s.seenMonsters)) s.seenMonsters = [];
    if (!s.zones) s.zones = {};
    if (!s.daily) s.daily = { lastClaim: "", streak: 0 };
    if (typeof s.wizardName !== "string") s.wizardName = "";
    if (typeof s.onboardingDone !== "boolean") s.onboardingDone = true;
    if (typeof s.villainSceneSeen !== "boolean") s.villainSceneSeen = false;
  }

  var Save = {
    data: null,
    load: function () {
      try {
        var raw = window.localStorage.getItem(KEY);
        if (raw) {
          var s = JSON.parse(raw);
          if (s && s.v === SAVE_VERSION) {
            ensureTiers(s);
            this.data = s;
            return s;
          }
          if (s && s.v === 1) {
            var m = migrateV1(s);
            this.data = m;
            this.write();
            return m;
          }
        }
      } catch (e) {}
      this.data = fresh();
      this.write();
      return this.data;
    },
    write: function () {
      try { window.localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) {}
    },
    reset: function () {
      this.data = fresh();
      this.write();
    },
    hero: function (id) {
      if (!this.data.heroes[id]) this.data.heroes[id] = freshHero();
      return this.data.heroes[id];
    },
    /* Per-subject adaptive tier record for a hero. */
    subjectTier: function (heroId, subjectId) {
      var h = this.hero(heroId);
      if (!h.tiers[subjectId]) h.tiers[subjectId] = freshTier();
      return h.tiers[subjectId];
    },
    activeSubject: function () {
      var p = pack(), id = this.data.activeSubject;
      var found = p.subjects.filter(function (s) { return s.id === id; })[0];
      return found || p.subjects[0];
    },
    isBeast: function (id) {
      return pack().beasts.some(function (b) { return b.id === id; });
    },
    heroDef: function (id) {
      var c = pack().classes.filter(function (x) { return x.id === id; })[0];
      if (c) return c;
      var b = pack().beasts.filter(function (x) { return x.id === id; })[0];
      if (b) {
        var base = pack().classes.filter(function (x) { return x.id === b.baseClass; })[0];
        return { id: b.id, name: b.name, title: b.name, strategy: base.strategy,
                 desc: b.desc, icon: b.icon, color: base.color,
                 hp: b.hp, power: b.power, spells: base.spells, gens: base.gens,
                 familiar: base.familiar, beast: true, baseId: b.baseClass };
      }
      return null;
    },
    /* ---- gear bonuses feed the wizard stats ---- */
    gearBonus: function (id, stat) {
      var g = this.hero(id).gear, total = 0, p = pack();
      Object.keys(g || {}).forEach(function (slot) {
        var gid = g[slot];
        if (!gid) return;
        var def = p.gear.filter(function (x) { return x.id === gid; })[0];
        if (def && def[stat]) total += def[stat];
      });
      return total;
    },
    maxHp: function (id) {
      return this.heroDef(id).hp + this.hero(id).bonusHp + this.gearBonus(id, "hp");
    },
    power: function (id) {
      return this.heroDef(id).power + this.hero(id).bonusPower + this.gearBonus(id, "power");
    },
    maxMagic: function (id) {
      return 100 + this.gearBonus(id, "magic");
    },
    grantGear: function (gearId) {
      if (this.data.inventory.indexOf(gearId) === -1) this.data.inventory.push(gearId);
      this.write();
    },
    equipGear: function (heroId, gearId) {
      var p = pack();
      var def = p.gear.filter(function (x) { return x.id === gearId; })[0];
      if (!def) return false;
      var h = this.hero(heroId), slot = def.slot;
      var cur = h.gear[slot];
      var ix = this.data.inventory.indexOf(gearId);
      if (ix !== -1) this.data.inventory.splice(ix, 1);
      if (cur && this.data.inventory.indexOf(cur) === -1) this.data.inventory.push(cur);
      h.gear[slot] = gearId;
      this.write();
      return true;
    },
    gearDef: function (gearId) {
      return pack().gear.filter(function (x) { return x.id === gearId; })[0] || null;
    },
    /* ---- familiars: the active companion per hero ---- */
    familiarDef: function (fid) {
      var p = pack(), f;
      f = p.starterFamiliars.filter(function (x) { return x.id === fid; })[0];
      if (f) return f;
      f = this.data.petbook.filter(function (x) { return x.id === fid; })[0];
      if (f) return f;
      return null;
    },
    activeFamiliar: function (heroId) {
      var fam = this.hero(heroId).familiar;
      if (!fam) return null;
      var def = this.familiarDef(fam.id);
      if (fam.classic && !def) return fam;
      if (!def) return null;
      return { id: fam.id, stage: fam.stage, name: def.name, icon: def.icon,
               rarity: def.rarity, stats: def.stats, desc: def.desc,
               classic: !!fam.classic };
    },
    familiarDmg: function (heroId) {
      var fam = this.activeFamiliar(heroId);
      if (!fam || fam.stage < 2) return 0;
      var base = fam.stage >= 3 ? 4 : 2;
      return base + Math.floor(((fam.stats && fam.stats.power) || 0) / 5);
    },
    xpForLevel: function (level) {
      var t = pack().xpTable;
      return t[level] !== undefined ? t[level] : t[t.length - 1] + (level - t.length + 1) * 300;
    },
    /* Add XP; returns array of levels gained (for fanfare). Handles beast 2x mult. */
    addXp: function (id, amount) {
      var h = this.hero(id);
      var mult = this.isBeast(id) ? pack().beastXpMult : 1;
      h.xp += Math.round(amount * mult);
      var gained = [];
      while (h.level < pack().maxLevel && h.xp >= this.xpForLevel(h.level + 1)) {
        h.level += 1;
        gained.push(h.level);
      }
      /* the chosen familiar evolves at level 7 */
      if (h.familiar && h.familiar.stage === 2 && h.level >= 7) {
        h.familiar.stage = 3;
      }
      this.write();
      return gained;
    },
    spellsFor: function (id) {
      var def = this.heroDef(id), lvl = this.hero(id).level;
      return def.spells.filter(function (s) { return s.level <= lvl; });
    },
    checkBeastUnlocks: function () {
      /* Returns list of newly unlocked beast ids. */
      var self = this, newly = [];
      pack().beasts.forEach(function (b) {
        if (self.data.beastsUnlocked.indexOf(b.id) === -1 &&
            self.hero(b.baseClass).level >= pack().beastUnlockLevel) {
          self.data.beastsUnlocked.push(b.id);
          /* beasts enter the ladder above the basics, still adaptive,
             in every subject */
          pack().subjects.forEach(function (sub) {
            self.subjectTier(b.id, sub.id).tier = pack().beastStartTier || 19;
          });
          newly.push(b.id);
        }
      });
      if (newly.length) this.write();
      return newly;
    },
    /* ---- zones: sequential dungeon unlocks ---- */
    coreBossId: function (subjectId) {
      var sub = pack().subjects.filter(function (s) { return s.id === subjectId; })[0];
      if (!sub) return null;
      var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
      return boss ? boss.id : null;
    },
    coreBossName: function (subjectId) {
      var sub = pack().subjects.filter(function (s) { return s.id === subjectId; })[0];
      if (!sub) return "the boss";
      var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
      return boss ? boss.name : "the boss";
    },
    coreOrder: function () { return pack().coreOrder; },
    zoneUnlocked: function (zoneId) {
      var order = this.coreOrder(), i = order.indexOf(zoneId);
      if (i === -1) {
        /* the Electives Wing: any 2 core dungeon bosses beaten */
        return this.coreBossesBeaten() >= 2;
      }
      if (i === 0) return true;
      var prevBoss = this.coreBossId(order[i - 1]);
      return !!prevBoss && this.data.bossesBeaten.indexOf(prevBoss) !== -1;
    },
    coreBossesBeaten: function () {
      var self = this, n = 0;
      this.coreOrder().forEach(function (sid) {
        var bid = self.coreBossId(sid);
        if (bid && self.data.bossesBeaten.indexOf(bid) !== -1) n++;
      });
      return n;
    },
    zoneProgress: function (zoneId) {
      var sub = pack().subjects.filter(function (s) { return s.id === zoneId; })[0];
      if (!sub) return { beaten: 0, total: 0, pct: 0 };
      var z = this.data.zones[zoneId] || { nodesBeaten: [] };
      var beaten = z.nodesBeaten.length, total = sub.nodes.length;
      return { beaten: beaten, total: total, pct: total ? Math.round(beaten / total * 100) : 0 };
    },
    recordNodeBeaten: function (zoneId, nodeId) {
      if (!zoneId || !nodeId) return;
      var z = this.data.zones[zoneId];
      if (!z) { z = { nodesBeaten: [] }; this.data.zones[zoneId] = z; }
      if (z.nodesBeaten.indexOf(nodeId) === -1) z.nodesBeaten.push(nodeId);
      this.write();
    },
    nodeUnlocked: function (zoneId, idx) {
      if (!this.zoneUnlocked(zoneId)) return false;
      if (idx === 0) return true;
      var sub = pack().subjects.filter(function (s) { return s.id === zoneId; })[0];
      if (!sub || !sub.nodes[idx - 1]) return false;
      var z = this.data.zones[zoneId] || { nodesBeaten: [] };
      return z.nodesBeaten.indexOf(sub.nodes[idx - 1].id) !== -1;
    },
    /* ---- the 7 Seals main quest ---- */
    sealsRecovered: function () {
      var self = this, seals = [];
      this.coreOrder().forEach(function (sid) {
        var bid = self.coreBossId(sid);
        if (bid && self.data.bossesBeaten.indexOf(bid) !== -1) seals.push(bid);
      });
      return seals;
    },
    nextObjective: function () {
      var order = this.coreOrder(), self = this;
      for (var i = 0; i < order.length; i++) {
        var bid = self.coreBossId(order[i]);
        if (bid && self.data.bossesBeaten.indexOf(bid) === -1) {
          var sub = pack().subjects.filter(function (s) { return s.id === order[i]; })[0];
          return "Defeat " + self.coreBossName(order[i]) + " in " + sub.dungeon.name;
        }
      }
      return "The Academy is safe. THE UNMAKER is unmade!";
    },
    /* ---- monsters seen (for New! badges) ---- */
    markSeen: function (monsterId) {
      if (this.data.seenMonsters.indexOf(monsterId) === -1) {
        this.data.seenMonsters.push(monsterId);
        this.write();
      }
    },
    /* ---- petbook ---- */
    addToPetbook: function (entry) {
      var found = this.data.petbook.filter(function (p) { return p.id === entry.id; })[0];
      if (found) { found.seen = true; }
      else {
        entry.isNew = true;
        this.data.petbook.push(entry);
      }
      this.write();
    },
    markPetbookSeen: function () {
      this.data.petbook.forEach(function (p) { p.isNew = false; });
      this.write();
    },
    ownedCount: function (monsterId) {
      return this.data.petbook.filter(function (p) { return p.id === monsterId; }).length;
    }
  };

  window.RQSave = Save;
})();
