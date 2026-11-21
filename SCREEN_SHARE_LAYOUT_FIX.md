# Screen-sharing stage layout fix — 20 Nov 2026

The previous theme inherited contradictory screen-share layout rules. When `#videoGrid` acquired `data-pin-count="0"` during a live presentation, its computed height could collapse to **2px**, moving call controls above a blank stage. The signature presentation fix ensures:

- a height-constrained meeting viewport with a real flexing stage;
- a full-height, absolutely positioned `#videoGrid` for every data-layout/data-pin-count mode;
- visible remote/local preview thumbnails and bottom-fixed controls;
- a responsive presentation HUD and unclipped room code;
- an explicit `play()` attempt for local screen preview;
- a priority rule keeping the active screen visible even when Max Tiles = 1.

`presentation-fix.css` loads after all previous theme files. This package retains the existing WebRTC/Firebase source, and the updated BAT localhost launcher.

## Test

Run `start website.bat` and use `http://localhost:4173/`. Open two browser windows, create and join a room, then share a tab/window. Verify presentation stays within the stage and controls remain at the bottom. For sharing with other devices use HTTPS and configured TURN where necessary.

## Local browser validation

Automated Chromium tests used a simulated canvas-backed capture stream to exercise actual Start/Stop Screen Sharing, local screen-video playback, a late-joining participant preview, and Max Tiles = 1 behavior. Tested at 1791 × 864, 768 × 900, 390 × 844, and 320 × 700. All local checks passed. Firebase cross-device transmission and TURN/NAT connectivity were not retested.
