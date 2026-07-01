/**
 * ProductChooser — Top-level product selection (v3).
 *
 * Three tiles: OSP Course (main product), ISP Course (coming soon), Cert Tracks (optional).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useMyContent } from '../hooks/useMyContent.js';

function ProductTile({ icon, title, description, cta, to, disabled }) {
  const Wrapper = disabled ? 'div' : Link;
  const wrapperProps = disabled
    ? { className: 'block panel opacity-50 cursor-not-allowed select-none', role: 'article', 'aria-disabled': 'true' }
    : { to, className: 'block panel hover:ring-1 hover:ring-amber-400/40 transition group' };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{description}</p>
          {!disabled && (
            <button className="mt-3 text-sm font-semibold text-amber-300 group-hover:text-amber-200 transition">
              {cta} →
            </button>
          )}
          {disabled && (
            <div className="mt-2 text-xs font-semibold text-slate-500">Coming in 2026 Q3</div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default function ProductChooser() {
  const mc = useMyContent();
  return (
    <div className="space-y-8">
      {/* Back to Launcher button */}
      <div className="flex items-center gap-2 -mx-6 px-6 py-2 -mt-2">
        <a
          href="/"
          className="text-sm text-slate-400 hover:text-amber-200 transition inline-flex items-center gap-1"
          title="Exit to portal launcher"
        >
          ← Back to Launcher
        </a>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Launch Training</h1>
        <p className="text-slate-400">Choose your learning path</p>
      </div>

      <div className="grid gap-4">
        {/* Skeleton until visibility resolves — never render-all-then-hide (WP-A). */}
        {!mc.ready && [0, 1].map(i => (
          <div key={i} className="panel animate-pulse">
            <div className="flex items-start gap-4">
              <div className="h-9 w-9 rounded bg-white/10 shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-40 bg-white/15 rounded" />
                <div className="mt-2 h-3 w-full bg-white/5 rounded" />
                <div className="mt-1.5 h-3 w-3/4 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}

        {mc.ready && mc.trackVisible('osp') && (
          <ProductTile
            icon="📚"
            title="OSP Course"
            description="Build comprehensive Outside Plant engineering knowledge from fundamentals through construction, testing, and final certification."
            cta="Start Learning"
            to="/osp"
          />
        )}

        {mc.ready && mc.trackVisible('isp') && (
          <ProductTile
            icon="🏢"
            title="Inside Plant (ISP) Course"
            description="Deep Inside Plant training with CO/headend architecture, structured cabling, data center standards, and RCDD certification prep."
            cta="Learn More"
            to="/isp"
          />
        )}

        {mc.ready && mc.trackVisible('cert') && (
          <ProductTile
            icon="🎓"
            title="Certification Tracks"
            description="Accelerated specialized courses: BICSI OSP Designer, FOA CFOS-O. For those pursuing formal credentials."
            cta="Browse Exams"
            to="/cert"
          />
        )}

        {mc.ready && !mc.trackVisible('osp') && !mc.trackVisible('isp') && !mc.trackVisible('cert') && (
          <div className="panel text-slate-400 text-sm">No training has been assigned to your account yet. Contact your administrator.</div>
        )}
      </div>
    </div>
  );
}
