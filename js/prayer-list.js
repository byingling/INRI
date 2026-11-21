// INRI — Prayer list with answered prayers: keep requests, pray through them
// (including in the Daily Walk), and record how God answered — a growing
// record of His faithfulness. Loaded after app.js.

// Item: { id, text, added, prayedToday, prayedDays, lastPrayed, answered, answerNote }
function normalizePrayers() {
  let changed = false;
  const list = getPrayers().map(function(p, i) {
    if (!p.id) { p.id = 'p' + Date.now().toString(36) + i; changed = true; }
    if (p.prayedDays == null) { p.prayedDays = 0; changed = true; }
    return p;
  });
  if (changed) savePrayers(list);
  return list;
}

function activePrayers() { return normalizePrayers().filter(function(p) { return !p.answered; }); }

function markPrayed(id, on) {
  const list = normalizePrayers();
  const p = list.find(function(x) { return x.id === id; });
  if (!p) return;
  const today = localDateKey();
  p.prayedToday = on;
  if (on && p.lastPrayed !== today) {
    p.prevPrayed = p.lastPrayed || null;   // remembered so an accidental tap can be undone
    p.prayedDays = (p.prayedDays || 0) + 1;
    p.lastPrayed = today;
  } else if (!on && p.lastPrayed === today) {
    p.prayedDays = Math.max(0, (p.prayedDays || 1) - 1);
    p.lastPrayed = p.prevPrayed || null;
  }
  savePrayers(list);
}

function addPrayer(text) {
  const list = normalizePrayers();
  list.unshift({ id: 'p' + Date.now().toString(36), text: text, added: localDateKey(), prayedToday: false, prayedDays: 0 });
  savePrayers(list);
}

