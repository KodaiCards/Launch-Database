// routes/_hours_match.js — PURE matching core for the keystone hours importer.
//
// Re-points the legacy CSV-hours importer (which matched rows to the retiring
// `projects` rollup tree) onto the keystone model: a timecard row resolves to a
// single `service_area_job` so its hours land in `time_entries.service_area_job_id`.
//
// This file is intentionally DEPENDENCY-FREE (no pg, no xlsx, no multer) so the
// matching decision — the part with the subtle bugs — is unit-testable with
// plain `node --test` and zero DB. The Express/SQL layer (routes/hours_import.js)
// builds the lookup maps from the DB and feeds them in here.
//
// A row matches when: the employee is a known staff member, its WO# resolves to
// exactly one service area, and its discipline resolves to exactly one job in
// that area (staff assignment breaks ties). Anything else → 'review' with a
// human-readable reason, for the review queue / inline resolve.

// ─── Pure normalizers (mirror routes/hours_csv.js _helpers; kept local so this
//     module pulls in nothing heavy. If the canonical versions change, change
//     these too — they exist in exactly two places on purpose). ───────────────

function normalizeWO(s) {
  if (s === null || s === undefined) return '';
  const stripped = String(s).trim().toUpperCase()
    .replace(/^WO[\s\-_#:]*/i, '')
    .replace(/[\s\-_]+/g, '');
  return stripped.replace(/^0+(\d)/, '$1');
}

function normalizeName(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
}

// Classify the CSV "customer" label into a billing bucket (mirror hours_csv).
function classifyUnbilled(rawCustomer) {
  if (rawCustomer === null || rawCustomer === undefined) return { unbilled: false, category: null };
  const s = String(rawCustomer).trim();
  if (!s) return { unbilled: false, category: null };
  const lc = s.toLowerCase();
  if (lc === 'miscellaneous' || lc === 'misc') return { unbilled: true, category: 'misc' };
  if (lc === 'permitting') return { unbilled: true, category: 'permitting' };
  if (/^wo\s*[#-]?\s*\d+$/i.test(s)) return { unbilled: true, category: 'wo_only' };
  return { unbilled: false, category: null };
}

// ─── Discipline → keystone team ─────────────────────────────────────────────
// Keystone teams: permitting | design | inspection | construction.
// Timecard job titles (from hours_csv.inferJobTitle / a title column) are mapped
// here. Defaults are sensible but OVERRIDABLE in the import preview UI — surveyor
// rolls into design, RE/inspector into inspection, splicer/foreman into
// construction. Returns null when the discipline can't be inferred (→ review).
const TEAM_RULES = [
  { re: /resident\s*engineer|^re\b|\bre\s+timecard/, team: 'inspection' },
  { re: /inspect/,                                   team: 'inspection' },
  { re: /permit/,                                    team: 'permitting' },
  { re: /design/,                                    team: 'design' },
  { re: /survey/,                                    team: 'design' },
  { re: /splic|foreman|construction|crew/,           team: 'construction' },
];
const VALID_TEAMS = new Set(['permitting', 'design', 'inspection', 'construction']);

function teamFor(jobTitle) {
  if (jobTitle === null || jobTitle === undefined) return null;
  const s = String(jobTitle).trim().toLowerCase();
  if (!s) return null;
  if (VALID_TEAMS.has(s)) return s;            // already a team value
  for (const rule of TEAM_RULES) if (rule.re.test(s)) return rule.team;
  return null;
}

// ─── The match decision ─────────────────────────────────────────────────────
// row = { employee, wo, jobTitle, customer }  (date/hours handled by the caller)
// ctx = {
//   areasByWO:   Map<normWO, Array<{id,name,client_id,program}>>,
//   jobsByArea:  Map<area_id, Array<{id, team, job_name, assigned_staff_id}>>,
//   staffByName: Map<normName, {id,name}>,
// }
// Returns { status:'matched'|'review', reason, service_area_id,
//           service_area_job_id, staff_id, team, is_billable, unbilled_category }.
function matchRow(row, ctx) {
  const team = teamFor(row.jobTitle);
  const staff = ctx.staffByName.get(normalizeName(row.employee)) || null;
  const staff_id = staff ? staff.id : null;
  const { unbilled, category } = classifyUnbilled(row.customer);

  const base = {
    status: 'review',
    reason: null,
    service_area_id: null,
    service_area_job_id: null,
    staff_id,
    team,
    is_billable: !unbilled,
    unbilled_category: category,
  };
  const review = (reason, extra) => Object.assign({}, base, { status: 'review', reason }, extra || {});
  const matched = (area, job) => Object.assign({}, base, {
    status: 'matched', reason: null, service_area_id: area.id, service_area_job_id: job.id,
  });

  if (!staff_id) return review(`Unknown employee "${row.employee}"`);

  const woNorm = normalizeWO(row.wo);
  if (!woNorm) return review('No work order number on row');

  const areas = ctx.areasByWO.get(woNorm) || [];
  if (areas.length === 0) return review(`No service area matches WO# ${row.wo}`);
  if (areas.length > 1) return review(`WO# ${row.wo} matches ${areas.length} service areas`);
  const area = areas[0];

  const jobs = ctx.jobsByArea.get(area.id) || [];

  // 1) Specific job by catalog name — distinguishes roles that SHARE a discipline
  // but bill at different rates (e.g. Inspector $90 vs Resident Engineer $100,
  // both team='inspection'). Exact normalized name, then a substring fallback.
  const jobHint = normalizeName(row.jobTitle);
  if (jobHint) {
    let named = jobs.filter((j) => normalizeName(j.job_name) === jobHint);
    if (named.length !== 1) {
      const sub = jobs.filter((j) => {
        const n = normalizeName(j.job_name);
        return n && (n.includes(jobHint) || jobHint.includes(n));
      });
      if (sub.length === 1) named = sub;
    }
    if (named.length === 1) return matched(area, named[0]);
  }

  // 2) Fall back to discipline (team) when the role name didn't pin exactly one job.
  if (!team) return review(`Could not determine discipline from "${row.jobTitle}"`, { service_area_id: area.id });
  let teamJobs = jobs.filter((j) => j.team === team);
  if (teamJobs.length === 0) return review(`No ${team} job in service area "${area.name}"`, { service_area_id: area.id });
  if (teamJobs.length > 1) {
    const assigned = teamJobs.filter((j) => j.assigned_staff_id === staff_id);
    if (assigned.length === 1) return matched(area, assigned[0]);
    if (assigned.length > 1) teamJobs = assigned;
  }
  if (teamJobs.length === 1) return matched(area, teamJobs[0]);
  return review(`${team} is ambiguous (${teamJobs.length} jobs) in "${area.name}" — set the timecard's job title to the exact role`, { service_area_id: area.id });
}

module.exports = { matchRow, teamFor, normalizeWO, normalizeName, classifyUnbilled };
