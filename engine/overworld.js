/* Quest Academy engine: overworld exploration.
   A walkable 2D map for the current dungeon. The wizard strolls with the
   arrow keys / WASD, touch-drag on the map, or the on-screen joystick.
   Wild monsters roam with simple random-walk AI; walking into one launches
   the EXISTING battle system through RQGame.launchBattle, so adaptive
   questions, rescue, XP, coins, chests, and boss seals all keep working.
   The dungeon's world boss roams as a special boss monster: beating it in
   the overworld counts exactly like beating it from the map (seal and all).
   Winning a battle returns to the overworld; the beaten monster stays gone
   for the visit. Locked dungeons stay locked. */
(function () {
  "use strict";

  var WORLD_W = 480, WORLD_H = 360;
  var WIZ_SPEED = 150;   /* world units per second */
  var MON_SPEED = 42;
  var BOSS_SPEED = 26;
  var TOUCH_R = 30, BOSS_TOUCH_R = 42;
  var MAX_MONSTERS = 5;

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
    _wiz: { x: WORLD_W / 2, y: WORLD_H - 60 },
    _graceUntil: 0,
    _drag: null,
    _joy: null,
    _onKeyDown: null, _onKeyUp: null,
    _onTouchStart: null, _onTouchMove: null, _onTouchEnd: null,
    _onJoyStart: null, _onJoyMove: null, _onJoyEnd: null,

    /* Test hook: read-only view of live state. */
    state: function () {
      return { wiz: this._wiz, monsters: this._monsters,
               subjectId: this._subjectId, graceMsLeft: this._graceUntil - Date.now() };
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
      this._keys = {};
      this._drag = null;
      this._joy = null;
      this._monsters = [];
      this._wiz = { x: WORLD_W / 2, y: WORLD_H - 60 };
      this._graceUntil = Date.now() + 2000;

      var scr = $("screen-overworld");
      scr.innerHTML = "";
      var def = save.heroDef(save.data.activeHero);
      var wrap = el("div", "rq-ow-wrap");
      wrap.innerHTML =
        '<div class="rq-ow-top">' +
          '<button class="rq-ghostbtn" id="ow-exit">← Map</button>' +
          '<div class="rq-ow-title">' + sub.dungeon.icon + " " + sub.dungeon.name + "</div>" +
          '<div class="rq-ow-hint">Walk into a monster to battle! The 👑 boss roams here too.</div>' +
        "</div>" +
        '<div class="rq-ow-map" id="ow-map"></div>' +
        '<div class="rq-joy" id="ow-joy"><div class="rq-joyknob" id="ow-knob"></div></div>';
      scr.appendChild(wrap);

      var map = $("ow-map");
      var wizEl = el("div", "rq-ow-wiz", def.icon);
      wizEl.id = "ow-wiz";
      wizEl.title = def.name;
      map.appendChild(wizEl);

      this._spawnMonsters(map, sub);
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

    _spawnMonsters: function (map, sub) {
      var regular = sub.monsters.filter(function (m) { return !m.boss; });
      var boss = sub.monsters.filter(function (m) { return m.boss; })[0];
      var n = Math.min(MAX_MONSTERS, regular.length);
      for (var i = 0; i < n; i++) {
        this._addMonster(map, regular[i % regular.length], false, "m" + i);
      }
      if (boss) this._addMonster(map, boss, true, "boss");
    },

    _addMonster: function (map, mdef, isBoss, uid) {
      if (this._defeated[uid]) return;
      var m = {
        uid: uid, def: mdef, boss: isBoss,
        x: 40 + Math.random() * (WORLD_W - 80),
        y: 40 + Math.random() * (WORLD_H - 140),
        ang: Math.random() * Math.PI * 2,
        turnIn: Math.random(),
        el: null
      };
      if (dist(m.x, m.y, this._wiz.x, this._wiz.y) < 90) m.y = 56;
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
      this._wiz.x = clamp(this._wiz.x + dx * WIZ_SPEED * dt, 16, WORLD_W - 16);
      this._wiz.y = clamp(this._wiz.y + dy * WIZ_SPEED * dt, 16, WORLD_H - 16);

      for (i = 0; i < this._monsters.length; i++) {
        m = this._monsters[i];
        m.turnIn -= dt;
        if (m.turnIn <= 0) {
          m.turnIn = 0.6 + Math.random() * 1.4;
          m.ang = Math.random() * Math.PI * 2;
        }
        var sp = m.boss ? BOSS_SPEED : MON_SPEED;
        m.x += Math.cos(m.ang) * sp * dt;
        m.y += Math.sin(m.ang) * sp * dt;
        if (m.x < 16 || m.x > WORLD_W - 16) {
          m.ang = Math.PI - m.ang;
          m.x = clamp(m.x, 16, WORLD_W - 16);
        }
        if (m.y < 16 || m.y > WORLD_H - 16) {
          m.ang = -m.ang;
          m.y = clamp(m.y, 16, WORLD_H - 16);
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

    _paint: function () {
      var wizEl = $("ow-wiz");
      if (wizEl) {
        wizEl.style.left = (this._wiz.x / WORLD_W * 100) + "%";
        wizEl.style.top = (this._wiz.y / WORLD_H * 100) + "%";
      }
      for (var i = 0; i < this._monsters.length; i++) {
        var m = this._monsters[i];
        if (m.el) {
          m.el.style.left = (m.x / WORLD_W * 100) + "%";
          m.el.style.top = (m.y / WORLD_H * 100) + "%";
        }
      }
    },

    /* Walking into a monster launches the normal battle flow. Winning
       returns here; the beaten monster stays gone for this visit. */
    _touchMonster: function (m) {
      var self = this;
      var save = window.RQSave;
      var heroId = save.data.activeHero;
      var sub = this._sub;
      var uid = m.uid, wasBoss = m.boss;
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
        if (res && res.victory) self._defeated[uid] = true;
        self.open(self._subjectId);
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
