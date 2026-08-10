/**
 * Regression checks for the Qibla helpers.
 *
 * The repo has no test runner yet, so this is a plain Node script:
 *   npm run check:qibla
 *
 * The bearings below are published Qibla directions for well-known cities. They are
 * the guard against the original bug, where degrees were passed to Math.sin/Math.cos
 * (which take radians), producing errors of 12°–177°.
 */

import {
  qiblaBearing,
  headingFromOrientation,
  bearingDelta,
  compassPoint,
  KAABA,
} from '../src/helpers/qibla.js';

let failed = 0;
const check = (name, ok) => {
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}`);
  if (!ok) failed++;
};
const near = (a, b, tol = 1) => Math.abs(((a - b + 540) % 360) - 180) <= tol;

console.log('\nBearing vs published Qibla directions');
for (const [city, lat, lon, expected] of [
  ['Dhaka',    23.8103,  90.4125, 277.60],
  ['London',   51.5074,  -0.1278, 118.99],
  ['Jakarta',  -6.2088, 106.8456, 295.15],
  ['New York', 40.7128, -74.0060,  58.48],
  ['Sydney',  -33.8688, 151.2093, 277.50],
  ['Cairo',    30.0444,  31.2357, 136.14],
  ['Istanbul', 41.0082,  28.9784, 151.65],
]) {
  const bearing = qiblaBearing(lat, lon);
  check(`${city.padEnd(9)} ${bearing.toFixed(2)}° ≈ ${expected}°`, near(bearing, expected));
}

console.log('\nGeometric edge cases');
check('at the Kaaba itself does not throw', Number.isFinite(qiblaBearing(KAABA.lat, KAABA.lon)));
check('always within 0–360', [[-89, 0], [0, 180], [45, -179], [89.9, 90]]
  .every(([a, o]) => { const b = qiblaBearing(a, o); return b >= 0 && b < 360; }));
check('due north of the Kaaba points south', near(qiblaBearing(40, KAABA.lon), 180, 0.5));
check('due south of the Kaaba points north', near(qiblaBearing(0, KAABA.lon), 0, 0.5));
// Near the pole the initial bearing tracks the Kaaba's meridian rather than running
// due south — hand-computed as 140.1486° for (89.9N, 0E).
check('near the north pole at 0°E → 140.15°', near(qiblaBearing(89.9, 0), 140.1486, 0.01));
check('near the north pole on the Kaaba meridian → 180°', near(qiblaBearing(89.9, KAABA.lon), 180, 0.01));

console.log('\nheadingFromOrientation');
check('iOS webkitCompassHeading passes through', headingFromOrientation({ webkitCompassHeading: 90 }) === 90);
check('absolute alpha inverted to clockwise', headingFromOrientation({ absolute: true, alpha: 90 }) === 270);
check('alpha 0 → heading 0', headingFromOrientation({ absolute: true, alpha: 0 }) === 0);
check('non-absolute alpha rejected', headingFromOrientation({ absolute: false, alpha: 90 }) === null);
check('empty event rejected', headingFromOrientation({}) === null);
check('NaN rejected', headingFromOrientation({ webkitCompassHeading: NaN }) === null);

console.log('\nbearingDelta / alignment');
check('delta across 0° takes the short way', bearingDelta(350, 10) === 20);
check('delta is signed', bearingDelta(10, 350) === -20);
check('3° apart counts as aligned', Math.abs(bearingDelta(277, 280)) <= 5);
check('40° apart is not aligned', Math.abs(bearingDelta(240, 280)) > 5);

console.log('\ncompassPoint');
check('0 → N', compassPoint(0) === 'N');
check('277.6 → W', compassPoint(277.6) === 'W');
check('119 → SE', compassPoint(119) === 'SE');
check('359 wraps to N', compassPoint(359) === 'N');

console.log(failed === 0
  ? `\nAll checks passed.`
  : `\n${failed} check(s) failed.`);
process.exit(failed ? 1 : 0);
