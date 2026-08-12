#!/bin/bash
echo "Rebuilding Vue app with new .env variables..."
npm run build

echo "Syncing new web assets to Capacitor (Android/iOS)..."
npx cap sync

echo "Done! Please completely close the app on your mobile emulator/device and run it again from Android Studio / Xcode."
