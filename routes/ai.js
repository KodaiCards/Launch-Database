// routes/ai.js
//
// Claude tool-using assistant + file upload surface. Extracted from
// server.js as the final piece of CLEANUP_PLAN.md Track 1.3.
//
// Endpoints (admin only):
//   POST /api/ai/upload       multer file upload → uploadStore by id
//   GET  /api/ai/upload/:id   fetch staged upload rows
//   POST /api/ai/chat         Anthropic Messages API tool loop with
//                             approval gate for destructive tools
//
// Scope:
//   - SYSTEM_PROMPT, getDBContext        DB context payload sent to Claude
//   - AI_TOOLS                           tool definitions
//   - executeTool                        switch w/ one case per tool
//   - DESTRUCTIVE_AI_TOOLS               approval-gate set
//   - summarizeToolCall                  human summary for the approval card
//   - _pendingApprovals (Map)            in-process approval staging
//   - uploadStore (Map)                  in-process file upload staging
//
// External dependencies the cases reach into:
//   pool, requireAdmin, upload                — installer args
//   updateProjectHours, calcProjectFinancials,
//     collectProjectTree                      — ./_helpers
//   csvStage, CSV_STAGE_TTL_MS               — ./_csv_stage
//   normalizeName, normalizeWO, detectColumns,
//     parseDateCell                          — ./hours_csv._helpers
//   isDuplicateProject, ensureRollupChain    — ../portal_module
//   anthropic                                — created from ANTHROPIC_API_KEY
//
// Smoke tests in tests/ai_upload.test.js exercise the upload + fetch
// surface; the chat tool loop needs an Anthropic client mock and is
// queued for a follow-up.

const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Detect when the user's last message asks for an action OR confirms one,
// so the chat handler can force tool_choice='any' on the next API call.
// Without this the model can choose to skip emitting a tool_use and
// reply with text only — that's the "AI says it's about to do something
// and never does" bug. Confirmation regex is anchored to start so "yes"
// alone matches but "I yes prefer that" doesn't.
//
// Also catches NUDGES — short follow-ups that imply "stop talking, do
// the thing you said you'd do" ("did you start", "why didn't you", "go",
// "run it"). These are the failure mode where the model proposed a plan,
// the user replied with anything that isn't a hard yes/no, and the model
// then waffled in text instead of firing the tool. Treating nudges as
// implicit approval flips tool_choice to 'any' and forces a tool turn.
function userWantsAction(messages) {
  if (!messages || !messages.length) return false;
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') return false;
  // content can be a plain string or an array of blocks (text + image).
  let text = '';
  if (typeof last.content === 'string') {
    text = last.content;
  } else if (Array.isArray(last.content)) {
    const tb = last.content.find(c => c && c.type === 'text');
    text = tb?.text || '';
  }
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/^(yes|yeah|yep|yup|ok|okay|sure|do it|go ahead|proceed|confirm(ed)?|approve(d)?|please do|let['‘’]?s do it|let['‘’]?s go|looks good|sounds good|that works|perfect|great|correct|right|affirmative|y|run it|run them|build it|make it|start|begin|go|run|continue|keep going)\b/i.test(trimmed)) {
    return true;
  }
  // Nudges — phrases that read as "did you do it / why haven't you / get on with it".
  // Anchored to start because "did" / "why" inside a longer sentence isn't a nudge.
  if (/^(did you|have you|are you|why didn['‘’]?t|why haven['‘’]?t|why aren['‘’]?t|when will|when are|please just|just do|just create|just run|hurry up|c['‘’]?mon|come on|now do|now create|get on with|get started|get going|move on)/i.test(trimmed)) {
    return true;
  }
  if (/\b(create|add|insert|log|update|change|set|edit|modify|delete|remove|drop|mark|advance|bill|complete|reject|import|upload|save|build|make|start|begin|run|execute|generate)\b/i.test(trimmed)) {
    return true;
  }
  return false;
}

