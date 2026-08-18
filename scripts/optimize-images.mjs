import sharp from "sharp";
import { stat } from "fs/promises";
import { join } from "path";

const PUBLIC = join(import.meta.dirname, "..", "public");
const PRODUCTS = join(PUBLIC, "products");

const productImages = [
  "AuraRosa.png",
  "Aurora.png",
  "Cora.png",
  "Coral.png",
  "Elle.png",
  "Greta.png",
  "Lula.png",
  "Maia.png",
  "Margot.png",
  "Nacar.png",
  "Nemo.png",
  "Ohana.png",
];

const logoImages = ["CialeMarron.png", "CialeClaro.png"];
const bannerImage = "Banner.png";

async function optimize() {
  // Banner
  console.log(`\n🔄 ${bannerImage} — resizing to max 1920px wide, WebP q80`);
  await sharp(join(PUBLIC, bannerImage))
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(PUBLIC, "Banner.webp"));
  const bannerAfter = await stat(join(PUBLIC, "Banner.webp"));
  console.log(`   ✅ Banner.webp — ${(bannerAfter.size / 1024 / 1024).toFixed(1)} MB`);

  // Products
  for (const file of productImages) {
    console.log(`🔄 ${file} — WebP q80`);
    await sharp(join(PRODUCTS, file))
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(PRODUCTS, file.replace(/\.png$/, ".webp")));
    const after = await stat(join(PRODUCTS, file.replace(/\.png$/, ".webp")));
    console.log(`   ✅ ${file.replace(/\.png$/, ".webp")} — ${(after.size / 1024).toFixed(0)} KB`);
  }

  // Logos
  for (const file of logoImages) {
    console.log(`🔄 ${file} — WebP q85`);
    await sharp(join(PUBLIC, file))
      .webp({ quality: 85 })
      .toFile(join(PUBLIC, file.replace(/\.png$/, ".webp")));
    const after = await stat(join(PUBLIC, file.replace(/\.png$/, ".webp")));
    console.log(`   ✅ ${file.replace(/\.png$/, ".webp")} — ${(after.size / 1024).toFixed(0)} KB`);
  }

  console.log("\n🎉 Done!");
}

optimize().catch((err) => {
  console.error(err);
  process.exit(1);
});
