// INRI localStorage helpers
const STORAGE = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('inri-' + key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem('inri-' + key, JSON.stringify(value));
  }
};

function getBookmarks() { return STORAGE.get('bookmarks', []); }
function saveBookmarks(list) { STORAGE.set('bookmarks', list); }

function getNotes() { return STORAGE.get('verseNotes', {}); }
function saveNotes(obj) { STORAGE.set('verseNotes', obj); }

function getFontSize() { return STORAGE.get('fontSize', 'medium'); }
function setFontSize(size) {
  STORAGE.set('fontSize', size);
  document.documentElement.setAttribute('data-font', size);
}

function getStreak() {
  return STORAGE.get('streak', { count: 0, lastDate: null });
}
function updateStreak() {
  const today = localDateKey();
  let s = getStreak();
  if (s.lastDate === today) return s;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yesterday = localDateKey(y);
  if (s.lastDate === yesterday) s.count += 1;
  else s.count = 1;
  s.lastDate = today;
  STORAGE.set('streak', s);
  return s;
}

function getPlanProgress() { return STORAGE.get('planProgress', {}); }
function savePlanProgress(obj) { STORAGE.set('planProgress', obj); }

// Reading plans
const READING_PLANS = [
  {
    id: 'john7',
    title: 'Gospel of John (7 Days)',
    days: [
      { day: 1, ref: 'John 1', book: 'john', chapter: 1 },
      { day: 2, ref: 'John 3', book: 'john', chapter: 3 },
      { day: 3, ref: 'John 5', book: 'john', chapter: 5 },
      { day: 4, ref: 'John 10', book: 'john', chapter: 10 },
      { day: 5, ref: 'John 14', book: 'john', chapter: 14 },
      { day: 6, ref: 'John 15', book: 'john', chapter: 15 },
      { day: 7, ref: 'John 20', book: 'john', chapter: 20 }
    ]
  },
  {
    id: 'psalms30',
    title: 'Psalms of Comfort (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 23', book: 'psalms', chapter: 23 },
      { day: 2, ref: 'Psalm 27', book: 'psalms', chapter: 27 },
      { day: 3, ref: 'Psalm 34', book: 'psalms', chapter: 34 },
      { day: 4, ref: 'Psalm 46', book: 'psalms', chapter: 46 },
      { day: 5, ref: 'Psalm 91', book: 'psalms', chapter: 91 },
      { day: 6, ref: 'Psalm 121', book: 'psalms', chapter: 121 },
      { day: 7, ref: 'Psalm 139', book: 'psalms', chapter: 139 }
    ]
  },
  {
    id: 'ephesians',
    title: 'Ephesians (6 Days)',
    days: [
      { day: 1, ref: 'Ephesians 1', book: 'ephesians', chapter: 1 },
      { day: 2, ref: 'Ephesians 2', book: 'ephesians', chapter: 2 },
      { day: 3, ref: 'Ephesians 3', book: 'ephesians', chapter: 3 },
      { day: 4, ref: 'Ephesians 4', book: 'ephesians', chapter: 4 },
      { day: 5, ref: 'Ephesians 5', book: 'ephesians', chapter: 5 },
      { day: 6, ref: 'Ephesians 6', book: 'ephesians', chapter: 6 }
    ]
  },
  {
    id: 'proverbs7',
    title: 'Proverbs Wisdom (7 Days)',
    days: [
      { day: 1, ref: 'Proverbs 1', book: 'proverbs', chapter: 1 },
      { day: 2, ref: 'Proverbs 3', book: 'proverbs', chapter: 3 },
      { day: 3, ref: 'Proverbs 4', book: 'proverbs', chapter: 4 },
      { day: 4, ref: 'Proverbs 8', book: 'proverbs', chapter: 8 },
      { day: 5, ref: 'Proverbs 15', book: 'proverbs', chapter: 15 },
      { day: 6, ref: 'Proverbs 16', book: 'proverbs', chapter: 16 },
      { day: 7, ref: 'Proverbs 31', book: 'proverbs', chapter: 31 }
    ]
  },
  {
    id: 'romans8',
    title: 'Romans (8 Days)',
    days: [
      { day: 1, ref: 'Romans 1', book: 'romans', chapter: 1 },
      { day: 2, ref: 'Romans 3', book: 'romans', chapter: 3 },
      { day: 3, ref: 'Romans 5', book: 'romans', chapter: 5 },
      { day: 4, ref: 'Romans 6', book: 'romans', chapter: 6 },
      { day: 5, ref: 'Romans 8', book: 'romans', chapter: 8 },
      { day: 6, ref: 'Romans 10', book: 'romans', chapter: 10 },
      { day: 7, ref: 'Romans 12', book: 'romans', chapter: 12 },
      { day: 8, ref: 'Romans 15', book: 'romans', chapter: 15 }
    ]
  },
  {
    id: 'matthew7',
    title: 'Sermon on the Mount (7 Days)',
    days: [
      { day: 1, ref: 'Matthew 5:1-16', book: 'matthew', chapter: 5 },
      { day: 2, ref: 'Matthew 5:17-48', book: 'matthew', chapter: 5 },
      { day: 3, ref: 'Matthew 6:1-18', book: 'matthew', chapter: 6 },
      { day: 4, ref: 'Matthew 6:19-34', book: 'matthew', chapter: 6 },
      { day: 5, ref: 'Matthew 7:1-14', book: 'matthew', chapter: 7 },
      { day: 6, ref: 'Matthew 7:15-29', book: 'matthew', chapter: 7 },
      { day: 7, ref: 'Matthew 5-7 review', book: 'matthew', chapter: 5 }
    ]
  },
  {
    id: 'genesis7',
    title: 'Beginnings – Genesis (7 Days)',
    days: [
      { day: 1, ref: 'Genesis 1', book: 'genesis', chapter: 1 },
      { day: 2, ref: 'Genesis 2', book: 'genesis', chapter: 2 },
      { day: 3, ref: 'Genesis 3', book: 'genesis', chapter: 3 },
      { day: 4, ref: 'Genesis 6', book: 'genesis', chapter: 6 },
      { day: 5, ref: 'Genesis 12', book: 'genesis', chapter: 12 },
      { day: 6, ref: 'Genesis 22', book: 'genesis', chapter: 22 },
      { day: 7, ref: 'Genesis 50', book: 'genesis', chapter: 50 }
    ]
  },
  {
    id: 'luke7',
    title: 'Gospel of Luke (7 Days)',
    days: [
      { day: 1, ref: 'Luke 1', book: 'luke', chapter: 1 },
      { day: 2, ref: 'Luke 2', book: 'luke', chapter: 2 },
      { day: 3, ref: 'Luke 5', book: 'luke', chapter: 5 },
      { day: 4, ref: 'Luke 10', book: 'luke', chapter: 10 },
      { day: 5, ref: 'Luke 15', book: 'luke', chapter: 15 },
      { day: 6, ref: 'Luke 22', book: 'luke', chapter: 22 },
      { day: 7, ref: 'Luke 24', book: 'luke', chapter: 24 }
    ]
  },
  {
    id: 'james5',
    title: 'James – Faith in Action (5 Days)',
    days: [
      { day: 1, ref: 'James 1', book: 'james', chapter: 1 },
      { day: 2, ref: 'James 2', book: 'james', chapter: 2 },
      { day: 3, ref: 'James 3', book: 'james', chapter: 3 },
      { day: 4, ref: 'James 4', book: 'james', chapter: 4 },
      { day: 5, ref: 'James 5', book: 'james', chapter: 5 }
    ]
  },
  {
    id: 'philippians4',
    title: 'Philippians – Joy (4 Days)',
    days: [
      { day: 1, ref: 'Philippians 1', book: 'philippians', chapter: 1 },
      { day: 2, ref: 'Philippians 2', book: 'philippians', chapter: 2 },
      { day: 3, ref: 'Philippians 3', book: 'philippians', chapter: 3 },
      { day: 4, ref: 'Philippians 4', book: 'philippians', chapter: 4 }
    ]
  },
  {
    id: 'isaiah7',
    title: 'Isaiah Comfort (7 Days)',
    days: [
      { day: 1, ref: 'Isaiah 6', book: 'isaiah', chapter: 6 },
      { day: 2, ref: 'Isaiah 9', book: 'isaiah', chapter: 9 },
      { day: 3, ref: 'Isaiah 40', book: 'isaiah', chapter: 40 },
      { day: 4, ref: 'Isaiah 41', book: 'isaiah', chapter: 41 },
      { day: 5, ref: 'Isaiah 53', book: 'isaiah', chapter: 53 },
      { day: 6, ref: 'Isaiah 55', book: 'isaiah', chapter: 55 },
      { day: 7, ref: 'Isaiah 61', book: 'isaiah', chapter: 61 }
    ]
  },
  {
    id: '1john5',
    title: '1 John – Love & Assurance (5 Days)',
    days: [
      { day: 1, ref: '1 John 1', book: '1-john', chapter: 1 },
      { day: 2, ref: '1 John 2', book: '1-john', chapter: 2 },
      { day: 3, ref: '1 John 3', book: '1-john', chapter: 3 },
      { day: 4, ref: '1 John 4', book: '1-john', chapter: 4 },
      { day: 5, ref: '1 John 5', book: '1-john', chapter: 5 }
    ]
  },
  {
    id: 'acts7',
    title: 'Acts – Early Church (7 Days)',
    days: [
      { day: 1, ref: 'Acts 1', book: 'acts', chapter: 1 },
      { day: 2, ref: 'Acts 2', book: 'acts', chapter: 2 },
      { day: 3, ref: 'Acts 9', book: 'acts', chapter: 9 },
      { day: 4, ref: 'Acts 10', book: 'acts', chapter: 10 },
      { day: 5, ref: 'Acts 16', book: 'acts', chapter: 16 },
      { day: 6, ref: 'Acts 17', book: 'acts', chapter: 17 },
      { day: 7, ref: 'Acts 28', book: 'acts', chapter: 28 }
    ]
  },
  {
    id: 'psalms-praise',
    title: 'Psalms of Praise (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 8', book: 'psalms', chapter: 8 },
      { day: 2, ref: 'Psalm 19', book: 'psalms', chapter: 19 },
      { day: 3, ref: 'Psalm 29', book: 'psalms', chapter: 29 },
      { day: 4, ref: 'Psalm 96', book: 'psalms', chapter: 96 },
      { day: 5, ref: 'Psalm 100', book: 'psalms', chapter: 100 },
      { day: 6, ref: 'Psalm 103', book: 'psalms', chapter: 103 },
      { day: 7, ref: 'Psalm 150', book: 'psalms', chapter: 150 }
    ]
  },
  {
    id: 'psalms-thanks',
    title: 'Psalms of Thanksgiving (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 9', book: 'psalms', chapter: 9 },
      { day: 2, ref: 'Psalm 30', book: 'psalms', chapter: 30 },
      { day: 3, ref: 'Psalm 34', book: 'psalms', chapter: 34 },
      { day: 4, ref: 'Psalm 66', book: 'psalms', chapter: 66 },
      { day: 5, ref: 'Psalm 95', book: 'psalms', chapter: 95 },
      { day: 6, ref: 'Psalm 107', book: 'psalms', chapter: 107 },
      { day: 7, ref: 'Psalm 136', book: 'psalms', chapter: 136 }
    ]
  },
  {
    id: 'mark7',
    title: 'Gospel of Mark (7 Days)',
    days: [
      { day: 1, ref: 'Mark 1', book: 'mark', chapter: 1 },
      { day: 2, ref: 'Mark 2', book: 'mark', chapter: 2 },
      { day: 3, ref: 'Mark 4', book: 'mark', chapter: 4 },
      { day: 4, ref: 'Mark 5', book: 'mark', chapter: 5 },
      { day: 5, ref: 'Mark 8', book: 'mark', chapter: 8 },
      { day: 6, ref: 'Mark 10', book: 'mark', chapter: 10 },
      { day: 7, ref: 'Mark 16', book: 'mark', chapter: 16 }
    ]
  },
  {
    id: 'colossians4',
    title: 'Colossians (4 Days)',
    days: [
      { day: 1, ref: 'Colossians 1', book: 'colossians', chapter: 1 },
      { day: 2, ref: 'Colossians 2', book: 'colossians', chapter: 2 },
      { day: 3, ref: 'Colossians 3', book: 'colossians', chapter: 3 },
      { day: 4, ref: 'Colossians 4', book: 'colossians', chapter: 4 }
    ]
  },
  {
    id: 'hebrews7',
    title: 'Hebrews – Better Covenant (7 Days)',
    days: [
      { day: 1, ref: 'Hebrews 1', book: 'hebrews', chapter: 1 },
      { day: 2, ref: 'Hebrews 4', book: 'hebrews', chapter: 4 },
      { day: 3, ref: 'Hebrews 7', book: 'hebrews', chapter: 7 },
      { day: 4, ref: 'Hebrews 9', book: 'hebrews', chapter: 9 },
      { day: 5, ref: 'Hebrews 10', book: 'hebrews', chapter: 10 },
      { day: 6, ref: 'Hebrews 11', book: 'hebrews', chapter: 11 },
      { day: 7, ref: 'Hebrews 12', book: 'hebrews', chapter: 12 }
    ]
  },
  {
    id: 'revelation7',
    title: 'Revelation Highlights (7 Days)',
    days: [
      { day: 1, ref: 'Revelation 1', book: 'revelation', chapter: 1 },
      { day: 2, ref: 'Revelation 4', book: 'revelation', chapter: 4 },
      { day: 3, ref: 'Revelation 5', book: 'revelation', chapter: 5 },
      { day: 4, ref: 'Revelation 7', book: 'revelation', chapter: 7 },
      { day: 5, ref: 'Revelation 19', book: 'revelation', chapter: 19 },
      { day: 6, ref: 'Revelation 21', book: 'revelation', chapter: 21 },
      { day: 7, ref: 'Revelation 22', book: 'revelation', chapter: 22 }
    ]
  },
  {
    id: 'exodus7',
    title: 'Exodus – Deliverance (7 Days)',
    days: [
      { day: 1, ref: 'Exodus 3', book: 'exodus', chapter: 3 },
      { day: 2, ref: 'Exodus 12', book: 'exodus', chapter: 12 },
      { day: 3, ref: 'Exodus 14', book: 'exodus', chapter: 14 },
      { day: 4, ref: 'Exodus 16', book: 'exodus', chapter: 16 },
      { day: 5, ref: 'Exodus 20', book: 'exodus', chapter: 20 },
      { day: 6, ref: 'Exodus 33', book: 'exodus', chapter: 33 },
      { day: 7, ref: 'Exodus 34', book: 'exodus', chapter: 34 }
    ]
  },
  {
    id: '1peter5',
    title: '1 Peter – Hope in Suffering (5 Days)',
    days: [
      { day: 1, ref: '1 Peter 1', book: '1-peter', chapter: 1 },
      { day: 2, ref: '1 Peter 2', book: '1-peter', chapter: 2 },
      { day: 3, ref: '1 Peter 3', book: '1-peter', chapter: 3 },
      { day: 4, ref: '1 Peter 4', book: '1-peter', chapter: 4 },
      { day: 5, ref: '1 Peter 5', book: '1-peter', chapter: 5 }
    ]
  },
  {
    id: 'psalms-lament',
    title: 'Psalms of Lament (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 13', book: 'psalms', chapter: 13 },
      { day: 2, ref: 'Psalm 22', book: 'psalms', chapter: 22 },
      { day: 3, ref: 'Psalm 42', book: 'psalms', chapter: 42 },
      { day: 4, ref: 'Psalm 51', book: 'psalms', chapter: 51 },
      { day: 5, ref: 'Psalm 77', book: 'psalms', chapter: 77 },
      { day: 6, ref: 'Psalm 88', book: 'psalms', chapter: 88 },
      { day: 7, ref: 'Psalm 130', book: 'psalms', chapter: 130 }
    ]
  },
  {
    id: 'psalms-trust',
    title: 'Psalms of Trust (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 16', book: 'psalms', chapter: 16 },
      { day: 2, ref: 'Psalm 23', book: 'psalms', chapter: 23 },
      { day: 3, ref: 'Psalm 27', book: 'psalms', chapter: 27 },
      { day: 4, ref: 'Psalm 46', book: 'psalms', chapter: 46 },
      { day: 5, ref: 'Psalm 62', book: 'psalms', chapter: 62 },
      { day: 6, ref: 'Psalm 91', book: 'psalms', chapter: 91 },
      { day: 7, ref: 'Psalm 121', book: 'psalms', chapter: 121 }
    ]
  },
  {
    id: 'psalms-ascent',
    title: 'Psalms of Ascent (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 120', book: 'psalms', chapter: 120 },
      { day: 2, ref: 'Psalm 121', book: 'psalms', chapter: 121 },
      { day: 3, ref: 'Psalm 122', book: 'psalms', chapter: 122 },
      { day: 4, ref: 'Psalm 126', book: 'psalms', chapter: 126 },
      { day: 5, ref: 'Psalm 127', book: 'psalms', chapter: 127 },
      { day: 6, ref: 'Psalm 130', book: 'psalms', chapter: 130 },
      { day: 7, ref: 'Psalm 134', book: 'psalms', chapter: 134 }
    ]
  },
  {
    id: 'psalms-wisdom',
    title: 'Psalms of Wisdom (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 1', book: 'psalms', chapter: 1 },
      { day: 2, ref: 'Psalm 15', book: 'psalms', chapter: 15 },
      { day: 3, ref: 'Psalm 37', book: 'psalms', chapter: 37 },
      { day: 4, ref: 'Psalm 49', book: 'psalms', chapter: 49 },
      { day: 5, ref: 'Psalm 73', book: 'psalms', chapter: 73 },
      { day: 6, ref: 'Psalm 112', book: 'psalms', chapter: 112 },
      { day: 7, ref: 'Psalm 119 (selected)', book: 'psalms', chapter: 119 }
    ]
  },
  {
    id: 'psalms-messianic',
    title: 'Messianic Psalms (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 2', book: 'psalms', chapter: 2 },
      { day: 2, ref: 'Psalm 16', book: 'psalms', chapter: 16 },
      { day: 3, ref: 'Psalm 22', book: 'psalms', chapter: 22 },
      { day: 4, ref: 'Psalm 45', book: 'psalms', chapter: 45 },
      { day: 5, ref: 'Psalm 72', book: 'psalms', chapter: 72 },
      { day: 6, ref: 'Psalm 110', book: 'psalms', chapter: 110 },
      { day: 7, ref: 'Psalm 118', book: 'psalms', chapter: 118 }
    ]
  },
  {
    id: 'song-of-solomon',
    title: 'Song of Solomon (8 Days)',
    days: [
      { day: 1, ref: 'Song of Solomon 1', book: 'song-of-solomon', chapter: 1 },
      { day: 2, ref: 'Song of Solomon 2', book: 'song-of-solomon', chapter: 2 },
      { day: 3, ref: 'Song of Solomon 3', book: 'song-of-solomon', chapter: 3 },
      { day: 4, ref: 'Song of Solomon 4', book: 'song-of-solomon', chapter: 4 },
      { day: 5, ref: 'Song of Solomon 5', book: 'song-of-solomon', chapter: 5 },
      { day: 6, ref: 'Song of Solomon 6', book: 'song-of-solomon', chapter: 6 },
      { day: 7, ref: 'Song of Solomon 7', book: 'song-of-solomon', chapter: 7 },
      { day: 8, ref: 'Song of Solomon 8', book: 'song-of-solomon', chapter: 8 }
    ]
  },
  {
    id: 'ecclesiastes',
    title: 'Ecclesiastes – Under the Sun (6 Days)',
    days: [
      { day: 1, ref: 'Ecclesiastes 1', book: 'ecclesiastes', chapter: 1 },
      { day: 2, ref: 'Ecclesiastes 2', book: 'ecclesiastes', chapter: 2 },
      { day: 3, ref: 'Ecclesiastes 3', book: 'ecclesiastes', chapter: 3 },
      { day: 4, ref: 'Ecclesiastes 5', book: 'ecclesiastes', chapter: 5 },
      { day: 5, ref: 'Ecclesiastes 7', book: 'ecclesiastes', chapter: 7 },
      { day: 6, ref: 'Ecclesiastes 12', book: 'ecclesiastes', chapter: 12 }
    ]
  },
  {
    id: 'solomon-wisdom',
    title: 'Wisdom of Solomon Path (7 Days)',
    days: [
      { day: 1, ref: 'Proverbs 1', book: 'proverbs', chapter: 1 },
      { day: 2, ref: 'Proverbs 2', book: 'proverbs', chapter: 2 },
      { day: 3, ref: 'Proverbs 3', book: 'proverbs', chapter: 3 },
      { day: 4, ref: 'Proverbs 8', book: 'proverbs', chapter: 8 },
      { day: 5, ref: 'Proverbs 9', book: 'proverbs', chapter: 9 },
      { day: 6, ref: 'Ecclesiastes 3', book: 'ecclesiastes', chapter: 3 },
      { day: 7, ref: 'Song of Solomon 2', book: 'song-of-solomon', chapter: 2 }
    ]
  },
  {
    id: 'solomon-life',
    title: "Solomon's Life (1 Kings) (7 Days)",
    days: [
      { day: 1, ref: '1 Kings 1', book: '1-kings', chapter: 1 },
      { day: 2, ref: '1 Kings 2', book: '1-kings', chapter: 2 },
      { day: 3, ref: '1 Kings 3', book: '1-kings', chapter: 3 },
      { day: 4, ref: '1 Kings 4', book: '1-kings', chapter: 4 },
      { day: 5, ref: '1 Kings 8', book: '1-kings', chapter: 8 },
      { day: 6, ref: '1 Kings 10', book: '1-kings', chapter: 10 },
      { day: 7, ref: '1 Kings 11', book: '1-kings', chapter: 11 }
    ]
  },
  {
    id: 'solomon-temple',
    title: "Solomon's Temple (7 Days)",
    days: [
      { day: 1, ref: '1 Kings 5', book: '1-kings', chapter: 5 },
      { day: 2, ref: '1 Kings 6', book: '1-kings', chapter: 6 },
      { day: 3, ref: '1 Kings 7', book: '1-kings', chapter: 7 },
      { day: 4, ref: '1 Kings 8', book: '1-kings', chapter: 8 },
      { day: 5, ref: '2 Chronicles 5', book: '2-chronicles', chapter: 5 },
      { day: 6, ref: '2 Chronicles 6', book: '2-chronicles', chapter: 6 },
      { day: 7, ref: '2 Chronicles 7', book: '2-chronicles', chapter: 7 }
    ]
  },
  {
    id: 'proverbs-daily',
    title: 'Proverbs Daily Wisdom (7 Days)',
    days: [
      { day: 1, ref: 'Proverbs 10', book: 'proverbs', chapter: 10 },
      { day: 2, ref: 'Proverbs 11', book: 'proverbs', chapter: 11 },
      { day: 3, ref: 'Proverbs 12', book: 'proverbs', chapter: 12 },
      { day: 4, ref: 'Proverbs 13', book: 'proverbs', chapter: 13 },
      { day: 5, ref: 'Proverbs 14', book: 'proverbs', chapter: 14 },
      { day: 6, ref: 'Proverbs 15', book: 'proverbs', chapter: 15 },
      { day: 7, ref: 'Proverbs 16', book: 'proverbs', chapter: 16 }
    ]
  },
  {
    id: 'proverbs-31',
    title: 'Proverbs in 31 Days',
    days: [
      { day: 1, ref: 'Proverbs 1', book: 'proverbs', chapter: 1 },
      { day: 2, ref: 'Proverbs 2', book: 'proverbs', chapter: 2 },
      { day: 3, ref: 'Proverbs 3', book: 'proverbs', chapter: 3 },
      { day: 4, ref: 'Proverbs 4', book: 'proverbs', chapter: 4 },
      { day: 5, ref: 'Proverbs 5', book: 'proverbs', chapter: 5 },
      { day: 6, ref: 'Proverbs 6', book: 'proverbs', chapter: 6 },
      { day: 7, ref: 'Proverbs 7', book: 'proverbs', chapter: 7 },
      { day: 8, ref: 'Proverbs 8', book: 'proverbs', chapter: 8 },
      { day: 9, ref: 'Proverbs 9', book: 'proverbs', chapter: 9 },
      { day: 10, ref: 'Proverbs 10', book: 'proverbs', chapter: 10 },
      { day: 11, ref: 'Proverbs 11', book: 'proverbs', chapter: 11 },
      { day: 12, ref: 'Proverbs 12', book: 'proverbs', chapter: 12 },
      { day: 13, ref: 'Proverbs 13', book: 'proverbs', chapter: 13 },
      { day: 14, ref: 'Proverbs 14', book: 'proverbs', chapter: 14 },
      { day: 15, ref: 'Proverbs 15', book: 'proverbs', chapter: 15 },
      { day: 16, ref: 'Proverbs 16', book: 'proverbs', chapter: 16 },
      { day: 17, ref: 'Proverbs 17', book: 'proverbs', chapter: 17 },
      { day: 18, ref: 'Proverbs 18', book: 'proverbs', chapter: 18 },
      { day: 19, ref: 'Proverbs 19', book: 'proverbs', chapter: 19 },
      { day: 20, ref: 'Proverbs 20', book: 'proverbs', chapter: 20 },
      { day: 21, ref: 'Proverbs 21', book: 'proverbs', chapter: 21 },
      { day: 22, ref: 'Proverbs 22', book: 'proverbs', chapter: 22 },
      { day: 23, ref: 'Proverbs 23', book: 'proverbs', chapter: 23 },
      { day: 24, ref: 'Proverbs 24', book: 'proverbs', chapter: 24 },
      { day: 25, ref: 'Proverbs 25', book: 'proverbs', chapter: 25 },
      { day: 26, ref: 'Proverbs 26', book: 'proverbs', chapter: 26 },
      { day: 27, ref: 'Proverbs 27', book: 'proverbs', chapter: 27 },
      { day: 28, ref: 'Proverbs 28', book: 'proverbs', chapter: 28 },
      { day: 29, ref: 'Proverbs 29', book: 'proverbs', chapter: 29 },
      { day: 30, ref: 'Proverbs 30', book: 'proverbs', chapter: 30 },
      { day: 31, ref: 'Proverbs 31', book: 'proverbs', chapter: 31 }
    ]
  },
  {
    id: 'advent',
    title: 'Advent – Coming of Christ (7 Days)',
    days: [
      { day: 1, ref: 'Isaiah 7', book: 'isaiah', chapter: 7 },
      { day: 2, ref: 'Isaiah 9', book: 'isaiah', chapter: 9 },
      { day: 3, ref: 'Isaiah 11', book: 'isaiah', chapter: 11 },
      { day: 4, ref: 'Micah 5', book: 'micah', chapter: 5 },
      { day: 5, ref: 'Luke 1', book: 'luke', chapter: 1 },
      { day: 6, ref: 'Luke 2', book: 'luke', chapter: 2 },
      { day: 7, ref: 'Matthew 1', book: 'matthew', chapter: 1 }
    ]
  },
  {
    id: 'lent',
    title: 'Lent – 7 Days of Reflection',
    days: [
      { day: 1, ref: 'Joel 2', book: 'joel', chapter: 2 },
      { day: 2, ref: 'Psalm 51', book: 'psalms', chapter: 51 },
      { day: 3, ref: 'Isaiah 58', book: 'isaiah', chapter: 58 },
      { day: 4, ref: 'Matthew 4', book: 'matthew', chapter: 4 },
      { day: 5, ref: 'Matthew 6', book: 'matthew', chapter: 6 },
      { day: 6, ref: 'Romans 5', book: 'romans', chapter: 5 },
      { day: 7, ref: 'Philippians 2', book: 'philippians', chapter: 2 }
    ]
  },
  {
    id: 'thanksgiving',
    title: 'Thanksgiving (7 Days)',
    days: [
      { day: 1, ref: 'Psalm 100', book: 'psalms', chapter: 100 },
      { day: 2, ref: 'Psalm 103', book: 'psalms', chapter: 103 },
      { day: 3, ref: 'Psalm 136', book: 'psalms', chapter: 136 },
      { day: 4, ref: '1 Thessalonians 5', book: '1-thessalonians', chapter: 5 },
      { day: 5, ref: 'Colossians 3', book: 'colossians', chapter: 3 },
      { day: 6, ref: 'Ephesians 5', book: 'ephesians', chapter: 5 },
      { day: 7, ref: 'Luke 17', book: 'luke', chapter: 17 }
    ]
  },
  {
    id: 'holy-week',
    title: 'Holy Week – Cross & Resurrection (7 Days)',
    days: [
      { day: 1, ref: 'Matthew 21', book: 'matthew', chapter: 21 },
      { day: 2, ref: 'Matthew 26', book: 'matthew', chapter: 26 },
      { day: 3, ref: 'Matthew 27', book: 'matthew', chapter: 27 },
      { day: 4, ref: 'John 19', book: 'john', chapter: 19 },
      { day: 5, ref: 'Luke 23', book: 'luke', chapter: 23 },
      { day: 6, ref: 'Luke 24', book: 'luke', chapter: 24 },
      { day: 7, ref: 'John 20', book: 'john', chapter: 20 }
    ]
  }
];

