// invoice_template_engine.js
//
// Reference-PDF-driven invoice generator. Owner uploads a sample PDF for a
// given (job, client) pair. Claude vision analyses the layout and produces
// an HTML template with mustache-style placeholders ({{client.name}},
// {{period.month_year}}, {{#each contracts}}…{{/each}}, etc.). At invoice
// time we substitute real data, optionally let the user edit, and render
// the filled HTML to PDF via puppeteer.
//
// Two responsibilities:
//   analyzeInvoicePdf(pdfBuffer, dataSchema)     → string of filled-with-
//                                                  placeholder HTML
//   substituteTemplate(html, data)               → filled HTML for a real
//                                                  invoice
//   renderHtmlToPdf(html, opts)                  → PDF buffer
//
// Kept separate from invoice_generator.js (the legacy hardcoded PSC RUS
// path) so both can coexist while the owner migrates job-by-job.

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Path to the Launch Fiber Services logo. Same file invoice_generator.js
// uses for the legacy pdfkit PSC RUS path — kept in sync so both paths
// emit the same brand image. Owner-flagged 2026-05-06: AI-generated
// invoice templates were stripping the logo and replacing it with plain
// text "Launch Fiber Services". Now the engine exposes a
// {{{company_logo}}} placeholder that materializes the actual image as
// an inline base64 data URI at render time, and the system prompt
// explicitly tells Claude to use it instead of inline text.
const LOGO_PATH = path.join(__dirname, 'public', 'img', 'launch-fiber-logo-transparent.png');

// Lazy logo loader — first call reads the file once and caches the data
// URI for the lifetime of the process. Falls back to an empty string if
// the file is missing so the rest of the pipeline keeps working.
let _logoDataUri = null;
function _logoUri() {
  if (_logoDataUri !== null) return _logoDataUri;
  try {
    const buf = fs.readFileSync(LOGO_PATH);
    _logoDataUri = 'data:image/png;base64,' + buf.toString('base64');
  } catch (e) {
    console.warn('[invoice_template_engine] logo missing at', LOGO_PATH, '—', e.message);
    _logoDataUri = '';
  }
  return _logoDataUri;
}

// Pre-built <img> tag using the logo data URI. Emitted into templates
// via {{{company_logo}}} (triple-brace = unescaped, so the <img> tag
// renders as actual HTML rather than text). Style is intentionally
// minimal — templates can override by setting their own style on a
// containing element.
function _logoImgTag() {
  const uri = _logoUri();
  if (!uri) return '';
  return `<img src="${uri}" alt="Launch Fiber Services" style="height:60px;width:auto;display:block">`;
}

// Single Anthropic client instance. ANTHROPIC_API_KEY is required at
// boot; if missing, analysis throws a clean error instead of crashing.
let _anthropic = null;
function _client() {
  if (_anthropic) return _anthropic;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set; invoice template analysis requires it.');
  }
  _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

// Lazy puppeteer require so the dep load doesn't block boot when the
// chromium binary is unavailable in dev environments. Render fails with
// a clean error message instead of crashing the process.
let _puppeteer = null;
function _puppet() {
  if (_puppeteer) return _puppeteer;
  try {
    _puppeteer = require('puppeteer');
  } catch (e) {
    throw new Error('puppeteer not installed; PDF render unavailable. ' +
      'Run npm install on the server to fetch the chromium binary.');
  }
  return _puppeteer;
}

