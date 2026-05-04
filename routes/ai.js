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
  if (/^(yes|yeah|yep|yup|ok|okay|sure|do it|go ahead|proceed|confirm(ed)?|approve(d)?|please do|let['‘’]?s do it|looks good|sounds good|that works|perfect|great|correct|right|affirmative|y)\b/i.test(trimmed)) {
    return true;
  }
  if (/\b(create|add|insert|log|update|change|set|edit|modify|delete|remove|drop|mark|advance|bill|complete|reject|import|upload|save)\b/i.test(trimmed)) {
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
  const [clients, projects, staff, contracts, budgets, concentrators] = await Promise.all([
    pool.query('SELECT id, name, is_rus FROM clients ORDER BY name'),
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
  return { clients: clients.rows, projects: projects.rows, staff: staff.rows, contracts: contracts.rows, budgets: budgets.rows, concentrators: concentrators.rows };
}

const SYSTEM_PROMPT = `You are the AI project manager for Launch Fiber Services, a fiber optic infrastructure company in Macon, Georgia. You have FULL access to the database through tools. You are smart, proactive, and thorough.

RATE STRUCTURE:
- Inspection: $90/hr (RUS work only, PSC client)
- Resident Engineer (RE): $100/hr (RUS/PSC only)
- Permitting: $90/hr at random 25-30 hrs/mile (0.25 increments), with a 25-hour minimum when the project is under one mile. The hours-per-mile factor is randomized per-project at create time and stored. The "Permitting" job is the standard DOT/County variant ($90/hr). The "Permitting (RR)" job is the railroad variant — uses the same hours calc but with a custom rate the user sets in Settings → Pricing (rate may be NULL until set, in which case expected_revenue is also NULL).
- Design: VARIABLE - always ask for billing rate
- Other: VARIABLE - always ask for billing rate

CLIENTS: PSC, COX, IFT, TRI-CO
The PSC client is the RUS-eligible one (clients.is_rus=TRUE). When a user
says "PSC", "PSC RUS", or "RUS", they mean the PSC client. Always use the
PSC client_id from the database context — never ask to create a "PSC RUS"
client (it would be a duplicate).
RUS work is PSC only. Contracts and work orders are managed manually or through the AI.

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
    description: 'Create a new project in the database. Can be a top-level project or a sub-project nested under a parent. Call this ONLY after the user has confirmed the details.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        client_id: { type: 'string', description: 'Client UUID from database context' },
        contract_id: { type: 'string', description: 'Contract UUID (optional, for PSC/RUS)' },
        work_order_number: { type: 'string', description: 'Work order number' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
        billing_type: { type: 'string', enum: ['hourly', 'footage'] },
        billing_rate: { type: 'number', description: 'Hourly rate in dollars' },
        footage: { type: 'number', description: 'Linear footage (permitting projects only)' },
        status: { type: 'string', enum: ['active', 'completed', 'on_hold'], default: 'active' },
        start_date: { type: 'string', description: 'YYYY-MM-DD format (optional)' },
        notes: { type: 'string' },
        parent_id: { type: 'string', description: 'UUID of parent project to nest this under (optional). Use this to create sub-projects.' },
        budget_code_id: { type: 'string', description: 'UUID of budget code this project bills against (optional). Get from database context budgets.' },
        concentrator_id: { type: 'string', description: 'UUID of the concentrator/service area this project belongs to. Look up from concentrators in database context by area name.' }
      },
      required: ['name', 'client_id', 'project_type', 'billing_type', 'billing_rate']
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
        contract_id: { type: 'string' },
        work_order_number: { type: 'string' },
        project_type: { type: 'string', enum: ['inspection', 're', 'permitting', 'design', 'other'] },
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
    name: 'create_client',
    description: 'Create a new client in the database.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
        is_rus: { type: 'boolean', description: 'Whether this is a RUS client (default false)' },
        notes: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_client',
    description: 'Update an existing client. Only provided fields are changed.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID to update' },
        name: { type: 'string', description: 'New name (optional)' },
        is_rus: { type: 'boolean', description: 'RUS flag (optional)' },
        notes: { type: 'string', description: 'New notes (optional, pass empty string to clear)' }
      },
      required: ['client_id']
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

  {
    name: 'create_engineering_contract',
    description: 'Create an engineering-contract umbrella above one or more billing contracts. Use when the user has a master agreement (e.g. "RUS 217 Engineering Contract GA 1706 -A72") that contains multiple billing contracts (515-3, 515-4, 515-5). The umbrella is where shared budgets attach. After creation, you can attach existing contracts via update_contract_umbrella.',
    input_schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', description: 'Client UUID' },
        name: { type: 'string', description: 'Display name (e.g. "RUS 217 Engineering Contract GA 1706 -A72")' },
        contract_number: { type: 'string', description: 'Optional short identifier (e.g. "RUS 217")' },
        notes: { type: 'string', description: 'Optional free-form notes' }
      },
      required: ['client_id', 'name']
    }
  },

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
          description: 'Match conditions. Supported keys: client_id, contract_id, engineering_contract_id, status, project_type. Any combination AND-ed together.',
          properties: {
            client_id: { type: 'string' },
            contract_id: { type: 'string' },
            engineering_contract_id: { type: 'string' },
            status: { type: 'string' },
            project_type: { type: 'string' }
          }
        },
        patch: {
          type: 'object',
          description: 'Fields to set. Supported: status, billing_cadence, notes, billing_rate, contract_id, parent_id.',
          properties: {
            status: { type: 'string', enum: ['active', 'completed', 'billed', 'on_hold'] },
            billing_cadence: { type: 'string', enum: ['one_time', 'monthly'] },
            notes: { type: 'string' },
            billing_rate: { type: ['number', 'null'] },
            contract_id: { type: ['string', 'null'] }
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
        extra_teams: { type: 'array', items: { type: 'string' }, description: 'Additional teams beyond their primary role: design, permitting, inspection. Empty by default.' }
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
async function executeTool(toolName, toolInput) {
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
        const fin = calcProjectFinancials(toolInput.project_type, toolInput.billing_rate, toolInput.footage);
        const { rows } = await pool.query(`
          INSERT INTO projects (
            name, client_id, contract_id, work_order_number,
            project_type, status, billing_type, billing_rate,
            footage, miles, expected_hours, expected_revenue,
            start_date, notes, parent_id, budget_code_id, concentrator_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          RETURNING *
        `, [
          toolInput.name,
          resolvedClientId,
          toolInput.contract_id || null,
          toolInput.work_order_number || null,
          toolInput.project_type,
          toolInput.status || 'active',
          toolInput.billing_type,
          toolInput.billing_rate,
          toolInput.footage || null,
          fin.miles,
          fin.expectedHours,
          fin.expectedRevenue,
          toolInput.start_date || null,
          toolInput.notes || null,
          toolInput.parent_id || null,
          toolInput.budget_code_id || null,
          toolInput.concentrator_id || null
        ]);
        if (toolInput.project_type === 'permitting') {
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

        const fin = calcProjectFinancials(project_type, billing_rate, footage, p.permitting_hours_per_mile);
        const { rows } = await pool.query(`
          UPDATE projects SET
            name=$1, client_id=$2, contract_id=$3, work_order_number=$4,
            project_type=$5, status=$6, billing_type=$7, billing_rate=$8,
            footage=$9, miles=$10, expected_hours=$11, expected_revenue=$12,
            start_date=$13, completed_date=$14, notes=$15, parent_id=$16, budget_code_id=$17, concentrator_id=$18,
            billing_cadence=$19, projected_revenue=$20
          WHERE id=$21 RETURNING *
        `, [
          name, client_id, contract_id, work_order_number,
          project_type, status, billing_type, billing_rate,
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
        // Match the route-level DELETE /api/projects/:id behavior: pull from
        // pending billing batches first so the FK RESTRICT doesn't block.
        await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [toolInput.project_id]);
        const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [toolInput.project_id]);
        if (!rows.length) return { success: false, error: 'Project not found' };
        return { success: true, deleted: rows[0].name };
      }

      case 'bulk_delete_projects': {
        const ids = Array.isArray(toolInput.project_ids) ? toolInput.project_ids : [];
        if (!ids.length) return { success: false, error: 'No project_ids provided' };
        const results = [];
        const deleted = [];
        const failed = [];
        // Best-effort per-id deletion — keep going on individual failures so the
        // user gets a complete status report. Each success removes batch items
        // first (RESTRICT FK) before the project row itself. We don't wrap the
        // whole thing in a transaction: AI mass-deletes are typically across
        // unrelated projects, and failing all because one had children would
        // be more frustrating than skipping the bad one.
        for (const id of ids) {
          try {
            await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [id]);
            const { rows } = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING name', [id]);
            if (rows.length) {
              deleted.push({ id, name: rows[0].name });
              results.push({ id, status: 'deleted', name: rows[0].name });
            } else {
              failed.push({ id, error: 'not found' });
              results.push({ id, status: 'not_found' });
            }
          } catch (e) {
            // Common cases: child projects (RESTRICT on parent_id), time
            // entries (RESTRICT on project_id), or a confirmed billing batch
            // we couldn't clear.
            failed.push({ id, error: e.message });
            results.push({ id, status: 'failed', error: e.message });
          }
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
        const { rows } = await pool.query(
          'INSERT INTO clients (name, is_rus, notes) VALUES ($1,$2,$3) RETURNING *',
          [toolInput.name, toolInput.is_rus || false, toolInput.notes || null]
        );
        return { success: true, client: rows[0] };
      }

      case 'update_client': {
        // COALESCE pattern so undefined fields don't overwrite existing values
        const { rows } = await pool.query(
          `UPDATE clients SET
            name = COALESCE($2, name),
            is_rus = COALESCE($3, is_rus),
            notes = CASE WHEN $4::text IS NULL THEN notes ELSE $4 END
          WHERE id = $1 RETURNING *`,
          [
            toolInput.client_id,
            toolInput.name === undefined ? null : toolInput.name,
            toolInput.is_rus === undefined ? null : toolInput.is_rus,
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
        const STAGES = ['potential','started','submitted','approved','checklist','billed'];
        const { rows: current } = await pool.query(
          'SELECT stage FROM permit_stages WHERE project_id=$1 AND completed_at IS NULL ORDER BY created_at LIMIT 1',
          [toolInput.project_id]
        );
        const currentStage = current[0]?.stage || 'potential';
        const nextIdx = STAGES.indexOf(currentStage) + 1;
        if (nextIdx >= STAGES.length) return { success: false, message: 'Already at final stage' };
        const nextStage = STAGES[nextIdx];
        await pool.query(
          'UPDATE permit_stages SET completed_at=NOW(), updated_by=$1, notes=$2 WHERE project_id=$3 AND stage=$4',
          [toolInput.updated_by || 'AI', toolInput.notes || null, toolInput.project_id, currentStage]
        );
        await pool.query(
          'INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT (project_id, stage) DO NOTHING',
          [toolInput.project_id, nextStage, toolInput.updated_by || 'AI']
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
      case 'create_engineering_contract': {
        const { client_id, name, contract_number, notes } = toolInput;
        if (!client_id || !name) return { success: false, error: 'client_id and name required' };
        try {
          const { rows } = await pool.query(
            `INSERT INTO engineering_contracts (client_id, name, contract_number, notes)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [client_id, String(name).trim(), contract_number || null, notes || null]
          );
          return { success: true, engineering_contract: rows[0] };
        } catch (e) {
          if (e.code === '23505') return { success: false, error: 'Engineering contract with this name already exists for this client' };
          return { success: false, error: e.message };
        }
      }

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
        const ALLOWED_FILTER = new Set(['client_id', 'contract_id', 'engineering_contract_id', 'status', 'project_type']);
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
        const ALLOWED_PATCH = new Set(['status', 'billing_cadence', 'notes', 'billing_rate', 'contract_id', 'parent_id']);
        const sets = [];
        for (const [k, v] of Object.entries(patch)) {
          if (!ALLOWED_PATCH.has(k)) continue;
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
                   : role.startsWith('inspection_') ? 'inspection'
                   : null;
        const cleanExtras = Array.isArray(extra_teams)
          ? extra_teams.filter(t => ['design', 'permitting', 'inspection'].includes(t))
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
  'create_project', 'update_project', 'delete_project', 'bulk_delete_projects', 'update_project_status',
  'log_time_entries',
  'create_client', 'update_client', 'delete_client',
  'create_staff', 'create_contract', 'update_contract_umbrella',
  'create_budget', 'create_budget_code', 'update_budget_code',
  'set_billing_cadence',
  'advance_permit_stage',
  'csv_smart_import',
  'create_engineering_contract',
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
    case 'create_engineering_contract': return `Create engineering contract "${i.name}"`;
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
      uploadStore.set(uploadId, { raw_text: content.substring(0, 50000), filename: req.file.originalname, timestamp: Date.now() });
      fs.unlink(req.file.path, () => {});
      return res.json({ success: true, upload_id: uploadId, filename: req.file.originalname, raw_text: content.substring(0, 2000) });
    }

    // Store full data server-side, send only summary to client
    const uploadId = uuidv4();
    uploadStore.set(uploadId, { rows, headers, filename: req.file.originalname, timestamp: Date.now() });

    fs.unlink(req.file.path, () => {});

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
    res.status(500).json({ error: 'Failed to parse file: ' + e.message });
  }
});