function getTheme() { return STORAGE.get('theme', 'dark'); }
function setTheme(theme) {
  STORAGE.set('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}
function getBibleVersion() { return STORAGE.get('bibleVersion', 'kjv'); }
function setBibleVersion(v) { STORAGE.set('bibleVersion', v); }

// Prayer list
function getPrayers() { return STORAGE.get('prayers', []); }
function savePrayers(list) { STORAGE.set('prayers', list); }

// Bookmark collections: { name: [bookmarkIndex or {text,ref}] }
function getCollections() { return STORAGE.get('collections', {}); }
function saveCollections(obj) { STORAGE.set('collections', obj); }

// Offline chapter cache
function getChapterCache() { return STORAGE.get('chapterCache', {}); }
function cacheChapter(ver, book, chapter, data) {
  const key = ver + ':' + book + ':' + chapter;
  const cache = getChapterCache();
  cache[key] = { data, saved: Date.now() };
  // Keep last 40 chapters only
  const keys = Object.keys(cache);
  if (keys.length > 40) {
    keys.sort((a, b) => cache[a].saved - cache[b].saved);
    keys.slice(0, keys.length - 40).forEach(k => delete cache[k]);
  }
  STORAGE.set('chapterCache', cache);
}
function getCachedChapter(ver, book, chapter) {
  const cache = getChapterCache();
  return cache[ver + ':' + book + ':' + chapter] || null;
}

// Onboarding
function hasSeenOnboarding() { return STORAGE.get('onboarded', false); }
function setOnboarded() { STORAGE.set('onboarded', true); }

// Active plan for Continue
function getActivePlan() { return STORAGE.get('activePlan', null); }
function setActivePlan(id) { STORAGE.set('activePlan', id); }

// Topical verse lists (static)
// Special section: Gifts from God
const GIFTS_FROM_GOD = {
  title: "Gifts from God",
  intro: "Every good gift comes from the Father. Explore salvation, the Spirit, spiritual gifts, and daily mercies.",
  sections: [
    {
      name: "The Greatest Gift — Salvation",
      verses: [
        { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", ref: "John 3:16" },
        { text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", ref: "Ephesians 2:8" },
        { text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", ref: "Romans 6:23" },
        { text: "Thanks be unto God for his unspeakable gift.", ref: "2 Corinthians 9:15" }
      ]
    },
    {
      name: "The Holy Spirit",
      verses: [
        { text: "And I will pray the Father, and he shall give you another Comforter, that he may abide with you for ever.", ref: "John 14:16" },
        { text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.", ref: "Galatians 5:22-23" },
        { text: "If ye then, being evil, know how to give good gifts unto your children: how much more shall your heavenly Father give the Holy Spirit to them that ask him?", ref: "Luke 11:13" }
      ]
    },
    {
      name: "Spiritual Gifts",
      verses: [
        { text: "Now there are diversities of gifts, but the same Spirit.", ref: "1 Corinthians 12:4" },
        { text: "But the manifestation of the Spirit is given to every man to profit withal.", ref: "1 Corinthians 12:7" },
        { text: "As every man hath received the gift, even so minister the same one to another, as good stewards of the manifold grace of God.", ref: "1 Peter 4:10" },
        { text: "Having then gifts differing according to the grace that is given to us, whether prophecy, let us prophesy according to the proportion of faith.", ref: "Romans 12:6" },
        { text: "Wherefore I put thee in remembrance that thou stir up the gift of God, which is in thee.", ref: "2 Timothy 1:6" }
      ]
    },
    {
      name: "Wisdom & Every Good Gift",
      verses: [
        { text: "Every good gift and every perfect gift is from above, and cometh down from the Father of lights.", ref: "James 1:17" },
        { text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", ref: "James 1:5" },
        { text: "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.", ref: "Proverbs 2:6" },
        { text: "He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?", ref: "Romans 8:32" }
      ]
    },
    {
      name: "Peace, Rest & Daily Bread",
      verses: [
        { text: "Peace I leave with you, my peace I give unto you.", ref: "John 14:27" },
        { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" },
        { text: "Give us this day our daily bread.", ref: "Matthew 6:11" },
        { text: "My God shall supply all your need according to his riches in glory by Christ Jesus.", ref: "Philippians 4:19" }
      ]
    }
  ]
};

const TOPICAL_VERSES = {
  anxiety: [
    { text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", ref: "Philippians 4:6" },
    { text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.", ref: "John 14:27" },
    { text: "Casting all your care upon him; for he careth for you.", ref: "1 Peter 5:7" },
    { text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", ref: "Isaiah 26:3" }
  ],
  grief: [
    { text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", ref: "Psalm 34:18" },
    { text: "Blessed are they that mourn: for they shall be comforted.", ref: "Matthew 5:4" },
    { text: "And God shall wipe away all tears from their eyes.", ref: "Revelation 21:4" },
    { text: "Weeping may endure for a night, but joy cometh in the morning.", ref: "Psalm 30:5" }
  ],
  forgiveness: [
    { text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", ref: "1 John 1:9" },
    { text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.", ref: "Ephesians 4:32" },
    { text: "For if ye forgive men their trespasses, your heavenly Father will also forgive you.", ref: "Matthew 6:14" }
  ],
  strength: [
    { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
    { text: "But they that wait upon the LORD shall renew their strength.", ref: "Isaiah 40:31" },
    { text: "The LORD is my strength and my shield; my heart trusted in him, and I am helped.", ref: "Psalm 28:7" }
  ],
  love: [
    { text: "Charity suffereth long, and is kind; charity envieth not.", ref: "1 Corinthians 13:4" },
    { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
    { text: "Greater love hath no man than this, that a man lay down his life for his friends.", ref: "John 15:13" }
  ],
  guidance: [
    { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" },
    { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
    { text: "In all thy ways acknowledge him, and he shall direct thy paths.", ref: "Proverbs 3:6" }
  ],
  hope: [
    { text: "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.", ref: "Romans 15:13" },
    { text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", ref: "Jeremiah 29:11" },
    { text: "Why art thou cast down, O my soul? and why art thou disquieted in me? hope thou in God.", ref: "Psalm 42:5" },
    { text: "Which hope we have as an anchor of the soul, both sure and stedfast.", ref: "Hebrews 6:19" }
  ],
  faith: [
    { text: "Now faith is the substance of things hoped for, the evidence of things not seen.", ref: "Hebrews 11:1" },
    { text: "For we walk by faith, not by sight.", ref: "2 Corinthians 5:7" },
    { text: "Lord, I believe; help thou mine unbelief.", ref: "Mark 9:24" },
    { text: "So then faith cometh by hearing, and hearing by the word of God.", ref: "Romans 10:17" }
  ],
  courage: [
    { text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", ref: "Joshua 1:9" },
    { text: "The LORD is my light and my salvation; whom shall I fear?", ref: "Psalm 27:1" },
    { text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God.", ref: "Isaiah 41:10" },
    { text: "God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", ref: "2 Timothy 1:7" }
  ],
  wisdom: [
    { text: "The fear of the LORD is the beginning of wisdom.", ref: "Proverbs 9:10" },
    { text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally.", ref: "James 1:5" },
    { text: "Happy is the man that findeth wisdom, and the man that getteth understanding.", ref: "Proverbs 3:13" }
  ],
  marriage: [
    { text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.", ref: "Genesis 2:24" },
    { text: "Husbands, love your wives, even as Christ also loved the church, and gave himself for it.", ref: "Ephesians 5:25" },
    { text: "Two are better than one; because they have a good reward for their labour.", ref: "Ecclesiastes 4:9" },
    { text: "Charity suffereth long, and is kind.", ref: "1 Corinthians 13:4" }
  ],
  work: [
    { text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.", ref: "Colossians 3:23" },
    { text: "Commit thy works unto the LORD, and thy thoughts shall be established.", ref: "Proverbs 16:3" },
    { text: "In all labour there is profit.", ref: "Proverbs 14:23" }
  ],
  temptation: [
    { text: "There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able.", ref: "1 Corinthians 10:13" },
    { text: "Watch and pray, that ye enter not into temptation.", ref: "Matthew 26:41" },
    { text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you.", ref: "James 4:7" }
  ],
  joy: [
    { text: "The joy of the LORD is your strength.", ref: "Nehemiah 8:10" },
    { text: "Rejoice in the Lord always: and again I say, Rejoice.", ref: "Philippians 4:4" },
    { text: "Thou wilt shew me the path of life: in thy presence is fulness of joy.", ref: "Psalm 16:11" }
  ],
  provision: [
    { text: "But my God shall supply all your need according to his riches in glory by Christ Jesus.", ref: "Philippians 4:19" },
    { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" },
    { text: "Consider the lilies of the field, how they grow… Shall he not much more clothe you, O ye of little faith?", ref: "Matthew 6:28-30" }
  ],
  children: [
    { text: "Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God.", ref: "Mark 10:14" },
    { text: "Train up a child in the way he should go: and when he is old, he will not depart from it.", ref: "Proverbs 22:6" },
    { text: "Lo, children are an heritage of the LORD.", ref: "Psalm 127:3" }
  ],
  praise: [
    { text: "Let every thing that hath breath praise the LORD. Praise ye the LORD.", ref: "Psalm 150:6" },
    { text: "O give thanks unto the LORD; for he is good: for his mercy endureth for ever.", ref: "Psalm 136:1" },
    { text: "I will bless the LORD at all times: his praise shall continually be in my mouth.", ref: "Psalm 34:1" }
  ]
};

// Verse highlights: { "kjv:john:3:16": true, ... }
function getHighlights() { return STORAGE.get('highlights', {}); }
function toggleHighlight(key) {
  const h = getHighlights();
  if (h[key]) delete h[key]; else h[key] = true;
  STORAGE.set('highlights', h);
  return !!h[key];
}
function isHighlighted(key) { return !!getHighlights()[key]; }

// Custom plans stored alongside READING_PLANS usage
function getCustomPlans() { return STORAGE.get('customPlans', []); }
function saveCustomPlans(list) { STORAGE.set('customPlans', list); }

// Accessibility
function getA11y() { return STORAGE.get('a11y', { largeTap: false, reduceMotion: false }); }
function setA11y(obj) {
  STORAGE.set('a11y', obj);
  document.documentElement.setAttribute('data-large-tap', obj.largeTap ? '1' : '0');
  document.documentElement.setAttribute('data-reduce-motion', obj.reduceMotion ? '1' : '0');
}

// Hymns (public domain lyrics)
const HYMNS = [
  {
    title: "Amazing Grace",
    author: "John Newton",
    lyrics: "Amazing grace! how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.\n\n'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!\n\nThrough many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.\n\nWhen we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we first begun."
  },
  {
    title: "How Great Thou Art",
    author: "Carl Boberg / Stuart K. Hine (public domain in many regions)",
    lyrics: "O Lord my God, when I in awesome wonder\nConsider all the works Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.\n\nThen sings my soul, my Savior God, to Thee:\nHow great Thou art, how great Thou art!\nThen sings my soul, my Savior God, to Thee:\nHow great Thou art, how great Thou art!"
  },
  {
    title: "It Is Well with My Soul",
    author: "Horatio Spafford",
    lyrics: "When peace like a river attendeth my way,\nWhen sorrows like sea billows roll,\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.\n\nIt is well with my soul,\nIt is well, it is well with my soul.\n\nThough Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul."
  },
  {
    title: "Great Is Thy Faithfulness",
    author: "Thomas Chisholm",
    lyrics: "Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.\n\nGreat is Thy faithfulness!\nGreat is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided;\nGreat is Thy faithfulness, Lord, unto me!"
  },
  {
    title: "What a Friend We Have in Jesus",
    author: "Joseph Scriven",
    lyrics: "What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\n\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!"
  },
  {
    title: "Holy, Holy, Holy",
    author: "Reginald Heber",
    lyrics: "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!\n\nHoly, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert and art and evermore shalt be."
  }
];

// Brief study notes for selected references
const STUDY_NOTES = {
  "Romans 8:28": "Not that all things are good, but that God works all things together for good for those who love Him. The promise is relational and purposeful.",
  "John 3:16": "The heart of the gospel: God's love, the gift of the Son, faith, and eternal life. \"Whosoever\" opens the door to all who believe.",
  "Philippians 4:6-7": "Anxiety is met with prayer, petition, and thanksgiving. Peace is not the absence of trouble but the guard of God over heart and mind.",
  "Ephesians 2:8-9": "Salvation is gift, not wage. Faith receives what grace provides so that no one may boast.",
  "Psalm 23:1": "Shepherd imagery means provision, guidance, and protection. \"I shall not want\" is trust in the Shepherd's care.",
  "Joshua 1:9": "Courage is commanded because God's presence is promised. Strength is not self-generated but God-with-us.",
  "1 Corinthians 13:4": "Love is defined by actions over time—patience, kindness, freedom from envy—not by feeling alone.",
  "Matthew 6:33": "Kingdom-first living reorders anxiety about needs. The Father knows what we need.",
  "James 1:2-4": "Trials are not pointless; tested faith produces endurance and maturity.",
  "Isaiah 40:31": "Waiting on the Lord is active trust. Renewed strength is God's gift to the dependent."
};