module.exports = function installAiRoutes(app, pool, mw) {
  const { requireAdmin, upload } = mw;

  // Anthropic client — single instance per process. The boot-time
  // ANTHROPIC_API_KEY check still lives in server.js so missing env is
  // surfaced immediately at startup rather than at first chat.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { updateProjectHours, calcProjectFinancials, collectProjectTree } = require('./_helpers');
  const { csvStage, CSV_STAGE_TTL_MS } = require('./_csv_stage');
  const csvHelpers = require('./hours_csv')._helpers;
  const { normalizeName, normalizeWO, detectColumns, parseDateCell } = csvHelpers;
  const portalModule = require('../portal_module');
  const { isDuplicateProject } = portalModule;

  // ensureRollupChain is set on app.locals by portal_module when the
  // portal extension installer runs. The case below uses it via that
  // path. Falls back to a no-op when the portal extension hasn't run
  // (admin-only deploys) so the AI tool still creates projects.
  function _ensureRollupChain(args) {
    if (typeof app.locals.ensureRollupChain === 'function') {
      return app.locals.ensureRollupChain(args);
    }
    return Promise.resolve(null);
  }


// ─────────────────────────────────────────────────────────────────────────────
// AI CHAT — FULL TOOL SUITE
// ─────────────────────────────────────────────────────────────────────────────

async function getDBContext() {
  // Program classification lives on engineering_contracts.program (surfaced
  // below) — clients carry only identity, not program. The legacy
  // clients.is_rus column has been retired.
  const [clients, projects, staff, contracts, engineeringContracts, budgets, concentrators] = await Promise.all([
    pool.query('SELECT id, name FROM clients ORDER BY name'),
    pool.query(`
      SELECT p.id, p.name, p.project_type, p.status, p.work_order_number,
             p.billing_type, p.billing_rate, p.footage, p.miles,
             p.expected_hours, p.expected_revenue, p.actual_hours,
             cl.name as client_name, co.contract_number,
             p.start_date, p.completed_date, p.billed_date, p.notes,
             p.parent_id, pp.name as parent_name,
             p.budget_code_id, bc.code as budget_code_name,
             p.concentrator_id, con.area_name as concentrator_area, con.contract_label as concentrator_contract
      FROM projects p
      LEFT JOIN clients cl ON cl.id=p.client_id
      LEFT JOIN contracts co ON co.id=p.contract_id
      LEFT JOIN projects pp ON pp.id=p.parent_id
      LEFT JOIN budget_codes bc ON bc.id=p.budget_code_id
      LEFT JOIN concentrators con ON con.id=p.concentrator_id
      ORDER BY p.created_at DESC LIMIT 50
    `),
    pool.query('SELECT id, name FROM staff WHERE active=true ORDER BY name'),
    pool.query('SELECT c.*, cl.name as client_name FROM contracts c JOIN clients cl ON cl.id=c.client_id ORDER BY cl.name, c.contract_number'),
    pool.query(`SELECT ec.id, ec.name, ec.contract_number, ec.loan_name, ec.program, ec.active,
                       cl.id AS client_id, cl.name AS client_name
                  FROM engineering_contracts ec
                  JOIN clients cl ON cl.id = ec.client_id
                 ORDER BY cl.name, ec.name`),
    pool.query(`
      SELECT b.id, b.name, b.project_id, b.total_amount, p.name as project_name,
             json_agg(json_build_object(
               'id', bc.id, 'code', bc.code, 'allocated_amount', bc.allocated_amount, 'description', bc.description
             )) FILTER (WHERE bc.id IS NOT NULL) as codes
      FROM budgets b
      LEFT JOIN projects p ON p.id = b.project_id
      LEFT JOIN budget_codes bc ON bc.budget_id = b.id
      GROUP BY b.id, b.name, b.project_id, b.total_amount, p.name
      ORDER BY b.created_at DESC
    `),
    pool.query('SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active=true ORDER BY contract_label, area_name')
  ]);
  return {
    clients: clients.rows,
    projects: projects.rows,
    staff: staff.rows,
    contracts: contracts.rows,
    engineering_contracts: engineeringContracts.rows,
    budgets: budgets.rows,
    concentrators: concentrators.rows,
  };
}

const SYSTEM_PROMPT = `You are the AI project manager for Launch Fiber Services, a fiber optic infrastructure company in Macon, Georgia. You have FULL access to the database through tools. You are smart, proactive, and thorough.

RATE STRUCTURE:
- Inspection: $90/hr (typical for RUS-program work, but applicable wherever an Inspection job is configured)
- Resident Engineer (RE): $100/hr (typical for RUS-program work)
- Permitting: $90/hr at random 25-30 hrs/mile (0.25 increments), with a 25-hour minimum when the project is under one mile. The hours-per-mile factor is randomized per-project at create time and stored. The "Permitting" job is the standard DOT/County variant ($90/hr). The "Permitting (RR)" job is the railroad variant — uses the same hours calc but with a custom rate the user sets in Settings → Pricing (rate may be NULL until set, in which case expected_revenue is also NULL).
- Design: VARIABLE - always ask for billing rate
- Other: VARIABLE - always ask for billing rate

CLIENTS vs PROGRAMS — CRITICAL DISTINCTION:
- "PSC", "COX", "IFT", "TRI-CO" are CLIENTS (rows in the clients table).
- "RUS", "BAU", "GFR", "Other" are PROGRAMS (engineering_contracts.program).
- A single client can have engineering contracts in multiple programs.
  PSC in particular has BOTH RUS-program work (under the "RUS 217
  Engineering Contract GA 1706 - A72" umbrella) AND ordinary BAU work.
  Do NOT conflate "PSC" with "RUS" — they are orthogonal.
- When a user says "PSC RUS", they mean: the PSC client AND a
  program='rus' engineering contract. Find the PSC client_id, then find
  (or ask which) engineering contract under PSC has program='rus'.
- When a user says "PSC" alone, they mean the PSC client across any program.
- When a user says "RUS" alone, they almost always mean RUS work for PSC
  (since that's where the bulk of RUS work lives), but verify before
  scoping — another client could have RUS work too.
- NEVER create a "PSC RUS" client. PSC is the client; RUS lives at the
  engineering-contract level via the program field.
- The clients table does NOT carry a program flag. The legacy is_rus
  column was retired in migration 0003 — don't reference it.
- Each engineering contract carries a program (rus|bau|gfr|other|NULL).
  Each project also carries a program (auto-derived from its EC at
  create time, falls back to caller-supplied or NULL). The pricing list
  keys on (job × program × billing_code).
Contracts and work orders are managed manually or through the AI.

BILLING CADENCE: Each project is either "one_time" (default — single invoice when complete; permitting, fixed-fee design jobs) or "monthly" (bills hours every month, project stays active across cycles; typical Inspection contracts). When a one-time project is billed, status becomes 'billed' and it closes. When a monthly project is billed, it stays active and reappears in next month's queue. Inspection-job projects default to monthly. Use set_billing_cadence to flip a project between modes.

PROJECTED REVENUE: Each project may have a projected_revenue (contract value / projected total earnings). For footage projects this is auto-derived from miles × rate. For hourly projects the user enters it manually — it's optional. Containers (parents/grandparents) don't carry their own projected_revenue; their displayed total is summed from descendant LEAVES only (no double counting).

YOUR CAPABILITIES — you can do ALL of the following:
1. CREATE, UPDATE, and DELETE projects (including nested sub-projects)
2. CREATE clients, staff members, and contracts
3. LOG time entries (single or bulk from CSV)
4. MARK projects as billed or change their status
5. ADVANCE permit stages
6. QUERY the database for any information — projects, hours, revenue, etc.
7. Answer questions about project data, billing, revenue, hours

NESTED PROJECTS:
- Projects support UNLIMITED nesting depth. Typical structure: Contract → Area/WO → Job type (inspection, permitting, etc.)
- Example: "RUS 217" → "Contract 4" → "Butler" → "Butler SR74 Permitting"
- Set parent_id to nest under another project at any depth.
- The user does NOT need to specify every level. Be smart:
  - "Add inspection in Butler" → Find Butler in the tree, create a child project under it, auto-set concentrator and WO#.
  - If an intermediate parent doesn't exist yet, offer to create it.
- Hours roll up through the entire chain — a child's hours add to its parent, grandparent, and all the way up.
- In the DATABASE CONTEXT, projects with a parent_name are nested.

BUDGETS:
- Parent projects can have a BUDGET — an external funding source with a name like "RUS 217 Reconnect 3".
- Each budget has BUDGET CODES (job codes) with allocated dollar amounts, e.g. "Inspection: $50,000", "RE: $75,000", "Permitting: $30,000".
- Projects link to a budget_code_id so their billable work draws from that code's allocation.
- When asked to set up a budget, first create the budget (create_budget), then add each code (create_budget_code), then link projects to the appropriate codes (update_project with budget_code_id).
- To see budget utilization, use query_database to join budgets, budget_codes, and projects.
- The "spent" amount for a code = sum of billable work from all projects linked to that code (hourly: actual_hours × billing_rate, footage: expected_revenue).
- If the user uploads a contract document, extract the budget codes and amounts and offer to set them up.
- The DATABASE CONTEXT includes budgets with their codes — use the budget code IDs when linking projects.
- When referencing budgets, always inform the user of per-area spending and remaining budget.

CONCENTRATORS / SERVICE AREAS:
- The DATABASE CONTEXT includes a concentrators list — these are service areas with their WO numbers, grouped by contract.
- Each concentrator has: id, contract_label (e.g. "Contract 3"), area_name (e.g. "Mt. Paran"), work_order_number (e.g. "16316").
- When creating a project, if the user mentions an AREA NAME (like "Mt. Paran", "Butler", "Talbotton", etc.), AUTOMATICALLY look up the matching concentrator and set both:
  1. concentrator_id = the concentrator's UUID
  2. work_order_number = the concentrator's WO number
- Do NOT ask for the WO# if you can match it from the concentrator data. Only ask if you can't find a match.
- Be fuzzy with area matching: "Paran" should match "Mt. Paran", "Crossroads" should match "Crossroad School", "hwy240" should match "HWY 240".
- All concentrator areas draw from the same budget (RUS 217). When discussing budget status, break down spending by area.
- The concentrator list in DATABASE CONTEXT has the exact UUIDs — use those when setting concentrator_id.

HOW TO WORK:
- When the user asks to create/update/delete something, first summarize what you'll do, then ask for confirmation.
- When the user confirms (says yes, ok, correct, go ahead, etc.), IMMEDIATELY call the appropriate tool. Do not say "I'll create it now" — just call the tool.
- Use the DATABASE CONTEXT below to find correct UUIDs for client_id, contract_id, staff_id, and project_id. Match by name when the user refers to things by name.
- If a user mentions a client that doesn't exist, offer to create it.
- If a user mentions a staff member that doesn't exist, offer to create them.
- For permitting projects, always set billing_type to 'footage' and billing_rate to 90. The footage field drives the financial calculation.
- For inspection, set billing_rate to 90 and billing_type to 'hourly'.
- For RE, set billing_rate to 100 and billing_type to 'hourly'.
- For design/other, ASK for the billing rate before creating.

QUERYING DATA:
- You have a query_database tool that can run SELECT queries. Use it to answer questions about projects, hours, revenue, etc.
- NEVER run INSERT, UPDATE, DELETE, DROP, ALTER, or any modifying SQL through query_database. Only SELECT.
- Use the specific action tools (create_project, update_project, etc.) for modifications.
- CRITICAL — ALWAYS USE SQL FOR ARITHMETIC. If the user asks for any sum, count, average, or total ("how many hours did X work", "what's the total revenue this month", "how much has been logged for project Y"), write a SQL query — do NOT add numbers up in your response text. LLMs make arithmetic errors silently; the database does not. Example: NEVER write "5 + 3 + 2 = 11 hours" yourself; instead run 'SELECT SUM(hours) FROM time_entries WHERE ...' and report the result.

HONESTY — NEVER FAKE SUCCESS:
- NEVER claim an action succeeded unless the corresponding tool was actually called AND returned success:true. No exceptions. If you say "I've logged the entries" or "I've created the project," it must be because a tool result confirmed it.
- After any modifying tool call (log_time_entries, create_project, update_project, etc.), look at the tool result. If success:false or there's an error field, report the error to the user honestly — do not paper over it.
- DO NOT say "I'll create that", "Let me log those", "Creating the project now", or any future/progressive phrasing followed by no action. Either CALL the tool in the same turn, or ASK a clarifying question. The frontend has a hallucination guard that surfaces a red warning to the user when text claims action without a successful tool result, so these silent skips don't go unnoticed — they look bad. Prefer "Should I create X with values Y?" (a question) over "I'll create X" (a hollow promise).
- USER NUDGES — if the user's reply reads as "did you start", "have you started", "why didn't you do it", "just do it", "go", "run it", "starting", or any short prompt that implies you should stop talking and execute, treat the prior plan in this thread as APPROVED and re-emit the proposed tool calls in the SAME turn. Do not say "I haven't started yet" without immediately firing the tool calls in the same response. The user has already confirmed by nudging.
- BATCHING — when scaffolding more than ~5 projects in one ask (e.g. "create the whole PSC tree", "set up all WO containers under Contract 3", "give me Permitting DOT/RR/County under each area"), USE bulk_create_projects ONCE with the full spec list, NOT a series of create_project calls split across "Layer 1 / Layer 2 / Layer 3" approval rounds. The bulk tool resolves intra-batch parent_id refs via local_id, so a single approval click materializes the entire tree. Splitting a tree into N layers means N approval round-trips for the user, which is the wrong default. Reserve single create_project for one-off creates the user explicitly named.
- ROLLUPS vs LEAVES — every project is one of two things:
  • A ROLLUP is an organize-only folder. It has a name and a parent, no job, no rate, no hours, no billing. It exists only to nest other projects. Set is_rollup:true on it. Examples: "Contract 3" rollup grouping WO rollups, "Crossroad School WO 16300" rollup grouping team rollups, "Inspection" rollup grouping individual Inspection leaves.
  • A LEAF is a real billable project with a job, a rate, and (eventually) hours / footage. Set is_rollup:false (or omit). It's where time entries actually land.
  CRITICAL trap to avoid: when the user says "make an Inspection folder under each WO with the Inspection projects under it," the Inspection FOLDER is a rollup (is_rollup:true) and its children are leaves with project_type:'inspection'. Even though both are named "Inspection," they're different things. If you create the folder as a leaf (is_rollup omitted), the system treats it as an actual job-bearing project — it shows up in dashboards, billing batches, and the inspection tab as if work happened on the folder itself. Owner-flagged 2026-05-06: this exact mistake polluted the PSC RUS tree.
  Rule of thumb: if the project's only purpose is to group children, it's a rollup. If it has, will have, or could have time entries logged against it, it's a leaf.
- After log_time_entries returns success, IMMEDIATELY run a verification query like:
    SELECT COUNT(*) as cnt, SUM(hours) as total_hours FROM time_entries WHERE import_batch = 'ai_import_<batch_id>'
  and report the verified count and total to the user. This proves the data actually landed and catches any silent failures.

PROJECT LIFECYCLE — completed means READY TO BILL:
- Statuses progress: active → completed → billed. The system treats 'completed' as "work done, awaiting invoice."
- When you mark a project completed (via update_project_status), ALWAYS remind the user it now needs billing and surface the billable amount: hours × rate for hourly, expected_revenue for footage.
- Do NOT skip from active straight to billed. If the user wants to mark something billed, confirm the work is finished first; if it isn't yet completed, walk them through completed → billed.
- When asked "what needs to be billed" or similar, query for projects where status='completed' AND billed_date IS NULL.

WORKFORCE FILE IMPORTS:
When a user uploads an Excel or CSV file with workforce/timesheet data, you must be intelligent about processing it:

1. THE FILE DATA IS STORED SERVER-SIDE. You receive only the upload_id, headers, row count, and 5 sample rows.
   Use the get_upload_data tool to fetch the actual data in batches of 50 rows.
   Start with offset=0, then increment by 50 until has_more is false.

2. ANALYZE THE SAMPLE FIRST: Look at the 5 sample rows to understand the structure before fetching everything.
   Common columns include: employee/name/worker, date, work_order/WO/project, hours, job_title/position/role.

2. MATCH TO EXISTING DATA:
   - Match work order numbers (WO-001, etc.) to existing projects in the DATABASE CONTEXT
   - Match employee names to existing staff members
   - Match client names to existing clients
   - Be fuzzy — "J. Smith" might be "John Smith", "WO 001" might be "WO-001"

3. HANDLE MISSING DATA:
   - If a work order doesn't match any project, tell the user and offer to CREATE the project. Ask what type/rate it should be.
   - If an employee isn't in the system, offer to CREATE them as staff.
   - DATES — the file parser already normalizes date-formatted cells to YYYY-MM-DD. If you still see ambiguous formats (e.g. "3/15/26" as text), normalize them to YYYY-MM-DD using these rules:
     • TODAY'S DATE is provided in the DATABASE CONTEXT block as "_today" — always cross-reference against it.
     • If the year is missing, default to the year of TODAY.
     • If the year is 2-digit, expand using the current century (so "26" → "2026", not "1926").
     • SANITY CHECK every date you produce: if any entry_date is more than 18 months before TODAY or any time in the future, STOP and ask the user to confirm before logging. Don't silently log entries from the wrong year — this has happened before and corrupts monthly revenue.

4. SUMMARIZE BEFORE ACTING: Show the user a clear breakdown:
   - How many entries will be logged
   - Which projects they map to
   - Which employees are involved
   - Any entries that couldn't be matched (and what to do about them)
   - Total hours per project and per employee

5. MAKE INTELLIGENT ASSUMPTIONS:
   - If a column is labeled "Regular Hours" and "OT Hours", combine them or note the overtime
   - If there are multiple date columns, use the most specific one (entry_date over pay_period)
   - If work orders have prefixes like "PSC-" or "RUS-", use that to identify the client
   - If a sheet has subtotals or summary rows, skip them
   - If hours are blank or zero for a row, skip that row
   - Look for patterns: if all work orders start with the same prefix, they likely belong to the same client/contract

6. WAIT FOR CONFIRMATION before calling log_time_entries. Show exactly what will be saved.

7. SMART IMPORT SHORTCUT: For routine timecard imports where the file looks well-formed and you don't need row-by-row reasoning, use the csv_smart_import tool. It runs the same matching the human-facing modal does (fuzzy staff names, WO# resolution, billing-code disambiguation), returns a summary of what was found, and stages the rows for commit. Show the summary to the user and let them confirm in the Hours tab's Import modal — that screen has the per-row review UI so the human stays in control of the final write. Use the manual approach (get_upload_data + analysis + log_time_entries) when the file is unusual, has anomalies you want to call out, or the user has asked for line-by-line oversight.

DATABASE CONTEXT (current data):
{CONTEXT}`;

// ─── TOOL DEFINITIONS ────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    name: 'create_project',
    description: 'Create a new project in the database. Can be a top-level project or a sub-project nested under a parent. Call this ONLY after the user has confirmed the details. Use is_rollup:true for organize-only container/folder projects (e.g. a "Crossroad School WO" folder, an "Inspection" rollup grouping every Inspection leaf under a WO). When is_rollup is true, project_type/billing_type/billing_rate are NOT required — rollups have no traits, only nest other projects. CRITICAL: if you are creating a folder named after a job (e.g. a rollup called "Inspection" or "Resident Engineer" that just groups leaves of that type), set is_rollup:true. Otherwise the system treats the folder as an actual job-bearing project and miscounts it in dashboard tiles, billing, and the inspection tab.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        client_id: { type: 'string', description: 'Client UUID from database context' },
        contract_id: { type: 'string', description: 'Contract UUID (optional). Setting this auto-derives `program` from the contract\'s engineering contract.' },
        work_order_number: { type: 'string', description: 'Work order number' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'], description: 'Legacy JOB-CATEGORY tag (inspection/re/permitting/design/other). Distinct from `program` — see that field. Not required when is_rollup is true.' },
        program: { type: 'string', enum: ['rus', 'bau', 'gfr', 'other'], description: 'Program classification. Auto-derived from contract_id\'s engineering contract when set; pass explicitly to override or for projects without a contract.' },
        billing_type: { type: 'string', enum: ['hourly', 'footage'], description: 'Not required when is_rollup is true.' },
        billing_rate: { type: 'number', description: 'Hourly rate in dollars. Not required when is_rollup is true.' },
        footage: { type: 'number', description: 'Linear footage (permitting projects only)' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold'], default: 'active' },
        start_date: { type: 'string', description: 'YYYY-MM-DD format (optional)' },
        notes: { type: 'string' },
        parent_id: { type: 'string', description: 'UUID of parent project to nest this under (optional). Use this to create sub-projects.' },
        budget_code_id: { type: 'string', description: 'UUID of budget code this project bills against (optional). Get from database context budgets.' },
        concentrator_id: { type: 'string', description: 'UUID of the concentrator/service area this project belongs to. Look up from concentrators in database context by area name.' },
        is_rollup: { type: 'boolean', default: false, description: 'TRUE for organize-only container projects (folders that group other projects). When TRUE, the project carries no job, no rate, no billing — it just nests children. Required required_for_rollup_with_job_name pattern: if the folder is named after a job (e.g. "Inspection" rollup over inspection leaves), set this TRUE so the system treats it as a folder rather than a job-bearing project.' }
      },
      // is_rollup makes project_type/billing_type/billing_rate optional.
      // We can't express "required unless is_rollup=true" in JSON schema
      // here; the server-side handler enforces it.
      required: ['name', 'client_id']
    }
  },
  {
    name: 'update_project',
    description: 'Update an existing project. Only include the fields that are changing. Can move a project under a parent or make it top-level. Call ONLY after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to update' },
        name: { type: 'string' },
        client_id: { type: 'string' },
        contract_id: { type: 'string', description: 'New contract UUID. If supplied AND program isn\'t in the same patch, program auto-derives from the new contract\'s engineering contract.' },
        work_order_number: { type: 'string' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'], description: 'Legacy JOB-CATEGORY tag.' },
        program: { type: ['string', 'null'], description: 'Program classification (rus|bau|gfr|other). Pass null to clear. Server validates against the enum.' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number' },
        footage: { type: 'number' },
        start_date: { type: 'string' },
        completed_date: { type: 'string' },
        notes: { type: 'string' },
        parent_id: { type: ['string', 'null'], description: 'UUID of parent project, or null to make it top-level' },
        budget_code_id: { type: ['string', 'null'], description: 'UUID of budget code this project bills against, or null to unlink' },
        concentrator_id: { type: ['string', 'null'], description: 'UUID of concentrator/service area, or null to unlink' },
        billing_cadence: { type: 'string', enum: ['one_time', 'monthly'], description: 'one_time = single invoice when complete (permitting, fixed-fee). monthly = bills hours each month, project stays active across cycles (typical Inspection contracts).' },
        projected_revenue: { type: ['number', 'null'], description: 'Total projected revenue / contract value. Optional. For footage projects this is auto-derived; for hourly projects user enters manually.' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'set_billing_cadence',
    description: 'Quick way to flip a project between one-time and monthly billing. Use when the user says things like "make X a monthly project" or "this should bill each month".',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project' },
        cadence: { type: 'string', enum: ['one_time', 'monthly'] }
      },
      required: ['project_id', 'cadence']
    }
  },
  {
    name: 'delete_project',
    description: 'Delete a single project and all its associated data. Call ONLY after user explicitly confirms deletion.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the project to delete' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'bulk_delete_projects',
    description: 'Delete MULTIPLE projects in a single approval round. Use when the user asks to mass-delete projects matching a filter or list. Each project is deleted in the same path as delete_project (cleans up time entries, invoice items, billing batch items, permits). Returns a per-id status report. Call ONLY after the user has explicitly confirmed the delete list.',
    input_schema: {
      type: 'object',
      properties: {
        project_ids: { type: 'array', items: { type: 'string' }, description: 'UUIDs of projects to delete' },
        reason: { type: 'string', description: 'Short reason / justification (shown on the approval card)' }
      },
      required: ['project_ids']
    }
  },
  {
    name: 'bulk_create_projects',
    description: 'Create a TREE of projects in a single approval round. Use this whenever the user asks to scaffold more than ~5 projects at once (full PSC tree, all WO containers under a contract, all permitting sub-rollups under an area, etc.) instead of firing many small create_project calls across many approval cards. Each spec carries a `local_id` string the AI invents — referencing it as another spec\'s `parent_local_id` lets the tool resolve parent UUIDs server-side after creating each row in dependency order. Use `is_rollup: true` for container/folder projects (Contract, Service Area, Team) — they show as collapsible folders in the tree. Set `is_rollup: false` (or omit) for actual leaves that hold hours / footage / invoices. Returns a map of local_id → created UUID so the AI can reference the new ids in follow-up tool calls. ONLY call after the user has explicitly confirmed the full plan. INHERITANCE: a spec without an explicit client_id / contract_id / concentrator_id / work_order_number inherits the value from its nearest ancestor (via parent_local_id chain). Set those four fields ONCE at the appropriate rollup level (concentrator_id + work_order_number on the Service Area / WO rollup, client_id + contract_id on the Contract rollup) — DO NOT repeat them on every spec. Repeating UUIDs on every row blows up the token cost and risks hitting the model\'s output cap on a tree of 50+ specs. CRITICAL for RUS Inspection trees: when nesting Inspection/RE leaves under a WO rollup, the child leaves auto-inherit the rollup\'s concentrator_id AND work_order_number — that\'s how the PSC RUS tab shows the right service area and WO# on each leaf. If you skip setting them on the parent rollup, the leaves will show with no service area / no WO#.',
    input_schema: {
      type: 'object',
      properties: {
        projects: {
          type: 'array',
          description: 'Array of project specs to create in one transaction. Order is auto-resolved by parent_local_id; circular refs are rejected.',
          items: {
            type: 'object',
            properties: {
              local_id:        { type: 'string',  description: 'Caller-invented stable id (e.g. "C3", "C3-Crossroad", "C3-Crossroad-Permitting"). Used to wire parent refs in this same batch.' },
              parent_local_id: { type: 'string',  description: 'local_id of the parent in this batch. Mutually exclusive with parent_id.' },
              parent_id:       { type: 'string',  description: 'UUID of an existing project to nest under. Mutually exclusive with parent_local_id. Leave both empty for root.' },
              name:            { type: 'string' },
              client_id:       { type: 'string' },
              contract_id:     { type: 'string', description: 'When set, program auto-derives from the contract\'s engineering contract.' },
              concentrator_id: { type: 'string' },
              project_type:    { type: 'string', description: "Legacy job-category tag: rollup / other / inspection / re / permitting / design" },
              program:         { type: 'string', description: "Program enum: rus / bau / gfr / other. Auto-derived from contract_id when set; pass explicitly to override." },
              is_rollup:       { type: 'boolean', description: 'TRUE for container/folder projects (default FALSE)' },
              status:          { type: 'string', description: 'active / completed / billed (default active)' },
              billing_type:    { type: 'string', description: 'hourly / footage' },
              billing_rate:    { type: 'number' },
              billing_cadence: { type: 'string', description: 'one_time / monthly' },
              footage:         { type: 'number' },
              start_date:      { type: 'string', description: 'YYYY-MM-DD' },
              work_order_number: { type: 'string' },
              notes:           { type: 'string' },
            },
            required: ['local_id', 'name'],
          },
        },
      },
      required: ['projects'],
    }
  },
  {
    name: 'create_client',
    description: 'Create a new client in the database. Programs (RUS / BAU / GFR / Other) are NOT set here — they live on engineering contracts via create_engineering_contract.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
        notes: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_client',
    description: 'Update an existing client. Only provided fields are changed. Note: program (RUS/BAU/GFR/Other) lives on engineering contracts, not on the client.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID to update' },
        name: { type: 'string', description: 'New name (optional)' },
        notes: { type: 'string', description: 'New notes (optional, pass empty string to clear)' }
      },
      required: ['client_id']
    }
  },
  {
    name: 'create_engineering_contract',
    description: 'Create an engineering-contract umbrella for a client. The umbrella groups multiple billing contracts (e.g. 515-3, 515-4, 515-5 under "RUS 217 Engineering Contract GA 1706 -A72"). Set program to classify the work — this drives RUS-specific behaviors like the PSC RUS PDF template, the projection/inspection scoping, and the right pricing defaults.',
    input_schema: {
      type: 'object',
      properties: {
        client_id:        { type: 'string', description: 'Client UUID this engineering contract belongs to' },
        name:             { type: 'string', description: 'Display name (e.g. "RUS 217 Engineering Contract GA 1706 -A72")' },
        contract_number:  { type: 'string', description: 'Optional short identifier for invoices/reports' },
        loan_name:        { type: 'string', description: 'Optional loan name (e.g. "Reconnect 3"). Appears on PSC RUS invoice summaries.' },
        program:          { type: 'string', enum: ['rus','bau','gfr','other'], description: 'Program classification. rus = USDA RUS work (triggers PSC RUS PDF, projection, inspection-tab scoping). bau = business-as-usual private fiber. gfr = GF(R). other = anything else.' },
        notes:            { type: 'string' }
      },
      required: ['client_id', 'name']
    }
  },
  {
    name: 'update_engineering_contract',
    description: 'Update an engineering contract. Only provided fields are changed.',
    input_schema: {
      type: 'object',
      properties: {
        engineering_contract_id: { type: 'string', description: 'Engineering contract UUID to update' },
        name:             { type: 'string' },
        contract_number:  { type: 'string' },
        loan_name:        { type: 'string' },
        program:          { type: 'string', enum: ['rus','bau','gfr','other'], description: 'Program classification — see create_engineering_contract.' },
        notes:            { type: 'string' },
        active:           { type: 'boolean' }
      },
      required: ['engineering_contract_id']
    }
  },
  {
    name: 'delete_client',
    description: 'Delete a client. WARNING: this cascade-deletes all the client\'s contracts and projects, which in turn deletes their time entries, invoices, and budgets. Use with care. ALWAYS confirm with the user before calling this.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID to delete' }
      },
      required: ['client_id']
    }
  },
  {
    name: 'create_staff',
    description: 'Create a new staff member.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Staff member full name' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_contract',
    description: 'Create a new contract for a client.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        contract_number: { type: 'string', description: 'Contract number/identifier' },
        name: { type: 'string', description: 'Contract name/description' }
      },
      required: ['client_id', 'contract_number']
    }
  },
  {
    name: 'log_time_entries',
    description: 'Log one or more time entries for projects. Call after user confirms.',
    input_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              project_id: { type: 'string' },
              staff_id: { type: 'string' },
              entry_date: { type: 'string', description: 'YYYY-MM-DD format' },
              hours: { type: 'number' },
              job_title: { type: 'string' }
            },
            required: ['project_id', 'entry_date', 'hours']
          }
        }
      },
      required: ['entries']
    }
  },
  {
    name: 'update_project_status',
    description: 'Quick status change for a project: active, completed, on_hold, or billed. For marking billed, also sets billed_date.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project UUID' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold', 'billed'] }
      },
      required: ['project_id', 'status']
    }
  },
  {
    name: 'advance_permit_stage',
    description: 'Advance a permitting project to the next stage in the pipeline.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        updated_by: { type: 'string', description: 'Name of person advancing the stage' },
        notes: { type: 'string' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'query_database',
    description: 'Run a read-only SELECT query against the database to look up information. Use this to answer questions about projects, hours, revenue, budgets, staff, etc. ONLY SELECT queries allowed — never INSERT/UPDATE/DELETE/DROP/ALTER.',
    input_schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'A SELECT query to run. Available tables: clients, contracts, staff, projects, time_entries, permit_stages, permit_documents, invoices, invoice_items, budgets, budget_codes, concentrators. Key columns — projects: id, name, client_id, contract_id, work_order_number, project_type, status, billing_type, billing_rate, footage, miles, expected_hours, expected_revenue, actual_hours, start_date, completed_date, billed_date, notes, parent_id, budget_code_id, concentrator_id. budgets: id, project_id, name, total_amount. budget_codes: id, budget_id, code, description, allocated_amount. concentrators: id, contract_label, area_name, work_order_number.' },
        description: { type: 'string', description: 'What you are looking up and why' }
      },
      required: ['sql', 'description']
    }
  },
  {
    name: 'create_budget',
    description: 'Create a budget for a parent project. A budget represents an external funding source (e.g. "RUS 217 Reconnect 3") with allocated amounts per job code.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'UUID of the parent project this budget is for' },
        name: { type: 'string', description: 'Budget name, e.g. "RUS 217 Reconnect 3"' },
        notes: { type: 'string' }
      },
      required: ['project_id', 'name']
    }
  },
  {
    name: 'create_budget_code',
    description: 'Add a job/contract code to a budget with its allocated dollar amount. Each code represents a category of work that draws from the budget.',
    input_schema: {
      type: 'object',
      properties: {
        budget_id: { type: 'string', description: 'UUID of the budget' },
        code: { type: 'string', description: 'Code name, e.g. "Inspection", "Resident Engineer", "Permitting", "Design"' },
        description: { type: 'string', description: 'Optional description of this code' },
        allocated_amount: { type: 'number', description: 'Dollar amount allocated to this code' }
      },
      required: ['budget_id', 'code', 'allocated_amount']
    }
  },
  {
    name: 'update_budget_code',
    description: 'Update an existing budget code (change allocation amount, name, etc).',
    input_schema: {
      type: 'object',
      properties: {
        budget_code_id: { type: 'string', description: 'UUID of the budget code to update' },
        code: { type: 'string' },
        description: { type: 'string' },
        allocated_amount: { type: 'number' }
      },
      required: ['budget_code_id']
    }
  },
  {
    name: 'get_upload_data',
    description: 'Fetch rows from an uploaded Excel/CSV file. The file is stored server-side by upload_id. Fetch in batches of up to 50 rows at a time. Start with offset 0 and increase by the batch size to page through. Use this to read the actual data after the user uploads a file.',
    input_schema: {
      type: 'object',
      properties: {
        upload_id: { type: 'string', description: 'The upload_id from the uploaded file context' },
        offset: { type: 'number', description: 'Row offset to start from (default 0)', default: 0 },
        limit: { type: 'number', description: 'Number of rows to fetch (default 50, max 100)', default: 50 }
      },
      required: ['upload_id']
    }
  },
  {
    name: 'csv_smart_import',
    description: 'Validate and commit a timecard CSV/Excel file in one go. Auto-creates missing staff, jobs, and projects when sensible defaults can be derived. Use this when the user has uploaded a timesheet and wants the entries posted to time_entries. Returns the same summary the manual review modal shows: what got imported, what was skipped, and what was newly created. If you cannot pick a sensible client_id for unknown WOs, set default_client_id to null and the importer will skip those rows so a human can resolve them later.',
    input_schema: {
      type: 'object',
      properties: {
        upload_id: { type: 'string', description: 'The upload_id of the previously uploaded CSV/XLSX file' },
        default_client_id: { type: 'string', description: 'Fallback client UUID to attach any auto-created projects to. Pass null to skip unknown WOs.' },
        auto_create_unknown_staff: { type: 'boolean', description: 'If true (default), missing staff names are added as new staff records. If false, rows with unknown names are skipped.', default: true },
        auto_create_unknown_wos: { type: 'boolean', description: 'If true, unknown WOs are turned into new projects (requires default_client_id). If false (default), they are skipped.', default: false },
        apply_job_title: { type: 'string', description: 'Optional job title to apply to rows that have no job_title column (e.g. "Inspector").' }
      },
      required: ['upload_id']
    }
  },

  // ─── EXPANDED CAPABILITIES (admin-confirmed) ──────────────────────────────
  // The tools below either operate at higher leverage (bulk) or touch
  // sensitive surface area (users, raw SQL, invoices). Each is gated by the
  // approval mechanism — Claude proposes the action, the admin reviews
  // exactly what will run, and clicks Apply before any DB write happens.
  // See DESTRUCTIVE_TOOLS in the chat handler for which tools require approval.

  // create_engineering_contract / update_engineering_contract are defined
  // earlier in this list (with the program field). The legacy duplicate that
  // used to live here was removed in the Path B refactor — having two tools
  // with the same name causes the Anthropic API to reject the request.

  {
    name: 'update_contract_umbrella',
    description: 'Move a billing contract under (or out of) an engineering-contract umbrella. Pass engineering_contract_id=null to detach. Use after create_engineering_contract to wire existing contracts up.',
    input_schema: {
      type: 'object',
      properties: {
        contract_id: { type: 'string', description: 'Billing contract UUID' },
        engineering_contract_id: { type: ['string', 'null'], description: 'Engineering contract UUID, or null to detach' }
      },
      required: ['contract_id']
    }
  },

  {
    name: 'bulk_update_projects',
    description: 'Update one field on many projects matching a filter. High-leverage operation — always preview the affected count first by running query_database before calling this. Filter and patch are both required. Returns rowCount of affected projects.',
    input_schema: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
          description: 'Match conditions. Supported keys: client_id, contract_id, engineering_contract_id, status, project_type, program. Any combination AND-ed together.',
          properties: {
            client_id: { type: 'string' },
            contract_id: { type: 'string' },
            engineering_contract_id: { type: 'string' },
            status: { type: 'string' },
            project_type: { type: 'string' },
            program: { type: 'string', enum: ['rus', 'bau', 'gfr', 'other'] }
          }
        },
        patch: {
          type: 'object',
          description: 'Fields to set. Supported: status, billing_cadence, notes, billing_rate, contract_id, parent_id, program.',
          properties: {
            status: { type: 'string', enum: ['active', 'completed', 'billed', 'on_hold'] },
            billing_cadence: { type: 'string', enum: ['one_time', 'monthly'] },
            notes: { type: 'string' },
            billing_rate: { type: ['number', 'null'] },
            contract_id: { type: ['string', 'null'] },
            program: { type: ['string', 'null'], description: 'rus|bau|gfr|other, or null to clear. Server validates against the enum.' }
          }
        }
      },
      required: ['filter', 'patch']
    }
  },

  {
    name: 'write_sql',
    description: 'Execute arbitrary SQL (INSERT/UPDATE/DELETE/DDL). Use ONLY when no specific tool exists for the operation — e.g. one-off data migrations, complex multi-table updates. Always preview the impact first via query_database. Single statement only (no semicolons inside the body).',
    input_schema: {
      type: 'object',
      properties: {
        sql: { type: 'string', description: 'SQL to execute (single statement, no trailing semicolon)' },
        params: { type: 'array', items: {}, description: 'Parameterized values for $1, $2, ... — strongly preferred over inline values to avoid injection.' }
      },
      required: ['sql']
    }
  },

  {
    name: 'create_user',
    description: 'Create a new user account. Used to onboard new employees so they can log in. Roles: admin, design_manager, permitting_manager, design_engineer, permitting_engineer.',
    input_schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Login name (case-insensitive unique)' },
        password: { type: 'string', description: 'Initial password — minimum 10 characters. Tell the user the value so they can pass it on.' },
        role: { type: 'string', enum: ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'] },
        full_name: { type: 'string', description: 'Display name' },
        email: { type: 'string', description: 'Email (optional)' },
        staff_id: { type: 'string', description: 'Optional staff record UUID to link this user to (required for time clock access)' },
        extra_teams: { type: 'array', items: { type: 'string' }, description: 'Additional teams beyond their primary role: design, permitting, construction. Empty by default.' }
      },
      required: ['username', 'password', 'role']
    }
  },

  {
    name: 'deactivate_user',
    description: 'Deactivate a user account. Their existing JWTs are immediately invalidated. Reversible by setting active=true via update later.',
    input_schema: {
      type: 'object',
      properties: { user_id: { type: 'string' } },
      required: ['user_id']
    }
  }
];

