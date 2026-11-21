# Akaora Meet — Compact screen-sharing options (21 November 2026)

This build is based on the latest official Akaora Meet logo and the previously tested light-theme UI.

- Removed the large persistent screen-sharing controls from the meeting header.
- When this client is **actively sharing its own screen**, a compact **Presenting options** button appears over the upper-right corner of the presentation tile. Clicking it reveals:
  - Presentation audio on/off (when the chosen capture source offers audio)
  - Fit / Fill shared screen
  - Stop presenting
- The menu closes on a click outside, Escape or when the active presenter stops sharing.
- **Only the local presenter** can see this menu and its controls. Remote viewers continue to see the shared screen and existing pin/fullscreen controls.
- SVG icons, the Akaora navy-orange glass UI, responsive layouts and logo assets are preserved.
- Corrected a lingering light-theme background image in the live meeting header and call controls.

## Testing

- Static source checks and JavaScript syntax check passed.
- Chromium simulated desktop at 1366 px, mobile at 390 px and 320 px: menu visibility, open/close, keyboard Escape, viewer restrictions and horizontal-overflow checks passed.
- Light/dark theme switch and header/call dock color checks passed.
- **Live multi-device WebRTC media and Firebase were not revalidated**; test on the actual deployed site before production rollout.

## Run locally

Extract the archive, open `akaorameet-main`, and run `start website.bat` on Windows with Python 3 installed. Open `http://localhost:4173/`.
