# Akaora Meet — ATELIER / Classy Card-Free Interface

## Design scope

- Converted ORBIT's bold lime/glass/card styling into an editorial aesthetic: warm ivory, deep charcoal, muted copper, fine dividers, a readable serif headline and understated SVG icons.
- Removed boxed cards and decorative rounded surfaces across homepage sections, feature row, instructions, create/join flows, and meeting feedback.
- Kept the meeting stage dark for video legibility and made the controls a flat, functional toolbar, with squared side sheets for chat, participants, notes, devices, more options and invitations.
- Retained Akaora Technologies product attribution and company logo in the app and footer.
- Default appearance is light (users can switch modes; existing saved preference is retained).
- Preserved the prior WebRTC/Firebase fixes for bidirectional audio/video, screen sharing and temporary-disconnection handling.

## Test / run

1. Extract the archive.
2. Run `start website.bat` (Python 3 required), or `python -m http.server 4173` inside `akaorameet-main`.
3. Open `http://localhost:4173/`.
4. Try creating a room, joining from another browser, screen sharing, audio/video and meeting controls.

## Notes

- Real photography on the homepage is loaded from Unsplash and requires internet access. The fallback is a neutral background if the photo cannot be retrieved.
- Firebase rules and project access must be configured for rooms and invite approval to function on the public internet.
- Reliable WebRTC connections across restricted networks need correctly configured TURN credentials; the browser UI smoke test is not a replacement for real two-device network testing.
