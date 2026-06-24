// _map_estimate.js — shared map→$ rollup, used by routes/map_integration.js and
// routes/projections.js so there's one source of truth for "price a map plan".
//
// Reads the map's stored plan (frm_pts_<plan> structures, frm_segs_<plan> spans)
// from map_store, counts structures by ptype, prices them against a construction
// contract's catalog, and buckets span footage by DESIGNATION (a span may carry
// several — engineering / construction / permitting — dual designation allowed;
// untagged footage falls under 'unassigned'). Returns construction expected +
// completed + footage-by-designation.

const CENT = (n) => Math.round(Number(n || 0) * 100) / 100;
const norm = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/[\s_-]+/g, '');
const DESIGNATIONS = ['engineering', 'construction', 'permitting'];
const BUILT = new Set(['asbuilt', 'active', 'existing']); // map statuses that mean "in the ground"

function designationsOf(el) {
  // Accept an array (designation/designations) or a single string; default none.
  let d = el && (el.designation ?? el.designations);
  if (typeof d === 'string') d = d.split(/[,\s]+/);
  if (!Array.isArray(d)) d = [];
  const out = d.map(norm).filter((x) => DESIGNATIONS.includes(x));
  return out.length ? Array.from(new Set(out)) : [];
}

async function computeEstimate(pool, plan, ccId) {
  const [ptsR, segR, catR] = await Promise.all([
    pool.query('SELECT value FROM map_store WHERE store_key = $1', ['frm_pts_' + plan]),
    pool.query('SELECT value FROM map_store WHERE store_key = $1', ['frm_segs_' + plan]),
    ccId ? pool.query('SELECT item_key, label, unit, unit_price FROM cost_catalog WHERE construction_contract_id = $1', [ccId])
         : Promise.resolve({ rows: [] }),
  ]);
  const cat = {}; for (const c of catR.rows) cat[norm(c.item_key)] = c;
  const pts = ptsR.rows.length ? JSON.parse(ptsR.rows[0].value || '{}') : {};
  const segs = segR.rows.length ? JSON.parse(segR.rows[0].value || '{}') : {};

  // Structures → construction units, priced via catalog.
  const counts = {};
  for (const p of Object.values(pts)) {
    const k = norm(p.ptype);
    if (!counts[k]) counts[k] = { count: 0, completed: 0 };
    counts[k].count++;
    if (BUILT.has(norm(p.status))) counts[k].completed++;
  }
  const items = Object.entries(counts).map(([k, v]) => {
    const c = cat[k];
    return {
      item_key: k, label: c ? c.label : k, unit: c ? c.unit : null,
      count: v.count, completed: v.completed,
      unit_price: c ? CENT(c.unit_price) : null,
      expected: c ? CENT(v.count * c.unit_price) : null,
      completed_value: c ? CENT(v.completed * c.unit_price) : null,
      priced: !!c,
    };
  }).sort((a, b) => (b.expected || 0) - (a.expected || 0));

  // Spans → footage, total + bucketed by designation (dual-counted on purpose:
  // a span tagged engineering+permitting contributes its footage to both).
  let footage = 0;
  const byDesignation = { engineering: 0, construction: 0, permitting: 0, unassigned: 0 };
  for (const s of Object.values(segs)) {
    const ft = Number(s.lengthFt || 0); footage += ft;
    const ds = designationsOf(s);
    if (!ds.length) byDesignation.unassigned += ft;
    else for (const d of ds) byDesignation[d] += ft;
  }
  for (const k of Object.keys(byDesignation)) byDesignation[k] = CENT(byDesignation[k]);

  const expected_total = CENT(items.reduce((s, i) => s + (i.expected || 0), 0));
  const completed_total = CENT(items.reduce((s, i) => s + (i.completed_value || 0), 0));
  return {
    plan, construction_contract_id: ccId || null,
    structures: items,
    unpriced: items.filter((i) => !i.priced).map((i) => i.item_key),
    footage_total: CENT(footage),
    footage_by_designation: byDesignation,
    construction_expected: expected_total,
    construction_completed: completed_total,
    construction_remaining: CENT(expected_total - completed_total),
  };
}

module.exports = { computeEstimate, designationsOf, DESIGNATIONS, CENT, norm };
