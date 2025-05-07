// api/random-image.js
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const imagesDir = path.resolve('./public/images');
  if (!fs.existsSync(imagesDir)) {
    return res.status(500).send('Image directory not found');
  }

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

  if (imageFiles.length === 0) {
    return res.status(404).send('No images found');
  }

  const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
  const filePath = path.join(imagesDir, randomImage);
  const ext = path.extname(randomImage).toLowerCase();

  const mimeTypeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  const mimeType = mimeTypeMap[ext] || 'application/octet-stream';
  const imageBuffer = fs.readFileSync(filePath);

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', 'no-store');
  res.send(imageBuffer);
}

