// public/js/project_cascade.js — shared Client → Program → SA → Job cascade picker.
//
// Wave 212 A4 — extract the cascade logic that all four portals (admin /
// design / permitting / timeclock) currently re-implement inline. Each
// portal walks the same conceptual ladder:
//
//   1. User picks a Client.
//   2. The set of Engineering Contracts (ECs) for that client determines
//      which Programs (rus / bau / gfr / other) are available.
//   3. User picks a Program. If ≥1 EC matches (client, program), the
//      picker enters "EC mode" — show the EC dropdown, and after EC
//      selection load that EC's Service Areas (with optional WO# label).
//      If 0 ECs match, the picker enters "no-EC mode" — show a free-text
//      Service Area input.
//   4. User picks (or types) a Service Area.
//   5. User picks a Job from a typeahead filtered by the (client, program,
//      ec) scope. "+ Create new job" is allowed inline.
//   6. Cascade reports its current state via onChange; consumer decides
//      whether to auto-fill a project name like `{SA} — {Job}`.
//
// The module owns the DOM event wiring + cache + state for the cascade
// rows only. Portals retain ownership of everything else in their project
// modals (billing, contracts, edit-mode, free-text overrides, etc).
//
// Compatibility shape:
//   ProjectCascade.mount({ container, prefix, mode, onChange, autoName })
//     → returns handle { reset, setValues, getValues, destroy, getState }
//   ProjectCascade.resolveOrCreate(state)
//     → POSTs /api/projects/resolve-or-create, returns { project_id }
//
// The module is intentionally framework-free (vanilla JS, no build step)
// to match the rest of the launch-database frontend. Loaded via a normal
// <script src="/js/project_cascade.js" defer> tag.
//
// Required DOM (the consumer page must provide elements with these IDs,
// where {p} is the configured prefix — e.g. 'proj-' for admin, 'dp-' for
// design, etc.):
//
//   {p}client          <select>   Client picker (id may be shared across
//                                 portals — both admin + design use
//                                 'proj-client'; pass it explicitly so the
//                                 module doesn't assume).
//   {p}program         <select>   Program picker (rus / bau / gfr / other).
//   {p}ec-row          <div>      Row container (shown in EC mode).
//   {p}ec              <select>   EC picker.
//   {p}no-ec-row       <div>      Row container (shown in no-EC mode).
//   {p}service-area    <input>    Free-text SA input (no-EC mode).
//   {p}sa              <select>   SA dropdown (EC mode).
//   {p}sa-hint         <div>      Optional hint shown when EC has 0 SAs.
//   {p}job-input       <input>    Job typeahead input.
//   {p}job-dropdown    <div>      Job typeahead dropdown panel.
//   {p}job             <input>    Hidden input for the picked job id.
//
// If a portal uses different IDs for any row, pass an `ids` override map
// in opts. See `_resolveIds()` below for the defaults.

