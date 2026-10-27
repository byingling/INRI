// INRI — Memorize: hide the verse a little at a time until you can say it by heart.
// Stages: full text → ⅓ hidden → ⅔ hidden → first letters → blank → type it from memory.

const MEMO_STAGES = [
  { name: 'Read it', hint: 'Read the verse slowly, out loud if you can. Then hide a few words.' },
  { name: 'A few gaps', hint: 'Say the whole verse, filling in the gaps. Tap a gap to peek.' },
  { name: 'More gaps', hint: 'Keep going — say it all, peeking only when you must.' },
  { name: 'First letters', hint: 'Only the first letter of each word is left.' },
  { name: 'By heart', hint: 'Every word is hidden. Say it from memory, then check yourself.' }
];

let memoState = { ref: '', text: '', stage: 0, revealed: {} };

function getMemorized() { return STORAGE.get('memorized', []); }
function saveMemorized(list) { STORAGE.set('memorized', list); }

function openMemorize(text, ref) {
  memoState = { ref: ref, text: text, stage: 0, revealed: {} };
  navigate('memorize');
}

// Stable pseudo-random order so the same words hide each time
function memoOrder(n, seed) {
  const idx = []; for (let i = 0; i < n; i++) idx.push(i);
  let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = n - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  return idx;
}

function memoWords() {
  return memoState.text.split(/\s+/).filter(Boolean);
}

function renderMemoVerse() {
  const words = memoWords();
  const st = memoState.stage;
  const hideCount = st === 0 ? 0 : st === 1 ? Math.ceil(words.length / 3) : st === 2 ? Math.ceil(words.length * 2 / 3) : words.length;
  const order = memoOrder(words.length, memoState.ref);
  const hidden = {}; order.slice(0, hideCount).forEach(function(i) { hidden[i] = true; });
  return words.map(function(w, i) {
    if (!hidden[i] || memoState.revealed[i]) return '<span class="mw">' + w + '</span>';
    const m = w.match(/^([“"‘(]*)([A-Za-z])?(.*?)([.,;:!?”"’)]*)$/) || ['', '', w[0], '', ''];
    const lead = m[1] || '', first = m[2] || '', trail = m[4] || '';
    const coreLen = Math.max(1, (first + (m[3] || '')).length);
    const shown = st === 3 ? first : '';
    const blanks = st === 3 ? Math.max(1, coreLen - 1) : coreLen;
    return '<span class="mw hidden" data-i="' + i + '">' + lead + shown + '<span class="mgap">' + '_'.repeat(blanks) + '</span>' + trail + '</span>';
  }).join(' ');
}

function renderMemorize() {
  if (!memoState.text) {
    const t = getTodayContent();
    memoState = { ref: t.reference, text: t.verse, stage: 0, revealed: {} };
  }
  const st = memoState.stage;
  const list = getMemorized();
  const done = list.some(function(m) { return m.ref === memoState.ref; });
  let html = '<div class="card memo-card">' +
    '<div class="memo-steps">' + MEMO_STAGES.map(function(s, i) { return '<span class="memo-step' + (i <= st ? ' on' : '') + '"></span>'; }).join('') + '</div>' +
    '<div class="insp-label">Step ' + (st + 1) + ' of ' + MEMO_STAGES.length + ' · ' + MEMO_STAGES[st].name + '</div>' +
    '<p class="verse memo-verse" id="memo-verse">' + renderMemoVerse() + '</p>' +
    '<p class="reference">— ' + memoState.ref + '</p>' +
    '<p class="reflection memo-hint">' + MEMO_STAGES[st].hint + '</p>' +
    '<div class="btn-group">' +
      (st > 0 ? '<button class="btn btn-outline" id="memo-back">← Show more</button>' : '') +
      (st < MEMO_STAGES.length - 1 ? '<button class="btn" id="memo-next">Hide more →</button>' : '') +
      '<button class="btn btn-outline" onclick="speakText(memoState.text + \'. \' + spokenRef(memoState.ref))">Listen</button>' +
    '</div>';
  if (st === MEMO_STAGES.length - 1) {
    html += '<h3>Check yourself</h3><textarea id="memo-input" class="journal-entry memo-input" placeholder="Type the verse from memory…"></textarea>' +
      '<div class="btn-group"><button class="btn" id="memo-check">Check</button></div><div id="memo-result"></div>';
  }
  html += (done ? '<p class="memo-badge">✓ Memorized</p>' : '') + '</div>';

  if (list.length) {
    html += '<div class="card"><h2>Verses You’ve Memorized</h2><p class="reflection" style="margin-bottom:10px">Review them now and then to keep them fresh.</p>' +
      list.slice().reverse().map(function(m) {
        return '<div class="memo-item"><div><strong>' + m.ref + '</strong><div class="memo-date">' + new Date(m.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</div></div>' +
          '<button class="btn btn-outline btn-sm" data-review="' + encodeURIComponent(m.ref) + '">Review</button></div>';
      }).join('') + '</div>';
  }
  return html;
}

function setupMemorize() {
  const v = document.getElementById('memo-verse');
  if (v) v.addEventListener('click', function(e) {
    const w = e.target.closest('.mw.hidden');
    if (!w) return;
    memoState.revealed[w.dataset.i] = true;
    w.outerHTML = '<span class="mw peeked">' + memoWords()[w.dataset.i] + '</span>';
  });
  const next = document.getElementById('memo-next');
  if (next) next.onclick = function() { memoState.stage++; memoState.revealed = {}; rerenderMemo(); };
  const back = document.getElementById('memo-back');
  if (back) back.onclick = function() { memoState.stage--; memoState.revealed = {}; rerenderMemo(); };
  const check = document.getElementById('memo-check');
  if (check) check.onclick = function() {
    const norm = function(s) { return s.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/’/g, "'").split(/\s+/).filter(Boolean); };
    const target = norm(memoState.text), typed = norm(document.getElementById('memo-input').value);
    // Count words in the right order (longest common subsequence)
    const dp = Array(target.length + 1).fill(0).map(function() { return Array(typed.length + 1).fill(0); });
    for (let i = 1; i <= target.length; i++) for (let j = 1; j <= typed.length; j++)
      dp[i][j] = target[i - 1] === typed[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    const pct = Math.round(100 * dp[target.length][typed.length] / Math.max(target.length, typed.length || 1));
    const res = document.getElementById('memo-result');
    if (pct >= 90) {
      const list = getMemorized().filter(function(m) { return m.ref !== memoState.ref; });
      list.push({ ref: memoState.ref, text: memoState.text, date: localDateKey() });
      saveMemorized(list);
      res.innerHTML = '<p class="memo-success">' + pct + '% — well done! “Thy word have I hid in mine heart” (Psalm 119:11). Saved to your memorized verses.</p>';
      showToast('Verse memorized');
    } else {
      res.innerHTML = '<p class="reflection">' + pct + '% of the words in order. Step back a stage and try again — you’re getting there.</p>';
    }
  };
  document.querySelectorAll('[data-review]').forEach(function(b) {
    b.onclick = function() {
      const m = getMemorized().find(function(x) { return x.ref === decodeURIComponent(b.dataset.review); });
      if (m) { memoState = { ref: m.ref, text: m.text, stage: 3, revealed: {} }; rerenderMemo(); window.scrollTo(0, 0); }
    };
  });
}

function rerenderMemo() {
  contentEl.innerHTML = renderMemorize();
  setupMemorize();
}
