const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.resolve(__dirname, '../public/images/traditions');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Curated high quality realistic professional Indian/Telugu wedding photos from Unsplash CDN
const traditionPhotos = [
  {
    filename: 'jeelakarra-bellam.jpg',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'kanyadanam.jpg',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'mangalsutra-dharana.jpg',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'talambralu.jpg',
    url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'saptapadi.jpg',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'appaginthalu.jpg',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status Code ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded photo successfully: ${path.basename(destPath)}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading realistic high quality Telugu wedding photography assets...');
  for (const item of traditionPhotos) {
    const dest = path.join(outputDir, item.filename);
    try {
      await downloadFile(item.url, dest);
    } catch (err) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('Finished downloading tradition photo assets.');
}

run();
