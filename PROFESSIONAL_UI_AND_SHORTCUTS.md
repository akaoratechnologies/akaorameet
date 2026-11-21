# Akaora Meet — Professional UI + custom shortcut menu (21 November 2026)

## What's updated

- Right-click on the website to open Akaora Meet's custom shortcut menu instead of the browser page menu. Menu items adapt between public pages and live meetings and reuse the website's existing button actions.
- SVG menu icons, brand styling, viewport-aware placement, Escape to close, arrow-key navigation, and keyboard focus handling.
- Regular page text and images aren't selectable/drag-selectable. Form fields (names, room codes, chat, notes, feedback) remain selectable and editable to preserve accessibility and normal text input. Context menu inside editable fields has Paste and Select Text actions; Ctrl+V remains the fallback when browser clipboard permission is unavailable.
- Reworked More Options actions to a consistent single-column list with visible SVGs; aligned navy/orange panel styles for More, Chat and Device Settings.
- Fixed overlapping Pinned and Raised Hand badges and removed the extra duplicated divider before the SEO explainer.
- Preserved existing Firebase/WebRTC logic, screen-share presentation controls, SEO files and the `start website.bat` Windows localhost starter.

## Test locally

Extract the ZIP, open `akaorameet-main`, and double-click `start website.bat`. Visit http://localhost:4173, right-click anywhere **inside the webpage**, and try creating a room and using the in-meeting shortcuts. Right-clicking on browser tabs/address bar remains under the browser's control and cannot be replaced by a webpage.

Note: Preventing text selection is a visual/interaction preference; it does not protect page content from being copied through developer tools or other means.

## Validation completed

- JS syntax checks for `app.js` and `context-menu.js`.
- Simulated browser UI checks at 1366px, 390px and 320px: menu location inside the viewport, Escape close, contextual actions, editable chat field, SVG visibility, More layout, and Chat composer colors.
- Full live multi-device Firebase/WebRTC calls were **not** verified in this pass.
