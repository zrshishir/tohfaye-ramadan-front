# Changelog

All notable changes to the Tohfa-e-Ramazan app (Prayer Pulse) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
