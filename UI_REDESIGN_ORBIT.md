# Akaora Meet — ORBIT Edition (UI Redesign)

A distinctive graphite-and-lime visual system, keeping the previous working meeting logic and localhost launcher.

## UI improvements
- New cinematic homepage with editorial headline, SVG brand icon, studio-inspired hero, and an Unsplash **real photograph** (loaded over the internet).
- Clearer Create Meeting and Join Meeting forms, with a unique room-code display and microphone/camera controls.
- Rebuilt live meeting chrome, high-contrast video tile styles, a 9-action floating call dock, and redesigned room link controls.
- Matching dark chat, participants, notes, device settings, More, invite, waiting-room and feedback panels.
- Improved small-screen spacing and tap targets, fixed mobile grid/header overflow.
- Light-theme toggle remains available; the actual in-call stage stays dark for video legibility.

## Functionality retained
Existing app.js functions, Firebase database signaling, WebRTC peer connections, screen sharing, chat, raised hands, reactions, participant approval, reconnect and meeting stability logic were intentionally left alone. Only the default theme for new users is changed to dark.

## Run locally on Windows
1. Extract the archive.
2. Double-click `start website.bat` inside `akaorameet-main`.
3. Open `http://localhost:4173/` if it does not open automatically.
4. Keep the Command Prompt open; press Ctrl+C to stop.

Python 3 must be installed. Existing Firebase Realtime Database rules and network connectivity still determine live meeting access. Real WebRTC calls across different networks can require a TURN service; the redesign doesn't change that requirement.

## Validation
- HTML checked for duplicate IDs: none.
- `node --check app.js`: passed.
- Chromium desktop/mobile UI simulation: home, create form, create room, More panel, close panel; zero JS errors and zero horizontal overflow.
- Two-user Firebase-disconnect/reconnect and >4 minute clock simulated stability regression: passed.
- Two-user mock WebRTC audio/video and screen-share propagation regression: passed.
- Actual remote network live calls and photography loading were not verified in this environment.

## File note
`redesign.css` is the new presentation layer, loaded after `styles.css` so future UI changes are easy to isolate. All important IDs and data attributes in `index.html` are preserved.

External assets: the hero image is loaded from images.unsplash.com and fonts from Google Fonts when online. Those services are not bundled for offline use; system fonts and a gradient photo fallback remain visible without access.
