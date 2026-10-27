// INRI — "On location": where and when each day's verse happened.
// Hand-drawn, simplified coastlines (lon/lat) projected to SVG. Places are
// at real coordinates; some settings are traditional or debated (noted).

const GEO = {
  // ---------- Places ----------
  places: {
    jerusalem:   { name: 'Jerusalem',      ll: [35.23, 31.78] },
    bethlehem:   { name: 'Bethlehem',      ll: [35.20, 31.70] },
    bethany:     { name: 'Bethany',        ll: [35.26, 31.77] },
    gethsemane:  { name: 'Gethsemane',     ll: [35.24, 31.78] },
    capernaum:   { name: 'Capernaum',      ll: [35.575, 32.88] },
    perea:       { name: 'Perea (beyond Jordan)', ll: [35.68, 32.05] },
    gath:        { name: 'Gath',           ll: [34.85, 31.70] },
    samaria:     { name: 'Samaria',        ll: [35.19, 32.28] },
    moab:        { name: 'Plains of Moab', ll: [35.64, 31.84] },
    jericho:     { name: 'Jericho',        ll: [35.44, 31.87] },
    sinai:       { name: 'Mount Sinai (traditional)', ll: [33.97, 28.54] },
    rome:        { name: 'Rome',           ll: [12.49, 41.89] },
    philippi:    { name: 'Philippi',       ll: [24.29, 41.01] },
    ephesus:     { name: 'Ephesus',        ll: [27.34, 37.94] },
    corinth:     { name: 'Corinth',        ll: [22.88, 37.91] },
    thessalonica:{ name: 'Thessalonica',   ll: [22.94, 40.64] },
    colossae:    { name: 'Colossae',       ll: [29.26, 37.79] },
    galatia:     { name: 'Galatia',        ll: [32.6, 39.3] },
    macedonia:   { name: 'Macedonia',      ll: [22.6, 40.9] },
    patmos:      { name: 'Patmos',         ll: [26.55, 37.31] },
    babylon:     { name: 'Babylon',        ll: [44.42, 32.54] }
  },

  // ---------- Map frames ----------
  frames: {
    world:  { lon: [10, 48], lat: [24, 45], width: 600 },
    israel: { lon: [34.25, 36.3], lat: [31.0, 33.35], width: 360 }
  },

  // ---------- Water & land shapes (lon, lat) ----------
  // Seas are drawn over a land-coloured background.
  world: {
    seas: [
      // Mediterranean ("the Great Sea")
      [[10,44],[10.3,43.7],[10.5,42.9],[11.8,42.1],[12.3,41.75],[13.5,41.2],[14.25,40.83],[14.75,40.65],[15.5,40.0],[16.0,39.3],[15.65,38.25],[15.65,37.95],[16.1,37.95],[16.6,38.4],[17.1,38.9],[17.15,39.1],[16.6,39.6],[17.2,40.45],[18.0,40.1],[18.35,39.8],[18.5,40.15],[17.95,40.65],[16.85,41.13],[16.15,41.9],[14.7,42.1],[14.2,42.47],[13.5,43.6],[12.57,44.06],[12.3,45.3],[13.75,45.65],[13.6,45.0],[14.4,45.3],[15.2,44.1],[16.45,43.5],[18.1,42.65],[19.1,42.1],[19.45,41.3],[19.5,40.45],[20.0,39.7],[20.75,38.95],[21.1,38.4],[21.75,38.35],[22.9,38.05],[22.9,37.95],[21.7,38.2],[21.4,37.65],[21.65,37.25],[21.65,36.9],[21.7,36.8],[21.95,36.8],[22.1,37.03],[22.48,36.39],[22.55,36.75],[23.2,36.44],[23.05,36.7],[22.8,37.57],[23.2,37.3],[23.45,37.35],[23.15,37.63],[22.98,37.92],[23.62,37.94],[24.03,37.65],[24.1,38.2],[24.6,38.15],[24.1,38.62],[23.3,39.05],[23.2,39.3],[22.95,39.4],[22.6,40.0],[22.6,40.27],[22.94,40.62],[23.3,40.2],[23.7,39.95],[24.0,40.25],[24.4,40.15],[23.9,40.5],[24.4,40.94],[25.9,40.85],[26.2,40.6],[26.4,40.15],[26.15,39.95],[26.07,39.48],[26.9,39.6],[26.65,39.3],[26.95,38.95],[26.4,38.65],[27.0,38.5],[26.3,38.3],[26.6,38.1],[27.25,37.86],[27.25,37.53],[27.43,37.03],[28.0,36.98],[27.4,36.7],[28.27,36.85],[29.1,36.62],[29.64,36.2],[30.15,36.3],[30.55,36.6],[30.7,36.88],[32.0,36.54],[32.83,36.02],[33.93,36.37],[34.64,36.8],[34.9,36.8],[35.5,36.6],[36.17,36.6],[35.95,36.07],[35.78,35.52],[35.88,34.89],[35.83,34.43],[35.5,33.9],[35.37,33.56],[35.2,33.27],[35.07,32.92],[34.95,32.83],[34.89,32.5],[34.75,32.05],[34.55,31.67],[34.44,31.52],[34.24,31.29],[33.8,31.13],[33.0,31.15],[32.3,31.27],[31.83,31.52],[30.4,31.47],[29.9,31.2],[28.95,30.83],[27.24,31.35],[25.15,31.57],[23.95,32.08],[22.64,32.77],[21.9,32.9],[20.07,32.12],[20.1,30.8],[19.57,30.4],[16.6,31.2],[15.1,32.4],[13.18,32.9],[12.08,32.93],[10.9,33.8],[10.1,33.9],[10.76,34.74],[11.07,35.5],[10.83,35.77],[10.64,35.83],[10.6,36.4],[11.05,37.08],[10.3,36.82],[10,37.2]],
      // Black Sea (southern part)
      [[29.05,41.22],[29.6,41.18],[31.4,41.28],[33.0,41.9],[35.15,42.03],[36.33,41.29],[37.88,41.0],[39.72,41.0],[41.63,41.65],[41.67,42.15],[41.0,43.0],[39.73,43.6],[37.8,44.72],[37.3,45.1],[35.6,45.1],[35.4,45.03],[34.95,44.85],[34.4,44.67],[34.16,44.5],[33.75,44.39],[33.5,44.6],[33.35,45.1],[29.65,45.1],[29.0,44.6],[28.65,44.17],[28.58,43.82],[27.95,43.2],[27.47,42.5],[27.95,42.1],[28.1,41.63]],
      // Sea of Marmara
      [[26.67,40.41],[27.0,40.97],[27.5,40.98],[28.98,41.0],[29.4,40.75],[29.9,40.76],[29.1,40.4],[27.97,40.35],[27.3,40.4],[26.68,40.35]],
      // Red Sea, Gulf of Suez, Gulf of Aqaba
      [[32.55,29.97],[32.45,29.6],[33.08,28.36],[33.83,27.25],[33.95,26.73],[34.28,26.1],[34.9,25.07],[35.2,24.4],[35.5,23.9],[38.2,23.9],[38.06,24.09],[37.27,25.05],[36.45,26.24],[35.7,27.35],[35.2,28.1],[34.5,27.95],[34.75,28.6],[35.0,29.53],[34.95,29.55],[34.9,29.49],[34.67,28.97],[34.52,28.5],[34.33,27.91],[34.25,27.73],[33.6,28.24],[33.18,28.89],[32.7,29.6]]
    ],
    islands: [
      // Sicily
      [[15.55,38.27],[15.25,38.22],[14.0,38.04],[13.36,38.13],[12.5,38.02],[12.43,37.8],[12.6,37.65],[13.08,37.5],[13.93,37.1],[14.25,37.06],[15.1,36.7],[15.29,37.06],[15.1,37.5],[15.29,37.85]],
      // Crete
      [[23.55,35.5],[24.0,35.52],[24.47,35.37],[25.13,35.34],[25.72,35.19],[26.1,35.2],[26.3,35.28],[26.1,34.95],[25.73,35.0],[24.75,34.93],[24.0,35.2],[23.68,35.23],[23.52,35.3]],
      // Cyprus
      [[32.4,34.77],[32.3,35.05],[32.42,35.04],[32.9,35.2],[33.32,35.34],[34.58,35.69],[33.94,35.12],[33.63,34.92],[33.05,34.67],[32.5,34.69]],
      // Rhodes
      [[27.75,36.1],[28.22,36.45],[28.1,36.1],[27.75,35.9]],
      // Lesbos, Chios, Samos
      [[25.85,39.25],[26.4,39.38],[26.6,39.05],[26.1,39.08]],
      [[25.85,38.55],[26.15,38.55],[26.1,38.2],[25.95,38.25]],
      [[26.6,37.8],[27.05,37.72],[26.9,37.65],[26.6,37.7]]
    ],
    rivers: [
      // Nile (with delta branches)
      [[32.9,24.09],[32.87,24.98],[32.64,25.7],[32.73,26.16],[31.7,26.56],[31.18,27.18],[30.75,28.1],[31.1,29.07],[31.23,30.05],[30.42,31.45]],
      [[31.23,30.05],[31.82,31.45]],
      // Euphrates
      [[38.8,38.9],[38.3,38.2],[38.3,37.5],[37.98,37.03],[38.0,36.83],[39.0,35.95],[40.14,35.33],[40.89,34.55],[41.98,34.37],[42.37,34.13],[42.83,33.64],[43.3,33.42],[43.78,33.35],[44.42,32.54],[44.32,32.0],[45.29,31.31],[46.26,31.05],[47.43,31.0],[47.8,30.5],[48.0,30.3]],
      // Tigris
      [[39.4,38.5],[40.23,37.91],[42.2,37.33],[43.13,36.34],[43.33,36.1],[43.68,34.6],[43.87,34.2],[44.38,33.32],[45.82,32.5],[47.15,31.84],[47.43,31.0]]
    ],
    labels: [
      ['THE GREAT SEA', [19.5, 34.4]], ['EGYPT', [30.2, 27.3]], ['ARABIA', [40.5, 27.5]], ['ASIA', [30.5, 38.6]],
      ['MESOPOTAMIA', [41.6, 35.3]], ['SYRIA', [37.6, 34.4]], ['MACEDONIA', [21.2, 42.25]], ['ACHAIA', [21.7, 37.3]],
      ['ITALIA', [15.9, 40.95]], ['BLACK SEA', [34.5, 43.3]]
    ]
  },

  israel: {
    seas: [
      // Mediterranean coast
      [[34.2,33.5],[35.35,33.5],[35.2,33.27],[35.1,33.08],[35.07,32.92],[34.99,32.82],[34.95,32.83],[34.93,32.69],[34.91,32.61],[34.89,32.5],[34.85,32.33],[34.75,32.05],[34.63,31.8],[34.55,31.67],[34.44,31.52],[34.24,31.29],[34.2,31.25]],
      // Sea of Galilee
      [[35.59,32.89],[35.63,32.86],[35.65,32.80],[35.63,32.73],[35.58,32.70],[35.55,32.73],[35.53,32.79],[35.55,32.86]],
      // Dead Sea
      [[35.48,31.77],[35.57,31.74],[35.59,31.55],[35.58,31.3],[35.55,31.1],[35.45,31.05],[35.39,31.15],[35.42,31.4],[35.44,31.6]]
    ],
    islands: [],
    rivers: [
      // Jordan River
      [[35.64,33.25],[35.62,33.05],[35.61,32.89]],
      [[35.57,32.71],[35.58,32.55],[35.55,32.4],[35.53,32.2],[35.54,32.0],[35.55,31.85],[35.56,31.77]]
    ],
    labels: [
      ['GALILEE', [35.33, 32.95]], ['SAMARIA', [35.2, 32.42]], ['JUDEA', [35.05, 31.45]], ['PEREA', [35.9, 32.25]],
      ['Great Sea', [34.45, 32.6]], ['Dead Sea', [35.72, 31.4]], ['Jordan', [35.41, 32.2]]
    ]
  }
};

