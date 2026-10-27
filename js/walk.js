// INRI — The Daily Walk: a full-screen, page-by-page guided time with God.
// Stillness → Verse → Study → On location → Inspiration → Live it → Prayer → Journal → Amen

const Walk = (function() {
  let pages = [], index = 0, data = null, guided = false, breathTimer = null, touchX = null;

  function buildPages() {
    const lit = getLiturgicalDay();
    const hour = new Date().getHours();
    const evening = hour >= 17 || hour < 4;
    const prayer = evening ? { title: 'Night Prayer', text: data.night } : { title: 'Morning Prayer', text: data.morning };
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const deep = data.deep;
    const list = [];

    list.push({
      id: 'still', label: 'Be still',
      html: '<div class="walk-center">' +
        '<div class="breath" id="breath"><div class="breath-ring"></div><div class="breath-word" id="breath-word">Breathe in</div></div>' +
        '<h2 class="walk-title">Be still, and know that I am God.</h2>' +
        '<p class="walk-sub">Take a few slow breaths. Quiet your heart. You are in the presence of God.</p>' +
        '<div class="walk-sound">' + AMBIENT_CHOICES.map(function(c) {
          return '<button class="ambient-choice small' + (Ambient.current() === c[0] ? ' active' : '') + '" data-walk-amb="' + c[0] + '"><span>' + c[2] + '</span>' + c[1] + '</button>';
        }).join('') + '</div></div>',
      speak: 'Be still, and know that I am God. Take a few slow breaths, and quiet your heart. You are in the presence of God.',
      onShow: startBreathing
    });

    list.push({
      id: 'verse', label: 'The Word',
      html: '<div class="walk-center">' +
        '<div class="walk-kicker" style="--season:' + lit.color + '">' + dateStr + ' · ' + (lit.feast || lit.label) + '</div>' +
        '<p class="verse walk-verse reveal">' + data.verse + '</p>' +
        '<p class="reference walk-ref">— ' + data.reference + '</p></div>',
      speak: spokenRef(data.reference) + '. ' + data.verse
    });

    if (data.study) {
      list.push({
        id: 'study', label: 'Understand',
        html: '<h2 class="walk-h">Understand the verse</h2>' + renderVerseStudy(data, true),
        speak: data.study.context + ' ' + (data.study.words || []).map(function(w) { return w.kjv + '. ' + w.note; }).join(' ')
      });
    }

    const loc = DAY_LOCATIONS[dayNumberOf(data)];
    if (loc) {
      list.push({
        id: 'place', label: 'Where & when',
        html: '<h2 class="walk-h">Where & when</h2>' + renderLocationCard(data, false),
        speak: loc.when + '.'
      });
    }

    if (deep) {
      list.push({
        id: 'insp', label: 'Reflect',
        html: '<div class="walk-kicker">Daily Inspiration</div><h2 class="walk-h">' + deep.title + '</h2>' +
          deep.body.map(function(p) { return '<p class="reflection insp-para">' + p + '</p>'; }).join(''),
        speak: deep.title + '. ' + deep.body.join(' ')
      });
      list.push({
        id: 'live', label: 'Live it',
        html: '<div class="walk-center"><div class="insp-box walk-box"><div class="insp-label">Live it today</div><p class="reflection">' + deep.apply + '</p></div>' +
          '<div class="insp-box walk-box"><div class="insp-label">Reflect</div><p class="reflection" style="font-style:italic">' + deep.reflect + '</p></div></div>',
        speak: 'Live it today. ' + deep.apply + ' And something to reflect on. ' + deep.reflect
      });
    } else {
      list.push({ id: 'insp', label: 'Reflect', html: '<h2 class="walk-h">Daily Inspiration</h2><p class="reflection">' + data.inspiration + '</p>', speak: data.inspiration });
    }

    list.push({
      id: 'pray', label: 'Pray',
      html: '<div class="walk-kicker">Let us pray</div><h2 class="walk-h">' + prayer.title + '</h2><p class="prayer-text walk-prayer">' + prayer.text + '</p>',
      speak: 'Let us pray. ' + prayer.text
    });

    list.push({
      id: 'journal', label: 'Write',
      html: '<h2 class="walk-h">Your response</h2>' +
        '<p class="reflection walk-prompt">' + (deep ? deep.reflect : 'What is God saying to you today?') + '</p>' +
        '<textarea id="walk-journal" class="journal-entry walk-journal" placeholder="Write a few honest lines to God… (optional — saved only on this device)"></textarea>',
      speak: 'Take a moment to write your response. ' + (deep ? deep.reflect : ''),
      noAuto: true
    });

    list.push({
      id: 'amen', label: 'Amen',
      html: '<div class="walk-center"><div class="walk-cross">✝</div>' +
        '<p class="verse walk-verse benediction">The LORD bless thee, and keep thee: the LORD make his face shine upon thee, and be gracious unto thee: the LORD lift up his countenance upon thee, and give thee peace.</p>' +
        '<p class="reference walk-ref">— Numbers 6:24-26</p>' +
        '<p class="walk-sub" id="walk-streak"></p>' +
        '<div class="btn-group walk-end-btns"><button class="btn" data-walk="done">Amen</button>' +
        '<button class="btn btn-outline" data-walk="memo">Memorize today’s verse</button></div></div>',
      speak: 'The Lord bless thee, and keep thee: the Lord make his face shine upon thee, and be gracious unto thee: the Lord lift up his countenance upon thee, and give thee peace. Amen.',
      onShow: completeWalk,
      noAuto: true
    });
    return list;
  }

  function startBreathing() {
    clearInterval(breathTimer);
    const word = document.getElementById('breath-word');
    const b = document.getElementById('breath');
    if (!word || !b) return;
    let inhale = true;
    b.classList.add('in');
    breathTimer = setInterval(function() {
      inhale = !inhale;
      b.classList.toggle('in', inhale);
      word.textContent = inhale ? 'Breathe in' : 'Breathe out';
    }, 4000);
  }

  function saveJournal() {
    const ta = document.getElementById('walk-journal');
    if (!ta || !ta.value.trim()) return;
    const key = localDateKey();
    const stored = JSON.parse(localStorage.getItem('inri-journal') || '{}');
    const entry = '[' + data.reference + '] ' + ta.value.trim();
    stored[key] = stored[key] && stored[key].indexOf(entry) === -1 ? stored[key] + '\n\n' + entry : entry;
    localStorage.setItem('inri-journal', JSON.stringify(stored));
    ta.dataset.saved = '1';
    showToast('Saved to your journal');
  }

  function completeWalk() {
    const walks = STORAGE.get('walks', []);
    const key = localDateKey();
    if (walks.indexOf(key) === -1) { walks.push(key); STORAGE.set('walks', walks.slice(-400)); }
    const s = updateStreak();
    const el = document.getElementById('walk-streak');
    if (el) el.textContent = 'Day ' + s.count + ' of your streak · ' + walks.length + ' Daily Walk' + (walks.length === 1 ? '' : 's') + ' completed';
  }

  function render() {
    const root = document.getElementById('walk');
    const p = pages[index];
    root.querySelector('.walk-dots').innerHTML = pages.map(function(pg, i) {
      return '<span class="walk-dot' + (i === index ? ' on' : i < index ? ' done' : '') + '"></span>';
    }).join('');
    root.querySelector('.walk-step').textContent = p.label;
    const body = root.querySelector('.walk-body');
    body.classList.remove('enter');
    body.innerHTML = '<div class="walk-page">' + p.html + '</div>';
    void body.offsetWidth;
    body.classList.add('enter');
    body.scrollTop = 0;
    root.querySelector('[data-walk="prev"]').style.visibility = index ? 'visible' : 'hidden';
    const nextBtn = root.querySelector('[data-walk="next"]');
    nextBtn.style.visibility = index < pages.length - 1 ? 'visible' : 'hidden';
    nextBtn.textContent = index === 0 ? 'Begin →' : p.id === 'journal' ? 'Save & continue →' : 'Continue →';
    revealVerses(body);
    wirePage();
    if (p.onShow) p.onShow();
    if (guided) speakPage();
  }

  function wirePage() {
    const root = document.getElementById('walk');
    root.querySelectorAll('[data-walk-amb]').forEach(function(b) {
      b.onclick = function() {
        Ambient.play(b.dataset.walkAmb);
        root.querySelectorAll('[data-walk-amb]').forEach(function(x) { x.classList.toggle('active', x === b); });
      };
    });
    root.querySelectorAll('.ref-chip').forEach(function(c) {
      c.onclick = function(e) { e.preventDefault(); close(); openRef(c.textContent); };
    });
    const done = root.querySelector('[data-walk="done"]');
    if (done) done.onclick = function() { close(); showToast('Go in peace'); };
    const memo = root.querySelector('[data-walk="memo"]');
    if (memo) memo.onclick = function() { close(); openMemorize(data.verse, data.reference); };
  }

  function speakPage() {
    const p = pages[index];
    Narrator.play([{ label: p.label, text: p.speak, pause: 400 }], {
      title: 'Daily Walk',
      onDone: function() { if (guided && !p.noAuto && index < pages.length - 1 && document.getElementById('walk')) go(1); }
    });
  }

  function go(dir) {
    if (pages[index].id === 'journal' && dir > 0) saveJournal();
    const n = index + dir;
    if (n < 0 || n >= pages.length) return;
    if (pages[index].id === 'still') clearInterval(breathTimer);
    if (!guided) Narrator.stop();
    index = n;
    render();
  }

  function setGuided(on) {
    guided = on;
    const b = document.querySelector('#walk [data-walk="audio"]');
    if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    if (on) speakPage(); else Narrator.stop();
  }

  function open() {
    data = getTodayContent();
    pages = buildPages();
    index = 0; guided = false;
    let root = document.getElementById('walk');
    if (root) root.remove();
    root = document.createElement('div');
    root.id = 'walk';
    root.className = 'walk';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'Daily Walk');
    root.innerHTML =
      '<div class="walk-top"><button class="walk-icon" data-walk="close" aria-label="Close">✕</button>' +
      '<div class="walk-dots"></div>' +
      '<button class="walk-icon" data-walk="audio" aria-pressed="false" aria-label="Guided audio" title="Guided audio: read each page aloud and move on automatically">🎧</button></div>' +
      '<div class="walk-step"></div>' +
      '<div class="walk-body"></div>' +
      '<div class="walk-nav"><button class="btn btn-outline" data-walk="prev">← Back</button><button class="btn" data-walk="next">Begin →</button></div>';
    document.body.appendChild(root);
    document.documentElement.classList.add('walk-open');
    root.querySelector('[data-walk="close"]').onclick = close;
    root.querySelector('[data-walk="prev"]').onclick = function() { go(-1); };
    root.querySelector('[data-walk="next"]').onclick = function() { go(1); };
    root.querySelector('[data-walk="audio"]').onclick = function() { setGuided(!guided); };
    // Swipe between pages
    const body = root.querySelector('.walk-body');
    body.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, { passive: true });
    body.addEventListener('touchend', function(e) {
      if (touchX === null || (e.target.closest && e.target.closest('textarea, .ref-chips, .map-wrap'))) { touchX = null; return; }
      const dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
    });
    document.addEventListener('keydown', onKey);
    render();
  }

  function onKey(e) {
    if (!document.getElementById('walk') || (e.target && e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'Escape') close();
  }

  function close() {
    if (pages[index] && pages[index].id === 'journal') saveJournal();
    clearInterval(breathTimer);
    Narrator.stop();
    document.removeEventListener('keydown', onKey);
    const root = document.getElementById('walk');
    if (root) root.remove();
    document.documentElement.classList.remove('walk-open');
    if (currentPage === 'today') renderPage('today'), afterNavigate('today');
  }

  return { open: open, close: close };
})();

