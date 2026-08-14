# Device QA — Capacitor 8 / targetSdk 36

**Branch:** `feature/zrshishir/capacitor-8-targetsdk-36`
**Target:** `development`
**Version:** 4.0.0

Everything here needs a **real Android device**. An emulator will not tell you the truth
about notification delivery, doze behaviour or the compass.

Grab the APK from the PR's workflow run → Artifacts. **Uninstall any previous build
first** — the package rename means Android treats it as a different app.

---

## Why this pass matters more than usual

Three majors of Capacitor, and the two areas Android tightened most in exactly that window
are the two this app depends on:

| Android version | What changed | What it affects here |
|---|---|---|
| 13 (API 33) | `POST_NOTIFICATIONS` became a runtime permission | Every prayer reminder |
| 12 (API 31) | Exact alarms need `SCHEDULE_EXACT_ALARM` and user consent | Reminder accuracy |
| 14 (API 34) | Exact-alarm policy tightened further | Reminder accuracy |

The app schedules a rolling window of local notifications. If permission handling is wrong,
the failure is silent — no crash, no error, the reminders simply never arrive. Nobody
notices until a prayer is missed.

---

## 1. Notification permission — the important one

Test on a device running **Android 13 or newer**.

| # | Step | Expected |
|---|---|---|
| 1.1 | Fresh install, open the app, reach a screen that schedules reminders | System prompt asks for notification permission |
| 1.2 | **Deny** it | No crash, no blank screen. The app stays usable |
| 1.3 | With permission denied, use the app normally | Everything except reminders works |
| 1.4 | Grant it later via system settings, reopen | Reminders schedule without a reinstall |
| 1.5 | Fresh install, **allow** at the prompt | Reminders schedule |

1.2 is the one that catches a bad upgrade. The old plugin resolved the permission promise
differently, and code that assumed it always resolves can hang or throw on denial.

---

## 2. Reminders actually firing

| # | Step | Expected |
|---|---|---|
| 2.1 | Set a reminder a few minutes out, lock the phone, wait | Notification arrives **at the right minute** |
| 2.2 | Same, with the app force-stopped | Still arrives |
| 2.3 | Leave the device idle an hour, then check | Still arrives — doze has not swallowed it |
| 2.4 | Reboot, wait for the next reminder | Still arrives (`RECEIVE_BOOT_COMPLETED`) |
| 2.5 | Check Settings → Apps → Prayer Pulse → Alarms & reminders | Permission present and enabled |

2.1 is about **accuracy**, not just delivery. An inexact alarm can drift by many minutes,
which for sehri or iftar is the difference between useful and harmful.

---

## 3. Location and Qibla

| # | Step | Expected |
|---|---|---|
| 3.1 | Open the Qibla compass, grant location | Gets a fix, bearing points sensibly |
| 3.2 | **Deny** location | Handled gracefully — a message, not a spinner forever |
| 3.3 | Compare the bearing against a known qibla direction for your city | Within a few degrees |
| 3.4 | Home screen header resolves your district | Correct district shown |

The Qibla maths is covered by `npm run check:qibla` (27 assertions), so 3.3 is checking the
sensor and permission path, not the formula.

---

## 4. Storage and general regression

The storage permissions were removed in this release. Nothing should depend on them, but
confirm:

| # | Step | Expected |
|---|---|---|
| 4.1 | Increment a tasbih counter, force-stop, reopen | Count persisted (`Preferences`) |
| 4.2 | Bookmark an ayat, reopen | Bookmark persisted |
| 4.3 | Change reader settings, reopen | Settings persisted |
| 4.4 | Android back button on the home screen | Exits the app (`App.addListener`) |
| 4.5 | Go offline, open a previously visited screen | Cached content still shows |
| 4.6 | Every screen: Home, Quran, Dua, Hadith, Masa-el, Ramadan, Tasbih, Qibla, Settings | Loads, no blank screens |

4.6 matters because a WebView change across three majors can surface as one screen failing
while the rest are fine.

---

## 5. Older devices

`minSdk` moved 22 → 24, dropping Android 5.0 and 5.1.

| # | Step | Expected |
|---|---|---|
| 5.1 | Install on the oldest device you have | Installs and runs, if it is Android 7.0+ |
| 5.2 | On an Android 6 or older device | Play would refuse to offer it; sideload fails |

There is no way to reach targetSdk 36 and keep Lollipop — it is the Capacitor 8 floor.

---

## Before submitting to Play

- [ ] **Decide on `USE_EXACT_ALARM`.** It is Play-restricted: it grants exact alarms without
      the user opting in, and Google limits it to apps whose core function is alarms, clocks
      or calendars. A prayer-reminder app is a plausible fit, but expect to justify it at
      review. Dropping it and relying on `SCHEDULE_EXACT_ALARM` alone means the user grants
      "Alarms & reminders" by hand — more friction, less review risk.
- [ ] Bump `versionCode` and `versionName`. Still 2 / 2.0.0; `versionCode` must increase for
      every upload.
- [ ] Build an **AAB** (`./gradlew bundleRelease`), not an APK — Play takes bundles.
- [ ] Confirm the signing keystore for the new Makrosh account, and back it up somewhere you
      will still have in five years. It cannot be rotated for an existing listing.
- [ ] Confirm the run summary shows `targetSdk 36`, read from the APK's own manifest.
