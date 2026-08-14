# Changelog

All notable changes to the Tohfa-e-Ramazan app (Prayer Pulse) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.0.0] - 2026-08-14

Unblocks Google Play submission.

### Changed

- **Capacitor 5 → 8, and Android `targetSdk` 33 → 36.**

  Play requires updates to target API 36 from **31 August 2026**, with existing apps needing
  API 35 to stay available to new users. `targetSdkVersion` is not a number you can just
  edit — Capacitor pins what the native project supports, so the Play requirement was a
  Capacitor upgrade in disguise. Capacitor is at **8.5.0**, three majors on, not the two
  originally estimated.

  | | Before | After |
  |---|---|---|
  | `@capacitor/core`, `android`, `ios`, `cli` | 5.7.x | 8.5.0 |
  | `@capacitor/app` | 5.0.7 | 8.1.1 |
  | `@capacitor/geolocation` | 5.0.7 | 8.2.2 |
  | `@capacitor/local-notifications` | 5.0.8 | 8.2.1 |
  | `@capacitor/preferences` | 5.0.7 | 8.0.1 |
  | `compileSdk` / `targetSdk` | 33 | **36** |
  | `minSdk` | 22 | 24 |
  | Gradle | 8.0.2 | 8.14.3 |
  | Android Gradle Plugin | 8.0.2 | 8.13.0 |
  | JDK | 17 | 21 |
  | Node (CI) | 20 | 22 |

  SDK and androidx versions were taken from the Capacitor 8 project template rather than
  chosen, so they match what a fresh `cap add android` produces.

  **No JavaScript changed.** Every plugin call the app makes — `addListener`, `exitApp`,
  `getCurrentPosition`, `Preferences.get`/`set`, and `requestPermissions`, `getPending`,
  `cancel`, `schedule` — has a stable signature across these majors. All four check suites
  pass unchanged and the web bundle is identical in size.

- **`minSdk` 22 → 24** drops Android 5.0 and 5.1 (2015). This is the Capacitor 8 floor, not
  a preference; there is no route to targetSdk 36 that keeps Lollipop.

### Removed

- `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE`. Nothing in the app reads or writes
  files — there is no Filesystem plugin, and the `FileProvider` is unused Capacitor
  scaffolding. Both are no-ops from API 33, and requesting storage access an app does not
  use invites Play review questions while making the permission list look worse than the
  app actually is.

### Added

- The APK workflow now **reads the built artifact back with `aapt2 dump badging`** and
  reports the package name and targetSdk from the APK's own manifest, warning if it falls
  below Play's floor. Play rejects on what is in the uploaded artifact, and a build can pick
  up a stale targetSdk without any source file looking wrong.

### Notes

- **`USE_EXACT_ALARM` is a Play-restricted permission** and is still declared. It grants
  exact alarms without user opt-in, and Google limits it to apps whose core function is
  alarms, clocks or calendars. A prayer-reminder app is a plausible fit but **will** be
  reviewed and needs justification at submission. The alternative — dropping it and relying
  on `SCHEDULE_EXACT_ALARM` alone — makes the user grant "Alarms & reminders" by hand.
  Deliberately left as-is: it is a product decision, not a technical one.

- This needs a device QA pass before release. Android 13+ changed notification permissions
  and exact-alarm scheduling most, and prayer reminders depend on both.

## [3.9.0] - 2026-08-13

### Changed

- **Application identifier `com.tazqiah.prayerPulse` → `com.makrosh.prayerpulse`**, ahead of
  submitting from the new Makrosh organisation account.

  Package names are globally unique on Google Play and reserved **permanently** — including
  for apps that were only ever submitted, never published. The previous submission was in
  review when that developer account closed, so the old identifier is very likely
  unavailable to the new account. Changing it now costs nothing; after a release it is
  impossible without a new listing and every user reinstalling by hand.

  Lower-cased while renaming (`prayerPulse` → `prayerpulse`) to match Java package
  convention and avoid case-sensitivity differences between the source tree and the
  filesystem.

  Touched: `capacitor.config.json`, the Gradle `namespace` and `applicationId`,
  `strings.xml` (`package_name`, `custom_url_scheme`), the `MainActivity` package
  declaration and its directory, and the iOS `PRODUCT_BUNDLE_IDENTIFIER`.

  **An installed build of the old identifier is a separate app to Android.** It will not be
  upgraded in place — uninstall it before installing a new APK.

### Fixed

- `android/app/release/output-metadata.json`, a Gradle build output, was committed and
  carried a stale record of the old package name and version. Removed, and `release/` is
  now ignored — that rule shipped commented out in the Android template.

