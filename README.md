# Web Scraper Application

A web application that provides three main functionalities:
1. **Google Search Capture**: Takes a search term and returns a zip file with a screenshot of Google search results and the HTML.
2. **Webpage Capture**: Takes a URL and returns a zip file with a full-page screenshot and the HTML.
3. **Video Downloader**: Takes a direct video URL and returns the video file.

## Features

- Modern, responsive UI built with Bootstrap 5
- Human-like browsing behavior to avoid bot detection
- Server-side rendering with Express.js
- Automatic cleanup of temporary files
- Rate limiting to prevent abuse
- Error handling and user feedback

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Render account (for deployment)

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-scraper-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to access the application.

## Deployment to Render

### Prerequisites
- A Render account (sign up at [render.com](https://render.com/))
- Git installed on your local machine

### Steps to Deploy

1. **Create a new Web Service on Render**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub/GitLab account or use the public repository

2. **Configure the Web Service**
   - **Name**: web-scraper-app (or your preferred name)
   - **Region**: Choose the closest region to your users
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select a paid plan for better performance)

3. **Set Environment Variables**
   Add the following environment variables in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Once deployed, you'll receive a URL where your app is live

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port the server will run on | 3000 |
| NODE_ENV | Environment (development/production) | development |
| RATE_LIMIT_WINDOW_MS | Rate limiting window in milliseconds | 900000 (15 minutes) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per IP per window | 100 |
| TEMP_DIR | Directory for temporary files | ./temp |

## Project Structure

```
web-scraper-app/
├── public/                 # Static files
│   ├── css/                # CSS files
│   ├── js/                 # Client-side JavaScript
│   └── index.html          # Main HTML file
├── src/
│   ├── services/          # Business logic
│   │   ├── googleSearch.js # Google search functionality
│   │   ├── pageCapture.js  # Webpage capture functionality
│   │   └── videoDownloader.js # Video download functionality
│   ├── utils/              # Utility functions
│   │   └── zipUtils.js     # File compression utilities
│   └── index.js            # Main application file
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Usage

1. **Google Search**
   - Enter a search term in the first card
   - Click "Get Results"
   - A zip file will be downloaded containing a screenshot and HTML of the search results

2. **Page Capture**
   - Enter a URL in the second card
   - Click "Capture Page"
   - A zip file will be downloaded containing a full-page screenshot and HTML

3. **Video Download**
   - Enter a direct video URL in the third card
   - Click "Download Video"
   - The video file will be downloaded

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the GitHub repository.

## Security

- Rate limiting is implemented to prevent abuse
- Input validation is performed on all user inputs
- Temporary files are automatically cleaned up after use
- Sensitive information is stored in environment variables

## Limitations

- Video download only works with direct video links
- Some websites may block automated access
- Large webpages might take time to capture completely

## Troubleshooting

- **Puppeteer Timeout Errors**: Increase the `PUPPETEER_TIMEOUT` in the `.env` file
- **Memory Issues**: The free tier on Render has limited memory. Consider upgrading for better performance
- **Deployment Failures**: Check the logs in the Render dashboard for specific error messages

## Future Enhancements

- Add user authentication
- Support for more video platforms
- Scheduled scraping
- API documentation
- More customization options for captures
- Support for PDF generation

---

Happy Scraping! 🚀
