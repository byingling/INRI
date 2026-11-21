// INRI — Bible reader: whole-Bible search, colored highlights & notes,
// verse actions, and chapter narration with follow-along.
// Loaded after app.js; provides loadChapter/renderChapterHTML/wireChapterNav.

// ---------- Full KJV text (data/kjv.json, loaded on demand) ----------
const KJV = (function() {
  let data = null, loading = null;
  function load(opts) {
    if (data) return Promise.resolve(data);
    if (opts && opts.cacheOnly) {
      if (!window.caches) return Promise.resolve(null);
      return caches.match('data/kjv.json').then(function(r) { return r ? r.json() : null; })
        .then(function(j) { if (j) data = j.books; return data; }).catch(function() { return null; });
    }
    if (!loading) {
      loading = fetch('data/kjv.json').then(function(r) {
        if (!r.ok) throw new Error('KJV download failed');
        return r.json();
      }).then(function(j) { data = j.books; return data; })
        .catch(function(e) { loading = null; throw e; });
    }
    return loading;
  }
  function chapter(book, c) { return data && data[book] && data[book][c - 1] ? data[book][c - 1] : null; }
  return { load: load, chapter: chapter, ready: function() { return !!data; } };
})();

function bookName(id) { return (BIBLE_BOOKS.find(function(b) { return b.id === id; }) || {}).name || id; }
function verseRef(book, c, v) { return bookName(book) + ' ' + c + ':' + v; }

// ---------- Highlights (colored) & notes ----------
const HL_COLORS = [['gold', 'Gold'], ['green', 'Green'], ['blue', 'Blue'], ['rose', 'Rose']];

// Highlights are stored as key -> { c: color, t: text, r: ref, d: date }.
// Older versions stored key -> true; those read as gold.
function getHighlight(key) {
  const h = getHighlights()[key];
  if (!h) return null;
  return h === true ? { c: 'gold' } : h;
}
function setHighlight(key, color, text, ref) {
  const h = getHighlights();
  if (!color) delete h[key];
  else h[key] = { c: color, t: text, r: ref, d: localDateKey() };
  STORAGE.set('highlights', h);
}
function isHighlighted(key) { return !!getHighlights()[key]; }
function getVerseNote(key) { const n = getNotes()[key]; return n ? n.note : ''; }
function setVerseNote(key, note, text, ref) {
  const n = getNotes();
  if (!note.trim()) delete n[key];
  else n[key] = { note: note.trim(), t: text, r: ref, d: localDateKey() };
  saveNotes(n);
}

// ---------- Chapter rendering ----------
let pendingVerse = null; // verse to scroll to after the next chapter load

function renderChapterHTML(book, chapter, verses, offline) {
  const name = bookName(book);
  let html = '<div class="bible-nav-row"><button class="btn btn-outline" id="prev-ch">‹ Prev</button>';
  html += '<h2 style="color:var(--gold);margin:0;flex:1;text-align:center">' + name + ' ' + chapter + (offline ? ' <span class="offline-tag">offline</span>' : '') + '</h2>';
  html += '<button class="btn btn-outline" id="next-ch">Next ›</button></div>';
  html += '<div class="chapter-tools"><button class="btn" id="listen-ch">▶ Listen to chapter</button>' +
    '<label class="keep-going"><input type="checkbox" id="keep-going"' + (STORAGE.get('chapterContinue', true) ? ' checked' : '') + '> Keep going to the next chapter</label></div>';
  if (typeof planBannerHTML === 'function') html += planBannerHTML(book, chapter);
  html += '<p class="reflection tap-hint">Tap a verse to highlight, add a note, save, or listen from there.</p>';
  const ver = getBibleVersion() || 'kjv';
  const notes = getNotes();
  verses.forEach(function(v, i) {
    const num = v.verse || v.number || (i + 1);
    const text = v.text || v.content || String(v);
    const key = ver + ':' + book + ':' + chapter + ':' + num;
    const hl = getHighlight(key);
    html += '<p class="bible-verse' + (hl ? ' hl-' + hl.c : '') + '" data-hk="' + key + '" data-v="' + num + '">' +
      '<span class="verse-num">' + num + '</span><span class="vt">' + text + '</span>' +
      (notes[key] ? '<span class="note-mark" title="Has a note">✎</span>' : '') + '</p>';
  });
  if (typeof STUDY_NOTES !== 'undefined') {
    Object.keys(STUDY_NOTES).forEach(function(ref) {
      if (ref.indexOf(String(chapter)) >= 0 && ref.toLowerCase().indexOf(name.toLowerCase().split(' ')[0]) >= 0) {
        html += '<div class="study-note"><strong>Study note (' + ref + ')</strong><p>' + STUDY_NOTES[ref] + '</p></div>';
      }
    });
  }
  html += '<div class="bible-nav-row" style="margin-top:18px"><button class="btn btn-outline" id="prev-ch2">‹ Prev</button><span style="flex:1"></span><button class="btn btn-outline" id="next-ch2">Next ›</button></div>';
  return html;
}

