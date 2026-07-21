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
