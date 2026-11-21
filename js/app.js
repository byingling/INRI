// INRI App — Progressive Web App
const contentEl = document.getElementById('content');
const pageTitle = document.getElementById('page-title');
const sideNav = document.getElementById('side-nav');
const navOverlay = document.getElementById('nav-overlay');
const menuBtn = document.getElementById('menu-btn');
const closeNav = document.getElementById('close-nav');

let currentPage = 'today';
let currentBook = 'john';
let currentChapter = 3;

// ---------- Navigation ----------
function openNav() {
  sideNav.classList.add('open');
  navOverlay.classList.add('open');
}

function closeSideNav() {
  sideNav.classList.remove('open');
  navOverlay.classList.remove('open');
}

menuBtn.addEventListener('click', openNav);
closeNav.addEventListener('click', closeSideNav);
navOverlay.addEventListener('click', closeSideNav);

document.querySelectorAll('.side-nav li').forEach(li => {
  li.addEventListener('click', () => {
    const page = li.dataset.page;
    navigate(page);
    closeSideNav();
  });
});

document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    if (page === 'more') {
      openNav();
      return;
    }
    navigate(page);
  });
});

document.getElementById('logo-btn').addEventListener('click', () => navigate('today'));

function setActiveNav(page) {
  document.querySelectorAll('.side-nav li').forEach(li => {
    li.classList.toggle('active', li.dataset.page === page);
  });
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}

function navigate(page) {
  if (page === 'walk') { Walk.open(); return; }
  currentPage = page;
  setActiveNav(page);
  const titles = {
    today: 'Today',
    devotion: 'Daily Devotion',
    inspiration: 'Daily Inspiration',
    morning: 'Morning Prayer',
    night: 'Night Prayer',
    bible: 'Bible',
    plans: 'Reading Plans',
    topics: 'Topics',
    works: 'Works of Jesus',
    meals: 'Biblical Meals',
    plants: 'Biblical Plants',
    study: 'Study',
    beyond: 'Beyond the Canon',
    hymns: 'Hymns',
    prayers: 'Prayer List',
    bookmarks: 'Bookmarks',
    journal: 'My Journal',
    settings: 'Settings',
    about: 'About INRI',
    memorize: 'Memorize',
    marks: 'Highlights & Notes'
  };
  pageTitle.textContent = titles[page] || 'INRI';
  renderPage(page);
  window.scrollTo(0, 0);
  if (typeof afterNavigate === 'function') afterNavigate(page);
}

// ---------- Renderers ----------
function renderPage(page) {
  const today = getTodayContent();
  switch (page) {
    case 'today':
      contentEl.innerHTML = renderToday(today);
      break;
    case 'devotion':
      contentEl.innerHTML = renderDevotion(today);
      break;
    case 'inspiration':
      contentEl.innerHTML = renderInspiration(today);
      break;
    case 'morning':
      contentEl.innerHTML = renderPrayer('Morning Prayer', today.morning);
      break;
    case 'night':
      contentEl.innerHTML = renderPrayer('Night Prayer', today.night);
      break;
    case 'bible':
      contentEl.innerHTML = renderBible();
      setupBibleControls();
      loadChapter(currentBook, currentChapter);
      break;
    case 'journal':
      contentEl.innerHTML = renderJournal();
      setupJournal();
      break;
    case 'plans':
      contentEl.innerHTML = renderPlans();
      setupPlans();
      break;
    case 'topics':
      contentEl.innerHTML = renderTopics();
      setupTopicsSearch();
      break;
    case 'works':
      contentEl.innerHTML = renderWorksOfJesus();
      break;
    case 'meals':
      contentEl.innerHTML = renderBiblicalMeals();
      break;
    case 'plants':
      contentEl.innerHTML = renderBiblicalPlants();
      break;
    case 'study':
      contentEl.innerHTML = renderStudy();
      break;
    case 'beyond':
      contentEl.innerHTML = renderBeyondCanon();
      break;
    case 'hymns':
      contentEl.innerHTML = renderHymns();
      break;
    case 'prayers':
      contentEl.innerHTML = renderPrayerList();
      setupPrayerList();
      break;
    case 'bookmarks':
      contentEl.innerHTML = renderBookmarks();
      break;
    case 'settings':
      contentEl.innerHTML = renderSettings();
      setupSettings();
      break;
    case 'about':
      contentEl.innerHTML = renderAbout();
      break;
    case 'memorize':
      contentEl.innerHTML = renderMemorize();
      setupMemorize();
      break;
    case 'marks':
      contentEl.innerHTML = renderMarks();
      setupMarks();
      break;
    default:
      contentEl.innerHTML = '<p>Page not found.</p>';
  }
}

