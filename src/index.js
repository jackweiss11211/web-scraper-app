require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;
const { googleSearch } = require('./services/googleSearch');
const { captureFullPage } = require('./services/pageCapture');
const { downloadVideo } = require('./services/videoDownloader');
const { createZip } = require('./utils/zipUtils');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust first proxy (Render's load balancer)
app.set('trust proxy', 1); // trust first proxy

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use the client's IP from the X-Forwarded-For header if it exists
    // This ensures rate limiting works behind a reverse proxy like Render
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }
});
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Google Search Endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const { screenshotPath, htmlPath } = await googleSearch(query);
    const zipPath = await createZip([screenshotPath, htmlPath], 'search-results');
    
    res.download(zipPath, () => {
      // Clean up files after sending
      fs.unlink(screenshotPath).catch(console.error);
      fs.unlink(htmlPath).catch(console.error);
      fs.unlink(zipPath).catch(console.error);
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Failed to process search request' });
  }
});

// Full Page Capture Endpoint
app.post('/api/capture', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const { screenshotPath, htmlPath } = await captureFullPage(url);
    const zipPath = await createZip([screenshotPath, htmlPath], 'page-capture');
    
    res.download(zipPath, () => {
      // Clean up files after sending
      fs.unlink(screenshotPath).catch(console.error);
      fs.unlink(htmlPath).catch(console.error);
      fs.unlink(zipPath).catch(console.error);
    });
  } catch (error) {
    console.error('Error in page capture:', error);
    res.status(500).json({ error: 'Failed to capture page' });
  }
});

// Video Download Endpoint
app.post('/api/download-video', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL parameter is required' });
    }

    const videoPath = await downloadVideo(videoUrl);
    const zipPath = await createZip([videoPath], 'video-download');
    
    res.download(zipPath, () => {
      // Clean up files after sending
      fs.unlink(videoPath).catch(console.error);
      fs.unlink(zipPath).catch(console.error);
    });
  } catch (error) {
    console.error('Error in video download:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
