// Document Scanner Logic

let state = {
  currentStep: 'capture', // 'capture', 'adjust', 'enhance'
  capturedImage: null,
  adjustedImage: null,
  cornerPoints: null,
  gpsData: null,
  currentFilter: 'color'
};

// DOM elements
const elements = {
  stepCapture: document.getElementById('step-capture'),
  stepAdjust: document.getElementById('step-adjust'),
  stepEnhance: document.getElementById('step-enhance'),
  cameraVideo: document.getElementById('camera-video'),
  cameraError: document.getElementById('camera-error'),
  btnCapture: document.getElementById('btn-capture'),
  btnRetake: document.getElementById('btn-retake'),
  btnNext: document.getElementById('btn-next'),
  btnUpload: document.getElementById('btn-upload'),
  btnRetryCamera: document.getElementById('retry-camera'),
  adjustCanvas: document.getElementById('adjust-canvas'),
  previewCanvas: document.getElementById('preview-canvas'),
  enhanceCanvas: document.getElementById('enhance-canvas'),
  cornerHandles: document.getElementById('corner-handles'),
  enhanceCaption: document.getElementById('enhance-caption'),
  enhanceProject: document.getElementById('enhance-project'),
  enhanceGps: document.getElementById('enhance-gps'),
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingMessage: document.getElementById('loading-message'),
  successToast: document.getElementById('success-toast'),
  filterTabs: document.querySelectorAll('.tab-btn')
};

let camera = null;
let jscanify = null;
let cornerPositions = { tl: null, tr: null, bl: null, br: null };
let draggedHandle = null;

// ===== Utility: GPS & Timestamp =====
async function captureGPS() {
  return new Promise((resolve) => {
    if (!navigator.geolocation || !elements.enhanceGps.checked) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        });
      },
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

// ===== Step 1: Capture =====
async function initCamera() {
  try {
    elements.cameraError.style.display = 'none';
    elements.btnCapture.disabled = true;
    elements.btnCapture.textContent = 'Loading camera...';

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    camera = stream;
    elements.cameraVideo.srcObject = stream;
    await new Promise(resolve => {
      elements.cameraVideo.onloadedmetadata = resolve;
    });

    elements.btnCapture.disabled = false;
    elements.btnCapture.textContent = '📷 Capture';
  } catch (error) {
    console.error('Camera error:', error);
    elements.cameraError.style.display = 'flex';
    elements.btnCapture.disabled = true;
  }
}

function captureFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = elements.cameraVideo.videoWidth;
  canvas.height = elements.cameraVideo.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(elements.cameraVideo, 0, 0);
  return canvas;
}

elements.btnCapture.addEventListener('click', () => {
  const capturedCanvas = captureFrame();
  state.capturedImage = capturedCanvas;

  // Stop camera stream
  if (camera) {
    camera.getTracks().forEach(track => track.stop());
    camera = null;
  }

  goToStep('adjust');
});

elements.btnRetryCamera.addEventListener('click', initCamera);

// ===== Step 2: Adjust Corners =====
function goToStep(stepName) {
  elements.stepCapture.classList.remove('active');
  elements.stepAdjust.classList.remove('active');
  elements.stepEnhance.classList.remove('active');

  state.currentStep = stepName;

  if (stepName === 'adjust') {
    elements.stepAdjust.classList.add('active');
    setupAdjustStep();
  } else if (stepName === 'enhance') {
    elements.stepEnhance.classList.add('active');
    setupEnhanceStep();
  } else {
    elements.stepCapture.classList.add('active');
  }
}

function setupAdjustStep() {
  // Draw captured image to adjust canvas
  const img = state.capturedImage;
  const canvas = elements.adjustCanvas;
  const ctx = canvas.getContext('2d');

  // Set canvas size
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Initialize jscanify and detect corners
  if (window.jscanify) {
    jscanify = new window.jscanify();
    try {
      const paperContour = jscanify.findPaperContours(img);
      if (paperContour && paperContour.length === 4) {
        // Contour is in format [x, y, w, h] typically; jscanify returns corners as points
        const corners = jscanify.approxPolyDP(paperContour, 0.02 * jscanify.arcLength(paperContour), true);
        if (corners && corners.length === 4) {
          updateCornerPositions(corners, canvas);
        } else {
          initDefaultCorners(canvas);
        }
      } else {
        initDefaultCorners(canvas);
      }
    } catch (e) {
      console.warn('jscanify contour detection failed, using defaults:', e);
      initDefaultCorners(canvas);
    }
  } else {
    initDefaultCorners(canvas);
  }

  setupCornerHandles();
  updatePreview();
}

