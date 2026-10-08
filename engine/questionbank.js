/* Quest Academy engine: question-bank selection.
   Picks questions from the per-subject pass-4 question banks (window.QABank,
   content/bank-*.js) with a per-subject cooldown so the same question never
   repeats within 20 picks. Called by engine/battle.js makeQuestion before
   the old generator path, which stays as a fallback. */
(function () {
  "use strict";

  function bandForTier(tier) {
    if (tier <= 20) return 0;
    if (tier <= 24) return 1;
    if (tier <= 28) return 2;
    return 3;
  }

  window.QABankSelect = {
    pick: function (subjectId, tier) {
      var bank = (window.QABank && window.QABank[subjectId]) || [];
      if (!bank.length) return null;
      var band = bandForTier(tier);
      var pool = bank.filter(function (q) { return q.band === band; });
      if (!pool.length) pool = bank;
      var qcool = (window.RQSave && window.RQSave.data &&
                   window.RQSave.data.qcool && window.RQSave.data.qcool[subjectId]) || [];
      var avail = pool.filter(function (q) { return qcool.indexOf(q.qid) < 0; });
      if (!avail.length) avail = pool;
      var chosen = avail[Math.floor(Math.random() * avail.length)];
      /* push qid to the per-subject cooldown buffer (cap 20) */
      if (window.RQSave && window.RQSave.data) {
        if (!window.RQSave.data.qcool) window.RQSave.data.qcool = {};
        var buf = window.RQSave.data.qcool[subjectId];
        if (!Array.isArray(buf)) { buf = []; window.RQSave.data.qcool[subjectId] = buf; }
        buf.push(chosen.qid);
        while (buf.length > 20) buf.shift();
        window.RQSave.write();
      }
      chosen.tier = tier;
      return chosen;
    }
  };
})();
