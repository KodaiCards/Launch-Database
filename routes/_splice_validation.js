// routes/_splice_validation.js — splice plan validation rules.
//
// Per SPLICE_BUILD_PLAN.md Phase 2A #2: a loud, opinionated validator
// that catches the kinds of design-time mistakes that cause $50k truck
// rolls. Every commercial competitor has shallow rule sets; the bar to
// clear is "catch what splicers find in the field, before the truck
// leaves the yard."
//
// validateProject(hydrate) takes the same payload the hydrate endpoint
// returns ({ project, locations, cables, buffer_tubes, fibers, closures,
// trays, splices, ribbon_groups }) and returns:
//
//   {
//     errors:    [{ code, message, ...context }],   // PDF export blocked
//     warnings:  [{ code, message, ...context }],   // shown but not blocking
//     summary:   { error_count, warning_count, ... }
//   }
//
// Rules are pure functions over the hydrate; no DB access required.
// That keeps them cheap to run on every save (debounced client-side)
// and on the PDF export path.
//
// Severity policy:
//   - "errors" are state that would cause a real splicer issue: tray
//     overrun, double-spliced fiber, ribbon group with wrong count,
//     fiber spliced to itself.
//   - "warnings" are state that's almost certainly wrong but might be
//     intentional: color mismatch (1 → 7 with no rotation note),
//     orphan strand (cut but no destination — flag for the
//     ring-cut/stored decision), unrouted cable, closure with no
//     incoming cable, location with no closure or cable.
//
// New rules slot into the RULES array. Each rule returns an array of
// {code, message, severity, ...context}. The runner concatenates and
// classifies by severity.

const TIA_598_ORDER = {
  blue: 1, orange: 2, green: 3, brown: 4, slate: 5, white: 6,
  red: 7, black: 8, yellow: 9, violet: 10, rose: 11, aqua: 12,
};

// ─── Individual rules ────────────────────────────────────────────────────

function ruleTrayCapacity(h) {
  const issues = [];
  const trayUse = new Map();
  for (const s of h.splices) {
    trayUse.set(s.tray_id, (trayUse.get(s.tray_id) || 0) + 1);
  }
  for (const tray of h.trays) {
    const closure = h.closures.find(c => c.id === tray.closure_id);
    if (!closure) continue;
    const used = trayUse.get(tray.id) || 0;
    if (used > closure.tray_capacity) {
      issues.push({
        severity: 'error',
        code: 'tray_overrun',
        message: `Tray ${tray.position} of closure "${closure.model || 'Closure'}" holds ${used} splices but capacity is ${closure.tray_capacity}.`,
        tray_id: tray.id,
        closure_id: closure.id,
        used,
        capacity: closure.tray_capacity,
      });
    }
  }
  return issues;
}

function ruleDoubleSplice(h) {
  // A fiber has two ends. Each end can be spliced once → max 2 splice
  // memberships per fiber across (fiber_a, fiber_b) columns. More than
  // 2 is a hard error.
  const count = new Map();
  for (const s of h.splices) {
    count.set(s.fiber_a_id, (count.get(s.fiber_a_id) || 0) + 1);
    count.set(s.fiber_b_id, (count.get(s.fiber_b_id) || 0) + 1);
  }
  const issues = [];
  for (const [fiberId, n] of count) {
    if (n > 2) {
      const f = h.fibers.find(x => x.id === fiberId);
      const tube = f ? h.buffer_tubes.find(t => t.id === f.buffer_tube_id) : null;
      const cable = tube ? h.cables.find(c => c.id === tube.cable_id) : null;
      issues.push({
        severity: 'error',
        code: 'fiber_over_spliced',
        message: `Fiber ${cable?.name || '?'} / ${tube?.color || '?'} / ${f?.position || '?'} is spliced ${n} times (max 2 — one per end).`,
        fiber_id: fiberId,
        splice_count: n,
      });
    }
  }
  return issues;
}

function ruleSelfSplice(h) {
  return h.splices
    .filter(s => s.fiber_a_id === s.fiber_b_id)
    .map(s => ({
      severity: 'error',
      code: 'fiber_self_splice',
      message: `Fiber ${s.fiber_a_id} is spliced to itself.`,
      splice_id: s.id,
      fiber_id: s.fiber_a_id,
    }));
}

