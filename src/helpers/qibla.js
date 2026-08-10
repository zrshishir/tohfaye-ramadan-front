/**
 * Qibla direction helpers.
 *
 * The previous implementation fed **degrees** straight into Math.sin/Math.cos,
 * which take radians. That produced a bearing that was wrong everywhere on earth —
 * off by 12° in Jakarta and 177° in Cairo.
 */

// Kaaba, Masjid al-Haram.
export const KAABA = { lat: 21.4225, lon: 39.8262 };

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toDegrees = (radians) => (radians * 180) / Math.PI;

/**
 * Initial great-circle bearing from a coordinate to the Kaaba,
 * in degrees clockwise from true north (0–360).
 *
 *   θ = atan2( sin Δλ ⋅ cos φ₂,
 *              cos φ₁ ⋅ sin φ₂ − sin φ₁ ⋅ cos φ₂ ⋅ cos Δλ )
 */
export function qiblaBearing(latitude, longitude) {
  const lat1 = toRadians(latitude);
  const lat2 = toRadians(KAABA.lat);
  const deltaLon = toRadians(KAABA.lon - longitude);

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2)
          - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Compass heading, in degrees clockwise from north, from a DeviceOrientationEvent.
 * Returns null when the event carries no usable heading.
 */
export function headingFromOrientation(event) {
  // iOS exposes a ready-made clockwise-from-north heading.
  if (typeof event.webkitCompassHeading === 'number' && !Number.isNaN(event.webkitCompassHeading)) {
    return event.webkitCompassHeading;
  }

  // The spec's alpha runs counter-clockwise, and is only north-referenced
  // when the reading is absolute.
  if (event.absolute && typeof event.alpha === 'number' && !Number.isNaN(event.alpha)) {
    return (360 - event.alpha) % 360;
  }

  return null;
}

/** Shortest signed difference between two bearings, in degrees (-180, 180]. */
export function bearingDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

/** 'N', 'NE', ... for a bearing in degrees. */
export function compassPoint(bearing) {
  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return points[Math.round(bearing / 45) % 8];
}
