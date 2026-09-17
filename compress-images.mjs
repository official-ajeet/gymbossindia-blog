// One-time batch compressor for public/blog-images/.
// Resizes to a sane max width and re-encodes PNGs with palette-based
// quantization (similar to pngquant) — keeps the .png extension, so
// no markdown paths need to change. Overwrites files in place.
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const DIR = './public/blog-images';
const MAX_WIDTH = 1600; // covers a 1200px display width at 2x retina

const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(DIR, file);
  const before = (await stat(filePath)).size;

  const buffer = await sharp(filePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .png({ quality: 75, compressionLevel: 9, palette: true })
    .toBuffer();

  await sharp(buffer).toFile(filePath + '.tmp');
  await import('fs/promises').then(({ rename }) => rename(filePath + '.tmp', filePath));

  const after = (await stat(filePath)).size;
  totalBefore += before;
  totalAfter += after;

  console.log(
    `${file}: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);