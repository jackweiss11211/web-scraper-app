#!/bin/bash
set -o errexit

# Install dependencies
npm install

# Install Chrome for Puppeteer
if [ ! -z "$RENDER" ]; then
  echo "Running on Render, installing Chrome..."
  apt-get update
  apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils
    
  # Install Chrome
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install
  
  # Set Chrome path for Puppeteer
  export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
  
  # Clean up
  rm google-chrome-stable_current_amd64.deb
  apt-get clean
  rm -rf /var/lib/apt/lists/*
  
  echo "Chrome installation complete"
fi

echo "Build script completed successfully"