function initDefaultCorners(canvas) {
  const margin = 20;
  cornerPositions = {
    tl: { x: margin, y: margin },
    tr: { x: canvas.width - margin, y: margin },
    bl: { x: margin, y: canvas.height - margin },
    br: { x: canvas.width - margin, y: canvas.height - margin }
  };
}

function updateCornerPositions(contourPoints, canvas) {
  // Assume contourPoints is an array of {x, y} objects
  if (!Array.isArray(contourPoints) || contourPoints.length < 4) {
    initDefaultCorners(canvas);
    return;
  }

  // Sort points into corners: top-left, top-right, bottom-right, bottom-left
  const points = contourPoints.slice(0, 4).map(p => ({
    x: typeof p[0] !== 'undefined' ? p[0] : p.x,
    y: typeof p[1] !== 'undefined' ? p[1] : p.y
  }));

  points.sort((a, b) => a.y - b.y); // Sort by Y first
  const [topLeft, topRight, ...rest] = points.length > 3 && points[1].x > points[0].x
    ? [points[0], points[1], points[2], points[3]]
    : [points[0], points[1]].concat(points.slice(2).sort((a, b) => a.x - b.x));

  cornerPositions = {
    tl: topLeft || { x: 20, y: 20 },
    tr: topRight || { x: canvas.width - 20, y: 20 },
    bl: rest[0] || { x: 20, y: canvas.height - 20 },
    br: rest[1] || { x: canvas.width - 20, y: canvas.height - 20 }
  };
}

function setupCornerHandles() {
  const handleMap = {
    tl: document.getElementById('handle-tl'),
    tr: document.getElementById('handle-tr'),
    bl: document.getElementById('handle-bl'),
    br: document.getElementById('handle-br')
  };

  Object.entries(handleMap).forEach(([corner, handleEl]) => {
    const pos = cornerPositions[corner];
    handleEl.style.left = pos.x + 'px';
    handleEl.style.top = pos.y + 'px';

    handleEl.addEventListener('mousedown', startDrag);
    handleEl.addEventListener('touchstart', startDrag);
  });
}

function startDrag(e) {
  draggedHandle = e.target.dataset.corner;
  e.preventDefault();
}

