// INRI — Reading plans: longer plans with several chapters a day, chapter-by-chapter
// progress that keeps your place, an on-track indicator, and streak tie-in.
// Loaded after app.js; provides renderPlans/setupPlans/getContinuePlanInfo and
// the plan banner shown in the Bible reader.

// ---------- Plan builders ----------
function chapterList(bookIds) {
  const out = [];
  bookIds.forEach(function(id) {
    const b = BIBLE_BOOKS.find(function(x) { return x.id === id; });
    for (let c = 1; c <= b.chapters; c++) out.push({ book: id, chapter: c });
  });
  return out;
}

// "Matthew 1–3", "Matthew 28; Mark 1–2", "Psalms 1, 31, 61"
function readingsRef(readings) {
  const groups = [];
  readings.forEach(function(r) {
    const g = groups[groups.length - 1];
    if (g && g.book === r.book) g.chs.push(r.chapter); else groups.push({ book: r.book, chs: [r.chapter] });
  });
  return groups.map(function(g) {
    const name = bookName(g.book);
    const consecutive = g.chs.every(function(c, i) { return i === 0 || c === g.chs[i - 1] + 1; });
    if (g.chs.length === 1) return (g.book === 'psalms' ? 'Psalm' : name) + ' ' + g.chs[0];
    return name + ' ' + (consecutive ? g.chs[0] + '–' + g.chs[g.chs.length - 1] : g.chs.join(', '));
  }).join('; ');
}

function makeDays(readingsPerDay) {
  return readingsPerDay.map(function(rs, i) {
    return { day: i + 1, ref: readingsRef(rs), book: rs[0].book, chapter: rs[0].chapter, readings: rs };
  });
}

// Spread chapters evenly over a number of days, in order
function spread(chapters, days) {
  const out = [];
  for (let d = 0; d < days; d++) out.push(chapters.slice(Math.floor(d * chapters.length / days), Math.floor((d + 1) * chapters.length / days)));
  return out;
}

const ALL_BOOK_IDS = BIBLE_BOOKS.map(function(b) { return b.id; });
const NT_IDS = ALL_BOOK_IDS.slice(39);

const LONG_PLANS = [
  { id: 'gospels-30', title: 'The Gospels in 30 Days', desc: 'Matthew, Mark, Luke and John — the life of Jesus, about 3 chapters a day.',
    days: makeDays(spread(chapterList(['matthew', 'mark', 'luke', 'john']), 30)) },
  { id: 'psalms-month', title: 'Psalms in a Month', desc: 'All 150 psalms in 30 days — five a day, spaced through the book (1, 31, 61, 91, 121…).',
    days: makeDays(Array.from({ length: 30 }, function(_, i) { return [0, 30, 60, 90, 120].map(function(o) { return { book: 'psalms', chapter: i + 1 + o }; }); })) },
  { id: 'proverbs-month', title: 'Proverbs in a Month', desc: 'One chapter of wisdom a day for 31 days.',
    days: makeDays(Array.from({ length: 31 }, function(_, i) { return [{ book: 'proverbs', chapter: i + 1 }]; })) },
  { id: 'nt-90', title: 'New Testament in 90 Days', desc: 'All 260 chapters from Matthew to Revelation, about 3 a day.',
    days: makeDays(spread(chapterList(NT_IDS), 90)) },
  { id: 'bible-year', title: 'The Bible in a Year', desc: 'Genesis to Revelation in 365 days — all 1,189 chapters, about 3–4 a day.',
    days: makeDays(spread(chapterList(ALL_BOOK_IDS), 365)) }
];
LONG_PLANS.forEach(function(p) { p.long = true; });

function allPlans() { return (getCustomPlans() || []).concat(LONG_PLANS, READING_PLANS); }
function findPlan(id) { return allPlans().find(function(p) { return p.id === id; }) || null; }

// ---------- Progress ----------
function dayReadings(d) { return d.readings || [{ book: d.book, chapter: d.chapter }]; }
function getPlanChapters() { return STORAGE.get('planChapters', {}); }
function getPlanStarted() { return STORAGE.get('planStarted', {}); }

function chapterDone(planId, r) {
  const m = getPlanChapters()[planId] || {};
  return !!m[r.book + ':' + r.chapter];
}
function isDayDone(planId, d) {
  if ((getPlanProgress()[planId] || []).indexOf(d.day) !== -1) return true;
  return dayReadings(d).every(function(r) { return chapterDone(planId, r); });
}
function doneDayCount(plan) { return plan.days.filter(function(d) { return isDayDone(plan.id, d); }).length; }

