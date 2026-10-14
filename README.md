# Weblio

Agency website for Weblio, plus nine sample client sites.

- `index.html` — the Weblio site (contact form uses Netlify Forms, form name `contact`)
- `t/` — sample sites: Ridgeline, Bluebonnet, Gulf Coast, Heritage (roofing, Texas), Marlowe's (restaurant), Fog City (café), Maya Chen (portfolio), Sweetgrass (landscaping), Desert Blue (pool service)
- `t/fx.js`, `t/fx.css` — shared motion library for the samples

No build step. Netlify serves the folder as-is.

## Deploy on Netlify

1. Netlify → Add new project → Import an existing project → GitHub → pick this repo.
2. Leave build command empty, publish directory `.` → Deploy.
3. Project configuration → Forms → Enable form detection, then trigger one more deploy.
4. Forms → Form notifications → Add notification → Email notification → your email.

Each production deploy uses Netlify credits on the free plan, so batch changes into fewer pushes.
