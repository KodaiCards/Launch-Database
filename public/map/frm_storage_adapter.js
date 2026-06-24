// frm_storage_adapter.js — plugs the fiber-route map into the keystone DB.
//
// The map's storage layer prefers an injected window.storage over localStorage
// (see store.get/set in the map). Include THIS before the map's main <script>
// when embedding inside the authed app, and plans persist server-side via
// /api/map/store/:key instead of the browser. get → {value}|null, set(k, string).
(function () {
  window.storage = {
    async get(k) {
      try {
        const r = await fetch('/api/map/store/' + encodeURIComponent(k), { credentials: 'include' });
        if (!r.ok) return null;
        return await r.json(); // {value} or null
      } catch { return null; }
    },
    async set(k, v) {
      try {
        await fetch('/api/map/store/' + encodeURIComponent(k), {
          method: 'PUT', credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: v }),
        });
      } catch { /* best-effort; map keeps working in-memory */ }
    },
  };
})();
