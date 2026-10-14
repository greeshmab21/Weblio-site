# Weblio

Agency website for Weblio, plus nine sample client sites.

- `index.html` — the Weblio site (contact form uses Netlify Forms, form name `contact`)
- `t/` — sample sites: Ridgeline, Bluebonnet, Gulf Coast, Heritage (roofing, Texas), Marlowe's (restaurant), Fog City (café), Maya Chen (portfolio), Sweetgrass (landscaping), Desert Blue (pool service)
- `t/fx.js`, `t/fx.css` — shared motion library for the samples

No build step. Netlify serves the folder as-is. Live at https://weblioportfolio.netlify.app/

## Deploy on Netlify

Connected to this repo: every push to `main` deploys automatically.

## Contact form

Uses Netlify Forms (form name `contact`).
1. Project configuration → Forms → Enable form detection, then redeploy once.
2. Forms → Form notifications → Add notification → Email notification.

Submissions appear under Forms in the Netlify dashboard.
