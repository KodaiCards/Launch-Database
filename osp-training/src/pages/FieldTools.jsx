/**
 * FieldTools — sandbox page for interactive field tools.
 * Route: /training/tools
 *
 * Tools are available both here (standalone sandbox) and embedded inline
 * within lessons via the primitive components. This kills the old
 * "Interactive Tools" tab pattern — tools now live at a dedicated route
 * AND get woven into lesson content.
 *
 * Tools:
 *   1. Link Budget Calculator (optical power budget planning)
 *   2. Topology Canvas (splice matrix / fiber routing visualization)
 *   3. OTDR Trace Viewer (trace reading practice)
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LinkBudgetCalculator from '../components/LinkBudgetCalculator.jsx';
import TopologyCanvas from '../components/TopologyCanvas.jsx';
import OTDRTraceViewer from '../components/OTDRTraceViewer.jsx';

// ── Tool section wrapper ──────────────────────────────────────────────────
function ToolSection({ id, title, description, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section id={id} className="panel">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="shrink-0 text-xs text-slate-400 hover:text-amber-300 transition px-2 py-1 rounded border border-white/10 hover:border-amber-400/30"
          aria-expanded={open}
        >
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {open && (
        <div className="mt-3 border-t border-white/10 pt-4">
          {children}
        </div>
      )}
    </section>
  );
}

// ── Quick-jump nav ────────────────────────────────────────────────────────
function ToolNav() {
  const tools = [
    { id: 'link-budget',    label: 'Link Budget Calculator' },
    { id: 'topology',       label: 'Topology Canvas' },
    { id: 'otdr-viewer',    label: 'OTDR Trace Viewer' },
  ];

  return (
    <nav className="panel flex flex-wrap gap-2" aria-label="Jump to tool">
      <span className="text-xs text-slate-400 self-center mr-1">Jump to:</span>
      {tools.map(t => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className="text-xs px-3 py-1 rounded-full border border-white/15 text-slate-300 hover:border-amber-400/40 hover:text-amber-200 transition"
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}

// ── FieldTools page ───────────────────────────────────────────────────────
export default function FieldTools() {
  return (
    <div className="space-y-6">
      {/* ── Page header ───────────────────────────────────────────── */}
      <header className="panel">
        <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-1">
          <Link to="/" className="hover:text-amber-300 transition">All courses</Link>
          {' → '}
          Field Tools
        </div>
        <h1 className="text-2xl font-bold text-slate-50">Field Tools Sandbox</h1>
        <p className="text-sm text-slate-400 mt-2">
          Interactive calculation and visualization tools for OSP field work.
          These tools are also embedded directly in the relevant lessons — this
          page lets you use them standalone without navigating through a course.
        </p>
      </header>

      <ToolNav />

      {/* ── Tool 1: Link Budget Calculator ───────────────────────── */}
      <ToolSection
        id="link-budget"
        title="Link Budget Calculator"
        description="Plan optical power budgets: enter transmit power, fiber length, connector/splice counts, and see whether the link passes your receive sensitivity threshold."
      >
        <LinkBudgetCalculator />
      </ToolSection>

      {/* ── Tool 2: Topology Canvas ───────────────────────────────── */}
      <ToolSection
        id="topology"
        title="Topology Canvas"
        description="Visualize fiber splice matrices and cable routing. Map tube/fiber assignments, trace express vs. split paths, and export your layout."
      >
        <TopologyCanvas />
      </ToolSection>

      {/* ── Tool 3: OTDR Trace Viewer ─────────────────────────────── */}
      <ToolSection
        id="otdr-viewer"
        title="OTDR Trace Viewer"
        description="Practice reading OTDR traces: identify reflection events, measure event loss, locate fiber breaks, and interpret the event table."
      >
        <OTDRTraceViewer />
      </ToolSection>
    </div>
  );
}
