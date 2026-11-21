# Akaora Meet toolbar SVG refresh

Updated the nine meeting toolbar actions with a consistent 24x24 vector icon set: microphone (on/off), camera (on/off), screen presentation, microphone/camera device sliders, live chat, reactions, raise hand, more options and leave meeting.

- The existing button IDs, ARIA labels, event listeners, permission logic, and state classes are preserved.
- `toolbar-icons.css` is intentionally loaded last to stabilize stroke width across the older theme stylesheets.
- All icons are inline SVG; no icon fonts, emoji or additional network requests are used.
- To test locally: double-click `start website.bat` and open `http://localhost:4173/`.

This is a visual-only update; real multi-device WebRTC calls are not revalidated by this patch.
