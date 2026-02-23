#!/usr/bin/env node
/**
 * Composites BOTH dashboard on laptop AND iMessage on phone onto the mockup.
 * Output: public/images/laptop_with_smartphone_full.png
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const MOCKUP_PATH = join(root, 'public/images/laptop_with_smartphone_mockup.jpg');
const HERO_SOURCE = join(root, 'public/images/test-hero-2-full.png');
const PHONE_SCREEN_PATH = join(root, 'public/images/phone-screen-content.svg');
const OUTPUT_PATH = join(root, 'public/images/laptop_with_smartphone_full.png');

const CROP_LEFT = 350;
const CROP_TOP = 450;
const CROP_WIDTH = 2600;
const CROP_HEIGHT = 1650;
const LAPTOP_SCREEN_X = 720;
const LAPTOP_SCREEN_Y = 450;
const LAPTOP_SCREEN_WIDTH = 2280;
const LAPTOP_SCREEN_HEIGHT = 1480;

const PHONE_SCREEN_X = 4210;
const PHONE_SCREEN_Y = 1080;
const PHONE_SCREEN_WIDTH = 830;
const PHONE_SCREEN_HEIGHT = 1710;

async function main() {
  const dashboardBuffer = await sharp(HERO_SOURCE)
    .extract({ left: CROP_LEFT, top: CROP_TOP, width: CROP_WIDTH, height: CROP_HEIGHT })
    .resize(LAPTOP_SCREEN_WIDTH, LAPTOP_SCREEN_HEIGHT)
    .png()
    .toBuffer();

  const phoneSvg = readFileSync(PHONE_SCREEN_PATH);
  const phoneBuffer = await sharp(phoneSvg)
    .resize(PHONE_SCREEN_WIDTH, PHONE_SCREEN_HEIGHT)
    .png()
    .toBuffer();

  await sharp(MOCKUP_PATH)
    .composite([
      { input: dashboardBuffer, left: LAPTOP_SCREEN_X, top: LAPTOP_SCREEN_Y },
      { input: phoneBuffer, left: PHONE_SCREEN_X, top: PHONE_SCREEN_Y },
    ])
    .png()
    .toFile(OUTPUT_PATH);

  console.log('Saved:', OUTPUT_PATH);
}

main().catch(console.error);
