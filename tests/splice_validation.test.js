// Smoke tests for the splice validation rule engine.
//
// The engine is pure functions over the hydrate payload — no DB, no
// network. Each test builds a minimal hydrate-shaped object and asserts
// the right rule fires (or doesn't). Adding a new rule? Add a test
// here that exercises it in isolation.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateProject } = require('../routes/_splice_validation');

// Minimal hydrate skeleton — extend per-test to exercise specific rules.
function emptyHydrate() {
  return {
    project: { id: 'p1', name: 'p' },
    locations: [], cables: [], buffer_tubes: [], fibers: [],
    closures: [], trays: [], splices: [], ribbon_groups: [],
  };
}

test('empty project produces no errors and only the "empty location" warning is silent', () => {
  const v = validateProject(emptyHydrate());
  assert.equal(v.summary.error_count, 0);
  // No locations / cables / closures means none of the "empty X" rules
  // have anything to flag — they all iterate over their respective
  // arrays which are empty.
  assert.equal(v.summary.warning_count, 0);
  assert.equal(v.summary.blocked, false);
});

test('tray overrun fires as an error', () => {
  const h = emptyHydrate();
  h.locations = [{ id: 'l1', name: 'L', sequence_index: 0, type: 'splice_point' }];
  h.closures = [{ id: 'c1', location_id: 'l1', model: 'M', tray_count: 1, tray_capacity: 2 }];
  h.trays    = [{ id: 't1', closure_id: 'c1', position: 1 }];
  // 3 splices, capacity is 2 → overrun
  h.splices  = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fa1', fiber_b_id: 'fb1', splice_type: 'fusion' },
    { id: 's2', tray_id: 't1', fiber_a_id: 'fa2', fiber_b_id: 'fb2', splice_type: 'fusion' },
    { id: 's3', tray_id: 't1', fiber_a_id: 'fa3', fiber_b_id: 'fb3', splice_type: 'fusion' },
  ];
  const v = validateProject(h);
  const overrun = v.errors.find(e => e.code === 'tray_overrun');
  assert.ok(overrun, 'tray_overrun error should fire');
  assert.equal(overrun.used, 3);
  assert.equal(overrun.capacity, 2);
  assert.equal(v.summary.blocked, true);
});

test('double-spliced fiber fires as error', () => {
  const h = emptyHydrate();
  h.fibers = [
    { id: 'fa', buffer_tube_id: 'tubeA', position: 1, color: 'blue' },
    { id: 'fb', buffer_tube_id: 'tubeB', position: 1, color: 'blue' },
    { id: 'fc', buffer_tube_id: 'tubeC', position: 1, color: 'blue' },
    { id: 'fd', buffer_tube_id: 'tubeD', position: 1, color: 'blue' },
  ];
  // fa is in 3 splice rows — over the 2-end limit.
  h.splices = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fa', fiber_b_id: 'fb', splice_type: 'fusion' },
    { id: 's2', tray_id: 't1', fiber_a_id: 'fa', fiber_b_id: 'fc', splice_type: 'fusion' },
    { id: 's3', tray_id: 't1', fiber_a_id: 'fa', fiber_b_id: 'fd', splice_type: 'fusion' },
  ];
  const v = validateProject(h);
  const over = v.errors.find(e => e.code === 'fiber_over_spliced');
  assert.ok(over);
  assert.equal(over.fiber_id, 'fa');
  assert.equal(over.splice_count, 3);
});

test('fiber spliced to itself fires as error', () => {
  const h = emptyHydrate();
  h.splices = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fself', fiber_b_id: 'fself', splice_type: 'fusion' },
  ];
  const v = validateProject(h);
  assert.ok(v.errors.find(e => e.code === 'fiber_self_splice'));
});

test('color mismatch fires as warning, not error', () => {
  const h = emptyHydrate();
  h.fibers = [
    { id: 'fa', buffer_tube_id: 'tubeA', position: 1, color: 'blue' },
    { id: 'fb', buffer_tube_id: 'tubeB', position: 7, color: 'red' },
  ];
  h.buffer_tubes = [
    { id: 'tubeA', cable_id: 'cA', position: 1, color: 'blue' },
    { id: 'tubeB', cable_id: 'cB', position: 1, color: 'blue' },
  ];
  h.splices = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fa', fiber_b_id: 'fb', splice_type: 'fusion', ribbon_group_id: null },
  ];
  const v = validateProject(h);
  assert.ok(v.warnings.find(w => w.code === 'color_mismatch'));
  assert.equal(v.summary.blocked, false, 'color mismatch alone should not block PDF export');
});

test('ribbon group with non-12 splices fires warning, with mixed trays fires error', () => {
  const h = emptyHydrate();
  h.ribbon_groups = [{ id: 'g1', tray_id: 't1' }, { id: 'g2', tray_id: 't1' }];
  // g1 has only 5 splices.
  for (let i = 0; i < 5; i++) {
    h.splices.push({
      id: 'g1s' + i, tray_id: 't1', fiber_a_id: 'fa' + i, fiber_b_id: 'fb' + i,
      splice_type: 'fusion', ribbon_group_id: 'g1',
    });
  }
  // g2 has 12 splices but two trays.
  for (let i = 0; i < 12; i++) {
    h.splices.push({
      id: 'g2s' + i, tray_id: i < 6 ? 't1' : 't2', fiber_a_id: 'ga' + i, fiber_b_id: 'gb' + i,
      splice_type: 'fusion', ribbon_group_id: 'g2',
    });
  }
  const v = validateProject(h);
  assert.ok(v.warnings.find(w => w.code === 'ribbon_group_incomplete'));
  assert.ok(v.errors.find(e => e.code === 'ribbon_group_split_trays'));
});

