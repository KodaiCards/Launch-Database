// tests/contractor_guard.test.js
// Unit tests for the contractor IDOR guard logic and the money-stripping shaper
// used in routes/service_areas.js — POST /api/service-area-jobs/:id/time-entries.
//
// Source: routes/service_areas.js (contractor time-entry handler)
//
// IDOR ownership predicate (paraphrased from the SQL WHERE clause):
//   job.assigned_user_id = caller.id
//   OR (caller.staff_id IS NOT NULL AND job.assigned_staff_id = caller.staff_id)
//
// Money-stripping shaper (verbatim from the route):
//   const job = updated && isContractor
//     ? { id: updated.id, status: updated.status, actual_hours: updated.actual_hours }
//     : updated;
//
// Rules verified here:
//   - A contractor whose user_id matches assigned_user_id → owns the job.
//   - A contractor whose staff_id matches assigned_staff_id → owns the job.
//   - A contractor where neither matches → does not own (403 path).
//   - staff_id null on caller does not falsely match any assigned_staff_id.
//   - The shaper exposes only { id, status, actual_hours } for contractors.
//   - The shaper exposes the full job object for non-contractor staff.
//   - actual_amount is ABSENT from the contractor-shaped response.
//
// No DB / no node_modules required. Runs with: node --test tests/contractor_guard.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// --- Inline replica of the ownership predicate (mirrors the SQL guard) ---

/**
 * Returns true when the caller is allowed to log hours against the job.
 * Matches the SQL WHERE in the contractor branch of service_areas.js:
 *   assigned_user_id = $2 OR ($3::uuid IS NOT NULL AND assigned_staff_id = $3)
 *
 * @param {{ assigned_user_id: string|null, assigned_staff_id: string|null }} job
 * @param {{ id: string, staff_id: string|null }} caller
 * @returns {boolean}
 */
function ownsJob(job, caller) {
  if (job.assigned_user_id === caller.id) return true;
  if (caller.staff_id !== null && caller.staff_id !== undefined &&
      job.assigned_staff_id === caller.staff_id) return true;
  return false;
}

// --- Inline replica of the money-stripping shaper ---

/**
 * Returns the job object the contractor sees (hours + status only) or the full
 * object for non-contractor roles.
 *
 * @param {object} updated   full job object from recomputeJob()
 * @param {boolean} isContractor
 * @returns {object}
 */
function shapeJobResponse(updated, isContractor) {
  return updated && isContractor
    ? { id: updated.id, status: updated.status, actual_hours: updated.actual_hours }
    : updated;
}

// --- IDOR ownership tests ---

describe('contractor IDOR guard — ownership predicate', () => {
  it('matches when assigned_user_id equals caller id', () => {
    const job    = { assigned_user_id: 'user-abc', assigned_staff_id: null };
    const caller = { id: 'user-abc', staff_id: null };
    assert.equal(ownsJob(job, caller), true);
  });

  it('matches when assigned_staff_id equals caller staff_id', () => {
    const job    = { assigned_user_id: 'other-user', assigned_staff_id: 'staff-xyz' };
    const caller = { id: 'user-abc', staff_id: 'staff-xyz' };
    assert.equal(ownsJob(job, caller), true);
  });

  it('matches when both user_id AND staff_id match', () => {
    const job    = { assigned_user_id: 'user-abc', assigned_staff_id: 'staff-xyz' };
    const caller = { id: 'user-abc', staff_id: 'staff-xyz' };
    assert.equal(ownsJob(job, caller), true);
  });

  it('does NOT match when neither user_id nor staff_id matches', () => {
    const job    = { assigned_user_id: 'other-user', assigned_staff_id: 'other-staff' };
    const caller = { id: 'user-abc', staff_id: 'staff-xyz' };
    assert.equal(ownsJob(job, caller), false);
  });

  it('does NOT match when caller staff_id is null even if assigned_staff_id has a value', () => {
    // SQL: $3::uuid IS NOT NULL — null staff_id never matches any assigned_staff_id.
    const job    = { assigned_user_id: 'other-user', assigned_staff_id: 'staff-xyz' };
    const caller = { id: 'user-abc', staff_id: null };
    assert.equal(ownsJob(job, caller), false);
  });

  it('does NOT match when assigned_user_id is null and only user_id branch is tried', () => {
    const job    = { assigned_user_id: null, assigned_staff_id: null };
    const caller = { id: 'user-abc', staff_id: null };
    assert.equal(ownsJob(job, caller), false);
  });

  it('does NOT match when job has no assigned user or staff at all', () => {
    const job    = { assigned_user_id: null, assigned_staff_id: null };
    const caller = { id: 'user-abc', staff_id: 'staff-xyz' };
    // assigned_staff_id is null ≠ 'staff-xyz', so false
    assert.equal(ownsJob(job, caller), false);
  });
});

// --- Money-stripping shaper tests ---

const FULL_JOB = {
  id: 'job-1',
  status: 'started',
  actual_hours: 8.5,
  actual_amount: 765.00,
  rate: 90,
  estimated_amount: 900,
  billing_type: 'hourly',
  team: 'permitting',
};

describe('contractor guard — money-stripping shaper', () => {
  it('contractor response contains only id, status, actual_hours', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.deepEqual(Object.keys(shaped).sort(), ['actual_hours', 'id', 'status'].sort());
  });

  it('contractor response: id is preserved', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(shaped.id, FULL_JOB.id);
  });

  it('contractor response: status is preserved', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(shaped.status, FULL_JOB.status);
  });

  it('contractor response: actual_hours is preserved', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(shaped.actual_hours, FULL_JOB.actual_hours);
  });

  it('contractor response: actual_amount is ABSENT', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(Object.prototype.hasOwnProperty.call(shaped, 'actual_amount'), false);
  });

  it('contractor response: rate is ABSENT', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(Object.prototype.hasOwnProperty.call(shaped, 'rate'), false);
  });

  it('contractor response: estimated_amount is ABSENT', () => {
    const shaped = shapeJobResponse(FULL_JOB, true);
    assert.equal(Object.prototype.hasOwnProperty.call(shaped, 'estimated_amount'), false);
  });

  it('non-contractor (isContractor=false) gets the full job object', () => {
    const shaped = shapeJobResponse(FULL_JOB, false);
    assert.equal(shaped, FULL_JOB);
  });

  it('non-contractor response includes actual_amount', () => {
    const shaped = shapeJobResponse(FULL_JOB, false);
    assert.equal(shaped.actual_amount, FULL_JOB.actual_amount);
  });

  it('shaper handles updated=null gracefully (should not crash)', () => {
    // Source: updated && isContractor — falsy updated short-circuits to null/falsy
    const shaped = shapeJobResponse(null, true);
    assert.equal(shaped, null);
  });

  it('shaper handles updated=undefined gracefully', () => {
    const shaped = shapeJobResponse(undefined, false);
    assert.equal(shaped, undefined);
  });
});
