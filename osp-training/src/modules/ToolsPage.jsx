import React, { useState } from 'react';
import LinkBudgetCalculator from '../components/LinkBudgetCalculator.jsx';
import OTDRTraceViewer      from '../components/OTDRTraceViewer.jsx';
import TopologyCanvas       from '../components/TopologyCanvas.jsx';
import Flashcard            from '../components/Flashcard.jsx';
import { ModuleHeader, Section } from '../components/ModuleLayout.jsx';
import { ALL_FLASHCARDS }   from '../data/flashcards.js';

const TABS = [
  { id: 'budget',  label: 'Link Budget' },
  { id: 'otdr',    label: 'OTDR Trace' },
  { id: 'topo',    label: 'Topology Canvas' },
  { id: 'flash',   label: 'Flashcards' },
];

export default function ToolsPage() {
  const [tab, setTab] = useState('budget');
  return (
    <article className="space-y-6">
      <ModuleHeader
        number={'TOOLS'}
        title="Interactive Tools"
        intro="Standalone calculators and viewers used across the curriculum. Settings persist to local storage where applicable."
      />
      <div className="panel">
        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map(t => (
            <button key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition ${
                      tab === t.id ? 'bg-ospamber/20 border-ospamber/50 text-amber-100'
                                   : 'border-white/15 hover:border-white/40'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'budget' && <LinkBudgetCalculator />}
        {tab === 'otdr'   && <OTDRTraceViewer />}
        {tab === 'topo'   && <TopologyCanvas />}
        {tab === 'flash'  && <Flashcard deckId="all" cards={ALL_FLASHCARDS} />}
      </div>
    </article>
  );
}
