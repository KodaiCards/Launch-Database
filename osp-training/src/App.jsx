/**
 * App.jsx — OSP Training SPA root
 *
 * BACKWARDS-COMPAT STRATEGY: PARALLEL ROUTER
 * ─────────────────────────────────────────────────────────────────────────────
 * The existing useState-based sidebar nav (12 modules) continues to work until
 * OSP-RW.7's production cut. The new React Router tree runs ALONGSIDE it.
 *
 * Feature flag: USE_NEW_ROUTER (env var or localStorage override)
 *   - VITE_USE_NEW_ROUTER=true  → serves the new Router-based SPA (OSP-RW build)
 *   - Default (no flag)         → serves the original module sidebar (existing behavior)
 *   - Override in browser: localStorage.setItem('ospUseNewRouter', 'true')
 *
 * The production cut (OSP-RW.7) will flip USE_NEW_ROUTER to the default-true
 * value by removing the flag check entirely and deleting the legacy block.
 *
 * This means:
 *   • The live /training/ URL still shows the original 12-module sidebar until
 *     OSP-RW.7 runs. No user-facing change during the rewrite.
 *   • Developers/reviewers can set the localStorage flag to preview the new SPA.
 *   • Both code paths compile and ship in the same build — no branching builds.
 */

import React, { useState } from 'react';

// ── New Router imports ───────────────────────────────────────────────────────
import {
  HashRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Splash      from './pages/Splash.jsx';
import CourseView  from './pages/CourseView.jsx';
import LessonRouter from './pages/LessonRouter.jsx';
import FieldTools  from './pages/FieldTools.jsx';
import CertTrack   from './pages/CertTrack.jsx';
import NotFound    from './pages/NotFound.jsx';

// ── Legacy module imports (existing behavior, keep until OSP-RW.7) ───────────
import Module01_FiberPhysics       from './modules/Module01_FiberPhysics.jsx';
import Module02_OSPDesign          from './modules/Module02_OSPDesign.jsx';
import Module03_PermittingPlanning from './modules/Module03_PermittingPlanning.jsx';
import Module04_Splicing           from './modules/Module04_Splicing.jsx';
import Module05_NetworkingBlueprints from './modules/Module05_NetworkingBlueprints.jsx';
import Module06_RCDDCore           from './modules/Module06_RCDDCore.jsx';
import Module07_FiberTopology      from './modules/Module07_FiberTopology.jsx';
import Module08_TestingOTDR        from './modules/Module08_TestingOTDR.jsx';
import Module09_OSPConstruction    from './modules/Module09_OSPConstruction.jsx';
import Module10_DataCenter         from './modules/Module10_DataCenter.jsx';
import Module11_RevenueEstimation  from './modules/Module11_RevenueEstimation.jsx';
import Module12_CertificationSim   from './modules/Module12_CertificationSim.jsx';
import ToolsPage from './modules/ToolsPage.jsx';

// ── Feature flag check ───────────────────────────────────────────────────────
const ENV_FLAG = import.meta.env.VITE_USE_NEW_ROUTER === 'true';
function isNewRouterEnabled() {
  if (ENV_FLAG) return true;
  try {
    return localStorage.getItem('ospUseNewRouter') === 'true';
  } catch {
    return false;
  }
}

// ── React Query client (shared across new router tree) ───────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 min stale time
      retry: 1,
    },
  },
});

// ══════════════════════════════════════════════════════════════════════════════
// NEW ROUTER TREE (OSP-RW rewrite)
// ══════════════════════════════════════════════════════════════════════════════

