# AkaoraMeet — Screen sharing visible to all participants

## Issue

The earlier mesh call used separate WebRTC media sections for microphone, system/tab audio, camera, and screen, but the remote `ontrack` handler added all incoming audio/video to the participant camera stream. The viewer's presentation tile was never populated for mesh peers, so the presenter saw their local screen while others saw no screen tile.

## Fix

- Remote WebRTC tracks are now routed according to the negotiated transceiver order: audio[0] microphone, audio[1] tab/system sound, video[0] camera, video[1] shared screen.
- Each peer stores a **camera+microphone** stream and a **screen+optional screen audio** stream. The remote screen track is no longer mixed into the camera preview.
- The shared-screen tile is rendered on recipients when a participant's `screenSharing` presence is true and the screen track is live/unmuted.
- Screen video is muted for autoplay reliability. Optional shared tab/system audio plays separately. If autoplay of audio is blocked, click **Enable sound**.
- The remote presenter name appears above the presentation. Camera/video calling remains available alongside the presentation.
- The screen tile hides when sharing stops or the presenter leaves, and a new participant joining an existing presentation sees the screen when their peer connection negotiates.
- Local screen capture failures now display an explanatory error instead of silently reporting cancellation.

## Test on Windows localhost

1. Extract the ZIP and open `akaorameet-main`.
2. Double-click `start website.bat`; the site opens at `http://localhost:4173/` (requires Python 3).
3. Open the site in two or three **separate browser tabs/profiles** on the same Windows PC (Chrome/Edge recommended). Use different participant names and join the same room. Host must **Admit** each user.
4. From User A, click **Share screen** and select a **window or tab**. Verify Users B/C see the separate **[User A]'s screen** tile. Audio and video calling should remain independent.
5. To share tab audio, select the tab and enable **Share tab audio**, where available. Windows desktop/system audio sharing varies by browser and capture source.
6. Stop sharing using the in-app button or browser's capture toolbar. The remote screen tile should disappear.
7. Share the screen from User B and verify that User A sees it. Join User C after sharing has started and verify User C receives it too.
8. Both parties should use the **updated version** and create a fresh room. If the old version is cached, do a hard refresh (`Ctrl + Shift + R`).

## Deployment and limitations

- A Windows localhost server is for local browser testing. Other devices need the site served over **HTTPS** to use screen capture (where supported), camera, and microphone. Screen capture API support varies by browser and operating system; mobile browsers often do not provide `getDisplayMedia`.
- TURN relay configuration is required for reliable WebRTC across some mobile networks, symmetric NATs, and corporate firewalls. Configure a secure TURN server using `window.AKAORA_ICE_SERVERS` in `firebase-config.js`. A free public TURN demo endpoint cannot be treated as production infrastructure.
- Firebase Realtime Database signaling permissions and App Check must be configured correctly; meeting admission and signaling depend on Firebase.
- The UI presents one active presentation tile at a time; multiple simultaneous presenters are not displayed side by side.
- The synthetic browser tests validate signaling, senders/receivers, and rendering logic, **not** production internet connectivity on different devices or real desktop capture permissions.

## Local verification carried out

- `node --check app.js` passed.
- Simulated 2-person WebRTC test: screen share from guest to host, stop, then host to guest; both directions routed separately from camera.
- Simulated 3-person WebRTC test: a third participant who joined after screen sharing began received the live remote presentation track.
- Presentation video and optional audio receiver streams were populated, and no JavaScript page errors were reported.
