// Generates the iOS app icon (1024, no alpha) and launch splash (2732) from SVG.
// Run: npm run assets
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const xc = path.join(root, 'ios/App/App/Assets.xcassets');

// Iron with steam on a warm laundromat tile, drawn on a 1024 grid
const art = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2fb3ad"/><stop offset="1" stop-color="#136b68"/>
    </linearGradient>
    <linearGradient id="iron" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4fa3d8"/><stop offset=".5" stop-color="#e8f5ff"/><stop offset="1" stop-color="#4fa3d8"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <g fill="#ffffff" opacity=".13">
    ${Array.from({ length: 8 }, (_, j) => Array.from({ length: 8 }, (_, i) => (i + j) % 2 ? `<rect x="${i * 128}" y="${j * 128}" width="128" height="128"/>` : '').join('')).join('')}
  </g>
  <g fill="#ffffff" opacity=".92">
    <circle cx="380" cy="300" r="62"/><circle cx="450" cy="230" r="78"/><circle cx="540" cy="180" r="56"/>
    <circle cx="610" cy="300" r="50"/><circle cx="680" cy="230" r="66"/>
  </g>
  <rect x="180" y="800" width="664" height="60" rx="30" fill="#f7dcc8"/>
  <g transform="translate(512 610)">
    <path d="M-300 150 C-300 -10 -170 -150 40 -150 L230 -150 C260 -150 280 -130 285 -100 L310 150 Z" fill="url(#iron)" stroke="#3a2540" stroke-width="26" stroke-linejoin="round"/>
    <path d="M-120 -150 C-110 -250 -40 -290 60 -290 L190 -290 C230 -290 250 -270 250 -230 L250 -150" fill="none" stroke="#3a2540" stroke-width="44" stroke-linecap="round"/>
    <rect x="-320" y="140" width="650" height="56" rx="28" fill="#3a2540"/>
    <circle cx="120" cy="10" r="36" fill="#e2523f"/>
    <rect x="-180" y="-40" width="40" height="120" rx="18" fill="#7fd3f5"/>
  </g>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${art}</svg>`;
await sharp(Buffer.from(icon)).flatten({ background: '#136b68' }).removeAlpha().png()
  .toFile(path.join(xc, 'AppIcon.appiconset/AppIcon-512@2x.png'));

// Splash: peach background with the rounded icon in the middle
const badge = await sharp(Buffer.from(icon)).resize(640, 640)
  .composite([{ input: Buffer.from('<svg width="640" height="640"><rect width="640" height="640" rx="144" fill="#fff"/></svg>'), blend: 'dest-in' }])
  .png().toBuffer();
const splash = await sharp({ create: { width: 2732, height: 2732, channels: 3, background: '#f7dcc8' } })
  .composite([{ input: badge, gravity: 'center' }]).png().toBuffer();
for (const f of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'])
  await sharp(splash).toFile(path.join(xc, 'Splash.imageset', f));

// Square preview for the store listing and the README
await sharp(Buffer.from(icon)).resize(512, 512).removeAlpha().png().toFile(path.join(root, 'store/icon-preview.png'));
// Home-screen icons for the web version (Safari "Add to Home Screen")
await sharp(Buffer.from(icon)).resize(180, 180).removeAlpha().png().toFile(path.join(root, 'www/apple-touch-icon.png'));
await sharp(Buffer.from(icon)).resize(512, 512).removeAlpha().png().toFile(path.join(root, 'www/icon-512.png'));
console.log('assets written');
