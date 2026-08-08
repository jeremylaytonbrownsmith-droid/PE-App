import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const outDir = new URL('../public/icons/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const jobs = [
  ['icon.svg', 'icon-192.png', 192],
  ['icon.svg', 'icon-512.png', 512],
  ['icon.svg', 'apple-touch-icon.png', 180],
  ['icon.svg', 'favicon-32.png', 32],
  ['icon.svg', 'favicon-16.png', 16],
  ['icon-maskable.svg', 'icon-maskable-192.png', 192],
  ['icon-maskable.svg', 'icon-maskable-512.png', 512],
];

for (const [src, dest, size] of jobs) {
  const srcPath = fileURLToPath(new URL(src, import.meta.url));
  const destPath = fileURLToPath(new URL(dest, outDir));
  await sharp(srcPath).resize(size, size).png().toFile(destPath);
  console.log('wrote', dest);
}
