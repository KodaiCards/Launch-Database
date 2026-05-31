// Desktop installer downloads + admin upload/delete (Wave 120 / Wave 238).
//
// Storage location resolves from the env var INSTALLERS_DIR (default:
// <repo>/public/downloads/installers). In production on Railway, this should
// point at a persistent volume mount (e.g. /data/installers) so installers
// survive container restarts and aren't shipped in the git tree.
//
// The same path is also exposed via server.js as a static mount at
// /downloads/installers (auth-gated), so the URLs returned by the manifest
// resolve in the browser regardless of whether the dir lives inside public/
// or on a mounted volume.
const fs = require('fs');
const path = require('path');
const os = require('os');
const multer = require('multer');
const { logAudit } = require('./_audit');

// Resolve the installers storage dir from env, falling back to the legacy
// in-tree location so dev installs keep working without extra config.
function resolveInstallersDir() {
  return process.env.INSTALLERS_DIR
    ? path.resolve(process.env.INSTALLERS_DIR)
    : path.join(__dirname, '..', 'public', 'downloads', 'installers');
}

// Ensure dir exists at boot — mkdir -p semantics. Errors are logged but
// non-fatal: a missing dir just means the manifest returns an empty list
// until the admin uploads a first installer.
function ensureInstallersDir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.error('[downloads] failed to create INSTALLERS_DIR:', dir, e && e.message);
  }
}

// Path-traversal-safe filename validator. Rejects anything containing path
// separators, '..', null bytes, leading dots, or non-printable characters.
// Accepts the conventional installer extensions only.
function isSafeFilename(name) {
  if (typeof name !== 'string' || name.length === 0 || name.length > 255) return false;
  if (/[\/\\]/.test(name)) return false;            // path separators
  if (name.includes('..')) return false;             // traversal
  if (/[\x00-\x1f\x7f]/.test(name)) return false;    // control chars / null
  if (name.startsWith('.')) return false;            // hidden-file / current-dir
  if (!/\.(exe|dmg|deb|AppImage)$/i.test(name)) return false;
  return true;
}

