/* Quest Academy engine: question renderers.
   Each renderer takes (container, question) and returns a Promise
   resolving to { correct: boolean }. Renderers are subject-agnostic:
   they only understand the question object contract. */
(function () {
  "use strict";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function speakBtn(text) {
    var b = el("button", "rq-speak", "🔊 Hear it");
    b.type = "button";
    b.addEventListener("click", function (ev) {
      ev.stopPropagation();
      window.RQAudio.ensure();
      window.RQAudio.Speech.say(text);
    });
    return b;
  }

  function autoSpeak(text) {
    window.RQAudio.ensure();
    setTimeout(function () { window.RQAudio.Speech.say(text); }, 350);
  }

  function choiceRenderer(container, q) {
    return new Promise(function (resolve) {
      container.innerHTML = "";
      var box = el("div", "rq-q");
      var p = el("div", "rq-qprompt", q.prompt);
      box.appendChild(p);
      if (q.speak) {
        box.appendChild(speakBtn(q.speak));
        autoSpeak(q.speak);
      }
      var opts = el("div", "rq-opts");
      var done = false;
      q.choices.forEach(function (c, i) {
        var b = el("button", "rq-opt", c);
        b.type = "button";
        b.addEventListener("click", function () {
          if (done) return; done = true;
          window.RQAudio.Speech.stop();
          var ok = (i === q.answer);
          b.classList.add(ok ? "rq-right" : "rq-wrong");
          if (!ok) opts.children[q.answer].classList.add("rq-right");
          Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
          setTimeout(function () { resolve({ correct: ok }); }, ok ? 650 : 1400);
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
      container.appendChild(box);
    });
  }

  function flashRenderer(container, q) {
    return new Promise(function (resolve) {
      container.innerHTML = "";
      var box = el("div", "rq-q");
      box.appendChild(el("div", "rq-qprompt", q.prompt));
      if (q.speak) { box.appendChild(speakBtn(q.speak)); autoSpeak(q.speak); }
      var barWrap = el("div", "rq-timerwrap");
      var bar = el("div", "rq-timerbar");
      barWrap.appendChild(bar); box.appendChild(barWrap);
      var opts = el("div", "rq-opts");
      var done = false;
      var ms = q.timeMs || 8000;
      var start = Date.now();
      var timer = setInterval(function () {
        var left = Math.max(0, ms - (Date.now() - start));
        bar.style.width = (left / ms * 100) + "%";
        if (left <= 0 && !done) {
          done = true; clearInterval(timer);
          window.RQAudio.Speech.stop();
          opts.children[q.answer].classList.add("rq-right");
          Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
          setTimeout(function () { resolve({ correct: false, timedOut: true }); }, 1200);
        }
      }, 50);
      q.choices.forEach(function (c, i) {
        var b = el("button", "rq-opt", c);
        b.type = "button";
        b.addEventListener("click", function () {
          if (done) return; done = true; clearInterval(timer);
          window.RQAudio.Speech.stop();
          var ok = (i === q.answer);
          b.classList.add(ok ? "rq-right" : "rq-wrong");
          if (!ok) opts.children[q.answer].classList.add("rq-right");
          Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
          setTimeout(function () { resolve({ correct: ok }); }, ok ? 500 : 1400);
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
      container.appendChild(box);
    });
  }

  function buildRenderer(container, q) {
    return new Promise(function (resolve) {
      container.innerHTML = "";
      var box = el("div", "rq-q");
      box.appendChild(el("div", "rq-qprompt", q.prompt));
      box.appendChild(speakBtn(q.answer));
      autoSpeak(q.answer);
      var target = el("div", "rq-buildtarget", "");
      box.appendChild(target);
      var tray = el("div", "rq-tray");
      var built = "";
      var done = false;
      function refresh() {
        target.textContent = built.split("").join(" ") || " ";
        Array.prototype.forEach.call(tray.children, function (t, i) {
          t.disabled = t.dataset.used === "1" || done;
        });
      }
      q.letters.forEach(function (ch) {
        var t = el("button", "rq-tile", ch);
        t.type = "button"; t.dataset.used = "0";
        t.addEventListener("click", function () {
          if (done || t.dataset.used === "1") return;
          window.RQAudio.SFX.click();
          t.dataset.used = "1";
          built += ch; refresh();
          if (built.length === q.answer.length) {
            done = true;
            window.RQAudio.Speech.stop();
            var ok = (built === q.answer);
            target.classList.add(ok ? "rq-right" : "rq-wrong");
            setTimeout(function () { resolve({ correct: ok }); }, ok ? 700 : 1500);
          }
        });
        tray.appendChild(t);
      });
      box.appendChild(tray);
      var clear = el("button", "rq-ghostbtn", "↩ Start over");
      clear.type = "button";
      clear.addEventListener("click", function () {
        if (done) return;
        built = "";
        Array.prototype.forEach.call(tray.children, function (t) { t.dataset.used = "0"; });
        refresh();
      });
      box.appendChild(clear);
      container.appendChild(box);
      refresh();
    });
  }

  function storyRenderer(container, q) {
    return new Promise(function (resolve) {
      container.innerHTML = "";
      var box = el("div", "rq-q");
      var story = el("div", "rq-story", q.passage);
      box.appendChild(story);
      var row = el("div", "rq-row");
      row.appendChild(speakBtn(q.passage));
      box.appendChild(row);
      autoSpeak(q.passage);
      var ask = function () {
        box.appendChild(el("div", "rq-qprompt", q.prompt));
        var opts = el("div", "rq-opts");
        var done = false;
        q.choices.forEach(function (c, i) {
          var b = el("button", "rq-opt", c);
          b.type = "button";
          b.addEventListener("click", function () {
            if (done) return; done = true;
            window.RQAudio.Speech.stop();
            var ok = (i === q.answer);
            b.classList.add(ok ? "rq-right" : "rq-wrong");
            if (!ok) opts.children[q.answer].classList.add("rq-right");
            Array.prototype.forEach.call(opts.children, function (x) { x.disabled = true; });
            setTimeout(function () { resolve({ correct: ok }); }, ok ? 650 : 1500);
          });
          opts.appendChild(b);
        });
        box.appendChild(opts);
      };
      var go = el("button", "rq-bigbtn", "I read it! Ask me ➜");
      go.type = "button";
      go.addEventListener("click", function () {
        window.RQAudio.SFX.click();
        window.RQAudio.Speech.stop();
        go.remove(); ask();
      });
      box.appendChild(go);
      container.appendChild(box);
    });
  }


  /* Order (sequencing): tap the items in the correct order.
     q = { kind: "order", prompt, items: [shuffled strings],
           answer: [correct order array] } */
  function orderRenderer(container, q) {
    return new Promise(function (resolve) {
      container.innerHTML = "";
      var box = el("div", "rq-q");
      box.appendChild(el("div", "rq-qprompt", q.prompt));
      var placed = el("div", "rq-orderplaced");
      var pool = el("div", "rq-opts");
      box.appendChild(placed);
      box.appendChild(pool);
      var done = false;
      var seq = [];
      function renderPlaced() {
        placed.innerHTML = "";
        seq.forEach(function (txt, i) {
          placed.appendChild(el("span", "rq-orderchip", (i + 1) + ". " + txt));
        });
        if (!seq.length) placed.innerHTML = '<span class="rq-orderhint">Tap the steps in order...</span>';
      }
      q.items.forEach(function (txt) {
        var b = el("button", "rq-opt", txt);
        b.type = "button";
        b.addEventListener("click", function () {
          if (done || b.disabled) return;
          b.disabled = true;
          seq.push(txt);
          renderPlaced();
          window.RQAudio.SFX.click();
          if (seq.length === q.items.length) {
            done = true;
            var ok = seq.every(function (t, i) { return t === q.answer[i]; });
            placed.classList.add(ok ? "rq-right" : "rq-wrong");
            setTimeout(function () { resolve({ correct: ok }); }, ok ? 700 : 1600);
          }
        });
        pool.appendChild(b);
      });
      var clear = el("button", "rq-ghostbtn", "Start over");
      clear.type = "button";
      clear.addEventListener("click", function () {
        if (done) return;
        seq = [];
        renderPlaced();
        Array.prototype.forEach.call(pool.children, function (x) { x.disabled = false; });
      });
      box.appendChild(clear);
      container.appendChild(box);
      renderPlaced();
    });
  }

  var RENDERERS = { choice: choiceRenderer, flash: flashRenderer,
                    build: buildRenderer, story: storyRenderer,
                    order: orderRenderer };

  window.RQQuestions = {
    ask: function (container, q) {
      var r = RENDERERS[q.kind] || choiceRenderer;
      return r(container, q);
    }
  };
})();
