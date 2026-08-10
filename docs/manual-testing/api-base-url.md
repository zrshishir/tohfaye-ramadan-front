# Manual Testing — Shared HTTP Layer

**Branch:** `fix/zrshishir/api-base-url`
**Target:** `development` (stacked on `fix/zrshishir/qibla-bearing-math`)
**Version:** 2.3.0
**Backend:** no changes required

---

## What changed

Every screen previously built its own request:

```js
import axios from 'axios';
const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/sura`);
```

15 call sites across 14 files, each reading the env var itself. No shared timeout, no
shared error handling, and nothing preventing a relative path — which is precisely how
the Hadith and Masala screens shipped broken.

Now:

```js
import api from '@/services/api';
const response = await api.get('/sura');
```

This is a **mechanical refactor**. No screen's behaviour changes except that requests now
time out after 15s and errors carry a normalised `appMessage`.

---

## Setup

```bash
git checkout fix/zrshishir/api-base-url
npm install
cp .env.example .env
npm run build
npm run preview
```

---

## Test cases

### TC-01 — Every screen still loads

Walk the whole app with the backend running. Each screen must load exactly as before:

| Screen | Endpoint |
|---|---|
| Home | `POST /permanent-calendar` |
| Time → Next Salat / Present | `POST /permanent-calendar` |
| Time → Tomorrow | `POST /permanent-calendar` |
| Time → Upcoming | `POST /permanent-calendar` |
| Al-Quraan → sura list | `GET /sura` |
| Al-Quraan → single surah | `GET /ayat/{id}?page=N` |
| Duas → categories | `GET /doa-category` |
| Duas → category duas | `GET /doa/{id}` |
| Ramadan → calendar | `GET /ramazan-calendar` |
| Ramadan → single date | `GET /ramazan-calendar` |
| Asma-Ul-Husna | `GET /asmaul-husna` |
| Tasbih | `GET /tasbih`, `PUT /tasbih/{userId}` |
| Hadith | `GET /hadith` |
| Masa-el | `GET /masala` |

> ⚠️ `GET /ramazan-calendar` currently returns **500** on `development` — a pre-existing
> backend bug, not caused by this PR. See "Known failure" below.

---

### TC-02 — No inline API construction remains

```bash
grep -rn "axios" src --include=*.vue          # expect: no matches
grep -rn "VITE_BASE_URL" src --include=*.vue  # expect: no matches
grep -rn "VITE_BASE_URL" src/services/api.js  # expect: the only reads
```

---

### TC-03 — Timeout

| Step | Action | Expected |
|---|---|---|
| 1 | Point `VITE_BASE_URL` at a black-holed address (e.g. `http://10.255.255.1/api`), rebuild | — |
| 2 | Open any screen | After ~15s the error state renders |
| 3 | Check the console | `The request timed out.` |

**Previously:** no timeout was configured, so the screen span indefinitely.

---

### TC-04 — Unreachable host

| Step | Action | Expected |
|---|---|---|
| 1 | Stop the backend, reload | Error state renders promptly |
| 2 | Console | `Could not reach the server.` |

---

### TC-05 — Missing configuration

| Step | Action | Expected |
|---|---|---|
| 1 | Build with `VITE_BASE_URL` empty | Build succeeds |
| 2 | Open the app, check the console | A clear error naming `cp .env.example .env` and the rebuild requirement |

**Previously:** requests silently went to `undefined/sura` with no explanation.

---

### TC-06 — 204 handling still correct

| Step | Action | Expected |
|---|---|---|
| 1 | Unpublish all hadiths, reload `/hadith` | `TheNoData` renders |
| 2 | Same for `/masala` | `TheNoData` renders |

The inline `response.status === 204 ? [] : ...` in both screens is now `unwrap(response)`.

---

### TC-07 — Null-guard regressions

The first commit on this branch carries null-guards that were sitting uncommitted:

| Step | Action | Expected |
|---|---|---|
| 1 | Point the app at a backend with an empty `permanent_calendars` table | — |
| 2 | Open Home | Renders empty, **no crash** |
| 3 | Open Time → Next Salat / Tomorrow / Upcoming | Render empty, no crash |
| 4 | Check the home Tomorrow card | No `.split()` of undefined |

**Previously:** `times.find(...)` on `undefined` took down the screen.

---

### TC-08 — Native build

| Step | Action | Expected |
|---|---|---|
| 1 | Set an absolute HTTPS `VITE_BASE_URL` | — |
| 2 | `./update_mobile_app.sh` | Build + sync complete |
| 3 | Relaunch on device, walk every screen | All load |

---

## Automated verification performed

**Build:** clean — 286 kB JS (96 kB gzip).

**`npm run check:qibla`:** all 27 checks still pass.

**Live endpoint sweep** — the exact paths the refactored screens now request, issued
through an axios instance configured identically to `src/services/api.js`, against a
backend on current `development`:

```
  200 Home / SalatTimes / TomorrowTimes / UpComingTime
  200 AllSurah
  200 SingleSurah
  200 Category
  200 CategoryDuas
  200 AsmaUlHusna
  ERR Calendar / SingleDate: 500      ← pre-existing backend bug
  200 Tasbih (get)
  200 Hadith
  200 Masala
```

---

## Known failure — pre-existing, not from this PR

`GET /api/ramazan-calendar` returns **500** on current `development`:

```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'iftar' in 'field list'
select `id`, `day`, `month_id`, `sehri`, `magrib`, `iftar` from `permanent_calendars`
```

`permanent_calendars` has no `iftar` column — iftar is derived from `magrib`. The Ramadan
calendar and single-date screens are therefore both dead. Being fixed separately, as a
paired backend + frontend change; the frontend also reads a non-existent `ifter` key in
`TomorrowSchedule.vue`, which is why the home screen's iftar countdown shows `0h 00m`.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 all screens load | ☐ |
| TC-02 no inline construction | ☐ |
| TC-03 timeout | ☐ |
| TC-04 unreachable host | ☐ |
| TC-05 missing config | ☐ |
| TC-06 204 handling | ☐ |
| TC-07 null guards | ☐ |
| TC-08 native build | ☐ |
