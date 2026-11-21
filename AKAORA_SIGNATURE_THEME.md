# Akaora Meet — Signature Edition

Visual design is based on the supplied Akaora Technologies company logo. The site keeps the card-free ATELIER layout, with a deep navy primary theme, warm orange/flame CTA accents, ivory typography, restrained SVG controls, and real photography.

## Files changed
- `signature.css`: new brand UI layer loaded after the existing CSS.
- `index.html`: new stylesheet link, product title, and headline.
- `app.js`: default dark theme, independent persisted Signature theme preference, and theme-color metadata. All existing Firebase/WebRTC paths remain unchanged.
- `manifest.webmanifest`: matching theme palette.

## Testing
- Extract the ZIP, run `start website.bat`, and open http://localhost:4173/.
- Create a room, test both theme modes, join from another browser window, and verify audio/video/screen-share on actual devices.
- Real multi-network WebRTC requires valid Firebase rules and TURN server configuration; a cosmetic redesign does not change these infrastructure requirements.

## Brand colors
Navy #071B43; midnight #06142D; blue #0D2D65; orange #FF981B; flame #FF5733; ivory #F7F5F0.
