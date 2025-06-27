const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { randomDelay } = require('../utils/zipUtils');

const downloadVideo = async (videoUrl) => {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = Date.now();
    const videoPath = path.join(tempDir, `video-${timestamp}.mp4`);
    
    // Set up axios with a realistic user agent and headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      'TE': 'Trailers'
    };
    
    // Add a random delay to appear more human-like
    await randomDelay(1, 3);
    
    // Download the video
    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream',
      headers: headers,
      timeout: 60000, // 60 seconds timeout
      maxRedirects: 5,
      validateStatus: status => status === 200
    });
    
    // Create a write stream to save the video
    const writer = require('fs').createWriteStream(videoPath);
    
    // Pipe the response data to the file
    response.data.pipe(writer);
    
    // Return a promise that resolves when the download is complete
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(videoPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error(`Failed to download video: ${error.message}`);
  }
};

module.exports = { downloadVideo };