function NewAppLayout() {
  const location = useLocation();

  // Active link helper
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { to: '/training/', exact: true, label: 'All Courses' },
    { to: '/training/tools', label: 'Field Tools' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-ospnavy/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300/80">
              Launch Fiber Services · OSP Training
            </div>
            <Link to="/training/" className="text-lg font-semibold hover:text-amber-200 transition">
              BICSI OSP · RCDD · FOA CFOS
            </Link>
          </div>

          <nav className="flex items-center gap-4" aria-label="Training navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/training/'}
                className={({ isActive: active }) =>
                  [
                    'text-sm transition px-3 py-1 rounded-md',
                    active
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                      : 'text-slate-300 hover:text-amber-200 hover:bg-white/5',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <Routes>
          {/* Splash — course catalog */}
          <Route path="/training/" element={<Splash />} />

          {/* Field Tools sandbox */}
          <Route path="/training/tools" element={<FieldTools />} />

          {/* Cert track */}
          <Route path="/training/cert/:certId" element={<CertTrack />} />

          {/* Course view */}
          <Route path="/training/course/:courseId" element={<CourseView />} />

          {/* Lesson */}
          <Route path="/training/course/:courseId/lesson/:lessonOrder" element={<LessonRouter />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 text-xs text-slate-400/70">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between flex-wrap gap-2">
          <span>
            Training content includes textbook references and field practice.
            Not a substitute for AHJ-issued permits or stamped engineering drawings.
          </span>
          <span className="text-slate-500">
            Macon, GA · NESC Light loading district
          </span>
        </div>
      </footer>
    </div>
  );
}

function NewApp() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* HashRouter: base path /training/ is handled by Express static;
          in-SPA routing uses hash so React Router doesn't fight the server. */}
      <HashRouter>
        <NewAppLayout />
      </HashRouter>
    </QueryClientProvider>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LEGACY APP (existing module sidebar — unchanged until OSP-RW.7)
// ══════════════════════════════════════════════════════════════════════════════

const MODULES = [
  { id: 1,  title: 'Fiber Physics',                 status: 'ready',     component: Module01_FiberPhysics },
  { id: 2,  title: 'OSP Design',                    status: 'ready',     component: Module02_OSPDesign },
  { id: 3,  title: 'Permitting & Planning',         status: 'ready',     component: Module03_PermittingPlanning },
  { id: 4,  title: 'Splicing Specialist',           status: 'ready',     component: Module04_Splicing },
  { id: 5,  title: 'Networking Blueprints & ISP',   status: 'ready',     component: Module05_NetworkingBlueprints },
  { id: 6,  title: 'RCDD Prep Core',                status: 'ready',     component: Module06_RCDDCore },
  { id: 7,  title: 'Fiber Topology & Matrix',       status: 'ready',     component: Module07_FiberTopology },
  { id: 8,  title: 'Testing (OLTS / OTDR)',         status: 'ready',     component: Module08_TestingOTDR },
  { id: 9,  title: 'OSP Construction',              status: 'ready',     component: Module09_OSPConstruction },
  { id: 10, title: 'Data Center Standards',         status: 'ready',     component: Module10_DataCenter },
  { id: 11, title: 'Revenue & Estimation',          status: 'ready',     component: Module11_RevenueEstimation },
  { id: 12, title: 'Final Certification Sim',       status: 'ready',     component: Module12_CertificationSim },
  { id: 'tools', title: 'Interactive Tools',        status: 'ready',     component: ToolsPage },
];

function LegacyApp() {
  const [activeId, setActiveId] = useState(1);
  const active = MODULES.find(m => m.id === activeId);
  const ActiveComponent = active?.component;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-ospnavy/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300/80">OSP / ISP Master Training</div>
            <div className="text-lg font-semibold">BICSI RCDD &middot; BICSI OSP &middot; FOA CFOS Prep</div>
          </div>
          <div className="text-xs text-slate-300/70">
            Field-vs-textbook research build &middot; v0.1
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6 px-6 py-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="panel">
            <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-3">Modules</div>
            <ul className="space-y-1">
              {MODULES.map(m => {
                const isActive = m.id === activeId;
                const isReady  = m.status === 'ready';
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => isReady && setActiveId(m.id)}
                      disabled={!isReady}
                      className={[
                        'w-full text-left px-3 py-2 rounded-md text-sm transition flex items-center gap-2',
                        isActive ? 'bg-ospamber/20 border border-ospamber/40 text-amber-100'
                                 : 'border border-transparent hover:bg-white/5',
                        !isReady && 'opacity-50 cursor-not-allowed',
                      ].filter(Boolean).join(' ')}
                    >
                      <span className="font-mono text-xs w-6 text-slate-300/60">
                        {typeof m.id === 'number' ? String(m.id).padStart(2, '0') : '··'}
                      </span>
                      <span className="flex-1">{m.title}</span>
                      {!isReady && <span className="badge bg-white/5 text-slate-300/60 border border-white/10">soon</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="panel mt-4 text-xs text-slate-300/80 leading-relaxed">
            <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">Legend</div>
            <p><span className="badge-book">Book</span> &nbsp; standards-citable value (TIA / NESC / ITU-T / BICSI).</p>
            <p className="mt-2"><span className="badge-field">Field</span> &nbsp; common practice; varies by region, AHJ, and contractor.</p>
            <p className="mt-2"><span className="badge-warn">Verify</span> &nbsp; value uncertain or AHJ-dependent — confirm before designing.</p>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          {ActiveComponent
            ? <ActiveComponent />
            : <div className="panel">Module not yet built.</div>}
        </main>
      </div>

      <footer className="border-t border-white/10 text-xs text-slate-400/70">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between">
          <span>Training content includes both textbook references and field practice. See <span className="font-mono">docs/field-vs-textbook-research.md</span>.</span>
          <span>Not a substitute for AHJ-issued permits or stamped engineering drawings.</span>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT — feature-flag switch
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  // Check flag once at mount (no reactivity needed — page reload to switch)
  const [useNew] = useState(() => isNewRouterEnabled());
  return useNew ? <NewApp /> : <LegacyApp />;
}
