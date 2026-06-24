// tests/progress_math.test.js
// Unit tests for the "jobs done / total" progress math used on the customer
// portal area cards and the dashboard.
//
// Source: routes/customer_portal.js — GET /api/customer/service-areas
//   Exact logic (lines 249-254 of the file):
//     const counted = jobs.filter(j => j.status !== 'cancelled');
//     const jobsTotal = counted.length;
//     const jobsDone  = counted.filter(j => SA_DONE_STATUSES.has(j.status)).length;
//     const completionPct = jobsTotal > 0
//       ? Math.round((jobsDone / jobsTotal) * 100)
//       : null;
//
// SA_DONE_STATUSES = new Set(['complete', 'billed'])
//
// Rules verified here:
//   - 'complete' and 'billed' count as done.
//   - 'cancelled' jobs are excluded from the denominator AND from done count.
//   - All other statuses ('potential', 'started', 'submitted', 'approved',
//     'issued', 'client_approved', 'revision') are not done.
//   - Divide-by-zero (no non-cancelled jobs) → null, not 0.
//   - Result is rounded to the nearest integer percent.
//
// No DB / no node_modules required. Runs with: node --test tests/progress_math.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of the logic from routes/customer_portal.js ---

const SA_DONE_STATUSES = new Set(['complete', 'billed']);

/**
 * Replicate the per-service-area progress calculation.
 * @param {Array<{status: string}>} jobs  raw job rows (may include cancelled)
 * @returns {{ jobs_total: number, jobs_done: number, completion_pct: number|null }}
 */
function calcProgress(jobs) {
  const counted = jobs.filter(j => j.status !== 'cancelled');
  const jobsTotal = counted.length;
  const jobsDone = counted.filter(j => SA_DONE_STATUSES.has(j.status)).length;
  const completionPct = jobsTotal > 0
    ? Math.round((jobsDone / jobsTotal) * 100)
    : null;
  return { jobs_total: jobsTotal, jobs_done: jobsDone, completion_pct: completionPct };
}

// --- Helper: build minimal job stubs ---
function job(status) { return { status }; }

// --- Tests ---

describe('progress math — done statuses', () => {
  it('"complete" status counts as done', () => {
    const r = calcProgress([job('complete')]);
    assert.equal(r.jobs_done, 1);
    assert.equal(r.completion_pct, 100);
  });

  it('"billed" status counts as done', () => {
    const r = calcProgress([job('billed')]);
    assert.equal(r.jobs_done, 1);
    assert.equal(r.completion_pct, 100);
  });

  it('"potential" status does not count as done', () => {
    const r = calcProgress([job('potential')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"started" status does not count as done', () => {
    const r = calcProgress([job('started')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"submitted" status does not count as done', () => {
    const r = calcProgress([job('submitted')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"approved" status does not count as done', () => {
    const r = calcProgress([job('approved')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"issued" status does not count as done', () => {
    const r = calcProgress([job('issued')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"client_approved" status does not count as done', () => {
    const r = calcProgress([job('client_approved')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });

  it('"revision" status does not count as done', () => {
    const r = calcProgress([job('revision')]);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, 0);
  });
});

describe('progress math — cancelled exclusion', () => {
  it('cancelled jobs are excluded from the denominator', () => {
    const r = calcProgress([job('cancelled'), job('cancelled')]);
    // denominator is 0 → null
    assert.equal(r.jobs_total, 0);
    assert.equal(r.completion_pct, null);
  });

  it('cancelled jobs do not count as done even though they are excluded from denom', () => {
    // 1 complete + 1 cancelled: denominator = 1, done = 1, pct = 100
    const r = calcProgress([job('complete'), job('cancelled')]);
    assert.equal(r.jobs_total, 1);
    assert.equal(r.jobs_done, 1);
    assert.equal(r.completion_pct, 100);
  });

  it('mix: some done, some in-progress, some cancelled', () => {
    // 2 complete, 1 started, 1 cancelled → denom=3, done=2, pct=67
    const r = calcProgress([
      job('complete'), job('complete'),
      job('started'), job('cancelled'),
    ]);
    assert.equal(r.jobs_total, 3);
    assert.equal(r.jobs_done, 2);
    assert.equal(r.completion_pct, 67);
  });
});

describe('progress math — divide-by-zero guard', () => {
  it('empty job list → completion_pct is null (not 0 or NaN)', () => {
    const r = calcProgress([]);
    assert.equal(r.jobs_total, 0);
    assert.equal(r.jobs_done, 0);
    assert.equal(r.completion_pct, null);
  });

  it('all-cancelled list → completion_pct is null', () => {
    const r = calcProgress([job('cancelled'), job('cancelled'), job('cancelled')]);
    assert.equal(r.completion_pct, null);
  });
});

describe('progress math — percent rounding', () => {
  it('1 of 3 done → 33%', () => {
    const r = calcProgress([job('billed'), job('started'), job('started')]);
    assert.equal(r.completion_pct, 33);
  });

  it('2 of 3 done → 67%', () => {
    const r = calcProgress([job('complete'), job('billed'), job('potential')]);
    assert.equal(r.completion_pct, 67);
  });

  it('1 of 2 done → 50%', () => {
    const r = calcProgress([job('complete'), job('started')]);
    assert.equal(r.completion_pct, 50);
  });

  it('0 done of 4 → 0%', () => {
    const r = calcProgress([
      job('potential'), job('started'), job('submitted'), job('approved'),
    ]);
    assert.equal(r.completion_pct, 0);
  });

  it('all done → 100%', () => {
    const r = calcProgress([job('complete'), job('billed'), job('complete')]);
    assert.equal(r.completion_pct, 100);
  });
});
