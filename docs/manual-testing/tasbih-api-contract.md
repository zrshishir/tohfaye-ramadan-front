# Manual Testing — Tasbih Persistence & Reset Logic

**Branch:** `fix/zrshishir/tasbih-api-contract`
**Target:** `development` (stacked on `fix/zrshishir/hadith-masala-integration`)
**Version:** 2.1.0
**Backend counterpart:** zrshishir/tohfa-e-ramazan#8 — **must be merged and deployed first**

---

## Setup

```bash
git checkout fix/zrshishir/tasbih-api-contract
npm install
cp .env.example .env      # point VITE_BASE_URL at a backend running the 1.2.0 API
npm run build
npm run preview
```

Before each run, clear the old cache so a legacy value doesn't mask behaviour:

```js
localStorage.removeItem('tasbih')
```

---

## What was broken

| # | Issue | Symptom |
|---|---|---|
| 1 | Nothing was ever written back — no API call, no `localStorage` write after a tap | **Every count lost on leaving the screen** |
| 2 | `lastResetTimestamp` / `currentMonth` / `currentYear` used but never declared in `data()` | Daily reset compared against `undefined` → `NaN` → `today_count` never reset |
| 3 | Same as #2 | `monthly_count` / `yearly_count` zeroed on the first tap of every visit → pinned at 1 |
| 4 | Once cached, the screen never called the API again | Dhikr list changes in admin never reached the device |
| 5 | `JSON.parse()` on `data.tasbih` | Throws now that the API returns a real array |
| 6 | `localStorage.setItem('tasbih', <array>)` | Would store `"[object Object],..."` |
| 7 | `TheNoData` gated on `tasbihs === 0` | Empty state could never render |

---

## Test cases

### TC-01 — Counts survive leaving the screen (the headline bug)

| Step | Action | Expected |
|---|---|---|
| 1 | Open Tasbih | Six dhikrs render with counts at 0 |
| 2 | Tap **Subhanallah** 5 times | Counter reads `5/33`, Today `5`, Monthly `5`, Yearly `5`, Total `5` |
| 3 | Wait ~2s, then navigate back to home | — |
| 4 | Re-open Tasbih | **All five counts still read 5** |
| 5 | Fully reload the app (`Cmd-R` / relaunch) | Counts still 5 |
| 6 | `localStorage.removeItem('tasbih')`, reload | Counts still 5 — they came back from the **server** |

Step 6 is the real proof: previously nothing ever reached the API.

---

### TC-02 — Monthly and yearly counters are not pinned at 1

| Step | Action | Expected |
|---|---|---|
| 1 | Clear the cache, reload, open Tasbih | — |
| 2 | Tap any dhikr 3 times | Monthly `3`, Yearly `3` |
| 3 | Leave the screen and come back | Monthly `3`, Yearly `3` |
| 4 | Tap once more | Monthly `4`, Yearly `4` |

**Previously:** step 2 gave Monthly `1`, and step 4 reset it back to `1` again.

---

### TC-03 — Counter wrap at `reset_on`

| Step | Action | Expected |
|---|---|---|
| 1 | Tap Subhanallah (`reset_on` 33) 33 times | Big counter wraps to `0` |
| 2 | Check Today / Total | `33` — **not** reset by the wrap |
| 3 | Tap Astagfirullah (`reset_on` 0) 5 times | No `/n` suffix shown, counter reads `5`, never wraps |

---

### TC-04 — Daily rollover

Simulating a new day without waiting:

```js
const c = JSON.parse(localStorage.getItem('tasbih'));
c.lastCountedDay = '2000-01-01';
localStorage.setItem('tasbih', JSON.stringify(c));
```

| Step | Action | Expected |
|---|---|---|
| 1 | Run the snippet, reload, open Tasbih | Today and the big counter reset to `0` |
| 2 | Check Monthly / Yearly / Total | **Unchanged** |

