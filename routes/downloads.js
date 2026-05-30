const fs = require('fs');
const path = require('path');

module.exports = function installDownloadsRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || ((req, res, next) => next());

  // GET /api/downloads/manifest - list of available installers
  app.get('/api/downloads/manifest', requireAuth, async (req, res) => {
    try {
      const installersDir = path.join(__dirname, '..', 'public', 'downloads', 'installers');
      const manifestPath = path.join(installersDir, 'manifest.json');

      // If manifest.json exists, return it; otherwise scan the dir
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return res.json(manifest);
      }

      // Auto-scan fallback: list .exe / .dmg / .deb / .AppImage files
      if (!fs.existsSync(installersDir)) {
        return res.json({installers: []});
      }

      const files = fs.readdirSync(installersDir).filter(f => /\.(exe|dmg|deb|AppImage)$/i.test(f));
      const installers = files.map(f => {
        const fullPath = path.join(installersDir, f);
        const stat = fs.statSync(fullPath);
        const platform = /\.exe$/i.test(f) ? 'windows' : /\.dmg$/i.test(f) ? 'macos' : 'linux';
        return {
          platform,
          filename: f,
          size_bytes: stat.size,
          download_url: `/downloads/installers/${encodeURIComponent(f)}`,
          released_at: stat.mtime.toISOString(),
        };
      });
      res.json({installers});
    } catch (e) {
      console.error('[downloads:manifest]', e && e.message);
      res.status(500).json({error: 'Internal error.'});
    }
  });
};