// AI fetches rows in batches from stored upload
app.get('/api/ai/upload/:id', requireAdmin, async (req, res) => {
  const data = uploadStore.get(req.params.id);
  if (!data) return res.status(404).json({ error: 'Upload expired or not found' });
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
      for (const tu of stagedToolUses) {
        const approved = !!decisionsMap[tu.id];
        let result;
        if (approved) {
          console.log(`AI APPROVED tool: ${tu.name}`, JSON.stringify(tu.input).substring(0, 200));
          result = await executeTool(tu.name, tu.input);
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
      conversationMessages = messages.map(m => ({ role: m.role, content: m.content }));
    }

    // ── Main loop ─────────────────────────────────────────────────────
    // tool_choice='any' forces Claude to call a tool. We use it when the
    // user clearly wants an action (otherwise the model can silently
    // skip the tool_use and just reply with text). Destructive tools
    // still gate through the approval card. Resume path stays on 'auto'
    // because the model needs room to finalize with text after a tool
    // already ran.
    const initialToolChoice = approval_id
      ? { type: 'auto' }
      : userWantsAction(conversationMessages)
        ? { type: 'any' }
        : { type: 'auto' };
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
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
      const toolResultContents = [];
      for (const toolUseBlock of toolUseBlocks) {
        console.log(`AI Tool Call: ${toolUseBlock.name}`, JSON.stringify(toolUseBlock.input).substring(0, 200));
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);
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
        max_tokens: 4096,
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

    res.json({
      kind: 'final',
      content: finalText.trim(),
      toolResults,
      usage: response.usage,
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