// ─── Data schema docstring used in the Claude prompt ─────────────────────────
// What the AI knows about; mirrors invoice_generator.buildInvoiceData()
// shape. Keep in sync if that returns more / different fields.
const DATA_SCHEMA_DOC = `
Available data fields (mustache-style placeholders):

Brand assets — USE THESE INSTEAD OF TEXT FOR THE LOGO:
  {{{company_logo}}}               — pre-built <img> tag for the Launch
                                     Fiber Services logo (TRIPLE braces,
                                     unescaped — outputs raw HTML so the
                                     <img> tag renders correctly). Use
                                     this anywhere the reference PDF
                                     shows the company logo. DO NOT
                                     replace the logo with plain text
                                     like "Launch Fiber Services" —
                                     emit {{{company_logo}}}.
  {{company_logo_url}}             — raw data URI for the same logo
                                     (escaped — use only if you want
                                     to wrap it in your own <img> with
                                     custom sizing, e.g.
                                     <img src="{{company_logo_url}}" style="...">)

Top-level scalars:
  {{client.name}}                  — billing client (e.g. "PSC")
  {{job.name}}                     — job type (e.g. "Inspection")
  {{job.billing_code}}             — short code shown next to WO rows
  {{period.start}}                 — YYYY-MM-DD start of billing period
  {{period.end}}                   — YYYY-MM-DD end
  {{period.month_year}}            — "April 2026" pretty form
  {{rate.amount}}                  — billing rate in $/hr or $/mile
  {{rate.formatted}}               — "$90.00/hr" or "$1.25/mi"
  {{engineering_contract.name}}    — umbrella name
  {{engineering_contract.number}}  — e.g. "RUS 217"
  {{engineering_contract.loan_name}} — e.g. "Reconnect 3" (may be blank)
  {{totals.hours}}                 — grand total hours, 2 decimals
  {{totals.footage}}               — grand footage (only for footage jobs)
  {{totals.amount}}                — grand $ total, formatted "$1,234.56"
  {{generated_at}}                 — ISO timestamp of generation
  {{is_footage}}                   — "true" / "" — branch with {{#if is_footage}}…
  {{is_permitting}}                — "true" / "" — Permitting variant flag

Per-contract list (use {{#each contracts}}…{{/each}}):
  {{friendly_label}}               — "Contract 3" etc.
  {{contract_number}}              — "515-3" etc.
  {{contract_amount}}              — formatted $
  {{contract_hours}}               — total hours on this contract
  {{contract_footage}}             — total footage on this contract
  Inside, per-WO list (use {{#each wos}}…{{/each}}):
    {{work_order_number}}          — "1234"
    {{hours}}                      — formatted hours
    {{footage}}                    — formatted footage
    {{amount}}                     — formatted $

Per-staff timecards (only for hourly jobs; use {{#each timecards}}…{{/each}}):
  {{staff_name}}                   — full name
  {{total_hours}}                  — formatted hours total
  Inside, per-entry list (use {{#each entries}}…{{/each}}):
    {{date}}                       — "Apr 5" formatted
    {{week_ending}}                — week-end label
    {{wo}}                         — short WO# (no "WO#" prefix; template
                                     can prepend if desired)
    {{contract_friendly}}          — "Contract 3"
    {{contract_number}}            — "515-3"
    {{hours}}                      — formatted hours
`;

// ─── Claude analysis: PDF → templated HTML ───────────────────────────────────

