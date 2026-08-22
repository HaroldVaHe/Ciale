import sharp from "sharp";
import { stat } from "fs/promises";
import { join } from "path";

const PUBLIC = join(import.meta.dirname, "..", "public");
const WIDTH = 1200;
const HEIGHT = 630;

const overlay = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="40%" stop-color="#2D2926" stop-opacity="0"/>
      <stop offset="100%" stop-color="#2D2926" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
  <text x="50%" y="${HEIGHT - 150}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="72" letter-spacing="20" fill="#FDFBF7">CIALÉ</text>
  <rect x="${WIDTH / 2 - 70}" y="${HEIGHT - 112}" width="140" height="2" fill="#E79C88"/>
  <text x="50%" y="${HEIGHT - 62}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="30" fill="#FDFBF7" fill-opacity="0.95">Detalles que cuentan historias.</text>
</svg>
`);

async function generate() {
  await sharp(join(PUBLIC, "Banner.webp"))
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(join(PUBLIC, "og-image.jpg"));

  const { size } = await stat(join(PUBLIC, "og-image.jpg"));
  console.log(`og-image.jpg generado — ${(size / 1024).toFixed(0)} KB (${WIDTH}x${HEIGHT}, JPEG)`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