function neighborChapter(book, chapter, dir) {
  const idx = BIBLE_BOOKS.findIndex(function(b) { return b.id === book; });
  const b = BIBLE_BOOKS[idx];
  if (dir > 0) {
    if (chapter < b.chapters) return { book: book, chapter: chapter + 1 };
    if (idx < BIBLE_BOOKS.length - 1) return { book: BIBLE_BOOKS[idx + 1].id, chapter: 1 };
  } else {
    if (chapter > 1) return { book: book, chapter: chapter - 1 };
    if (idx > 0) return { book: BIBLE_BOOKS[idx - 1].id, chapter: BIBLE_BOOKS[idx - 1].chapters };
  }
  return null;
}

function goChapter(book, chapter, dir) {
  const n = neighborChapter(book, chapter, dir);
  if (!n) return;
  if (Narrator.state() !== 'idle') Narrator.stop();
  currentBook = n.book; currentChapter = n.chapter;
  syncBibleSelects();
  loadChapter(n.book, n.chapter);
  const top = document.querySelector('.bible-controls');
  if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function syncBibleSelects() {
  const bs = document.getElementById('book-select'), cs = document.getElementById('chapter-select');
  if (bs && bs.value !== currentBook) { bs.value = currentBook; bs.dispatchEvent(new Event('change')); }
  if (cs) cs.value = String(currentChapter);
  document.querySelectorAll('.book-chip').forEach(function(c) { c.classList.toggle('active', c.dataset.book === currentBook); });
}

function wireChapterNav(book, chapter) {
  ['prev-ch', 'prev-ch2'].forEach(function(id) { const b = document.getElementById(id); if (b) b.onclick = function() { goChapter(book, chapter, -1); }; });
  ['next-ch', 'next-ch2'].forEach(function(id) { const b = document.getElementById(id); if (b) b.onclick = function() { goChapter(book, chapter, 1); }; });
  document.querySelectorAll('.bible-verse').forEach(function(p) {
    p.addEventListener('click', function() { openVerseSheet(book, chapter, parseInt(p.dataset.v, 10), p); });
  });
  const listen = document.getElementById('listen-ch');
  if (listen) listen.onclick = function() {
    if (Narrator.state() !== 'idle') { Narrator.stop(); return; }
    listenChapter(book, chapter, 1);
  };
  const keep = document.getElementById('keep-going');
  if (keep) keep.onchange = function() { STORAGE.set('chapterContinue', keep.checked); };
  if (typeof wirePlanBanner === 'function') wirePlanBanner(book, chapter);
  if (pendingVerse && pendingVerse.book === book && pendingVerse.chapter === chapter) {
    const el = document.querySelector('.bible-verse[data-v="' + pendingVerse.verse + '"]');
    pendingVerse = null;
    if (el) setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); setTimeout(function() { el.classList.remove('flash'); }, 2500); }, 150);
  }
}

