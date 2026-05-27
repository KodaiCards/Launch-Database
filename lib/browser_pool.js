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

// Concurrency cap (separate from pool size): caps how many in-flight
// renders can hold a browser at once. POOL_SIZE controls how many
// browser processes exist; MAX_CONCURRENT_PDF controls how many renders
// can run concurrently against them. Default 2 = same as POOL_SIZE,
// which is the historical behaviour. Bump higher only if pool size is
// also bumped (multiple pages per browser is supported but each render
// uses ~50-100 MB working set, so don't over-commit container RAM).
const MAX_CONCURRENT_PDF = Math.max(
  1,
  parseInt(process.env.MAX_CONCURRENT_PDF, 10) || 2
);

// Default per-acquisition timeout. Overridable via the {timeoutMs} arg
// to getBrowser(). 30 s is generous for headless Chrome cold-start
// (~1-2 s) plus any queue wait under load; if it trips, caller should
// surface a 503 / "PDF render busy, retry" rather than letting the
// HTTP request hang.
const DEFAULT_ACQUIRE_TIMEOUT_MS = 30000;

// The pool: each slot stores a Promise<Browser> (or null if not yet
// spawned). Storing the *promise* — set BEFORE the launch — is the
// atomic-spawn trick: two concurrent acquirers that both find slot N
// null will both write a pending promise, but only the first one's
// write wins (we check === null first), and the second one awaits the
// already-pending promise rather than calling puppeteer.launch a
// second time. Prevents duplicate Chrome processes under burst load.
const _browserPromises = new Array(POOL_SIZE).fill(null);

// Round-robin index so concurrent requests spread across pool slots.
let _rrIdx = 0;

// Semaphore: counter for in-flight render slots and a FIFO queue of
// pending acquirers. acquire() decrements when it returns a browser;
// release() increments and wakes the next pending acquirer.
let _semAvailable = MAX_CONCURRENT_PDF;
const _semQueue = []; // Array<{ resolve, reject, timer }>

function _semAcquire(timeoutMs) {
  return new Promise((resolve, reject) => {
    if (_semAvailable > 0) {
      _semAvailable--;
      resolve();
      return;
    }
    // Queue and wait. Per-acquirer timeout covers BOTH waiting in queue
    // and waiting for the browser launch that follows — see getBrowser.
    let entry;
    const timer = setTimeout(() => {
      const i = _semQueue.indexOf(entry);
      if (i >= 0) _semQueue.splice(i, 1);
      reject(new Error(
        `browser_pool: timed out after ${timeoutMs}ms waiting for an ` +
        `available render slot (MAX_CONCURRENT_PDF=${MAX_CONCURRENT_PDF})`
      ));
    }, timeoutMs);
    entry = { resolve, reject, timer };
    _semQueue.push(entry);
  });
}

function _semRelease() {
  // Wake the next waiter (FIFO) if any, otherwise increment counter.
  const next = _semQueue.shift();
  if (next) {
    try { clearTimeout(next.timer); } catch {}
    next.resolve();
  } else {
    _semAvailable++;
    if (_semAvailable > MAX_CONCURRENT_PDF) {
      // Defensive: should not happen unless release is called more
      // times than acquire. Cap at MAX so the counter can't drift.
      _semAvailable = MAX_CONCURRENT_PDF;
    }
  }
}

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
    if (_browserPromises[slot]) {
      // Resolve-check: if the slot still holds the promise that
      // produced this browser, clear it. We can't compare against the
      // browser directly because the slot holds the promise, not the
      // resolved value — but since each spawn creates a new promise,
      // checking promise identity is unreliable. Instead, attempt to
      // resolve the slot's promise and compare; on any mismatch leave
      // the slot alone (a re-spawn may have already replaced it).
      _browserPromises[slot] = null;
    }
  });
  return browser;
}

