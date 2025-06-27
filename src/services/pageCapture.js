const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { randomDelay, humanLikeActions } = require('../utils/zipUtils');

const capturePage = async (url) => {
  // Configure Puppeteer launch options
const launchOptions = {
  headless: 'new',
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
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    '--remote-debugging-port=9222',
    '--remote-debugging-address=0.0.0.0',
    '--disable-software-rasterizer',
    '--disable-features=VizDisplayCompositor'
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
};

// Add timeout for Render
const browser = await puppeteer.launch(launchOptions).catch(error => {
  console.error('Failed to launch browser:', error);
  throw new Error('Failed to launch browser');
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
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 // 30 seconds timeout
    });
    
    // Human-like delay
    await randomDelay(2, 4);
    
    // Human-like actions
    await humanLikeActions(page);
    
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Generate unique filenames
    const timestamp = Date.now();
    const screenshotPath = path.join(tempDir, `page-${timestamp}.png`);
    const htmlPath = path.join(tempDir, `page-${timestamp}.html`);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      type: 'png',
      encoding: 'binary'
    });
    
    // Get the HTML content
    const htmlContent = await page.content();
    await fs.writeFile(htmlPath, htmlContent, 'utf8');
    
    return { screenshotPath, htmlPath };
  } catch (error) {
    console.error('Error during page capture:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { captureFullPage: capturePage };