// Load a chapter: local KJV when available, otherwise the online API (with offline cache)
async function loadChapter(book, chapter) {
  const el = document.getElementById('chapter-content');
  if (!el) return;
  el.innerHTML = '<p class="loading">Loading Scripture…</p>';
  const ver = getBibleVersion() || 'kjv';
  currentBook = book; currentChapter = chapter;

  function show(verses, offline) {
    el.innerHTML = renderChapterHTML(book, chapter, verses, offline);
    wireChapterNav(book, chapter);
  }
  function fromKJV() {
    const c = KJV.chapter(book, chapter);
    return c ? c.map(function(t, i) { return { verse: i + 1, text: t }; }) : null;
  }

  if (ver === 'kjv') {
    if (!KJV.ready()) await KJV.load({ cacheOnly: true });
    const local = fromKJV();
    if (local) { show(local, false); return; }
  }

  const cached = getCachedChapter(ver, book, chapter);
  try {
    const res = await fetch('https://api.midvash.com/v1/' + ver + '/' + book + '/' + chapter);
    if (!res.ok) throw new Error('Failed to load');
    const json = await res.json();
    const data = json.data || json;
    let verses = [];
    if (Array.isArray(data)) verses = data;
    else if (data.verses) verses = data.verses;
    else if (data.chapter && data.chapter.verses) verses = data.chapter.verses;
    else if (typeof data === 'object') verses = Object.values(data).filter(function(v) { return v && (v.text || v.verse); });
    if (!verses.length) throw new Error('No verses');
    cacheChapter(ver, book, chapter, verses);
    show(verses, false);
  } catch (err) {
    if (cached && cached.data) {
      const verses = Array.isArray(cached.data) ? cached.data : (cached.data.verses || []);
      if (verses.length) { show(verses, true); return; }
    }
    if (ver === 'kjv') {
      try { await KJV.load(); const local = fromKJV(); if (local) { show(local, true); return; } } catch (e) {}
    }
    el.innerHTML = '<p class="reflection">Unable to load the chapter. Check your connection. Tip: download the KJV for offline reading in Settings.</p>';
  }
}

// ---------- Verse action sheet ----------
function openVerseSheet(book, chapter, verse, p) {
  closeVerseSheet();
  const key = p.dataset.hk;
  const text = p.querySelector('.vt').textContent;
  const ref = verseRef(book, chapter, verse);
  const hl = getHighlight(key);
  const sheet = document.createElement('div');
  sheet.id = 'verse-sheet';
  sheet.className = 'verse-sheet';
  sheet.innerHTML =
    '<div class="vs-backdrop"></div><div class="vs-panel" role="dialog" aria-label="' + ref + '">' +
    '<div class="vs-grip"></div><div class="vs-ref">' + ref + '</div><p class="vs-text">' + text + '</p>' +
    '<div class="vs-colors">' + HL_COLORS.map(function(c) {
      return '<button class="vs-color hl-swatch-' + c[0] + (hl && hl.c === c[0] ? ' on' : '') + '" data-c="' + c[0] + '" aria-label="Highlight ' + c[1] + '"></button>';
    }).join('') + '<button class="vs-color vs-clear" data-c="" aria-label="Remove highlight">✕</button></div>' +
    '<div class="vs-actions">' +
      '<button data-a="note">✎ Note</button><button data-a="save">♥ Save</button><button data-a="copy">⧉ Copy</button>' +
      '<button data-a="share">↗ Share</button><button data-a="memo">🧠 Memorize</button><button data-a="listen">▶ Listen from here</button>' +
    '</div>' +
    '<div class="vs-note" hidden><textarea id="vs-note-text" placeholder="Your note on ' + ref + '…">' + getVerseNote(key).replace(/</g, '&lt;') + '</textarea>' +
    '<div class="btn-group"><button class="btn" data-a="save-note">Save note</button></div></div>' +
    '</div>';
  document.body.appendChild(sheet);
  requestAnimationFrame(function() { sheet.classList.add('open'); });
  sheet.querySelector('.vs-backdrop').onclick = closeVerseSheet;
  sheet.querySelectorAll('.vs-color').forEach(function(b) {
    b.onclick = function() {
      setHighlight(key, b.dataset.c, text, ref);
      HL_COLORS.forEach(function(c) { p.classList.remove('hl-' + c[0]); });
      if (b.dataset.c) p.classList.add('hl-' + b.dataset.c);
      p.classList.remove('highlighted');
      closeVerseSheet();
      showToast(b.dataset.c ? 'Highlighted' : 'Highlight removed');
    };
  });
  sheet.querySelector('[data-a="note"]').onclick = function() {
    const n = sheet.querySelector('.vs-note'); n.hidden = !n.hidden;
    if (!n.hidden) document.getElementById('vs-note-text').focus();
  };
  sheet.querySelector('[data-a="save-note"]').onclick = function() {
    const v = document.getElementById('vs-note-text').value;
    setVerseNote(key, v, text, ref);
    const mark = p.querySelector('.note-mark');
    if (v.trim() && !mark) p.insertAdjacentHTML('beforeend', '<span class="note-mark" title="Has a note">✎</span>');
    if (!v.trim() && mark) mark.remove();
    closeVerseSheet();
    showToast(v.trim() ? 'Note saved' : 'Note removed');
  };
  sheet.querySelector('[data-a="save"]').onclick = function() { addBookmark(text, ref); closeVerseSheet(); };
  sheet.querySelector('[data-a="copy"]').onclick = function() {
    const s = '“' + text + '” — ' + ref + ' (KJV)';
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(function() { showToast('Copied'); }, function() { showToast('Copy not available'); });
    closeVerseSheet();
  };
  sheet.querySelector('[data-a="share"]').onclick = function() { shareText(text, ref); closeVerseSheet(); };
  sheet.querySelector('[data-a="memo"]').onclick = function() { closeVerseSheet(); openMemorize(text, ref); };
  sheet.querySelector('[data-a="listen"]').onclick = function() { closeVerseSheet(); listenChapter(book, chapter, verse); };
}
function closeVerseSheet() { const s = document.getElementById('verse-sheet'); if (s) s.remove(); }

