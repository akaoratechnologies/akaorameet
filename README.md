**Latest update (20 Nov 2026):** Screen-sharing presentation layout collapse fixed; see `SCREEN_SHARE_LAYOUT_FIX.md`.

**Getting `permission_denied`?** See [FIX_PERMISSION_DENIED.md](FIX_PERMISSION_DENIED.md) for the Firebase Console steps. Browser camera permission is unrelated.

# Akaora Meet

Akaora Meet is a static, no-login browser meeting app. It uses Firebase Realtime Database for rooms, signaling, chat, participants, reactions, feedback, and host-controlled meeting state, with WebRTC handling audio, video, and screen sharing in the browser.

The project stays GitHub Pages compatible. There is no Node.js backend required for the Meet app.

## Features

- Create a meeting with a dynamic room code and shareable invite link.
- Join by room code or invite link with a clear invalid-room message.
- Optional microphone and camera before joining.
- WebRTC audio, video, screen sharing, device switching, and single-tile pinning.
- Waiting room with host Admit and Deny actions.
- Host controls for lock/unlock, chat enable/disable, guest screen-share enable/disable, participant removal, and ending the meeting for everyone.
- Live participant list with host badge, mic, camera, screen sharing, and raised-hand status.
- Raise hand, quick reactions, floating reaction animations, chat popups, and unread chat badge.
- Meeting timer showing current clock plus meeting duration.
- Fullscreen buttons for local video, remote video, and shared screen.
- Private meeting notes saved to localStorage per room, with TXT download.
- Meeting summary after hangup with room code, host, user, duration, participant count, chat count, screen-share usage, feedback, and copy summary.
- Improved dark and light meeting themes, clean bottom controls, More panel, and responsive layouts.

## Project Files

```text
index.html
styles.css
app.js
firebase-config.js
database.rules.json
manifest.webmanifest
.nojekyll
assets/
```

## Firebase Setup

1. Create or open a Firebase project.
2. Enable Realtime Database.
3. Copy the web app config into `firebase-config.js`.
4. Publish the database rules from `database.rules.json`.

Expected room data shape:

```text
rooms/{roomId}
  status
  locked
  hostId
  hostName
  createdAt
  settings
  chatEnabled
  guestScreenShareEnabled
  participants/{peerId}
    name
    role
    micEnabled
    cameraEnabled
    screenSharing
    raisedHand
    joinedAt
  joinRequests/{requestId}
    peerId
    name
    status
    createdAt
  chat/{messageId}
  reactions/{reactionId}
  peerConnections/{peerA_peerB}
    offer
    answer
    candidates/{peerId}
    offerRequests/{requestId}
  renegotiationRequests/{requestId}
  feedback/{feedbackId}
```

## Run Locally