async function analyzeInvoicePdf(pdfBuffer, opts = {}) {
  if (!Buffer.isBuffer(pdfBuffer)) throw new Error('pdfBuffer must be a Buffer');
  const client = _client();

  const sysPrompt = `You are converting a sample invoice PDF into an HTML template
for a Node.js invoice generator. Look at the uploaded PDF carefully — its layout,
typography, table structure, colors, and arrangement. Produce a single self-
contained HTML document that mimics the visual format as closely as possible.

SECURITY CONSTRAINTS — these are non-negotiable:
- Never emit <script>, <style>, <iframe>, <object>, <embed>, <form>, or any
  on* event-handler attributes (onclick, onload, onerror, etc.).
- Never reference external resources via <link>, javascript:, data: URIs
  pointing at scripts, or any url(...) in CSS that isn't a plain image.
- Use inline CSS via the style="..." attribute only.
- The output is rendered in a sandboxed iframe with no scripting capability;
  any <script> tags would be ignored anyway, but emitting them would still
  poison hand-editable templates.

Use inline CSS only (no external stylesheets, no <link>, no <style> blocks
in the head — they're harder to edit later). Keep the HTML semantic
(<table>, <thead>, <tbody>, <tfoot>, <h1>, <p>, <strong>, <span>) so the
operator can hand-edit it readably.

LAYOUT FIDELITY — CRITICAL:
The reference PDF is the source of truth. Your output must match it
visually as closely as possible. Specific rules owner has flagged:

- LOGO: where the reference PDF shows the Launch Fiber Services logo
  (almost always at top-center or top-left of the first page), output
  EXACTLY {{{company_logo}}} (triple curly braces — unescaped — yields
  a complete <img> tag). The system injects the actual logo asset at
  render time. DO NOT replace the logo with plain text. DO NOT make
  the logo container too large — the placeholder produces an
  appropriately-sized image already (~60px height).
- LOGO SIZING: if the reference PDF shows the logo at a clearly
  different size, wrap with <img src="{{company_logo_url}}" style="height:NNpx">
  (double braces). Match the visual size in the reference, don't
  invent your own sizing.
- TEXT SIZING: match the reference PDF's font sizes proportionally.
  Title ~24-28px, section headers ~14-16px, body text ~10-12px,
  table cells ~9-11px. Do not blow up text 2x — that signals you
  guessed a size from headless rendering rather than reading the
  reference.
- TABLE COLOR SCHEME: if the reference PDF has colored table headers
  (dark navy, blue, etc.), USE THOSE COLORS in your <th> backgrounds
  with white or near-white text. If the PDF has alternating row
  shading, replicate it. Owner explicitly wants the export to retain
  the same color scheme as the reference — tables WITH colored
  backgrounds, not stripped-down monochrome.
- BACKGROUNDS PRINT: the renderer has printBackground:true. Use
  background-color CSS freely — it'll appear in the printed PDF.
  Don't fall back to "subtle gray border" when the reference shows a
  solid colored bar.
- MARGINS: the renderer uses 0.25in default page margins so
  backgrounds extend almost edge-to-edge. Don't add extra padding on
  the outermost wrapper element to "make it look professional" —
  trust the page margin and put your container flush.

Where the PDF has variable / data-driven content, use mustache-style
placeholders. The available data fields are documented below — use ONLY these
fields. Do NOT invent new ones. If the PDF shows a value you don't have a
field for, use a clearly-labeled stand-in like <!-- TODO: ${'{{field}}'}? -->
and pick the closest available field.

For repeating sections (per-contract sections, per-WO rows, per-staff
timecard pages), use the documented {{#each list}}...{{/each}} blocks.
Inside each block, fields refer to the current item — no path needed
(e.g. inside {{#each contracts}} you write {{friendly_label}} not
{{contracts.friendly_label}}).

For optional sections, use {{#if field}}...{{/if}} (and an optional
{{else}}). The system treats empty strings, false, null, undefined, 0,
and empty arrays as falsy.

Output ONLY the HTML document, starting with <!DOCTYPE html> and ending
with </html>. No markdown fences, no explanation, no prose. The HTML
will be rendered to PDF via puppeteer at letter size with 0.5in margins.

${DATA_SCHEMA_DOC}
`;

  const userText = `Convert this sample invoice PDF into an HTML template
matching its layout. Use the placeholders documented above for variable data.`;

  const resp = await client.messages.create({
    model: opts.model || 'claude-sonnet-4-5',
    max_tokens: 8192,
    system: sysPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBuffer.toString('base64'),
            },
          },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  // Pull the text from the response. content is an array of blocks; we
  // expect a single text block with the HTML.
  const textBlock = (resp.content || []).find(b => b.type === 'text');
  if (!textBlock || !textBlock.text) {
    throw new Error('Claude returned no text content for the invoice template.');
  }
  let html = String(textBlock.text).trim();
  // Strip accidental markdown fences if Claude wrapped in ```html ... ```
  html = html.replace(/^```(?:html)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  // Defence-in-depth: even though the iframe is sandbox="" (no scripting),
  // and the system prompt forbids script-like tags, we strip anything that
  // could run code if a future change loosens the sandbox or if the HTML
  // is exported to a context that does execute scripts. Belt + braces.
  html = sanitizeTemplateHtml(html);
  return html;
}

// Tag-and-attribute scrubber — removes <script>, <style>, <iframe>, etc.,
// strips on* handlers, and rewrites javascript:/data: URIs. Conservative
// allow-list is awkward for hand-edited templates, so we use a deny-list
// targeted at the worst exposures. Intended for HTML that came from
// Claude OR from an admin's textarea — both are semi-trusted.
function sanitizeTemplateHtml(html) {
  if (typeof html !== 'string') return '';
  let out = html;
  // Drop dangerous tags entirely (open + close + content).
  out = out.replace(/<\s*(script|style|iframe|object|embed|form)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  // Strip self-closed / unclosed dangerous tags (void).
  out = out.replace(/<\s*(script|style|iframe|object|embed|form)\b[^>]*>/gi, '');
  // Strip on* event handler attributes: onclick="..", onload='..', onerror=..
  out = out.replace(/\son[a-z]+\s*=\s*"(?:[^"\\]|\\.)*"/gi, '');
  out = out.replace(/\son[a-z]+\s*=\s*'(?:[^'\\]|\\.)*'/gi, '');
  out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '');
  // Neuter javascript: URLs in href / src / action / formaction.
  out = out.replace(/((?:href|src|action|formaction)\s*=\s*['"])\s*javascript:[^'"]*(['"])/gi, '$1#$2');
  return out;
}

// ─── Tiny mustache-like substitution ─────────────────────────────────────────
// Supports:
//   {{var.path.to.x}}       deep lookup, escaped
//   {{{var.path}}}          same but UNESCAPED (raw HTML allowed)
//   {{#each list}}…{{/each}}  iterate; inside, scalar fields refer to the
//                              current item; {{@index}} is 0-based; {{.}}
//                              is the item itself.
//   {{#if cond}}…{{else}}…{{/if}}   conditional; truthy = non-empty
//
// Not Mustache-compliant. Just enough to avoid pulling in a 30KB dep.

function _esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function _lookup(scope, path, parents) {
  if (!path || path === '.' || path === 'this') return scope[0];
  // Walk current scope first; if not found, try parent scopes (handlebars
  // semantics — useful when an inner each block refers to outer fields).
  const segs = path.split('.');
  for (const ctx of [...scope].reverse()) {
    let cur = ctx;
    let ok = true;
    for (const s of segs) {
      if (cur == null) { ok = false; break; }
      cur = cur[s];
    }
    if (ok && cur !== undefined) return cur;
  }
  return undefined;
}
function _isFalsy(v) {
  if (v === undefined || v === null) return true;
  if (v === false || v === 0) return true;
  if (typeof v === 'string' && v === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function substituteTemplate(template, data) {
  if (typeof template !== 'string') return '';
  const tokens = _tokenize(template);
  const result = _parse(tokens, 0);
  // Guard against unterminated blocks. The parser otherwise returns the
  // partial AST and the substitution silently produces broken HTML.
  if (result.next < tokens.length) {
    const tail = tokens.slice(result.next).map(t => t.t).join(',');
    throw new Error(`Template parse error: unmatched closing tag(s) at end (${tail}).`);
  }
  if (result.unmatchedOpen) {
    throw new Error(`Template parse error: unterminated {{#${result.unmatchedOpen}}} block.`);
  }
  return _render(result.nodes, [data]);
}

// Tokenize into text, openTag (each/if), closeTag, elseTag, value, rawValue.
function _tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const open = src.indexOf('{{', i);
    if (open < 0) {
      tokens.push({ t: 'text', v: src.slice(i) });
      break;
    }
    if (open > i) tokens.push({ t: 'text', v: src.slice(i, open) });
    const isRaw = src[open + 2] === '{';
    const closeMarker = isRaw ? '}}}' : '}}';
    const close = src.indexOf(closeMarker, open + (isRaw ? 3 : 2));
    if (close < 0) {
      // Unterminated — treat the rest as text so the operator sees something
      tokens.push({ t: 'text', v: src.slice(open) });
      break;
    }
    const inner = src.slice(open + (isRaw ? 3 : 2), close).trim();
    if (inner.startsWith('#each ')) {
      tokens.push({ t: 'each', v: inner.slice(6).trim() });
    } else if (inner.startsWith('#if ')) {
      tokens.push({ t: 'if', v: inner.slice(4).trim() });
    } else if (inner === 'else') {
      tokens.push({ t: 'else' });
    } else if (inner.startsWith('/each')) {
      tokens.push({ t: '/each' });
    } else if (inner.startsWith('/if')) {
      tokens.push({ t: '/if' });
    } else {
      tokens.push({ t: isRaw ? 'raw' : 'val', v: inner });
    }
    i = close + closeMarker.length;
  }
  return tokens;
}
function _parse(tokens, start, openKind) {
  const nodes = [];
  let i = start;
  while (i < tokens.length) {
    const tk = tokens[i];
    if (tk.t === 'text' || tk.t === 'val' || tk.t === 'raw') {
      nodes.push(tk);
      i++;
    } else if (tk.t === 'each') {
      const inner = _parse(tokens, i + 1, 'each');
      nodes.push({ t: 'each', path: tk.v, body: inner.nodes, elseBody: inner.elseNodes });
      i = inner.next;
    } else if (tk.t === 'if') {
      const inner = _parse(tokens, i + 1, 'if');
      nodes.push({ t: 'if', path: tk.v, body: inner.nodes, elseBody: inner.elseNodes });
      i = inner.next;
    } else if (tk.t === 'else') {
      // Recurse into the else branch; the recursive call consumes up to
      // and including the matching {{/each}} or {{/if}}, so we return its
      // `next` position to the outer parser.
      const elseInner = _parse(tokens, i + 1, openKind);
      return { nodes, elseNodes: elseInner.nodes, next: elseInner.next };
    } else if (tk.t === '/each' || tk.t === '/if') {
      // Closing tag — hand control back to the outer parser AFTER the tag.
      return { nodes, elseNodes: null, next: i + 1 };
    } else {
      i++;
    }
  }
  // Reached end of tokens. If we were inside an open block, the outer
  // call expected a closing tag — flag it for substituteTemplate.
  return { nodes, elseNodes: null, next: i, unmatchedOpen: openKind || null };
}
function _render(nodes, scope) {
  let out = '';
  for (const n of nodes || []) {
    if (n.t === 'text') out += n.v;
    else if (n.t === 'val') out += _esc(_lookup(scope, n.v));
    else if (n.t === 'raw') {
      const v = _lookup(scope, n.v);
      out += v === undefined || v === null ? '' : String(v);
    }
    else if (n.t === 'each') {
      const list = _lookup(scope, n.path);
      if (Array.isArray(list) && list.length) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          // Inside the each block, scalar lookups should hit the current
          // item first, then outer scopes. Add a synthetic { @index } too.
          const itemScope = (typeof item === 'object' && item !== null)
            ? { ...item, '@index': i, '.': item, this: item }
            : { '.': item, this: item, '@index': i };
          out += _render(n.body, [...scope, itemScope]);
        }
      } else if (n.elseBody) {
        out += _render(n.elseBody, scope);
      }
    }
    else if (n.t === 'if') {
      const v = _lookup(scope, n.path);
      if (!_isFalsy(v)) out += _render(n.body, scope);
      else if (n.elseBody) out += _render(n.elseBody, scope);
    }
  }
  return out;
}

