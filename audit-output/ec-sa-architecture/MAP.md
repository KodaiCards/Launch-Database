# EC-SA Architecture Map

## 1. Schema Reality

### `concentrators` table (legacy)
- **File:** `schema.sql:131-142`
- **Columns:**
  - `id` uuid PK, default gen_random_uuid()
  - `contract_label` varchar(100) NOT NULL — textual contract/program identifier
  - `area_name` varchar(200) NOT NULL — service area display name
  - `work_order_number` varchar(100) — optional WO# for lookup
  - `active` boolean DEFAULT true
  - `notes` text
  - `created_at` timestamptz DEFAULT now()
- **Unique constraints:** `(contract_label, area_name)` — prevents exact duplicates per contract
- **No FK constraints** — completely standalone, no parent tables
- **Purpose:** Pre-OSP-RW legacy service-area folder model for non-EC-scoped workflows

### `ec_service_areas` table (new, EC-scoped)
- **File:** `schema.sql:184-193` + Migration `0031_ec_wo_service_areas.sql:18-27`
- **Columns:**
  - `id` uuid PK, default gen_random_uuid()
  - `engineering_contract_id` uuid NOT NULL — **FK to engineering_contracts(id) ON DELETE CASCADE**
  - `name` text NOT NULL
  - `notes` text
  - `created_at` timestamptz DEFAULT now()
- **Unique constraints:** `(engineering_contract_id, name)` — name must be unique per EC, not globally
- **FK relationships:** 
  - `engineering_contract_id` → `engineering_contracts.id` (CASCADE on delete)
  - Reverse FK from `ec_work_orders.service_area_id` → `ec_service_areas.id` (SET NULL)
- **Index:** `idx_ec_service_areas_ec` on `engineering_contract_id` for fast EC lookups
- **Purpose:** EC-scoped service areas introduced 2026-05-11 (commit `7f3b6cb`) to allow admins to pre-define SAs under each EC rather than typing free-text on every project

### Relationship Between Tables
- **Zero direct link.** `concentrators` and `ec_service_areas` are completely independent tables with different identity models:
  - `concentrators` is **global identity**: `(contract_label, area_name)` tuple = unique, keyed by legacy contract program label
  - `ec_service_areas` is **EC-scoped identity**: `(engineering_contract_id, name)` tuple = unique per EC
- No FK exists between them. No cascade or trigger bridges them.
- Both feed the `projects.concentrator_id` column, but they're two different namespace ID pools.

---

## 2. Who Writes What

### `concentrators` writes
- **File:** `routes/concentrators.js` (CRUD endpoints)
- No code explicitly INSERTs into concentrators in routes analyzed
- **Legacy:** pre-OSP-RW, admin would manage via API or direct DB
- **Current status:** effectively read-only in active code paths

### `ec_service_areas` writes
- **`POST /api/engineering-contracts/:id/service-areas`** (`routes/engineering_contracts.js:214-231`)
  - Line 221-223: `INSERT INTO ec_service_areas (engineering_contract_id, name, notes) VALUES (...)`
  - Admin-only endpoint (`requireAdmin`)

- **`PUT /api/ec-service-areas/:id`** (`routes/engineering_contracts.js:233-253`)
  - Line 243: `UPDATE ec_service_areas SET ... WHERE id = $1`
  - Admin-only endpoint

- **`DELETE /api/ec-service-areas/:id`** (`routes/engineering_contracts.js:255-267`)
  - Line 258: `DELETE FROM ec_service_areas WHERE id = $1`
  - Admin-only endpoint

- **No auto-creation from projects.** Admins manually create SAs under each EC; project-create doesn't auto-create missing SAs.

---

## 3. Who Reads What

### `concentrators` reads
- **`routes/projects.js:240`** — auto-detect concentrator from WO# match:
  ```sql
  SELECT id FROM concentrators WHERE work_order_number = $1 LIMIT 1
  ```
  Used when creating a project with a WO#; if a concentrator row matches that WO#, its ID is used as `projects.concentrator_id`.

- **`routes/hours_csv.js:834`** — CSV import flow:
  ```sql
  SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active = TRUE
  ```
  Populates dropdowns for bulk project creation from CSV.

- **`routes/ai.js:231`** — AI assistant context:
  ```sql
  SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active=true ORDER BY contract_label, area_name
  ```
  Listed in the AI's available tables for query generation.

- **`routes/budgets.js:184`** — rollup folder lookup (legacy pattern):
  ```sql
  FROM concentrators c
  ```
  (Exact context truncated, but appears to be historical budget grouping.)