### Notes

- The API domain is untouched. `prayerpulse.tazqiah.com` is where the backend is hosted,
  which is a separate decision from the app identifier; the workflow's default API URL
  still points there. Worth revisiting if the backend moves to a Makrosh domain.

## [3.8.0] - 2026-08-13

### Added

- **`Build Android APK` workflow.** Actions tab → Run workflow → download the APK from the
  run's artifacts. Choose which API it targets and whether to build debug or release.

  There is no JDK or Android SDK on the dev Mac, and the GitHub runners already have both,
  so building in CI means anyone on the team can produce an installable APK without a
  multi-gigabyte local toolchain.

  It also runs on any pull request touching `android/`, `capacitor.config.json` or
  `package.json`, so a change that breaks the APK build is caught in review rather than
  discovered the next time a build is needed.

  The build fails if the chosen API URL is not found in the compiled bundle. Vite inlines
  those values, and a build has previously succeeded with `VITE_BASE_URL` undefined and
  shipped an app whose every request went nowhere — a blank home screen with nothing in the
  logs to explain it.

- **`docs/android-builds.md`** — how to get an APK, how signing is wired, how to build
  locally, and what the Play Store gap involves.

- **Optional release signing**, driven entirely by repository secrets
  (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
  `ANDROID_KEY_PASSWORD`). `android/app/build.gradle` had no `signingConfigs` block at all,
  so `assembleRelease` produced an unsigned APK regardless. It now enables signing only
  when the properties are present, so an unsigned build still succeeds rather than failing
  confusingly.

### Security

- **`android/.gitignore` no longer leaves keystores committable.** The `*.jks` and
  `*.keystore` lines shipped commented out by the Android template, so a keystore dropped
  into that directory would have been committed. A signing key is the app's identity on
  Google Play: it cannot be rotated for an existing listing, and publishing it lets anyone
  ship an update signed as you.

### Notes

- **The app cannot currently be published to Google Play.** `targetSdkVersion` is 33. From
  31 August 2026 updates must target API 36, and existing apps need API 35 to stay
  available to new users; an extension can be requested until 1 November 2026.

  Closing that gap means **Capacitor 5 → 7**, along with every plugin, `compileSdk` 36 and
  JDK 21. `@capacitor/local-notifications` needs the most care, since prayer reminders run
  through it and Android 13+ tightened both the runtime notification permission and
  exact-alarm scheduling. Tracked as its own piece of work with its own device QA.

- `versionCode` (2) and `versionName` (2.0.0) are deliberately unchanged. `versionCode`
  must increase for every Play Store upload and is irrelevant for sideloading, so it should
  move when a store release is actually being prepared.

## [3.7.2] - 2026-08-12

### Fixed

- **The Quran reader showed the same Bangla text twice and hid the English
  translation.** `bangla_text` and `meaning` are byte-identical in all 6,236 ayats, so
  the "Bangla" and "Meaning" toggles rendered the same string — while the English
  translation sat unused in `notes` and was never displayed.

  The reader now follows the convention the Dua screens already use:

  | Line | Field | Label |
  |---|---|---|
  | Pronunciation | `english_text` | উচ্চারণ |
  | Bangla meaning | `meaning` | অর্থ |
  | English meaning | `notes` | English |

  `bangla_text` is left out until it actually holds the Bangla uccharon — see the note
  below.

- **Iftar appeared as the next salat.** The next-prayer rotation iterated *every* key on
  a calendar row and excluded a handful by name, so the derived `iftar` field added in
  3.4.0 joined the rotation automatically — as had `sehri`, `sunrise` and `ishraq`. It
  now uses an explicit list of the actual waqts: tahazzud, fajr, zuhr (jummah on Friday),
  asr, maghrib, isha.

- **Tomorrow's sehri and iftar countdowns were wrong.** The parser split
  `"06:32 PM"` on `/:| /` and used the hour directly, **discarding the AM/PM** — so
  iftar was treated as 06:32 in the morning and the countdown was around 12 hours out.
  Times are now parsed with the meridiem, and a countdown that has already passed shows
  zero rather than a negative.

- **The Ramadan calendar was pinned to 2024.** The heading read "Ramadan - 2024", and
  `isToday()` compared against `2024-03-DD`, so **no date could ever be highlighted**
  after Ramadan 2024. The year now comes from the current date and the month from each
  row.

- **The Hadith and Masa-el menu icons were 6-byte corrupt files** and rendered as broken
  images. Rewritten.

### Known data gap

