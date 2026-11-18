# `permission_denied` fix — AkaoraMeet (localhost)

## Problem
The toast `permission_denied` is from **Firebase Realtime Database**, not Windows/Chrome microphone or webcam permission. Clicking **Allow** for mic/camera will not grant Firebase database access.

## Required Firebase Console action (project owner)

1. Open https://console.firebase.google.com/ and select **akaora-meet**.
2. Go to **Build → Realtime Database** (not Cloud Firestore) and select the database `akaora-meet-default-rtdb`.
3. Open the **Rules** tab. Compare with `database.rules.json` in this ZIP. For local testing only, paste the file's rules and click **Publish**. Do **not** change root `.read` or `.write` to `true` to bypass the error.
4. Retry **Create Meeting Now** using `http://localhost:4173/` (hard refresh `Ctrl + Shift + R`).
5. If it still says `permission_denied`, inspect **App Check → Realtime Database**. If enforcement is enabled, the localhost client must be registered/configured to provide a valid App Check token; debug tokens are for development only. Also verify the `databaseURL` in `firebase-config.js` matches the database being edited.
6. Open browser **DevTools → Console** if there is another error. Look at its `code` / `message` and distinguish `permission_denied` from `NotAllowedError`, `NotReadableError`, or `NotFoundError`.

## Important security warning
The bundled `database.rules.json` allows anonymous read/write to room IDs matching a pattern, so it is a **development/test policy**, not a production security configuration. Any person who learns a room ID may access or alter that room's signaling data. Host-only actions are not securely enforced server-side. Before publishing a production meeting service, add proper authenticated identities, ownership/role checks and data validation to Firebase rules, and configure App Check and reliable TURN service.

## Local website
Extract the ZIP and double-click **start website.bat** in the `akaorameet-main` folder. The website opens `http://localhost:4173/`. The BAT file only serves the website; it **does not change Firebase's server-side security rules**.

## Code improvements in this build
- Shows a specific Firebase database access warning instead of an opaque `permission_denied` toast.
- Shows a Firebase Console link in Create Meeting screen and helpful instructions in Join Meeting flow.
- Camera and microphone are requested independently, so one device failure does not prevent the other from working.
- Distinguishes media device busy/not found/permission failures from Firebase failures.
- Fixes the dark-theme `Optional permissions` heading contrast.
