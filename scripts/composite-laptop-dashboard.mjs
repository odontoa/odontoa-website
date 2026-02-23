#!/usr/bin/env node
/**
 * Composites dashboard from test-hero-2 (Kontrolna tabla ordinacije) onto laptop in mockup.
 * Output: public/images/laptop_with_smartphone_dashboard.png
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const HERO_SOURCE = join(root, 'public/images/test-hero-2-full.png');
const MOCKUP_PATH = join(root, 'public/images/laptop_with_smartphone_mockup.jpg');
const OUTPUT_PATH = join(root, 'public/images/laptop_with_smartphone_dashboard.png');

// Crop region from test-hero-2 (laptop screen with dashboard) - 6324x3952 source
const CROP_LEFT = 350;
const CROP_TOP = 450;
const CROP_WIDTH = 2600;
const CROP_HEIGHT = 1650;

// Laptop screen position in 6400x4000 mockup
const LAPTOP_SCREEN_X = 720;
const LAPTOP_SCREEN_Y = 450;
const LAPTOP_SCREEN_WIDTH = 2280;
const LAPTOP_SCREEN_HEIGHT = 1480;

async function main() {
  const cropped = await sharp(HERO_SOURCE)
    .extract({ left: CROP_LEFT, top: CROP_TOP, width: CROP_WIDTH, height: CROP_HEIGHT })
    .resize(LAPTOP_SCREEN_WIDTH, LAPTOP_SCREEN_HEIGHT)
    .png()
    .toBuffer();

  await sharp(MOCKUP_PATH)
    .composite([{
      input: cropped,
      left: LAPTOP_SCREEN_X,
      top: LAPTOP_SCREEN_Y,
    }])
    .png()
    .toFile(OUTPUT_PATH);

  console.log('Saved:', OUTPUT_PATH);
}

main().catch(console.error);
