# Akaora Meet — deployment and SEO checklist (21 November 2026)

**Canonical website:** https://meet.akaoratechnologies.in/

## Deploy
1. Upload the contents of `akaorameet-main/` into the existing document root for `meet.akaoratechnologies.in`. Keep `index.html`, `robots.txt`, `sitemap.xml`, the CSS/JS files and `assets/` together. Don't upload the parent folder as an extra URL segment.
2. Verify that the domain serves `index.html` at `/`, `robots.txt` at `/robots.txt`, and `sitemap.xml` at `/sitemap.xml` using HTTP 200 responses.
3. Hard refresh to pick up the newly versioned `search-ui-fixes.css` stylesheet.
4. Use Google Search Console to add/verify the domain or URL-prefix property, submit `https://meet.akaoratechnologies.in/sitemap.xml`, and run URL Inspection on the homepage, then Request Indexing if offered.
5. Link to https://meet.akaoratechnologies.in/ from the main Akaora Technologies website's product listing and credible public profiles. Check indexing and queries via Search Console after Google crawls the update.

## What's included
- Brand-focused title and natural-language search description, canonical, social sharing metadata.
- `SoftwareApplication`, `WebSite`, and `Organization` JSON-LD for search engine interpretation.
- Public homepage content explaining browser meetings, no signup, invite links, screen share and chat.
- Root `robots.txt`, one-URL `sitemap.xml`. Meeting invite query links are excluded from crawling, and the canonical points at the homepage.
- UI: full-bleed homepage header background, invite-note treatment and an integrated, thin feedback scrollbar.

## Important
- **Code deployed?** This ZIP is a local artifact, not a live server update.
- **SEO ranking is not guaranteed.** Google decides whether, when and where pages rank. Generic terms such as “meeting website” are competitive.
- **No fake search traffic, keyword stuffing, review stars or inaccurate claims** were added.
- **Live calls** depend on your existing Firebase and WebRTC/TURN configuration. Those subsystems were not changed.
