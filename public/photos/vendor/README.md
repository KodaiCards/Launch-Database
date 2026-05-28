# Vendor Libraries for Document Scanner

This directory contains third-party JavaScript libraries required for the document scanner feature.

## Required Files

### opencv.min.js
- **Source:** https://github.com/opencv/opencv.js
- **Size:** ~10MB
- **License:** Apache 2.0
- **Purpose:** Computer vision operations (contour detection, perspective transform, image processing)
- **CDN Alternative:** https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html

Installation:
```bash
# Option 1: Download from official repository
wget https://github.com/opencv/opencv.js/releases/download/4.5.0/opencv.js -O opencv.min.js

# Option 2: Use a pre-built CDN version and minify
# Check the OpenCV.js documentation for latest builds
```

### jscanify.min.js
- **Source:** https://github.com/ColonelParrot/jscanify
- **Size:** ~50KB
- **License:** MIT
- **Purpose:** Document edge detection, corner finding, perspective transform wrapper
- **Package:** npm install jscanify

Installation:
```bash
# Option 1: Clone the repository and minify
git clone https://github.com/ColonelParrot/jscanify.git
# Build per jscanify documentation
# Copy dist/jscanify.min.js here

# Option 2: Use npm (if available)
npm install jscanify
# Copy node_modules/jscanify/dist/jscanify.min.js here
```

## Offline Support

Both files are cached by the service worker (sw.js) for offline functionality. After adding these files, update the cache version in sw.js.

## Notes

- OpenCV.js must load BEFORE jscanify (jscanify depends on the cv global variable)
- Both files are loaded asynchronously in scanner.html; see `onOpenCvReady()` callback
- File size is significant (~10MB total); consider using lazy-loading or code-splitting in production
- Checksums (SHA256) of vendored files should be documented here for security verification
