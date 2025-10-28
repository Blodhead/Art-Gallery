import fs from "fs";

const inputPath = "./Parfumes.Parfumes.json";
const outputPath = "./Parfumes.Parfumes.webp.json";

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

data.forEach(item => {
  if (item.img_location) {
    item.img_location = item.img_location.replace(/\.(jpg|jpeg|png|gif|avif)$/i, ".webp");
  }
});

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log("✅ Updated file saved to", outputPath);
