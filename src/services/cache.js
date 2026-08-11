/**
 * A single cache with expiry.
 *
 * Every screen previously rolled its own `localStorage` key and **none of them ever
 * expired**. `Home.vue` even wrote a `calendarTimestamp` and never read it back. Once a
 * screen had cached, it never called the API again, so a user could see last month's
 * prayer times indefinitely and content changed in admin never reached the device.
 *
 * Entries are namespaced and versioned, so bumping VERSION invalidates everything from
 * an older build — useful when a response shape changes, as it did for hadith and tasbih.
 */

const PREFIX = 'tr';
const VERSION = 1;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * How long each kind of content stays fresh.
 *
 * Prayer times are dated content that must not go stale, so they get a day. Scripture
 * and duas effectively never change, so they get a week — long enough to be useful
 * offline, short enough that an admin correction lands within days.
 */
export const TTL = {
  calendar: DAY,
  ramadanCalendar: DAY,
  suras: 7 * DAY,
  duaCategories: 7 * DAY,
  duas: 7 * DAY,
  asmaulHusna: 7 * DAY,
  tasbih: 30 * DAY,
};

const keyFor = (name) => `${PREFIX}:${VERSION}:${name}`;

/**
 * Read a cached value. Returns null when absent, expired, or unparsable.
 * `allowStale` returns expired content anyway — used as an offline fallback, where
 * yesterday's data beats an empty screen.
 */
export function readCache(name, { allowStale = false } = {}) {
  try {
    const raw = localStorage.getItem(keyFor(name));
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry || typeof entry !== 'object' || !('value' in entry)) return null;

    const expired = typeof entry.expiresAt === 'number' && Date.now() > entry.expiresAt;
    if (expired && !allowStale) return null;

    return entry.value;
  } catch {
    // Corrupt or written by an older build — drop it rather than crash a screen.
    localStorage.removeItem(keyFor(name));
    return null;
  }
}

export function writeCache(name, value, ttl) {
  try {
    localStorage.setItem(keyFor(name), JSON.stringify({
      value,
      storedAt: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : null,
    }));
  } catch (error) {
    // Quota exceeded, or private mode. Caching is an optimisation, never required.
    console.error('Could not cache', name, error);
  }
}

export function removeCache(name) {
  localStorage.removeItem(keyFor(name));
}

/** True when a cached entry exists but has passed its TTL. */
export function isStale(name) {
  try {
    const raw = localStorage.getItem(keyFor(name));
    if (!raw) return false;
    const entry = JSON.parse(raw);
    return typeof entry?.expiresAt === 'number' && Date.now() > entry.expiresAt;
  } catch {
    return false;
  }
}

/**
 * Fetch with a cache in front.
 *
 * Serves fresh cache without a request; otherwise fetches, caches and returns. If the
 * request fails and stale content exists, the stale content is returned rather than
 * failing the screen — that is what makes the app usable offline.
 *
 * Returns { value, fromCache, stale }.
 */
export async function cached(name, ttl, fetcher) {
  const fresh = readCache(name);
  if (fresh !== null) {
    return { value: fresh, fromCache: true, stale: false };
  }

  try {
    const value = await fetcher();
    writeCache(name, value, ttl);
    return { value, fromCache: false, stale: false };
  } catch (error) {
    const stale = readCache(name, { allowStale: true });
    if (stale !== null) {
      console.error(`Serving stale ${name} after a failed request:`, error);
      return { value: stale, fromCache: true, stale: true };
    }
    throw error;
  }
}

/** Drop every entry this module owns, including ones from an older VERSION. */
export function clearAll() {
  // Iterated via length/key() rather than Object.keys(localStorage): the index API is
  // the specified one, and enumerating the object relies on browser-specific behaviour.
  const doomed = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${PREFIX}:`)) doomed.push(key);
  }

  doomed.forEach((key) => localStorage.removeItem(key));
}

/**
 * One-off cleanup of the ad-hoc keys used before this module existed. They had no
 * expiry, so leaving them behind would keep stale data on device forever.
 */
const LEGACY_KEYS = [
  'calendarData', 'calendarTimestamp', 'Ramadan-Calender', 'surah',
  'Dua-Category', 'Category-Duas', 'Asma-Ul-Husna', 'ayat',
];

export function purgeLegacyKeys() {
  LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
}
