/**
 * Turn the source photography into what the page actually serves.
 *
 * Three of the four images are archival and public domain, one is the
 * foundation's own photograph of the 2021 Main Library. Provenance and licence
 * for every one is in public/images/CREDITS.md, written by this script, so the
 * record travels with the files rather than living in someone's memory.
 *
 * The hero also gets a duotone pass: the 1910 photograph is greyscale, and
 * mapping it into the foundation's own civic blue makes an archival plate sit
 * with the rest of the palette instead of looking like a scan dropped on top.
 *
 * Run: node scripts/prepare-images.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(root, 'assets-source');
const OUT = path.join(root, 'public', 'images');

/** The two ends of the duotone ramp, both taken from the foundation's mark. */
const SHADOW = { r: 0x0d, g: 0x22, b: 0x33 };
const HIGHLIGHT = { r: 0xf2, g: 0xee, b: 0xe2 };

const IMAGES = [
  {
    src: 'carnegie-1910.jpg',
    out: 'carnegie-1910',
    widths: [1200, 1800, 2600],
    duotone: true,
    // The scan carries the archival print's white mount. Measured off the
    // brightness profile rather than guessed, so the hero bleeds properly
    // instead of showing a cream frame down one side.
    crop: { left: 120, top: 96, width: 3623, height: 2864 },
    credit: {
      title: 'Exterior view of the Riverside Public Library, ca. 1910',
      author: 'Unknown photographer, California Historical Society (CHS-5278)',
      licence: 'Public domain',
      source: 'https://commons.wikimedia.org/wiki/File:Exterior_view_of_the_Riverside_Public_Library,_ca.1910_(CHS-5278).jpg',
      used: 'Hero. The 1903 Carnegie library on Seventh Street, Mission Revival.',
    },
  },
  {
    src: 'carnegie-nypl.jpg',
    out: 'carnegie-postcard',
    widths: [900, 1400],
    // The scan is a card floating on a larger white bed. Cropped to the print
    // itself, including its own caption line.
    crop: { left: 105, top: 120, width: 1210, height: 755 },
    credit: {
      title: 'Carnegie Public Library, Riverside, Calif.',
      author: 'New York Public Library, b12647398-66354',
      licence: 'Public domain',
      source: 'https://commons.wikimedia.org/wiki/File:Carnegie_Public_Library,_Riverside,_Calif_(NYPL_b12647398-66354).tiff',
      used: 'Heritage section.',
    },
  },
  {
    src: '2023-main-library.jpg',
    out: 'main-library-today',
    widths: [605, 1100],
    credit: {
      title: 'Riverside Main Library, 3900 Mission Inn Avenue',
      author: 'Riverside Public Library Foundation',
      licence: "The foundation's own photograph, taken from their website",
      source: 'https://www.riversidelibraryfoundation.org/img/2023-main-library.jpg',
      used: 'The present-day counterpart to the 1910 plate.',
    },
  },
  {
    src: 'downtown-riverside.jpg',
    out: 'downtown-riverside',
    widths: [1600, 2400],
    duotone: true,
    credit: {
      title: 'Downtown Riverside',
      author: 'Ken Lund',
      licence: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Downtown_riverside.jpg',
      used: 'Branch section band, treated. Attribution required and given below.',
    },
  },
];

/**
 * Map luminance onto a two-colour ramp. `sharp`'s own tint keeps the original
 * hue relationships; for an archival plate we want every tone pushed onto the
 * brand ramp, so the ramp is built as a lookup and applied to a greyscale copy.
 */
const duotoneRamp = () => {
  const lut = Buffer.alloc(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    lut[i * 3 + 0] = Math.round(SHADOW.r + (HIGHLIGHT.r - SHADOW.r) * t);
    lut[i * 3 + 1] = Math.round(SHADOW.g + (HIGHLIGHT.g - SHADOW.g) * t);
    lut[i * 3 + 2] = Math.round(SHADOW.b + (HIGHLIGHT.b - SHADOW.b) * t);
  }
  return lut;
};

const applyDuotone = async (input) => {
  const { data, info } = await input
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const lut = duotoneRamp();
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < info.width * info.height; i++) {
    const v = data[i * info.channels];
    out[i * 3 + 0] = lut[v * 3 + 0];
    out[i * 3 + 1] = lut[v * 3 + 1];
    out[i * 3 + 2] = lut[v * 3 + 2];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
};

const main = async () => {
  await mkdir(OUT, { recursive: true });
  let files = 0;
  let bytes = 0;

  for (const image of IMAGES) {
    for (const width of image.widths) {
      let pipe = sharp(path.join(SRC, image.src)).rotate();
      if (image.crop) pipe = pipe.extract(image.crop);
      pipe = pipe.resize({ width, withoutEnlargement: true });
      if (image.duotone) pipe = await applyDuotone(pipe);

      for (const [ext, opts] of [
        ['webp', { quality: 82 }],
        ['jpg', { quality: 84, mozjpeg: true }],
      ]) {
        const file = path.join(OUT, `${image.out}-${width}.${ext}`);
        const info = ext === 'webp'
          ? await pipe.clone().webp(opts).toFile(file)
          : await pipe.clone().jpeg(opts).toFile(file);
        files += 1;
        bytes += info.size;
      }
    }
    console.log(`  ${image.out.padEnd(22)} ${image.widths.join(', ')}${image.duotone ? '  (duotone)' : ''}`);
  }

  const credits = [
    '# Image credits',
    '',
    'Every photograph on this site, where it came from, and what allows us to use it.',
    'Kept next to the files so the record cannot drift away from them.',
    '',
    ...IMAGES.flatMap((i) => [
      `## ${i.credit.title}`,
      '',
      `- **File:** \`${i.out}-*.{webp,jpg}\``,
      `- **Author:** ${i.credit.author}`,
      `- **Licence:** ${i.credit.licence}`,
      `- **Source:** ${i.credit.source}`,
      `- **Used for:** ${i.credit.used}`,
      '',
    ]),
    '## Note on the CC BY-SA image',
    '',
    'The downtown Riverside photograph is CC BY-SA 2.0 by Ken Lund. Attribution is',
    'required, and it is given in the site footer as well as here. If the foundation',
    'would rather not carry the attribution line, replace that one image with their',
    'own photography and the line can come out.',
    '',
  ].join('\n');
  await writeFile(path.join(OUT, 'CREDITS.md'), credits);

  console.log(`\n${files} files, ${(bytes / 1048576).toFixed(1)} MB, credits written`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