### `ec_service_areas` reads
- **`GET /api/engineering-contracts/:id/service-areas`** (`routes/engineering_contracts.js:199-212`)
  - Line 202-205: `SELECT * FROM ec_service_areas WHERE engineering_contract_id = $1 ORDER BY name`
  - Admin-only. Returns list of SAs under an EC.

- **`GET /api/engineering-contracts/:id/work-orders`** (`routes/engineering_contracts.js:271-291`)
  - Line 279-283: Joins ec_work_orders to ec_service_areas to fetch display name:
    ```sql
    SELECT wo.*, sa.name AS service_area_name
      FROM ec_work_orders wo
      LEFT JOIN ec_service_areas sa ON sa.id = wo.service_area_id
    ```
  - Surfaces `service_area_name` in the WO list for UI display.

- **`public/design.html:1109-1124`** — SPA frontend:
  - Line 1109: `api('/api/engineering-contracts/' + ecId + '/service-areas')`
  - Fetches SAs for selected EC, populates dropdown at line 1124:
    ```javascript
    sas.map(sa => `<option value="${sa.id}" data-type="ec-sa">${esc(sa.name)}</option>`).join('')
    ```
  - **BUG IS HERE**: the `<option value="${sa.id}">` stores `ec_service_areas.id` UUID in the dropdown

- **`public/design.html` form submission** — when user submits the project-create form:
  - The selected SA ID is sent to `POST /api/projects` as `concentrator_id` in the request body
  - **Portal code at line 1124 conflates two table identities:** it puts `ec_service_areas.id` into the `concentrator_id` form field

### The Bug: Mismatched Lookup
- **Portal sends:** `concentrator_id = <ec_service_areas.id>`
- **Backend expects:** `concentrator_id = <concentrators.id>` (from `projects.js:240` which does `WHERE work_order_number = ...` in the CONCENTRATORS table, line 240)
- **Rollup chain reads:** `portal_module.js:152-154` tries to `SELECT area_name FROM concentrators WHERE id = $1` when a `concentrator_id` is provided
  - If the passed ID is an `ec_service_areas.id`, this query silently returns zero rows (`con.rows[0]?.area_name || 'Service Area'` falls back to 'Service Area')
  - Rollup folder is created with a generic name instead of the SA's actual name

---

## 4. The Rollup Chain

**File:** `portal_module.js:72-171` (`ensureRollupChain` function)

### Hierarchy (3 or 4 levels)
1. **Client folder** (always, line 105-111)
   - Rollup key: `client_id`
   - Name: client.name
   - Lookup: `SELECT name FROM clients WHERE id = $1`

2. **Team folder** (always, line 140-146)
   - Rollup key: 'design'|'permitting'|'construction'|'shared'
   - Name: 'Design Team'|'Permitting Team'|'Construction Team'|'Shared / Other'
   - Lookup: `SELECT team FROM jobs WHERE id = $1`

3. **Service Area folder** (conditional on concentrator_id OR service_area_label, line 160-168)
   - If `concentrator_id` provided:
     ```javascript
     const con = await pool.query('SELECT area_name FROM concentrators WHERE id = $1', [concentrator_id]);
     areaKey = concentrator_id;
     areaLabel = con.rows[0]?.area_name || 'Service Area';
     ```
   - **THE BUG:** If concentrator_id is actually an `ec_service_areas.id`, this query returns no rows, and label defaults to 'Service Area' instead of the actual SA name
   
   - Else if `service_area_label` (free-text):
     ```javascript
     const trimmed = service_area_label.trim();
     areaKey = client_id + '|' + trimmed.toLowerCase();
     areaLabel = trimmed;
     ```
   - Or skip this level entirely if neither provided

4. **Project** (leaf, not a rollup folder, created by caller)