`ayats.bangla_text` should hold the **Bangla uccharon**, as it does for duas. Backend
commit `225c341` rewrote the ayat seeder to fetch from alquran.cloud and mapped both
`bangla_text` and `meaning` to the same `bn.bengali` translation, so the pronunciation
was lost across all 6,236 rows. alquran.cloud publishes no Bengali transliteration
edition, so restoring it needs a separate source.


## [3.7.1] - 2026-08-11

### Fixed

- **Tasbih broke against a backend older than 1.2.0.** That release changed
  `data.tasbih` from a JSON-encoded string to an array, and the screen only handled the
  array — so against a server that had not been redeployed it received a string, and the
  counter logic and `v-for` both failed.

  The screen now accepts either shape. A released app can update from the store before
  the server it talks to is redeployed, so the client should tolerate the older response
  rather than break.

- **`npm run build` now fails when `VITE_BASE_URL` is unset**, instead of producing a
  bundle with no API URL compiled in.

  `.env` became git-ignored in 2.0.0 and Vite inlines env values at build time, so a
  build without one succeeded and shipped an app where every request silently went
  nowhere. The screens render, the menu works, and no data ever arrives — which looks
  like a backend outage rather than a missing file. There was a runtime `console.error`,
  but nothing stopped the build.

  Enforced for `npm run dev` as well. The dev proxy only forwards paths beginning `/api`,
  but with no `baseURL` axios issues relative requests like `/permanent-calendar`, which
  the proxy never sees — so the dev server failed in exactly the same way, screen by
  screen, with an error dialog and no data.


## [3.7.0] - 2026-08-11

> Requires backend **2.8.0**.

### Added

- **Account screens** at `/account` — sign in, create an account, sign out, and delete
  the account. Reachable from Settings. Signing in is optional and the screen says so:
  everything works without one.
- **A bookmarks screen** at `/bookmarks`. Bookmarks have been storable since the reader
  landed but there was nowhere to browse them. Each row links back to the ayat it marks.
- **Sync on sign-in.** Local bookmarks and tasbih counters are pushed, and the merged set
  the server returns is adopted — so reading on a phone before signing up does not lose
  those bookmarks, and signing in on a second device does not wipe the account.
- The API client attaches the bearer token automatically, and **drops it on a 401**, so a
  revoked or expired session returns the app to guest mode rather than retrying with a
  token the server has rejected.

### Note

The token is stored separately from cached content, so clearing the cache never signs
anyone out. Sync failures are logged rather than surfaced — failing to merge should not
block signing in.


## [3.6.0] - 2026-08-11

### Added

- **Recitation audio.** Tapping an ayat number plays it. The audio URLs have been in the
  `ayats` table since it was seeded — all 6,236 of them — but nothing ever used them.
  One player is reused across ayats, so tapping another switches rather than overlapping,
  and playback stops when the screen is left.
- **Bookmarks.** A star on each ayat, stored with the sura and page so a bookmark can be
  returned to.
- **Continue reading.** The sura list offers a card back to wherever the reader last got
  to; position is recorded on every page change.
- **Reading options** — Arabic font size across four steps, and independent toggles for
  the Bangla, English and meaning lines. Meaning is off by default, since most readers
  want the translation rather than the word gloss.
- `npm run check:reader` — 24 checks, wired into CI.

### Changed

- Arabic renders right-to-left with looser line height, and empty translation lines are
  hidden rather than leaving blank panels.

### Note

Reader preferences, bookmarks and reading position live outside the cache layer, since
they are user data rather than cached API content. A test asserts they survive
`clearAll()` and the legacy purge.


## [3.5.0] - 2026-08-11

> Requires backend **2.5.0**, which adds `GET /api/geocode`.

### Security

- **The Google Maps key is gone from the app bundle.** `HeaderArea` called the Geocoding
  API directly with the key inlined, where anyone could extract it from a shipped build.
  It now goes through the backend proxy, and `VITE_BASE_KEY` is no longer read anywhere.
  Verified: no `AIzaSy` string and no `maps.googleapis.com` call remain in `dist/`.

  ⚠️ **The old key still needs rotating** — it is in git history and in every build
  already released.

### Added

- **District suggestion.** The proxy matches the detected location against the districts
  table, so the home screen can offer "Show prayer times for Sylhet?" instead of leaving
  the user to find their district in the Settings picker. Accepting it saves the district
  and clears the district-scoped caches; declining leaves everything as it was.

### Changed

- The location label prefers the matched district name over the raw geocoded locality,
  so it matches the district actually driving the times.


## [3.4.0] - 2026-08-11

> Requires backend **2.4.0**, which renames the masala columns and paginates
> `GET /api/masala`. Will not work against an older backend.

### Added