// ─── TOOL EXECUTION ──────────────────────────────────────────────────────────
// actor = { id, username, staff_id } derived from req.user at call sites.
// Passed explicitly so executeTool stays a pure function outside the request
// lifecycle while still recording who initiated the action.
async function executeTool(toolName, toolInput, actor = {}) {
  try {
    switch (toolName) {
      case 'create_project': {
        // Resilient client resolution: if the AI passes a name like "PSC RUS"
        // (a colloquial alias) or "PSC" instead of a UUID, look up the row.
        // The system prompt already disambiguates, but the database context
        // can drift and the failure mode (FK violation → 500 → opaque error
        // bubbled to chat) is bad UX. Aliases match the names users actually
        // say in the wild; case-insensitive comparison.
        let resolvedClientId = toolInput.client_id;
        const _looksLikeUuid = (s) => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
        if (resolvedClientId && !_looksLikeUuid(resolvedClientId)) {
          const _aliasMap = { 'psc rus': 'PSC', 'rus': 'PSC' };
          const _key = String(resolvedClientId).trim().toLowerCase();
          const _canonical = _aliasMap[_key] || resolvedClientId;
          const r0 = await pool.query(
            'SELECT id FROM clients WHERE LOWER(name) = LOWER($1) LIMIT 1', [_canonical]
          );
          if (!r0.rows[0]) {
            return { success: false, error: `Client "${toolInput.client_id}" not found. Use the UUID from database context, not a name.` };
          }
          resolvedClientId = r0.rows[0].id;
        }
        const isRollup = toolInput.is_rollup === true;
        // Real (non-rollup) projects need the project_type / billing
        // gates the admin form enforces. Rollups skip those entirely
        // because they carry no traits.
        if (!isRollup) {
          if (!toolInput.project_type) return { success: false, error: 'project_type is required (or pass is_rollup:true for organize-only folders)' };
          if (!toolInput.billing_type) return { success: false, error: 'billing_type is required (or pass is_rollup:true for organize-only folders)' };
        }
        const fin = isRollup
          ? { miles: null, expectedHours: null, expectedRevenue: null, permittingHoursPerMile: null }
          : calcProjectFinancials(toolInput.project_type, toolInput.billing_rate, toolInput.footage);

        // program: prefer the explicit input; otherwise derive from the
        // contract's engineering contract (mirrors the admin route).
        // Validate against the same enum the migration's CHECK constraint
        // enforces — surfacing a clear error here beats a Postgres 23514.
        const ALLOWED_PROGRAMS = ['rus', 'bau', 'gfr', 'other'];
        let resolvedProgram = null;
        if (toolInput.program !== undefined && toolInput.program !== null && toolInput.program !== '') {
          const v = String(toolInput.program).trim().toLowerCase();
          if (!ALLOWED_PROGRAMS.includes(v)) {
            return { success: false, error: `Invalid program "${toolInput.program}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.` };
          }
          resolvedProgram = v;
        } else if (toolInput.contract_id) {
          const ecLookup = await pool.query(
            `SELECT ec.program
               FROM contracts c
               JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
              WHERE c.id = $1`, [toolInput.contract_id]
          );
          if (ecLookup.rows.length && ecLookup.rows[0].program) {
            resolvedProgram = ecLookup.rows[0].program;
          }
        }

        const { rows } = await pool.query(`
          INSERT INTO projects (
            name, client_id, contract_id, work_order_number,
            project_type, program, status, billing_type, billing_rate,
            footage, miles, expected_hours, expected_revenue,
            start_date, notes, parent_id, budget_code_id, concentrator_id,
            is_rollup
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
          RETURNING *
        `, [
          toolInput.name,
          resolvedClientId,
          toolInput.contract_id || null,
          toolInput.work_order_number || null,
          // Rollups still get project_type stored if provided (it's purely
          // informational), but billing_type/rate/footage all force NULL.
          toolInput.project_type || (isRollup ? 'other' : null),
          resolvedProgram,
          toolInput.status || 'active',
          isRollup ? null : toolInput.billing_type,
          isRollup ? null : toolInput.billing_rate,
          isRollup ? null : (toolInput.footage || null),
          fin.miles,
          fin.expectedHours,
          fin.expectedRevenue,
          toolInput.start_date || null,
          toolInput.notes || null,
          toolInput.parent_id || null,
          toolInput.budget_code_id || null,
          toolInput.concentrator_id || null,
          isRollup,
        ]);
        // Rollups skip the permit-stage seed — they're folders, not real
        // permitting projects.
        if (!isRollup && toolInput.project_type === 'permitting') {
          await pool.query(
            'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT (project_id, stage) DO NOTHING',
            [rows[0].id, 'potential']
          );
        }
        return { success: true, project: rows[0] };
      }

      case 'update_project': {
        // First fetch the existing project
        const { rows: existing } = await pool.query('SELECT * FROM projects WHERE id=$1', [toolInput.project_id]);
        if (!existing.length) return { success: false, error: 'Project not found' };
        const p = existing[0];

        // Merge updates with existing values
        const name = toolInput.name ?? p.name;
        const client_id = toolInput.client_id ?? p.client_id;
        const contract_id = toolInput.contract_id ?? p.contract_id;
        const work_order_number = toolInput.work_order_number ?? p.work_order_number;
        const project_type = toolInput.project_type ?? p.project_type;
        const status = toolInput.status ?? p.status;
        const billing_type = toolInput.billing_type ?? p.billing_type;
        const billing_rate = toolInput.billing_rate ?? p.billing_rate;
        const footage = toolInput.footage ?? p.footage;
        const start_date = toolInput.start_date ?? p.start_date;
        const completed_date = toolInput.completed_date ?? p.completed_date;
        const notes = toolInput.notes !== undefined ? toolInput.notes : p.notes;
        const parent_id = toolInput.parent_id !== undefined ? toolInput.parent_id : p.parent_id;
        const budget_code_id = toolInput.budget_code_id !== undefined ? toolInput.budget_code_id : p.budget_code_id;
        const concentrator_id = toolInput.concentrator_id !== undefined ? toolInput.concentrator_id : p.concentrator_id;
        const billing_cadence = toolInput.billing_cadence ?? p.billing_cadence;
        const projected_revenue = toolInput.projected_revenue !== undefined ? toolInput.projected_revenue : p.projected_revenue;

        // Program merge: explicit input > derived from new contract > existing.
        const ALLOWED_PROGRAMS = ['rus', 'bau', 'gfr', 'other'];
        let mergedProgram = p.program;
        if (toolInput.program !== undefined) {
          if (toolInput.program === null || toolInput.program === '') {
            mergedProgram = null;
          } else {
            const v = String(toolInput.program).trim().toLowerCase();
            if (!ALLOWED_PROGRAMS.includes(v)) {
              return { success: false, error: `Invalid program "${toolInput.program}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.` };
            }
            mergedProgram = v;
          }
        } else if (toolInput.contract_id !== undefined && toolInput.contract_id !== p.contract_id) {
          // Contract changed in this same patch and program wasn't explicit
          // — re-derive from the new contract's engineering contract.
          if (toolInput.contract_id) {
            const ecLookup = await pool.query(
              `SELECT ec.program
                 FROM contracts c
                 JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
                WHERE c.id = $1`, [toolInput.contract_id]
            );
            if (ecLookup.rows.length && ecLookup.rows[0].program) {
              mergedProgram = ecLookup.rows[0].program;
            }
          }
        }

        const fin = calcProjectFinancials(project_type, billing_rate, footage, p.permitting_hours_per_mile);
        const { rows } = await pool.query(`
          UPDATE projects SET
            name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
            project_type=$5, program=$6, status=$7, billing_type=$8, billing_rate=$9,
            footage=$10, miles=$11, expected_hours=$12, expected_revenue=$13,
            start_date=$14, completed_date=$15, notes=$16, parent_id=$17, budget_code_id=$18, concentrator_id=$19,
            billing_cadence=$20, projected_revenue=$21
          WHERE id=$22 RETURNING *
        `, [
          name, client_id, contract_id, work_order_number,
          project_type, mergedProgram, status, billing_type, billing_rate,
          footage, fin.miles, fin.expectedHours, fin.expectedRevenue,
          start_date, completed_date, notes, parent_id || null, budget_code_id || null, concentrator_id || null,
          billing_cadence, projected_revenue,
          toolInput.project_id
        ]);
        return { success: true, project: rows[0] };
      }

      case 'set_billing_cadence': {
        if (!['one_time', 'monthly'].includes(toolInput.cadence)) {
          return { success: false, error: 'cadence must be one_time or monthly' };
        }
        const { rows } = await pool.query(
          `UPDATE projects SET billing_cadence=$1 WHERE id=$2 RETURNING id, name, billing_cadence`,
          [toolInput.cadence, toolInput.project_id]
        );
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, project: rows[0] };
      }

      case 'delete_project': {
        // Earlier this case ran two raw DELETEs (billing_batch_items +
        // projects) and called it a day. That works for an isolated leaf
        // project, but FAILS the moment the project is part of a rollup
        // chain or has hours / invoice items / permit docs / permit
        // stages — every one of those tables has a FK back to projects.id
        // and the FK is RESTRICT, not CASCADE, so the DELETE projects
        // statement raises:
        //
        //   "update or delete on table \"projects\" violates foreign key
        //    constraint \"<x>_project_id_fkey\" on table \"<x>\""
        //
        // The catch handler returns that message as { success:false }, the
        // AI sees the error, retries the same delete, fails the same way,
        // and the chat loop (with the Anthropic API call between iterations)
        // racks up serial Anthropic latency until the entire HTTP request
        // exceeds Railway's proxy timeout (~5 min). The user then sees a
        // burst of 502 "Application failed to respond" toasts as the
        // browser retries.
        //
        // The fix: walk the same dependency-deletion path that
        // /api/projects/:id/with-tree does — collect the project subtree,
        // delete dependent rows in order, then projects deepest-first.
        // For a single-leaf delete this collapses to the same behavior
        // as before; for a rollup-with-children it actually succeeds.
        const id = toolInput.project_id;
        if (!id) return { success: false, error: 'project_id required' };
        let tree;
        try {
          tree = await collectProjectTree(id);
        } catch (e) {
          return { success: false, error: 'Failed to walk project tree: ' + e.message };
        }
        if (!tree.length) return { success: false, error: 'Project not found' };
        const allIds = tree.map(p => p.id);
        try {
          await pool.query('DELETE FROM time_entries        WHERE project_id = ANY($1::uuid[])', [allIds]);
          await pool.query('DELETE FROM invoice_items       WHERE project_id = ANY($1::uuid[])', [allIds]);
          try { await pool.query('DELETE FROM permit_documents WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          try { await pool.query('DELETE FROM permit_stages    WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          try { await pool.query('DELETE FROM design_stages    WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          await pool.query('DELETE FROM billing_batch_items WHERE project_id = ANY($1::uuid[])', [allIds]);
          // Delete projects deepest-first so parent_id references stay valid.
          const byDepth = [...tree].sort((a, b) => (b.__depth || 0) - (a.__depth || 0));
          for (const p of byDepth) {
            await pool.query('DELETE FROM projects WHERE id = $1', [p.id]);
          }
        } catch (e) {
          return { success: false, error: e.message };
        }
        const root = tree.find(p => p.id === id);
        return {
          success: true,
          deleted: root ? root.name : id,
          deleted_count: tree.length,
          included_descendants: tree.length - 1,
        };
      }

      case 'bulk_create_projects': {
        // Multi-project tree create with intra-batch parent resolution.
        // Each spec carries a local_id; parent_local_id refs another spec
        // in the same batch. Topological sort orders inserts so every
        // parent exists before its children. Real UUIDs are generated
        // server-side and the local_id → UUID map is returned for the
        // AI to reference in follow-up tool calls.
        const specs = Array.isArray(toolInput.projects) ? toolInput.projects : [];
        if (!specs.length) return { success: false, error: 'projects array required' };

        // Topological sort by parent_local_id
        const byLocal = {};
        for (const s of specs) {
          if (!s.local_id) return { success: false, error: 'every spec needs a local_id' };
          if (byLocal[s.local_id]) return { success: false, error: `duplicate local_id: ${s.local_id}` };
          byLocal[s.local_id] = s;
        }
        const order = [];
        const placed = new Set();
        // Deterministic loop — each pass picks every spec whose parent is
        // already placed (or has no in-batch parent). Bound at specs.length+1
        // passes; if we ever fail to place anything, there's a cycle.
        for (let pass = 0; pass <= specs.length; pass++) {
          let added = 0;
          for (const s of specs) {
            if (placed.has(s.local_id)) continue;
            if (s.parent_local_id && !placed.has(s.parent_local_id)) continue;
            order.push(s); placed.add(s.local_id); added++;
          }
          if (placed.size === specs.length) break;
          if (added === 0) {
            return { success: false, error: 'cycle detected in parent_local_id refs (or unresolved parent_local_id)' };
          }
        }

        const idMap = {};        // local_id → real UUID
        const created = [];
        const failed = [];
        // Parent-inheritance: a spec without an explicit client_id /
        // contract_id / concentrator_id inherits whichever the closest
        // ancestor (via parent_local_id chain) has set. This lets the
        // AI emit much shorter JSON — set those three UUIDs once at
        // the contract level and every nested spec just references
        // parent_local_id. Critical because the non-stream SDK caps
        // max_tokens around 8k and 99 specs × repeated UUIDs blew past
        // that. Inheritance halves token cost per spec.
        const resolveInherit = (spec, field) => {
          if (spec[field] !== undefined && spec[field] !== null && spec[field] !== '') return spec[field];
          let cur = spec.parent_local_id ? byLocal[spec.parent_local_id] : null;
          while (cur) {
            if (cur[field] !== undefined && cur[field] !== null && cur[field] !== '') return cur[field];
            cur = cur.parent_local_id ? byLocal[cur.parent_local_id] : null;
          }
          return null;
        };
        const ALLOWED_PROGRAMS = ['rus', 'bau', 'gfr', 'other'];
        // Cache contract_id → (program, engineering_contract_id) lookups so a
        // tree of 50 specs all pointing at the same contract resolves the EC
        // join exactly once. These are read-only and run against pool (not the
        // tx client) so they're safe to run before BEGIN.
        const contractCache = new Map();  // cid → { program, engineering_contract_id }
        async function contractInfo(cid) {
          if (!cid) return { program: null, engineering_contract_id: null };
          if (contractCache.has(cid)) return contractCache.get(cid);
          const r = await pool.query(
            `SELECT c.engineering_contract_id, ec.program
               FROM contracts c
               LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
              WHERE c.id = $1`, [cid]
          );
          const info = {
            program: r.rows[0]?.program || null,
            engineering_contract_id: r.rows[0]?.engineering_contract_id || null,
          };
          contractCache.set(cid, info);
          return info;
        }
        async function programForContract(cid) {
          return (await contractInfo(cid)).program;
        }

        // Pre-validate all specs (inheritance resolution + program check) before
        // opening the transaction so we never enter BEGIN with known-bad input.
        // contractInfo() reads are safe against pool here since they're read-only.
        const preValidated = [];
        for (const s of order) {
          const clientId = resolveInherit(s, 'client_id');
          const contractId = resolveInherit(s, 'contract_id');
          const concentratorId = resolveInherit(s, 'concentrator_id');
          const workOrderNumber = resolveInherit(s, 'work_order_number');
          if (!clientId) {
            failed.push({ local_id: s.local_id, name: s.name, error: 'no client_id (set on this spec or any ancestor via parent_local_id)' });
            continue;
          }
          let program = resolveInherit(s, 'program');
          let engineeringContractId = resolveInherit(s, 'engineering_contract_id');
          if (program) {
            const v = String(program).trim().toLowerCase();
            if (!ALLOWED_PROGRAMS.includes(v)) {
              failed.push({ local_id: s.local_id, name: s.name, error: `Invalid program "${program}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.` });
              continue;
            }
            program = v;
          }
          if (!program || !engineeringContractId) {
            const info = await contractInfo(contractId);
            if (!program) program = info.program;
            if (!engineeringContractId) engineeringContractId = info.engineering_contract_id;
          }
          preValidated.push({ s, clientId, contractId, concentratorId, workOrderNumber, program, engineeringContractId });
        }

        // If any spec failed validation, bail before touching the DB.
        // Matching the strict all-or-nothing pattern from bulk_delete_projects:
        // a partial batch that would leave an orphaned tree is worse than a
        // clean rollback with a clear error report.
        if (failed.length > 0) {
          return {
            success: false,
            created_count: 0,
            failed_count: failed.length,
            id_map: idMap,
            created,
            failed,
          };
        }

        // All specs passed pre-validation. Now run all INSERTs inside a single
        // transaction so any mid-batch DB failure rolls back the whole batch.
        // Same all-or-nothing guarantee as bulk_delete_projects.
        const txClient = await pool.connect();
        try {
          await txClient.query('BEGIN');

          for (const { s, clientId, contractId, concentratorId, workOrderNumber, program, engineeringContractId } of preValidated) {
            const isSpecRollup = s.is_rollup === true;
            // Rollups are organize-only folders: billing_type, billing_rate,
            // footage, and financials must all be NULL. Mirroring the
            // create_project gate so bulk_create_projects doesn't silently give
            // rollup containers a billing profile.
            const fin = isSpecRollup
              ? { miles: null, expectedHours: null, expectedRevenue: null }
              : calcProjectFinancials(s.project_type, s.billing_rate, s.footage);
            const realParent = s.parent_local_id
              ? idMap[s.parent_local_id]
              : (s.parent_id || null);
            const { rows } = await txClient.query(`
              INSERT INTO projects (
                name, client_id, contract_id, work_order_number,
                project_type, program, status, billing_type, billing_rate,
                footage, miles, expected_hours, expected_revenue,
                start_date, notes, parent_id, concentrator_id,
                is_rollup, billing_cadence, engineering_contract_id
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
              RETURNING id, name`,
              [
                s.name,
                clientId,
                contractId || null,
                workOrderNumber || null,
                // Rollups still get project_type stored (informational only,
                // same as create_project), but billing fields force NULL.
                s.project_type || (isSpecRollup ? 'other' : null),
                program,
                s.status || 'active',
                isSpecRollup ? null : (s.billing_type || 'hourly'),
                isSpecRollup ? null : (s.billing_rate ?? 0),
                isSpecRollup ? null : (s.footage || null),
                fin.miles,
                fin.expectedHours,
                fin.expectedRevenue,
                s.start_date || null,
                s.notes || null,
                realParent,
                concentratorId || null,
                isSpecRollup,
                s.billing_cadence || 'one_time',
                engineeringContractId || null,
              ]
            );
            idMap[s.local_id] = rows[0].id;
            created.push({ local_id: s.local_id, id: rows[0].id, name: rows[0].name });
            // Auto-stage logic: same as create_project. Uses txClient so the
            // permit_stages row is part of the same atomic batch.
            if (s.project_type === 'permitting' && !s.is_rollup) {
              try {
                await txClient.query(
                  'INSERT INTO permit_stages (project_id, stage) VALUES ($1,$2) ON CONFLICT (project_id, stage) DO NOTHING',
                  [rows[0].id, 'potential']
                );
              } catch {}
            }
          }

          await txClient.query('COMMIT');
        } catch (e) {
          try { await txClient.query('ROLLBACK'); } catch {}
          // Whole batch failed — report all specs as failed, clear partial idMap/created.
          return {
            success: false,
            created_count: 0,
            failed_count: preValidated.length,
            id_map: {},
            created: [],
            failed: preValidated.map(({ s }) => ({ local_id: s.local_id, name: s.name, error: e.message })),
          };
        } finally {
          txClient.release();
        }

        return {
          success: failed.length === 0,
          created_count: created.length,
          failed_count: failed.length,
          id_map: idMap,
          created,
          failed,
        };
      }

      case 'bulk_delete_projects': {
        const ids = Array.isArray(toolInput.project_ids) ? toolInput.project_ids : [];
        if (!ids.length) return { success: false, error: 'No project_ids provided' };
        const results = [];
        const deleted = [];
        const failed = [];

        // Collect all subtrees BEFORE opening the transaction so we can report
        // "not found" per-id without aborting the whole operation.
        const subtreeMap = new Map(); // id → subtree rows
        for (const id of ids) {
          try {
            const subtree = await collectProjectTree(id);
            if (!subtree.length) {
              failed.push({ id, error: 'not found' });
              results.push({ id, status: 'not_found' });
            } else {
              subtreeMap.set(id, subtree);
            }
          } catch (e) {
            failed.push({ id, error: 'Failed to walk project tree: ' + e.message });
            results.push({ id, status: 'failed', error: 'Failed to walk project tree: ' + e.message });
          }
        }

        if (subtreeMap.size === 0) {
          return {
            success: failed.length === 0,
            deleted_count: 0,
            failed_count: failed.length,
            results,
            reason: toolInput.reason || null,
          };
        }

        // Flatten all sub-ids across every project to delete so we can run
        // the FK-dependent table DELETEs in one round-trip each inside a
        // single transaction. This is atomic — on any error the whole batch
        // rolls back and no partial state is left.
        const allSubIds = [];
        for (const subtree of subtreeMap.values()) {
          for (const p of subtree) allSubIds.push(p.id);
        }

        const txClient = await pool.connect();
        try {
          await txClient.query('BEGIN');
          await txClient.query('DELETE FROM time_entries        WHERE project_id = ANY($1::uuid[])', [allSubIds]);
          await txClient.query('DELETE FROM invoice_items       WHERE project_id = ANY($1::uuid[])', [allSubIds]);
          try { await txClient.query('DELETE FROM permit_documents WHERE project_id = ANY($1::uuid[])', [allSubIds]); } catch {}
          try { await txClient.query('DELETE FROM permit_stages    WHERE project_id = ANY($1::uuid[])', [allSubIds]); } catch {}
          try { await txClient.query('DELETE FROM design_stages    WHERE project_id = ANY($1::uuid[])', [allSubIds]); } catch {}
          await txClient.query('DELETE FROM billing_batch_items WHERE project_id = ANY($1::uuid[])', [allSubIds]);
          // Delete projects deepest-first across all subtrees so parent_id FKs stay valid.
          const allRows = [];
          for (const subtree of subtreeMap.values()) allRows.push(...subtree);
          const byDepth = [...allRows].sort((a, b) => (b.__depth || 0) - (a.__depth || 0));
          for (const p of byDepth) {
            await txClient.query('DELETE FROM projects WHERE id = $1', [p.id]);
          }
          await txClient.query('COMMIT');

          for (const [id, subtree] of subtreeMap) {
            const root = subtree.find(p => p.id === id);
            deleted.push({ id, name: root ? root.name : id, included_descendants: subtree.length - 1 });
            results.push({ id, status: 'deleted', name: root ? root.name : id, included_descendants: subtree.length - 1 });
          }
        } catch (e) {
          try { await txClient.query('ROLLBACK'); } catch {}
          // The whole batch failed — mark every queued-but-not-yet-deleted id as failed.
          for (const id of subtreeMap.keys()) {
            failed.push({ id, error: e.message });
            results.push({ id, status: 'failed', error: e.message });
          }
        } finally {
          txClient.release();
        }

        return {
          success: failed.length === 0,
          deleted_count: deleted.length,
          failed_count: failed.length,
          results,
          reason: toolInput.reason || null,
        };
      }

      case 'create_client': {
        // Path B: program lives on engineering contracts, not clients.
        const { rows } = await pool.query(
          'INSERT INTO clients (name, notes) VALUES ($1,$2) RETURNING *',
          [toolInput.name, toolInput.notes || null]
        );
        return { success: true, client: rows[0] };
      }

      case 'update_client': {
        // COALESCE pattern so undefined fields don't overwrite existing values
        const { rows } = await pool.query(
          `UPDATE clients SET
            name = COALESCE($2, name),
            notes = CASE WHEN $3::text IS NULL THEN notes ELSE $3 END
          WHERE id = $1 RETURNING *`,
          [
            toolInput.client_id,
            toolInput.name === undefined ? null : toolInput.name,
            toolInput.notes === undefined ? null : toolInput.notes
          ]
        );
        if (!rows[0]) return { success: false, error: 'Client not found' };
        return { success: true, client: rows[0] };
      }

      case 'delete_client': {
        // Confirm we found it first so the AI can give a meaningful response
        const r0 = await pool.query('SELECT name FROM clients WHERE id = $1', [toolInput.client_id]);
        if (!r0.rows[0]) return { success: false, error: 'Client not found' };
        await pool.query('DELETE FROM clients WHERE id = $1', [toolInput.client_id]);
        return { success: true, deleted_name: r0.rows[0].name };
      }

      case 'create_engineering_contract': {
        // Validate program against the same enum the route module enforces.
        // Keeping the list inline rather than importing keeps this executor
        // free of cross-module deps; the migration's CHECK constraint is
        // the ultimate gate either way.
        const ALLOWED = ['rus','bau','gfr','other'];
        let program = null;
        if (toolInput.program !== undefined && toolInput.program !== null && toolInput.program !== '') {
          const v = String(toolInput.program).trim().toLowerCase();
          if (!ALLOWED.includes(v)) {
            return { success: false, error: `Invalid program "${toolInput.program}" — allowed: ${ALLOWED.join(', ')}.` };
          }
          program = v;
        }
        try {
          const { rows } = await pool.query(
            `INSERT INTO engineering_contracts (client_id, name, contract_number, loan_name, notes, program)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
              toolInput.client_id,
              String(toolInput.name || '').trim(),
              toolInput.contract_number || null,
              toolInput.loan_name || null,
              toolInput.notes || null,
              program,
            ]
          );
          return { success: true, engineering_contract: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'An engineering contract with this name already exists for this client' };
          return { success: false, error: e.message };
        }
      }

      case 'update_engineering_contract': {
        const ALLOWED = ['rus','bau','gfr','other'];
        const sets = [];
        const params = [toolInput.engineering_contract_id];
        let i = 2;
        if (toolInput.name !== undefined)            { sets.push(`name = $${i++}`);            params.push(String(toolInput.name).trim()); }
        if (toolInput.contract_number !== undefined) { sets.push(`contract_number = $${i++}`); params.push(toolInput.contract_number || null); }
        if (toolInput.loan_name !== undefined)       { sets.push(`loan_name = $${i++}`);       params.push(toolInput.loan_name || null); }
        if (toolInput.notes !== undefined)           { sets.push(`notes = $${i++}`);           params.push(toolInput.notes || null); }
        if (toolInput.active !== undefined)          { sets.push(`active = $${i++}`);          params.push(!!toolInput.active); }
        if (toolInput.program !== undefined) {
          let program = null;
          if (toolInput.program !== null && toolInput.program !== '') {
            const v = String(toolInput.program).trim().toLowerCase();
            if (!ALLOWED.includes(v)) {
              return { success: false, error: `Invalid program "${toolInput.program}" — allowed: ${ALLOWED.join(', ')}.` };
            }
            program = v;
          }
          sets.push(`program = $${i++}`); params.push(program);
        }
        if (!sets.length) return { success: false, error: 'Nothing to update' };
        try {
          const { rows } = await pool.query(
            `UPDATE engineering_contracts SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
            params
          );
          if (!rows[0]) return { success: false, error: 'Engineering contract not found' };
          return { success: true, engineering_contract: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'An engineering contract with this name already exists for this client' };
          return { success: false, error: e.message };
        }
      }

      case 'create_staff': {
        const { rows } = await pool.query(
          'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *',
          [toolInput.name]
        );
        return { success: true, staff: rows[0] };
      }

      case 'create_contract': {
        const { rows } = await pool.query(
          'INSERT INTO contracts (client_id, contract_number, name) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.client_id, toolInput.contract_number, toolInput.name || null]
        );
        return { success: true, contract: rows[0] };
      }

      case 'log_time_entries': {
        const importBatch = `ai_import_${Date.now()}`;
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          let count = 0;
          for (const e of toolInput.entries) {
            await client.query(
              'INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch) VALUES ($1,$2,$3,$4,$5,$6)',
              [e.project_id, e.staff_id || null, e.entry_date, e.hours, e.job_title || null, importBatch]
            );
            count++;
          }
          // Update actual_hours with hierarchy rollup
          const projectIds = [...new Set(toolInput.entries.map(e => e.project_id))];
          await client.query('COMMIT');
          for (const pid of projectIds) {
            await updateProjectHours(pid);
          }
          return { success: true, inserted: count, batch: importBatch };
        } catch (err) {
          await client.query('ROLLBACK');
          return { success: false, error: 'Bulk insert failed and was rolled back: ' + err.message };
        } finally {
          client.release();
        }
      }

      case 'update_project_status': {
        let query, params;
        if (toolInput.status === 'billed') {
          query = `UPDATE projects SET status='billed', billed_date=NOW() WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else if (toolInput.status === 'completed') {
          query = `UPDATE projects SET status='completed', completed_date=COALESCE(completed_date, NOW()) WHERE id=$1 RETURNING name, status`;
          params = [toolInput.project_id];
        } else {
          query = `UPDATE projects SET status=$1 WHERE id=$2 RETURNING name, status`;
          params = [toolInput.status, toolInput.project_id];
        }
        const { rows } = await pool.query(query, params);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, project: rows[0] };
      }

      case 'advance_permit_stage': {
        // Guard: only permitting projects have a permit-stage pipeline.
        // Advancing a non-permitting project was a silent no-op before (no
        // permit_stages row exists so the UPDATE touches zero rows and the
        // INSERT does nothing). Now we surface a clear error so the AI
        // self-corrects instead of silently succeeding.
        const { rows: projRows } = await pool.query(
          'SELECT project_type FROM projects WHERE id = $1',
          [toolInput.project_id]
        );
        if (!projRows.length) return { success: false, error: 'Project not found' };
        if (projRows[0].project_type !== 'permitting') {
          return {
            success: false,
            error: `Project is type "${projRows[0].project_type}", not "permitting". advance_permit_stage only works on permitting projects.`,
          };
        }
        const STAGES = ['potential','started','submitted','approved','checklist','billed'];
        const { rows: current } = await pool.query(
          'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
          [toolInput.project_id]
        );
        const currentStage = current[0]?.stage || 'potential';
        const nextIdx = STAGES.indexOf(currentStage) + 1;
        if (nextIdx >= STAGES.length) return { success: false, message: 'Already at final stage' };
        const nextStage = STAGES[nextIdx];
        // Record the actor from req.user so the audit trail shows the real
        // admin name, not an AI-supplied string that could be anything.
        const actorName = actor.username || toolInput.updated_by || 'AI';
        await pool.query(
          'UPDATE permit_stages SET completed_at=NOW(), updated_by=$1, notes=$2 WHERE project_id=$3 AND stage=$4',
          [actorName, toolInput.notes || null, toolInput.project_id, currentStage]
        );
        await pool.query(
          'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
          [toolInput.project_id, nextStage, actorName]
        );
        return { success: true, previous: currentStage, current: nextStage };
      }

      case 'query_database': {
        // Safety in depth:
        //   1. Disallow multi-statement strings (semicolons inside the body) —
        //      these can sneak DML past keyword regex via `SELECT 1; DELETE …`.
        //   2. Require the first keyword to be SELECT or WITH.
        //   3. Run inside a READ ONLY transaction so even writable CTEs
        //      (`WITH x AS (DELETE … RETURNING *) SELECT …`) get rejected by
        //      Postgres itself, not just by our regex.
        //   4. Cap result set to 100 rows.
        const sqlClean = toolInput.sql.trim().replace(/;+\s*$/, '');
        if (sqlClean.includes(';')) {
          return { success: false, error: 'Multiple statements are not allowed. Submit one SELECT at a time.' };
        }
        const firstWord = sqlClean.split(/\s+/)[0].toUpperCase();
        if (firstWord !== 'SELECT' && firstWord !== 'WITH') {
          return { success: false, error: 'Only SELECT/WITH queries are allowed. Use the specific action tools for modifications.' };
        }
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query('SET TRANSACTION READ ONLY');
          const { rows } = await client.query(sqlClean);
          await client.query('COMMIT');
          return { success: true, row_count: rows.length, rows: rows.slice(0, 100) };
        } catch (e) {
          try { await client.query('ROLLBACK'); } catch {}
          // Postgres returns a clear error if the read-only transaction caught
          // a write attempt; surface it to the AI for self-correction.
          return { success: false, error: 'Query failed: ' + e.message };
        } finally {
          client.release();
        }
      }

      case 'create_budget': {
        const { rows } = await pool.query(
          `INSERT INTO budgets (project_id, name, notes) VALUES ($1,$2,$3) RETURNING *`,
          [toolInput.project_id, toolInput.name, toolInput.notes || null]
        );
        return { success: true, budget: rows[0] };
      }

      case 'create_budget_code': {
        const { rows } = await pool.query(
          `INSERT INTO budget_codes (budget_id, code, description, allocated_amount) VALUES ($1,$2,$3,$4) RETURNING *`,
          [toolInput.budget_id, toolInput.code, toolInput.description || null, toolInput.allocated_amount || 0]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [toolInput.budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'update_budget_code': {
        const { rows: existing } = await pool.query('SELECT * FROM budget_codes WHERE id=$1', [toolInput.budget_code_id]);
        if (!existing.length) return { success: false, error: 'Budget code not found' };
        const bc = existing[0];
        const code = toolInput.code ?? bc.code;
        const description = toolInput.description !== undefined ? toolInput.description : bc.description;
        const allocated_amount = toolInput.allocated_amount ?? bc.allocated_amount;
        const { rows } = await pool.query(
          `UPDATE budget_codes SET code=$1, description=$2, allocated_amount=$3 WHERE id=$4 RETURNING *`,
          [code, description, allocated_amount, toolInput.budget_code_id]
        );
        // Recalculate budget total
        await pool.query(
          `UPDATE budgets SET total_amount = (SELECT COALESCE(SUM(allocated_amount),0) FROM budget_codes WHERE budget_id=$1) WHERE id=$1`,
          [rows[0].budget_id]
        );
        return { success: true, budget_code: rows[0] };
      }

      case 'get_upload_data': {
        const data = uploadStore.get(toolInput.upload_id);
        if (!data) return { success: false, error: 'Upload expired or not found. Ask the user to re-upload.' };
        // Ownership check: reject cross-user upload access (Item 6).
        if (data.owner_id && actor && actor.id && String(data.owner_id) !== String(actor.id)) {
          return { success: false, error: 'Upload not found for this user. Ask the user to re-upload.' };
        }
        if (data.raw_text) return { success: true, raw_text: data.raw_text, row_count: 0 };

        const offset = toolInput.offset || 0;
        const limit = Math.min(toolInput.limit || 50, 100);
        const slice = data.rows.slice(offset, offset + limit);

        return {
          success: true,
          filename: data.filename,
          headers: data.headers,
          total_rows: data.rows.length,
          offset,
          returned: slice.length,
          has_more: offset + limit < data.rows.length,
          rows: slice
        };
      }

      case 'csv_smart_import': {
        // Wraps the existing csv-validate + csv-commit flow into a single call
        // for the AI. We rebuild the staged data from the upload store, run
        // the same matching logic the manual UI uses, then commit.
        const upload = uploadStore.get(toolInput.upload_id);
        if (!upload) return { success: false, error: 'Upload expired or not found. Ask the user to re-upload.' };
        // Ownership check: reject cross-user upload access (Item 6).
        if (upload.owner_id && actor && actor.id && String(upload.owner_id) !== String(actor.id)) {
          return { success: false, error: 'Upload not found for this user. Ask the user to re-upload.' };
        }
        if (!upload.rows || !upload.rows.length) {
          return { success: false, error: 'No rows in the upload. The file may be empty or unreadable.' };
        }

        try {
          // Re-detect columns from the headers using the same logic csv-validate uses.
          // We construct a minimal 2D array (header row + data rows) so detectColumns
          // and the matching code can operate on the same shape.
          const cols = detectColumns(upload.headers || []);
          const missing = [];
          if (!cols.name) missing.push('name/employee/inspector');
          if (!cols.date) missing.push('date');
          if (!cols.wo) missing.push('work_order');
          if (!cols.hours) missing.push('hours');
          if (missing.length) {
            return {
              success: false,
              error: 'Missing required columns: ' + missing.join(', '),
              detected_columns: cols,
              headers: upload.headers
            };
          }

          // Look up reference data
          const [staffR, projR, pricingR] = await Promise.all([
            pool.query('SELECT id, name FROM staff'),
            pool.query(`
              SELECT p.id, p.name, p.work_order_number, p.job_id, p.parent_id,
                     j.name as job_name,
                     EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id) AS has_children
              FROM projects p
              LEFT JOIN jobs j ON j.id = p.job_id
              WHERE p.work_order_number IS NOT NULL AND p.work_order_number != ''
            `),
            pool.query(`SELECT pe.billing_code, j.name as job_name
                        FROM pricing_entries pe LEFT JOIN jobs j ON j.id = pe.job_id
                        WHERE pe.billing_code IS NOT NULL`)
          ]);
          const staffByNorm = {};
          staffR.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s; });
          const projsByNorm = {};
          projR.rows.forEach(p => {
            const k = normalizeWO(p.work_order_number);
            (projsByNorm[k] = projsByNorm[k] || []).push(p);
          });
          const jobByCode = {};
          pricingR.rows.forEach(pe => {
            if (pe.billing_code && pe.job_name) jobByCode[String(pe.billing_code).trim().toLowerCase()] = pe.job_name;
          });

          function pickProject(woNorm, billingCodeJobName) {
            const candidates = projsByNorm[woNorm];
            if (!candidates || !candidates.length) return null;
            const leaves = candidates.filter(c => !c.has_children);
            const pickFrom = leaves.length ? leaves : candidates;
            if (billingCodeJobName) {
              const wantLc = billingCodeJobName.toLowerCase();
              const jobMatch = pickFrom.find(c => c.job_name && c.job_name.toLowerCase() === wantLc);
              if (jobMatch) return jobMatch;
            }
            return pickFrom[0];
          }

          // Walk the upload rows
          const today = new Date(); today.setHours(0,0,0,0);
          const past18 = new Date(today); past18.setMonth(past18.getMonth() - 18);
          const validRows = [];
          const unknownStaff = new Map();
          const unknownWOs = new Map();
          const invalidRows = [];

          upload.rows.forEach((r, i) => {
            const rowNum = i + 2;
            const rawName = r[cols.name];
            const rawDate = r[cols.date];
            const rawWO   = r[cols.wo];
            const rawHrs  = r[cols.hours];
            const rawTitle = cols.job_title ? r[cols.job_title] : null;

            const allBlank = !String(rawName ?? '').trim() && !String(rawWO ?? '').trim() && !String(rawHrs ?? '').trim();
            if (allBlank) return;

            const issues = [];
            const name = (rawName || '').toString().trim();
            const date = parseDateCell(rawDate);
            const woNorm = normalizeWO(rawWO);
            const hrs = parseFloat(rawHrs);

            if (!name) issues.push('missing name');
            if (!date) issues.push('invalid date');
            else {
              const d = new Date(date + 'T00:00:00');
              if (d > today) issues.push('date in future');
              else if (d < past18) issues.push('date > 18 months ago');
            }
            if (!woNorm) issues.push('missing work order');
            if (isNaN(hrs) || hrs <= 0) issues.push('invalid hours');
            if (hrs > 24) issues.push('hours > 24');

            if (issues.length) {
              invalidRows.push({ row_num: rowNum, raw: { name: rawName, date: rawDate, wo: rawWO, hours: rawHrs }, issues });
              return;
            }

            const staff = staffByNorm[normalizeName(name)];
            const rawCode = cols.billing_code ? String(r[cols.billing_code] ?? '').trim() : null;
            const codeLookup = rawCode ? jobByCode[rawCode.toLowerCase()] : null;
            const proj = pickProject(woNorm, codeLookup);

            if (!staff) unknownStaff.set(normalizeName(name), name);
            if (!proj)  unknownWOs.set(woNorm, String(rawWO).trim());

            validRows.push({
              row_num: rowNum,
              name, name_norm: normalizeName(name),
              wo: String(rawWO).trim(), wo_norm: woNorm,
              date, hours: hrs,
              job_title: rawTitle ? String(rawTitle).trim() : (toolInput.apply_job_title || null),
              billing_code: rawCode || null,
              staff_id: staff?.id || null,
              project_id: proj?.id || null,
              staff_known: !!staff,
              wo_known: !!proj,
              already_billed_period: false
            });
          });

          // Build the commit payload based on the AI's choices
          const create_staff = toolInput.auto_create_unknown_staff !== false
            ? [...unknownStaff.values()]
            : [];
          const create_projects = (toolInput.auto_create_unknown_wos === true && toolInput.default_client_id)
            ? [...unknownWOs.entries()].map(([norm, wo]) => ({
                wo, name: `WO ${wo}`, client_id: toolInput.default_client_id
              }))
            : [];

          // Stage and commit by inlining the same logic as the manual modal:
          const stage_id = `ai_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          csvStage.set(stage_id, { validRows, expiresAt: Date.now() + CSV_STAGE_TTL_MS });

          // Now invoke the same commit handler programmatically. We can't call
          // it directly (it's an HTTP handler), so we mimic its body in-line.
          // Simpler: just return a summary + the stage_id and let the AI tell
          // the user to confirm in the UI. This avoids duplicating commit
          // logic and keeps human-in-the-loop for the actual write.
          return {
            success: true,
            stage_id,
            summary: {
              total_valid: validRows.length,
              ready_to_import: validRows.filter(r => r.staff_known && r.wo_known).length,
              unknown_staff: [...unknownStaff.values()],
              unknown_wos: [...unknownWOs.values()],
              invalid_count: invalidRows.length,
              invalid_examples: invalidRows.slice(0, 5)
            },
            recommended_actions: {
              auto_create_staff: create_staff,
              auto_create_projects: create_projects
            },
            note: 'A human should review this in the Hours → Import modal before final commit. The stage_id is valid for 30 minutes.'
          };
        } catch (e) {
          return { success: false, error: 'CSV processing failed: ' + e.message };
        }
      }

      // ─── EXPANDED TOOLS ─────────────────────────────────────────────
      // create_engineering_contract / update_engineering_contract executors
      // are defined earlier in this switch (with program-field support). The
      // legacy duplicate was removed in the Path B refactor.

      case 'update_contract_umbrella': {
        const { contract_id, engineering_contract_id } = toolInput;
        if (!contract_id) return { success: false, error: 'contract_id required' };
        const { rows } = await pool.query(
          `UPDATE contracts SET engineering_contract_id = $1 WHERE id = $2 RETURNING *`,
          [engineering_contract_id || null, contract_id]
        );
        if (!rows[0]) return { success: false, error: 'Contract not found' };
        return { success: true, contract: rows[0] };
      }

      case 'bulk_update_projects': {
        const { filter, patch } = toolInput;
        if (!filter || !patch) return { success: false, error: 'filter and patch both required' };

        // Build WHERE — only allow known filter keys, parameterize values
        const ALLOWED_FILTER = new Set(['client_id', 'contract_id', 'engineering_contract_id', 'status', 'project_type', 'program']);
        const where = [];
        const params = [];
        let i = 1;
        for (const [k, v] of Object.entries(filter)) {
          if (!ALLOWED_FILTER.has(k)) continue;
          if (k === 'engineering_contract_id') {
            // No direct column on projects; resolve via contracts
            where.push(`contract_id IN (SELECT id FROM contracts WHERE engineering_contract_id = $${i++})`);
            params.push(v);
          } else {
            where.push(`${k} = $${i++}`); params.push(v);
          }
        }
        if (!where.length) return { success: false, error: 'At least one filter key required' };

        // Build SET — only allow known patch keys
        const ALLOWED_PATCH = new Set(['status', 'billing_cadence', 'notes', 'billing_rate', 'contract_id', 'parent_id', 'program']);
        const ALLOWED_PROGRAMS_BU = ['rus', 'bau', 'gfr', 'other'];
        const sets = [];
        for (const [k, v] of Object.entries(patch)) {
          if (!ALLOWED_PATCH.has(k)) continue;
          // Validate program against the enum so the DB CHECK doesn't 23514.
          if (k === 'program' && v !== null && v !== undefined && v !== '') {
            const pv = String(v).trim().toLowerCase();
            if (!ALLOWED_PROGRAMS_BU.includes(pv)) {
              return { success: false, error: `Invalid program "${v}" — allowed: ${ALLOWED_PROGRAMS_BU.join(', ')}.` };
            }
            sets.push(`${k} = $${i++}`); params.push(pv);
            continue;
          }
          sets.push(`${k} = $${i++}`); params.push(v);
        }
        if (!sets.length) return { success: false, error: 'At least one patch field required' };
        sets.push(`updated_at = NOW()`);

        const sql = `UPDATE projects SET ${sets.join(', ')} WHERE ${where.join(' AND ')} RETURNING id`;
        const { rows } = await pool.query(sql, params);
        return { success: true, updated_count: rows.length, ids: rows.map(r => r.id) };
      }

      case 'write_sql': {
        // Arbitrary write SQL — gated by approval (the chat handler stages
        // this tool before executing). We still enforce single-statement
        // here as a defense-in-depth measure: even with admin approval, a
        // multi-statement string that includes a stray DROP slipped past
        // the human reviewer's eye should fail closed.
        const sql = String(toolInput.sql || '').trim().replace(/;+\s*$/, '');
        const params = Array.isArray(toolInput.params) ? toolInput.params : [];
        if (!sql) return { success: false, error: 'sql required' };
        if (sql.includes(';')) return { success: false, error: 'Multiple statements not allowed in a single write_sql call.' };
        // Item 11 fix: block DDL operations (DROP, TRUNCATE, ALTER TABLE,
        // CREATE TABLE, CREATE INDEX, DROP INDEX) even with admin approval.
        // The AI tool is intended for data migrations only — schema changes
        // must go through the normal migration pipeline, not the AI chat.
        // This guards against prompt-injection attacks that craft AI output
        // to execute destructive DDL through the approval card.
        // Wave 1.1 fix: strip leading SQL comments and whitespace before
        // the DDL test, otherwise `/* anything */ DROP TABLE users` slips
        // past the `^\s*` anchor and runs after admin approval.
        // Strip /* block */ and -- line comments at the start, repeatedly.
        let probe = sql;
        for (let i = 0; i < 10; i++) {
          const before = probe;
          probe = probe.replace(/^\s+/, '');
          probe = probe.replace(/^\/\*[\s\S]*?\*\//, '');
          probe = probe.replace(/^--[^\n]*\n?/, '');
          if (probe === before) break;
        }
        // Wave 1.1 fix: PostgreSQL accepts `TRUNCATE tbl` without the
        // `TABLE` keyword, so the original `truncate\s+table` regex missed
        // `TRUNCATE time_entries`. Use `truncate\b` to catch both forms.
        const ddlPattern = /^(drop\s+(table|database|schema|index|sequence|view|function|trigger)|truncate\b|alter\s+table|create\s+(table|index|sequence|schema|view|function|trigger)|grant\b|revoke\b|copy\s+\w+\s+(to|from))/i;
        if (ddlPattern.test(probe)) {
          return { success: false, error: 'DDL/privileged operations (DROP, TRUNCATE, ALTER TABLE, CREATE TABLE/INDEX, GRANT, REVOKE, COPY) are not permitted via write_sql. Use the migration pipeline for schema changes.' };
        }
        // Block bare DELETE FROM on high-value tables that have route-level
        // pre-checks (referential integrity, budget cascade, batch SET NULL).
        // Bypassing those checks via AI SQL can silently destroy billing history.
        // Use the dedicated endpoints instead: DELETE /api/engineering-contracts/:id,
        // DELETE /api/clients/:id, etc.
        const highRiskDeletePattern = /^delete\s+from\s+(engineering_contracts|users|clients|contracts)\b/i;
        if (highRiskDeletePattern.test(probe)) {
          return { success: false, error: 'Direct DELETE on engineering_contracts, users, clients, or contracts is blocked via write_sql. These tables have route-level pre-checks (budget cascades, billing batch references, auth log entries) that must not be bypassed. Use the dedicated admin endpoints instead.' };
        }
        try {
          const result = await pool.query(sql, params);
          return {
            success: true,
            command: result.command,
            row_count: result.rowCount,
            // Return up to 100 rows for the AI to confirm what changed
            rows: (result.rows || []).slice(0, 100),
          };
        } catch (e) { return { success: false, error: e.message }; }
      }

      case 'create_user': {
        const bcrypt = require('bcryptjs');
        const { username, password, role, full_name, email, staff_id, extra_teams } = toolInput;
        if (!username || !password || !role) return { success: false, error: 'username, password, role required' };
        if (password.length < 10) return { success: false, error: 'Password must be at least 10 characters' };
        const VALID_ROLES = ['admin', 'design_manager', 'permitting_manager', 'design_engineer', 'permitting_engineer'];
        if (!VALID_ROLES.includes(role)) return { success: false, error: 'Invalid role' };
        const team = role.startsWith('design_') ? 'design'
                   : role.startsWith('permitting_') ? 'permitting'
                   : role.startsWith('construction_') ? 'construction'
                   : role.startsWith('inspection_') ? 'construction'  // legacy alias
                   : null;
        const cleanExtras = Array.isArray(extra_teams)
          ? extra_teams.filter(t => ['design','permitting','construction','inspection'].includes(t))
                       .map(t => t === 'inspection' ? 'construction' : t)
          : [];
        try {
          const hash = await bcrypt.hash(password, 12);
          const { rows } = await pool.query(
            `INSERT INTO users (username, password_hash, role, team, full_name, email, extra_teams, staff_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING id, username, role, team, full_name, email, staff_id, extra_teams, active, created_at`,
            [String(username).trim(), hash, role, team, full_name || null, email || null, cleanExtras, staff_id || null]
          );
          return { success: true, user: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'Username already taken' };
          return { success: false, error: e.message };
        }
      }

      case 'deactivate_user': {
        const { user_id } = toolInput;
        if (!user_id) return { success: false, error: 'user_id required' };
        const { rows } = await pool.query(
          `UPDATE users SET active = FALSE, tokens_invalid_after = NOW(), updated_at = NOW()
           WHERE id = $1 RETURNING id, username, active`,
          [user_id]
        );
        if (!rows[0]) return { success: false, error: 'User not found' };
        return { success: true, user: rows[0] };
      }

      default:
        return { success: false, error: 'Unknown tool: ' + toolName };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── AI APPROVAL GATE ─────────────────────────────────────────────────────
// The set of tool names that REQUIRE explicit admin approval before they
// run. Read-only tools (query_database, get_upload_data) execute
// immediately; everything that mutates state pauses the chat loop, returns
// a "preview" payload to the frontend, and waits for the admin to click
// Apply on each proposed action.
const DESTRUCTIVE_AI_TOOLS = new Set([
  'create_project', 'bulk_create_projects', 'update_project', 'delete_project', 'bulk_delete_projects', 'update_project_status',
  'log_time_entries',
  'create_client', 'update_client', 'delete_client',
  'create_staff', 'create_contract', 'update_contract_umbrella',
  'create_budget', 'create_budget_code', 'update_budget_code',
  'set_billing_cadence',
  'advance_permit_stage',
  'csv_smart_import',
  // update_engineering_contract was missing — the AI could mutate EC fields
  // (name, program, active) without triggering an approval card. Gated now
  // alongside create_engineering_contract per PROJECT_NORTH_STAR §7.
  'create_engineering_contract', 'update_engineering_contract',
  'bulk_update_projects',
  'write_sql',
  'create_user', 'deactivate_user',
]);

// In-process pending-approval store. Each entry holds the conversation
// state needed to resume the chat after the user approves/rejects the
// staged actions. Single-instance only — for multi-instance deploys this
// would need to move to Postgres.
const _pendingApprovals = new Map();
const APPROVAL_TTL_MS = 15 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _pendingApprovals) {
    if (v.expires_at < now) _pendingApprovals.delete(k);
  }
}, 5 * 60 * 1000).unref();

// Build a one-line human summary of a tool call so the approval UI doesn't
// have to render raw JSON. The chat frontend can still show the full input
// on demand.
function summarizeToolCall(toolName, toolInput) {
  const i = toolInput || {};
  switch (toolName) {
    case 'create_project':            return `Create project "${i.name}"`;
    case 'bulk_create_projects':      return `BULK CREATE ${(i.projects || []).length} project${(i.projects || []).length === 1 ? '' : 's'} (tree)`;
    case 'update_project':            return `Update project ${i.project_id}`;
    case 'delete_project':            return `Delete project ${i.project_id}`;
    case 'bulk_delete_projects':      return `BULK DELETE ${(i.project_ids || []).length} project${(i.project_ids || []).length === 1 ? '' : 's'}${i.reason ? ` — ${i.reason}` : ''}`;
    case 'update_project_status':     return `Set project ${i.project_id} status → "${i.status}"`;
    case 'log_time_entries':          return `Log ${(i.entries || []).length} time entries`;
    case 'create_client':             return `Create client "${i.name}"`;
    case 'update_client':             return `Update client ${i.client_id}`;
    case 'delete_client':             return `Delete client ${i.client_id}`;
    case 'create_staff':              return `Create staff "${i.name}"`;
    case 'create_contract':           return `Create contract "${i.contract_number}" for client ${i.client_id}`;
    case 'update_contract_umbrella':  return `Move contract ${i.contract_id} → engineering_contract ${i.engineering_contract_id || '(detach)'}`;
    case 'create_budget':             return `Create budget "${i.name}" on project ${i.project_id}`;
    case 'create_budget_code':        return `Add code "${i.code}" ($${i.allocated_amount || 0}) to budget ${i.budget_id}`;
    case 'update_budget_code':        return `Update budget code ${i.budget_code_id}`;
    case 'set_billing_cadence':       return `Set billing cadence on project ${i.project_id} → "${i.cadence}"`;
    case 'advance_permit_stage':      return `Advance permit stage on project ${i.project_id}`;
    case 'csv_smart_import':          return `Smart-import CSV upload ${i.upload_id}`;
    case 'create_engineering_contract': return `Create engineering contract "${i.name}"${i.program ? ` (program: ${i.program})` : ''}`;
    case 'update_engineering_contract': return `Update engineering contract ${i.engineering_contract_id}${i.program !== undefined ? ` (program → ${i.program || 'NULL'})` : ''}`;
    case 'bulk_update_projects':      return `BULK update projects matching ${JSON.stringify(i.filter)} → ${JSON.stringify(i.patch)}`;
    case 'write_sql':                 return `EXECUTE SQL: ${String(i.sql || '').slice(0, 200)}${(i.sql || '').length > 200 ? '…' : ''}`;
    case 'create_user':               return `Create user "${i.username}" with role ${i.role}`;
    case 'deactivate_user':           return `Deactivate user ${i.user_id}`;
    default:                          return toolName;
  }
}

// ─── FILE UPLOAD FOR AI ──────────────────────────────────────────────────────
// ─── IN-MEMORY UPLOAD STORE ──────────────────────────────────────────────────
const uploadStore = new Map(); // uploadId → { rows, headers, filename, timestamp }
// Clean up old uploads every 30 minutes. .unref() so the timer doesn't
// hold the event loop alive in tests — without it, pool.end() + server.close()
// drain successfully but the process never exits, and node:test fires
// per-test 180s timeouts on every file.
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [id, data] of uploadStore) {
    if (data.timestamp < cutoff) uploadStore.delete(id);
  }
}, 5 * 60 * 1000).unref();

