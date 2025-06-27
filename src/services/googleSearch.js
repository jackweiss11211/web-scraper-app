const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { randomDelay, humanLikeActions } = require('../utils/zipUtils');

const searchGoogle = async (query) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-notifications',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set a realistic viewport
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to Google
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    await randomDelay(1, 2);
    
    // Human-like actions
    await humanLikeActions(page);
    
    // Type the search query
    await page.type('textarea[name="q"]', query, { delay: 50 + Math.random() * 100 });
    await randomDelay(0.5, 1.5);
    
    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Additional human-like delay
    await randomDelay(2, 4);
    
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Generate unique filenames
    const timestamp = Date.now();
    const screenshotPath = path.join(tempDir, `search-${timestamp}.png`);
    const htmlPath = path.join(tempDir, `search-${timestamp}.html`);
    
    // Take screenshot of search results
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Get the HTML content
    const htmlContent = await page.content();
    await fs.writeFile(htmlPath, htmlContent);
    
    return { screenshotPath, htmlPath };
  } catch (error) {
    console.error('Error during Google search:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { googleSearch: searchGoogle };
