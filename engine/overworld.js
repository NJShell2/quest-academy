/* Quest Academy engine: overworld exploration.
   Each dungeon is a tile MAZE (see engine/maze.js): walls, corridors, and
   dead ends on a tile grid, with a difficulty ramp across the dungeon
   order. The wizard strolls with the arrow keys / WASD, touch-drag on the
   map, or the on-screen joystick; walls block movement with smooth
   axis-separated sliding. The maze is deterministic per dungeon, so
   reopening a dungeon rebuilds the identical maze.

   Wild monsters roam the corridors with wall-bouncing wander AI; walking
   into one launches the EXISTING battle system through
   RQGame.launchBattle, so adaptive questions, rescue, XP, coins, chests,
   and boss seals all keep working. The dungeon's world boss waits at the
   maze destination (the golden seal marker): beating it in the overworld
   counts exactly like beating it from the map (seal and all).

   Encounter round-trip: the wizard's position, facing, and dungeon are
   captured when a battle starts, and the player returns to those exact
   coordinates in the same maze after the battle ends (win or flee).
   A DEFEATED roaming monster is removed from the board and stays removed:
   the defeat is persisted per dungeon in the save (RQSave.owDefeated), so
   a refresh never resurrects it. Monsters the player fled from stay on
   the board. Locked dungeons stay locked. */