- **A browsable Masa-el library.** `/masala` was a single flat list; it is now a nested
  section:

  | Route | Screen |
  |---|---|
  | `/masala` | the nine fiqh categories, with a search box |
  | `/masala/:categoryId` | paginated masa-el in a category |
  | `/masala/search?q=` | paginated search results |
  | `/masala/detail/:id` | one masala, question and answer |

- Search across question and answer, with the API's two-character minimum reflected in
  the submit button's disabled state.
- Pagination matching the hadith and Surah screens, with the page synced into the route
  query so a reload restores position.
- The detail screen presents the question in a filled header card and the answer beneath,
  preserving line breaks, with the source reference below.

### Changed

- `src/screens/Masala.vue` is replaced by `src/screens/masala/` — `Categories`,
  `Masalas` and `SingleMasala`.
- Categories are cached for a week through the shared cache layer.
- Category headings prefer Bangla and fall back to English.


## [3.3.0] - 2026-08-11

### Fixed

- **Cached content never expired.** Every screen wrote its own `localStorage` key with
  no TTL and no invalidation, so once a screen had cached, it never called the API
  again. `Home.vue` even wrote a `calendarTimestamp` it never read back. A device could
  show **last month's prayer times indefinitely**, and content corrected in admin would
  never reach it.

### Added

- `src/services/cache.js` — one namespaced, versioned cache with per-content TTLs:
  prayer calendars expire after a day (dated content), scripture and duas after a week
  (long enough to be useful offline, short enough that a correction lands within days).
- **Stale-while-offline.** When a request fails and expired content exists, the expired
  content is served rather than failing the screen. That is what makes the app usable
  without a connection; previously a failed request left an empty screen.
- Corrupt or older-version entries are detected and dropped rather than crashing a screen.
- A one-off purge of the pre-cache ad-hoc keys on startup, so they don't sit on device
  forever. Settings and tasbih counters are deliberately preserved.
- `npm run check:cache` — 24 checks, wired into CI.

### Changed

- Home, Ramadan calendar, Surah list, Dua categories and Asma-Ul-Husna all read through
  the cache layer.
- Changing district clears the namespaced calendar caches, as before.
- `clearAll()` iterates `localStorage` via `length` / `key(i)` rather than
  `Object.keys(localStorage)`, which relies on browser-specific behaviour.


## [3.2.0] - 2026-08-11

> Requires backend **2.3.0**. Reminders fire at whatever times the API returns, so the
> mazhab-offset correction must be deployed first — otherwise every reminder is 15
> minutes late.

### Added

- **Prayer reminders.** Local notifications for sehri end, Fajr, Zuhr, Asr, iftar,
  Maghrib and Isha, toggled per waqt, with an optional 5–30 minute lead time.
- `src/services/notifications.js` — permission handling, schedule building and the
  rolling-window rescheduler.
- `npm run check:notifications` — 21 checks over the scheduling logic.
- Android manifest permissions: `POST_NOTIFICATIONS` (required from Android 13),
  `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` (Android 12+), `RECEIVE_BOOT_COMPLETED`,
  `VIBRATE`.

### How it works

Prayer times move every day, so reminders are scheduled as a **rolling 7-day window**
rebuilt whenever the home screen loads the calendar, rather than as repeating alarms.

iOS allows only **64 pending local notifications** per app and silently drops the rest,
so the window is capped at 60. Notification ids are derived from day and waqt, so a
rebuild replaces the previous entries instead of duplicating them.

Changing district cancels pending reminders, since they were built from the previous
district's times.

### Edge cases handled

- `esha.end_time` is the string `"till subhe sadik"`, not a clock time — the parser
  rejects it rather than producing an Invalid Date.
- Waqts already past are never scheduled.
- Permission denial is surfaced in Settings rather than failing silently.


## [3.1.0] - 2026-08-11

> Pairs with backend **2.2.0** (district offsets) and **2.3.0** (the mazhab offset
> correction). Degrades safely against an older backend: `district_id` is simply ignored.

### Added

- **A Settings screen** at `/settings`, reachable from the gear icon on the home header.
  The icon existed but sat inside a commented-out block, so there was no way in.
- Division → district picker covering all 64 districts. Sehri and iftar differ by up to
  12 minutes across Bangladesh; every device previously received Dhaka's times.
- `src/services/settings.js` — one place for stored settings and the
  `calendarParams()` helper that all six calendar callers now use.
- "Use Dhaka (default)" to clear the selection.

### Fixed

- Changing district now **clears the district-scoped caches** (`calendarData`,
  `calendarTimestamp`, `Ramadan-Calender`). Without that the app would keep showing the
  previous district's times indefinitely, since those caches are never invalidated.