(function () {
  'use strict';

  // ─── Module-level caches (shared across mounts on the same page) ────────
  // EC service-areas by ec_id. Survives mount/unmount for the same page
  // load — different mounts on the same page (e.g. inside vs outside a
  // modal) share the cache.
  const _ecSaCache = {};
  // Jobs by scope key — keyed by `${client_id}|${program}|${ec_id}` so
  // the typeahead doesn't re-fetch the same list per keystroke.
  const _jobsCache = {};

  // Expose cache for invalidation hooks (engineering_contracts.js may want
  // to clear the SA cache after a settings-side edit).
  if (typeof window !== 'undefined') {
    window._projEcSaCache = window._projEcSaCache || _ecSaCache;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  function _q(id) { return document.getElementById(id); }
  function _esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function _safeApi(path) {
    // Use the page's global api() if defined; fall back to fetch.
    if (typeof window.api === 'function') return window.api(path);
    return fetch(path, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  // Program labels (matches admin.html PROGRAM_LABELS).
  const PROGRAM_LABELS_FALLBACK = {
    rus: 'RUS',
    bau: 'BAU',
    gfr: 'GF(R)',
    other: 'Other',
  };
  function _programLabel(code) {
    if (typeof window.PROGRAM_LABELS === 'object' && window.PROGRAM_LABELS) {
      return window.PROGRAM_LABELS[code] || PROGRAM_LABELS_FALLBACK[code] || code;
    }
    return PROGRAM_LABELS_FALLBACK[code] || code;
  }

  function _resolveIds(prefix, override) {
    // Default ID shape: {prefix}client, {prefix}program, etc.
    const defaults = {
      client:      prefix + 'client',
      program:     prefix + 'program',
      ecRow:       prefix + 'ec-row',
      ec:          prefix + 'ec',
      noEcRow:     prefix + 'no-ec-row',
      serviceArea: prefix + 'service-area',
      sa:          prefix + 'sa',
      saHint:      prefix + 'sa-hint',
      jobInput:    prefix + 'job-input',
      jobDropdown: prefix + 'job-dropdown',
      job:         prefix + 'job',
    };
    return Object.assign(defaults, override || {});
  }

  // ─── Cascade controller ─────────────────────────────────────────────────

  function mount(opts) {
    opts = opts || {};
    const prefix = opts.prefix || 'proj-';
    const ids = _resolveIds(prefix, opts.ids);
    const onChange = typeof opts.onChange === 'function' ? opts.onChange : null;
    const mode = opts.mode === 'edit' ? 'edit' : 'create';

    // Internal state — read via getState() / getValues().
    const state = {
      client_id: null,
      program: null,
      ec_id: null,
      sa_id: null,
      service_area_label: null, // populated in no-EC mode
      job_id: null,
      new_job_name: null,
      work_order_number: null,
      project_name: null, // last auto-fill (consumer may override)
    };

    let _nameManuallyEdited = mode === 'edit'; // edit mode never auto-names
    let _jobDebounce = null;
    let _saTypeDebounce = null;
    let _destroyed = false;

    function _emit() {
      if (_destroyed || !onChange) return;
      // Shallow copy so the consumer can't mutate our state object.
      onChange(Object.assign({}, state));
    }

    function _resetEcAndBelow() {
      const ecRow = _q(ids.ecRow);
      if (ecRow) ecRow.style.display = 'none';
      const noEcRow = _q(ids.noEcRow);
      if (noEcRow) noEcRow.style.display = 'none';

      const ec = _q(ids.ec);
      if (ec) {
        ec.value = '';
        ec.disabled = true;
        // Don't blow away options — caller may want to keep them visible
        // briefly. The next select-population in onProgramChanged will
        // overwrite anyway.
      }

      const sa = _q(ids.sa);
      if (sa) {
        sa.innerHTML = '<option value="">— pick contract first —</option>';
        sa.disabled = true;
      }
      const saText = _q(ids.serviceArea);
      if (saText) saText.value = '';
      const saHint = _q(ids.saHint);
      if (saHint) saHint.style.display = 'none';

      const jobInp = _q(ids.jobInput);
      if (jobInp) { jobInp.value = ''; jobInp.disabled = true; }
      const jobHidden = _q(ids.job);
      if (jobHidden) jobHidden.value = '';
      const jobDd = _q(ids.jobDropdown);
      if (jobDd) jobDd.style.display = 'none';

      state.ec_id = null;
      state.sa_id = null;
      state.service_area_label = null;
      state.job_id = null;
      state.new_job_name = null;
      state.work_order_number = null;
    }

    function _resetProgramAndBelow() {
      const programSel = _q(ids.program);
      if (programSel) {
        programSel.innerHTML = '<option value="">— pick client first —</option>';
        programSel.disabled = true;
      }
      state.program = null;
      _resetEcAndBelow();
    }

    function _autoFillName() {
      if (_nameManuallyEdited || !opts.autoName) return;
      const saLabel = state.ec_id
        ? ((_ecSaCache[state.ec_id] || []).find(s => s.id === state.sa_id) || {}).name || ''
        : (state.service_area_label || '');
      const jobLabel = state.new_job_name || (_q(ids.jobInput) ? _q(ids.jobInput).value : '');
      if (saLabel && jobLabel) {
        state.project_name = saLabel + ' — ' + jobLabel;
      } else {
        state.project_name = null;
      }
    }

    // ── Step 1: client changed ──
    async function onClientChanged() {
      const clientSel = _q(ids.client);
      const clientId = clientSel ? (clientSel.value || null) : null;
      state.client_id = clientId;
      _resetProgramAndBelow();

      if (!clientId) { _emit(); return; }

      // Refresh EC cache for this client if needed.
      try {
        const cache = window.engineeringContractsCache;
        if (!Array.isArray(cache) || !cache.some(e => e.client_id === clientId)) {
          const fresh = await _safeApi('/api/engineering-contracts?client_id=' + encodeURIComponent(clientId));
          window.engineeringContractsCache = (Array.isArray(cache) ? cache : [])
            .filter(e => e.client_id !== clientId)
            .concat(fresh);
        }
      } catch (e) { /* non-fatal — programs list will fall back to all 4 */ }

      const ecs = (window.engineeringContractsCache || []).filter(e => e.client_id === clientId);
      const programs = Array.from(new Set(ecs.map(e => e.program).filter(Boolean)));

      const programSel = _q(ids.program);
      if (programSel) {
        programSel.innerHTML = '<option value="">Select program…</option>' +
          ['rus', 'bau', 'gfr', 'other'].map(p =>
            `<option value="${p}">${_esc(_programLabel(p))}</option>`
          ).join('');
        programSel.disabled = false;
        // Auto-pick when there's exactly one program for this client.
        if (programs.length === 1) {
          programSel.value = programs[0];
          await onProgramChanged();
          return; // onProgramChanged emits
        }
      }

      _emit();
    }

    // ── Step 2: program changed ──
    async function onProgramChanged() {
      const programSel = _q(ids.program);
      const program = programSel ? (programSel.value || null) : null;
      state.program = program;
      _resetEcAndBelow();

      if (!program) { _emit(); return; }

      // GFR rolls up under RUS engineering contracts.
      const ecs = (window.engineeringContractsCache || []).filter(e =>
        e.client_id === state.client_id &&
        (program === 'gfr' ? e.program === 'rus' : e.program === program)
      );

      const ecRow = _q(ids.ecRow);
      const noEcRow = _q(ids.noEcRow);

      if (ecs.length > 0) {
        if (ecRow) ecRow.style.display = '';
        if (noEcRow) noEcRow.style.display = 'none';
        const ecSel = _q(ids.ec);
        if (ecSel) {
          ecSel.innerHTML = '<option value="">— select contract —</option>' +
            ecs.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''))
              .map(ec => {
                const lbl = (ec.client_name || '?') + ' · ' + ec.name +
                  (ec.contract_number ? ' – ' + ec.contract_number : '');
                return `<option value="${_esc(ec.id)}">${_esc(lbl)}</option>`;
              }).join('');
          ecSel.disabled = false;
          if (ecs.length === 1) {
            ecSel.value = ecs[0].id;
            await onEcChanged();
            return;
          }
        }
      } else {
        if (ecRow) ecRow.style.display = 'none';
        if (noEcRow) noEcRow.style.display = '';
      }

      // Job input becomes available even before SA pick.
      const jobInp = _q(ids.jobInput);
      if (jobInp) jobInp.disabled = false;

      _emit();
    }

    // ── Step 3a: EC changed (EC mode) ──
    async function onEcChanged() {
      const ecSel = _q(ids.ec);
      const ecId = ecSel ? (ecSel.value || null) : null;
      state.ec_id = ecId;
      state.sa_id = null;
      state.work_order_number = null;

      const sa = _q(ids.sa);
      const saHint = _q(ids.saHint);
      if (sa) {
        sa.innerHTML = '<option value="">— loading… —</option>';
        sa.disabled = true;
      }
      if (saHint) saHint.style.display = 'none';

      if (!ecId) {
        if (sa) sa.innerHTML = '<option value="">— pick contract first —</option>';
        _emit();
        return;
      }

      try {
        let sas = _ecSaCache[ecId];
        if (!sas) {
          sas = await _safeApi('/api/engineering-contracts/' + encodeURIComponent(ecId) + '/service-areas');
          _ecSaCache[ecId] = sas;
        }
        if (sa) {
          if (sas.length === 0) {
            sa.innerHTML = '<option value="">No service areas configured</option>';
            if (saHint) {
              const ec = (window.engineeringContractsCache || []).find(e => e.id === ecId);
              const ecName = ec ? (ec.name || ec.contract_number || 'this contract') : 'this contract';
              saHint.textContent = `No service areas configured for ${ecName}. Add them via Settings → Engineering Contracts.`;
              saHint.style.display = '';
            }
          } else {
            sa.innerHTML = '<option value="">— select service area —</option>' +
              sas.map(s => {
                const wo = s.work_order_number ? ` (WO# ${_esc(s.work_order_number)})` : '';
                return `<option value="${_esc(s.id)}">${_esc(s.name)}${wo}</option>`;
              }).join('');
            sa.disabled = false;
            if (sas.length === 1) {
              sa.value = sas[0].id;
              onSaChanged();
              return;
            }
          }
        }
      } catch (e) {
        if (sa) sa.innerHTML = '<option value="">Error loading service areas</option>';
        if (window.LFS_DEBUG) console.warn('[ProjectCascade] EC change failed', e);
      }

      const jobInp = _q(ids.jobInput);
      if (jobInp) jobInp.disabled = false;
      _emit();
    }

    // ── Step 3b: SA changed (EC mode) ──
    function onSaChanged() {
      const sa = _q(ids.sa);
      const saId = sa ? (sa.value || null) : null;
      state.sa_id = saId;
      const sas = (state.ec_id && _ecSaCache[state.ec_id]) || [];
      const saRow = sas.find(s => s.id === saId);
      state.work_order_number = saRow ? (saRow.work_order_number || null) : null;
      state.service_area_label = saRow ? saRow.name : null;
      _autoFillName();
      _emit();
    }

    // ── Step 3c: SA free-text typed (no-EC mode) ──
    function onSaFreeTextInput() {
      clearTimeout(_saTypeDebounce);
      _saTypeDebounce = setTimeout(() => {
        const inp = _q(ids.serviceArea);
        state.service_area_label = inp ? (inp.value.trim() || null) : null;
        _autoFillName();
        _emit();
      }, 250);
    }

    // ── Step 4: job typeahead ──
    async function _refreshJobsCache() {
      const key = `${state.client_id || ''}|${state.program || ''}|${state.ec_id || ''}`;
      if (_jobsCache[key]) return _jobsCache[key];
      let url = '/api/jobs';
      const qp = [];
      if (state.ec_id) qp.push('engineering_contract_id=' + encodeURIComponent(state.ec_id));
      else if (state.program && ['rus','bau','gfr','other'].includes(state.program)) {
        qp.push('program=' + encodeURIComponent(state.program));
      } else if (state.client_id) qp.push('client_id=' + encodeURIComponent(state.client_id));
      if (qp.length) url += '?' + qp.join('&');
      try {
        _jobsCache[key] = await _safeApi(url);
      } catch (e) {
        _jobsCache[key] = [];
      }
      return _jobsCache[key];
    }

    async function onJobInput() {
      clearTimeout(_jobDebounce);
      _jobDebounce = setTimeout(async () => {
        const jobs = await _refreshJobsCache();
        const inp = _q(ids.jobInput);
        const dd = _q(ids.jobDropdown);
        if (!inp || !dd) return;
        const q = (inp.value || '').trim().toLowerCase();
        const matches = q
          ? jobs.filter(j => (j.name || '').toLowerCase().includes(q)).slice(0, 5)
          : jobs.slice(0, 5);
        let html = '';
        for (const j of matches) {
          const label = j.name + (j.billing_code ? ' (' + j.billing_code + ')' : '');
          html += `<div role="option" style="padding:8px 12px;cursor:pointer;font-size:13px" tabindex="-1"
            onmousedown="event.preventDefault()"
            data-job-id="${_esc(j.id)}" data-job-name="${_esc(j.name)}"
            onmouseover="this.style.background='var(--surface-3)'"
            onmouseout="this.style.background=''">${_esc(label)}</div>`;
        }
        const exact = jobs.some(j => (j.name || '').toLowerCase() === q);
        if (q && !exact) {
          html += `<div role="option" data-new-job="${_esc(inp.value.trim())}"
            style="padding:8px 12px;cursor:pointer;font-size:13px;color:var(--primary);border-top:1px solid var(--border-weak)"
            tabindex="-1" onmousedown="event.preventDefault()"
            onmouseover="this.style.background='var(--surface-3)'"
            onmouseout="this.style.background=''"
            >+ Create "<strong>${_esc(inp.value.trim())}</strong>" as new job</div>`;
        }
        if (!html) {
          html = '<div style="padding:8px 12px;font-size:13px;color:var(--text-muted)">No jobs found</div>';
        }
        dd.innerHTML = html;
        dd.style.display = '';
      }, 250);
    }

    function _onJobDropdownClick(ev) {
      const t = ev.target.closest('[role="option"]');
      if (!t) return;
      const jobId = t.getAttribute('data-job-id');
      const newJob = t.getAttribute('data-new-job');
      const inp = _q(ids.jobInput);
      const dd = _q(ids.jobDropdown);
      const hidden = _q(ids.job);
      if (jobId) {
        const name = t.getAttribute('data-job-name') || '';
        if (inp) inp.value = name;
        if (hidden) hidden.value = jobId;
        state.job_id = jobId;
        state.new_job_name = null;
      } else if (newJob != null) {
        if (inp) inp.value = newJob;
        if (hidden) hidden.value = '';
        state.job_id = null;
        state.new_job_name = newJob;
      }
      if (dd) dd.style.display = 'none';
      _autoFillName();
      _emit();
    }

    function _onJobBlur() {
      // Delay so click on dropdown option registers first.
      setTimeout(() => {
        const dd = _q(ids.jobDropdown);
        if (dd) dd.style.display = 'none';
      }, 180);
    }

    // ── Wire DOM listeners ──
    const _listeners = [];
    function _bind(elId, ev, fn) {
      const el = _q(elId);
      if (!el) return;
      el.addEventListener(ev, fn);
      _listeners.push({ el, ev, fn });
    }

    _bind(ids.client, 'change', onClientChanged);
    _bind(ids.program, 'change', onProgramChanged);
    _bind(ids.ec, 'change', onEcChanged);
    _bind(ids.sa, 'change', onSaChanged);
    _bind(ids.serviceArea, 'input', onSaFreeTextInput);
    _bind(ids.jobInput, 'input', onJobInput);
    _bind(ids.jobInput, 'blur', _onJobBlur);
    _bind(ids.jobDropdown, 'mousedown', _onJobDropdownClick);

    // Track name field manual edits so auto-fill stops clobbering.
    const nameField = opts.nameFieldId ? _q(opts.nameFieldId) : null;
    if (nameField) {
      const fn = () => { _nameManuallyEdited = true; };
      nameField.addEventListener('input', fn);
      _listeners.push({ el: nameField, ev: 'input', fn });
    }

    // ── Public handle ──
    function reset() {
      _nameManuallyEdited = mode === 'edit';
      state.client_id = null;
      const clientSel = _q(ids.client);
      if (clientSel) clientSel.value = '';
      _resetProgramAndBelow();
      _emit();
    }
    function setValues(v) {
      // Used by edit-mode pre-fill. Pages that need full edit-mode hydration
      // should call this AFTER setting #{prefix}client manually + awaiting
      // onClientChanged so the program/ec dropdowns are populated.
      Object.assign(state, v || {});
      _emit();
    }
    function getValues() { return Object.assign({}, state); }
    function getState() { return Object.assign({}, state); }
    function destroy() {
      _destroyed = true;
      for (const l of _listeners) {
        try { l.el.removeEventListener(l.ev, l.fn); } catch (e) {}
      }
      _listeners.length = 0;
    }

    return { reset, setValues, getValues, getState, destroy,
             // Expose handlers so portal code can call them directly
             // when wiring inline onchange="" attributes (legacy admin
             // pattern) instead of removing those attributes.
             onClientChanged, onProgramChanged, onEcChanged, onSaChanged,
             onSaFreeTextInput, onJobInput };
  }

  // ─── resolve-or-create helper ───────────────────────────────────────────
  // Centralised so all 4 portals stop duplicating the POST body shape.
  function resolveOrCreate(state) {
    if (!state || !state.client_id) {
      return Promise.reject(new Error('client_id is required'));
    }
    const body = {
      client_id: state.client_id,
      program: state.program || null,
      engineering_contract_id: state.ec_id || null,
      service_area_id: state.sa_id || null,
      service_area_label: state.ec_id ? null : (state.service_area_label || null),
      job_id: state.job_id || null,
      new_job_name: state.new_job_name || null,
    };
    if (typeof window.api === 'function') {
      return window.api('/api/projects/resolve-or-create', 'POST', body);
    }
    return fetch('/api/projects/resolve-or-create', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => {
      if (!r.ok) return r.text().then(t => { throw new Error(t || ('HTTP ' + r.status)); });
      return r.json();
    });
  }

  // ─── Expose ─────────────────────────────────────────────────────────────
  window.ProjectCascade = {
    mount,
    resolveOrCreate,
    // Test/debug hooks — clear caches between waves of fixture data.
    _clearCaches() {
      for (const k of Object.keys(_ecSaCache)) delete _ecSaCache[k];
      for (const k of Object.keys(_jobsCache)) delete _jobsCache[k];
    },
  };
})();
