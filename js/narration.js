// INRI — Narrator: reads a sequence of sections aloud with pauses between them,
// using the best voice on the device. Shows a small player bar while playing.

const Narrator = (function() {
  let segments = [], segIndex = 0, chunks = [], chunkIndex = 0;
  let state = 'idle'; // idle | playing | paused
  let pauseTimer = null, onDone = null, keepAlive = null;

  function prefs() { return STORAGE.get('narration', { voice: '', rate: 0.92 }); }
  function savePrefs(p) { STORAGE.set('narration', p); }

  function englishVoices() {
    if (!window.speechSynthesis) return [];
    return speechSynthesis.getVoices().filter(function(v) { return /^en(-|_|$)/i.test(v.lang); });
  }

  // Prefer natural/neural/enhanced voices; fall back to any English voice
  function scoreVoice(v) {
    let s = 0;
    const n = v.name;
    if (/natural|neural/i.test(n)) s += 6;
    if (/premium|enhanced/i.test(n)) s += 5;
    if (/google/i.test(n)) s += 3;
    if (/samantha|daniel|karen|moira|serena|aria|jenny|guy|libby|sonia|ava|allison|tom/i.test(n)) s += 2;
    if (/en-US/i.test(v.lang)) s += 1;
    if (/compact|eloquence|novelty|whisper|bad news|bells|boing|bubbles|cellos|jester|organ|trinoids|zarvox|albert|fred|junior|ralph|kathy|superstar|wobble/i.test(n)) s -= 10;
    return s;
  }

  function pickVoice() {
    const voices = englishVoices();
    const want = prefs().voice;
    if (want) { const v = voices.find(function(x) { return x.name === want; }); if (v) return v; }
    return voices.slice().sort(function(a, b) { return scoreVoice(b) - scoreVoice(a); })[0] || null;
  }

  // Split long text into sentence groups (~220 chars); some browsers stop long utterances
  function chunk(text) {
    const sentences = text.replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]+["”’)]*\s*|[^.!?;:]+$/g) || [text];
    const out = []; let cur = '';
    sentences.forEach(function(s) {
      if ((cur + s).length > 220 && cur) { out.push(cur.trim()); cur = ''; }
      cur += s;
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  function speakChunk() {
    if (state !== 'playing') return;
    if (chunkIndex >= chunks.length) {
      const pause = segments[segIndex].pause == null ? 900 : segments[segIndex].pause;
      segIndex++;
      if (segIndex >= segments.length) { finish(); return; }
      pauseTimer = setTimeout(startSegment, pause);
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = prefs().rate;
    u.pitch = 1;
    u.onend = function() { if (state !== 'playing') return; chunkIndex++; speakChunk(); };
    u.onerror = function(e) { if (e.error === 'interrupted' || e.error === 'canceled') return; chunkIndex++; speakChunk(); };
    speechSynthesis.speak(u);
  }

  function startSegment() {
    if (state !== 'playing') return;
    const seg = segments[segIndex];
    chunks = chunk(seg.text);
    chunkIndex = 0;
    updateBar();
    if (seg.onStart) seg.onStart(segIndex);
    speakChunk();
  }

  function play(list, opts) {
    if (!window.speechSynthesis) { alert('Speech is not supported in this browser.'); return; }
    stop(true);
    segments = list.filter(function(s) { return s && s.text; });
    if (!segments.length) return;
    segIndex = 0; state = 'playing';
    onDone = opts && opts.onDone;
    showBar(opts && opts.title);
    if (typeof Ambient !== 'undefined') Ambient.duck(true);
    // Chrome pauses speech after ~15s in background tabs unless nudged
    clearInterval(keepAlive);
    keepAlive = setInterval(function() { if (state === 'playing' && speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); speechSynthesis.resume(); } }, 10000);
    speechSynthesis.cancel();
    setTimeout(startSegment, 150);
  }

  // Pause = stop speaking but remember where we were; resume restarts the current sentence group
  function pause() {
    if (state !== 'playing') return;
    state = 'paused'; clearTimeout(pauseTimer); speechSynthesis.cancel(); updateBar();
  }
  function resume() {
    if (state !== 'paused') return;
    state = 'playing'; updateBar();
    if (chunkIndex >= chunks.length) startSegment(); else speakChunk();
  }
  function skip(dir) {
    if (state === 'idle') return;
    clearTimeout(pauseTimer); speechSynthesis.cancel();
    segIndex = Math.max(0, Math.min(segments.length - 1, segIndex + dir));
    state = 'playing'; startSegment();
  }
  function stop(silent) {
    clearTimeout(pauseTimer); clearInterval(keepAlive);
    if (window.speechSynthesis) speechSynthesis.cancel();
    const wasActive = state !== 'idle';
    state = 'idle';
    hideBar();
    if (wasActive && typeof Ambient !== 'undefined') Ambient.duck(false);
  }
  function finish() {
    stop();
    const cb = onDone; onDone = null;
    if (cb) cb();
  }

  // ---------- Player bar ----------
  let barTitle = '';
  function showBar(title) {
    barTitle = title || 'Listening';
    let bar = document.getElementById('narrator-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'narrator-bar';
      bar.className = 'narrator-bar';
      bar.innerHTML = '<div class="nb-text"><div class="nb-title"></div><div class="nb-now"></div></div>' +
        '<button class="nb-btn" data-nb="prev" aria-label="Previous section">⏮</button>' +
        '<button class="nb-btn nb-main" data-nb="toggle" aria-label="Pause">❚❚</button>' +
        '<button class="nb-btn" data-nb="next" aria-label="Next section">⏭</button>' +
        '<button class="nb-btn" data-nb="stop" aria-label="Stop">■</button>';
      document.body.appendChild(bar);
      bar.querySelector('[data-nb="toggle"]').onclick = function() { state === 'playing' ? pause() : resume(); };
      bar.querySelector('[data-nb="prev"]').onclick = function() { skip(-1); };
      bar.querySelector('[data-nb="next"]').onclick = function() { skip(1); };
      bar.querySelector('[data-nb="stop"]').onclick = function() { stop(); };
    }
    bar.classList.add('show');
    updateBar();
  }
  function hideBar() { const bar = document.getElementById('narrator-bar'); if (bar) bar.classList.remove('show'); }
  function updateBar() {
    const bar = document.getElementById('narrator-bar');
    if (!bar) return;
    bar.querySelector('.nb-title').textContent = barTitle;
    const seg = segments[segIndex];
    bar.querySelector('.nb-now').textContent = seg ? (seg.label || '') + (segments.length > 1 ? '  ·  ' + (segIndex + 1) + '/' + segments.length : '') : '';
    const t = bar.querySelector('[data-nb="toggle"]');
    t.textContent = state === 'playing' ? '❚❚' : '▶';
    t.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Play');
    const multi = segments.length > 1;
    bar.querySelector('[data-nb="prev"]').style.display = multi ? '' : 'none';
    bar.querySelector('[data-nb="next"]').style.display = multi ? '' : 'none';
  }

  return {
    play: play, pause: pause, resume: resume, stop: stop, skip: skip,
    state: function() { return state; },
    prefs: prefs, savePrefs: savePrefs, englishVoices: englishVoices, pickVoice: pickVoice
  };
})();

// Voices load asynchronously in some browsers
if (window.speechSynthesis && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = function() {
    const sel = document.getElementById('voice-select');
    if (sel && !sel.options.length) fillVoiceSelect(sel);
  };
}

// The whole day, read through: verse, inspiration, practice, prayer
function todaySegments(data) {
  data = data || getTodayContent();
  const lit = getLiturgicalDay();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const prayer = hour >= 17 || hour < 4 ? { label: 'Night prayer', text: data.night } : { label: 'Morning prayer', text: data.morning };
  const segs = [
    { label: 'Welcome', text: 'Today is ' + dateStr + '. ' + (lit.feast ? lit.feast.replace(/ — /g, '. ') + '. ' : '') + lit.label.replace(/·/g, ',') + '.', pause: 700 },
    { label: 'Verse of the Day', text: 'The verse of the day, from ' + spokenRef(data.reference) + '. ' + data.verse, pause: 1600 }
  ];
  if (data.deep) {
    segs.push({ label: 'Daily Inspiration', text: data.deep.title + '. ' + data.deep.body.join(' '), pause: 1200 });
    segs.push({ label: 'Live it today', text: 'Live it today. ' + data.deep.apply, pause: 1000 });
    segs.push({ label: 'Reflect', text: 'Something to reflect on. ' + data.deep.reflect, pause: 2500 });
  } else {
    segs.push({ label: 'Daily Inspiration', text: data.inspiration, pause: 1200 });
  }
  segs.push({ label: prayer.label, text: 'Let us pray. ' + prayer.text, pause: 600 });
  return segs;
}

// "Psalm 118:24" -> "Psalm 118, verse 24"; "Proverbs 3:5-6" -> "Proverbs 3, verses 5 to 6"
function spokenRef(ref) {
  return ref.replace(/(\d+):(\d+)[-–](\d+)/, '$1, verses $2 to $3').replace(/(\d+):(\d+)/, '$1, verse $2');
}

function listenToToday() {
  Narrator.play(todaySegments(), { title: 'Listening to today' });
}

// Route the existing one-off Listen buttons through the narrator
function speakText(text) {
  Narrator.play([{ label: 'Reading', text: text }], { title: 'Listening' });
}

function fillVoiceSelect(sel) {
  const voices = Narrator.englishVoices();
  const current = (Narrator.pickVoice() || {}).name;
  sel.innerHTML = voices.length
    ? voices.map(function(v) { return '<option value="' + v.name.replace(/"/g, '&quot;') + '"' + (v.name === current ? ' selected' : '') + '>' + v.name + ' (' + v.lang + ')</option>'; }).join('')
    : '<option value="">Device default</option>';
}