app.post('/api/ai/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];
    let headers = [];

    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        // raw:false + dateNF forces date-formatted cells into a YYYY-MM-DD string
        // so the AI sees unambiguous dates instead of Excel serial numbers
        // or short-year strings like "3/15/26".
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        if (jsonData.length > 0 && rows.length === 0) {
          rows = jsonData;
          headers = Object.keys(jsonData[0] || {});
        }
      }

    } else if (ext === '.csv' || ext === '.tsv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const workbook = XLSX.read(content, { type: 'string' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
      headers = Object.keys(rows[0] || {});

    } else {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const uploadId = uuidv4();
      // Bind upload to the uploading user so get_upload_data / csv_smart_import
      // reject cross-user access (Item 6 — uploadStore user binding).
      uploadStore.set(uploadId, { raw_text: content.substring(0, 50000), filename: req.file.originalname, timestamp: Date.now(), owner_id: req.user && String(req.user.id) });
      fs.promises.unlink(req.file.path).catch(() => {});
      return res.json({ success: true, upload_id: uploadId, filename: req.file.originalname, raw_text: content.substring(0, 2000) });
    }

    // Store full data server-side, send only summary to client
    const uploadId = uuidv4();
    // Bind upload to the uploading user (Item 6 — uploadStore user binding).
    uploadStore.set(uploadId, { rows, headers, filename: req.file.originalname, timestamp: Date.now(), owner_id: req.user && String(req.user.id) });

    fs.promises.unlink(req.file.path).catch(() => {});

    res.json({
      success: true,
      upload_id: uploadId,
      filename: req.file.originalname,
      headers,
      row_count: rows.length,
      preview: rows.slice(0, 5) // Only 5 sample rows sent to client
    });

  } catch (e) {
    console.error('File parse error:', e.message);
    // Unlink the temp file so multer write errors don't leak orphan files.
    if (req.file && req.file.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: 'Failed to parse file: ' + e.message });
  }
});

