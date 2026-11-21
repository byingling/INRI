// INRI — Daily reminder (no server needed)
// 1) Google Calendar: a daily recurring event that rings on the phone and watch.
// 2) Calendar file (.ics) for iPhone/Outlook, with an alarm at the event time.
// 3) App notification (Android, installed app): Chrome wakes INRI's service worker
//    about once a day and it shows a reminder after your chosen time. Chrome decides
//    exactly when, so it's approximate — the calendar options are exact.

const APP_URL = 'https://byingling.github.io/INRI/';

function getReminder() { return STORAGE.get('reminder', { time: '06:30', notify: false }); }
function saveReminder(r) { STORAGE.set('reminder', r); syncReminderToWorker(r); }

// The service worker can't read localStorage, so mirror the setting into Cache Storage
function syncReminderToWorker(r) {
  if (!window.caches) return Promise.resolve();
  return caches.open('inri-settings').then(function(c) {
    return c.put('reminder.json', new Response(JSON.stringify(r), { headers: { 'Content-Type': 'application/json' } }));
  }).catch(function() {});
}

function nextOccurrence(time) {
  const p = time.split(':').map(Number);
  const d = new Date(); d.setHours(p[0], p[1], 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 1);
  return d;
}
function pad(n) { return String(n).padStart(2, '0'); }
function stamp(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00'; }

const REMINDER_TEXT = 'Time with God: open INRI for your Daily Walk — stillness, the verse of the day, reflection and prayer. ' + APP_URL;

function googleCalendarURL(time) {
  const start = nextOccurrence(time), end = new Date(start.getTime() + 15 * 60000);
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'America/Chicago';
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent('INRI — Daily Walk ✝') +
    '&details=' + encodeURIComponent(REMINDER_TEXT) +
    '&dates=' + stamp(start) + '/' + stamp(end) +
    '&ctz=' + encodeURIComponent(tz) +
    '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY');
}

function downloadICS(time) {
  const start = nextOccurrence(time), end = new Date(start.getTime() + 15 * 60000);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//INRI//Daily Walk//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:inri-daily-walk-' + Date.now() + '@byingling.github.io',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
    'DTSTART:' + stamp(start), 'DTEND:' + stamp(end), 'RRULE:FREQ=DAILY',
    'SUMMARY:INRI — Daily Walk', 'DESCRIPTION:' + REMINDER_TEXT.replace(/,/g, '\\,'), 'URL:' + APP_URL,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Time for your Daily Walk', 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'INRI-Daily-Walk.ics';
  document.body.appendChild(a); a.click(); a.remove();
}

async function enableAppNotifications(on) {
  const r = getReminder();
  if (!on) { r.notify = false; saveReminder(r); unregisterPeriodic(); return 'off'; }
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'unsupported';
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return 'denied';
  r.notify = true; saveReminder(r);
  const reg = await navigator.serviceWorker.ready;
  if ('periodicSync' in reg) {
    try {
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
      if (status.state === 'granted') {
        await reg.periodicSync.register('inri-daily-reminder', { minInterval: 12 * 60 * 60 * 1000 });
        return 'scheduled';
      }
    } catch (e) {}
    return 'needs-install';
  }
  return 'no-periodic';
}

async function unregisterPeriodic() {
  try {
    const reg = await navigator.serviceWorker.ready;
    if ('periodicSync' in reg) await reg.periodicSync.unregister('inri-daily-reminder');
  } catch (e) {}
}

async function testNotification() {
  if (!('Notification' in window)) { showToast('Notifications aren’t supported here'); return; }
  if (Notification.permission !== 'granted' && await Notification.requestPermission() !== 'granted') { showToast('Notifications are blocked for INRI'); return; }
  const reg = await navigator.serviceWorker.ready;
  reg.showNotification('INRI — Daily Walk', {
    body: '“' + getTodayContent().verse.slice(0, 110) + (getTodayContent().verse.length > 110 ? '…' : '') + '” Tap to begin.',
    icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'inri-daily', data: { url: './?walk=1' }
  });
}