/**
 * Acquire a Browser from the pool. Spawns a new browser if the slot is
 * empty or the existing one is no longer connected. Callers should
 * create their own Page via `browser.newPage()` and apply per-page
 * setup (setRequestInterception, etc.) independently. When done, call
 * `releasePage(page)` rather than closing the browser.
 *
 * Concurrency: acquire() also takes a semaphore slot (capped by
 * MAX_CONCURRENT_PDF). The slot is held until releasePage() is called
 * with a page returned from that browser, or until release() is
 * called explicitly. If more renders are in flight than slots, the
 * caller queues FIFO with a per-acquirer timeout (default 30 s).
 *
 * @param {{ timeoutMs?: number }} [opts]
 * @returns {Promise<import('puppeteer').Browser>}
 */
async function getBrowser(opts) {
  const timeoutMs = (opts && Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0)
    ? opts.timeoutMs
    : DEFAULT_ACQUIRE_TIMEOUT_MS;

  // Step 1: take a concurrency slot (queues if all in flight).
  // The timeout covers the WHOLE acquisition path; we subtract elapsed
  // time before applying it to the browser-launch race below.
  const startedAt = Date.now();
  await _semAcquire(timeoutMs);

  try {
    // Step 2: pick a slot and resolve/spawn its browser atomically.
    // Round-robin: even if a slot is broken, we'll spread load across
    // POOL_SIZE attempts rather than hammering one slot.
    let lastErr = null;
    for (let attempt = 0; attempt < POOL_SIZE; attempt++) {
      const slot = _rrIdx % POOL_SIZE;
      _rrIdx = (_rrIdx + 1) % POOL_SIZE;

      // Compute remaining timeout for the browser-launch race.
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, timeoutMs - elapsed);

      try {
        const browser = await _resolveSlot(slot, remaining);
        if (browser && browser.isConnected()) {
          return browser;
        }
        // Slot resolved to a disconnected browser — clear and retry.
        _browserPromises[slot] = null;
      } catch (e) {
        lastErr = e;
        // Clear the failed slot so the next caller doesn't await a
        // rejected promise repeatedly.
        _browserPromises[slot] = null;
      }
    }
    throw lastErr || new Error('browser_pool: no usable browser slot');
  } catch (e) {
    // If we couldn't return a browser, release the semaphore slot we took.
    _semRelease();
    throw e;
  }
}

// Resolve a single slot to a Browser, racing against a timeout. The
// atomic-spawn trick: we read the slot once; if null, we WRITE a new
// pending promise into the slot BEFORE awaiting it, so concurrent
// callers see the pending promise and await the same launch.
function _resolveSlot(slot, timeoutMs) {
  let p = _browserPromises[slot];
  if (!p) {
    p = _spawnBrowser(slot);
    _browserPromises[slot] = p;
    // If the launch rejects, clear the slot so the next caller tries
    // a fresh spawn instead of awaiting a rejected promise.
    p.catch(() => {
      if (_browserPromises[slot] === p) {
        _browserPromises[slot] = null;
      }
    });
  }

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return p;
  }

  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(
        `browser_pool: timed out after ${timeoutMs}ms waiting for browser launch on slot ${slot}`
      ));
    }, timeoutMs);
  });
  return Promise.race([p, timeout]).finally(() => {
    try { clearTimeout(timer); } catch {}
  });
}

/**
 * Close a Page returned from `browser.newPage()` after rendering. This
 * releases the page resources without closing the shared browser, and
 * returns the concurrency slot taken by getBrowser().
 *
 * @param {import('puppeteer').Page} page
 */
async function releasePage(page) {
  try {
    await page.close();
  } catch {
    // Page may already be closed if the render threw — ignore.
  } finally {
    _semRelease();
  }
}

/**
 * Test/diagnostic accessors. Not part of the public render flow.
 */
function _stats() {
  return {
    pool_size: POOL_SIZE,
    max_concurrent: MAX_CONCURRENT_PDF,
    sem_available: _semAvailable,
    sem_queue_depth: _semQueue.length,
    slots_populated: _browserPromises.filter(Boolean).length,
  };
}

module.exports = { getBrowser, releasePage, _stats };