// AI fetches rows in batches from stored upload
app.get('/api/ai/upload/:id', requireAdmin, async (req, res) => {
  const data = uploadStore.get(req.params.id);
  if (!data) return res.status(404).json({ error: 'Upload expired or not found' });
  // Ownership check: only the user who uploaded the file may fetch it.
  if (data.owner_id && req.user && String(data.owner_id) !== String(req.user.id)) {
    return res.status(403).json({ error: 'This upload belongs to a different user.' });
  }
  if (data.raw_text) return res.json({ rows: [], raw_text: data.raw_text, row_count: 0 });

  const offset = parseInt(req.query.offset) || 0;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 rows per batch
  const slice = data.rows.slice(offset, offset + limit);

  res.json({
    filename: data.filename,
    headers: data.headers,
    total_rows: data.rows.length,
    offset,
    limit,
    returned: slice.length,
    has_more: offset + limit < data.rows.length,
    rows: slice
  });
});

// ─── AI CHAT ENDPOINT ────────────────────────────────────────────────────────
//
// Two entry shapes:
//   1. Initial chat: body = { messages, session_id }
//   2. Resume from approval: body = { approval_id, decisions: { tool_use_id: bool } }
//
// Both end up running the same loop. When Claude proposes any DESTRUCTIVE
// tool, the loop pauses, stages the proposed actions in _pendingApprovals,
// and returns a "pending_approval" response. The frontend renders the
// proposed actions, the admin approves/rejects each one, and posts the
// decisions back via the same endpoint with approval_id. Approved actions
// run, rejected ones come back as "user declined" tool_results, and the
// loop continues (which may produce more text, more tool calls, or another
// approval round).
app.post('/api/ai/chat', requireAdmin, async (req, res) => {
  // Early guard: without an API key, every Anthropic SDK call below will
  // throw with a less-obvious error. Return a clean 503 so the admin
  // knows exactly what's missing instead of seeing a generic stack trace.
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: 'AI is unavailable: ANTHROPIC_API_KEY is not set. Add it in Railway → Variables and redeploy.',
    });
  }

  const { messages, session_id, approval_id, decisions } = req.body || {};

  let conversationMessages;
  let systemBlocks;
  let cachedTools;
  let toolResults = [];
  let finalText = '';

  try {
    if (approval_id) {
      // ── Resume path ─────────────────────────────────────────────────
      const pending = _pendingApprovals.get(approval_id);
      if (!pending) return res.status(404).json({ error: 'Approval expired or not found. Resend your message.' });
      // Item 12 fix: verify that the user submitting the decision is the
      // same user who initiated the request. Prevents a second admin from
      // approving or rejecting another admin's staged AI actions.
      if (pending.user_id && req.user && String(pending.user_id) !== String(req.user.id)) {
        return res.status(403).json({ error: 'This approval was initiated by a different user.' });
      }
      _pendingApprovals.delete(approval_id);

      systemBlocks = pending.systemBlocks;
      cachedTools = pending.cachedTools;
      conversationMessages = pending.conversationMessages;  // up to and including the assistant tool_use turn
      toolResults = pending.toolResults || [];
      finalText = pending.finalText || '';

      // Build tool_results for the staged tool_use blocks based on user
      // decisions. Approved → execute; rejected → synthesize "declined".
      const stagedToolUses = pending.stagedToolUses;
      const decisionsMap = decisions || {};
      const toolResultContents = [];
      // Bind actor to the user approving the actions so audit trails in
      // mutating tools (advance_permit_stage, log_time_entries, etc.)
      // record the real admin identity instead of a hardcoded 'AI' string.
      const reqActor = {
        id: req.user?.id,
        username: req.user?.username || req.user?.full_name,
        staff_id: req.user?.staff_id,
      };
      for (const tu of stagedToolUses) {
        const approved = !!decisionsMap[tu.id];
        let result;
        if (approved) {
          console.log(`AI APPROVED tool: ${tu.name}`, JSON.stringify(tu.input).substring(0, 200));
          result = await executeTool(tu.name, tu.input, reqActor);
        } else {
          result = { success: false, error: 'User declined this action.', user_declined: true };
        }
        toolResults.push({ tool: tu.name, input: tu.input, result, was_approved: approved });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        });
      }
      conversationMessages.push({ role: 'user', content: toolResultContents });
    } else {
      // ── Initial path ────────────────────────────────────────────────
      if (!messages || !messages.length) return res.status(400).json({ error: 'No messages' });

      const ctx = await getDBContext();
      ctx._today = new Date().toISOString().split('T')[0];
      const [staticPromptPart] = SYSTEM_PROMPT.split('{CONTEXT}');
      systemBlocks = [
        { type: 'text', text: staticPromptPart, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: JSON.stringify(ctx, null, 2), cache_control: { type: 'ephemeral' } },
      ];
      cachedTools = AI_TOOLS.map((t, i) =>
        i === AI_TOOLS.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t
      );
      // Wrap user-role text content in injection markers so a prompt-injection
      // payload embedded in user input cannot masquerade as system instructions
      // when echoed back in subsequent conversation turns (Item 5).
      conversationMessages = messages.map(m => {
        if (m.role !== 'user') return { role: m.role, content: m.content };
        if (typeof m.content === 'string') {
          return { role: 'user', content: `[user-supplied]${m.content}[/user-supplied]` };
        }
        if (Array.isArray(m.content)) {
          return {
            role: 'user',
            content: m.content.map(block => {
              if (block && block.type === 'text' && typeof block.text === 'string') {
                return { ...block, text: `[user-supplied]${block.text}[/user-supplied]` };
              }
              return block;
            }),
          };
        }
        return { role: m.role, content: m.content };
      });
    }

    // ── Main loop ─────────────────────────────────────────────────────
    // tool_choice='any' forces Claude to call a tool. We use it when the
    // user clearly wants an action (otherwise the model can silently
    // skip the tool_use and just reply with text). Destructive tools
    // still gate through the approval card. Resume path stays on 'auto'
    // because the model needs room to finalize with text after a tool
    // already ran.
    // NOTE: userWantsAction is evaluated against the original messages
    // (pre-injection-markers) so the [user-supplied]...[/user-supplied]
    // wrappers don't break the regex anchors that start with "^(yes|...".
    const initialToolChoice = approval_id
      ? { type: 'auto' }
      : userWantsAction(messages || [])
        ? { type: 'any' }
        : { type: 'auto' };
    // max_tokens=8192 — Anthropic SDK refuses non-streaming requests
    // with max_tokens high enough to potentially run >10 min (it
    // returns "Streaming is strongly recommended for operations that
    // may take longer than 10 minutes" as a 500). 32k crossed that
    // threshold immediately. 8192 is the safe ceiling for non-stream
    // calls; bulk_create_projects payloads are kept under that by the
    // parent-inheritance logic in executeTool (children inherit
    // client_id/contract_id/concentrator_id from their parent_local_id
    // spec rather than repeating UUIDs on every row). 99 specs ×
    // ~50 tokens each (post-inheritance) = ~5000 tokens, fits.
    // Long-term: switch to streaming so we can use higher caps; for
    // now, inheritance + 8k is enough for the typical PSC RUS scaffold.
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: systemBlocks,
      tools: cachedTools,
      tool_choice: initialToolChoice,
      messages: conversationMessages,
    });

    let iterations = 0;
    const MAX_ITERATIONS = 15;

    while (response.stop_reason === 'tool_use' && iterations < MAX_ITERATIONS) {
      iterations++;
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const textBlocks = response.content.filter(b => b.type === 'text');
      for (const tb of textBlocks) {
        if (tb.text.trim()) finalText += tb.text + '\n';
      }

      // Approval gate: if ANY tool in this batch is destructive, stage
      // ALL of them (including any read-only tools in the same batch — we
      // want the admin to see exactly what Claude wants to do as one
      // bundle, not split executions). Save state, return preview.
      const anyDestructive = toolUseBlocks.some(tu => DESTRUCTIVE_AI_TOOLS.has(tu.name));
      if (anyDestructive) {
        // Push the assistant turn so on resume the conversation has it
        conversationMessages.push({ role: 'assistant', content: response.content });

        const approvalId = uuidv4();
        _pendingApprovals.set(approvalId, {
          systemBlocks, cachedTools, conversationMessages,
          stagedToolUses: toolUseBlocks,
          toolResults, finalText,
          expires_at: Date.now() + APPROVAL_TTL_MS,
          // Item 12 fix: bind approval to the initiating user so only the
          // same admin can approve/reject — prevents another admin from
          // hijacking a staged approval by guessing or leaking the approval_id.
          user_id: req.user && req.user.id,
        });

        const proposed_actions = toolUseBlocks.map(tu => ({
          id: tu.id,
          tool_name: tu.name,
          tool_input: tu.input,
          summary: summarizeToolCall(tu.name, tu.input),
          is_destructive: DESTRUCTIVE_AI_TOOLS.has(tu.name),
        }));
        return res.json({
          kind: 'pending_approval',
          approval_id: approvalId,
          preamble_text: finalText.trim(),  // any reasoning Claude shared before the tools
          proposed_actions,
          tool_results_so_far: toolResults,
          usage: response.usage,
        });
      }

      // No destructive tools — execute all immediately
      const immediateActor = {
        id: req.user?.id,
        username: req.user?.username || req.user?.full_name,
        staff_id: req.user?.staff_id,
      };
      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        console.log(`AI Tool Call: ${toolUseBlock.name}`, JSON.stringify(toolUseBlock.input).substring(0, 200));
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input, immediateActor);
        console.log(`AI Tool Result: ${toolUseBlock.name}`, JSON.stringify(toolResult).substring(0, 200));
        toolResults.push({ tool: toolUseBlock.name, input: toolUseBlock.input, result: toolResult });
        toolResultContents.push({
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult),
        });
      }
      conversationMessages.push({ role: 'assistant', content: response.content });
      conversationMessages.push({ role: 'user', content: toolResultContents });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        system: systemBlocks,
        tools: cachedTools,
        tool_choice: { type: 'auto' },
        messages: conversationMessages,
      });
    }

    // Get final text response
    const lastTextBlocks = response.content.filter(b => b.type === 'text');
    for (const tb of lastTextBlocks) {
      if (tb.text.trim()) finalText += tb.text;
    }

    // MAX_ITERATIONS warning — appended AFTER lastTextBlocks so the warning
    // lands at the end of the response, not mid-stream before the model's
    // final text blocks are added.
    if (iterations >= MAX_ITERATIONS) {
      console.warn(`AI chat hit MAX_ITERATIONS (${MAX_ITERATIONS}) — some actions may not have completed.`);
      finalText += '\n\n⚠️ **Reached iteration limit.** The assistant completed up to ' + MAX_ITERATIONS + ' tool-call rounds but may not have finished everything requested. Please review what was done and re-send any remaining tasks.';
    }

    // ── Hallucination guard ───────────────────────────────────────────────
    // If the AI's text claims it logged/created/updated something, verify
    // a corresponding modifying tool actually ran successfully. This catches
    // the case where Claude says "I've logged the entries" without actually
    // calling log_time_entries.
    const MODIFYING_TOOLS = ['log_time_entries', 'create_project', 'update_project',
      'delete_project', 'create_client', 'update_client', 'delete_client',
      'create_staff', 'create_contract',
      'update_project_status', 'advance_permit_stage', 'create_budget',
      'create_budget_code', 'update_budget_code', 'set_billing_cadence',
      // Added 2026-05-02 alongside the new tools — keep in sync with
      // DESTRUCTIVE_AI_TOOLS so the hallucination guard catches false
      // success claims about these too.
      'create_engineering_contract', 'update_contract_umbrella',
      'bulk_update_projects', 'write_sql',
      'create_user', 'deactivate_user'];
    const successfulModifications = toolResults.filter(
      tr => MODIFYING_TOOLS.includes(tr.tool) && tr.result?.success === true
    );
    // Hallucination guard: text claims an action (past, future, or
    // progressive tense) but no successful modifying tool ran. The
    // tense bucket gets logged so we can see which pattern fires most.
    const claimsActionPast = /\b(I['’]?ve|I have|successfully|done|logged|added|created|updated|saved|deleted|removed|imported|inserted|marked|advanced)\b/i.test(finalText);
    const claimsActionFuture = /\b(I['’]?ll|I will|Let me|I['’]?m going to|I['’]?m about to|going ahead)\s+(create|log|add|update|delete|save|remove|insert|set up|change|mark|advance|bill|complete|run|execute|do that|do it)\b/i.test(finalText);
    const claimsActionActive = /(^|\n|\.\s+)(Creating|Logging|Adding|Updating|Deleting|Saving|Removing|Importing|Inserting|Setting up|Marking|Advancing|Billing|Running|Executing)\b/.test(finalText);
    const claimsAction = claimsActionPast || claimsActionFuture || claimsActionActive;
    if (claimsAction && successfulModifications.length === 0) {
      const which = claimsActionPast ? 'past-tense' : claimsActionFuture ? 'future-tense' : 'progressive';
      console.warn(`AI hallucination guard fired (${which}): text claims action but no successful modifying tool ran. Text snippet: ${finalText.substring(0, 200).replace(/\s+/g, ' ')}`);
      finalText += '\n\n⚠️ **No database change actually happened.** I said I was going to do something but didn\'t actually run the tool. Please rephrase or ask me to retry — and if this keeps happening, the server logs have the exact wording that tripped the guard.';
    }

    // Log cache performance — helpful for verifying caching is reducing token spend.
    // cache_creation_input_tokens = first-time cache writes (full price + 25%)
    // cache_read_input_tokens = cache hits (10% of normal price, lower rate-limit weight)
    if (response.usage) {
      const u = response.usage;
      console.log(`AI usage — in:${u.input_tokens} out:${u.output_tokens} cache_write:${u.cache_creation_input_tokens || 0} cache_read:${u.cache_read_input_tokens || 0} iters:${iterations} mods:${successfulModifications.length}`);
    }

    // Diagnostic: when the final response has neither text nor tool results,
    // something silently failed (max_tokens hit mid-tool-use, hallucination
    // guard stripped, or model produced empty content). Surface stop_reason
    // and content-block shape on the response so we can diagnose live without
    // a redeploy. Cheap — only runs when the response is empty.
    const _diag = (!finalText.trim() && !toolResults.length) ? {
      stop_reason: response.stop_reason,
      content_block_types: (response.content || []).map(b => b.type),
      content_lengths: (response.content || []).map(b => b.type === 'text' ? (b.text || '').length : (b.type === 'tool_use' ? Object.keys(b.input || {}).length : 0)),
      iterations,
    } : null;
    res.json({
      kind: 'final',
      content: finalText.trim(),
      toolResults,
      usage: response.usage,
      ...(_diag ? { _debug_empty: _diag } : {}),
    });

  } catch (e) {
    const msg = e?.message || e?.error?.message || 'Unknown error';
    console.error('AI error:', msg);
    console.error('  Status:', e?.status);
    console.error('  Type:', e?.constructor?.name);
    console.error('  Full:', JSON.stringify(e, Object.getOwnPropertyNames(e || {})));
    res.status(500).json({ error: msg || 'AI request failed — check server logs' });
  }
});

};

// Pure helpers exported for unit tests. Not used by callers of the
// installer — they're documented here so the test file can import them
// without booting Express.
module.exports.userWantsAction = userWantsAction;
