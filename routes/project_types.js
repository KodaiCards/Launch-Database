// routes/project_types.js — legacy compat shim.
//
// Phase 3b (2026-05-04): the project_types TABLE was dropped in favor of
// the canonical engineering_contracts.program enum. This route module is
// kept around so existing portal/admin frontends that still call
// /api/project-types don't 404 in the deploy window.
//
// GET /api/project-types     → returns the four program enum values as
//                              {id, name, active} rows so old dropdowns
//                              still populate. The id is the program code
//                              itself (e.g. "rus") so any frontend that
//                              POSTs the id back as project_type_id is
//                              actually sending us the program string;
//                              the projects/pricing endpoints handle that
//                              gracefully.
// POST/PUT/DELETE             → 410 Gone with a clear message. Programs
//                              are a fixed enum now; admin can no longer
//                              add or rename them.

const PROGRAM_ROWS = [
  { id: 'rus',   name: 'RUS',   active: true },
  { id: 'bau',   name: 'BAU',   active: true },
  { id: 'gfr',   name: 'GF(R)', active: true },
  { id: 'other', name: 'Other', active: true },
];

module.exports = function installProjectTypesRoutes(app, pool, mw) {
  // Wave 1.5 [UNGATED]: GET /api/project-types was missing auth.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireStaff = (mw && mw.requireStaff) || requireAuth(); // O34: staff-only read (was unauthenticated via {} stub)
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');

  app.get('/api/project-types', viewProjects, async (req, res) => {
    res.json(PROGRAM_ROWS);
  });

  // Frontends or AI tools that try to mutate the (now-fixed) program list
  // get a clear 410 instead of a silent 404. The body identifies why.
  const goneHandler = (req, res) => {
    res.status(410).json({
      error: 'Project Types are now a fixed enum (rus / bau / gfr / other). The CRUD surface was retired in Phase 3b. Set program on each engineering contract instead.',
    });
  };
  app.post('/api/project-types', goneHandler);
  app.put('/api/project-types/:id', goneHandler);
  app.delete('/api/project-types/:id', goneHandler);
};