// ─── HTML → PDF via puppeteer ────────────────────────────────────────────────

async function renderHtmlToPdf(html, opts = {}) {
  const puppeteer = _puppet();
  // Launch flags chosen for Linux containers (Railway). --no-sandbox is
  // the unfortunate norm for headless Chrome in restricted environments;
  // the alternative is configuring the kernel to allow user namespaces,
  // which is outside our control on Railway.
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    // setContent waits for network idle so any inline images / fonts that
    // are referenced finish loading before we paginate. waitUntil:'load'
    // is the right balance — domcontentloaded misses images, networkidle0
    // hangs forever if the page polls.
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
    // Owner-flagged 2026-05-06: "minimal margins, in color, with
    // background colors on." printBackground was already true; margins
    // dropped from 0.5in to 0.25in so backgrounds extend almost
    // edge-to-edge. preferCSSPageSize honors any @page size in the
    // template (including @page { size: Tabloid; margin: 0 }), which
    // lets owner override per-template if they want the splice-style
    // bleed-to-edge look.
    const pdf = await page.pdf({
      format: opts.format || 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      margin: opts.margin || { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' },
    });
    return pdf;
  } finally {
    try { await browser.close(); } catch {}
  }
}

// ─── Build the data payload from the existing buildInvoiceData shape ─────────
//
// invoice_generator.buildInvoiceData returns { meta, contracts, totals,
// timecards }. The template engine wants a flatter structure with the
// names documented in DATA_SCHEMA_DOC. This adapter normalizes the two.

