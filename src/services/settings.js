/**
 * User settings, and the calendar params derived from them.
 *
 * Prayer times are district-dependent: the Islamic Foundation publishes a separate
 * sehri and iftar offset for each district relative to Dhaka, up to ±12 minutes. Until
 * now every device silently received Dhaka's times.
 */

const KEY = 'settings';

// Caches that are only valid for one district. Changing district must clear them,
// or the app keeps showing the previous district's times.
const DISTRICT_SCOPED_CACHES = [
  'calendarData',
  'calendarTimestamp',
  'Ramadan-Calender',
];

const defaults = () => ({
  districtId: null,
  districtName: null,
  divisionName: null,
});

export function getSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
  } catch {
    return defaults();
  }
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Clear the caches whose contents belong to a particular district. */
export function clearDistrictScopedCaches() {
  DISTRICT_SCOPED_CACHES.forEach((key) => localStorage.removeItem(key));
}

/**
 * Query params every calendar request should carry.
 * Omits district_id entirely when unset, so the API falls back to Dhaka.
 */
export function calendarParams(extra = {}) {
  const { districtId } = getSettings();
  return districtId ? { district_id: districtId, ...extra } : { ...extra };
}
