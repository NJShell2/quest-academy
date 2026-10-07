/* Quest Academy engine: deterministic tile mazes for overworld dungeons.
   Each dungeon becomes a real maze puzzle: walls, corridors, and dead ends
   on a tile grid. The wizard walks it with the existing movement controls;
   walls block movement (axis-separated sliding so corners feel smooth).

   Guaranteed solvable: the layout is a carved spanning tree (recursive
   backtracker) with extra loop walls knocked down, so the cell graph is
   always connected. The entrance is cell (0,0) and the boss waits at the
   cell farthest from the entrance, which is reachable by construction.

   Difficulty ramp: grid size grows with dungeon order (4x4 cells for the
   first core dungeon up to 10x10 for the last), extra loops get rarer, and
   per-subject seeds are chosen so the entrance-to-boss optimal path ramps
   strictly upward along the core order. Electives stay easy to medium.

   Generation is deterministic per subject id: reopening a dungeon rebuilds
   the identical maze, so players can learn it. */
(function () {
  "use strict";

  var TILE = 40; /* world units per maze tile */

  function hashStr(s) {
    var h = 5381, i;
    for (i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var ELECTIVE_ORDER = ["psychology", "sociology", "law", "mythology",
    "writing", "musictheory", "arthistory", "spanish", "csprinc"];

  /* Per-subject maze seeds. Chosen so the entrance-to-boss optimal path
     ramps strictly upward along the core dungeon order (science shortest,
     math longest) and every elective lands between those extremes.
     tests/test.js verifies the ramp; if the generator ever changes, pick
     fresh seeds that satisfy the ramp and update this table. */
  var SEEDS = {
    science: 1, social: 1, english: 2, health: 25, business: 9,
    technology: 10, math: 12,
    psychology: 1, sociology: 1, law: 1, mythology: 1, writing: 1,
    musictheory: 1, arthistory: 1, spanish: 1, csprinc: 1
  };

  /* Difficulty: 0..6 along the core order; electives cycle easy..medium. */
  function difficulty(subjectId) {
    var core = [];
    try { core = window.ContentPacks.academy.coreOrder; } catch (e) {}
    var ci = core.indexOf(subjectId);
    if (ci !== -1) return ci;
    var ei = ELECTIVE_ORDER.indexOf(subjectId);
    if (ei !== -1) return 1 + (ei % 3);
    return 2;
  }

  function cellsFor(diff) { return 4 + diff; } /* 4..10 cells per side */

  /* Breadth-first distances over the cell graph, keyed "cx,cy". */
  function cellDist(cells, c, sx, sy) {
    var dist = {}, q = [[sx, sy]], head = 0;
    dist[sx + "," + sy] = 0;
    while (head < q.length) {
      var cur = q[head++], x = cur[0], y = cur[1], d = dist[x + "," + y];
      var nb = [];
      if (y > 0 && !cells[x][y].n) nb.push([x, y - 1]);
      if (y < c - 1 && !cells[x][y].s) nb.push([x, y + 1]);
      if (x > 0 && !cells[x][y].w) nb.push([x - 1, y]);
      if (x < c - 1 && !cells[x][y].e) nb.push([x + 1, y]);
      for (var i = 0; i < nb.length; i++) {
        var k = nb[i][0] + "," + nb[i][1];
        if (dist[k] === undefined) { dist[k] = d + 1; q.push(nb[i]); }
      }
    }
    return dist;
  }

  function generate(subjectId, seedOverride) {
    var diff = difficulty(subjectId);
    var c = cellsFor(diff);
    var seed = (seedOverride !== undefined && seedOverride !== null)
      ? (seedOverride >>> 0)
      : ((SEEDS[subjectId] !== undefined ? SEEDS[subjectId]
          : (hashStr(subjectId) ^ 0x9e3779b9)) >>> 0);
    var rng = mulberry32(seed);

    /* Cell walls: 1 = wall present. */
    var cells = [], visited = [], x, y;
    for (x = 0; x < c; x++) {
      cells[x] = []; visited[x] = [];
      for (y = 0; y < c; y++) {
        cells[x][y] = { n: 1, e: 1, s: 1, w: 1 };
        visited[x][y] = false;
      }
    }

    /* Recursive backtracker (iterative): carves a spanning tree. */
    var stack = [[0, 0]];
    visited[0][0] = true;
    while (stack.length) {
      var top = stack[stack.length - 1];
      var cx = top[0], cy = top[1];
      var opts = [];
      if (cy > 0 && !visited[cx][cy - 1]) opts.push("n");
      if (cy < c - 1 && !visited[cx][cy + 1]) opts.push("s");
      if (cx > 0 && !visited[cx - 1][cy]) opts.push("w");
      if (cx < c - 1 && !visited[cx + 1][cy]) opts.push("e");
      if (!opts.length) { stack.pop(); continue; }
      var dir = opts[Math.floor(rng() * opts.length)];
      if (dir === "n") { cells[cx][cy].n = 0; cells[cx][cy - 1].s = 0; visited[cx][cy - 1] = true; stack.push([cx, cy - 1]); }
      else if (dir === "s") { cells[cx][cy].s = 0; cells[cx][cy + 1].n = 0; visited[cx][cy + 1] = true; stack.push([cx, cy + 1]); }
      else if (dir === "w") { cells[cx][cy].w = 0; cells[cx - 1][cy].e = 0; visited[cx - 1][cy] = true; stack.push([cx - 1, cy]); }
      else { cells[cx][cy].e = 0; cells[cx + 1][cy].w = 0; visited[cx + 1][cy] = true; stack.push([cx + 1, cy]); }
    }

    /* Braid: knock down some interior walls to add loops. Loops shorten
       the optimal path and cut dead ends, so early dungeons braid more. */
    var braidP = 0.34 - diff * 0.04;
    for (x = 0; x < c; x++) {
      for (y = 0; y < c; y++) {
        if (x < c - 1 && rng() < braidP) { cells[x][y].e = 0; cells[x + 1][y].w = 0; }
        if (y < c - 1 && rng() < braidP) { cells[x][y].s = 0; cells[x][y + 1].n = 0; }
      }
    }

    /* The entrance's first step east is always open, so the player (and
       the arrow-key movement test) can always start walking right. */
    cells[0][0].e = 0; cells[1][0].w = 0;

    /* The boss waits at the cell farthest from the entrance. Reachable
       by construction: the cell graph is connected. */
    var dist = cellDist(cells, c, 0, 0);
    var bx = 0, by = 0, best = 0;
    for (x = 0; x < c; x++) {
      for (y = 0; y < c; y++) {
        var d = dist[x + "," + y];
        if (d !== undefined && d > best) { best = d; bx = x; by = y; }
      }
    }

    /* Tile grid: odd tiles are cells/passages, even tiles are walls. */
    var tw = 2 * c + 1, th = 2 * c + 1, grid = [], tx, ty;
    for (ty = 0; ty < th; ty++) {
      grid[ty] = [];
      for (tx = 0; tx < tw; tx++) grid[ty][tx] = 1;
    }
    for (x = 0; x < c; x++) {
      for (y = 0; y < c; y++) {
        grid[2 * y + 1][2 * x + 1] = 0;
        if (!cells[x][y].e) grid[2 * y + 1][2 * x + 2] = 0;
        if (!cells[x][y].s) grid[2 * y + 2][2 * x + 1] = 0;
      }
    }

    return {
      subjectId: subjectId,
      diff: diff,
      cells: c,
      seed: seed,
      tilesW: tw,
      tilesH: th,
      grid: grid,
      walls: cells,
      spawn: { cx: 0, cy: 0 },
      boss: { cx: bx, cy: by },
      optimalLen: best,
      worldW: tw * TILE,
      worldH: th * TILE
    };
  }

  function tileAt(mz, px, py) {
    return { tx: Math.floor(px / TILE), ty: Math.floor(py / TILE) };
  }
  function isWallTile(mz, tx, ty) {
    if (tx < 0 || ty < 0 || tx >= mz.tilesW || ty >= mz.tilesH) return true;
    return mz.grid[ty][tx] === 1;
  }
  function cellCenter(mz, cx, cy) {
    return { x: (2 * cx + 1) * TILE + TILE / 2,
             y: (2 * cy + 1) * TILE + TILE / 2 };
  }
  function bossReachable(mz) {
    var d = cellDist(mz.walls, mz.cells, mz.spawn.cx, mz.spawn.cy);
    return d[mz.boss.cx + "," + mz.boss.cy] !== undefined;
  }

  window.RQMaze = {
    TILE: TILE,
    generate: generate,
    difficulty: difficulty,
    cellsFor: cellsFor,
    tileAt: tileAt,
    isWallTile: isWallTile,
    cellCenter: cellCenter,
    cellDist: cellDist,
    bossReachable: bossReachable
  };
})();
