# Changelog

All notable changes to the Tohfa-e-Ramazan app (Prayer Pulse) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2026-08-10

### Fixed

- **The Qibla bearing was wrong everywhere on earth.** `KiblaCompass.vue` passed
  **degrees** into `Math.sin()` / `Math.cos()`, which take **radians**. Measured against
  published Qibla directions the old code was off by 12° in Jakarta, 31° in Sydney, 119°
  in Dhaka, 171° in New York and 177° in Cairo. The corrected formula now matches every
  reference bearing to within 0.05°.
- Kaaba coordinates corrected from `21.3891, 39.8579` to `21.4225, 39.8262`, roughly
  4 km off the actual position of the Masjid al-Haram.
- The loading screen was titled "Tasbih" on the Qibla screen.

### Added

- **A working compass.** The screen previously rendered a static image and the text
  "Coming Soon"; the calculated bearing was only ever written to `console.log`, and the
  Kaaba marker was commented out with a hardcoded `rotate-[150deg]`.
  - Live device heading via `deviceorientationabsolute`, falling back to
    `deviceorientation`.
  - The dial counter-rotates so north stays north, and the Kaaba marker tracks the
    device.
  - Numeric readout (e.g. `277.6° W`) and a "You are facing the Qibla" cue within 5°.
- iOS 13+ permission gate — `DeviceOrientationEvent.requestPermission()` must be called
  from a user gesture, so an "Enable compass" button is shown on iOS.
- Graceful degradation when no magnetometer is present: after a 2.5s timeout the screen
  switches to a static bearing with instructions to align to north manually.
- Last known coordinates cached, so the screen works offline and when location permission
  is denied instead of showing a dead error state.
- `src/helpers/qibla.js` — bearing maths extracted and unit-checkable.
- `npm run check:qibla` — 27 regression checks against published Qibla bearings for seven
  cities, polar edge cases, orientation-event parsing and alignment maths.

## [2.1.0] - 2026-08-10

> Requires backend **1.2.0** or later. `data.tasbih` is now a JSON array rather than a
> JSON-encoded string.

### Fixed

- **Tasbih counts were never saved.** Nothing was ever written back — not to the API, not
  even to `localStorage` after a tap — so every count was lost the moment the screen was
  closed. Counters now write through to `localStorage` immediately and sync to
  `PUT /api/tasbih/{userId}` on a 1.5s debounce, with a flush on leaving the screen.
- `counterHandler()` read `this.lastResetTimestamp`, `this.currentMonth` and
  `this.currentYear`, none of which were declared in `data()`. Consequences:
  - The daily reset compared against `undefined`, producing `NaN`, so `today_count` never
    reset — it only ever grew.
  - `monthly_count` and `yearly_count` were zeroed on the **first tap of every visit**,
    so they were effectively pinned at 1.
- The screen cached the tasbih list in `localStorage` and, once cached, **never called the
  API again** — server-side changes to the dhikr list could never reach the device.
- `JSON.parse()` was called on `data.tasbih`, which is now a real array.
- `localStorage.setItem('tasbih', <array>)` would have stringified to
  `"[object Object],..."`. The cache is now a properly serialised object, and a legacy
  value under the old key is detected and discarded.
- `TheNoData` was gated on `tasbihs === 0`, which an array can never equal, so the empty
  state never rendered.

### Changed

- Period resets now use calendar boundaries (new day / month / year) instead of a rolling
  24-hour delta, and are re-checked before every tap, so a session left open overnight
  rolls over correctly.
- The dhikr list (text, `reset_on`) comes from the server; counters are owned by the
  device and merged in by `text_en`. A dhikr added in admin now appears without wiping
  local progress.
- The counter wrap is guarded with `reset_on > 0`.
- Fetch failures fall back to cached counters rather than showing the error popup; a
  `404` renders `TheNoData` instead of an error.

## [2.0.1] - 2026-08-10

### Fixed

- Hadith and Masala screens rendered blank cards. Three independent causes:
  - They called `axios.get('/api/hadith')` with a **relative** path, which only resolved
    behind the dev-only Vite proxy. In a Capacitor build the origin is
    `capacitor://localhost`, so the request failed. Both now use `VITE_BASE_URL`.
  - They assigned the whole `{status, statusCode, message, data}` envelope to the array
    bound by `v-for`. Both now read `response.data.data`.
  - Field names did not match the API: the screens read `hadith.text` / `narrator` /
    `source` and `item.question` / `answer`; the API returns `title` / `description` /
    `reference`.
- Neither screen handled the API's `204 No Content` response, which carries an empty body.
  Both now check `response.status === 204` and render `TheNoData`.
- `/hadith` and `/masala` were unreachable from the UI — no home-menu entry existed.

### Added

- Hadith and Masa-el tiles on the home menu, with new icons.
- Manual testing document at `docs/manual-testing/hadith-masala-integration.md`.
- This changelog.

### Changed

- Both screens now use the shared `TheHeader` / `TheLoading` / `TheError` / `TheNoData`
  components, matching every other screen, instead of a bespoke layout.

## [2.0.0] - 2026-08-05

### Added

- Surah verse pagination with Previous / Next controls, page state synced to the route
  query so a reload restores position.
- Hadith and Masa-el screens and routes.
- `update_mobile_app.sh` — rebuild and `npx cap sync` helper for native builds.
- `.env.example`; `.env` is no longer tracked in git.

### Changed

- Brand palette: primary `#008000` → `#064e3b`, secondary `#F9B44F` → `#d4af37`,
  `darkGreen` `#036F03` → `#047857`, plus a new `sand` background token.
- Dependency bumps: Vue 3.3 → 3.4, Vite 5.0 → 5.2, `@vitejs/plugin-vue` 4.5 → 5.0.

### Fixed

- `SingleSurah.vue` cached only the first page of ayats under a single shared
  `localStorage` key regardless of which surah was open. The cache was removed.

## [1.0.0] - 2024

### Added

- Prayer times: today, tomorrow, upcoming, and next-salat countdown.
- Ramadan sehri/iftar calendar.
- Al-Quraan: sura list and verse reader.
- Duas by category, Asma-Ul-Husna, Tasbih counter, Qibla compass.
- Capacitor Android and iOS builds.

[Unreleased]: https://github.com/codetochill/tohfa-e-ramazan-front/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/codetochill/tohfa-e-ramazan-front/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/codetochill/tohfa-e-ramazan-front/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/codetochill/tohfa-e-ramazan-front/releases/tag/v1.0.0