function renderToday(data) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const html = `
    <div class="hero">
      <div class="logo-large">INRI</div>
      <p>Iesus Nazarenus, Rex Iudaeorum</p>
      <p style="margin-top:4px;font-size:0.85rem;color:var(--gold-dim)">Jesus of Nazareth, King of the Jews</p>
    </div>

    ${renderSeasonBanner()}

    <div class="card walk-cta${walkDoneToday() ? ' done' : ''}" onclick="Walk.open()" role="button" tabindex="0">
      <div class="walk-cta-icon">✝</div>
      <div class="walk-cta-text">
        <div class="walk-cta-title">${walkDoneToday() ? 'Walk completed today ✓' : 'Begin your Daily Walk'}</div>
        <div class="walk-cta-sub">${walkDoneToday() ? 'Walk through it again any time' : 'Stillness, the Word, reflection & prayer · about 10 minutes'}</div>
      </div>
      <div class="walk-cta-go">→</div>
    </div>

    <div class="card">
      <div class="date-badge">${dateStr}</div>
      <h2>Verse of the Day</h2>
      <p class="verse reveal">“${data.verse}”</p>
      <p class="reference">— ${data.reference}</p>
      ${renderVerseStudy(data, false)}
    </div>

    <div class="card">
      <h2>Daily Inspiration</h2>
      ${data.deep ? '<h3 class="insp-title">' + data.deep.title + '</h3><p class="reflection">' + data.deep.body[0] + '</p><div class="btn-group" style="margin-top:14px"><button class="btn btn-outline" onclick="navigate(\'inspiration\')">Continue reading →</button></div>' : '<p class="reflection">' + data.inspiration + '</p>'}
    </div>

    ${renderLocationCard(data)}

    <div class="quick-links">
      <div class="quick-link" onclick="navigate('devotion')">
        <span class="q-icon">📖</span>
        <span>Devotion</span>
      </div>
      <div class="quick-link" onclick="navigate('morning')">
        <span class="q-icon">🌅</span>
        <span>Morning Prayer</span>
      </div>
      <div class="quick-link" onclick="navigate('night')">
        <span class="q-icon">🌙</span>
        <span>Night Prayer</span>
      </div>
      <div class="quick-link" onclick="navigate('bible')">
        <span class="q-icon">✝️</span>
        <span>Read Bible</span>
      </div>
    </div>
    <div class="card">
      <div class="btn-group">
        <button class="btn" onclick="listenToToday()">▶ Listen to today</button>
        <button class="btn btn-outline" onclick="openMemorize(getTodayContent().verse, getTodayContent().reference)">Memorize</button>
        <button class="btn btn-outline" onclick="shareText(getTodayContent().verse, getTodayContent().reference)">Share</button>
        <button class="btn btn-outline" onclick="addBookmark(getTodayContent().verse, getTodayContent().reference)">♥ Save</button>
        <button class="btn btn-outline" onclick="shareVerseCard()">Share card</button>
      </div>
      <p class="reflection" style="margin-top:12px;text-align:center;font-size:0.85rem">Streak: <strong id="streak-display"></strong></p>
    </div>
    <div id="continue-plan-slot"></div>
  `;
  // Fill in the streak and plan card once the page is in the DOM
  setTimeout(function(){
    var s=getStreak();
    var el=document.getElementById('streak-display');
    if(el) el.textContent = s.count + ' day' + (s.count===1?'':'s');
    if (typeof renderContinuePlanCard === 'function') renderContinuePlanCard(document.getElementById('continue-plan-slot'));
  }, 40);
  return html;
}

function renderDevotion(data) {
  const d = data.devotion;
  return `
    <div class="card">
      <div class="date-badge">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <h2>${d.title}</h2>
      <p class="verse">“${d.scripture}”</p>
      <p class="reference">— ${d.reference}</p>
      <h3>Reflection</h3>
      <p class="reflection">${d.reflection}</p>
      <h3>Prayer</h3>
      <p class="prayer-text">${d.prayer}</p>
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-outline" onclick="speakText(getTodayContent().devotion.scripture)">Listen</button>
        <button class="btn btn-outline" onclick="shareText(getTodayContent().devotion.scripture, getTodayContent().devotion.reference)">Share</button>
        <button class="btn btn-outline" onclick="addBookmark(getTodayContent().devotion.scripture, getTodayContent().devotion.reference)">♥ Save</button>
      </div>
    </div>
  `;
}

function renderInspiration(data) {
  const dateBadge = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  if (!data.deep) {
    return `
    <div class="card">
      <div class="date-badge">${dateBadge}</div>
      <h2>Daily Inspiration</h2>
      <p class="verse">“${data.verse}”</p>
      <p class="reference">— ${data.reference}</p>
      <p class="reflection" style="margin-top:18px">${data.inspiration}</p>
    </div>`;
  }
  const d = data.deep;
  return `
    <div class="card">
      <div class="date-badge">${dateBadge}</div>
      <h2>Daily Inspiration</h2>
      <p class="verse">“${data.verse}”</p>
      <p class="reference">— ${data.reference}</p>
      <h3 class="insp-title">${d.title}</h3>
      ${d.body.map(function(p) { return '<p class="reflection insp-para">' + p + '</p>'; }).join('')}
      <div class="insp-box">
        <div class="insp-label">Live it today</div>
        <p class="reflection">${d.apply}</p>
      </div>
      <div class="insp-box">
        <div class="insp-label">Reflect</div>
        <p class="reflection" style="font-style:italic">${d.reflect}</p>
      </div>
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-outline" onclick="speakText(getTodayContent().deep.title + '. ' + getTodayContent().deep.body.join(' '))">Listen</button>
        <button class="btn btn-outline" onclick="addBookmark(getTodayContent().verse, getTodayContent().reference)">♥ Save verse</button>
      </div>
    </div>
    <div class="card">
      <h2>Study the Verse</h2>
      ${renderVerseStudy(data, true)}
    </div>
    ${renderLocationCard(data)}
  `;
}

