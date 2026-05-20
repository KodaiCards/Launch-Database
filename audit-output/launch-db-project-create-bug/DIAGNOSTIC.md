# LAUNCH-DB Project Creation Bug Diagnostic

**Status:** UNABLE TO IDENTIFY ROOT CAUSE — requires runtime verification or additional user feedback.

**User Report:** "Can't add projects on any portals right now" — affects admin.html, design.html, permitting.html, timeclock.html simultaneously.

## Verification Completed (All Clean)

### 1. **Endpoint Syntax & Registration**
- ✅ `/api/projects` POST handler at `routes/projects.js:167-383` syntax verified
- ✅ Routes registered via `require('./routes/projects')(app, pool, ...)` at `server.js:577`
- ✅ `requireAuth()` middleware present and properly imported

### 2. **Dependencies Wired**
- ✅ `app.locals.ensureRollupChain` registered at `portal_module.js:426` and called by `installPortalExtensions` at `server.js:284`
- ✅ `app.locals.isDuplicateProject` registered at `portal_module.js:424-425`, called in POST handler at `routes/projects.js:252`
- ✅ `broadcast()` from `routes/_sse.js` imported and called in POST handler at `routes/projects.js:377`

### 3. **Frontend UI & Validation**
- ✅ All form fields present: `proj-name`, `proj-client`, `proj-job`, `proj-ptype`, etc.
- ✅ `saveProject()` function properly assembles request body at `public/admin.html:4751-4850`
- ✅ Calls correct POST endpoint: `api('/api/projects', 'POST', body)` with complete payload
- ✅ Form validation logic appears correct (client required, project type required for non-rollups, etc.)
- ✅ api() helper at `public/js/api.js:10-32` handles auth headers (cookie + Bearer token fallback)

### 4. **Recent Commits**
- ✅ Latest main commit `c2e463f` — "Hotfix: comprehensive lesson loading + gray-tile fixes for boss demo"
  - Only touches OSP training content (`osp-training/src/lessons/`)
  - Does not modify `routes/projects.js`, `public/admin.html`, `public/js/api.js`, or server.js
- ✅ Earlier Moodle teardown (`47c5fa5`) removed OAuth2 routes but didn't affect project endpoint
- ✅ No recent schema migrations that would break project table structure

### 5. **Schema Verification**
- ✅ Migrations in chronological order, latest = `0035_training_tables.sql`
- ✅ No schema.sql edits detected that would drop/modify projects table columns
- ✅ INSERT statement includes all 25 columns referenced in the handler (name, client_id, contract_id, etc.)

## Most Likely Causes (Unverified Without Runtime)

1. **Database Connectivity Issue**
   - Cannot query `routes/projects.js:339` INSERT without a database connection
   - Would fail with a 500 error "Failed to create project"
   - Symptom matches: silent failure across all portals

2. **Missing Required Field in Frontend Request**
   - If `name` or `client_id` is not being sent, validation at `routes/projects.js:251` would fail
   - Would return 400-level error
   - Run browser DevTools Network tab → POST `/api/projects` → inspect request body

3. **Authentication/Authorization Issue**
   - If user is not authenticated, `requireAuth()` at `routes/projects.js:167` returns 401
   - If user lacks proper role, would reject
   - Run DevTools Console → `api('/api/projects', 'POST', {...})` manually to see error

4. **Race Condition in Roll-up Chain**
   - Complex async flow at `routes/projects.js:231-249` involves multiple db queries
   - If `ensureRollupChain()` is slow/timing out, would hang silently or throw 500

5. **Browser/Network Issue**
   - Form submission succeeds on frontend but request never reaches backend
   - Check browser Network tab for XHR/fetch failures, CORS errors, timeouts

## Next Steps (For User / Runtime Verification)

1. **Check browser DevTools**:
   - Open Network tab → try to add a project
   - Look for POST `/api/projects` request
   - Check response status + error body

2. **Check server logs**:
   - SSH into Railway service running launch-database
   - `journalctl -u launch-database -n 50` or equivalent
   - Look for `[projects:create]` error message (would log at `routes/projects.js:380`)

3. **Test manual API call**:
   - From admin portal, open DevTools Console
   - Run: `api('/api/projects', 'POST', { name: 'Test', client_id: '<a known client UUID>', job_id: '<a known job UUID>', project_type: 'other', program: 'rus', status: 'active' })`
   - Check error message

4. **Verify database is running**:
   - Ping database host + check connection pool status

## Files Examined

- `routes/projects.js` — POST /api/projects handler + validation
- `auth.js` — requireAuth() middleware
- `portal_module.js` — ensureRollupChain + isDuplicateProject registration
- `server.js` — route wiring + middleware stack
- `public/admin.html` — saveProject() + form UI
- `public/js/api.js` — HTTP client
- `public/design.html`, `public/permitting.html`, `public/timeclock.html` — alternative portal save flows
- `migrations/*.sql`, `schema.sql` — database structure

## Conclusion

**Unable to identify a code-level bug** that would prevent all project-creation attempts on all portals. All syntax, wiring, dependencies, and recent changes check out. The issue is likely:
- Runtime/environment (database down, auth token expired)
- Frontend network failure (CORS, firewall, etc.)
- User feedback missing details (specific error message, browser console output)

**Recommendation**: Request user to share error message + DevTools Network tab screenshot of failed POST request.

---
=== LAUNCH-DB PROJECT FIX HAIKU END ===