**Previously:** the daily reset never fired at all.

---

### TC-05 — Monthly / yearly rollover

Same trick with `lastCountedMonth` (set to a different month) and `lastCountedYear`.

| Check | Expected |
|---|---|
| New month | Monthly resets to 0; Yearly and Total unchanged |
| New year | Yearly resets to 0; Total unchanged |

---

### TC-06 — Server owns the list, device owns the counters

| Step | Action | Expected |
|---|---|---|
| 1 | Tap a few dhikrs, leave the screen | Counts saved |
| 2 | In Filament admin, add a 7th dhikr to the row | — |
| 3 | Re-open Tasbih | 7 dhikrs render; **existing counts preserved**, new one starts at 0 |
| 4 | In admin, change a dhikr's `reset_on` | Re-opening reflects the new value, counts intact |

**Previously:** the cache was never refreshed, so steps 2–4 were invisible to the device.

---

### TC-07 — Offline behaviour

| Step | Action | Expected |
|---|---|---|
| 1 | Tap a few times, leave the screen (counts sync) | — |
| 2 | Stop the backend | — |
| 3 | Re-open Tasbih | Cached counts render; **no error popup** |
| 4 | Tap a few more times | Counter responds; console logs a sync failure |
| 5 | Restart the backend, leave and re-open | Counts sync up |

---

### TC-08 — Legacy cache value

| Step | Action | Expected |
|---|---|---|
| 1 | `localStorage.setItem('tasbih', '[{"text_en":"x"}]')` (old bare-array format) | — |
| 2 | Reload, open Tasbih | Screen loads normally, no crash — the stale value is detected and discarded |

---

### TC-09 — Empty state

| Step | Action | Expected |
|---|---|---|
| 1 | Delete the row: `DELETE /api/tasbih/1` | — |
| 2 | Clear the cache, reload, open Tasbih | `TheNoData` renders — **not** the error popup |
| 3 | Re-seed and reload | Six dhikrs return |

---

### TC-10 — No regressions

| Step | Action | Expected |
|---|---|---|
| 1 | Visit every other screen | All load as before |
| 2 | Native build via `./update_mobile_app.sh` | Tasbih works on device, counts persist across a full app restart |

---

## Automated verification performed

**Build:** clean — 282 kB JS (95 kB gzip).

**Round-trip check against a live backend** running the 1.2.0 API. The counting and reset
functions were replicated verbatim from `Tasbih.vue` and exercised against real responses:

```
Fetch
  PASS  data.tasbih is an array (no JSON.parse needed)
  PASS  six dhikrs returned
Counting
  PASS  count / today_count incremented to 5
  PASS  monthly_count is 5, not stuck at 1
  PASS  yearly_count is 5, not stuck at 1
Wrap at reset_on
  PASS  count wrapped to 0 at 33
  PASS  total_count kept climbing past the wrap
Day rollover
  PASS  today_count reset on a new day
  PASS  total_count untouched by the day reset
Month rollover
  PASS  monthly_count reset on a new month
Sync to server
  PASS  PUT returns 200
  PASS  counters actually persisted server-side
```

Browser-level interaction was **not** automated — TC-01 through TC-10 are manual.

---

## Known limitation

The API is unauthenticated and every device writes to `user_id = 1`. Two devices pointed
at the same backend will overwrite each other's counters, last-write-wins. Acceptable
while the API is internal; real isolation needs the auth work.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 counts persist | ☐ |
| TC-02 monthly/yearly correct | ☐ |
| TC-03 wrap | ☐ |
| TC-04 daily rollover | ☐ |
| TC-05 monthly/yearly rollover | ☐ |
| TC-06 server list merge | ☐ |
| TC-07 offline | ☐ |
| TC-08 legacy cache | ☐ |
| TC-09 empty state | ☐ |
| TC-10 no regressions | ☐ |
| `npm run build` clean | ☐ |