// ---------- Listen to a chapter (follow along, keep going) ----------
function listenChapter(book, chapter, fromVerse) {
  const verses = Array.from(document.querySelectorAll('.bible-verse'));
  if (!verses.length) return;
  const segs = [];
  if (fromVerse <= 1) segs.push({ label: bookName(book) + ' ' + chapter, text: spokenChapterTitle(book, chapter) + '.', pause: 700 });
  verses.forEach(function(p) {
    const v = parseInt(p.dataset.v, 10);
    if (v < fromVerse) return;
    segs.push({
      label: verseRef(book, chapter, v), text: p.querySelector('.vt').textContent, pause: 250,
      onStart: function() {
        document.querySelectorAll('.bible-verse.reading').forEach(function(x) { x.classList.remove('reading'); });
        const el = document.querySelector('.bible-verse[data-v="' + v + '"]');
        if (el && currentBook === book && currentChapter === chapter) {
          el.classList.add('reading');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
  const btn = document.getElementById('listen-ch');
  if (btn) btn.textContent = '■ Stop listening';
  Narrator.play(segs, {
    title: bookName(book) + ' ' + chapter,
    onStop: function() {
      document.querySelectorAll('.bible-verse.reading').forEach(function(x) { x.classList.remove('reading'); });
      const b = document.getElementById('listen-ch'); if (b) b.textContent = '▶ Listen to chapter';
    },
    onDone: function() {
      if (typeof markChapterRead === 'function') markChapterRead(book, chapter, true);
      const keep = STORAGE.get('chapterContinue', true);
      const n = neighborChapter(book, chapter, 1);
      if (keep && n && currentPage === 'bible') {
        currentBook = n.book; currentChapter = n.chapter;
        syncBibleSelects();
        loadChapter(n.book, n.chapter).then(function() {
          if (currentBook === n.book && currentChapter === n.chapter) listenChapter(n.book, n.chapter, 1);
        });
      }
    }
  });
}

function spokenChapterTitle(book, chapter) {
  const n = bookName(book).replace(/^1 /, 'First ').replace(/^2 /, 'Second ').replace(/^3 /, 'Third ');
  return (book === 'psalms' ? 'Psalm ' : n + ', chapter ') + chapter;
}

// ---------- Whole-Bible search (KJV) ----------
const OT_COUNT = 39;

function searchScopeBooks(scope) {
  if (scope === 'ot') return BIBLE_BOOKS.slice(0, OT_COUNT);
  if (scope === 'nt') return BIBLE_BOOKS.slice(OT_COUNT);
  if (scope === 'book') return BIBLE_BOOKS.filter(function(b) { return b.id === currentBook; });
  return BIBLE_BOOKS;
}

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function runBibleSearch(q, scope) {
  const el = document.getElementById('chapter-content');
  if (!el) return;
  q = q.trim();
  if (!q) return;
  if (!KJV.ready()) {
    el.innerHTML = '<p class="loading">Getting the whole Bible ready for search (one-time download, about 1 MB)…</p>';
    try { await KJV.load(); } catch (e) { el.innerHTML = '<p class="reflection">Couldn’t download the Bible text for search. Check your connection and try again.</p>'; return; }
  }
  // "exact phrase" or all words (word starts, so "love" finds "loveth", "loved")
  const phrase = q.match(/^"(.+)"$/);
  const terms = phrase ? [phrase[1]] : q.split(/\s+/).filter(Boolean);
  const res = terms.map(function(t) { return new RegExp((phrase ? '' : '\\b') + escapeRegExp(t), 'i'); });
  const results = [];
  searchScopeBooks(scope).forEach(function(b) {
    for (let c = 1; c <= b.chapters; c++) {
      const vs = KJV.chapter(b.id, c) || [];
      for (let v = 0; v < vs.length; v++) {
        if (res.every(function(r) { return r.test(vs[v]); })) results.push({ book: b.id, c: c, v: v + 1, t: vs[v] });
      }
    }
  });
  const mark = new RegExp('(' + terms.map(function(t) { return (phrase ? '' : '\\b') + escapeRegExp(t) + (phrase ? '' : '\\w*'); }).join('|') + ')', 'gi');
  let shown = 0;
  function renderMore() {
    const chunk = results.slice(shown, shown + 60);
    shown += chunk.length;
    return chunk.map(function(r) {
      return '<button class="search-hit" data-b="' + r.book + '" data-c="' + r.c + '" data-v="' + r.v + '">' +
        '<span class="sh-ref">' + verseRef(r.book, r.c, r.v) + '</span><span class="sh-text">' + r.t.replace(mark, '<mark>$1</mark>') + '</span></button>';
    }).join('');
  }
  const scopeName = { all: 'the whole Bible', ot: 'the Old Testament', nt: 'the New Testament', book: bookName(currentBook) }[scope];
  el.innerHTML = '<h2 style="color:var(--gold)">“' + q.replace(/"/g, '') + '”</h2>' +
    '<p class="reflection">' + results.length + ' verse' + (results.length === 1 ? '' : 's') + ' in ' + scopeName + ' (KJV)</p>' +
    '<div id="search-hits">' + (results.length ? renderMore() : '<p class="reflection">No verses found. Try fewer words, or a different form of the word.</p>') + '</div>' +
    (results.length > shown ? '<div class="btn-group"><button class="btn btn-outline" id="search-more">Show more</button></div>' : '');
  function wireHits() {
    el.querySelectorAll('.search-hit').forEach(function(h) {
      h.onclick = function() {
        const b = h.dataset.b, c = parseInt(h.dataset.c, 10), v = parseInt(h.dataset.v, 10);
        pendingVerse = { book: b, chapter: c, verse: v };
        currentBook = b; currentChapter = c;
        syncBibleSelects();
        loadChapter(b, c);
        const top = document.querySelector('.bible-controls'); if (top) top.scrollIntoView({ block: 'start' });
      };
    });
  }
  wireHits();
  const more = document.getElementById('search-more');
  if (more) more.onclick = function() {
    document.getElementById('search-hits').insertAdjacentHTML('beforeend', renderMore());
    wireHits();
    if (shown >= results.length) more.remove();
  };
}

// Open a specific verse from anywhere (search results, highlights, notes)
function openVerse(book, chapter, verse) {
  pendingVerse = { book: book, chapter: chapter, verse: verse };
  openChapter(book, chapter);
}

// ---------- Highlights & Notes page ----------
let marksFilter = 'all';

function parseVerseKey(key) {
  const p = key.split(':'); // ver:book:chapter:verse
  return { ver: p[0], book: p[1], chapter: parseInt(p[2], 10), verse: parseInt(p[3], 10) };
}

function collectMarks() {
  const out = {};
  const hl = getHighlights(), notes = getNotes();
  Object.keys(hl).forEach(function(k) {
    const h = hl[k] === true ? { c: 'gold' } : hl[k];
    out[k] = { key: k, color: h.c, text: h.t, ref: h.r, date: h.d || '' };
  });
  Object.keys(notes).forEach(function(k) {
    const n = notes[k];
    out[k] = Object.assign(out[k] || { key: k, text: n.t, ref: n.r, date: '' }, { note: n.note, date: (out[k] && out[k].date > n.d ? out[k].date : n.d) || '' });
  });
  return Object.values(out).map(function(m) {
    const k = parseVerseKey(m.key);
    m.book = k.book; m.chapter = k.chapter; m.verse = k.verse;
    if (!m.ref) m.ref = verseRef(k.book, k.chapter, k.verse);
    if (!m.text && KJV.ready()) { const c = KJV.chapter(k.book, k.chapter); if (c) m.text = c[k.verse - 1]; }
    m.order = BIBLE_BOOKS.findIndex(function(b) { return b.id === k.book; }) * 1e6 + k.chapter * 1000 + k.verse;
    return m;
  });
}

function renderMarks() {
  const all = collectMarks();
  const sortBy = STORAGE.get('marksSort', 'recent');
  let list = all.filter(function(m) {
    if (marksFilter === 'all') return true;
    if (marksFilter === 'notes') return !!m.note;
    return m.color === marksFilter;
  });
  list.sort(sortBy === 'bible' ? function(a, b) { return a.order - b.order; } : function(a, b) { return (b.date || '').localeCompare(a.date || '') || a.order - b.order; });
  const count = function(f) { return all.filter(function(m) { return f === 'notes' ? !!m.note : m.color === f; }).length; };
  let html = '<div class="card"><h2>Highlights & Notes</h2>' +
    '<p class="reflection">Everything you’ve marked in the Bible, in one place. Tap any verse to open it in the reader.</p>' +
    '<div class="marks-filters">' +
      '<button class="mf' + (marksFilter === 'all' ? ' on' : '') + '" data-f="all">All ' + all.length + '</button>' +
      '<button class="mf' + (marksFilter === 'notes' ? ' on' : '') + '" data-f="notes">✎ Notes ' + count('notes') + '</button>' +
      HL_COLORS.map(function(c) { return '<button class="mf' + (marksFilter === c[0] ? ' on' : '') + '" data-f="' + c[0] + '"><span class="mf-dot hl-swatch-' + c[0] + '"></span>' + count(c[0]) + '</button>'; }).join('') +
    '</div>' +
    '<div class="marks-sort">Sort: <button class="linkish' + (sortBy === 'recent' ? ' on' : '') + '" data-s="recent">Recent</button> · <button class="linkish' + (sortBy === 'bible' ? ' on' : '') + '" data-s="bible">Bible order</button>' +
    (all.length ? ' · <button class="linkish" id="marks-export">Export</button>' : '') + '</div></div>';
  if (!all.length) {
    html += '<div class="card"><p class="reflection">Nothing here yet. Open the Bible, tap any verse, and choose a color or add a note.</p><div class="btn-group"><button class="btn" onclick="navigate(\'bible\')">Open the Bible</button></div></div>';
    return html;
  }
  if (!list.length) html += '<div class="card"><p class="reflection">Nothing in this filter yet.</p></div>';
  list.forEach(function(m) {
    html += '<div class="card mark-item' + (m.color ? ' hl-edge-' + m.color : '') + '" data-b="' + m.book + '" data-c="' + m.chapter + '" data-v="' + m.verse + '">' +
      '<div class="mark-ref">' + m.ref + (m.date ? '<span class="mark-date">' + new Date(m.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</span>' : '') + '</div>' +
      (m.text ? '<p class="mark-text' + (m.color ? ' hl-' + m.color : '') + '">' + m.text + '</p>' : '<p class="reflection">Tap to read this verse</p>') +
      (m.note ? '<div class="mark-note">✎ ' + m.note.replace(/</g, '&lt;').replace(/\n/g, '<br>') + '</div>' : '') +
    '</div>';
  });
  return html;
}

function setupMarks() {
  document.querySelectorAll('.mf').forEach(function(b) { b.onclick = function() { marksFilter = b.dataset.f; contentEl.innerHTML = renderMarks(); setupMarks(); }; });
  document.querySelectorAll('[data-s]').forEach(function(b) { b.onclick = function() { STORAGE.set('marksSort', b.dataset.s); contentEl.innerHTML = renderMarks(); setupMarks(); }; });
  document.querySelectorAll('.mark-item').forEach(function(c) {
    c.onclick = function() { openVerse(c.dataset.b, parseInt(c.dataset.c, 10), parseInt(c.dataset.v, 10)); };
  });
  const exp = document.getElementById('marks-export');
  if (exp) exp.onclick = function() {
    const body = collectMarks().sort(function(a, b) { return a.order - b.order; }).map(function(m) {
      return m.ref + (m.color ? ' [' + m.color + ']' : '') + '\n' + (m.text || '') + (m.note ? '\nNote: ' + m.note : '');
    }).join('\n\n');
    exportText('INRI Highlights and Notes', body);
  };
  // Older highlights saved without text: fill them in once the KJV is available
  if (!KJV.ready() && collectMarks().some(function(m) { return !m.text; })) {
    KJV.load({ cacheOnly: true }).then(function(d) { if (d && currentPage === 'marks') { contentEl.innerHTML = renderMarks(); setupMarks(); } });
  }
}