function startPlan(id) {
  setActivePlan(id);
  const s = getPlanStarted();
  if (!s[id]) { s[id] = localDateKey(); STORAGE.set('planStarted', s); }
}

function setDayDone(planId, day, done) {
  const progress = getPlanProgress();
  const list = progress[planId] || [];
  const has = list.indexOf(day) !== -1;
  if (done && !has) list.push(day);
  if (!done && has) list.splice(list.indexOf(day), 1);
  progress[planId] = list;
  savePlanProgress(progress);
  // Keep chapter marks in step with the day checkbox
  const plan = findPlan(planId);
  const d = plan && plan.days.find(function(x) { return x.day === day; });
  if (d) {
    const all = getPlanChapters(); const m = all[planId] || {};
    dayReadings(d).forEach(function(r) { const k = r.book + ':' + r.chapter; if (done) m[k] = m[k] || localDateKey(); else delete m[k]; });
    all[planId] = m; STORAGE.set('planChapters', all);
  }
  if (done) updateStreak();
}

// Mark a chapter read in the active plan. Returns the day it belongs to, if any.
function markChapterRead(book, chapter, fromListening) {
  const id = getActivePlan();
  const plan = id && findPlan(id);
  if (!plan) return null;
  const d = planDayForChapter(plan, book, chapter);
  if (!d) return null;
  const all = getPlanChapters(); const m = all[id] || {};
  const k = book + ':' + chapter;
  if (m[k]) return d;
  m[k] = localDateKey(); all[id] = m; STORAGE.set('planChapters', all);
  updateStreak();
  if (isDayDone(id, d)) {
    const progress = getPlanProgress();
    if ((progress[id] || []).indexOf(d.day) === -1) { progress[id] = (progress[id] || []).concat(d.day); savePlanProgress(progress); }
    showToast('Day ' + d.day + ' of ' + plan.title + ' complete ✓');
  } else if (fromListening) {
    showToast(bookName(book) + ' ' + chapter + ' marked read');
  }
  return d;
}

// The plan day a chapter belongs to — prefer the first day not yet finished
function planDayForChapter(plan, book, chapter) {
  const matches = plan.days.filter(function(d) { return dayReadings(d).some(function(r) { return r.book === book && r.chapter === chapter; }); });
  return matches.find(function(d) { return !isDayDone(plan.id, d); }) || matches[0] || null;
}

function getContinuePlanInfo() {
  const id = getActivePlan();
  const plan = id && findPlan(id);
  if (!plan) return null;
  const nextDay = plan.days.find(function(d) { return !isDayDone(plan.id, d); });
  const doneCount = doneDayCount(plan);
  if (!nextDay) return { plan: plan, complete: true, doneCount: doneCount, total: plan.days.length };
  const nextReading = dayReadings(nextDay).find(function(r) { return !chapterDone(plan.id, r); }) || dayReadings(nextDay)[0];
  const started = getPlanStarted()[plan.id];
  let pace = '';
  if (started) {
    // Days that should be finished before today (today's reading isn't late yet)
    const expected = Math.min(plan.days.length, daysBetween(new Date(started + 'T12:00:00'), new Date()));
    const diff = doneCount - expected;
    pace = diff >= 0 ? (diff > 0 ? diff + ' day' + (diff === 1 ? '' : 's') + ' ahead' : 'On track') : (-diff) + ' day' + (diff === -1 ? '' : 's') + ' behind — no pressure, just keep going';
  }
  return {
    plan: plan, next: { day: nextDay.day, ref: nextDay.ref, book: nextReading.book, chapter: nextReading.chapter, readings: dayReadings(nextDay) },
    nextReading: nextReading, doneCount: doneCount, total: plan.days.length, pace: pace
  };
}

