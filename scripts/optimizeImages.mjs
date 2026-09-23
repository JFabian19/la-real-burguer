import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicAssets = path.resolve('public', 'assets');
const dishesDirectory = path.join(publicAssets, 'platos');

const formatBytes = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

async function optimizedWebp(inputPath, outputPath, maxWidth, maxHeight, quality) {
  const source = await readFile(inputPath);
  const output = await sharp(source, { failOn: 'none' })
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toBuffer();

  if (outputPath !== inputPath || output.length < source.length) {
    await writeFile(outputPath, output);
    return { before: source.length, after: output.length };
  }

  return { before: source.length, after: source.length };
}

const mainImages = [
  ['la-real-logo.webp', 'la-real-logo.webp', 512, 512, 82],
  ['la-real-banner.webp', 'la-real-banner.webp', 1280, 900, 80],
  ['birthday-promo.webp', 'birthday-promo.webp', 900, 1200, 80],
];

let beforeTotal = 0;
let afterTotal = 0;
let optimizedCount = 0;

for (const [inputName, outputName, maxWidth, maxHeight, quality] of mainImages) {
  const result = await optimizedWebp(
    path.join(publicAssets, inputName),
    path.join(publicAssets, outputName),
    maxWidth,
    maxHeight,
    quality,
  );
  beforeTotal += result.before;
  afterTotal += result.after;
  optimizedCount += 1;
}

const dishFiles = (await readdir(dishesDirectory))
  .filter(file => file.toLowerCase().endsWith('.webp'));

for (const file of dishFiles) {
  const filePath = path.join(dishesDirectory, file);
  const originalSize = (await stat(filePath)).size;
  const result = await optimizedWebp(filePath, filePath, 900, 900, 76);
  beforeTotal += originalSize;
  afterTotal += result.after;
  optimizedCount += 1;
}

console.log(`Imágenes procesadas: ${optimizedCount}`);
console.log(`Antes: ${formatBytes(beforeTotal)}`);
console.log(`Después: ${formatBytes(afterTotal)}`);
console.log(`Ahorro: ${formatBytes(beforeTotal - afterTotal)}`);