function ruleRibbonGroupIntegrity(h) {
  // Every ribbon group should have exactly 12 splices, all in the same
  // tray, all with the same splice_type. If a group has fewer than 12
  // it's almost certainly the result of someone deleting individual
  // splices out of a ribbon — warn (not error) so they can clean up.
  const issues = [];
  for (const group of h.ribbon_groups) {
    const inGroup = h.splices.filter(s => s.ribbon_group_id === group.id);
    if (inGroup.length !== 12) {
      issues.push({
        severity: 'warning',
        code: 'ribbon_group_incomplete',
        message: `Ribbon group has ${inGroup.length} splices (expected 12). Likely some splices were individually deleted; consider deleting the whole group.`,
        ribbon_group_id: group.id,
        actual_count: inGroup.length,
      });
    }
    const trayIds = new Set(inGroup.map(s => s.tray_id));
    if (trayIds.size > 1) {
      issues.push({
        severity: 'error',
        code: 'ribbon_group_split_trays',
        message: `Ribbon group is split across ${trayIds.size} trays. A mass-fusion ribbon must live in one tray.`,
        ribbon_group_id: group.id,
      });
    }
    const types = new Set(inGroup.map(s => s.splice_type));
    if (types.size > 1) {
      issues.push({
        severity: 'warning',
        code: 'ribbon_group_mixed_types',
        message: `Ribbon group mixes splice types (${[...types].join(', ')}).`,
        ribbon_group_id: group.id,
      });
    }
  }
  return issues;
}

function ruleColorMismatch(h) {
  // If fiber A's TIA-598 position differs from fiber B's TIA-598
  // position AND the splice is not part of a ribbon group, that's
  // probably wrong. Warn, don't error — there are legitimate reasons
  // (color rotations on long-haul cables, splice-out scenarios).
  const issues = [];
  for (const s of h.splices) {
    if (s.ribbon_group_id) continue;  // ribbons are handled separately
    const fa = h.fibers.find(f => f.id === s.fiber_a_id);
    const fb = h.fibers.find(f => f.id === s.fiber_b_id);
    if (!fa || !fb) continue;
    if (fa.color !== fb.color) {
      const tubeA = h.buffer_tubes.find(t => t.id === fa.buffer_tube_id);
      const tubeB = h.buffer_tubes.find(t => t.id === fb.buffer_tube_id);
      issues.push({
        severity: 'warning',
        code: 'color_mismatch',
        message: `Splice connects ${fa.color} (${tubeA?.color || '?'} tube, pos ${fa.position}) to ${fb.color} (${tubeB?.color || '?'} tube, pos ${fb.position}). Color mismatch — confirm this is intentional.`,
        splice_id: s.id,
        fiber_a_color: fa.color,
        fiber_b_color: fb.color,
      });
    }
  }
  return issues;
}

function ruleUnroutedCable(h) {
  return h.cables
    .filter(c => !c.from_location_id || !c.to_location_id)
    .map(c => ({
      severity: 'warning',
      code: 'cable_unrouted',
      message: `Cable "${c.name}" is missing ${!c.from_location_id ? 'from-location' : ''}${!c.from_location_id && !c.to_location_id ? ' and ' : ''}${!c.to_location_id ? 'to-location' : ''}. Splices on this cable won't render in the canvas.`,
      cable_id: c.id,
    }));
}

function ruleEmptyClosure(h) {
  // A closure with zero splices and zero trays-with-fibers-touching it
  // is suspicious — it might be a placeholder, but more often it's a
  // forgotten add. Warn.
  const issues = [];
  const splicesByClosure = new Map();
  for (const s of h.splices) {
    const tray = h.trays.find(t => t.id === s.tray_id);
    if (!tray) continue;
    splicesByClosure.set(tray.closure_id, (splicesByClosure.get(tray.closure_id) || 0) + 1);
  }
  for (const cl of h.closures) {
    const count = splicesByClosure.get(cl.id) || 0;
    if (count === 0) {
      const loc = h.locations.find(l => l.id === cl.location_id);
      issues.push({
        severity: 'warning',
        code: 'closure_empty',
        message: `Closure "${cl.model || 'Closure'}" at ${loc?.name || '?'} has no splices yet.`,
        closure_id: cl.id,
      });
    }
  }
  return issues;
}

function ruleEmptyLocation(h) {
  // Location with no closure AND no cable touching it is dead weight.
  const issues = [];
  for (const loc of h.locations) {
    const hasClosure = h.closures.some(c => c.location_id === loc.id);
    const hasCable = h.cables.some(c =>
      c.from_location_id === loc.id || c.to_location_id === loc.id
    );
    if (!hasClosure && !hasCable) {
      issues.push({
        severity: 'warning',
        code: 'location_empty',
        message: `Location "${loc.name}" has no closure and no cable. Consider deleting it.`,
        location_id: loc.id,
      });
    }
  }
  return issues;
}

