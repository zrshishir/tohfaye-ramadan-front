# Manual Testing — Iftar Uses the Derived Iftar Time

**Branch:** `fix/zrshishir/iftar-field`
**Target:** `development` (stacked on `fix/zrshishir/api-base-url`)
**Version:** 2.4.0
**Backend counterpart:** zrshishir/tohfa-e-ramazan#9 (**1.3.0**) — needed for the fix to
take effect, but this PR degrades gracefully without it.

---

## What was wrong

Every screen used `magrib.start_time` as a stand-in for iftar:

| File | Was | Now |
|---|---|---|
| `Home.vue` | `ifter: tomorrowDaySalat[0]?.magrib` | `iftar: …?.iftar ?? …?.magrib` |
| `TomorrowSchedule.vue` | `tomorrow?.ifter?.start_time` | `tomorrow?.iftar?.start_time` |
| `ramadan/Calendar.vue` | `ramadan?.magrib?.start_time` | `(ramadan?.iftar ?? ramadan?.magrib)?.start_time` |
| `ramadan/SingleDate.vue` | `…?.data?.magrib?.start_time` | `(…?.data?.iftar ?? …?.data?.magrib)?.start_time` |

Magrib carries the mazhab's `magrib_time` offset; iftar has its own `iftar_time`. In the
seeded data **both are 15 minutes**, so the displayed values coincided and the bug was
invisible. They diverge for any mazhab configured otherwise.

### A correction

The `ifter` misspelling was **not** a broken lookup. `Home.vue` constructed the key
itself (`ifter: tomorrowDaySalat[0]?.magrib`), so the countdown always worked. Renaming
it to `iftar` is a clarity fix, not a bug fix — it was hiding the fact that the value was
Magrib.

---

## Setup

```bash
git checkout fix/zrshishir/iftar-field
npm install
cp .env.example .env      # point at a backend running 1.3.0
npm run build
npm run preview
```

---

## Test cases

### TC-01 — The Ramadan calendar loads at all

Only possible once backend #9 is deployed — the endpoint used to 500.

| Step | Action | Expected |
|---|---|---|
| 1 | Home → Ramadan | The 30-row calendar renders |
| 2 | Check the Sehri and Iftar columns | Both populated on every row |
| 3 | Tap a row | Single-date screen shows Sahri and Iftar |

---

### TC-02 — Iftar reflects `iftar_time`, not `magrib_time`

The values match while both offsets are 15, so separate them server-side:

```sql
UPDATE mazhab_wise_schedule_settings SET magrib_time = 30, iftar_time = 5 WHERE mazhab_id = 1;
```

With a raw magrib start of `05:27 PM`:

| Screen | Expected iftar | Wrong (would mean it is still reading magrib) |
|---|---|---|
| Ramadan calendar | `05:32 PM` | `05:57 PM` |
| Ramadan single date | `05:32 PM` | `05:57 PM` |
| Home tomorrow card | `05:32 PM` | `05:57 PM` |

Clear `localStorage` between checks — the calendar is cached. Restore afterwards:

```sql
UPDATE mazhab_wise_schedule_settings SET magrib_time = 15, iftar_time = 15 WHERE mazhab_id = 1;
```

---

### TC-03 — Home tomorrow countdown

| Step | Action | Expected |
|---|---|---|
| 1 | Open Home | Tomorrow card shows Sehri and Iftar times |
| 2 | Check the "(Left)" countdowns | Sensible hours/minutes, not `0 h 00 m` |
| 3 | Confirm no console errors | `.split()` is guarded |

---

### TC-04 — Backward compatibility

| Step | Action | Expected |
|---|---|---|
| 1 | Point `VITE_BASE_URL` at a backend **without** #9, rebuild | — |
| 2 | Open Home | Tomorrow card still shows an iftar time (falls back to `magrib`) |
| 3 | Ramadan calendar | Will still 500 — that is the backend bug #9 fixes |

The `?? magrib` fallback means this PR is safe to ship before the backend, though the
Ramadan screens stay broken until #9 lands.

---

### TC-05 — Empty data

| Step | Action | Expected |
|---|---|---|
| 1 | Point at a backend with an empty `permanent_calendars` table | — |
| 2 | Open Home | Renders, no crash |
| 3 | Open Ramadan | `TheNoData` or an empty table, no crash |

---

### TC-06 — No regressions

| Step | Action | Expected |
|---|---|---|
| 1 | `grep -rn "ifter" src` | No matches |
| 2 | Walk every screen | Unchanged |
| 3 | `npm run build` / `npm run check:qibla` | Clean / 27 pass |

---

## Automated verification performed

The exact expressions the screens evaluate were run against a live 1.3.0 backend:

```
Against the 1.3.0 API
  PASS  entry exposes iftar
  PASS  Calendar.vue / SingleDate.vue resolve a time
  PASS  resolves via iftar, not the magrib fallback
        iftar=06:50 PM  magrib=06:50 PM

Home.vue -> TomorrowSchedule.vue
  PASS  tomorrow.iftar populated
  PASS  tomorrow.sehri populated
  PASS  start_time splits as the countdown expects

Backward compatibility (pre-1.3.0 response, no iftar key)
  PASS  falls back to magrib
  PASS  no crash when both absent
```

**Build:** clean — 286 kB JS (96 kB gzip).

Note the two times coincide above because the live mazhab has both offsets at 15. TC-02
separates them; that check cannot be automated without mutating the database.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 Ramadan calendar loads | ☐ |
| TC-02 iftar_time not magrib_time | ☐ |
| TC-03 home countdown | ☐ |
| TC-04 backward compatible | ☐ |
| TC-05 empty data | ☐ |
| TC-06 no regressions | ☐ |