- `HeaderArea.getUserLocationPhone()` had no error handling around
  `Geolocation.getCurrentPosition()`. Denying the location permission threw, leaving the
  city label blank with no way to set it. It now falls back to the stored value.
- The same method read `.long_name` directly off `address_components.find(...)`, which
  throws a `TypeError` for any coordinate without a `locality` or
  `administrative_area_level_1` — common outside city centres. Now optional-chained.
- The home header shows the chosen district instead of the geocoded city, so the label
  matches the times actually being displayed.

### Not included

No mazhab picker. The backend's mazhab offsets are all zero pending a verified Asr rule —
the difference is the shadow ratio (Hanafi 2×, the others 1×), worth 30–90 minutes and
seasonal, so it cannot be a fixed offset. A selector that changed nothing, or changed
times by an unverified amount, would be worse than none.


## [3.0.0] - 2026-08-10

> Requires backend **2.0.0**, which restructures the hadith tables and changes
> `GET /api/hadith` completely. Will not work against an older backend.

### Added

- **The Siha Sittah hadith library** — 34,455 hadiths across six collections, browsable
  and searchable. `/hadith` is now a nested section rather than a single flat list:

  | Route | Screen |
  |---|---|
  | `/hadith` | the six collections, with a search box |
  | `/hadith/:bookId` | chapters of a collection |
  | `/hadith/:bookId/:chapterId` | paginated hadiths in a chapter |
  | `/hadith/search?q=` | paginated search results |
  | `/hadith/detail/:id` | one hadith in Arabic, Bangla and English |

- Search across the Bangla and English text, with the two-character minimum the API
  enforces reflected in the input's disabled state.
- Pagination controls matching the Surah reader — Previous / Next with the page synced
  into the route query, so a reload restores position.
- The single-hadith screen shows Arabic right-to-left in its own card, then Bangla and
  English, with the reference and grade in a footer.

### Changed

- `src/screens/Hadith.vue` (a flat list of two placeholder rows) is replaced by
  `src/screens/hadith/` — `Books`, `Chapters`, `Hadiths` and `SingleHadith`.
- Chapter and book headings prefer Bangla and fall back to English. The dataset ships
  English chapter names in every edition, so in practice chapter names render in English —
  the fallback is deliberate rather than a gap.
- List rows preview Bangla, falling back to English then Arabic, truncated at 220
  characters.

## [2.4.0] - 2026-08-10

> Pairs with backend **1.3.0**, which fixes `GET /ramazan-calendar` (previously 500 on
> every request) and adds a derived `iftar` to all calendar responses. Falls back
> gracefully to `magrib` against an older backend.

### Fixed

- **Iftar times were showing the Magrib time.** Every screen read `magrib.start_time` as
  a stand-in for iftar, which carries the mazhab's `magrib_time` offset rather than its
  `iftar_time`. The two are both 15 minutes in the seeded data, so the values coincided —
  but they diverge for any mazhab that configures them apart. All four call sites now use
  the API's derived `iftar`, with `magrib` as a fallback.

### Changed

- `ifter` renamed to `iftar` in `Home.vue` and `TomorrowSchedule.vue`. It was a
  locally-constructed alias (`ifter: tomorrowDaySalat[0]?.magrib`), so nothing was broken
  by the misspelling — but it obscured that the value was Magrib rather than iftar.

## [2.3.0] - 2026-08-10

### Added

- `src/services/api.js` — a single shared axios instance. All 14 screens now import it
  instead of constructing their own request with `import.meta.env.VITE_BASE_URL`
  interpolated inline at 15 separate call sites.
  - `baseURL` set once, so a relative path can no longer be used by mistake. That is
    exactly how the Hadith and Masala screens shipped broken: a relative URL resolves
    against `capacitor://localhost` in a native build.
  - 15s timeout — there was previously none, so a hung request left a screen spinning
    forever.
  - Response interceptor normalising failures to `error.status` and `error.appMessage`,
    covering HTTP errors, timeouts and unreachable-host separately.
  - `unwrap()` helper handling the `204`-with-empty-body case alongside the
    `{status, statusCode, message, data}` envelope.
- A loud console error when `VITE_BASE_URL` is unset, naming the `cp .env.example .env`
  step and the fact that Vite inlines env values at build time.

### Fixed

- Prayer-time screens crashed when the calendar API returned no data. `times.find(...)`
  and `result.find(...)` were called on `undefined`, and `TomorrowSchedule` destructured
  `.split()` off an undefined `start_time`, taking down the home screen. Five files now
  degrade to an empty view instead.

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