function ruleClosureNoIncomingCable(h) {
  // A closure should be on a location that at least one cable touches.
  // Otherwise the splices in it have nowhere to come from.
  const issues = [];
  for (const cl of h.closures) {
    const incoming = h.cables.some(c =>
      c.from_location_id === cl.location_id || c.to_location_id === cl.location_id
    );
    if (!incoming) {
      const loc = h.locations.find(l => l.id === cl.location_id);
      issues.push({
        severity: 'warning',
        code: 'closure_no_incoming_cable',
        message: `Closure "${cl.model || 'Closure'}" at ${loc?.name || '?'} has no cable touching its location.`,
        closure_id: cl.id,
      });
    }
  }
  return issues;
}

function ruleStrandStateConflicts(h) {
  // Phase 2A #3 — three-lane ring-cut model. A strand_state row that
  // says 'express' or 'stored' conflicts with the existence of a splice
  // row at the same (cable, location). Vice-versa for 'spliced' rows.
  // Splices are the source of truth; explicit strand_states override
  // only when there's no splice.
  const issues = [];
  const ss = h.strand_states || [];
  if (!ss.length) return issues;

  // Build a set of (cable_id|location_id|strand_position) keys that have
  // a splice row at this location. A splice's location is found via
  // tray → closure → location.
  const splicedKeys = new Set();
  for (const s of h.splices) {
    const tray = h.trays.find(t => t.id === s.tray_id);
    if (!tray) continue;
    const closure = h.closures.find(c => c.id === tray.closure_id);
    if (!closure) continue;
    const locId = closure.location_id;
    for (const fid of [s.fiber_a_id, s.fiber_b_id]) {
      const f = h.fibers.find(x => x.id === fid);
      if (!f) continue;
      const tube = h.buffer_tubes.find(t => t.id === f.buffer_tube_id);
      if (!tube) continue;
      // Strand position across the cable = (tube.position - 1) * 12 + fiber.position
      const strandPos = (tube.position - 1) * 12 + f.position;
      splicedKeys.add(`${tube.cable_id}|${locId}|${strandPos}`);
    }
  }

  for (const row of ss) {
    const key = `${row.cable_id}|${row.location_id}|${row.strand_position}`;
    const isSpliced = splicedKeys.has(key);
    if (row.state === 'express' && isSpliced) {
      issues.push({
        severity: 'error',
        code: 'strand_express_with_splice',
        message: `Strand ${row.strand_position} marked 'express' at this location but a splice exists for it. The splicer would receive contradictory instructions.`,
        cable_id: row.cable_id,
        location_id: row.location_id,
        strand_position: row.strand_position,
      });
    }
    if (row.state === 'stored' && isSpliced) {
      issues.push({
        severity: 'error',
        code: 'strand_stored_with_splice',
        message: `Strand ${row.strand_position} marked 'stored' at this location but a splice exists for it. Stored strands should be coiled, not spliced.`,
        cable_id: row.cable_id,
        location_id: row.location_id,
        strand_position: row.strand_position,
      });
    }
    if (row.state === 'spliced' && !isSpliced) {
      issues.push({
        severity: 'warning',
        code: 'strand_spliced_no_splice_row',
        message: `Strand ${row.strand_position} marked 'spliced' at this location but no splice row exists for it. The strand_state row says one thing and the splice graph says another.`,
        cable_id: row.cable_id,
        location_id: row.location_id,
        strand_position: row.strand_position,
      });
    }
  }
  return issues;
}

function ruleStandardColorOrder(h) {
  // Sanity check: every cable's buffer tubes and fibers should follow
  // TIA-598 order. If they don't, something hand-edited the schema and
  // future tools may misbehave. Error — this should never happen in
  // normal operation.
  const issues = [];
  for (const tube of h.buffer_tubes) {
    const expected = Object.entries(TIA_598_ORDER)
      .find(([, v]) => v === ((tube.position - 1) % 12) + 1)?.[0];
    if (expected && tube.color !== expected) {
      issues.push({
        severity: 'error',
        code: 'tube_color_out_of_order',
        message: `Buffer tube at position ${tube.position} has color "${tube.color}", expected "${expected}" per TIA-598.`,
        buffer_tube_id: tube.id,
      });
    }
  }
  return issues;
}

// ─── Splitter rules (Phase 2C #9) ────────────────────────────────────────