function _fmtMoney(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function _fmtHours(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function _fmtFootage(ft) {
  const v = Number(ft) || 0;
  if (v >= 5280) return (v / 5280).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ft';
}

function adaptInvoiceDataForTemplate(data) {
  const m = data.meta || {};
  const isFootage = (m.job_billing_type === 'footage') || !!m.is_permitting;
  const logoUri = _logoUri();
  const out = {
    // Brand image. {{{company_logo}}} (triple-brace, unescaped) emits a
    // ready-made <img> tag with the inline base64 logo. Templates that
    // want to compose their own <img> can use {{company_logo_url}}
    // (escaped — it's just a data URI string). If the logo file is
    // missing on disk, both fields are empty and templates degrade
    // gracefully rather than emitting a broken <img>.
    company_logo: logoUri ? _logoImgTag() : '',
    company_logo_url: logoUri,
    client: { name: m.client_name || '' },
    job: {
      name: m.job_name || '',
      billing_code: m.job_billing_code || '',
      billing_type: m.job_billing_type || 'hourly',
    },
    period: {
      start: m.period_start || '',
      end: m.period_end || '',
      month_year: m.month_year || '',
    },
    rate: {
      amount: Number(m.rate) || 0,
      formatted: isFootage ? `${_fmtMoney(m.rate)}/mi` : `${_fmtMoney(m.rate)}/hr`,
    },
    engineering_contract: {
      name: (m.engineering_contract && m.engineering_contract.name) || '',
      number: (m.engineering_contract && m.engineering_contract.contract_number) || '',
      loan_name: (m.engineering_contract && m.engineering_contract.loan_name) || '',
    },
    totals: {
      hours: _fmtHours(data.totals && data.totals.hours),
      footage: _fmtFootage(data.totals && data.totals.footage),
      amount: _fmtMoney(data.totals && data.totals.amount),
    },
    generated_at: new Date().toISOString(),
    is_footage: isFootage ? 'true' : '',
    is_permitting: m.is_permitting ? 'true' : '',
    contracts: (data.contracts || []).map(cs => ({
      friendly_label: cs.friendly_label || '',
      contract_number: cs.contract_number || '',
      contract_amount: _fmtMoney(cs.contract_amount),
      contract_hours: _fmtHours(cs.contract_hours),
      contract_footage: _fmtFootage(cs.contract_footage),
      wos: (cs.wos || []).map(wo => ({
        work_order_number: wo.work_order_number || '',
        hours: _fmtHours(wo.hours),
        footage: _fmtFootage(wo.footage),
        amount: _fmtMoney(wo.amount),
      })),
    })),
    timecards: (data.timecards || []).map(tc => ({
      staff_name: tc.staff_name || '',
      total_hours: _fmtHours(tc.total_hours),
      entries: (tc.entries || []).map(e => ({
        date: e.date || '',
        week_ending: e.week_ending || '',
        wo: e.wo || '',
        contract_friendly: e.contract_friendly || '',
        contract_number: e.contract_number || '',
        hours: _fmtHours(e.hours),
      })),
    })),
  };
  return out;
}

module.exports = {
  analyzeInvoicePdf,
  substituteTemplate,
  renderHtmlToPdf,
  adaptInvoiceDataForTemplate,
  // exported for tests / ad-hoc use
  _internal: { _esc, _tokenize, _parse, _render, _isFalsy, DATA_SCHEMA_DOC },
};
