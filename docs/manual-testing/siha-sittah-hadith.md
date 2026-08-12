# Manual Testing — Siha Sittah Hadith Screens

**Branch:** `feature/zrshishir/siha-sittah-hadith`
**Target:** `development`
**Version:** 3.0.0
**Backend counterpart:** zrshishir/tohfa-e-ramazan#11 (**2.0.0**) — **must be merged,
deployed and imported first.** These screens will not work against an older backend.

---

## Setup

```bash
git checkout feature/zrshishir/siha-sittah-hadith
npm install
cp .env.example .env      # point at a backend running 2.0.0 with hadith:import done
npm run build
npm run preview
```

Confirm the backend has content before starting:

```bash
curl -s "$VITE_BASE_URL/hadith-books" | jq '.data | length'   # expect 6
```

---

## What changed

`/hadith` was a single flat screen listing two placeholder rows. It is now a nested
section:

| Route | Screen |
|---|---|
| `/hadith` | the six collections, with a search box |
| `/hadith/:bookId` | chapters of a collection |
| `/hadith/:bookId/:chapterId` | paginated hadiths in a chapter |
| `/hadith/search?q=` | paginated search results |
| `/hadith/detail/:id` | one hadith in Arabic, Bangla and English |

---

## Test cases

### TC-01 — Book list

| Step | Action | Expected |
|---|---|---|
| 1 | Home → Hadith | Six collections listed |
| 2 | Check each row | Bangla name as the heading, English beneath, Arabic name on the right, author, hadith count |
| 3 | Check the counts | Bukhari 7,563 · Muslim 7,563 · Abu Dawud 5,274 · Tirmidhi 3,956 · Nasa'i 5,758 · Ibn Majah 4,341 |
| 4 | Tap a collection | Navigates to its chapters |

---

### TC-02 — Chapters

| Step | Action | Expected |
|---|---|---|
| 1 | Open Sahih al-Bukhari | 97 chapters |
| 2 | Check a row | Numbered badge, chapter name, hadith count |
| 3 | Header title | The collection's Bangla name |
| 4 | Tap a chapter | Navigates to its hadiths |
| 5 | Back arrow | Returns to the book list |

> **Chapter names render in English.** The dataset ships English chapter names in every
> edition, including the Bengali one. The backend stores null rather than labelling
> English as Bengali, and the screen falls back to English. This is expected, not a gap.

---

### TC-03 — Hadith list and pagination

| Step | Action | Expected |
|---|---|---|
| 1 | Open a chapter | Total count at the top, 20 hadiths per page |
| 2 | Check a row | Collection name + hadith number, grade if present, Bangla preview truncated at ~220 chars |
| 3 | Tap **Next** | Page 2 loads, scrolled to top |
| 4 | Check the URL | `?page=2` |
| 5 | Reload the page | Still on page 2 |
| 6 | On page 1 | **Previous** is disabled |
| 7 | On the last page | **Next** is disabled |
| 8 | Tap a hadith | Opens the detail screen |

---

### TC-04 — Search

| Step | Action | Expected |
|---|---|---|
| 1 | On `/hadith`, type one character | Search button stays disabled |
| 2 | Type `intention`, submit | Results screen, header reads `Search: intention`, ~256 matches |
| 3 | Search a Bangla word, e.g. `নিয়্যত` | Bangla results returned |
| 4 | Page through results | Pagination works as in TC-03 |
| 5 | Search something absurd, e.g. `zzzzzz` | `TheNoData`, **no error popup** |
| 6 | Tap a result | Opens the detail screen |

Step 5 matters: an empty result is a `204`, and a rejected term is a `422`. Neither
should surface the failure popup.

---

### TC-05 — Single hadith

| Step | Action | Expected |
|---|---|---|
| 1 | Open any hadith | Collection + hadith number, then chapter line |
| 2 | Arabic card | Renders **right-to-left**, larger type |
| 3 | Bangla card | Labelled বাংলা |
| 4 | English card | Labelled English |
| 5 | Footer | Reference, e.g. `Sahih al-Bukhari 1`, plus grade if present |
| 6 | A hadith with no Bangla | That card is hidden entirely — no empty box |
| 7 | Navigate to `/hadith/detail/99999999` | `TheNoData`, no error popup |

> Roughly 1–3% of entries per collection have no Bangla — chapter headings and commentary
> the dataset leaves in Arabic. Card hiding is the expected behaviour there.

---

### TC-06 — Routing edge cases

| Step | Action | Expected |
|---|---|---|
| 1 | Visit `/hadith/search?q=faith` directly | Search results, not a chapter list |
| 2 | Visit `/hadith/detail/<id>` directly | Detail screen, not a chapter list |
| 3 | Visit `/hadith/9999` | `TheNoData`, no error popup |
| 4 | Search from the results screen again | Results refresh — the component is reused, so this exercises the query watcher |

Step 1 and 2 confirm the static `search` and `detail` segments win over `:bookId`.

---

### TC-07 — Offline and failure

| Step | Action | Expected |
|---|---|---|
| 1 | Stop the backend, open `/hadith` | Error popup |
| 2 | Restart, reload | Books load |

These screens deliberately do **not** cache to `localStorage` — 34k hadiths is not a
sensible cache, and the existing ad-hoc cache keys have no invalidation.

---

### TC-08 — No regressions

| Step | Action | Expected |
|---|---|---|
| 1 | Walk every other screen | Unchanged |
| 2 | Home menu | Still 8 tiles; Hadith tile goes to the new library |
| 3 | `npm run build` / `npm run check:qibla` | Clean / 27 pass |

---

## Automated verification performed

The exact expressions each screen evaluates were run against a live 2.0.0 backend —
22 checks, all passing:

```
Books.vue          6 books, name_bn/name_ar/total_hadiths present
Chapters.vue       book + 97 chapters, name_en fallback confirmed (name_bn null)
Hadiths.vue        paginated payload, book & chapter embedded, preview() resolves
Hadiths.vue        search "intention" -> 256 matches
SingleHadith.vue   arabic + bangla + english + reference + chapter all present
Error paths        unknown book -> 404, unknown hadith -> 404, short search -> 422
```

**Build:** clean — 297 kB JS (99 kB gzip).

Browser interaction is not automated — TC-01 through TC-08 are manual.

---

## Known gaps

- **No bookmarking or sharing.** Natural next step for a reading screen.
- **No caching**, so every visit hits the network. Deliberate at this data size, but it
  means the library is unusable offline.
- **Chapter names are English only** (TC-02).
- **No "hadith of the day" card** on the home screen yet, though the backend exposes
  `GET /api/hadith-random` for exactly that.

---

## Sign-off

| Check | Result |
|---|---|
| TC-01 book list | ☐ |
| TC-02 chapters | ☐ |
| TC-03 list + pagination | ☐ |
| TC-04 search | ☐ |
| TC-05 single hadith | ☐ |
| TC-06 routing edge cases | ☐ |
| TC-07 offline/failure | ☐ |
| TC-08 no regressions | ☐ |
