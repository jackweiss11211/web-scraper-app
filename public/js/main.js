// DOM Elements
const searchForm = document.querySelector('#searchForm');
const captureForm = document.querySelector('#captureForm');
const downloadForm = document.querySelector('#downloadForm');

// Show loading indicator
function showLoading(loaderId) {
    document.getElementById(loaderId).style.display = 'block';
    clearResult(loaderId.replace('Loading', 'Result'));
}

// Hide loading indicator
function hideLoading(loaderId) {
    document.getElementById(loaderId).style.display = 'none';
}

// Show result message
function showResult(containerId, message, isError = false) {
    const resultDiv = document.getElementById(containerId);
    resultDiv.textContent = message;
    resultDiv.className = `result-message ${isError ? 'error' : 'success'}`;
    resultDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

// Clear result message
function clearResult(containerId) {
    const resultDiv = document.getElementById(containerId);
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.textContent = '';
    }
}

// Handle search form submission
async function handleSearch() {
    const query = document.getElementById('searchQuery').value.trim();
    const loaderId = 'searchLoading';
    const resultId = 'searchResult';
    
    if (!query) {
        showResult(resultId, 'Please enter a search term', true);
        return;
    }
    
    try {
        showLoading(loaderId);
        
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to process search');
        }
        
        // Trigger file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `search-results-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showResult(resultId, 'Search results downloaded successfully!');
    } catch (error) {
        console.error('Search error:', error);
        showResult(resultId, `Error: ${error.message}`, true);
    } finally {
        hideLoading(loaderId);
    }
}

// Handle page capture form submission
async function handlePageCapture() {
    const url = document.getElementById('pageUrl').value.trim();
    const loaderId = 'captureLoading';
    const resultId = 'captureResult';
    
    if (!url) {
        showResult(resultId, 'Please enter a valid URL', true);
        return;
    }
    
    try {
        showLoading(loaderId);
        
        const response = await fetch('/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to capture page');
        }
        
        // Trigger file download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `page-capture-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        showResult(resultId, 'Page captured and downloaded successfully!');
    } catch (error) {
        console.error('Page capture error:', error);
        showResult(resultId, `Error: ${error.message}`, true);
    } finally {
        hideLoading(loaderId);
    }
}

// Handle video download form submission
async function handleVideoDownload() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const loaderId = 'videoLoading';
    const resultId = 'videoResult';
    
    if (!videoUrl) {
        showResult(resultId, 'Please enter a valid video URL', true);
        return;
    }
    
    try {
        showLoading(loaderId);
        
        const response = await fetch('/api/download-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to download video');
        }
        
        // Trigger file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Try to get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `video-${Date.now()}.mp4`;
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showResult(resultId, 'Video downloaded successfully!');
    } catch (error) {
        console.error('Video download error:', error);
        showResult(resultId, `Error: ${error.message}`, true);
    } finally {
        hideLoading(loaderId);
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add input event listeners to clear error messages when user types
    document.getElementById('searchQuery')?.addEventListener('input', () => {
        clearResult('searchResult');
    });
    
    document.getElementById('pageUrl')?.addEventListener('input', () => {
        clearResult('captureResult');
    });
    
    document.getElementById('videoUrl')?.addEventListener('input', () => {
        clearResult('videoResult');
    });
    
    // Add form submit handlers
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSearch();
        });
    }
    
    if (captureForm) {
        captureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePageCapture();
        });
    }
    
    if (downloadForm) {
        downloadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleVideoDownload();
        });
    }
});