const NOTIFY_STATUS = {
  scheduled: 'On. Chrome will remind you once a day after your chosen time. Chrome picks the exact moment, so it may come a little later.',
  'needs-install': 'Notifications are allowed, but Chrome only sends daily background reminders once INRI is installed to your home screen (Chrome menu ⋮ → Install app). Use Google Calendar for an exact-time reminder.',
  'no-periodic': 'Notifications are allowed, but this browser can’t wake INRI in the background. Use Google Calendar or the calendar file for a daily reminder.',
  denied: 'Notifications are blocked for this site. You can allow them in your browser’s site settings.',
  unsupported: 'This browser doesn’t support notifications. Use the calendar options above.',
  off: 'Off.'
};

function renderReminderSettings() {
  const slot = document.getElementById('reminder-settings');
  if (!slot) return;
  const r = getReminder();
  slot.innerHTML =
    '<div class="card"><h2>Daily Reminder</h2>' +
    '<p class="reflection">Choose a time, then add the reminder. Google Calendar is the most reliable on Android — it rings at that exact time on your phone and shows on your watch.</p>' +
    '<label class="rem-time">Remind me at <input type="time" id="rem-time" value="' + r.time + '"></label>' +
    '<div class="btn-group"><button class="btn" id="rem-gcal">Add to Google Calendar</button><button class="btn btn-outline" id="rem-ics">Calendar file (.ics)</button></div>' +
    '<p class="loc-note">In Google Calendar, set the event’s notification to “At time of event”. The .ics file works best on iPhone and Outlook.</p>' +
    '<div class="insp-label" style="margin-top:16px">App notification (Android)</div>' +
    '<label class="rem-toggle"><input type="checkbox" id="rem-notify"' + (r.notify ? ' checked' : '') + '> Remind me with an INRI notification</label>' +
    '<p class="reflection rem-status" id="rem-status">' + (r.notify ? 'On.' : 'Off.') + '</p>' +
    '<div class="btn-group"><button class="btn btn-outline btn-sm" id="rem-test">Send a test notification</button></div></div>' +
    '<div class="card"><h2>Offline Bible</h2><p class="reflection" id="kjv-status">' + (KJV.ready() ? '✓ The full KJV is saved on this device for offline reading and search.' : 'Save the full King James Bible on this device (about 1 MB download) so search and reading work without a signal.') + '</p>' +
    (KJV.ready() ? '' : '<div class="btn-group"><button class="btn btn-outline" id="kjv-download">Download KJV</button></div>') + '</div>';

  const timeEl = document.getElementById('rem-time');
  timeEl.onchange = function() { const x = getReminder(); x.time = timeEl.value || '06:30'; saveReminder(x); showToast('Reminder time saved'); };
  document.getElementById('rem-gcal').onclick = function() { window.open(googleCalendarURL(timeEl.value || '06:30'), '_blank', 'noopener'); };
  document.getElementById('rem-ics').onclick = function() { downloadICS(timeEl.value || '06:30'); };
  const notify = document.getElementById('rem-notify');
  notify.onchange = async function() {
    const st = await enableAppNotifications(notify.checked);
    if (st === 'denied' || st === 'unsupported') notify.checked = false;
    document.getElementById('rem-status').textContent = NOTIFY_STATUS[st] || '';
  };
  document.getElementById('rem-test').onclick = testNotification;
  if (r.notify) enableAppNotifications(true).then(function(st) { const el = document.getElementById('rem-status'); if (el) el.textContent = NOTIFY_STATUS[st] || ''; });
  const dl = document.getElementById('kjv-download');
  if (dl) dl.onclick = function() {
    dl.disabled = true; dl.textContent = 'Downloading…';
    KJV.load().then(function() { renderReminderSettings(); showToast('KJV saved for offline'); }, function() { dl.disabled = false; dl.textContent = 'Try again'; showToast('Download failed — check your connection'); });
  };
  if (!KJV.ready()) KJV.load({ cacheOnly: true }).then(function(d) { if (d && document.getElementById('kjv-download')) renderReminderSettings(); });
}

// Opened from a reminder notification (?walk=1): go straight into the Daily Walk
(function() {
  syncReminderToWorker(getReminder());
  if (/[?&]walk=1/.test(location.search)) {
    history.replaceState(null, '', location.pathname);
    setTimeout(function() { if (typeof hideSplash === 'function') hideSplash(); Walk.open(); }, 400);
  }
  if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'open-walk') Walk.open();
  });
})();