function walkDoneToday() {
  return STORAGE.get('walks', []).indexOf(localDateKey()) !== -1;
}

// ---------- Page hooks (called by navigate() after each page renders) ----------
function afterNavigate(page) {
  applyAtmosphere(page === 'morning' ? 'dawn' : page === 'night' ? 'night' : null);
  revealVerses(contentEl);
  Ambient.updateButton();
  if (page === 'settings') renderImmersiveSettings();
}

function renderImmersiveSettings() {
  const slot = document.getElementById('immersive-settings');
  if (!slot) return;
  const np = Narrator.prefs();
  const amb = Ambient.settings();
  slot.innerHTML =
    '<div class="card"><h2>Listening</h2>' +
    '<p class="reflection" style="margin-bottom:10px">Voice used for “Listen to today” and the Daily Walk. Voices marked Natural, Enhanced, or Premium sound best — on iPhone you can download more under Settings → Accessibility → Spoken Content → Voices.</p>' +
    '<select id="voice-select" class="voice-select"></select>' +
    '<div class="insp-label" style="margin-top:14px">Speed</div><div class="btn-group">' +
    [[0.8, 'Slow'], [0.92, 'Gentle'], [1.05, 'Normal']].map(function(r) {
      return '<button class="btn ' + (Math.abs(np.rate - r[0]) < 0.01 ? '' : 'btn-outline') + '" data-rate="' + r[0] + '">' + r[1] + '</button>';
    }).join('') + '</div>' +
    '<div class="btn-group" style="margin-top:10px"><button class="btn btn-outline" id="voice-test">▶ Test voice</button></div></div>' +
    '<div class="card"><h2>Ambient Sound</h2><p class="reflection" style="margin-bottom:10px">Plays softly while you read and pray, and quietens while the narrator speaks. You can also change it with the ♪ button at the top.</p>' +
    '<div class="ambient-choices">' + AMBIENT_CHOICES.map(function(c) {
      return '<button class="ambient-choice' + (Ambient.current() === c[0] ? ' active' : '') + '" data-set-amb="' + c[0] + '"><span>' + c[2] + '</span>' + c[1] + '</button>';
    }).join('') + '</div>' +
    '<label class="ambient-vol">Volume <input type="range" min="0" max="1" step="0.05" value="' + amb.volume + '" id="settings-amb-vol"></label></div>';

  const sel = document.getElementById('voice-select');
  fillVoiceSelect(sel);
  sel.onchange = function() { const p = Narrator.prefs(); p.voice = sel.value; Narrator.savePrefs(p); };
  slot.querySelectorAll('[data-rate]').forEach(function(b) {
    b.onclick = function() { const p = Narrator.prefs(); p.rate = parseFloat(b.dataset.rate); Narrator.savePrefs(p); renderImmersiveSettings(); };
  });
  document.getElementById('voice-test').onclick = function() {
    speakText('The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.');
  };
  slot.querySelectorAll('[data-set-amb]').forEach(function(b) {
    b.onclick = function() {
      Ambient.play(b.dataset.setAmb);
      slot.querySelectorAll('[data-set-amb]').forEach(function(x) { x.classList.toggle('active', x === b); });
    };
  });
  document.getElementById('settings-amb-vol').oninput = function() { Ambient.setVolume(parseFloat(this.value)); };
}

// Start-up
Ambient.resumeOnGesture();
setInterval(function() { if (currentPage !== 'morning' && currentPage !== 'night') applyAtmosphere(); }, 5 * 60 * 1000);
