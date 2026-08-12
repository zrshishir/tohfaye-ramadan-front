/**
 * Regression checks for the prayer reminder scheduler.
 *
 *   npm run check:notifications
 *
 * The Capacitor plugin is stubbed, so only the pure scheduling logic is exercised —
 * which is where the subtle mistakes live: past times, the iOS pending cap, the
 * "till subhe sadik" string in esha.end_time, and stable ids across reschedules.
 */

// The Capacitor plugin and the "@/" alias are handled by scripts/resolve-hook.mjs.
globalThis.localStorage = {
  _v: {},
  getItem(k) { return this._v[k] ?? null; },
  setItem(k, v) { this._v[k] = String(v); },
  removeItem(k) { delete this._v[k]; },
};

const { buildSchedule, parsePrayerTime } = await import('@/services/notifications.js');

let failed = 0;
const check = (name, ok) => {
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}`);
  if (!ok) failed++;
};

// ---------------------------------------------------------------- parsing

console.log('\nparsePrayerTime');
const day = new Date(2026, 7, 11);
check('04:10 AM parses to 04:10', parsePrayerTime('04:10 AM', day)?.getHours() === 4);
check('06:35 PM parses to 18:35', parsePrayerTime('06:35 PM', day)?.getHours() === 18);
check('12:03 PM stays midday', parsePrayerTime('12:03 PM', day)?.getHours() === 12);
check('12:30 AM is after midnight', parsePrayerTime('12:30 AM', day)?.getHours() === 0);
check('"till subhe sadik" is rejected', parsePrayerTime('till subhe sadik', day) === null);
check('undefined is rejected', parsePrayerTime(undefined, day) === null);

// ---------------------------------------------------------------- schedule

const prayer = (start, end) => ({ start_time: start, end_time: end });
const row = (d) => ({
  day: String(d),
  sehri:  prayer('03:27 AM', '04:10 AM'),
  fazr:   prayer('04:10 AM', '05:29 AM'),
  johr:   prayer('12:03 PM', '04:18 PM'),
  asr:    prayer('04:33 PM', '06:13 PM'),
  magrib: prayer('06:35 PM', '07:55 PM'),
  iftar:  prayer('06:35 PM', '07:55 PM'),
  esha:   prayer('07:55 PM', 'till subhe sadik'),
});

const on = (over = {}) => ({
  enabled: true,
  waqts: { sehri: true, fazr: true, johr: true, asr: true, iftar: true, magrib: true, esha: true },
  minutesBefore: 0,
  ...over,
});

// 11 Aug 2026 at 00:01, so every waqt that day is still ahead.
const now = new Date(2026, 7, 11, 0, 1);
const calendar = [11, 12, 13].map(row);

console.log('\nbuildSchedule');
let s = buildSchedule(calendar, { now, settings: on() });
check('7 waqts x 3 days = 21', s.length === 21);
check('sorted chronologically', s.every((n, i) => i === 0 || s[i - 1].schedule.at <= n.schedule.at));
check('first is sehri end 04:10', s[0].schedule.at.getHours() === 4 && s[0].schedule.at.getMinutes() === 10);
check('esha included despite unparsable end_time', s.some((n) => n.title === 'Isha'));

console.log('\ndisabled / filtering');
check('disabled yields nothing', buildSchedule(calendar, { now, settings: on({ enabled: false }) }).length === 0);
check('non-array calendar yields nothing', buildSchedule(null, { now, settings: on() }).length === 0);
const sehriOnly = buildSchedule(calendar, {
  now,
  settings: on({ waqts: { sehri: true, fazr: false, johr: false, asr: false, iftar: false, magrib: false, esha: false } }),
});
check('per-waqt toggle respected', sehriOnly.length === 3 && sehriOnly.every((n) => n.title === 'Sehri ends'));

console.log('\npast times');
// Midday: that day's sehri, fajr and zuhr have gone.
const midday = new Date(2026, 7, 11, 12, 30);
const later = buildSchedule(calendar, { now: midday, settings: on() });
check('already-passed waqts are skipped', later.length === 21 - 3);
check('nothing scheduled in the past', later.every((n) => n.schedule.at > midday));

console.log('\nminutesBefore');
const early = buildSchedule(calendar, { now, settings: on({ minutesBefore: 15 }) });
const firstEarly = early[0].schedule.at;
check('15 minutes earlier -> 03:55', firstEarly.getHours() === 3 && firstEarly.getMinutes() === 55);
check('body mentions the lead time', early[0].body.includes('15 minutes'));

console.log('\nids and the iOS cap');
const a = buildSchedule(calendar, { now, settings: on() });
const b = buildSchedule(calendar, { now, settings: on() });
check('ids are stable across rebuilds', a.map((n) => n.id).join() === b.map((n) => n.id).join());
check('ids are unique', new Set(a.map((n) => n.id)).size === a.length);
const many = buildSchedule(Array.from({ length: 31 }, (_, i) => row(i + 1)), { now, settings: on() });
check('capped below the iOS 64 limit', many.length <= 60);

console.log('\nhorizon');
const wide = buildSchedule(Array.from({ length: 31 }, (_, i) => row(i + 1)), { now, settings: on() });
const maxDay = Math.max(...wide.map((n) => n.schedule.at.getDate()));
check('never schedules beyond 7 days out', maxDay <= 18);

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} check(s) failed.`);
process.exit(failed ? 1 : 0);
