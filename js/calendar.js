// INRI — Church-year calendar
// Works out the liturgical season for any date and picks the day's content:
// feast days get a fitting entry; other days rotate through the ordinary set.
// Loaded after content.js / daily-depth.js; replaces getTodayContent().

// Local YYYY-MM-DD (toISOString() would give tomorrow's date on a US evening)
function localDateKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function dateOnly(y, m, d) { return new Date(y, m, d, 12); } // noon avoids DST edges
function addDays(date, n) { const r = new Date(date); r.setDate(r.getDate() + n); return r; }
function daysBetween(a, b) { return Math.round((dateOnly(b.getFullYear(), b.getMonth(), b.getDate()) - dateOnly(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000); }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

// Western Easter (Anonymous Gregorian algorithm)
function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return dateOnly(year, month, day);
}

// First Sunday of Advent: the Sunday from Nov 27 to Dec 3
function adventStart(year) {
  const nov27 = dateOnly(year, 10, 27);
  return addDays(nov27, (7 - nov27.getDay()) % 7);
}

// US Thanksgiving: fourth Thursday of November
function thanksgivingDate(year) {
  const nov1 = dateOnly(year, 10, 1);
  return addDays(nov1, ((4 - nov1.getDay() + 7) % 7) + 21);
}

const SEASON_INFO = {
  advent:    { name: 'Advent',         color: '#6b4fa0', note: 'A season of waiting and longing for the coming of Christ — remembering His first coming and looking for His return.' },
  christmas: { name: 'Christmastide',  color: '#e8d9a8', note: 'Twelve days celebrating the Word made flesh: God with us.' },
  epiphany:  { name: 'Epiphany',       color: '#e8d9a8', note: 'Christ revealed as the Light to all nations, remembering the wise men who followed the star.' },
  ordinary:  { name: 'Ordinary Time',  color: '#5f8a4f', note: 'The long green season of growing in Christ through ordinary days.' },
  lent:      { name: 'Lent',           color: '#6b4fa0', note: 'Forty days of repentance, prayer, and self-denial, following Jesus toward the cross.' },
  holyweek:  { name: 'Holy Week',      color: '#8e2b2b', note: 'The final week of Jesus’ earthly life — from the palms of Jerusalem to the cross and the tomb.' },
  easter:    { name: 'Eastertide',     color: '#e3c25a', note: 'Fifty days of resurrection joy. Christ is risen!' },
  pentecost: { name: 'Pentecost',      color: '#b23a2a', note: 'The Holy Spirit poured out on the church.' }
};

// Day numbers refer to DAILY_CONTENT order (1-based)
const RESERVED_DAYS = [41]; // Immanuel / Advent — only shown in its season

function getLiturgicalDay(date) {
  date = date || new Date();
  date = dateOnly(date.getFullYear(), date.getMonth(), date.getDate());
  const y = date.getFullYear();
  const easter = easterDate(y);
  const ashWed = addDays(easter, -46);
  const palm = addDays(easter, -7);
  const pentecost = addDays(easter, 49);
  const advent = adventStart(y);
  const christmas = dateOnly(y, 11, 25);
  const fromEaster = daysBetween(easter, date);

  let season = 'ordinary', label = '', feast = null, day = null;

  // Feasts first
  const feasts = [
    [dateOnly(y, 0, 1), 'New Year’s Day', 28],
    [dateOnly(y, 0, 6), 'The Epiphany', 20],
    [ashWed, 'Ash Wednesday', 46],
    [palm, 'Palm Sunday', 1],
    [addDays(easter, -3), 'Maundy Thursday', 26],
    [addDays(easter, -2), 'Good Friday', 42],
    [addDays(easter, -1), 'Holy Saturday', 29],
    [easter, 'Easter Sunday — He is risen!', 43],
    [addDays(easter, 1), 'Easter Monday', 51],
    [addDays(easter, 39), 'Ascension Day', 39],
    [pentecost, 'Pentecost Sunday', 52],
    [thanksgivingDate(y), 'Thanksgiving Day', 45],
    [advent, 'First Sunday of Advent — Hope', 18],
    [addDays(advent, 7), 'Second Sunday of Advent — Preparation', 33],
    [addDays(advent, 14), 'Third Sunday of Advent — Joy', 51],
    [addDays(advent, 21), 'Fourth Sunday of Advent — Peace', 38],
    [dateOnly(y, 11, 24), 'Christmas Eve', 41],
    [christmas, 'Christmas Day — Christ is born', 5]
  ];
  for (const f of feasts) {
    if (sameDay(f[0], date)) { feast = f[1]; day = f[2]; break; }
  }

  // Season
  const md = date.getMonth() * 100 + date.getDate();
  if (date >= advent && date < christmas) {
    season = 'advent';
    label = 'Advent · Week ' + (Math.floor(daysBetween(advent, date) / 7) + 1);
  } else if (md >= 1125 || md <= 5) {
    season = 'christmas';
    const start = md >= 1125 ? christmas : dateOnly(y - 1, 11, 25);
    label = 'Christmastide · Day ' + (daysBetween(start, date) + 1) + ' of 12';
  } else if (md === 6) {
    season = 'epiphany'; label = 'The Epiphany';
  } else if (date >= ashWed && date < palm) {
    season = 'lent';
    const firstSunday = addDays(ashWed, 4);
    label = date < firstSunday ? 'Lent · Ash Wednesday week' : 'Lent · Week ' + (Math.floor(daysBetween(firstSunday, date) / 7) + 1);
  } else if (date >= palm && date < easter) {
    season = 'holyweek'; label = 'Holy Week';
  } else if (fromEaster >= 0 && fromEaster < 49) {
    season = 'easter'; label = 'Eastertide · Week ' + (Math.floor(fromEaster / 7) + 1);
  } else if (fromEaster === 49) {
    season = 'pentecost'; label = 'Pentecost';
  } else {
    season = 'ordinary'; label = 'Ordinary Time';
  }

  const info = SEASON_INFO[season];
  return { season: season, name: info.name, color: info.color, note: info.note, label: label, feast: feast, day: day };
}

// Pick the content entry for a date
function getContentForDate(date) {
  date = date || new Date();
  const lit = getLiturgicalDay(date);
  if (lit.day && DAILY_CONTENT[lit.day - 1]) return DAILY_CONTENT[lit.day - 1];
  const ordinary = [];
  DAILY_CONTENT.forEach(function(_, i) { if (RESERVED_DAYS.indexOf(i + 1) === -1) ordinary.push(i); });
  // Days since a fixed epoch, so the rotation doesn't jump on Jan 1
  const n = daysBetween(dateOnly(2024, 0, 1), date);
  return DAILY_CONTENT[ordinary[((n % ordinary.length) + ordinary.length) % ordinary.length]];
}

// Replaces the version in content.js
function getTodayContent() {
  return getContentForDate(new Date());
}

function renderSeasonBanner() {
  const lit = getLiturgicalDay();
  return '<div class="season-banner" style="--season:' + lit.color + '">' +
    '<span class="season-dot"></span>' +
    '<div><div class="season-label">' + (lit.feast || lit.label) + '</div>' +
    '<div class="season-note">' + (lit.feast ? lit.label + ' — ' : '') + lit.note + '</div></div></div>';
}