test('unrouted cable fires warning', () => {
  const h = emptyHydrate();
  h.cables = [{ id: 'c1', name: 'Bad cable', from_location_id: null, to_location_id: null }];
  const v = validateProject(h);
  assert.ok(v.warnings.find(w => w.code === 'cable_unrouted'));
});

test('TIA-598 order violation fires error (caught DB tampering)', () => {
  const h = emptyHydrate();
  h.buffer_tubes = [
    { id: 't1', cable_id: 'c1', position: 1, color: 'red' },  // expected blue
  ];
  const v = validateProject(h);
  assert.ok(v.errors.find(e => e.code === 'tube_color_out_of_order'));
});

test('strand_state express+splice conflict fires error', () => {
  // Strand 1 of cable cA at location l1 has both a splice row AND a
  // strand_state row marking it 'express'. The splicer would see
  // contradictory instructions — error.
  const h = emptyHydrate();
  h.locations = [{ id: 'l1', name: 'L', sequence_index: 0, type: 'splice_point' }];
  h.cables = [
    { id: 'cA', name: 'A', fiber_count: 12, construction_type: 'ribbon' },
    { id: 'cB', name: 'B', fiber_count: 12, construction_type: 'ribbon' },
  ];
  h.buffer_tubes = [
    { id: 'tA', cable_id: 'cA', position: 1, color: 'blue' },
    { id: 'tB', cable_id: 'cB', position: 1, color: 'blue' },
  ];
  h.fibers = [
    { id: 'fA1', buffer_tube_id: 'tA', position: 1, color: 'blue' },
    { id: 'fB1', buffer_tube_id: 'tB', position: 1, color: 'blue' },
  ];
  h.closures = [{ id: 'c1', location_id: 'l1', model: 'M', tray_count: 1, tray_capacity: 12 }];
  h.trays = [{ id: 't1', closure_id: 'c1', position: 1 }];
  h.splices = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fA1', fiber_b_id: 'fB1', splice_type: 'fusion', ribbon_group_id: null },
  ];
  // Strand 1 (tube 1, fiber 1) → strand_position 1 — but designer marked it 'express'
  h.strand_states = [
    { id: 'ss1', cable_id: 'cA', location_id: 'l1', strand_position: 1, state: 'express' },
  ];
  const v = validateProject(h);
  assert.ok(v.errors.find(e => e.code === 'strand_express_with_splice'));
});

test('strand_state stored without splice is fine, no errors', () => {
  const h = emptyHydrate();
  h.locations = [{ id: 'l1', name: 'L', sequence_index: 0, type: 'splice_point' }];
  h.cables = [{ id: 'cA', name: 'A', fiber_count: 12, construction_type: 'ribbon' }];
  // No splices anywhere; strand_state says strand 5 is stored.
  h.strand_states = [
    { id: 'ss1', cable_id: 'cA', location_id: 'l1', strand_position: 5, state: 'stored', stored_length_inches: 36 },
  ];
  const v = validateProject(h);
  // No conflict between splices (none exist) and the stored strand.
  assert.equal(v.errors.filter(e => e.code.startsWith('strand_')).length, 0);
});

test('clean project blocks nothing', () => {
  // Two real cables, one closure with one tray, one clean splice.
  const h = emptyHydrate();
  h.locations = [{ id: 'l1', name: 'L', sequence_index: 0, type: 'splice_point' }];
  h.cables = [
    { id: 'cA', name: 'CA', fiber_count: 12, construction_type: 'ribbon',
      from_location_id: 'l1', to_location_id: 'l1' },
    { id: 'cB', name: 'CB', fiber_count: 12, construction_type: 'ribbon',
      from_location_id: 'l1', to_location_id: 'l1' },
  ];
  h.buffer_tubes = [
    { id: 'tA', cable_id: 'cA', position: 1, color: 'blue' },
    { id: 'tB', cable_id: 'cB', position: 1, color: 'blue' },
  ];
  h.fibers = [
    { id: 'fA', buffer_tube_id: 'tA', position: 1, color: 'blue' },
    { id: 'fB', buffer_tube_id: 'tB', position: 1, color: 'blue' },
  ];
  h.closures = [{ id: 'c1', location_id: 'l1', model: 'M', tray_count: 1, tray_capacity: 12 }];
  h.trays = [{ id: 't1', closure_id: 'c1', position: 1 }];
  h.splices = [
    { id: 's1', tray_id: 't1', fiber_a_id: 'fA', fiber_b_id: 'fB', splice_type: 'fusion', ribbon_group_id: null },
  ];
  const v = validateProject(h);
  assert.equal(v.summary.error_count, 0);
  assert.equal(v.summary.blocked, false);
});