function fmtDate(key) {
  if (!key) return '';
  const d = new Date(String(key).slice(0, 10) + 'T12:00:00');
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

let prayerTab = 'praying';

function renderPrayerList() {
  const list = normalizePrayers();
  const praying = list.filter(function(p) { return !p.answered; });
  const answered = list.filter(function(p) { return p.answered; }).sort(function(a, b) { return String(b.answered).localeCompare(String(a.answered)); });
  let html = '<div class="card"><h2>Prayer List</h2>' +
    '<p class="reflection">People and needs you’re carrying to God. Check them off as you pray each day, and when God answers, write down how.</p>' +
    '<div class="journal-input"><input type="text" id="prayer-input" placeholder="A name or a need…" enterkeyhint="done"><button class="btn" id="prayer-add">Add</button></div>' +
    '<div class="prayer-tabs"><button class="pt' + (prayerTab === 'praying' ? ' on' : '') + '" data-t="praying">Praying (' + praying.length + ')</button>' +
    '<button class="pt' + (prayerTab === 'answered' ? ' on' : '') + '" data-t="answered">Answered (' + answered.length + ')</button></div></div>';

  if (prayerTab === 'praying') {
    if (!praying.length) html += '<div class="card"><p class="reflection">No requests yet. Add someone you want to pray for — they’ll appear in your Daily Walk too.</p></div>';
    praying.forEach(function(p) {
      html += '<div class="card prayer-item' + (p.prayedToday ? ' done' : '') + '" data-id="' + p.id + '">' +
        '<div class="pi-row"><label class="pi-check"><input type="checkbox" class="prayer-check"' + (p.prayedToday ? ' checked' : '') + ' aria-label="Prayed today"></label>' +
        '<div class="pi-main"><div class="pi-text">' + escapeHTML(p.text) + '</div>' +
        '<div class="pi-meta">' + (p.added ? 'Since ' + fmtDate(p.added) : '') + (p.prayedDays ? ' · prayed ' + p.prayedDays + ' day' + (p.prayedDays === 1 ? '' : 's') : '') + '</div></div>' +
        '<button class="btn btn-outline btn-sm pi-answer">Answered</button>' +
        '<button class="pi-del" aria-label="Remove">×</button></div>' +
        '<div class="pi-answer-form" hidden><textarea placeholder="How did God answer? (optional)"></textarea>' +
        '<div class="btn-group"><button class="btn btn-sm pi-save-answer">Mark answered</button><button class="btn btn-outline btn-sm pi-cancel">Cancel</button></div></div>' +
      '</div>';
    });
  } else {
    if (!answered.length) {
      html += '<div class="card"><p class="reflection">When God answers a prayer, tap “Answered” and write down what He did. Over time this becomes a record of His faithfulness to look back on.</p></div>';
    } else {
      html += '<div class="card faithful"><p class="verse">“Bless the LORD, O my soul, and forget not all his benefits.”</p><p class="reference">— Psalm 103:2</p>' +
        '<p class="reflection" style="text-align:center">' + answered.length + ' answered prayer' + (answered.length === 1 ? '' : 's') + ' recorded</p></div>';
    }
    answered.forEach(function(p) {
      const span = p.added && p.answered ? Math.max(0, daysBetween(new Date(String(p.added).slice(0, 10) + 'T12:00:00'), new Date(String(p.answered) + 'T12:00:00'))) : null;
      html += '<div class="card prayer-item answered" data-id="' + p.id + '">' +
        '<div class="pi-text">✓ ' + escapeHTML(p.text) + '</div>' +
        '<div class="pi-meta">Answered ' + fmtDate(p.answered) + (span != null ? ' · after ' + span + ' day' + (span === 1 ? '' : 's') : '') + (p.prayedDays ? ' · prayed ' + p.prayedDays + ' day' + (p.prayedDays === 1 ? '' : 's') : '') + '</div>' +
        (p.answerNote ? '<p class="pi-note">' + escapeHTML(p.answerNote).replace(/\n/g, '<br>') + '</p>' : '') +
        '<div class="btn-group"><button class="btn btn-outline btn-sm pi-unanswer">Move back to praying</button><button class="btn btn-outline btn-sm pi-share">Share</button></div>' +
      '</div>';
    });
  }
  return html;
}

function escapeHTML(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function setupPrayerList() {
  const rerender = function() { contentEl.innerHTML = renderPrayerList(); setupPrayerList(); };
  const add = document.getElementById('prayer-add'), input = document.getElementById('prayer-input');
  if (add && input) {
    add.onclick = function() {
      const t = input.value.trim(); if (!t) return;
      addPrayer(t); prayerTab = 'praying'; rerender(); showToast('Added to your prayer list');
    };
    input.onkeydown = function(e) { if (e.key === 'Enter') add.click(); };
  }
  document.querySelectorAll('.pt').forEach(function(b) { b.onclick = function() { prayerTab = b.dataset.t; rerender(); }; });
  document.querySelectorAll('.prayer-item').forEach(function(card) {
    const id = card.dataset.id;
    const find = function(list) { return list.find(function(x) { return x.id === id; }); };
    const cb = card.querySelector('.prayer-check');
    if (cb) cb.onchange = function() { markPrayed(id, cb.checked); rerender(); };
    const ans = card.querySelector('.pi-answer');
    if (ans) ans.onclick = function() { card.querySelector('.pi-answer-form').hidden = false; card.querySelector('textarea').focus(); };
    const cancel = card.querySelector('.pi-cancel');
    if (cancel) cancel.onclick = function() { card.querySelector('.pi-answer-form').hidden = true; };
    const save = card.querySelector('.pi-save-answer');
    if (save) save.onclick = function() {
      const list = normalizePrayers(); const p = find(list);
      p.answered = localDateKey(); p.answerNote = card.querySelector('textarea').value.trim(); p.prayedToday = false;
      savePrayers(list);
      showToast('Praise God! Recorded as answered');
      rerender();
    };
    const del = card.querySelector('.pi-del');
    if (del) del.onclick = function() {
      if (!confirm('Remove this prayer request?')) return;
      savePrayers(normalizePrayers().filter(function(x) { return x.id !== id; })); rerender();
    };
    const back = card.querySelector('.pi-unanswer');
    if (back) back.onclick = function() {
      const list = normalizePrayers(); const p = find(list); p.answered = null; savePrayers(list); prayerTab = 'praying'; rerender();
    };
    const share = card.querySelector('.pi-share');
    if (share) share.onclick = function() {
      const p = find(normalizePrayers());
      shareText('God answered prayer: ' + p.text + (p.answerNote ? ' — ' + p.answerNote : ''), 'Answered prayer');
    };
  });
}

// ---------- Daily Walk page: pray for others ----------
function walkIntercessionPage() {
  const list = activePrayers();
  return {
    id: 'others', label: 'Pray for others',
    html: '<div class="walk-kicker">Intercession</div><h2 class="walk-h">Pray for others</h2>' +
      '<p class="reflection walk-prompt">“Pray one for another” (James 5:16). Bring each one to God by name.</p>' +
      (list.length ? '<div class="walk-prayers">' + list.map(function(p) {
        return '<label class="walk-prayer-item' + (p.prayedToday ? ' done' : '') + '"><input type="checkbox" data-wp="' + p.id + '"' + (p.prayedToday ? ' checked' : '') + '><span>' + escapeHTML(p.text) + '</span></label>';
      }).join('') + '</div>' : '<p class="reflection">Your prayer list is empty. Add someone below and pray for them now.</p>') +
      '<div class="journal-input" style="margin-top:12px"><input type="text" id="walk-add-prayer" placeholder="Add a name or need…"><button class="btn btn-outline" id="walk-add-prayer-btn">Add</button></div>',
    speak: list.length ? 'Now pray for others. Bring each one to God by name. ' + list.map(function(p) { return p.text; }).join('. ') + '.' : 'Now take a moment to pray for others.',
    noAuto: true,
    onShow: function() {
      document.querySelectorAll('[data-wp]').forEach(function(cb) {
        cb.onchange = function() { markPrayed(cb.dataset.wp, cb.checked); cb.closest('.walk-prayer-item').classList.toggle('done', cb.checked); };
      });
      const btn = document.getElementById('walk-add-prayer-btn'), inp = document.getElementById('walk-add-prayer');
      if (btn) btn.onclick = function() {
        const t = inp.value.trim(); if (!t) return;
        addPrayer(t); markPrayed(getPrayers()[0].id, true);
        const wrap = document.querySelector('.walk-prayers') || (function() {
          const d = document.createElement('div'); d.className = 'walk-prayers';
          const empty = document.querySelector('.walk-page .walk-prompt + .reflection'); if (empty) empty.replaceWith(d); return d;
        })();
        wrap.insertAdjacentHTML('afterbegin', '<label class="walk-prayer-item done"><input type="checkbox" checked disabled><span>' + escapeHTML(t) + '</span></label>');
        inp.value = '';
        showToast('Added to your prayer list');
      };
    }
  };
}
