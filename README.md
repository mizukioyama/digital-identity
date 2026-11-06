# Digital Identity v0.1

Mizuki Oyama / 小山瑞樹 — Abstract Artist / Web Designer.
Minimal Editorial × Living Glass × Organic Line Sphere.

## Local preview
Node.js 24: `npm run dev`, then open http://127.0.0.1:4177 .
No package installation, CDN, external fonts, image assets, API or analytics are needed.
Edit profile and approved links in `content.js`. Appearance defaults remain Transparency45%, Light35%, MotionSubtle. Browser settings persist locally and respect reduced-motion.

## Publication
Planned public profile: https://mizukioyama.github.io/digital-identity/ . This repository candidate does not prove publication.
Run `npm run check`. Build with `GITHUB_REPOSITORY=mizukioyama/digital-identity npm run build:pages`.
Only the 8 allowlisted application/license files are copied to `dist/`. An existing dist is preserved rather than overwritten.
After explicit owner approval, configure Pages Source to GitHub Actions and manually run the prepared workflow on the reviewed main commit with confirm_publication=true.
The workflow does not publish automatically on push. The public URL and content.publicProfileUrl must match.
After deployment, verify the public URL, phone camera QR reading, links and actual mobile device behavior. Appearance is provisional.

QR generator: Kazuhiko Arase, MIT; original license is retained in vendor/LICENSE.