// Timeline eras (approximate; early dates are debated)
const ERAS = [
  { id: 'beginnings', name: 'Beginnings', span: 'Genesis 1–11' },
  { id: 'patriarchs', name: 'Patriarchs', span: 'c. 2000–1700 BC' },
  { id: 'exodus',     name: 'Exodus',     span: 'date debated' },
  { id: 'judges',     name: 'Conquest & Judges', span: 'before c. 1050 BC' },
  { id: 'kings',      name: 'Kings & Prophets', span: 'c. 1050–586 BC' },
  { id: 'exile',      name: 'Exile & Return',   span: '586–c. 430 BC' },
  { id: 'jesus',      name: 'Life of Jesus',    span: 'c. 5 BC–AD 30/33' },
  { id: 'church',     name: 'Early Church',     span: 'c. AD 30–100' }
];

// Per day: places (with roles), era, and a one-line "when"
// role: 'setting' | 'from' | 'to'
const DAY_LOCATIONS = {
  1:  { era: 'kings',  when: 'Sung at the temple during Passover; date of writing unknown', places: [['jerusalem','setting']] },
  2:  { era: 'kings',  when: 'Attributed to David, c. 1000 BC — a shepherd from Bethlehem', places: [['bethlehem','setting']] },
  3:  { era: 'church', when: 'Written c. AD 60–62 while Paul was in chains, probably in Rome', places: [['rome','from'],['philippi','to']] },
  4:  { era: 'kings',  when: 'A song of the sons of Korah, temple musicians; date unknown', places: [['jerusalem','setting']] },
  5:  { era: 'jesus',  when: 'Jesus speaks with Nicodemus in Jerusalem at Passover time', places: [['jerusalem','setting']] },
  6:  { era: 'kings',  when: 'Wisdom from Solomon’s court, c. 950 BC (collected later)', places: [['jerusalem','setting']] },
  7:  { era: 'jesus',  when: 'During Jesus’ ministry in Galilee', places: [['capernaum','setting']] },
  8:  { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  9:  { era: 'beginnings', when: 'The beginning — the first marriage in Eden', places: [] },
  10: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  11: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  12: { era: 'church', when: 'Written c. AD 53–55 from Ephesus (1 Corinthians 16:8)', places: [['ephesus','from'],['corinth','to']] },
  13: { era: 'kings',  when: 'Northern kingdom of Israel, c. 750–725 BC, before Samaria fell', places: [['samaria','setting']] },
  14: { era: 'church', when: 'Probably before AD 70; destination uncertain — “they of Italy salute you” (13:24)', places: [['rome','to','Possibly connected with ']] },
  15: { era: 'church', when: 'Written c. AD 50–51 from Corinth — likely Paul’s earliest letter', places: [['corinth','from'],['thessalonica','to']] },
  16: { era: 'church', when: 'Written c. AD 60–62 while Paul was in chains, probably in Rome', places: [['rome','from'],['philippi','to']] },
  17: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['colossae','to']] },
  18: { era: 'church', when: 'Written c. AD 57 from Corinth, before Paul had visited Rome', places: [['corinth','from'],['rome','to']] },
  19: { era: 'church', when: 'Late first century; tradition links John’s last years to Ephesus', places: [['ephesus','setting']] },
  20: { era: 'exile',  when: 'Date unknown; many place it after the exile', places: [['jerusalem','setting']] },
  21: { era: 'jesus',  when: 'The night before the crucifixion, in Jerusalem', places: [['jerusalem','setting']] },
  22: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  23: { era: 'church', when: 'James, leader of the Jerusalem church, c. AD 45–62', places: [['jerusalem','from']] },
  24: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  25: { era: 'church', when: 'Late first century; tradition links John’s last years to Ephesus', places: [['ephesus','setting']] },
  26: { era: 'jesus',  when: 'The Garden of Gethsemane on the Mount of Olives, the night of the arrest', places: [['gethsemane','setting']] },
  27: { era: 'church', when: 'Written c. AD 48–55 (date and exact audience debated)', places: [['galatia','to']] },
  28: { era: 'exodus', when: 'At Mount Sinai after the golden calf (location and date debated)', places: [['sinai','setting']] },
  29: { era: 'kings',  when: 'David on the run from Saul, c. 1010 BC (1 Samuel 21)', places: [['gath','setting']] },
  30: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  31: { era: 'church', when: 'Written c. AD 60–62 while Paul was in chains, probably in Rome', places: [['rome','from'],['philippi','to']] },
  32: { era: 'church', when: 'Written c. AD 57 from Corinth, before Paul had visited Rome', places: [['corinth','from'],['rome','to']] },
  33: { era: 'exile',  when: 'Comfort for God’s people facing exile in Babylon', places: [['jerusalem','from','Prophet in '],['babylon','to','For the exiles in ']] },
  34: { era: 'kings',  when: 'Author and date unknown', places: [['jerusalem','setting']] },
  35: { era: 'judges', when: 'Israel camped on the plains of Moab, about to cross the Jordan', places: [['moab','from','Camped on the '],['jericho','to','Ahead: ']] },
  36: { era: 'jesus',  when: 'The Sermon on the Mount, in the hills of Galilee', places: [['capernaum','setting']] },
  37: { era: 'church', when: 'Written c. AD 55–56 from Macedonia (2 Corinthians 7:5)', places: [['macedonia','from'],['corinth','to']] },
  38: { era: 'jesus',  when: 'The upper room, the night before the crucifixion', places: [['jerusalem','setting']] },
  39: { era: 'church', when: 'Probably before AD 70; destination uncertain', places: [['rome','to','Possibly connected with ']] },
  40: { era: 'church', when: 'John exiled on Patmos, traditionally c. AD 95', places: [['patmos','from','Exiled on '],['ephesus','to','First of the seven churches: ']] },
  41: { era: 'kings',  when: 'Isaiah speaks to King Ahaz, c. 735 BC', places: [['jerusalem','setting']] },
  42: { era: 'church', when: 'Written c. AD 57 from Corinth, before Paul had visited Rome', places: [['corinth','from'],['rome','to']] },
  43: { era: 'jesus',  when: 'Bethany, near Jerusalem, weeks before the final Passover', places: [['bethany','setting']] },
  44: { era: 'jesus',  when: 'Judea beyond the Jordan, on the way to Jerusalem (Mark 10:1)', places: [['perea','setting']] },
  45: { era: 'kings',  when: 'A temple song of praise; date unknown', places: [['jerusalem','setting']] },
  46: { era: 'church', when: 'James, leader of the Jerusalem church, c. AD 45–62', places: [['jerusalem','from']] },
  47: { era: 'church', when: 'Written c. AD 60–62 from prison, probably in Rome', places: [['rome','from'],['ephesus','to']] },
  48: { era: 'kings',  when: 'Wisdom from Solomon’s court, c. 950 BC (collected later)', places: [['jerusalem','setting']] },
  49: { era: 'kings',  when: 'Attributed to David, c. 1000 BC — a shepherd from Bethlehem', places: [['bethlehem','setting']] },
  50: { era: 'jesus',  when: 'During Jesus’ ministry in Galilee', places: [['capernaum','setting']] },
  51: { era: 'kings',  when: 'Sung at the temple during Passover; date of writing unknown', places: [['jerusalem','setting']] },
  52: { era: 'church', when: 'Written c. AD 48–55 (date and exact audience debated)', places: [['galatia','to']] },
  53: { era: 'church', when: 'James, leader of the Jerusalem church, c. AD 45–62', places: [['jerusalem','from']] }
};