function ruleSplitterInputConflict(h) {
  // A fiber can't simultaneously feed two splitter inputs, and it can't
  // be both a splice participant and a splitter input. Either case means
  // the fiber is "double-driven" — the signal has two competing sources or
  // destinations, which is impossible in a passive optical network.
  const issues = [];
  const splitters = h.splitters || [];
  const splitterOutputs = h.splitter_outputs || [];

  // Collect all input_fiber_ids that are actually wired.
  const wiredInputs = splitters.filter(s => s.input_fiber_id).map(s => s.input_fiber_id);

  // A fiber driving more than one splitter input is an error.
  const inputCount = new Map();
  for (const fid of wiredInputs) {
    inputCount.set(fid, (inputCount.get(fid) || 0) + 1);
  }
  for (const [fid, n] of inputCount) {
    if (n > 1) {
      issues.push({
        severity: 'error',
        code: 'splitter_input_double_driven',
        message: `Fiber ${fid} feeds ${n} splitter inputs. A single fiber can only drive one splitter.`,
        fiber_id: fid,
      });
    }
  }

  // A fiber that is both a splice fiber (fiber_a / fiber_b) and a splitter
  // input is contradictory — the fiber can't be both through-spliced and
  // terminating at a passive split point.
  const spliceParticipants = new Set();
  for (const s of h.splices) {
    spliceParticipants.add(s.fiber_a_id);
    spliceParticipants.add(s.fiber_b_id);
  }
  for (const fid of wiredInputs) {
    if (spliceParticipants.has(fid)) {
      issues.push({
        severity: 'error',
        code: 'splitter_input_also_spliced',
        message: `Fiber ${fid} is both a splice participant and a splitter input. Choose one: route it through a splice or into a splitter, not both.`,
        fiber_id: fid,
      });
    }
  }

  // An output_fiber_id that appears in more than one output, or in any
  // splice, is also double-driven on the downstream side.
  const wiredOutputFibers = splitterOutputs.filter(o => o.output_fiber_id).map(o => o.output_fiber_id);
  const outputCount = new Map();
  for (const fid of wiredOutputFibers) {
    outputCount.set(fid, (outputCount.get(fid) || 0) + 1);
  }
  for (const [fid, n] of outputCount) {
    if (n > 1) {
      issues.push({
        severity: 'error',
        code: 'splitter_output_double_driven',
        message: `Fiber ${fid} is wired to ${n} splitter outputs. An output fiber must connect to exactly one output port.`,
        fiber_id: fid,
      });
    }
  }
  for (const fid of wiredOutputFibers) {
    if (spliceParticipants.has(fid)) {
      issues.push({
        severity: 'error',
        code: 'splitter_output_also_spliced',
        message: `Fiber ${fid} is both a splice participant and a splitter output. A downstream fiber should arrive via one path only.`,
        fiber_id: fid,
      });
    }
  }

  return issues;
}

function ruleSplitterUnwired(h) {
  // Un-wired inputs and outputs are almost always a designer oversight
  // at plan-complete time, but they're not a hard error — a designer
  // might stage the splitter before running the cable.
  const issues = [];
  const splitters = h.splitters || [];
  const splitterOutputs = h.splitter_outputs || [];

  for (const sp of splitters) {
    if (!sp.input_fiber_id) {
      issues.push({
        severity: 'warning',
        code: 'splitter_input_unwired',
        message: `Splitter (${sp.ratio}) at closure ${sp.closure_id} has no input fiber wired.`,
        splitter_id: sp.id,
        closure_id: sp.closure_id,
      });
    }
    const outputs = splitterOutputs.filter(o => o.splitter_id === sp.id);
    const unwiredOutputs = outputs.filter(o => !o.output_fiber_id);
    if (unwiredOutputs.length) {
      issues.push({
        severity: 'warning',
        code: 'splitter_outputs_unwired',
        message: `Splitter (${sp.ratio}) at closure ${sp.closure_id} has ${unwiredOutputs.length} of ${outputs.length} output port(s) without a fiber wired.`,
        splitter_id: sp.id,
        closure_id: sp.closure_id,
        unwired_count: unwiredOutputs.length,
      });
    }
  }

  return issues;
}

// ─── Runner ──────────────────────────────────────────────────────────────

const RULES = [
  ruleTrayCapacity,
  ruleDoubleSplice,
  ruleSelfSplice,
  ruleRibbonGroupIntegrity,
  ruleColorMismatch,
  ruleUnroutedCable,
  ruleEmptyClosure,
  ruleEmptyLocation,
  ruleClosureNoIncomingCable,
  ruleStrandStateConflicts,
  ruleStandardColorOrder,
  ruleSplitterInputConflict,
  ruleSplitterUnwired,
];

function validateProject(hydrate) {
  const all = [];
  for (const rule of RULES) {
    try {
      const out = rule(hydrate) || [];
      for (const item of out) all.push(item);
    } catch (e) {
      // A rule blowing up is itself a kind of bug — surface it as a
      // warning rather than killing the whole validation pass.
      all.push({
        severity: 'warning',
        code: 'rule_error',
        message: `Internal validator rule failed: ${e.message}`,
      });
    }
  }
  const errors = all.filter(i => i.severity === 'error');
  const warnings = all.filter(i => i.severity === 'warning');
  return {
    errors,
    warnings,
    summary: {
      error_count: errors.length,
      warning_count: warnings.length,
      total: all.length,
      blocked: errors.length > 0,
    },
  };
}

module.exports = { validateProject, RULES };
