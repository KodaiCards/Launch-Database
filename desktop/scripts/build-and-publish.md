# Build and Publish Desktop Installer

## Prerequisites

- Node.js 16+ installed
- `desktop/` directory with Electron build configuration (use your existing electron-builder setup)

## Steps

### 1. Build the Installer

```bash
cd desktop
npm install
npm run dist
```

This generates an unsigned installer at `dist/Launch Fiber Desktop Setup 0.1.0.exe` (Windows) or similar for macOS/Linux.

### 2. Copy Installer to Public Directory

```bash
mkdir -p ../public/downloads/installers
cp dist/Launch\ Fiber\ Desktop\ Setup\ 0.1.0.exe ../public/downloads/installers/
```

(Adjust the filename for macOS `.dmg` or Linux `.AppImage` as appropriate.)

### 3. (Optional) Update Manifest

If you want explicit manifest metadata (version, sha256, etc.), create `public/downloads/installers/manifest.json`:

```json
{
  "installers": [
    {
      "platform": "windows",
      "version": "0.1.0",
      "filename": "Launch Fiber Desktop Setup 0.1.0.exe",
      "size_bytes": 98765432,
      "sha256": "abcd1234...",
      "download_url": "/downloads/installers/Launch%20Fiber%20Desktop%20Setup%200.1.0.exe",
      "released_at": "2026-05-30T12:00:00Z"
    }
  ]
}
```

If no manifest exists, the `/api/downloads/manifest` endpoint will auto-scan the `installers/` directory.

### 4. Commit and Deploy

```bash
git add public/downloads/installers/
git commit -m "Desktop installer: Launch Fiber 0.1.0"
git push origin main
```

### 5. Verify in Staging/Production

- Navigate to `/downloads/` in your browser
- Confirm the installer card displays with download button
- Click and verify the installer downloads

## Notes

- Installers are unsigned (SmartScreen will warn users on Windows; they click "Run anyway")
- First run requires user login with Launch Fiber account
- All project data syncs automatically after login
- For signed installers, add a code-signing certificate step in your CI/CD pipeline

## Troubleshooting

- **"Coming soon" message:** No `.exe`/`.dmg`/`.deb`/`.AppImage` files in `public/downloads/installers/`
- **Download fails:** Verify the file exists and web server has read permissions
- **SmartScreen blocks on Windows:** This is expected for unsigned installers. Users can click "More info" → "Run anyway"
