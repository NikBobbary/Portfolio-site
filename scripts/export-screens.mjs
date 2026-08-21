import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MASTERS = path.join(ROOT, "assets/masters/Screens");
const OUT = {
  1400: path.join(ROOT, "public/Screens/1400"),
  2400: path.join(ROOT, "public/Screens/2400"),
};

const JPEG = {
  quality: 76,
  mozjpeg: true,
  progressive: true,
  chromaSubsampling: "4:2:0",
};

async function exportWidth(input, output, width) {
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .jpeg(JPEG)
    .toFile(output);

  return info.size;
}

async function main() {
  await mkdir(OUT[1400], { recursive: true });
  await mkdir(OUT[2400], { recursive: true });

  const files = (await readdir(MASTERS))
    .filter((name) => name.toLowerCase().endsWith(".jpg"))
    .sort();

  console.log(`Exporting ${files.length} masters → 1400w + 2400w\n`);

  let total1400 = 0;
  let total2400 = 0;

  for (const name of files) {
    const input = path.join(MASTERS, name);
    const size1400 = await exportWidth(
      input,
      path.join(OUT[1400], name),
      1400
    );
    const size2400 = await exportWidth(
      input,
      path.join(OUT[2400], name),
      2400
    );

    total1400 += size1400;
    total2400 += size2400;

    const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;
    console.log(`${name.padEnd(18)}  1400=${kb(size1400).padStart(7)}  2400=${kb(size2400).padStart(7)}`);
  }

  console.log(
    `\nTotals  1400=${(total1400 / 1024 / 1024).toFixed(1)}MB  2400=${(total2400 / 1024 / 1024).toFixed(1)}MB`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
