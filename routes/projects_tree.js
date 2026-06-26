// routes/projects_tree.js — the nested rollup behind the Projects tab.
//
// docs/projects_tab_design.md. Returns Client → EC → CC → SA → Route → project,
// where a "project" is a permitting/design service_area_job (the leaf). EC/CC/
// Route are optional layers; an SA is always present. SA nodes carry the map
// fields (center + has_boundary) so the tab can plot + zoom from one call.
//
// Mount (server.js):  require('./routes/projects_tree')(app, pool, { requireManagerOrAdmin });

module.exports = function installProjectsTree(app, pool, mw) {
  const gate = (mw && mw.requireManagerOrAdmin) || ((req, res, next) => next());

  app.get('/api/projects-tree', gate, async (req, res) => {
    try {
      const [clients, ecs, ccs, sas, routes, jobs] = await Promise.all([
        pool.query('SELECT id, name FROM clients ORDER BY name'),
        pool.query('SELECT id, client_id, name, program FROM engineering_contracts ORDER BY name'),
        pool.query('SELECT id, client_id, engineering_contract_id, name FROM construction_contracts ORDER BY name'),
        pool.query(`SELECT id, client_id, engineering_contract_id, construction_contract_id, name, status,
                           build_finalized_at, closed_at, center_lat, center_lng, (boundary IS NOT NULL) AS has_boundary, miles
                      FROM service_areas ORDER BY name`),
        pool.query('SELECT id, service_area_id, name FROM service_area_routes ORDER BY name'),
        pool.query(`SELECT saj.id, saj.service_area_id, saj.route_id, saj.team, saj.status,
                            saj.label, j.name AS job_name
                      FROM service_area_jobs saj LEFT JOIN jobs j ON j.id = saj.job_id
                     WHERE saj.team IN ('permitting','design')
                     ORDER BY COALESCE(saj.label, j.name) NULLS LAST, saj.created_at`),
      ]);

      const lifecycle = (sa) => sa.closed_at ? 'final' : sa.build_finalized_at ? 'completed' : 'active';
      const projNode = (p) => ({ id: p.id, type: 'project', label: p.label || p.job_name || (p.team + ' job'),
        discipline: p.team, status: p.status });

      // projects grouped by SA, then by route (null route = SA-level)
      const projBySaRoute = {};
      for (const p of jobs.rows) {
        const k = p.service_area_id; (projBySaRoute[k] = projBySaRoute[k] || { _sa: [], byRoute: {} });
        if (p.route_id) (projBySaRoute[k].byRoute[p.route_id] = projBySaRoute[k].byRoute[p.route_id] || []).push(projNode(p));
        else projBySaRoute[k]._sa.push(projNode(p));
      }
      const routesBySa = {};
      for (const r of routes.rows) (routesBySa[r.service_area_id] = routesBySa[r.service_area_id] || []).push(r);

      const saNode = (sa) => {
        const pr = projBySaRoute[sa.id] || { _sa: [], byRoute: {} };
        const routeNodes = (routesBySa[sa.id] || []).map((r) => ({
          id: r.id, type: 'route', label: r.name || 'Route', children: pr.byRoute[r.id] || [] }));
        return { id: sa.id, type: 'sa', label: sa.name, status: sa.status, lifecycle: lifecycle(sa),
          center_lat: sa.center_lat, center_lng: sa.center_lng, has_boundary: sa.has_boundary,
          children: routeNodes.concat(pr._sa) };
      };

      const sasByCc = {}, sasByEcDirect = {}, sasByClientDirect = {};
      for (const sa of sas.rows) {
        if (sa.construction_contract_id) (sasByCc[sa.construction_contract_id] = sasByCc[sa.construction_contract_id] || []).push(sa);
        else if (sa.engineering_contract_id) (sasByEcDirect[sa.engineering_contract_id] = sasByEcDirect[sa.engineering_contract_id] || []).push(sa);
        else (sasByClientDirect[sa.client_id] = sasByClientDirect[sa.client_id] || []).push(sa);
      }
      const ccsByEc = {}, ccsByClientDirect = {};
      for (const cc of ccs.rows) {
        if (cc.engineering_contract_id) (ccsByEc[cc.engineering_contract_id] = ccsByEc[cc.engineering_contract_id] || []).push(cc);
        else (ccsByClientDirect[cc.client_id] = ccsByClientDirect[cc.client_id] || []).push(cc);
      }
      const ccNode = (cc) => ({ id: cc.id, type: 'cc', label: cc.name,
        children: (sasByCc[cc.id] || []).map(saNode) });
      const ecsByClient = {};
      for (const ec of ecs.rows) (ecsByClient[ec.client_id] = ecsByClient[ec.client_id] || []).push(ec);
      const ecNode = (ec) => ({ id: ec.id, type: 'ec', label: ec.name, program: ec.program,
        children: (ccsByEc[ec.id] || []).map(ccNode).concat((sasByEcDirect[ec.id] || []).map(saNode)) });

      const tree = clients.rows.map((c) => ({ id: c.id, type: 'client', label: c.name,
        children: (ecsByClient[c.id] || []).map(ecNode)
          .concat((ccsByClientDirect[c.id] || []).map(ccNode))
          .concat((sasByClientDirect[c.id] || []).map(saNode)) }));

      res.json(tree);
    } catch (e) {
      console.error('[projects-tree]', e && e.message);
      res.status(500).json({ error: 'Failed to load projects tree.' });
    }
  });
};
