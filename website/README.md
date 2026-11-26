# AuraScript website

Source of the official website at https://www.aura-script.com.

## Hosting

The site is served by the Cloudflare Worker named `aura-script`. It is a self-contained ES module with no third-party runtime dependencies, fonts, trackers, or analytics.

## Routes

- `/` — product presentation, Free/Pro positioning and downloads
- `/confidentialite` — privacy policy
- `/securite` — security overview and vulnerability contact
- `/conditions` — terms of use
- `/versions` — public versions and roadmap status
- `/robots.txt`, `/sitemap.xml`, `/.well-known/security.txt`
- `/favicon.svg`, `/og.svg`, `/manifest.webmanifest`

## Design and performance

The interface is responsive, honors `prefers-reduced-motion`, and uses only local CSS, JavaScript, and SVG. The page is intentionally buildless so that the deployed source remains easy to audit and roll back.

The public site must describe AuraScript Pro as **in development** until the functions and commercial flow are ready.