// Background, key words and cross-references for the day's verse.
// collapsible=false on Today (wrapped in <details>), true = always open.
function renderVerseStudy(data, open) {
  const st = data.study;
  if (!st) return '';
  let inner = '<div class="study-block"><div class="insp-label">Background</div><p class="reflection">' + st.context + '</p></div>';
  if (st.words && st.words.length) {
    inner += '<div class="study-block"><div class="insp-label">Key words</div>';
    st.words.forEach(function(w) {
      inner += '<div class="word-note"><div class="word-head"><span class="word-kjv">' + w.kjv + '</span> <span class="word-orig">' + w.orig + '</span></div><p class="reflection">' + w.note + '</p></div>';
    });
    inner += '</div>';
  }
  if (st.refs && st.refs.length) {
    inner += '<div class="study-block"><div class="insp-label">See also</div><div class="ref-chips">';
    st.refs.forEach(function(r) {
      inner += '<button class="ref-chip" onclick="openRef(\'' + r.replace(/'/g, "\\'") + '\')">' + r + '</button>';
    });
    inner += '</div></div>';
  }
  if (open) return inner;
  return '<details class="verse-study"><summary>Study this verse</summary>' + inner + '</details>';
}

// Open a reference like "Lamentations 3:22-23" in the Bible reader
function openRef(ref) {
  const m = ref.match(/^(.+?)\s+(\d+)/);
  if (!m) return;
  const want = m[1].toLowerCase();
  const book = BIBLE_BOOKS.find(function(b) {
    const n = b.name.toLowerCase();
    return n === want || n === want + 's' || n.replace(/s$/, '') === want;
  });
  if (!book) { showToast('Could not open ' + ref); return; }
  openChapter(book.id, parseInt(m[2], 10));
}

// Jump straight to a book + chapter in the Bible reader.
// navigate('bible') already selects the current book/chapter and loads it;
// firing a 'change' on the book select afterwards would reset the chapter to 1.
function openChapter(bookId, chapter) {
  currentBook = bookId;
  currentChapter = chapter;
  navigate('bible');
}

function renderPrayer(title, text) {
  const key = title === 'Night Prayer' ? 'night' : 'morning';
  const paras = String(text).split(/\n\s*\n/).map(function(p) { return '<p class="prayer-text prayer-para">' + p + '</p>'; }).join('');
  return `
    <div class="card">
      <div class="date-badge">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <h2>${title}</h2>
      <p class="reflection prayer-ref">Praying with ${getTodayContent().reference}</p>
      <div class="prayer-body">${paras}</div>
      <div class="btn-group">
        <button class="btn btn-outline" onclick="Narrator.play([{ label: '${title}', text: getTodayContent().${key} }], { title: '${title}' })">Listen</button>
        <button class="btn btn-outline" onclick="shareText(getTodayContent().${key}, '${title}')">Share</button>
      </div>
    </div>
  `;
}

function renderBible() {
  const bookOptions = BIBLE_BOOKS.map(b =>
    `<option value="${b.id}" ${b.id === currentBook ? 'selected' : ''}>${b.name}</option>`
  ).join('');
  const grid = BIBLE_BOOKS.map(b =>
    '<button type="button" class="book-chip' + (b.id === currentBook ? ' active' : '') + '" data-book="' + b.id + '">' + b.name + '</button>'
  ).join('');

  return `
    <div class="bible-controls">
      <select id="book-select">${bookOptions}</select>
      <select id="chapter-select"></select>
      <button class="btn" id="load-btn">Read</button>
    </div>
    <div class="bible-controls" style="margin-top:0">
      <input type="search" id="bible-search" placeholder="Search the Bible… (use “quotes” for a phrase)" style="flex:1;min-width:160px" enterkeyhint="search">
      <select id="search-scope" aria-label="Search in">
        <option value="all">Whole Bible</option><option value="ot">Old Testament</option><option value="nt">New Testament</option><option value="book">This book</option>
      </select>
      <button class="btn" id="search-btn">Search</button>
      <button class="btn btn-outline" id="random-verse-btn">Random</button>
      <button class="btn btn-outline" id="compare-btn">Compare</button>
    </div>
    <div class="card" style="padding:12px">
      <p class="reflection" style="margin-bottom:8px;font-size:0.85rem">Books</p>
      <div class="book-grid" id="book-grid">${grid}</div>
    </div>
    <div class="card">
      <div id="chapter-content" class="chapter-text">
        <p class="loading">Select a book and chapter…</p>
      </div>
    </div>
  `;
}

function setupBibleControls() {
  const bookSelect = document.getElementById('book-select');
  const chapterSelect = document.getElementById('chapter-select');
  const loadBtn = document.getElementById('load-btn');

  function populateChapters() {
    const book = BIBLE_BOOKS.find(b => b.id === bookSelect.value);
    chapterSelect.innerHTML = '';
    for (let i = 1; i <= book.chapters; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Chapter ${i}`;
      if (i === currentChapter && book.id === currentBook) opt.selected = true;
      chapterSelect.appendChild(opt);
    }
  }

  populateChapters();
  bookSelect.addEventListener('change', () => {
    currentBook = bookSelect.value;
    currentChapter = 1;
    populateChapters();
  });

  loadBtn.addEventListener('click', () => {
    currentBook = bookSelect.value;
    currentChapter = parseInt(chapterSelect.value, 10);
    loadChapter(currentBook, currentChapter);
  });

  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('bible-search');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() { runBibleSearch(searchInput.value, document.getElementById('search-scope').value); });
    searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') searchBtn.click(); });
  }

  // Book grid
  document.querySelectorAll('.book-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      currentBook = this.dataset.book;
      currentChapter = 1;
      bookSelect.value = currentBook;
      populateChapters();
      document.querySelectorAll('.book-chip').forEach(function(c) { c.classList.remove('active'); });
      this.classList.add('active');
      loadChapter(currentBook, currentChapter);
    });
  });

  // Random verse
  const randBtn = document.getElementById('random-verse-btn');
  if (randBtn) {
    randBtn.addEventListener('click', function() {
      const day = DAILY_CONTENT[Math.floor(Math.random() * DAILY_CONTENT.length)];
      const el = document.getElementById('chapter-content');
      if (!el) return;
      el.innerHTML = '<h2 style="color:var(--gold)">Random Verse</h2>' +
        '<p class="verse">"' + day.verse + '"</p>' +
        '<p class="reference">— ' + day.reference + '</p>' +
        '<div class="btn-group">' +
        '<button class="btn btn-outline" onclick="speakText(\'' + day.verse.replace(/'/g, "\\'") + '\')">Listen</button>' +
        '<button class="btn btn-outline" onclick="shareText(\'' + day.verse.replace(/'/g, "\\'") + '\', \'' + day.reference + '\')">Share</button>' +
        '<button class="btn btn-outline" onclick="addBookmark(\'' + day.verse.replace(/'/g, "\\'") + '\', \'' + day.reference + '\')">♥</button>' +
        '</div>';
      showToast('Random verse ready');
    });
  }

  const cmp = document.getElementById('compare-btn');
  if (cmp) {
    cmp.addEventListener('click', async function() {
      const el = document.getElementById('chapter-content');
      el.innerHTML = '<p class="loading">Loading KJV & WEB…</p>';
      try {
        const [r1, r2] = await Promise.all([
          fetch('https://api.midvash.com/v1/kjv/' + currentBook + '/' + currentChapter),
          fetch('https://api.midvash.com/v1/web/' + currentBook + '/' + currentChapter)
        ]);
        const j1 = await r1.json();
        const j2 = await r2.json();
        const d1 = j1.data || j1;
        const d2 = j2.data || j2;
        let v1 = Array.isArray(d1) ? d1 : (d1.verses || []);
        let v2 = Array.isArray(d2) ? d2 : (d2.verses || []);
        const bookName = (BIBLE_BOOKS.find(b => b.id === currentBook) || {}).name || currentBook;
        let html = '<h2 style="color:var(--gold)">' + bookName + ' ' + currentChapter + ' — Compare</h2>';
        html += '<div class="compare-grid">';
        html += '<div class="compare-col"><h3>KJV</h3>';
        v1.forEach(function(v,i){ html += '<p><span class="verse-num">'+(v.verse||i+1)+'</span>'+(v.text||'')+'</p>'; });
        html += '</div><div class="compare-col"><h3>WEB</h3>';
        v2.forEach(function(v,i){ html += '<p><span class="verse-num">'+(v.verse||i+1)+'</span>'+(v.text||'')+'</p>'; });
        html += '</div></div>';
        el.innerHTML = html;
      } catch(e) {
        el.innerHTML = '<p class="reflection">Compare failed. Check connection.</p>';
      }
    });
  }
}

// renderChapterHTML, wireChapterNav and loadChapter now live in bible-plus.js

function exportText(title, body) {
  const full = title + "\n\n" + body;
  if (navigator.share) {
    navigator.share({ title: title, text: full }).catch(function() {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(full).then(function() { showToast('Copied to clipboard'); });
  } else {
    prompt('Copy:', full);
  }
}

function renderJournal() {
  return `
    <div class="card">
      <h2>Today’s Journal</h2>
      <p class="reflection" style="margin-bottom:12px">Write freely. Your entries stay on this device.</p>
      <textarea id="journal-text" class="journal-entry" placeholder="What is God speaking to you today? What are you thankful for? What do you need to release?"></textarea>
      <div class="btn-group">
        <button class="btn" id="save-journal">Save Entry</button>
      </div>
    </div>
    <div class="card">
      <h2>Past Entries</h2>
      <div id="journal-list" class="journal-list"></div>
    </div>
  `;
}

function setupJournal() {
  const textarea = document.getElementById('journal-text');
  const saveBtn = document.getElementById('save-journal');
  const listEl = document.getElementById('journal-list');

  // Load today’s draft if any
  const todayKey = localDateKey();
  const stored = JSON.parse(localStorage.getItem('inri-journal') || '{}');
  if (stored[todayKey]) {
    textarea.value = stored[todayKey];
  }

  saveBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;
    stored[todayKey] = text;
    localStorage.setItem('inri-journal', JSON.stringify(stored));
    renderJournalList();
    alert('Entry saved.');
  });

  function renderJournalList() {
    const entries = Object.entries(stored).sort((a, b) => b[0].localeCompare(a[0]));
    if (!entries.length) {
      listEl.innerHTML = '<p class="reflection">No entries yet.</p>';
      return;
    }
    listEl.innerHTML = entries.map(([date, text]) => `
      <div class="journal-item">
        <div class="date">${new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
        <p>${text.replace(/\n/g, '<br>')}</p>
      </div>
    `).join('');
  }

  renderJournalList();
  const exp = document.getElementById('export-journal');
  if (exp) exp.onclick = function() {
    const entries = JSON.parse(localStorage.getItem('inri-journal') || '[]');
    if (!entries.length) { showToast('No entries'); return; }
    const body = entries.map(function(e) { return (e.date || '') + "\n" + (e.text || ''); }).join("\n\n---\n\n");
    exportText('INRI Journal', body);
  };
}

function renderAbout() {
  return `
    <div class="card">
      <h2>INRI — Daily Faith</h2>
      <p class="reference" style="margin-bottom:12px">Version 1.2</p>
      <p class="reflection">
        <strong>INRI</strong> = <em>Iesus Nazarenus, Rex Iudaeorum</em><br>
        “Jesus of Nazareth, King of the Jews”
      </p>
      <h3>Features</h3>
      <p class="reflection">
        Daily verse, devotion & prayers · 40 days of content · 35+ reading plans · 
        Topics · Prayer list · Bookmarks · Journal · Bible (KJV & WEB) · 
        Listen · Share · Streak · Font size · Themes · Offline chapter cache
      </p>
      <h3>Bible Text</h3>
      <p class="reflection">
        King James Version and World English Bible (public domain) via Midvash API.
        Recently read chapters are cached on your device for offline use.
      </p>
      <h3>Privacy</h3>
      <p class="reflection">
        Journal, bookmarks, prayer list, and settings stay on this device only (localStorage).
        Nothing is sent to any server except Bible text requests.
      </p>
      <p class="reflection" style="margin-top:20px;font-size:0.85rem;color:var(--gold-dim)">
        Built as a personal companion that can grow into a public blessing.
      </p>
    </div>
  `;
}


// ---------- Reading Plans ----------
// renderPlans / setupPlans live in plans-plus.js

function renderBookmarks() {
  const list = getBookmarks();
  if (!list.length) {
    return '<div class="card"><h2>Bookmarks</h2><p class="reflection">No bookmarks yet. Use the Heart button on a verse or devotion to save it here.</p></div>';
  }
  let html = '<div class="card"><h2>Bookmarks</h2><p class="reflection">' + list.length + ' saved</p><div class="btn-group"><button class="btn btn-outline" id="export-bm">Export All</button></div></div>';
  list.forEach(function(b, i) {
    html += '<div class="card"><p class="verse">"' + b.text + '"</p><p class="reference">— ' + b.ref + '</p>';
    html += '<div class="btn-group"><button class="btn btn-outline share-bm" data-i="' + i + '">Share</button>';
    html += '<button class="btn btn-outline remove-bm" data-i="' + i + '">Remove</button></div></div>';
  });
  setTimeout(function() {
    document.querySelectorAll('.share-bm').forEach(function(btn) {
      btn.onclick = function() {
        const b = getBookmarks()[parseInt(btn.dataset.i)];
        shareText(b.text, b.ref);
      };
    });
    var expb = document.getElementById('export-bm');
    if (expb) expb.onclick = function() {
      var body = getBookmarks().map(function(b) { return '"' + b.text + '" — ' + b.ref; }).join("\n\n");
      exportText('INRI Bookmarks', body);
    };
    document.querySelectorAll('.remove-bm').forEach(function(btn) {
      btn.onclick = function() {
        const list = getBookmarks();
        list.splice(parseInt(btn.dataset.i), 1);
        saveBookmarks(list);
        contentEl.innerHTML = renderBookmarks();
      };
    });
  }, 50);
  return html;
}

function addBookmark(text, ref) {
  const list = getBookmarks();
  if (list.some(function(b) { return b.ref === ref && b.text === text; })) {
    showToast('Already saved');
    return;
  }
  list.unshift({ text: text, ref: ref, date: new Date().toISOString() });
  saveBookmarks(list);
  showToast('Saved to bookmarks');
}

let topicAudioQueue = [];
let topicAudioIndex = 0;
let topicAudioActive = false;

function stopTopicAudio() {
  topicAudioActive = false;
  topicAudioQueue = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  document.querySelectorAll('.topic-audio-btn').forEach(function(b) {
    b.textContent = b.dataset.label || '▶ Play audio';
  });
}

function playTopicAudio(verses, btn) {
  if (!window.speechSynthesis) {
    alert('Speech is not supported in this browser.');
    return;
  }
  if (topicAudioActive) {
    stopTopicAudio();
    return;
  }
  topicAudioQueue = verses.map(function(v) {
    return (v.text || '') + '. ' + (v.ref || '');
  });
  topicAudioIndex = 0;
  topicAudioActive = true;
  if (btn) {
    btn.dataset.label = btn.dataset.label || btn.textContent;
    btn.textContent = '■ Stop';
  }
  function next() {
    if (!topicAudioActive || topicAudioIndex >= topicAudioQueue.length) {
      stopTopicAudio();
      showToast('Audio finished');
      return;
    }
    const u = new SpeechSynthesisUtterance(topicAudioQueue[topicAudioIndex]);
    u.rate = 0.9;
    u.onend = function() {
      topicAudioIndex++;
      setTimeout(next, 400);
    };
    u.onerror = function() {
      topicAudioIndex++;
      setTimeout(next, 200);
    };
    window.speechSynthesis.speak(u);
  }
  window.speechSynthesis.cancel();
  next();
}

// speakText() now lives in narration.js (uses the Narrator and its player bar)

function resetPrayersIfNewDay() {
  const today = localDateKey();
  const last = STORAGE.get('prayersResetDate', null);
  if (last === today) return;
  const list = getPrayers().map(function(p) { return Object.assign({}, p, { prayedToday: false }); });
  savePrayers(list);
  STORAGE.set('prayersResetDate', today);
}

function showToast(msg) {
  let t = document.getElementById('inri-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'inri-toast';
    t.className = 'inri-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  try { if (navigator.vibrate) navigator.vibrate(30); } catch(e) {}
  clearTimeout(t._hide);
  t._hide = setTimeout(function() { t.classList.remove('show'); }, 2200);
}

function shareText(text, title) {
  const full = '"' + text + '" — ' + title + '\n\nShared from INRI';
  if (navigator.share) {
    navigator.share({ title: title || 'INRI', text: full }).catch(function() {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(full).then(function() { alert('Copied to clipboard'); });
  } else {
    prompt('Copy this:', full);
  }
}

function renderSettings() {
  const size = getFontSize();
  const streak = getStreak();
  const theme = getTheme();
  const ver = getBibleVersion();
  return '<div id="reminder-settings"></div><div id="immersive-settings"></div>' +
    '<div class="card"><h2>Reading Streak</h2><p class="verse" style="border:none;padding:0;font-size:2.2rem;text-align:center">' + streak.count + ' day' + (streak.count === 1 ? '' : 's') + '</p><p class="reflection" style="text-align:center">Open the app each day to build your streak.</p></div>' +
    '<div class="card"><h2>Font Size</h2><div class="btn-group">' +
    '<button class="btn ' + (size==='small'?'':'btn-outline') + '" data-size="small">Small</button>' +
    '<button class="btn ' + (size==='medium'?'':'btn-outline') + '" data-size="medium">Medium</button>' +
    '<button class="btn ' + (size==='large'?'':'btn-outline') + '" data-size="large">Large</button></div></div>' +
    '<div class="card"><h2>Theme</h2><div class="btn-group">' +
    '<button class="btn ' + (theme==='dark'?'':'btn-outline') + '" data-theme="dark">Dark</button>' +
    '<button class="btn ' + (theme==='parchment'?'':'btn-outline') + '" data-theme="parchment">Parchment</button></div></div>' +
    '<div class="card"><h2>Bible Version</h2><div class="btn-group">' +
    '<button class="btn ' + (ver==='kjv'?'':'btn-outline') + '" data-ver="kjv">KJV</button>' +
    '<button class="btn ' + (ver==='web'?'':'btn-outline') + '" data-ver="web">WEB</button></div>' +
    '<p class="reflection" style="margin-top:8px;font-size:0.85rem">KJV = King James · WEB = World English Bible (both public domain)</p></div>' +
    '<div class="card"><h2>Install App</h2><p class="reflection">Add INRI to your home screen for one-tap access.</p>' +
    '<div class="btn-group"><button class="btn btn-outline" id="install-btn">How to Install</button></div></div>' +
    '<div class="card"><h2>Accessibility</h2><div class="btn-group">' +
    '<button class="btn ' + (getA11y().largeTap?'':'btn-outline') + '" id="a11y-tap">Larger taps</button>' +
    '<button class="btn ' + (getA11y().reduceMotion?'':'btn-outline') + '" id="a11y-motion">Reduce motion</button></div></div>' +
    '<div class="card"><h2>Backup</h2><p class="reflection">Export or restore journal, bookmarks, plans, and settings.</p>' +
    '<div class="btn-group"><button class="btn" id="backup-export">Export backup</button>' +
    '<label class="btn btn-outline" style="cursor:pointer">Import<input type="file" id="backup-import" accept="application/json" style="display:none"></label></div></div>' +
    '<div class="card"><h2>Data</h2><p class="reflection">Reset streak or clear all local data.</p>' +
    '<div class="btn-group">' +
    '<button class="btn btn-outline" id="reset-streak-btn">Reset Streak</button>' +
    '<button class="btn btn-outline" id="clear-data-btn">Clear All Data</button></div></div>';
}

function setupSettings() {
  document.querySelectorAll('[data-size]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFontSize(btn.dataset.size);
      contentEl.innerHTML = renderSettings();
      setupSettings();
    });
  });
  document.querySelectorAll('[data-theme]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setTheme(btn.dataset.theme);
      contentEl.innerHTML = renderSettings();
      setupSettings();
    });
  });
  document.querySelectorAll('[data-ver]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setBibleVersion(btn.dataset.ver);
      contentEl.innerHTML = renderSettings();
      setupSettings();
    });
  });
  var inst = document.getElementById('install-btn');
  if (inst) inst.addEventListener('click', function() {
    alert('Install INRI:\n\n• iPhone: Safari → Share → Add to Home Screen\n• Android: Chrome menu → Install app / Add to Home screen\n\nThe app icon will match the INRI artwork.');
  });
  var rs = document.getElementById('reset-streak-btn');
  if (rs) rs.addEventListener('click', function() {
    if (confirm('Reset reading streak to 0?')) {
      STORAGE.set('streak', { count: 0, lastDate: null });
      showToast('Streak reset');
      contentEl.innerHTML = renderSettings();
      setupSettings();
    }
  });
  var cd = document.getElementById('clear-data-btn');
  if (cd) cd.addEventListener('click', function() {
    if (confirm('Clear ALL local data? This cannot be undone.')) {
      ['bookmarks','verseNotes','fontSize','streak','planProgress','prayers','collections','chapterCache','onboarded','activePlan','theme','bibleVersion','journal','highlights','customPlans','a11y','prayersResetDate','installDismissed','ambient','narration','memorized','walks'].forEach(function(k) {
        localStorage.removeItem('inri-' + k);
      });
      localStorage.removeItem('inri-journal');
      showToast('All data cleared');
      setFontSize('medium');
      setTheme('dark');
      contentEl.innerHTML = renderSettings();
      setupSettings();
    }
  });
  var aTap = document.getElementById('a11y-tap');
  if (aTap) aTap.onclick = function() {
    var a = getA11y(); a.largeTap = !a.largeTap; setA11y(a);
    contentEl.innerHTML = renderSettings(); setupSettings();
  };
  var aMot = document.getElementById('a11y-motion');
  if (aMot) aMot.onclick = function() {
    var a = getA11y(); a.reduceMotion = !a.reduceMotion; setA11y(a);
    contentEl.innerHTML = renderSettings(); setupSettings();
  };
  var be = document.getElementById('backup-export');
  if (be) be.onclick = exportAllData;
  var bi = document.getElementById('backup-import');
  if (bi) bi.onchange = function() { if (this.files[0]) importAllData(this.files[0]); };
}



// ---------- Topics ----------
function verseButtons(v) {
  const t = (v.text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const r = (v.ref || '').replace(/'/g, "\\'");
  return '<div class="btn-group" style="margin-bottom:14px">' +
    '<button class="btn btn-outline" onclick="speakText(\'' + t + '\')">Listen</button>' +
    '<button class="btn btn-outline" onclick="shareText(\'' + t + '\', \'' + r + '\')">Share</button>' +
    '<button class="btn btn-outline" onclick="addBookmark(\'' + t + '\', \'' + r + '\')">♥</button></div>';
}

function topicMediaBar(verses, label) {
  const payload = JSON.stringify(verses).replace(/'/g, "\\'");
  const q = encodeURIComponent('KJV Bible ' + (label || '') + ' reading');
  return '<div class="topic-media">' +
    '<button type="button" class="btn topic-audio-btn" data-label="▶ Play audio">▶ Play audio</button>' +
    '<a class="btn btn-outline topic-video-btn" href="https://www.youtube.com/results?search_query=' + q + '" target="_blank" rel="noopener">▶ Video</a>' +
    '</div>';
}

function wireTopicAudioButtons() {
  document.querySelectorAll('.topic-media').forEach(function(bar, idx) {
    const btn = bar.querySelector('.topic-audio-btn');
    if (!btn || btn._wired) return;
    btn._wired = true;
    btn.addEventListener('click', function() {
      const card = bar.closest('.card');
      const verses = [];
      if (card) {
        card.querySelectorAll('.verse').forEach(function(p) {
          const text = (p.textContent || '').replace(/^"|"$/g, '').trim();
          const refEl = p.nextElementSibling;
          const ref = refEl && refEl.classList.contains('reference') ? (refEl.textContent || '').replace(/^—\s*/, '') : '';
          if (text) verses.push({ text: text, ref: ref });
        });
      }
      if (!verses.length) {
        showToast('No verses to play');
        return;
      }
      playTopicAudio(verses, btn);
    });
  });
}

function renderTopics() {
  const names = {
    anxiety: 'Anxiety & Peace', grief: 'Grief & Comfort', forgiveness: 'Forgiveness',
    strength: 'Strength', love: 'Love', guidance: 'Guidance', hope: 'Hope',
    faith: 'Faith', courage: 'Courage', wisdom: 'Wisdom', marriage: 'Marriage',
    work: 'Work', temptation: 'Temptation', joy: 'Joy', provision: 'Provision',
    children: 'Children & Family', praise: 'Praise'
  };
  let html = '<div class="card"><h2>Topics</h2><p class="reflection">Play audio, open video, or search all topics.</p><input type="search" id="topics-search" placeholder="Search topics & gifts…" style="width:100%;margin-top:10px;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text)"></div>';

  if (typeof GIFTS_FROM_GOD !== 'undefined') {
    html += '<div class="card gifts-section"><h2 style="color:var(--gold)">' + GIFTS_FROM_GOD.title + '</h2>';
    html += '<p class="reflection">' + GIFTS_FROM_GOD.intro + '</p></div>';
    GIFTS_FROM_GOD.sections.forEach(function(sec) {
      html += '<div class="card gifts-card"><h3 style="color:var(--gold-light);margin-bottom:12px">' + sec.name + '</h3>';
      html += topicMediaBar(sec.verses, sec.name);
      sec.verses.forEach(function(v) {
        html += '<p class="verse">"' + v.text + '"</p><p class="reference">— ' + v.ref + '</p>';
        html += verseButtons(v);
      });
      html += '</div>';
    });
    if (typeof GIFT_PRAYERS !== 'undefined' && GIFT_PRAYERS.length) {
      html += '<div class="card"><h2 style="color:var(--gold)">Prayers for the Gifts</h2><p class="reflection">Ask in faith; the Spirit distributes as He wills.</p></div>';
      GIFT_PRAYERS.forEach(function(g) {
        html += '<div class="card"><h3 style="color:var(--gold-light)">' + g.name + '</h3>';
        html += '<p class="prayer-text">' + g.prayer + '</p>';
        html += '<div class="btn-group"><button class="btn" onclick="speakText(' + JSON.stringify(g.prayer) + ')">Listen</button>';
        html += '<button class="btn btn-outline" onclick="shareText(' + JSON.stringify(g.prayer) + ', ' + JSON.stringify(g.name) + ')">Share</button></div></div>';
      });
    }
  }

  html += '<div class="card"><h2>More Topics</h2><p class="reflection">Browse by need.</p></div>';
  Object.keys(TOPICAL_VERSES).forEach(function(key) {
    const title = names[key] || key;
    html += '<div class="card"><h2>' + title + '</h2>';
    html += topicMediaBar(TOPICAL_VERSES[key], title);
    TOPICAL_VERSES[key].forEach(function(v) {
      html += '<p class="verse">"' + v.text + '"</p><p class="reference">— ' + v.ref + '</p>';
      html += verseButtons(v);
    });
    html += '</div>';
  });
  setTimeout(wireTopicAudioButtons, 50);
  return html;
}


// ---------- Prayer List ----------
// renderPrayerList / setupPrayerList live in prayer-list.js

// getContinuePlanInfo lives in plans-plus.js

// ---------- Works of Jesus ----------
function renderWorksOfJesus() {
  if (typeof WORKS_OF_JESUS === 'undefined') return '<div class="card"><p class="reflection">Content loading…</p></div>';
  let html = '<div class="card"><h2>Works of Jesus</h2><p class="reflection">' + WORKS_OF_JESUS.intro + '</p></div>';
  WORKS_OF_JESUS.categories.forEach(function(cat) {
    html += '<div class="card"><h2 style="color:var(--gold)">' + cat.name + '</h2>';
    cat.items.forEach(function(item) {
      html += '<div class="study-item"><h3>' + item.title + '</h3>';
      html += '<p class="reference">' + item.refs + '</p>';
      html += '<p class="reflection">' + item.note + '</p></div>';
    });
    html += '</div>';
  });
  return html;
}

// ---------- Biblical Meals ----------
function renderBiblicalMeals() {
  if (typeof BIBLICAL_MEALS === 'undefined') return '<div class="card"><p class="reflection">Content loading…</p></div>';
  let html = '<div class="card"><h2>Biblical Meals</h2><p class="reflection">' + BIBLICAL_MEALS.intro + '</p></div>';
  BIBLICAL_MEALS.recipes.forEach(function(r) {
    html += '<div class="card meal-card"><h2>' + r.title + '</h2>';
    html += '<p class="reference">' + r.refs + '</p>';
    html += '<p class="reflection">' + r.note + '</p>';
    html += '<h3 style="color:var(--gold-light);margin-top:12px">Ingredients</h3><ul class="recipe-list">';
    r.ingredients.forEach(function(ing) { html += '<li>' + ing + '</li>'; });
    html += '</ul><h3 style="color:var(--gold-light);margin-top:12px">Method</h3>';
    html += '<p class="prayer-text">' + r.method + '</p></div>';
  });
  return html;
}

// ---------- Biblical Plants ----------
function renderBiblicalPlants() {
  if (typeof BIBLICAL_PLANTS === 'undefined') return '<div class="card"><p class="reflection">Content loading…</p></div>';
  let html = '<div class="card"><h2>Biblical Plants</h2><p class="reflection">' + BIBLICAL_PLANTS.intro + '</p></div>';
  BIBLICAL_PLANTS.plants.forEach(function(p) {
    html += '<div class="card"><h2>' + p.name + '</h2>';
    if (p.hebrew) html += '<p class="reference">Hebrew: ' + p.hebrew + '</p>';
    html += '<p class="reference">' + p.refs + '</p>';
    html += '<p class="reflection">' + p.note + '</p></div>';
  });
  return html;
}

// ---------- Study ----------
function renderStudy() {
  if (typeof STUDY_NOTES_EXTRA === 'undefined') return '<div class="card"><p class="reflection">Content loading…</p></div>';
  let html = '<div class="card"><h2>Study</h2><p class="reflection">' + STUDY_NOTES_EXTRA.intro + '</p></div>';
  if (typeof WHO_IS_JESUS !== 'undefined') {
    html += '<div class="card"><h2 style="color:var(--gold)">Who Is Jesus?</h2><p class="reflection">' + WHO_IS_JESUS.intro + '</p></div>';
    WHO_IS_JESUS.sections.forEach(function(s) {
      html += '<div class="card"><h3 style="color:var(--gold-light)">' + s.title + '</h3><p class="reflection">' + s.body + '</p></div>';
    });
  }
  html += '<div class="card"><h2>Hard Passages & Books</h2><p class="reflection">Notes for honest reading.</p></div>';
  STUDY_NOTES_EXTRA.books.forEach(function(b) {
    html += '<div class="card"><h2 style="color:var(--gold)">' + b.name + '</h2>';
    html += '<p class="reference">' + b.refs + '</p><ul class="recipe-list">';
    b.points.forEach(function(pt) { html += '<li>' + pt + '</li>'; });
    html += '</ul></div>';
  });
  html += '<div class="card"><p class="reflection">Also see Topics → Gifts, Works of Jesus, Biblical Meals, Plants, and Beyond the Canon.</p></div>';
  return html;
}

function renderBeyondCanon() {
  if (typeof BEYOND_THE_CANON === 'undefined') return '<div class="card"><p class="reflection">Content loading…</p></div>';
  let html = '<div class="card"><h2>Beyond the Canon</h2><p class="reflection">' + BEYOND_THE_CANON.intro + '</p>';
  html += '<p class="reflection" style="margin-top:10px;font-style:italic">' + BEYOND_THE_CANON.disclaimer + '</p></div>';
  BEYOND_THE_CANON.groups.forEach(function(g) {
    html += '<div class="card"><h2 style="color:var(--gold)">' + g.name + '</h2>';
    g.items.forEach(function(item) {
      html += '<div class="study-item"><h3>' + item.title + '</h3><p class="reflection">' + item.note + '</p></div>';
    });
    html += '</div>';
  });
  return html;
}


// ---------- Hymns ----------
function renderHymns() {
  let html = '<div class="card"><h2>Hymns</h2><p class="reflection">Public-domain and traditional hymns. Listen reads the lyrics aloud.</p></div>';
  (HYMNS || []).forEach(function(h, i) {
    html += '<div class="card"><h2>' + h.title + '</h2>';
    html += '<p class="reference">' + (h.author || '') + '</p>';
    html += '<p class="prayer-text" style="white-space:pre-line">' + h.lyrics + '</p>';
    html += '<div class="btn-group"><button class="btn" onclick="speakText(' + JSON.stringify(h.lyrics) + ')">Listen</button>';
    html += '<button class="btn btn-outline" onclick="shareText(' + JSON.stringify(h.lyrics.slice(0,200)+'…') + ', ' + JSON.stringify(h.title) + ')">Share</button></div></div>';
  });
  return html;
}

// ---------- Topics search ----------
function setupTopicsSearch() {
  const input = document.getElementById('topics-search');
  if (!input) return;
  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(function(card) {
      if (card.querySelector('#topics-search')) return;
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.indexOf(q) >= 0) ? '' : 'none';
    });
  });
}

// Patch renderTopics to include search - done via string if needed

// ---------- Backup / restore ----------
function exportAllData() {
  const data = {
    version: 1,
    exported: new Date().toISOString(),
    bookmarks: getBookmarks(),
    prayers: getPrayers(),
    planProgress: getPlanProgress(),
    customPlans: getCustomPlans(),
    highlights: getHighlights(),
    streak: getStreak(),
    journal: JSON.parse(localStorage.getItem('inri-journal') || '[]'),
    settings: { fontSize: getFontSize(), theme: getTheme(), bibleVersion: getBibleVersion(), a11y: getA11y() }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inri-backup.json';
  a.click();
  showToast('Backup downloaded');
}

function importAllData(file) {
  const reader = new FileReader();
  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);
      if (data.bookmarks) saveBookmarks(data.bookmarks);
      if (data.prayers) savePrayers(data.prayers);
      if (data.planProgress) savePlanProgress(data.planProgress);
      if (data.customPlans) saveCustomPlans(data.customPlans);
      if (data.highlights) STORAGE.set('highlights', data.highlights);
      if (data.streak) STORAGE.set('streak', data.streak);
      if (data.journal) localStorage.setItem('inri-journal', JSON.stringify(data.journal));
      if (data.settings) {
        if (data.settings.fontSize) setFontSize(data.settings.fontSize);
        if (data.settings.theme) setTheme(data.settings.theme);
        if (data.settings.bibleVersion) setBibleVersion(data.settings.bibleVersion);
        if (data.settings.a11y) setA11y(data.settings.a11y);
      }
      showToast('Backup restored');
    } catch (e) {
      alert('Could not read backup file');
    }
  };
  reader.readAsText(file);
}

// ---------- Share card (verse of the day) ----------
function shareVerseCard() {
  const d = getTodayContent();
  const text = '"' + d.verse + '" — ' + d.reference + '\\n\\nINRI — Daily Faith';
  shareText(d.verse, d.reference);
}

// ---------- Custom plan builder snippet in plans ----------
// ---------- Splash + Start ----------
// Apply saved font size and update streak
setFontSize(getFontSize());
setTheme(getTheme());
setA11y(getA11y());
updateStreak();
resetPrayersIfNewDay();

function showInstallBanner() {
  if (STORAGE.get('installDismissed', false)) return;
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  const b = document.createElement('div');
  b.className = 'install-banner';
  b.innerHTML = '<span>Install INRI on your home screen</span><button class="btn" id="install-banner-btn">How</button><button class="btn btn-outline" id="install-dismiss">✕</button>';
  document.body.appendChild(b);
  document.getElementById('install-banner-btn').onclick = function() {
    alert('• iPhone: Safari → Share → Add to Home Screen\n• Android: Menu → Install app / Add to Home screen');
  };
  document.getElementById('install-dismiss').onclick = function() {
    STORAGE.set('installDismissed', true);
    b.remove();
  };
}

function showOnboarding() {
  if (hasSeenOnboarding()) return;
  const overlay = document.createElement('div');
  overlay.id = 'onboard';
  overlay.className = 'onboard';
  overlay.innerHTML = '<div class="onboard-card"><h2>Welcome to INRI</h2>' +
    '<p>Daily verse, devotion & prayers</p>' +
    '<p>Reading plans — tap a day to open the chapter</p>' +
    '<p>Prayer list, topics, bookmarks & journal</p>' +
    '<p>Bible (KJV or WEB) with offline cache</p>' +
    '<button class="btn" id="onboard-go">Get Started</button></div>';
  document.body.appendChild(overlay);
  document.getElementById('onboard-go').onclick = function() {
    setOnboarded();
    overlay.remove();
  };
}

function hideSplash() {
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');
  if (splash) {
    splash.classList.add('hide');
  }
  if (app) {
    app.classList.remove('app-hidden');
    app.classList.add('app-visible');
  }
  setTimeout(showOnboarding, 500);
  setTimeout(showInstallBanner, 8000);
  // Allow interaction after fade
  setTimeout(() => {
    if (splash && splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }
  }, 900);
}

// Show splash for 10 seconds, then enter app
navigate('today'); // Pre-render first page while splash is visible

setTimeout(hideSplash, 7000);

// Optional: allow early dismiss by tapping splash
document.getElementById('splash')?.addEventListener('click', hideSplash);
