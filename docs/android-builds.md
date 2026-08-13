# Building the Android app

## Getting an APK

Actions tab → **Build Android APK** → **Run workflow**.

| Input | Default | Notes |
|---|---|---|
| `api_base_url` | `https://prayerpulse.tazqiah.com/api` | Compiled into the bundle. Point it at a staging or local URL to test against something else. |
| `build_type` | `debug` | `debug` is signed with Android's debug key and installs immediately. `release` is unsigned unless the signing secrets are set. |

The APK appears under **Artifacts** on the finished run, kept for 30 days. The run summary
records the API it targets, the version, the targetSdk, and whether it is signed.

Nothing needs installing locally — the runners already have the JDK and Android SDK. The
workflow also runs on any pull request touching `android/`, so a change that breaks the
build is caught in review rather than the next time someone needs a build.

### Installing it

Transfer the APK to the device and open it. Android will ask you to allow installs from
the source; the build is signed with the standard debug key, which is fine for sideloading
but **cannot** go to the Play Store.

If the app is already installed with a different signature, uninstall it first — Android
refuses to replace an app signed with a different key.

---

## Google Play: this app cannot currently be published

**`targetSdkVersion` is 33. That is below Google Play's floor.**

From **31 August 2026**, new apps and updates must target **API 36** (Android 16), and
existing apps must target **API 35** to remain available to new users on newer devices. An
extension can be requested until **1 November 2026**.

- [Target API level requirements — Play Console Help](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- [Google Play target API requirements for 2026 — Median.co](https://median.co/blog/google-plays-target-api-level-requirement-for-android-apps)

### What closing the gap involves

Not a one-line change. `targetSdkVersion` is set in `android/variables.gradle`, but
Capacitor pins what the native project can actually support:

| | Now | Needed |
|---|---|---|
| `@capacitor/core`, `@capacitor/android` | 5.7.x | 7.x |
| `targetSdkVersion` | 33 | 36 |
| `compileSdkVersion` | 33 | 36 |
| Android Gradle Plugin / Gradle | 8.0.2 | Newer, per Capacitor 7 |
| JDK | 17 | 21 |

Every Capacitor plugin has to move in step — `@capacitor/geolocation`,
`@capacitor/local-notifications`, `@capacitor/preferences`, `@capacitor/app`. The
notification plugin matters most here, because prayer reminders are scheduled through it
and Android 13+ tightened both the runtime notification permission and exact-alarm
scheduling.

This is its own piece of work with its own device QA pass, which is why it is not bundled
with the APK workflow.

---

## Signing

No key material is committed, and `android/.gitignore` now actually enforces that — the
`*.jks` and `*.keystore` lines shipped commented out, so a keystore dropped into the
directory would have been committed.

> **If the app is already on Google Play, the original keystore is the only one that can
> ever update that listing.** It cannot be rotated or recovered. A new key means a new app
> entry, and every existing user has to find and install it again.
>
> Confirm which keystore was used before generating anything.

### Wiring up a keystore

`android/app/build.gradle` reads four Gradle properties and only enables signing when they
are present, so an unsigned build still succeeds rather than failing confusingly.

**In CI** — set four repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -i your.keystore \| pbcopy` |
| `ANDROID_KEYSTORE_PASSWORD` | Store password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

Then run the workflow with `build_type: release`.

**Locally** — put them in `~/.gradle/gradle.properties`, never in this repository:

```properties
RELEASE_STORE_FILE=/absolute/path/to/your.keystore
RELEASE_STORE_PASSWORD=...
RELEASE_KEY_ALIAS=...
RELEASE_KEY_PASSWORD=...
```

### For the Play Store specifically

Google Play takes an **AAB**, not an APK — `./gradlew bundleRelease`. The workflow builds
APKs because those are what you can sideload for testing. Adding a bundle step is trivial,
but pointless until the targetSdk gap is closed.

---

## Building locally instead

Only worth it if you want to iterate without pushing. You need a JDK 17 and the Android
SDK; neither is currently installed on the dev Mac.

```bash
brew install --cask temurin@17
brew install --cask android-commandlinetools

export ANDROID_HOME="$HOME/Library/Android/sdk"
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
sdkmanager --licenses

npm ci
echo "VITE_BASE_URL=https://prayerpulse.tazqiah.com/api" > .env
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## The version numbers

`android/app/build.gradle` carries `versionCode 2` / `versionName "2.0.0"`, and neither has
moved during this work. `versionCode` must increase for every Play Store upload; it is
irrelevant for sideloading. Bump both deliberately when a store release is actually being
prepared, rather than drifting them now.
