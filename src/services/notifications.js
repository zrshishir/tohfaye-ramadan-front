/**
 * Prayer time notifications.
 *
 * Scheduling is done in a rolling window rather than as repeating alarms, because
 * prayer times move every day. The window is rebuilt each time the app opens.
 *
 * iOS allows only 64 pending local notifications per app and silently drops the rest,
 * so the window is capped well below that.
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { getSettings, saveSettings } from '@/services/settings';

// 7 days x 7 waqts = 49 at most, comfortably inside the iOS 64 cap.
const DAYS_AHEAD = 7;
const MAX_PENDING = 60;

/** The waqts that can be notified, in the order they occur. */
export const NOTIFIABLE = [
  { key: 'sehri',  label: 'Sehri',  edge: 'end_time',   title: 'Sehri ends',  body: 'Sehri time is ending.' },
  { key: 'fazr',   label: 'Fajr',   edge: 'start_time', title: 'Fajr',        body: 'It is time for Fajr.' },
  { key: 'johr',   label: 'Zuhr',   edge: 'start_time', title: 'Zuhr',        body: 'It is time for Zuhr.' },
  { key: 'asr',    label: 'Asr',    edge: 'start_time', title: 'Asr',         body: 'It is time for Asr.' },
  { key: 'iftar',  label: 'Iftar',  edge: 'start_time', title: 'Iftar',       body: 'It is time to break your fast.' },
  { key: 'magrib', label: 'Maghrib', edge: 'start_time', title: 'Maghrib',    body: 'It is time for Maghrib.' },
  { key: 'esha',   label: 'Isha',   edge: 'start_time', title: 'Isha',        body: 'It is time for Isha.' },
];

export const defaultNotificationSettings = () => ({
  enabled: false,
  // Sehri and iftar default on: those are the ones people actually need warning of.
  waqts: { sehri: true, fazr: true, johr: true, asr: true, iftar: true, magrib: true, esha: true },
  minutesBefore: 0,
});

export function getNotificationSettings() {
  return { ...defaultNotificationSettings(), ...(getSettings().notifications ?? {}) };
}

export function saveNotificationSettings(patch) {
  const next = { ...getNotificationSettings(), ...patch };
  saveSettings({ notifications: next });
  return next;
}

/**
 * Parse "04:10 AM" against a given day into a Date.
 * Returns null for anything that is not a clock time — `esha.end_time` is the string
 * "till subhe sadik", for instance.
 */
export function parsePrayerTime(value, date) {
  if (typeof value !== 'string') return null;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let [, hours, minutes, meridiem] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (meridiem.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;

  const when = new Date(date);
  when.setHours(hours, minutes, 0, 0);
  return when;
}

/**
 * Turn cached calendar rows into the notifications to schedule.
 * `calendar` is the array from POST /permanent-calendar, each row carrying `day`
 * and the prayer blocks.
 */
export function buildSchedule(calendar, { now = new Date(), settings = getNotificationSettings() } = {}) {
  if (!settings.enabled || !Array.isArray(calendar)) return [];

  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + DAYS_AHEAD);

  const scheduled = [];

  for (const row of calendar) {
    const day = parseInt(row?.day, 10);
    if (!day) continue;

    const date = new Date(now.getFullYear(), now.getMonth(), day);

    // Rows are for the current month from today onward; anything already past is skipped
    // by the per-notification time check below.
    if (date > horizon) continue;

    for (const waqt of NOTIFIABLE) {
      if (!settings.waqts[waqt.key]) continue;

      const at = parsePrayerTime(row?.[waqt.key]?.[waqt.edge], date);
      if (!at) continue;

      at.setMinutes(at.getMinutes() - (settings.minutesBefore || 0));
      if (at <= now) continue;

      scheduled.push({
        // Stable id so a reschedule replaces rather than duplicates:
        // day (1-31) and waqt index.
        id: day * 100 + NOTIFIABLE.indexOf(waqt),
        title: waqt.title,
        body: settings.minutesBefore
          ? `${waqt.label} in ${settings.minutesBefore} minutes.`
          : waqt.body,
        schedule: { at, allowWhileIdle: true },
      });
    }
  }

  return scheduled
    .sort((a, b) => a.schedule.at - b.schedule.at)
    .slice(0, MAX_PENDING);
}

export async function requestPermission() {
  try {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  } catch (error) {
    console.error('Notification permission error:', error);
    return false;
  }
}

export async function cancelAll() {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications?.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

/**
 * Rebuild the rolling window. Safe to call on every app open — it cancels what is
 * pending first, so times that changed (or a district change) take effect.
 */
export async function reschedule(calendar) {
  const settings = getNotificationSettings();

  await cancelAll();

  if (!settings.enabled) return 0;

  const notifications = buildSchedule(calendar, { settings });
  if (!notifications.length) return 0;

  try {
    await LocalNotifications.schedule({ notifications });
    return notifications.length;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return 0;
  }
}