document.addEventListener('mousemove', onDrag);
document.addEventListener('touchmove', onDrag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function onDrag(e) {
  if (!draggedHandle) return;

  const rect = elements.adjustCanvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  cornerPositions[draggedHandle] = { x: Math.max(0, Math.min(x, elements.adjustCanvas.width)), y: Math.max(0, Math.min(y, elements.adjustCanvas.height)) };
  updateHandlePosition(draggedHandle);
  updatePreview();
}

function endDrag() {
  draggedHandle = null;
}

function updateHandlePosition(corner) {
  const handleEl = document.getElementById(`handle-${corner}`);
  const pos = cornerPositions[corner];
  handleEl.style.left = pos.x + 'px';
  handleEl.style.top = pos.y + 'px';
}

function updatePreview() {
  // Apply perspective transform using the corner positions
  const canvas = elements.previewCanvas;
  const ctx = canvas.getContext('2d');
  const srcImg = state.capturedImage;

  // Set preview canvas size (maintain aspect ratio)
  const aspectRatio = srcImg.width / srcImg.height;
  const previewHeight = 150;
  const previewWidth = previewHeight * aspectRatio;
  canvas.width = previewWidth;
  canvas.height = previewHeight;

  // For now, just draw the image scaled (full perspective transform requires canvas transform matrix)
  // A real implementation would use canvas matrix transforms or OpenCV for perspective correction
  ctx.drawImage(srcImg, 0, 0, previewWidth, previewHeight);
}

elements.btnRetake.addEventListener('click', () => {
  state.capturedImage = null;
  goToStep('capture');
  initCamera();
});

elements.btnNext.addEventListener('click', () => {
  // Store adjusted image for the enhance step
  state.adjustedImage = elements.adjustCanvas;
  goToStep('enhance');
});

// ===== Step 3: Enhance & Upload =====
async function setupEnhanceStep() {
  // Draw the adjusted image to enhance canvas
  const canvas = elements.enhanceCanvas;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(elements.adjustCanvas, 0, 0);

  // Load projects for the picker
  await loadProjects();

  // Capture GPS data
  if (elements.enhanceGps.checked) {
    state.gpsData = await captureGPS();
  }
}

async function loadProjects() {
  try {
    const response = await fetch('/api/projects?leaves_only=true&limit=all');
    if (!response.ok) throw new Error('Failed to load projects');

    const projects = await response.json();
    const select = elements.enhanceProject;
    select.innerHTML = '<option value="">Select a project...</option>';

    if (Array.isArray(projects)) {
      projects.forEach(proj => {
        const option = document.createElement('option');
        option.value = proj.id;
        option.textContent = proj.name || `Project ${proj.id}`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Filter tabs
elements.filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    elements.filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    state.currentFilter = filter;
    applyFilter(filter);
  });
});

function applyFilter(filter) {
  const canvas = elements.enhanceCanvas;
  const ctx = canvas.getContext('2d');

  // Re-draw the adjusted image
  ctx.drawImage(elements.adjustCanvas, 0, 0);

  if (filter === 'gray') {
    applyGrayscale(canvas);
  } else if (filter === 'bw') {
    applyBW(canvas);
  }
  // 'color' is default, no filter
}

function applyGrayscale(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyBW(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Adaptive threshold for high-contrast B&W
  const threshold = 128;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    const bw = gray > threshold ? 255 : 0;
    data[i] = bw;
    data[i + 1] = bw;
    data[i + 2] = bw;
  }

  ctx.putImageData(imageData, 0, 0);
}

// Upload button
elements.btnUpload.addEventListener('click', uploadPhoto);

async function uploadPhoto() {
  if (!elements.enhanceProject.value) {
    alert('Please select a project');
    return;
  }

  elements.btnUpload.disabled = true;
  elements.loadingOverlay.style.display = 'flex';
  elements.loadingMessage.textContent = 'Uploading...';

  try {
    // Get the final canvas as JPEG
    const canvas = elements.enhanceCanvas;
    const quality = state.currentFilter === 'bw' ? 0.95 : 0.85;

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    // Build FormData
    // HIGH-3 fix: field name must be 'photo' (multer uses upload.single('photo'))
    // and GPS field names must match backend: gps_lat, gps_lon, gps_accuracy_m.
    const formData = new FormData();
    formData.append('project_id', elements.enhanceProject.value);
    formData.append('photo', blob, `scan-${Date.now()}.jpg`);

    if (elements.enhanceCaption.value) {
      formData.append('caption', elements.enhanceCaption.value);
    }

    if (state.gpsData) {
      formData.append('gps_lat', state.gpsData.latitude);
      formData.append('gps_lon', state.gpsData.longitude);
      formData.append('gps_accuracy_m', state.gpsData.accuracy);
    }

    // Submit
    const response = await fetch('/api/project-photos', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');

    // Success!
    elements.loadingOverlay.style.display = 'none';
    elements.successToast.style.display = 'block';

    setTimeout(() => {
      elements.successToast.style.display = 'none';
      // Return to main page
      window.location.href = 'index.html';
    }, 2000);
  } catch (error) {
    console.error('Upload error:', error);
    elements.loadingOverlay.style.display = 'none';
    elements.btnUpload.disabled = false;
    alert('Upload failed. Please try again.');
  }
}

// ===== Initialization =====
window.addEventListener('load', () => {
  initCamera();
});

// OpenCV.js ready callback
function onOpenCvReady() {
  console.log('OpenCV.js is ready');
}