// Strip any path components from an uploaded filename and tighten character
// set to alnum/hyphen/underscore/dot/space. Multer gives us originalname
// straight from the browser, which is attacker-controlled.
function sanitizeOriginalName(name) {
  if (typeof name !== 'string') return '';
  const base = path.basename(name);                  // drop any client-sent path
  return base
    .replace(/[^A-Za-z0-9._\- ]/g, '_')              // tighten character set
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

function platformFromFilename(f) {
  if (/\.exe$/i.test(f)) return 'windows';
  if (/\.dmg$/i.test(f)) return 'macos';
  return 'linux';   // .deb / .AppImage
}

module.exports = function installDownloadsRoutes(app, pool, mw) {
  // requireAuth from auth.js is a higher-order function — must be CALLED
  // to get the middleware. Calling with no args means "any authenticated
  // role." Without the parens, Express was passed the bare factory, which
  // hangs the request and freezes the Downloads page on "Loading...".
  const requireAuthMW = (mw && mw.requireAuth) ? mw.requireAuth() : ((req, res, next) => next());
  // Admin gate. If auth.js wasn't wired we degrade closed (403) rather than
  // silently open the endpoint.
  const requireAdminMW = (mw && mw.requireAdmin)
    ? mw.requireAdmin
    : ((req, res) => res.status(403).json({ error: 'Admin required' }));

  const INSTALLERS_DIR = resolveInstallersDir();
  ensureInstallersDir(INSTALLERS_DIR);
  // Expose for server.js static mount and for tests.
  app.locals.installersDir = INSTALLERS_DIR;

  // Multer disk storage to OS temp dir; we move into INSTALLERS_DIR only
  // after extension/duplicate validation succeeds. 200 MB cap matches the
  // typical electron-builder Windows installer size with headroom.
  const tempUploadDir = path.join(os.tmpdir(), 'lfs-installer-uploads');
  try { if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir, { recursive: true }); } catch (_) {}

  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, tempUploadDir),
      filename: (req, file, cb) => {
        // Random temp name — we rename to the sanitized originalname after
        // validation. Keep extension so any size-based sniffing tools still work.
        const rand = Math.random().toString(36).slice(2, 12);
        const ext = path.extname(file.originalname) || '';
        cb(null, `upload_${Date.now()}_${rand}${ext}`);
      },
    }),
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      // Early-reject obviously bad extensions before we accept any bytes.
      // Final filename check happens post-upload against sanitized name.
      if (!/\.(exe|dmg|deb|AppImage)$/i.test(file.originalname)) {
        return cb(new Error('Unsupported file type. Allowed: .exe, .dmg, .deb, .AppImage'));
      }
      cb(null, true);
    },
  });

  // Source priority for the manifest endpoint:
  //   1. GitHub Releases (if GITHUB_REPO env var is set, e.g. "owner/repo")
  //      — the canonical source for production. CI builds the proper
  //      Windows NSIS installer on a Windows runner and publishes it as a
  //      Release asset, so this is always the freshest build.
  //   2. Local INSTALLERS_DIR scan — used in dev or as a fallback when the
  //      GitHub API is unreachable.
  //   3. manifest.json file inside INSTALLERS_DIR — used by anyone who
  //      wants to curate the list manually.
  //
  // Each source returns the same shape: { installers: [...] }
  const GITHUB_REPO = (process.env.GITHUB_REPO || '').trim();
  // Short-lived in-memory cache so the manifest endpoint doesn't hammer
  // the GitHub API on every page load.
  let ghReleaseCache = { ts: 0, value: null };

  async function fetchLatestGitHubRelease() {
    if (!GITHUB_REPO) return null;
    const now = Date.now();
    if (ghReleaseCache.value && (now - ghReleaseCache.ts) < 60 * 1000) {
      return ghReleaseCache.value;
    }
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
    const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'launch-fiber' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(url, { headers });
    if (!r.ok) {
      // 404 = no release yet, treat as empty so the page shows "Coming soon"
      if (r.status === 404) {
        ghReleaseCache = { ts: now, value: { installers: [] } };
        return ghReleaseCache.value;
      }
      throw new Error(`GitHub API ${r.status}`);
    }
    const data = await r.json();
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const installers = assets
      .filter(a => /\.(exe|dmg|deb|AppImage)$/i.test(a.name))
      .map(a => ({
        platform: platformFromFilename(a.name),
        filename: a.name,
        size_bytes: a.size,
        download_url: a.browser_download_url,
        released_at: a.updated_at || data.published_at,
      }));
    ghReleaseCache = { ts: now, value: { installers, release_tag: data.tag_name, release_url: data.html_url } };
    return ghReleaseCache.value;
  }

  // ── GET /api/downloads/manifest ────────────────────────────────────────
  // list of available installers (auth-gated, any role)
  app.get('/api/downloads/manifest', requireAuthMW, async (req, res) => {
    try {
      // 1. GitHub Releases first (production path)
      if (GITHUB_REPO) {
        try {
          const ghResult = await fetchLatestGitHubRelease();
          if (ghResult && ghResult.installers.length > 0) return res.json(ghResult);
          // empty release → fall through to local fallback so dev installs still work
        } catch (ghErr) {
          console.error('[downloads:manifest] GitHub fetch failed, falling back:', ghErr && ghErr.message);
        }
      }

      // 2. Local manifest.json override
      const installersDir = INSTALLERS_DIR;
      const manifestPath = path.join(installersDir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return res.json(manifest);
      }

      // 3. Local dir auto-scan
      if (!fs.existsSync(installersDir)) {
        return res.json({ installers: [] });
      }
      const files = fs.readdirSync(installersDir).filter(f => /\.(exe|dmg|deb|AppImage)$/i.test(f));
      const installers = files.map(f => {
        const fullPath = path.join(installersDir, f);
        const stat = fs.statSync(fullPath);
        return {
          platform: platformFromFilename(f),
          filename: f,
          size_bytes: stat.size,
          download_url: `/downloads/installers/${encodeURIComponent(f)}`,
          released_at: stat.mtime.toISOString(),
        };
      });
      res.json({ installers });
    } catch (e) {
      console.error('[downloads:manifest]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });

  // ── POST /api/admin/downloads/installers ──────────────────────────────
  // Multipart upload, admin only. Field name: "installer".
  // We use upload.single() inside a wrapper so we can intercept multer errors
  // (file-too-large, bad extension) and translate to JSON 4xx instead of
  // letting them fall through to the global error handler.
  app.post('/api/admin/downloads/installers', requireAdminMW, (req, res) => {
    upload.single('installer')(req, res, async (err) => {
      if (err) {
        const msg = err && err.message ? err.message : 'Upload failed';
        const code = err && err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(code).json({ error: msg });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Use field name "installer".' });
      }

      const tempPath = req.file.path;
      try {
        const safeName = sanitizeOriginalName(req.file.originalname);
        if (!isSafeFilename(safeName)) {
          fs.unlink(tempPath, () => {});
          return res.status(400).json({ error: 'Invalid filename. Allowed extensions: .exe, .dmg, .deb, .AppImage' });
        }

        const finalPath = path.join(INSTALLERS_DIR, safeName);
        // Belt-and-suspenders traversal check: resolved final path must live
        // inside INSTALLERS_DIR. sanitize+validate should already prevent
        // escape, but verify after path.join in case a future refactor breaks
        // the invariant.
        const installersRoot = path.resolve(INSTALLERS_DIR) + path.sep;
        if (!path.resolve(finalPath).startsWith(installersRoot)) {
          fs.unlink(tempPath, () => {});
          return res.status(400).json({ error: 'Invalid filename.' });
        }

        if (fs.existsSync(finalPath)) {
          fs.unlink(tempPath, () => {});
          return res.status(409).json({ error: `An installer named "${safeName}" already exists. Delete it first or rename the upload.` });
        }

        // Move from temp into INSTALLERS_DIR. Use rename; fall back to
        // copy+unlink if rename crosses devices (EXDEV) — common on Railway
        // where /tmp and the persistent volume mount are different mounts.
        try {
          fs.renameSync(tempPath, finalPath);
        } catch (e) {
          if (e && e.code === 'EXDEV') {
            fs.copyFileSync(tempPath, finalPath);
            fs.unlinkSync(tempPath);
          } else {
            throw e;
          }
        }

        const stat = fs.statSync(finalPath);
        const platform = platformFromFilename(safeName);
        const payload = {
          filename: safeName,
          size_bytes: stat.size,
          platform,
          download_url: `/downloads/installers/${encodeURIComponent(safeName)}`,
          released_at: stat.mtime.toISOString(),
        };

        // Audit-log the upload. Best-effort: failure here doesn't break the
        // upload response (logAudit catches its own errors).
        logAudit(pool, {
          req,
          action: 'installer_upload',
          entity_type: 'installer',
          entity_id: safeName,
          source: 'admin_ui',
          meta: { size_bytes: stat.size, platform },
        });

        res.status(201).json(payload);
      } catch (e) {
        // Make sure temp file is cleaned up on any error path.
        try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
        console.error('[downloads:upload]', e && e.message);
        res.status(500).json({ error: 'Internal error.' });
      }
    });
  });

  // ── DELETE /api/admin/downloads/installers/:filename ──────────────────
  // Remove an installer. Admin only. Path-traversal safe.
  app.delete('/api/admin/downloads/installers/:filename', requireAdminMW, async (req, res) => {
    try {
      // Decode first (the browser may have URL-encoded the filename), then
      // validate the decoded value against the safe-filename rules. We do NOT
      // sanitize-then-look-up — that could let an attacker map an unsafe
      // filename onto an existing file by transforming dangerous chars.
      let raw;
      try { raw = decodeURIComponent(req.params.filename || ''); }
      catch (_) { return res.status(400).json({ error: 'Invalid filename encoding.' }); }

      if (!isSafeFilename(raw)) {
        return res.status(400).json({ error: 'Invalid filename.' });
      }

      const target = path.join(INSTALLERS_DIR, raw);
      const installersRoot = path.resolve(INSTALLERS_DIR) + path.sep;
      if (!path.resolve(target).startsWith(installersRoot)) {
        return res.status(400).json({ error: 'Invalid filename.' });
      }

      if (!fs.existsSync(target)) {
        return res.status(404).json({ error: 'Not found.' });
      }

      const stat = fs.statSync(target);
      if (stat.isDirectory()) {
        return res.status(400).json({ error: 'Refusing to delete a directory.' });
      }

      fs.unlinkSync(target);

      logAudit(pool, {
        req,
        action: 'installer_delete',
        entity_type: 'installer',
        entity_id: raw,
        source: 'admin_ui',
        meta: { size_bytes: stat.size, platform: platformFromFilename(raw) },
      });

      res.json({ ok: true, filename: raw });
    } catch (e) {
      console.error('[downloads:delete]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });
};

// Exported for server.js so the static mount can use the same resolution logic.
module.exports.resolveInstallersDir = resolveInstallersDir;
module.exports.ensureInstallersDir = ensureInstallersDir;