### Writebacks to Rollup Folders
- **`findOrCreateRollup` function** (line 173-230)
  - Tries to find existing rollup row with matching `(rollup_level, rollup_key, parent_id)`
  - If not found, INSERTs into projects table with `is_rollup = TRUE`:
    ```sql
    INSERT INTO projects (name, client_id, parent_id, concentrator_id, program,
                          status, is_rollup, rollup_level, rollup_key, project_type,
                          engineering_contract_id)
    VALUES ($1, $2, $3, $4, $5, 'active', TRUE, $6, $7, 'rollup', $8)
    ```
  - Line 193-200: `projects` rows created with:
    - `concentrator_id` = the input `concentrator_id` (which is BROKEN if it's an ec_service_areas.id)
    - `name` = `areaLabel` (which defaults to 'Service Area' when lookup fails)
    - Other columns populated from extras

### What Cascades From Changes
- No trigger or cascading AUTO-SYNC between concentrators and ec_service_areas
- Deleting an EC (engineering_contract cascade) deletes its ec_service_areas rows, but concentrators are unaffected
- Deleting a concentrator leaves orphaned projects.concentrator_id references (no FK constraint)
- Similarly, adding a new ec_service_areas row does NOT auto-update any concentrators

---

## 5. The Cascade UI Intent

### Current Flow (design.html as example)

1. **Client selection** (`clientChanged`, line 1171-1199)
   - User picks client from dropdown
   - Refreshes contracts dropdown for that client
   - Caches contracts (window.contractsCache) for later field-gating

2. **Contract selection** (`contractChanged`, line 1070-1089)
   - User picks contract from dropdown
   - Reads EC ID from the contract's `engineering_contract_id` column
   - Calls `populateEcScopedWoSaForModal(ecId)` (line 1079)

3. **EC-scoped SA/WO loading** (`populateEcScopedWoSaForModal`, line 1103-1169)
   - Line 1108-1111: Fetches SAs and WOs from backend:
     ```javascript
     const [sas, wos] = await Promise.all([
       api('/api/engineering-contracts/' + ecId + '/service-areas'),
       api('/api/engineering-contracts/' + ecId + '/work-orders'),
     ]);
     ```
   - Line 1118-1129: Populates SA dropdown with `ec_service_areas` rows
     - **CRITICAL:** stores `sa.id` (UUID from ec_service_areas table) in the dropdown's `<option value="...">`
     - Also stores `data-type="ec-sa"` to signal that it's an EC-scoped SA, not a legacy concentrator

4. **WO selection auto-binds SA** (line 1140-1146)
   - If user picks a WO, the WO's `service_area_id` is read and auto-selected in the SA dropdown
   - This works correctly if service_area_id → ec_service_areas.id relationship is intact

5. **Form submission** (`/api/projects` POST)
   - Line 1124 SA dropdown sends `value="${sa.id}"` as concentrator_id in the request
   - Backend receives project create request with `concentrator_id = <ec_service_areas.id>`

### Desired Cascade Shape (per Carter's 2026-05-14 brief)
Client → Engineering Contract → Service Area → Job (leaf)

**What's missing for FULL cascade:**
- No cascade picker UI for EC → Service Area → WO → Job sequencing
- Currently: Contract selection → SA/WO picker, then Job picker in separate field
- Full cascade would be: Client → Contract (which implies EC) → SA → Job, with each level filtering the next

---

## 6. Fix Shape Recommendation

### Problem Summary
The SPA sends `ec_service_areas.id` values in the `concentrator_id` field. The backend rollup chain tries to look up this UUID in the `concentrators` table (not `ec_service_areas`), fails to find a match, and defaults to a generic 'Service Area' label instead of the real SA name.

### Option A: Backend Fix — Lookup From ec_service_areas When data-type="ec-sa"
**Cleanest, least disruptive:**
- Frontend adds a hidden field `data-concentrator-type: "ec-sa"` to the form alongside `concentrator_id`
- Backend `ensureRollupChain` receives both `concentrator_id` and optionally `concentrator_type: "ec-sa"`
- If `concentrator_type === "ec-sa"`, backend looks up in `ec_service_areas`:
  ```sql
  SELECT name FROM ec_service_areas WHERE id = $1
  ```
  Instead of concentrators
- Rollup chain logic branches on table source but produces same result
- **Pros:** Minimal code; no data migration; ec_service_areas remain independent
- **Cons:** Requires frontend change + explicit type signaling

### Option B: Architectural Fix — Migrate SA Rollups to Use ec_service_areas.id Directly
**Cleaner long-term, breaks history:**
- Deprecate `concentrators` for rollup-chain service-area purposes
- `portal_module.js` ensureRollupChain changes line 152-154 to:
  ```javascript
  if (concentrator_id) {
    // Attempt ec_service_areas first (new path)
    const ecsa = await pool.query('SELECT name FROM ec_service_areas WHERE id = $1', [concentrator_id]);
    if (ecsa.rows.length) {
      areaLabel = ecsa.rows[0].name;
      // areaKey remains concentrator_id (the ec_service_areas.id)
    } else {
      // Fallback to concentrators (legacy path)
      const con = await pool.query('SELECT area_name FROM concentrators WHERE id = $1', [concentrator_id]);
      areaLabel = con.rows[0]?.area_name || 'Service Area';
    }
  }
  ```
- This makes the system "dual-source": if an ID matches an ec_service_areas row, use it; otherwise fall back to concentrators
- **Pros:** No frontend change; backward-compatible with existing concentrators-based projects
- **Cons:** Creates query fallback complexity; still has the dual-table identity problem long-term

### Option C: Hybrid — Create Mirror Concentrators Rows From ec_service_areas
**Architectural alignment, adds rows:**
- When an EC-scoped SA is created, auto-create a matching `concentrators` row with the same ID (via FK to ec_service_areas, or copying the name)
- Projects can then use the concentrators ID uniformly across both legacy and new paths
- Breaks the independence of the two tables but unifies the identity namespace
- **Pros:** Simplifies rollup chain (no branching); all concentrator_id values go to one table
- **Cons:** Data duplication; adds trigger complexity; changes concentrators from "legacy" to "always created"

### Recommended Approach
**Option B (fallback dual-source lookup)** is the safest for the immediate term:
1. No breaking changes to existing projects using concentrators
2. No frontend change required
3. Makes the system work correctly with ec_service_areas immediately
4. Can be migrated to Option A later with frontend coordination

### Minimum surgical change
- **File:** `portal_module.js:152-154`
- **Change:** Swap query order to try ec_service_areas first, then fall back to concentrators
- **Cost:** ~5 lines of code, one additional query per project creation in the new path

---

## 7. Risks + Unknowns

### Missing Before Fix Dispatch

1. **Should `ec_service_areas` have a client_id FK?**
   - Currently: Only `engineering_contract_id` FK (which cascades to EC deletion)
   - EC has FK to clients, so transitively there's a path, but no direct constraint
   - Risk: An SA from EC-A (under Client X) could theoretically be used on a project under Client Y (if EC linkage is confused)
   - Carter's decision needed: Is client_id redundant (always derivable from EC), or should it be explicit?

2. **Should the portal form send `data-type="ec-sa"`?**
   - Currently: SPA stores `data-type="ec-sa"` on the `<option>` but doesn't send it to the backend
   - Backend has no way to distinguish "this is from ec_service_areas" vs "this is from concentrators"
   - Option A requires frontend change; Option B doesn't
   - Which do you prefer?

3. **Do we ever want to auto-create missing SAs?**
   - Currently: Admin must pre-populate SAs under an EC; designers pick from existing list only
   - Alternative: Allow project-create modal to create a new SA on the fly if user types a name not in the list
   - This would require changing the SA dropdown from a hard `<select>` to a combo-box or datalist
   - Carter's decision: Constraint (pre-populate only) or convenience (auto-create)?

4. **Concentrators table — deprecate or keep?**
   - For projects using concentrators (old projects, ongoing spreadsheet imports), the table is still functional
   - For new EC-scoped projects, ec_service_areas is the source
   - Plan: Keep both parallel, or migrate all concentrators → ec_service_areas entries + backfill old projects?

5. **Should there be a unique index preventing the same SA name under different ECs?**
   - Currently: `UNIQUE (engineering_contract_id, name)` — allows "Design" SA under EC-A and EC-B
   - Is this desired (EC-isolated), or should "Design" be unique globally?
   - (Probably desired per EC, but confirming the intent)

6. **What about projects created before ec_service_areas existed?**
   - Older projects have concentrator_id pointing to concentrators rows
   - New projects have concentrator_id pointing to ec_service_areas.id
   - Rollup chain lookup (line 152) will fail for old-style rows if it ONLY checks ec_service_areas
   - Option B's fallback handles this; Option A would too (checks both)

### Verification Steps Before Dispatch

1. Confirm a sample project was created via the design portal under an EC with ec_service_areas
2. Verify its projects.concentrator_id points to an ec_service_areas.id (not a concentrators.id)
3. Verify the rollup folder's name is 'Service Area' (the bug symptom), not the real SA name
4. Confirm via admittedly manual DB inspection that the SA name is stored in ec_service_areas but not read by the rollup chain

---

## Architectural Observations

### The Dual-Table Problem
The system has two logically equivalent service-area tables with incompatible identity models:
- **concentrators:** global namespace, keyed by (contract_label, area_name)
- **ec_service_areas:** EC-scoped namespace, keyed by (engineering_contract_id, name)

Both feed `projects.concentrator_id`, which currently has no FK constraint to either table. This allows ID collisions (if a concentrators.id and an ec_service_areas.id happen to be the same UUID, the downstream lookup is ambiguous).

### Naming Confusion
The `concentrator_id` column on `projects` is a semantic misnomer if it can hold ec_service_areas.id values. The term "concentrator" historically refers to the legacy table. EC-scoped SAs are not concentrators; they're service areas. A schema migration to rename the column (or split it) would reduce confusion, but that's outside the scope of this fix.

### Missing FK Constraint
`projects.concentrator_id` has no FK to either concentrators or ec_service_areas. This allows orphaned references if a concentrator or SA is deleted without cascading cleanup. Adding a computed FK or a trigger would prevent data integrity issues, but that's a separate hardening task.

---

=== EC-SA ARCHITECTURE MAP END ===