function dayNumberOf(entry) {
  const i = DAILY_CONTENT.indexOf(entry);
  return i === -1 ? null : i + 1;
}

// ---------- Projection ----------
function makeProjector(frame) {
  const midLat = (frame.lat[0] + frame.lat[1]) / 2;
  const kx = Math.cos(midLat * Math.PI / 180);
  const spanX = (frame.lon[1] - frame.lon[0]) * kx;
  const scale = frame.width / spanX;
  const height = (frame.lat[1] - frame.lat[0]) * scale;
  return {
    width: frame.width, height: Math.round(height),
    p: function(ll) { return [((ll[0] - frame.lon[0]) * kx * scale), ((frame.lat[1] - ll[1]) * scale)]; }
  };
}

function polyPath(proj, pts, closed) {
  return pts.map(function(ll, i) { const xy = proj.p(ll); return (i ? 'L' : 'M') + xy[0].toFixed(1) + ' ' + xy[1].toFixed(1); }).join('') + (closed ? 'Z' : '');
}

let mapUid = 0;
function renderMapSVG(dayLoc) {
  const uid = 'm' + (++mapUid);
  const ids = dayLoc.places.map(function(p) { return p[0]; });
  const inIsrael = ids.length && ids.every(function(id) {
    const ll = GEO.places[id].ll, f = GEO.frames.israel;
    return ll[0] >= f.lon[0] && ll[0] <= f.lon[1] && ll[1] >= f.lat[0] && ll[1] <= f.lat[1];
  });
  const key = inIsrael ? 'israel' : 'world';
  const shapes = GEO[key];
  const proj = makeProjector(GEO.frames[key]);
  const W = proj.width, H = proj.height;
  let svg = '<svg class="geo-map" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Map showing ' + ids.map(function(id) { return GEO.places[id].name; }).join(', ') + '">';
  svg += '<defs><clipPath id="clip-' + uid + '"><rect width="' + W + '" height="' + H + '" rx="10"/></clipPath>' +
    '<marker id="arrow-' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="geo-arrowhead"/></marker></defs>';
  svg += '<g clip-path="url(#clip-' + uid + ')"><rect class="geo-land" width="' + W + '" height="' + H + '"/>';
  shapes.seas.forEach(function(s) { svg += '<path class="geo-sea" d="' + polyPath(proj, s, true) + '"/>'; });
  shapes.islands.forEach(function(s) { svg += '<path class="geo-island" d="' + polyPath(proj, s, true) + '"/>'; });
  shapes.rivers.forEach(function(s) { svg += '<path class="geo-river" d="' + polyPath(proj, s, false) + '"/>'; });
  shapes.labels.forEach(function(l) {
    const xy = proj.p(l[1]);
    svg += '<text class="geo-region' + (key === 'israel' ? ' small' : '') + '" x="' + xy[0].toFixed(1) + '" y="' + xy[1].toFixed(1) + '">' + l[0] + '</text>';
  });

  // Letter route: from -> to
  const from = dayLoc.places.find(function(p) { return p[1] === 'from'; });
  const to = dayLoc.places.find(function(p) { return p[1] === 'to'; });
  if (from && to) {
    const a = proj.p(GEO.places[from[0]].ll), b = proj.p(GEO.places[to[0]].ll);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.min(60, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.25);
    svg += '<path class="geo-route" marker-end="url(#arrow-' + uid + ')" d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '"/>';
  }

  // Faint reference towns for orientation
  const context = key === 'israel'
    ? { Jerusalem: [35.23, 31.78], Nazareth: [35.30, 32.70], Capernaum: [35.575, 32.88], Jericho: [35.44, 31.87], Joppa: [34.75, 32.05], Caesarea: [34.89, 32.5] }
    : { Jerusalem: [35.23, 31.78], Rome: [12.49, 41.89], Athens: [23.73, 37.98], Alexandria: [29.9, 31.2], Antioch: [36.16, 36.2], Damascus: [36.29, 33.51], Babylon: [44.42, 32.54] };
  const chosen = dayLoc.places.map(function(p) { return proj.p(GEO.places[p[0]].ll); });
  Object.keys(context).forEach(function(name) {
    const xy = proj.p(context[name]);
    if (chosen.some(function(c) { return Math.hypot(c[0] - xy[0], c[1] - xy[1]) < 40; })) return;
    svg += '<circle class="geo-ctx-dot" cx="' + xy[0].toFixed(1) + '" cy="' + xy[1].toFixed(1) + '" r="2.2"/>' +
      '<text class="geo-ctx" x="' + (xy[0] + 5).toFixed(1) + '" y="' + (xy[1] + 3).toFixed(1) + '">' + name + '</text>';
  });

  dayLoc.places.forEach(function(p, i) {
    const pl = GEO.places[p[0]];
    const xy = proj.p(pl.ll);
    // Label to the left if near the right edge, or if another chosen place sits just to the east
    const crowdedEast = chosen.some(function(c, j) { return j !== i && c[0] > xy[0] && c[0] - xy[0] < 110 && Math.abs(c[1] - xy[1]) < 18; });
    const right = xy[0] < W * 0.72 && !crowdedEast;
    svg += '<circle class="geo-pulse" cx="' + xy[0].toFixed(1) + '" cy="' + xy[1].toFixed(1) + '" r="5"/>';
    svg += '<circle class="geo-dot" cx="' + xy[0].toFixed(1) + '" cy="' + xy[1].toFixed(1) + '" r="4.5"/>';
    svg += '<text class="geo-place" x="' + (xy[0] + (right ? 9 : -9)).toFixed(1) + '" y="' + (xy[1] + 4).toFixed(1) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + pl.name.replace(/ \(.*\)/, '') + '</text>';
  });
  svg += '<rect class="geo-frame" x="0.5" y="0.5" width="' + (W - 1) + '" height="' + (H - 1) + '" rx="10"/></g></svg>';
  return svg;
}

