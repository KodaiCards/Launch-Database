// tests/project_photos_access.test.js
// Unit tests for the project-photo access predicate in routes/project_photos.js —
// userHasProjectAccess(userId, userRole, projectId).
//
// Source: routes/project_photos.js (the MED-1 / #84 access gate used by the list,
// download, and upload endpoints).
//
// Bug (issue #84): the predicate's `job_assignments` and `ec_job_visibility`
// EXISTS sub-selects never referenced the calling user — those tables carry NO
// per-user column (job_assignments 0032 = job_id/client_id/engineering_contract_id/
// team; ec_job_visibility 0037 = engineering_contract_id/job_id/created_by_user_id),
// so they returned true whenever ANY assignment/visibility row existed for the
// project's client/EC. Net: any non-manager employee could list/download photos
// for any project under any active client/EC.
//
// Fix (Partner ruling on #84, Carter-locked 2026-07-20 — "photos follow
// projects.view_all, no separate key"): the two unscoped branches are REMOVED
// (they cannot be user-scoped — no column). Broad cross-project photo visibility
// now flows through the System F `projects.view_all` grant. Everyone without it
// is scoped to internal (client-less) projects + projects they uploaded to.
//
// Access model (mirrors userHasProjectAccess branch order):
//   admin / design_manager / permitting_manager  -> allow (role bypass)
//   customer                                      -> deny
//   holds projects.view_all                       -> allow
//   else                                          -> (project.client_id IS NULL)
//                                                    OR (caller uploaded a photo)
//
// No DB / no node_modules required. Runs with: node --test tests/project_photos_access.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const BYPASS_ROLES = new Set(['admin', 'design_manager', 'permitting_manager']);

/**
 * Inline replica of routes/project_photos.js userHasProjectAccess, expressed over
 * the resolved facts (permission lookup + the scoped SQL conditions) so the
 * decision logic is testable without a DB.
 *
 * @param {Object} p
 * @param {string} p.role               caller's role
 * @param {boolean} p.hasViewAll        caller holds projects.view_all (via getEffective)
 * @param {boolean} p.projectClientIsNull  project.client_id IS NULL (internal project)
 * @param {boolean} p.callerUploaded    caller has uploaded a photo to the project
 * @returns {boolean}
 */
function decideAccess({ role, hasViewAll, projectClientIsNull, callerUploaded }) {
  if (BYPASS_ROLES.has(role)) return true;      // admin / managers bypass
  if (role === 'customer') return false;        // customers always denied
  if (hasViewAll) return true;                  // projects.view_all holder
  return !!projectClientIsNull || !!callerUploaded; // scoped fallback
}

// --- Role bypass / denial ---

describe('project-photo access — role bypass & denial', () => {
  for (const role of ['admin', 'design_manager', 'permitting_manager']) {
    it(`${role} is allowed even on a client project with no upload / no view_all`, () => {
      assert.equal(
        decideAccess({ role, hasViewAll: false, projectClientIsNull: false, callerUploaded: false }),
        true
      );
    });
  }

  it('customer is denied even if a view_all grant somehow resolved', () => {
    // customer denial precedes the view_all check — a customer must never read photos.
    assert.equal(
      decideAccess({ role: 'customer', hasViewAll: true, projectClientIsNull: true, callerUploaded: true }),
      false
    );
  });
});

// --- The #84 fix: the leak is closed for non-managers without view_all ---

describe('project-photo access — #84 leak closed', () => {
  it('a non-assigned, non-view_all engineer is DENIED on a client project (the fix)', () => {
    assert.equal(
      decideAccess({ role: 'design_engineer', hasViewAll: false, projectClientIsNull: false, callerUploaded: false }),
      false
    );
  });

  it('a contractor (1099) without view_all is DENIED on a client project — the security win', () => {
    assert.equal(
      decideAccess({ role: 'contractor', hasViewAll: false, projectClientIsNull: false, callerUploaded: false }),
      false
    );
  });

  it('a permitting_engineer without view_all is DENIED on a client project', () => {
    assert.equal(
      decideAccess({ role: 'permitting_engineer', hasViewAll: false, projectClientIsNull: false, callerUploaded: false }),
      false
    );
  });
});

// --- The widening: projects.view_all holders see project photos ---

describe('project-photo access — projects.view_all widening', () => {
  it('a design_engineer WITH projects.view_all is allowed on a client project', () => {
    assert.equal(
      decideAccess({ role: 'design_engineer', hasViewAll: true, projectClientIsNull: false, callerUploaded: false }),
      true
    );
  });

  it('a contractor WITH projects.view_all is allowed (grant is authoritative, not role)', () => {
    assert.equal(
      decideAccess({ role: 'contractor', hasViewAll: true, projectClientIsNull: false, callerUploaded: false }),
      true
    );
  });
});

// --- The scoped fallback: internal projects + own uploads ---

describe('project-photo access — scoped fallback', () => {
  it('any employee is allowed on an internal (client-less) project', () => {
    assert.equal(
      decideAccess({ role: 'contractor', hasViewAll: false, projectClientIsNull: true, callerUploaded: false }),
      true
    );
  });

  it('a user who uploaded a photo is allowed on that project (owns photos)', () => {
    assert.equal(
      decideAccess({ role: 'design_engineer', hasViewAll: false, projectClientIsNull: false, callerUploaded: true }),
      true
    );
  });

  it('no view_all, client project, no upload → denied', () => {
    assert.equal(
      decideAccess({ role: 'design_engineer', hasViewAll: false, projectClientIsNull: false, callerUploaded: false }),
      false
    );
  });
});

// --- Static regression guard on the real route file ---

describe('routes/project_photos.js access predicate — static guard', () => {
  const src = readFileSync(new URL('../routes/project_photos.js', import.meta.url), 'utf8');

  it('resolves the System F grant via getEffective (projects.view_all)', () => {
    assert.match(src, /getEffective\(/,  'access gate must consult the #73 resolver');
    assert.match(src, /projects\.view_all/, 'access gate must check the projects.view_all key');
  });

  it('the unscoped job_assignments / ec_job_visibility leak branches are REMOVED (structural, not literal)', () => {
    // #84: neither table has a per-user column, so ANY query reference to them in
    // this file can only be the unscoped leak — there is no legitimate post-fix
    // use. Scan CODE ONLY (the explanatory comment block legitimately names both
    // tables), so the guard catches JOIN / CTE / aliased / reformatted re-adds,
    // not just the literal `FROM <table>` token the first version checked.
    const codeOnly = src
      .replace(/\/\/[^\n]*/g, '')   // strip JS line comments
      .replace(/--[^\n]*/g, '');    // strip SQL line comments inside template strings
    assert.doesNotMatch(
      codeOnly,
      /\bjob_assignments\b/,
      'job_assignments referenced in CODE — the #84 leak (no per-user column; no legitimate use in this file)'
    );
    assert.doesNotMatch(
      codeOnly,
      /\bec_job_visibility\b/,
      'ec_job_visibility referenced in CODE — the #84 leak (no per-user column; no legitimate use in this file)'
    );
  });

  it('the scoped fallback still allows client-less projects and own uploads', () => {
    assert.match(src, /p\.client_id IS NULL/);
    assert.match(src, /pp2\.uploaded_by = \$2/);
  });
});
