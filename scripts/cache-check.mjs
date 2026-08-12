/**
 * Regression checks for the cache layer.
 *
 *   npm run check:cache
 *
 * The behaviour that matters is expiry — the previous ad-hoc caches had none, so a
 * device could show last month's prayer times indefinitely — and the stale fallback,
 * which is what makes the app usable offline.
 */

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i],
};
// Object.keys(localStorage) is used by clearAll().
Object.defineProperty(globalThis.localStorage, Symbol.iterator, { value: undefined });

const cache = await import('@/services/cache.js');
const { readCache, writeCache, removeCache, isStale, cached, clearAll, purgeLegacyKeys, TTL } = cache;

let failed = 0;
const check = (name, ok) => {
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}`);
  if (!ok) failed++;
};
const reset = () => Object.keys(store).forEach((k) => delete store[k]);

console.log('\nread / write');
reset();
writeCache('suras', [{ id: 1 }], TTL.suras);
check('round-trips a value', readCache('suras')?.[0]?.id === 1);
check('absent key is null', readCache('nope') === null);
check('namespaced and versioned', Object.keys(store)[0].startsWith('tr:1:'));

console.log('\nexpiry');
reset();
writeCache('calendar', ['old'], -1000);            // already expired
check('expired entry reads as null', readCache('calendar') === null);
check('isStale reports true', isStale('calendar') === true);
check('allowStale returns it anyway', readCache('calendar', { allowStale: true })?.[0] === 'old');
writeCache('calendar', ['new'], TTL.calendar);
check('fresh entry is not stale', isStale('calendar') === false);

console.log('\ncorrupt data');
reset();
store['tr:1:suras'] = '{not json';
check('unparsable entry reads as null', readCache('suras') === null);
check('and is dropped', !('tr:1:suras' in store));

console.log('\ncached()');
reset();
let calls = 0;
const fetcher = async () => { calls++; return ['fetched']; };

let r = await cached('suras', TTL.suras, fetcher);
check('first call fetches', calls === 1 && r.value[0] === 'fetched' && r.fromCache === false);

r = await cached('suras', TTL.suras, fetcher);
check('second call serves cache without fetching', calls === 1 && r.fromCache === true);

console.log('\noffline fallback');
reset();
writeCache('calendar', ['yesterday'], -1000);       // stale
const failing = async () => { throw new Error('offline'); };
r = await cached('calendar', TTL.calendar, failing);
check('failed request falls back to stale', r.value[0] === 'yesterday');
check('and flags it as stale', r.stale === true);

reset();
let threw = false;
try { await cached('calendar', TTL.calendar, failing); } catch { threw = true; }
check('failure with no cache still throws', threw);

console.log('\ninvalidation');
reset();
writeCache('calendar', ['a'], TTL.calendar);
removeCache('calendar');
check('removeCache drops the entry', readCache('calendar') === null);

writeCache('suras', ['a'], TTL.suras);
writeCache('duas', ['b'], TTL.duas);
store['unrelated'] = 'keep me';
clearAll();
check('clearAll drops namespaced entries', readCache('suras') === null && readCache('duas') === null);
check('clearAll leaves other keys alone', store['unrelated'] === 'keep me');

console.log('\nlegacy purge');
reset();
['calendarData', 'calendarTimestamp', 'Ramadan-Calender', 'surah',
 'Dua-Category', 'Category-Duas', 'Asma-Ul-Husna', 'ayat'].forEach((k) => { store[k] = 'x'; });
store['settings'] = 'keep';
store['tasbih'] = 'keep';
purgeLegacyKeys();
check('legacy content keys removed', !['calendarData', 'surah', 'Asma-Ul-Husna'].some((k) => k in store));
check('settings survive the purge', store['settings'] === 'keep');
check('tasbih counters survive the purge', store['tasbih'] === 'keep');

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} check(s) failed.`);
process.exit(failed ? 1 : 0);
