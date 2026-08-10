# Manual Testing — Qibla Compass

**Branch:** `fix/zrshishir/qibla-bearing-math`
**Target:** `development` (stacked on `fix/zrshishir/hadith-masala-integration`)
**Version:** 2.2.0
**Backend:** no changes required

---

## Background

Two separate problems:

**1. The maths was wrong everywhere.** `KiblaCompass.vue` passed degrees into
`Math.sin()` / `Math.cos()`, which take radians:

```js
let dLongitude = kaaba.lon - longitude;           // degrees
let y = Math.sin(dLongitude) * Math.cos(kaaba.lat); // ← radians expected
```

Measured against published Qibla directions:

| City | Published | Old code | Error |
|---|---|---|---|
| Dhaka | 277.6° | 159.4° | **119°** |
| London | 118.99° | 242.1° | **123°** |
| Jakarta | 295.15° | 307.3° | **12°** |
| New York | 58.48° | 229.6° | **171°** |
| Sydney | 277.50° | 246.9° | **31°** |
| Cairo | 136.14° | 318.7° | **177°** |

The Kaaba coordinates were also ~4 km off (`21.3891, 39.8579` → `21.4225, 39.8262`).

**2. Nothing was wired up.** The bearing was only ever `console.log`ged. The screen showed
a static image and the words "Coming Soon"; the Kaaba marker was commented out with a
hardcoded `rotate-[150deg]`.

---

## Setup

```bash
git checkout fix/zrshishir/qibla-bearing-math
npm install
npm run check:qibla     # 27 automated checks
npm run build
npm run preview
```

Device orientation needs **HTTPS or localhost**. Testing over a LAN IP will silently
never deliver orientation events — use `localhost`, a tunnel, or a native build.

---

## Test cases

### TC-01 — Bearing correctness (automated)

```bash
npm run check:qibla
```

Expected: **All checks passed** — seven cities within 1° of published bearings, plus
polar edge cases, orientation parsing and alignment maths.

---

### TC-02 — Bearing matches a trusted source

| Step | Action | Expected |
|---|---|---|
| 1 | Open the Qibla screen in Dhaka | Readout shows ≈ **277.6° W** |
| 2 | Compare against qiblafinder.withgoogle.com or a local mosque's known alignment | Within a degree or two |
| 3 | In devtools, override geolocation to London | Readout ≈ **119.0° SE** |
| 4 | Override to New York | ≈ **58.5° NE** |
| 5 | Override to Jakarta | ≈ **295.2° W** |

Chrome devtools: **⋮ → More tools → Sensors → Location → Custom**.

---

### TC-03 — Live compass on a real device

| Step | Action | Expected |
|---|---|---|
| 1 | Open on Android (Chrome or the native build) | "Reading compass…" briefly, then the marker settles |
| 2 | Rotate the phone slowly through a full turn | The dial counter-rotates; N stays pointing at true north |
| 3 | Turn until the marker points straight up | "**You are facing the Qibla**" appears |
| 4 | Turn ~20° away | The cue disappears |
| 5 | Cross-check with a standalone compass app | Headings agree within a few degrees |

If the needle is erratic, move the phone in a figure-eight to recalibrate — the on-screen
hint says so.

---

### TC-04 — iOS permission gate

| Step | Action | Expected |
|---|---|---|
| 1 | Open on iOS Safari / the iOS build | An **Enable compass** button is shown; no live heading yet |
| 2 | Tap it | The system permission prompt appears |
| 3 | Allow | Button disappears, marker starts tracking |
| 4 | Reload and Deny instead | Falls back to the static-bearing message, no crash |

iOS requires `DeviceOrientationEvent.requestPermission()` to be called from a user
gesture, which is why the button exists rather than an automatic prompt.

---

### TC-05 — No magnetometer

| Step | Action | Expected |
|---|---|---|
| 1 | Open in a desktop browser (no compass hardware) | After ~2.5s: "Your device has no compass sensor. Point the top of your phone to true north, then turn *N*° clockwise…" |
| 2 | Check the readout | Still shows the correct numeric bearing |
| 3 | Check the marker | Points at the absolute bearing, dial unrotated |

---

### TC-06 — Location permission denied / offline

| Step | Action | Expected |
|---|---|---|
| 1 | Load once with location allowed | Bearing shown, coords cached |
| 2 | Deny location, reload | Cached coords used, bearing still correct, **no error popup** |
| 3 | Clear `localStorage.qibla-coords`, deny location, reload | Error state shown (nothing to fall back on) |
| 4 | Go offline with a cached position | Screen works — the bearing needs no network |

**Regression guarded:** previously a denied permission left the screen permanently blank.

---

### TC-07 — Screen chrome

| Step | Action | Expected |
|---|---|---|
| 1 | Trigger the loading state | Title reads **"Kibla Compass"** — previously said "Tasbih" |
| 2 | Check the header | City name from the location chip renders as before |
| 3 | Back arrow | Returns to home |
| 4 | Navigate away mid-reading | No console errors — the orientation listener is removed on unmount |

---

### TC-08 — No regressions

| Step | Action | Expected |
|---|---|---|
| 1 | Visit every other screen | Unchanged |
| 2 | `npm run build` | Clean |
| 3 | Native build via `./update_mobile_app.sh` | Compass works on device |

---

## Automated verification performed

```
Bearing vs published Qibla directions
  PASS  Dhaka     277.57° ≈ 277.6°
  PASS  London    118.99° ≈ 118.99°
  PASS  Jakarta   295.15° ≈ 295.15°
  PASS  New York   58.48° ≈ 58.48°
  PASS  Sydney    277.50° ≈ 277.5°
  PASS  Cairo     136.14° ≈ 136.14°
  PASS  Istanbul  151.62° ≈ 151.65°

Geometric edge cases
  PASS  at the Kaaba itself does not throw
  PASS  always within 0–360
  PASS  due north of the Kaaba points south
  PASS  due south of the Kaaba points north
  PASS  near the north pole at 0°E → 140.15°
  PASS  near the north pole on the Kaaba meridian → 180°

headingFromOrientation      6 checks PASS
bearingDelta / alignment    4 checks PASS
compassPoint                4 checks PASS
```

The polar case was hand-computed independently (140.1486°) and matches the implementation
to four decimal places.

**Build:** clean — 286 kB JS (96 kB gzip).

On-device compass behaviour cannot be automated — TC-03 and TC-04 need real hardware.

---

## Note

The bearing is a **great-circle** initial bearing, which is the standard for Qibla and
what mosque compasses use. It is not the same as a straight line on a Mercator map;
a large discrepancy against a map-drawn line is expected, not a bug.

Headings come from the magnetometer and are subject to local magnetic interference —
steel structures, speakers, phone cases with magnets. The figure-eight calibration hint
covers the common case.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 automated checks | ☐ |
| TC-02 bearing vs trusted source | ☐ |
| TC-03 live compass (Android) | ☐ |
| TC-04 iOS permission gate | ☐ |
| TC-05 no magnetometer | ☐ |
| TC-06 denied / offline | ☐ |
| TC-07 screen chrome | ☐ |
| TC-08 no regressions | ☐ |
