# AkaoraMeet: Two-way audio and video fix

## What was broken

The original mesh signaling created `sendrecv` WebRTC transceivers on **both** the offering and answering browser *before* processing the offer. In Chromium, the answering browser ended up with duplicate transceivers: the four local ones had no media ID (`mid`), while four additional incoming transceivers were `recvonly`. The SDP answer could therefore negotiate remote audio/video reception without sending the answerer's local media. The call appeared joined, but two-way media could not work.

## What changed

- The designated WebRTC **offerer** creates the audio and video transceivers before writing SDP to Firebase.
- The **answerer** waits for the remote SDP to create matching transceivers, sets those transceivers to `sendrecv`, then attaches its local mic/camera tracks before generating the answer.
- Offers get a unique `offerId`; answers must belong to the active offer. Stale answers and overlapping renegotiation requests are guarded.
- Media renegotiations wait for the `stable` signaling state; reconnects are delayed instead of flooding Firebase.
- A remote media player explicitly starts playback. If the browser blocks audible autoplay, the call screen displays **Enable sound**.
- **More options → Reconnect audio/video** provides a manual ICE restart.
- If a connection remains stuck or fails, the app reports TURN/network troubleshooting information.

## Testing checklist (both devices)

1. Extract the new ZIP. Double-click **start website.bat** to launch `http://localhost:4173/` on the computer serving the site.
2. On that **same computer**, open two separate browser windows or profiles, and test both sides in a newly created room. Enable **Mic** and **Camera** **on each user's** pre-join screen. Both toggles start OFF for privacy.
3. The host admits the guest. Both users should show a remote video tile and have audio/video tracks. Use headphones if testing both in one room to prevent feedback.
4. On two **different devices**, use a real **HTTPS** deployment (GitHub Pages or your secured domain) on each device, sharing only the generated room link/code. `localhost` on a phone refers to the phone, not the Windows PC. Camera/mic access is generally blocked on an insecure `http://192.168.x.x` LAN URL.
5. If a video is visible but sound is silent, click **Enable sound** if shown, check the device speaker/volume, and use **Device settings** for the right microphone.
6. If media does not connect after ~15 seconds, open **More options → Reconnect audio/video**. Check `chrome://webrtc-internals` on both browsers. If the peer's ICE state never reaches connected/completed, a reliable TURN relay is needed for restrictive networks.
7. Configure a production TURN provider in `firebase-config.js` using `window.AKAORA_ICE_SERVERS`. Public sample TURN servers are not a guaranteed production service. Never embed long-lived privileged TURN credentials in a publicly hosted client. Prefer ephemeral credentials issued by a small HTTPS backend.
8. Both users must load this new version; **Ctrl+Shift+R** is recommended to avoid cached JavaScript. Start a fresh room after deploying.

## Verification performed

- JavaScript syntax checked with `node --check`.
- Desktop/mobile browser smoke tests: create meeting, UI actions, leave flow, no page JavaScript errors.
- Two Chromium frames with synthetic live audio/video tracks and a shared mock Firebase signaling store: host and guest both negotiated **4 transceivers in sendrecv**, both attached audio+video senders, and both observed incoming audio+video tracks. No JavaScript errors.
- The test environment blocks real network socket connections, leaving ICE in `new`: this is **not** proof of live two-device media connectivity on the public internet. Real Firebase/TURN/HTTPS tests still required.

## Notes

- Firebase Realtime Database Rules and App Check must allow authorized signaling writes/reads. `FIX_PERMISSION_DENIED.md` covers this separately.
- Browser media permissions are independent of Firebase permissions.
- Do not use permissive unauthenticated database rules as production security.
