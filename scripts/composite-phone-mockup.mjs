#!/usr/bin/env node
/**
 * Inserts our phone screen content (iMessage) INTO the mockup's phone screen.
 * Only the screen content - no second phone, uses the mockup's phone frame.
 * Output: public/images/laptop_with_smartphone_with_messages.png
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const MOCKUP_PATH = join(root, 'public/images/laptop_with_smartphone_mockup.jpg');
const SCREEN_CONTENT_PATH = join(root, 'public/images/phone-screen-content.svg');
const OUTPUT_PATH = join(root, 'public/images/laptop_with_smartphone_with_messages.png');

// Mockup is 6400x4000. Phone screen area (inset from phone edges).
// Adjust these to match the mockup's phone screen bounds.
const SCREEN_X = 4210;
const SCREEN_Y = 1080;
const SCREEN_WIDTH = 830;
const SCREEN_HEIGHT = 1710;

async function main() {
  const screenSvg = readFileSync(SCREEN_CONTENT_PATH);

  const screenBuffer = await sharp(screenSvg)
    .resize(SCREEN_WIDTH, SCREEN_HEIGHT)
    .png()
    .toBuffer();

  await sharp(MOCKUP_PATH)
    .composite([{
      input: screenBuffer,
      left: SCREEN_X,
      top: SCREEN_Y,
    }])
    .png()
    .toFile(OUTPUT_PATH);

  console.log('Saved:', OUTPUT_PATH);
}

main().catch(console.error);
