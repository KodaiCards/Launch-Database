// ─── lib/browser_pool.js — Shared Puppeteer browser pool ───────────────────
//
// Problem: all three PDF-rendering sites (splice diff export, splice main
// export, invoice_template_engine renderHtmlToPdf) called puppeteer.launch()
// per request — spawning a new Chrome process every time (~1-2 s cold-start,
// ~100-150 MB RAM each). Three concurrent PDF exports hit Railway container
// OOM limits.
//
// Solution: a lightweight singleton pool of 1-2 long-lived browsers.
// Callers call getBrowser() to get a Browser instance, create their own
// Page (so renders are isolated), and call releasePage(page) when done
// to close the page (NOT the browser). The browser stays alive for the
// next request.
//
// Pool size is configurable via PUPPETEER_POOL_SIZE env var (default 2).
// The pool is lazily populated — browsers are only spawned on first demand.
//
// Crash recovery: if a browser dies mid-request, the error propagates to
// the caller. Stale/crashed browsers are detected via browser.isConnected()
// on the next getBrowser() call and are replaced automatically.
//
// SSRF guard note: the setRequestInterception guard (block all non-data:/
// about:blank network requests) is applied per-page at each call site,
// exactly as it was before. Sharing the browser does not weaken this —
// request interception is per-page, not per-browser.
//
// Single-process only: this pool is in-process memory. Railway runs one
// replica; if horizontal scaling is ever added, switch to an external
// queue (e.g., a dedicated PDF render service) rather than this pool.

'use strict';

// Lazy-load puppeteer (same pattern as splice.js / invoice_template_engine.js
// so a missing binary doesn't crash the whole server at startup).
let _puppeteer = null;
function _getPuppeteer() {
  if (_puppeteer) return _puppeteer;
  try {
    _puppeteer = require('puppeteer');
  } catch (e) {
    throw new Error(
      'puppeteer not installed; PDF render unavailable. ' +
      'Run `npm install puppeteer`. Original: ' + e.message
    );
  }
  return _puppeteer;
}

// Standard launch args for Railway Linux containers.
const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
];

const POOL_SIZE = Math.max(1, parseInt(process.env.PUPPETEER_POOL_SIZE, 10) || 2);

// The pool: array of Browser instances (null slots = not yet spawned).
// Grows up to POOL_SIZE as demand arrives; never shrinks below that.
const _browsers = new Array(POOL_SIZE).fill(null);

// Round-robin index so concurrent requests spread across pool slots.
let _rrIdx = 0;

// Per-slot lock: prevents two concurrent getBrowser() calls from both
// seeing null and both spawning a new browser for the same slot.
const _launching = new Array(POOL_SIZE).fill(false);

async function _spawnBrowser(slot) {
  const puppeteer = _getPuppeteer();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: LAUNCH_ARGS,
  });
  // Clean up the pool slot if this browser disconnects unexpectedly
  // (OOM kill, Chrome crash, etc.) so the next getBrowser() call
  // sees null and spawns a fresh one.
  browser.on('disconnected', () => {
    if (_browsers[slot] === browser) {
      _browsers[slot] = null;
    }
  });
  return browser;
}

/**
 * Acquire a Browser from the pool. Spawns a new browser if the slot is
 * empty or the existing one is no longer connected. Callers should create
 * their own Page via `browser.newPage()` and apply per-page setup
 * (setRequestInterception, etc.) independently. When done, call
 * `releasePage(page)` rather than closing the browser.
 *
 * @returns {Promise<import('puppeteer').Browser>}
 */
async function getBrowser() {
  // Simple round-robin slot selection.
  const slot = _rrIdx % POOL_SIZE;
  _rrIdx = (_rrIdx + 1) % POOL_SIZE;

  // If a browser exists and is connected, reuse it immediately.
  const existing = _browsers[slot];
  if (existing && existing.isConnected()) {
    return existing;
  }

  // Slot is empty or crashed. Spawn a new browser.
  // Guard against two concurrent requests both hitting an empty slot by
  // spinning briefly until the first launch completes.
  if (_launching[slot]) {
    // Another concurrent call is already launching this slot — wait for it
    // using a simple exponential-backoff poll. This is a rare contention
    // path (only hits when POOL_SIZE slots fill simultaneously at startup).
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 50 * (attempt + 1)));
      const b = _browsers[slot];
      if (b && b.isConnected()) return b;
    }
    // Timed out waiting — fall through to spawn regardless to avoid
    // infinite wait if the launching promise errored silently.
  }

  _launching[slot] = true;
  try {
    const browser = await _spawnBrowser(slot);
    _browsers[slot] = browser;
    return browser;
  } finally {
    _launching[slot] = false;
  }
}

/**
 * Close a Page returned from `browser.newPage()` after rendering. This
 * releases the page resources without closing the shared browser.
 *
 * @param {import('puppeteer').Page} page
 */
async function releasePage(page) {
  try {
    await page.close();
  } catch {
    // Page may already be closed if the render threw — ignore.
  }
}

module.exports = { getBrowser, releasePage };
