# Manual Testing — Hadith & Masala Screens

**Branch:** `fix/zrshishir/hadith-masala-integration`
**Target:** `development` (stacked on `feature/zrshishir/final-touch-for-release`)
**Version:** 2.0.1
**Backend counterpart:** zrshishir/tohfa-e-ramazan#7 — **must be merged and deployed first**

---

## Setup

```bash
git checkout fix/zrshishir/hadith-masala-integration
npm install
cp .env.example .env      # set VITE_BASE_URL to the API you are testing against
npm run build
npm run preview
```

> Vite inlines env values at **build** time. After editing `.env` you must rebuild —
> restarting the preview server alone will not pick up the change.

---

## What changed

| Before | After |
|---|---|
| `axios.get('/api/hadith')` — relative path, worked only behind the dev Vite proxy | `axios.get(\`${VITE_BASE_URL}/hadith\`)` |
| `this.hadiths = response.data` — assigned the whole envelope | `response.data.data`, with a `204` guard |
| Rendered `hadith.text`, `hadith.narrator`, `hadith.source` | Renders `title`, `description`, `reference` |
| Rendered `item.question`, `item.answer` | Renders `title`, `description`, `reference` |
| Bespoke layout with `glass-panel` / `gold-text` | Shared `TheHeader` / `TheLoading` / `TheError` / `TheNoData` |
| No way to reach `/hadith` or `/masala` from the UI | Two new home-screen tiles |

---

## Test cases

### TC-01 — Reaching the screens from the home menu

| Step | Action | Expected |
|---|---|---|
| 1 | Open the app home screen | Menu now shows **8** tiles in a 3-column grid: Al-Quraan, Dua, Ramadan, Tasbih, Kibla, Asma-Ul-Husna, **Hadith**, **Masa-el** |
| 2 | Check the two new icons | Render at the same size as the other six, same green fill |
| 3 | Tap **Hadith** | Navigates to `/hadith` |
| 4 | Tap back, then tap **Masa-el** | Navigates to `/masala` |

**Regression guarded:** both routes existed but were unreachable from the UI.

---

### TC-02 — Hadith screen renders content

| Step | Action | Expected |
|---|---|---|
| 1 | Open `/hadith` | Loading state shows the Hadith icon and title |
| 2 | Wait for the response | A card per hadith |
| 3 | Inspect a card | Bold **title**, body **description**, green footer bar with `— reference` |
| 4 | Confirm nothing is blank | Previously every card rendered empty because the field names did not match the API |
| 5 | Tap the back arrow in the header | Returns to the previous screen |

---

### TC-03 — Masa-el screen renders content

Same as TC-02 against `/masala`. Header reads **Masa-el**.

---

### TC-04 — Empty state (204)

| Step | Action | Expected |
|---|---|---|
| 1 | In the backend, set every hadith to `status = false` | — |
| 2 | Reload `/hadith` | `TheNoData` renders ("No Data Found."), **no console error** |
| 3 | Restore `status = true` | Cards return |

The API returns `204 No Content` with an **empty body**, so `response.data` is an empty
string rather than an envelope. The screens check `response.status === 204` explicitly.

---

### TC-05 — Error state

| Step | Action | Expected |
|---|---|---|
| 1 | Stop the backend, or point `VITE_BASE_URL` at an unreachable host, and rebuild | — |
| 2 | Open `/hadith` | `TheError` popup renders |
| 3 | Confirm `TheNoData` does **not** also render | Only one state is shown at a time |
| 4 | Repeat for `/masala` | Same |

---

### TC-06 — Native build (the original bug)

This is the case the old code could never pass: in Capacitor the origin is
`capacitor://localhost`, so a relative `/api/hadith` request resolved against the app
bundle and failed.

| Step | Action | Expected |
|---|---|---|
| 1 | Set `VITE_BASE_URL` to a reachable **absolute** API URL |  — |
| 2 | `./update_mobile_app.sh` | Build + `npx cap sync` complete |
| 3 | Fully close and relaunch the app on device/emulator | — |
| 4 | Open Hadith and Masa-el | Content loads |

---

### TC-07 — No regressions elsewhere

| Step | Action | Expected |
|---|---|---|
| 1 | Visit every other screen from the home menu | All load as before |
| 2 | Check the home grid layout with 8 tiles | Wraps cleanly, no overflow, on a small phone viewport |
| 3 | `grep -rn "axios.get('/api" src` | No matches — no relative API calls remain anywhere |

---

## Automated verification performed

**Build:** clean — 151 modules, 281 kB JS (94 kB gzip).

**Contract check against a live backend** running the `fix/zrshishir/hadith-masala-integration`
Laravel branch. The exact expression used by both screens
(`response.status === 204 ? [] : (response.data?.data ?? [])`) was applied to real responses:

```
Hadith — GET /hadith
  PASS  envelope unwraps to an array
  PASS  item exposes "id" / "title" / "description" / "reference" / "status"
  PASS  status is a real boolean
  PASS  no legacy field "text"/"question" present
  → rendered title: "Fasting is a Shield"
  → rendered reference: "Sahih Bukhari"

Masala — GET /masala
  (same, all PASS)
  → rendered title: "Intention for Fasting"

204 handling
  PASS  204 with empty body yields []
  PASS  malformed body yields []
```

Browser-level rendering was **not** automated — TC-01 through TC-07 above are manual.

---

## Out of scope

- Detail screens for `/hadith/{id}` and `/masala/{id}` — the backend endpoints exist and are
  unused for now; the list view carries the full text.
- Offline caching — these two screens deliberately do **not** write to `localStorage`. The
  existing ad-hoc cache keys have no invalidation, and a shared cache helper is planned
  separately rather than adding a seventh one here.
- Categories, pagination and search — these arrive with the Siha Sittah / Masala library work.
- `.glass-panel` and `.gold-text` (added in the previous PR) are now unused and get purged
  from the CSS bundle. Left in place in case they are intended for upcoming screens.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 menu tiles | ☐ |
| TC-02 hadith renders | ☐ |
| TC-03 masala renders | ☐ |
| TC-04 empty state | ☐ |
| TC-05 error state | ☐ |
| TC-06 native build | ☐ |
| TC-07 no regressions | ☐ |
| `npm run build` clean | ☐ |
