import React, { useState } from 'react';
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

export default function App() {
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
