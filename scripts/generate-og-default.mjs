/* Generise podrazumevanu Open Graph sliku (1200x630) iz postojeceg Odontoa loga.
   Izlaz: public/images/og/odontoa-default.png (koristi je src/lib/seo/metadata.ts).

   Pokretanje: node scripts/generate-og-default.mjs
   Logo je raster 507x165, pa se postavlja u prirodnoj velicini (bez uvecanja i mutnih ivica). */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const logoPath = path.join(root, 'public/images/Odontoa-New-logo-pack-2026/horiyotal_color.png');
const outDir = path.join(root, 'public/images/og');
const outPath = path.join(outDir, 'odontoa-default.png');

const WIDTH = 1200;
const HEIGHT = 630;
/* Brand tokeni sa pocetne (src/app/(site)/site.css): --stellar-accent i --stellar-bg-light. */
const ACCENT = '#6e51e0';
const BG = '#f7f8fa';
const TEXT = '#363d4f';

const logo = await sharp(logoPath).metadata();
const logoLeft = Math.round((WIDTH - logo.width) / 2);
const logoTop = 170;

const background = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect x="0" y="${HEIGHT - 12}" width="${WIDTH}" height="12" fill="${ACCENT}"/>
  <text x="50%" y="${logoTop + logo.height + 70}" text-anchor="middle"
        font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" font-weight="500" fill="${TEXT}">
    Softver za stomatološke ordinacije
  </text>
</svg>`);

mkdirSync(outDir, { recursive: true });
await sharp(background)
  .composite([{ input: logoPath, left: logoLeft, top: logoTop }])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

const out = await sharp(outPath).metadata();
console.log(`OG slika: ${path.relative(root, outPath)} (${out.width}x${out.height})`);
