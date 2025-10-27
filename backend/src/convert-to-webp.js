import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "../../frontend/app/src/assets/images";   // 📂 source folder
const outputDir = "../../frontend/app/src/assets/images/output"; // 📁 output folder

// create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// supported input extensions
const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".avif"];

function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.includes(ext)) return;

  const fileName = path.basename(filePath, ext);
  const outputPath = path.join(outputDir, `${fileName}.webp`);

  sharp(filePath)
    .toFormat("webp", { quality: 80 })
    .toFile(outputPath)
    .then(() => console.log(`✅ Converted: ${fileName}${ext} → ${fileName}.webp`))
    .catch(err => console.error(`❌ Error converting ${fileName}:`, err));
}

// scan folder recursively
function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      convertToWebp(fullPath);
    }
  });
}

processDirectory(inputDir);
