const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const createZip = async (filePaths, prefix) => {
  return new Promise((resolve, reject) => {
    const zipName = `${prefix}-${uuidv4()}.zip`;
    const zipPath = path.join(__dirname, '../../temp', zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Ensure temp directory exists
    fs.mkdir(path.dirname(zipPath), { recursive: true });

    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);

    archive.pipe(output);

    // Add files to the archive
    filePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: path.basename(filePath) });
      }
    });

    archive.finalize();
  });
};

// Function to generate a random delay between min and max seconds
const randomDelay = (minSeconds = 1, maxSeconds = 3) => {
  const delayMs = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
  return new Promise(resolve => setTimeout(resolve, delayMs));
};

// Function to simulate human-like mouse movements and delays
const humanLikeActions = async (page) => {
  // Random viewport size to mimic different devices
  const viewports = [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 },
  ];
  const viewport = viewports[Math.floor(Math.random() * viewports.length)];
  await page.setViewport(viewport);
  
  // Random mouse movement
  await page.mouse.move(
    Math.floor(Math.random() * viewport.width),
    Math.floor(Math.random() * viewport.height),
    { steps: 10 }
  );
  
  // Random scroll
  await page.evaluate(() => {
    window.scrollBy(0, Math.floor(Math.random() * 500));
  });
  
  // Random delay
  await randomDelay(1, 3);
};

module.exports = {
  createZip,
  randomDelay,
  humanLikeActions
};