// ---------- Today page card ----------
function renderContinuePlanCard(slot) {
  const info = getContinuePlanInfo();
  if (!slot) return;
  if (!info) {
    slot.innerHTML = '<div class="card plan-cta" onclick="navigate(\'plans\')" role="button"><h2>Reading Plans</h2><p class="reflection">Read through the Gospels in 30 days, the Psalms in a month, or the whole Bible in a year — INRI keeps your place.</p></div>';
    return;
  }
  if (info.complete) {
    slot.innerHTML = '<div class="card"><h2>Plan complete ✓</h2><p class="reflection">You finished ' + info.plan.title + '. Well done, good and faithful servant. Choose another in Reading Plans.</p><div class="btn-group"><button class="btn btn-outline" onclick="navigate(\'plans\')">Reading Plans</button></div></div>';
    return;
  }
  const pct = Math.round(info.doneCount / info.total * 100);
  const todays = info.next.readings.map(function(r) {
    return '<span class="plan-chip' + (chapterDone(info.plan.id, r) ? ' done' : '') + '">' + readingsRef([r]) + '</span>';
  }).join('');
  slot.innerHTML = '<div class="card"><h2>' + info.plan.title + '</h2>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
    '<p class="reflection plan-status">Day ' + info.next.day + ' of ' + info.total + (info.pace ? ' · ' + info.pace : '') + '</p>' +
    '<div class="plan-chips">' + todays + '</div>' +
    '<div class="btn-group"><button class="btn" id="continue-plan-btn">Continue: ' + readingsRef([info.nextReading]) + '</button></div></div>';
  document.getElementById('continue-plan-btn').onclick = function() { openChapter(info.nextReading.book, info.nextReading.chapter); };
}

// ---------- Banner in the Bible reader ----------
function planBannerHTML(book, chapter) {
  const id = getActivePlan();
  const plan = id && findPlan(id);
  if (!plan) return '';
  const d = planDayForChapter(plan, book, chapter);
  if (!d) return '';
  const done = chapterDone(plan.id, { book: book, chapter: chapter }) || (getPlanProgress()[plan.id] || []).indexOf(d.day) !== -1;
  const rest = dayReadings(d).filter(function(r) { return !(r.book === book && r.chapter === chapter) && !chapterDone(plan.id, r); });
  return '<div class="plan-banner"><div><div class="insp-label">' + plan.title + ' · Day ' + d.day + '</div><div class="pb-ref">' + d.ref + '</div></div>' +
    (done ? '<span class="pb-done">✓ Read</span>' : '<button class="btn btn-sm" id="mark-ch-read">Mark read</button>') +
    (done && rest.length ? '<button class="btn btn-outline btn-sm" id="plan-next-reading" data-b="' + rest[0].book + '" data-c="' + rest[0].chapter + '">Next: ' + readingsRef([rest[0]]) + ' →</button>' : '') +
    '</div>';
}

function wirePlanBanner(book, chapter) {
  const mark = document.getElementById('mark-ch-read');
  if (mark) mark.onclick = function() {
    markChapterRead(book, chapter, false);
    loadChapter(book, chapter);
  };
  const next = document.getElementById('plan-next-reading');
  if (next) next.onclick = function() {
    currentBook = next.dataset.b; currentChapter = parseInt(next.dataset.c, 10);
    syncBibleSelects(); loadChapter(currentBook, currentChapter);
  };
}

// ---------- Reading Plans page ----------
let openPlanDays = {}; // which plans have their full day list expanded

function planDaysHTML(plan, limit) {
  const days = limit ? plan.days.slice(0, limit) : plan.days;
  return '<div class="plan-days">' + days.map(function(d) {
    const done = isDayDone(plan.id, d);
    const partial = !done && dayReadings(d).some(function(r) { return chapterDone(plan.id, r); });
    return '<div class="plan-day' + (done ? ' done' : '') + (partial ? ' partial' : '') + '" data-plan="' + plan.id + '" data-day="' + d.day + '">' +
      '<label class="plan-check"><input type="checkbox"' + (done ? ' checked' : '') + '><span class="checkmark"></span></label>' +
      '<button type="button" class="plan-open" data-b="' + dayReadings(d)[0].book + '" data-c="' + dayReadings(d)[0].chapter + '">' +
      (plan.days.length > 7 ? '<span class="pd-num">Day ' + d.day + '</span> ' : '') + d.ref + '</button></div>';
  }).join('') + '</div>';
}

function planCardHTML(plan, isActive) {
  const done = doneDayCount(plan);
  const pct = Math.round(done / plan.days.length * 100);
  const started = getPlanStarted()[plan.id] || (done ? 'yes' : '');
  let html = '<div class="card plan-card' + (isActive ? ' active-plan' : '') + '" data-plan-id="' + plan.id + '">';
  html += '<h2>' + plan.title + (isActive ? ' <span class="active-tag">Current</span>' : '') + '</h2>';
  if (plan.desc) html += '<p class="reflection">' + plan.desc + '</p>';
  if (started || isActive) {
    html += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<p class="reflection plan-status">' + done + ' of ' + plan.days.length + ' days · ' + pct + '%</p>';
  } else {
    html += '<p class="reflection plan-status">' + plan.days.length + ' days</p>';
  }
  html += '<div class="btn-group">' + (isActive ? '' : '<button class="btn' + (plan.long ? '' : ' btn-outline') + ' plan-start" data-id="' + plan.id + '">' + (started ? 'Make current' : 'Start this plan') + '</button>') + '</div>';
  const big = plan.days.length > 31;
  if (!big || openPlanDays[plan.id]) html += planDaysHTML(plan);
  else html += planDaysHTML(plan, 0);
  if (big) html += '<button class="linkish plan-toggle" data-id="' + plan.id + '">' + (openPlanDays[plan.id] ? 'Hide days' : 'Show all ' + plan.days.length + ' days') + '</button>';
  html += '</div>';
  return html;
}