Use any static file server from this folder. For example:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173
```

## Test Two Users Locally

1. Open the local URL in one browser tab and create a meeting as the host.
2. Copy the invite link.
3. Open the invite link in another tab, another browser profile, or another browser.
4. The guest should wait until the host clicks Admit.
5. Test chat, reactions, raise hand, screen sharing, participant list, and host controls.

Using two different browser profiles is best because it avoids camera and microphone device conflicts.

## GitHub Pages Deployment

1. Upload the static files listed in Project Files to a GitHub repository.
2. Keep `.nojekyll` in the repository root.
3. In GitHub, open Settings -> Pages.
4. Select the branch and root folder that contain `index.html`.
5. Save and open the published Pages URL.

No build step is required for Akaora Meet.

## Browser Limitations

- Camera, microphone, and screen sharing require a secure context. `localhost` works locally; deployed sites should use HTTPS.
- Screen audio is only available when the browser and selected sharing source provide it. If audio is unavailable, the app shows a clear message and continues sharing video.
- Fullscreen can be blocked by browser policy or user settings. The app shows a clear message when that happens.
- Browser close and refresh cleanup uses best-effort events and Firebase disconnect hooks, but browsers may not always finish cleanup before closing.

## TURN Server Note

The app uses browser WebRTC peer connections. Firebase handles signaling, but TURN is still needed when direct peer-to-peer connections cannot be established. This is common on mobile networks, school/office Wi-Fi, and strict routers.

The app now includes STUN plus a fallback public TURN list, and it automatically refreshes the WebRTC offer when a user turns mic/camera/screen on after joining. For production reliability, use your own TURN provider credentials by adding this to `firebase-config.js`:

```js
window.AKAORA_ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "turn:YOUR_TURN_HOST:3478", username: "USERNAME", credential: "PASSWORD" }
];
```

For larger group calls, a media server or SFU is recommended. GitHub Pages plus Firebase is a good static deployment model, but it is not a replacement for SFU infrastructure at large meeting sizes.

## Media Troubleshooting

- Ask both people to allow camera and microphone permissions in the browser.
- If users join with mic/camera off and turn them on later, the app refreshes the media connection automatically.
- If the call still shows avatars only, try both users on the updated ZIP and reload the page once after deployment so the new `app.js` cache key is loaded.
- If chat works but audio/video still does not connect on a specific network, add a dedicated TURN server in `firebase-config.js`.


## November 2026 UI and Stability Fixes

- Replaced the illustrated home-page video meeting mock-up with a **real photographic image** from [Unsplash](https://unsplash.com/photos/laptop-screen-showing-a-video-conference-with-multiple-participants-s8KDEUHJErQ) (photograph by Rodrigo Rodrigues). The image is served directly from `images.unsplash.com`, so an internet connection is required for that photo. Site functionality does not depend on the photo loading.
- Introduced a vector `assets/icon.svg` favicon and converted the feedback rating stars, emoji-picker action, and invite close icon to SVG. Core meeting icons were already SVG.
- Fixed room creation collision handling with a Firebase transaction, so existing room data is not overwritten when a generated room code is already in use.
- Improved join request lifecycle: the guest can cancel while waiting, request listeners are cleaned up on cancellation/denial, and ending the room exits the wait state cleanly.
- Improved room deep-links, input keyboard submission, Escape-to-close panels, focus-visible navigation, and dark/light localStorage fallback.
- Improved mobile call bar wrapping so mic, camera, presentation, devices, chat, reactions, hand raising, More, and Hang Up remain accessible on small screens.
- Made end-of-call feedback scroll within the mobile viewport rather than pushing actions irretrievably below the screen.
- Registered Firebase `onDisconnect` cleanup for participant presence and host room status (best-effort).
- Updated asset cache keys and added `.nojekyll` for GitHub Pages.

### Validation and production caution

The JavaScript syntax, stylesheet parsing, JSON rules and local mocked-Firebase browser journeys were checked, including desktop and mobile create/leave, guest request/cancel/deny/admit, room code collisions, feedback and meeting controls. Real Firebase-hosted calls and network-dependent photo loading have **not** been end-to-end verified in this local environment. Test two real devices on HTTPS before production deployment and configure a reliable TURN server if needed.

**Security:** The supplied `database.rules.json` accepts public reads/writes within valid room codes and does not authenticate hosts. A room code is therefore a convenience/obscurity barrier, *not* strong access control. Before handling confidential meetings or production user data, introduce authentication and per-participant/host authorization rules, validate all writes server-side or in rules, and review retention/privacy requirements. Do not claim end-to-end encryption or verified private room security on the basis of the existing rules.

## One-click Windows local testing

Extract the ZIP and double-click `start website.bat` inside the `akaorameet-main` folder. This starts a Python 3 local static server on `http://localhost:4173/` and opens the default browser automatically. Keep the console window open during testing, then press Ctrl+C to stop. If Python is not installed, install Python 3 and enable Add Python to PATH. The .bat file is for local testing only; it is not needed for GitHub Pages deployment.

## Two-way calling troubleshooting

See [FIX_TWO_WAY_AUDIO_VIDEO.md](FIX_TWO_WAY_AUDIO_VIDEO.md) for the WebRTC sendrecv/transceiver fix, test checklist, and TURN requirements. Both users must enable their own mic/camera before joining or toggle them on during the call. For two different devices use HTTPS; `localhost` is local to each device.


## Screen sharing to every participant (Nov 2026 update)

The mesh screen-sharing receiver has been repaired. Camera and screen tracks use separate remote streams, screen video is displayed in the presentation tile for all viewers, and optional presentation audio plays separately with an Enable sound fallback. See [FIX_SCREEN_SHARE_ALL_PARTICIPANTS.md](FIX_SCREEN_SHARE_ALL_PARTICIPANTS.md) for exact testing steps and supported environments.


## Fixed: meeting unexpectedly ends after ~2 minutes

If a guest saw **"The host ended the meeting"** without anyone ending it, earlier versions of the app were ending the entire room whenever the host's **Firebase connection** briefly disconnected. This release removes that behavior, restores participant presence on reconnect, and preserves the room until the host explicitly ends it. See [`FIX_MEETING_AUTO_END.md`](FIX_MEETING_AUTO_END.md) for test steps and caveats.

**Upgrade note:** all participants should close the old app, hard-refresh (`Ctrl + Shift + R`), and create a **new room** using the updated build. Rooms already marked ended cannot be reopened. Firebase rules and TURN configuration still affect real-network reliability.