(function () {
  "use strict";

  var TILE = 40;   /* must match RQMaze.TILE */
  var WIZ_SPEED = 150;   /* world units per second */
  var MON_SPEED = 42;
  var BOSS_SPEED = 26;
  var TOUCH_R = 30, BOSS_TOUCH_R = 42;
  var WIZ_R = 10, MON_R = 12;
  var BOSS_LEASH = 1.7 * TILE; /* the boss never strays far from its seal */

  /* Deterministic RNG for monster placement: seeded from the dungeon's
     maze seed so every monster keeps a stable identity (uid) across
     reopens and refreshes, which the persisted defeat list relies on. */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pack() { return window.ContentPacks.academy; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function dist(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function showScreen(id) {
    Array.prototype.forEach.call(document.querySelectorAll(".rq-screen"), function (s) {
      s.classList.remove("rq-active");
    });
    $(id).classList.add("rq-active");
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  var OW = {
    _timer: null,
    _keys: {},
    _monsters: [],
    _defeated: {},
    _subjectId: null,
    _sub: null,
    _maze: null,
    _worldW: 480,
    _worldH: 360,
    _wiz: { x: 60, y: 60, facing: "down" },
    _graceUntil: 0,
    _drag: null,
    _joy: null,
    /* Round-trip snapshot captured when an encounter starts; open() uses
       it to return the player to the exact position and facing. */
    _resume: null,
    _onKeyDown: null, _onKeyUp: null,
    _onTouchStart: null, _onTouchMove: null, _onTouchEnd: null,
    _onJoyStart: null, _onJoyMove: null, _onJoyEnd: null,

    /* Test hook: read-only view of live state. */
    state: function () {
      var mz = this._maze;
      return { wiz: this._wiz, monsters: this._monsters,
               subjectId: this._subjectId, graceMsLeft: this._graceUntil - Date.now(),
               maze: mz ? { tilesW: mz.tilesW, tilesH: mz.tilesH,
                             spawnCell: mz.spawn, bossCell: mz.boss,
                             optimalLen: mz.optimalLen, diff: mz.diff } : null };
    },

    /* Open the overworld for a dungeon. Returns false when locked. */
    open: function (subjectId) {
      var save = window.RQSave;
      var sub = pack().subjects.filter(function (s) { return s.id === subjectId; })[0];
      if (!sub || !$("screen-overworld")) return false;
      if (!save.zoneUnlocked(subjectId)) {
        if (window.RQAudio) window.RQAudio.SFX.wrong();
        return false;
      }
      this.stop();
      this._subjectId = subjectId;
      this._sub = sub;
      var mz = window.RQMaze.generate(subjectId);
      this._maze = mz;
      this._worldW = mz.worldW;
      this._worldH = mz.worldH;
      this._keys = {};
      this._drag = null;
      this._joy = null;
      this._monsters = [];
      /* Defeats persist per dungeon in the save: reopening or refreshing
         never resurrects a beaten roaming monster, and uids are
         dungeon-scoped so a defeat in one dungeon never bleeds into
         another. */
      this._defeated = {};
      var dlist = save.owDefeated(subjectId);
      for (var di = 0; di < dlist.length; di++) this._defeated[dlist[di]] = true;
      /* Encounter round-trip: return to the captured position and facing
         when this open follows a battle. Otherwise start at the entrance. */
      var resume = this._resume;
      this._resume = null;
      if (resume && typeof resume.x === "number" && typeof resume.y === "number") {
        this._wiz = { x: clamp(resume.x, 0, this._worldW),
                      y: clamp(resume.y, 0, this._worldH),
                      facing: resume.facing || "down" };
      } else {
        var start = window.RQMaze.cellCenter(mz, mz.spawn.cx, mz.spawn.cy);
        this._wiz = { x: start.x, y: start.y, facing: "down" };
      }
      this._graceUntil = Date.now() + 2000;

      var scr = $("screen-overworld");
      scr.innerHTML = "";
      var def = save.heroDef(save.data.activeHero);
      var wrap = el("div", "rq-ow-wrap");
      wrap.innerHTML =
        '<div class="rq-ow-top">' +
          '<button class="rq-ghostbtn" id="ow-exit">← Map</button>' +
          '<div class="rq-ow-title">' + sub.dungeon.icon + " " + sub.dungeon.name + "</div>" +
          '<div class="rq-ow-hint">Find the golden seal and beat the 👑 boss waiting there. ' +
          "Walk into a monster to battle!</div>" +
        "</div>" +
        '<div class="rq-ow-map" id="ow-map"></div>' +
        '<div class="rq-joy" id="ow-joy"><div class="rq-joyknob" id="ow-knob"></div></div>';
      scr.appendChild(wrap);

      var map = $("ow-map");
      var cv = document.createElement("canvas");
      cv.className = "rq-ow-maze";
      cv.id = "ow-maze";
      map.appendChild(cv);
      this._paintMaze(cv, mz);

      var wizEl = el("div", "rq-ow-wiz", def.icon);
      wizEl.id = "ow-wiz";
      wizEl.title = def.name;
      map.appendChild(wizEl);

      this._spawnMonsters(map, sub, mz);
      this._paint();

      var self = this;
      $("ow-exit").addEventListener("click", function () {
        if (window.RQAudio) window.RQAudio.SFX.click();
        self.stop();
        window.RQGame.showMap();
      });
      this._bindInput(map);
      showScreen("screen-overworld");
      this._timer = setInterval(function () { self._tick(); }, 50);
      return true;
    },

    /* Halt the loop and unbind input (called on battle start and on exit). */
    stop: function () {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
      if (this._onKeyDown) {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        this._onKeyDown = null; this._onKeyUp = null;
      }
      var map = $("ow-map");
      if (map) {
        if (this._onTouchStart) {
          map.removeEventListener("touchstart", this._onTouchStart);
          map.removeEventListener("touchmove", this._onTouchMove);
          map.removeEventListener("touchend", this._onTouchEnd);
          this._onTouchStart = null;
        }
      }
      var joy = $("ow-joy");
      if (joy && this._onJoyStart) {
        joy.removeEventListener("touchstart", this._onJoyStart);
        joy.removeEventListener("mousedown", this._onJoyStart);
        window.removeEventListener("touchmove", this._onJoyMove);
        window.removeEventListener("touchend", this._onJoyEnd);
        window.removeEventListener("mousemove", this._onJoyMove);
        window.removeEventListener("mouseup", this._onJoyEnd);
        this._onJoyStart = null;
      }
      this._keys = {};
      this._drag = null;
      this._joy = null;
    },

    /* True when the circle at (x, y) with radius r touches a wall tile. */
    _hitsWall: function (x, y, r) {
      var mz = this._maze, M = window.RQMaze;
      var pts = [[x - r, y - r], [x + r, y - r], [x - r, y + r], [x + r, y + r]];
      for (var i = 0; i < pts.length; i++) {
        var t = M.tileAt(mz, pts[i][0], pts[i][1]);
        if (M.isWallTile(mz, t.tx, t.ty)) return true;
      }
      return false;
    },

    /* Move an entity, sliding along walls: try full move, then x-only,
       then y-only. Mutates ent in place. */
    _slide: function (ent, dx, dy, r) {
      if (!this._hitsWall(ent.x + dx, ent.y + dy, r)) {
        ent.x += dx; ent.y += dy; return;
      }
      if (!this._hitsWall(ent.x + dx, ent.y, r)) { ent.x += dx; return; }
      if (!this._hitsWall(ent.x, ent.y + dy, r)) { ent.y += dy; }
    },

    _spawnMonsters: function (map, sub, mz) {
      var regular = sub.monsters.filter(function (m) { return !m.boss; });
      var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
      var M = window.RQMaze;
      /* Scatter regular monsters on cells a few steps from the entrance,
         never on the boss cell. */
      var distMap = M.cellDist(mz.walls, mz.cells, mz.spawn.cx, mz.spawn.cy);
      var far = [];
      for (var x = 0; x < mz.cells; x++) {
        for (var y = 0; y < mz.cells; y++) {
          var d = distMap[x + "," + y];
          if (d !== undefined && d >= 3 &&
              !(x === mz.boss.cx && y === mz.boss.cy)) far.push({ cx: x, cy: y });
        }
      }
      /* Seeded shuffle: the layout is identical on every open, so each
         monster slot keeps a stable uid for the persisted defeat list. */
      var rng = mulberry32(mz.seed ^ 0x5bd1e995);
      for (var i = far.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var t = far[i]; far[i] = far[j]; far[j] = t;
      }
      var n = Math.min(regular.length, 3 + Math.floor(mz.diff / 2));
      for (var k = 0; k < n && k < far.length; k++) {
        var c = M.cellCenter(mz, far[k].cx, far[k].cy);
        var mdef = regular[k % regular.length];
        /* Stable per-dungeon uid: slot index plus monster id. */
        this._addMonster(map, mdef, false, "m" + k + ":" + mdef.id, c);
      }
      /* The boss waits at the maze destination, leashed near its seal. */
      if (boss) {
        var bc = M.cellCenter(mz, mz.boss.cx, mz.boss.cy);
        this._addMonster(map, boss, true, "boss", bc);
      }
    },

    _addMonster: function (map, mdef, isBoss, uid, pos) {
      if (this._defeated[uid]) return;
      var m = {
        uid: uid, def: mdef, boss: isBoss,
        x: pos.x, y: pos.y,
        ang: Math.random() * Math.PI * 2,
        el: null
      };
      var label = isBoss ? '<div class="rq-ow-bossname">👑 ' + mdef.name + "</div>" : "";
      m.el = el("div", "rq-ow-mon" + (isBoss ? " rq-ow-boss" : ""), label + mdef.icon);
      m.el.title = mdef.name;
      map.appendChild(m.el);
      this._monsters.push(m);
    },

    _tick: function () {
      var dt = 0.05, i, m;
      var dx = 0, dy = 0;
      if (this._keys.up) dy -= 1;
      if (this._keys.down) dy += 1;
      if (this._keys.left) dx -= 1;
      if (this._keys.right) dx += 1;
      if (this._drag) { dx += this._drag.x; dy += this._drag.y; }
      if (this._joy) { dx += this._joy.x; dy += this._joy.y; }
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1) { dx /= len; dy /= len; }
      /* Track facing from the dominant movement axis for the round-trip. */
      if (dx !== 0 || dy !== 0) {
        if (Math.abs(dx) >= Math.abs(dy)) this._wiz.facing = dx > 0 ? "right" : "left";
        else this._wiz.facing = dy > 0 ? "down" : "up";
      }
      this._slide(this._wiz, dx * WIZ_SPEED * dt, dy * WIZ_SPEED * dt, WIZ_R);

      var mz = this._maze, M = window.RQMaze;
      var home = M.cellCenter(mz, mz.boss.cx, mz.boss.cy);
      for (i = 0; i < this._monsters.length; i++) {
        m = this._monsters[i];
        var sp = m.boss ? BOSS_SPEED : MON_SPEED;
        var nx = m.x + Math.cos(m.ang) * sp * dt;
        var ny = m.y + Math.sin(m.ang) * sp * dt;
        if (this._hitsWall(nx, ny, MON_R)) {
          /* Bounce off the wall and wander on. */
          m.ang += (Math.random() < 0.5 ? 1 : -1) *
                   (Math.PI / 2 + Math.random() * Math.PI / 2);
        } else {
          m.x = nx; m.y = ny;
        }
        if (m.boss && dist(m.x, m.y, home.x, home.y) > BOSS_LEASH) {
          /* Steer the boss back toward its seal. */
          m.ang = Math.atan2(home.y - m.y, home.x - m.x);
        }
      }
      this._paint();

      if (Date.now() < this._graceUntil) return;
      for (i = 0; i < this._monsters.length; i++) {
        m = this._monsters[i];
        var r = m.boss ? BOSS_TOUCH_R : TOUCH_R;
        if (dist(this._wiz.x, this._wiz.y, m.x, m.y) < r) {
          this._touchMonster(m);
          return;
        }
      }
    },

    /* Draw the maze: floor, walls, entrance marker, golden boss seal. */
    _paintMaze: function (cv, mz) {
      var map = $("ow-map");
      var cw = (map && map.clientWidth) || 720;
      var ch = (map && map.clientHeight) || 540;
      cv.width = cw; cv.height = ch;
      var ctx = null;
      try { ctx = cv.getContext("2d"); } catch (e) { ctx = null; }
      if (!ctx) return;
      var sx = cw / mz.worldW, sy = ch / mz.worldH;
      function R(tx, ty, tw, th) {
        ctx.fillRect(tx * TILE * sx, ty * TILE * sy, tw * TILE * sx, th * TILE * sy);
      }
      ctx.fillStyle = "#221a44";
      ctx.fillRect(0, 0, cw, ch);
      /* Entrance marker: soft green on the spawn cell tiles. */
      ctx.fillStyle = "rgba(111,214,111,0.30)";
      R(2 * mz.spawn.cx, 2 * mz.spawn.cy, 3, 3);
      /* Boss destination: golden seal glow on the boss cell tiles. */
      ctx.fillStyle = "rgba(255,215,94,0.35)";
      R(2 * mz.boss.cx, 2 * mz.boss.cy, 3, 3);
      /* Walls. */
      var ty, tx;
      for (ty = 0; ty < mz.tilesH; ty++) {
        for (tx = 0; tx < mz.tilesW; tx++) {
          if (!mz.grid[ty][tx]) continue;
          ctx.fillStyle = "#5b4486";
          R(tx, ty, 1, 1);
          ctx.fillStyle = "rgba(255,255,255,0.10)";
          ctx.fillRect(tx * TILE * sx, ty * TILE * sy, TILE * sx, 3);
        }
      }
      /* Seal ring around the boss destination. */
      var bc = window.RQMaze.cellCenter(mz, mz.boss.cx, mz.boss.cy);
      ctx.strokeStyle = "rgba(255,215,94,0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(bc.x * sx, bc.y * sy, TILE * 0.9 * (sx + sy) / 2, 0, Math.PI * 2);
      ctx.stroke();
    },

    _paint: function () {
      var wizEl = $("ow-wiz");
      if (wizEl) {
        wizEl.style.left = (this._wiz.x / this._worldW * 100) + "%";
        wizEl.style.top = (this._wiz.y / this._worldH * 100) + "%";
      }
      for (var i = 0; i < this._monsters.length; i++) {
        var m = this._monsters[i];
        if (m.el) {
          m.el.style.left = (m.x / this._worldW * 100) + "%";
          m.el.style.top = (m.y / this._worldH * 100) + "%";
        }
      }
    },

    /* Walking into a monster launches the normal battle flow. The
       round-trip state (position, facing, dungeon) is captured BEFORE the
       battle so the player returns to the exact spot afterwards.
       A victory removes the monster permanently: the defeat is persisted
       per dungeon in the save, so refreshes never resurrect it. A fled or
       lost battle leaves the monster on the board. */
    _touchMonster: function (m) {
      var self = this;
      var save = window.RQSave;
      var heroId = save.data.activeHero;
      var sub = this._sub;
      var subjectId = this._subjectId;
      var uid = m.uid, wasBoss = m.boss;
      this._resume = { subjectId: subjectId,
                       x: this._wiz.x, y: this._wiz.y,
                       facing: this._wiz.facing || "down" };
      this.stop();
      var node = null;
      if (wasBoss) {
        for (var i = 0; i < sub.nodes.length; i++) {
          if (sub.nodes[i].monster === m.def.id) { node = sub.nodes[i]; break; }
        }
      }
      if (wasBoss && window.RQAudio) window.RQAudio.SFX.boss();
      else if (window.RQAudio) window.RQAudio.SFX.click();
      window.RQGame.launchBattle(node, m.def, heroId, sub, function (res) {
        if (res && res.victory) save.recordOwDefeated(subjectId, uid);
        self.open(subjectId);
      });
    },

    _bindInput: function (map) {
      var self = this;
      var DIRS = { ArrowUp: "up", w: "up", W: "up",
                   ArrowDown: "down", s: "down", S: "down",
                   ArrowLeft: "left", a: "left", A: "left",
                   ArrowRight: "right", d: "right", D: "right" };
      function key(e, down) {
        var dir = DIRS[e.key];
        if (!dir) return;
        self._keys[dir] = down;
        if (e.key.indexOf("Arrow") === 0 && e.preventDefault) e.preventDefault();
      }
      this._onKeyDown = function (e) { key(e, true); };
      this._onKeyUp = function (e) { key(e, false); };
      window.addEventListener("keydown", this._onKeyDown);
      window.addEventListener("keyup", this._onKeyUp);

      /* Touch-drag on the map steers the wizard like a floating stick. */
      var dragId = null, sx = 0, sy = 0;
      this._onTouchStart = function (e) {
        var t = e.changedTouches[0];
        dragId = t.identifier; sx = t.clientX; sy = t.clientY;
      };
      this._onTouchMove = function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
          var t = e.changedTouches[i];
          if (t.identifier !== dragId) continue;
          var dx = t.clientX - sx, dy = t.clientY - sy;
          var l = Math.sqrt(dx * dx + dy * dy);
          if (l < 12) { self._drag = null; }
          else {
            var n = Math.max(l, 40);
            self._drag = { x: dx / n, y: dy / n };
          }
        }
        if (e.preventDefault) e.preventDefault();
      };
      this._onTouchEnd = function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === dragId) {
            dragId = null;
            self._drag = null;
          }
        }
      };
      map.addEventListener("touchstart", this._onTouchStart, { passive: true });
      map.addEventListener("touchmove", this._onTouchMove, { passive: false });
      map.addEventListener("touchend", this._onTouchEnd);

      /* On-screen joystick (touch and mouse). */
      var joy = $("ow-joy"), knob = $("ow-knob");
      var joyActive = false;
      function vec(clientX, clientY) {
        var r = joy.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = clientX - cx, dy = clientY - cy;
        var max = r.width / 2 || 55;
        var l = Math.sqrt(dx * dx + dy * dy) || 1;
        var c = Math.min(l, max);
        dx = dx / l * c; dy = dy / l * c;
        if (knob) knob.style.transform = "translate(" + dx + "px," + dy + "px)";
        self._joy = (c < 8) ? null : { x: dx / max, y: dy / max };
      }
      function resetJoy() {
        joyActive = false;
        self._joy = null;
        if (knob) knob.style.transform = "";
      }
      this._onJoyStart = function (e) {
        joyActive = true;
        var t = e.changedTouches ? e.changedTouches[0] : e;
        vec(t.clientX, t.clientY);
        if (e.preventDefault) e.preventDefault();
      };
      this._onJoyMove = function (e) {
        if (!joyActive) return;
        var t = e.changedTouches ? e.changedTouches[0] : e;
        vec(t.clientX, t.clientY);
        if (e.preventDefault) e.preventDefault();
      };
      this._onJoyEnd = function () { resetJoy(); };
      joy.addEventListener("touchstart", this._onJoyStart, { passive: false });
      joy.addEventListener("mousedown", this._onJoyStart);
      window.addEventListener("touchmove", this._onJoyMove, { passive: false });
      window.addEventListener("touchend", this._onJoyEnd);
      window.addEventListener("mousemove", this._onJoyMove);
      window.addEventListener("mouseup", this._onJoyEnd);
    }
  };

  window.RQOverworld = OW;
})();
