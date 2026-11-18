# AkaoraMeet — unexpected meeting termination (around 2 minutes)

## Root cause

Older code scheduled `roomRef.child("status").onDisconnect().set("ended")` for the **host**. Firebase Realtime Database executes `onDisconnect` operations when the Firebase connection drops, including on transient network interruption, laptop sleep, and browser connection resets. Other users then saw **"The host ended the meeting"**, even if the host never pressed **End meeting**. This was **not** a 2-minute timer or a free-plan call duration limit.

## Changes

1. Removed the automatic `onDisconnect().set("ended")` on the room status. Only an explicit host **Leave** or **End meeting for everyone** sets `status: "ended"`.
2. Subscribed to Firebase `.info/connected` for the active room to identify signaling disconnections and reconnections.
3. Re-registers `onDisconnect().remove()` **for the individual participant only** after each reconnect. This is required because Firebase disconnect operations are single-use.
4. On reconnection, restores a participant entry removed by the disconnect hook (unless the participant was intentionally removed by the host), then requests an ICE/media refresh for connected peers.
5. Room-state listener does not interpret a temporary missing/offline room snapshot as an intentional host termination.

## Test on Windows

1. Completely close the old AkaoraMeet browser tabs and local server. Extract this ZIP into a **new folder** to avoid cached/stale versions.
2. Run `start website.bat` in `akaorameet-main`, then open `http://localhost:4173/`.
3. Host creates a **new** room; 1–2 guests join and the host admits them.
4. Keep the call active for **at least 5–10 minutes**; verify that the meeting does not end automatically.
5. For a controlled network test, temporarily interrupt the host's internet connection **without closing the tab**. The UI should report signaling reconnection. Restore the connection and verify guests remain in the room. Media may pause during the interruption and ICE/TURN availability can affect recovery.
6. Then use **End meeting for everyone** as the host. All guests should get a legitimate meeting-ended screen.
7. If using two different devices, serve the site via HTTPS (not a second device's plain `http://localhost`, which points to that second device).

## Important behavior and limitations

- **Closing the host's browser tab is no longer interpreted as an explicit end-for-everyone**. The host's participant presence is cleared on disconnect, but the room stays available; to close it for everyone, use the in-app End meeting/Leave control.
- Existing rooms already marked `ended` by the old build **cannot be resurrected**. Create a fresh room using the updated build on all clients.
- A network interruption can still stop or delay live media packets until WebRTC reconnects. Reliable WebRTC across networks needs a working TURN relay and appropriate Firebase permissions. This patch fixes **premature room termination**, not every possible connectivity fault.
- Firebase's `onDisconnect` operation does **not** run on a fixed two-minute schedule. It runs on connection loss; it is re-registered on reconnect.

## Verification performed

- JavaScript syntax: `node --check app.js` passed.
- Simulated two-user browser test: host's Firebase connection dropped twice. On both occurrences, room status remained `waiting` and the guest stayed in the meeting. After reconnection, host presence and the disconnect cleanup hook were restored. Explicit host end still closed the guest's meeting.
- Simulated elapsed call clock >4 minutes did not trigger a forced exit.
- Previous WebRTC test: bidirectional microphone/camera tracks and screen sharing from host and guest still worked without browser JS errors.
- **Not verified:** 5–10 minutes of real two-device internet usage with the user's Firebase project and TURN server. Test those separately before production deployment.