function renderPlans() {
  const active = getActivePlan();
  const activePlan = active && findPlan(active);
  let html = '<div class="card"><h2>Reading Plans</h2><p class="reflection">Pick a plan and INRI keeps your place. Chapters are marked read when you tap “Mark read” or listen all the way through, and each finished day counts toward your streak.</p></div>';
  if (activePlan) {
    html += '<div id="plans-continue"></div>';
    html += planCardHTML(activePlan, true);
  }
  html += '<h3 class="plans-heading">Read through</h3>';
  LONG_PLANS.forEach(function(p) { if (p.id !== active) html += planCardHTML(p, false); });
  html += '<div class="card"><h2>Make your own</h2><p class="reflection">A book, a starting chapter, and how many days.</p>';
  html += '<div class="bible-controls"><select id="cp-book">' + BIBLE_BOOKS.map(function(b) { return '<option value="' + b.id + '">' + b.name + '</option>'; }).join('') + '</select>' +
    '<input type="number" id="cp-start" min="1" value="1" class="num-input" title="Start chapter" aria-label="Start chapter">' +
    '<input type="number" id="cp-days" min="1" max="150" value="7" class="num-input" title="Days" aria-label="Days">' +
    '<button class="btn" id="cp-create">Create</button></div></div>';
  html += '<h3 class="plans-heading">Short plans</h3>';
  (getCustomPlans() || []).concat(READING_PLANS).forEach(function(p) { if (p.id !== active) html += planCardHTML(p, false); });
  return html;
}

function setupPlans() {
  const rerender = function() { contentEl.innerHTML = renderPlans(); setupPlans(); };
  const slot = document.getElementById('plans-continue');
  if (slot) renderContinuePlanCard(slot);
  const cp = document.getElementById('cp-create');
  if (cp) cp.onclick = function() {
    const book = document.getElementById('cp-book').value;
    const start = parseInt(document.getElementById('cp-start').value, 10) || 1;
    const days = Math.min(150, parseInt(document.getElementById('cp-days').value, 10) || 7);
    const b = BIBLE_BOOKS.find(function(x) { return x.id === book; });
    const chapters = [];
    for (let c = start; c <= b.chapters; c++) chapters.push({ book: book, chapter: c });
    if (!chapters.length) { showToast('That book doesn’t have that many chapters'); return; }
    const plan = { id: 'custom-' + Date.now(), title: b.name + ' from chapter ' + start, days: makeDays(spread(chapters, Math.min(days, chapters.length))) };
    const list = getCustomPlans(); list.unshift(plan); saveCustomPlans(list);
    startPlan(plan.id);
    showToast('Plan created');
    rerender();
  };
  document.querySelectorAll('.plan-start').forEach(function(b) {
    b.onclick = function() { startPlan(b.dataset.id); showToast('Plan started — find it on Today'); rerender(); window.scrollTo(0, 0); };
  });
  document.querySelectorAll('.plan-toggle').forEach(function(b) {
    b.onclick = function() { openPlanDays[b.dataset.id] = !openPlanDays[b.dataset.id]; rerender(); };
  });
  document.querySelectorAll('.plan-day input[type=checkbox]').forEach(function(cb) {
    cb.addEventListener('click', function(e) { e.stopPropagation(); });
    cb.addEventListener('change', function() {
      const row = cb.closest('.plan-day');
      if (!getActivePlan() || getActivePlan() !== row.dataset.plan) startPlan(row.dataset.plan);
      setDayDone(row.dataset.plan, parseInt(row.dataset.day, 10), cb.checked);
      rerender();
    });
  });
  document.querySelectorAll('.plan-open').forEach(function(b) {
    b.onclick = function(e) {
      e.preventDefault();
      const row = b.closest('.plan-day');
      if (getActivePlan() !== row.dataset.plan) startPlan(row.dataset.plan);
      openChapter(b.dataset.b, parseInt(b.dataset.c, 10));
    };
  });
}
