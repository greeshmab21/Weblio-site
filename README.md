# Weblio

Agency website for Weblio, plus nine sample client sites.

- `index.html` — the Weblio site (contact form sends via Web3Forms)
- `t/` — sample sites: Ridgeline, Bluebonnet, Gulf Coast, Heritage (roofing, Texas), Marlowe's (restaurant), Fog City (café), Maya Chen (portfolio), Sweetgrass (landscaping), Desert Blue (pool service)
- `t/fx.js`, `t/fx.css` — shared motion library for the samples

No build step. Vercel serves the folder as-is.

## Deploy on Vercel

1. Vercel → Add New → Project → import this GitHub repo.
2. Framework preset: Other. Leave build and output settings empty → Deploy.

## Contact form

The form sends through Web3Forms (Vercel has no built-in form handling).
Paste the access key from web3forms.com into `WEB3FORMS_KEY` in `index.html`;
each submission is then emailed to the address the key was created with.