function renderTimeline(eraId) {
  return '<div class="era-strip" role="list">' + ERAS.map(function(e) {
    return '<div class="era' + (e.id === eraId ? ' active' : '') + '" role="listitem" title="' + e.name + ' · ' + e.span + '"><span class="era-name">' + e.name + '</span></div>';
  }).join('') + '</div>' +
  (function() { const e = ERAS.find(function(x) { return x.id === eraId; }); return e ? '<div class="era-caption">' + e.name + ' · ' + e.span + '</div>' : ''; })();
}

function renderLocationCard(data, withHeading) {
  const n = dayNumberOf(data);
  const loc = n && DAY_LOCATIONS[n];
  if (!loc) return '';
  let html = withHeading === false ? '' : '<div class="card location-card"><h2>On Location</h2>';
  html += '<p class="reflection loc-when">' + loc.when + '</p>';
  if (loc.places.length) {
    html += '<div class="map-wrap">' + renderMapSVG(loc) + '</div>';
    const roles = { setting: '', from: 'Written from ', to: 'Written to ' };
    if (loc.places.length > 1 || loc.places[0][1] !== 'setting') {
      html += '<p class="loc-legend">' + loc.places.map(function(p) {
        const r = p[2] || (p[1] === 'to' && loc.places.length === 1 ? 'Sent to ' : roles[p[1]]);
        return (r || '') + '<strong>' + GEO.places[p[0]].name + '</strong>';
      }).join(' · ') + '</p>';
    }
  }
  html += renderTimeline(loc.era);
  html += '<p class="loc-note">Simplified map; some locations and dates are traditional or debated.</p>';
  if (withHeading !== false) html += '</div>';
  return html;
}
