// tests/hours_import_match.test.js — pure unit tests for the keystone hours
// importer's matching core (routes/_hours_match.js). No DB, no deps.

const { test } = require('node:test');
const assert = require('node:assert');
const { matchRow, teamFor, normalizeWO } = require('../routes/_hours_match');

// ── ctx builder ──────────────────────────────────────────────────────────────
// Two service areas; area A has one design + one permitting job, area B has two
// design jobs (one assigned to Bob). WO 16299 → area A, WO 200 → area B.
const STAFF = {
  alice: { id: 's-alice', name: 'Alice Smith' },
  bob:   { id: 's-bob',   name: 'Bob Jones' },
};
function ctx() {
  return {
    areasByWO: new Map([
      ['16299', [{ id: 'A', name: 'Area A', client_id: 'c1', program: 'rus' }]],
      ['200',   [{ id: 'B', name: 'Area B', client_id: 'c1', program: 'bau' }]],
      ['999',   [ // duplicate WO# across two areas → ambiguous
        { id: 'X', name: 'Area X', client_id: 'c1', program: 'rus' },
        { id: 'Y', name: 'Area Y', client_id: 'c2', program: 'bau' },
      ]],
    ]),
    jobsByArea: new Map([
      ['A', [
        { id: 'A-design', team: 'design',     assigned_staff_id: null },
        { id: 'A-permit', team: 'permitting', assigned_staff_id: null },
      ]],
      ['B', [
        { id: 'B-design1', team: 'design', assigned_staff_id: 's-bob' },
        { id: 'B-design2', team: 'design', assigned_staff_id: null },
      ]],
    ]),
    staffByName: new Map([
      ['alice smith', STAFF.alice],
      ['bob jones',   STAFF.bob],
    ]),
  };
}

test('teamFor maps timecard titles to keystone teams', () => {
  assert.equal(teamFor('Inspector'), 'inspection');
  assert.equal(teamFor('Resident Engineer'), 'inspection');
  assert.equal(teamFor('Permitting'), 'permitting');
  assert.equal(teamFor('Design'), 'design');
  assert.equal(teamFor('Surveyor'), 'design');
  assert.equal(teamFor('Foreman'), 'construction');
  assert.equal(teamFor('construction'), 'construction'); // passthrough
  assert.equal(teamFor('gibberish'), null);
  assert.equal(teamFor(''), null);
  assert.equal(teamFor(null), null);
});

test('normalizeWO strips prefix/zeros/separators', () => {
  assert.equal(normalizeWO('WO #00016299'), '16299');
  assert.equal(normalizeWO('wo-16299'), '16299');
  assert.equal(normalizeWO('16299'), '16299');
});

test('happy path: known staff + unique WO + single team job → matched', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: 'WO #16299', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'matched');
  assert.equal(r.service_area_id, 'A');
  assert.equal(r.service_area_job_id, 'A-design');
  assert.equal(r.staff_id, 's-alice');
  assert.equal(r.team, 'design');
  assert.equal(r.is_billable, true);
});

test('staff assignment breaks a tie between two same-team jobs', () => {
  const r = matchRow({ employee: 'Bob Jones', wo: '200', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'matched');
  assert.equal(r.service_area_job_id, 'B-design1'); // the one assigned to Bob
});

test('ambiguous team with no staff assignment → review', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '200', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /ambiguous/);
  assert.equal(r.service_area_id, 'B'); // area still resolved, for inline resolve
});

test('unknown employee → review', () => {
  const r = matchRow({ employee: 'Nobody', wo: '16299', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /Unknown employee/);
});

test('no WO# → review', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /work order/i);
});

test('WO# matches no area → review', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '77777', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /No service area/);
});

test('WO# matches multiple areas → review', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '999', jobTitle: 'Design', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /multiple|2 service areas/);
});

test('team has no job in the area → review (area still surfaced)', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '16299', jobTitle: 'Inspector', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /No inspection job/);
  assert.equal(r.service_area_id, 'A');
});

test('undeterminable discipline → review', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '16299', jobTitle: 'Xyz', customer: 'PSC' }, ctx());
  assert.equal(r.status, 'review');
  assert.match(r.reason, /discipline/);
});

test('unbilled customer label flags is_billable=false', () => {
  const r = matchRow({ employee: 'Alice Smith', wo: '16299', jobTitle: 'Design', customer: 'Miscellaneous' }, ctx());
  assert.equal(r.status, 'matched');
  assert.equal(r.is_billable, false);
  assert.equal(r.unbilled_category, 'misc');
});
