# Digital Identity v0.3

Mizuki Oyama / 小山瑞樹 — Abstract Artist / Web Designer.
Minimal Editorial × Living Glass × Organic Line Sphere.

Public profile: https://mizukioyama.github.io/digital-identity/
QR screen: https://mizukioyama.github.io/digital-identity/#qr

The normal experience uses a lightweight B-based material with fixed reading geometry, a moving Canvas sphere, CSS light and glass controls. Appearance is hidden but retained behind `?lab=1`. `?motion=off` allows static use; OS Reduced Motion takes priority. Old saved settings are preserved and ignored in the normal experience. Profile and links remain in content.js; preview experience constants are in experience-config.js.

Node24, no installation required: npm run dev. Run npm run check; create a fresh build with GITHUB_REPOSITORY=mizukioyama/digital-identity npm run build:pages. Existing dist is never overwritten. Only14 allowlisted application/license files are built. No image assets, external fonts, CDN, API, analytics or paid dependencies required.

Pages publication is manual and requires owner approval. Reports, screenshots, local archives and device diagnostics are excluded from Git/publication. Android experience acceptance for v0.3 is pending; browser checks do not establish device FPS, heat or battery performance.
QR generator: Kazuhiko Arase, MIT. License retained in vendor/LICENSE.
