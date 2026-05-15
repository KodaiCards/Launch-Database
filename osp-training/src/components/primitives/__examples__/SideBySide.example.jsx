import React from 'react';
import SideBySide from '../SideBySide.jsx';

/**
 * SideBySide.example — Aerial vs. underground OSP construction comparison.
 *
 * Shows the key differences between the two most common OSP deployment methods.
 * The 'highlight' prop marks the cost row as the most decisive distinction.
 */

const AERIAL_VS_UNDERGROUND = [
  {
    label: 'Upfront cost',
    leftValue: 'Lower — typically $5–$15/ft including make-ready. Pole attachment fees ongoing.',
    rightValue: 'Higher — $15–$60/ft for direct-buried; $40–$120/ft for conduit systems.',
    note: 'RUS 2025 unit cost guide used as reference range. Actual costs vary by region and soil type.',
  },
  {
    label: 'Long-term risk',
    leftValue: 'Exposed to wind, ice, vehicle strikes, and tree contact. Higher outage frequency.',
    rightValue: 'Protected from most weather and vehicular damage after installation.',
  },
  {
    label: 'Construction time',
    leftValue: 'Faster — a crew can string 1–3 miles of aerial per day once poles are ready.',
    rightValue: 'Slower — trenching, conduit laying, and backfill are labor-intensive.',
  },
  {
    label: 'Permitting',
    leftValue: 'Requires pole attachment agreements and make-ready survey. Joint-use tariffs apply.',
    rightValue: 'Requires ROW permits, dig permits, One-Call (811) notification, and inspection by local authority.',
  },
  {
    label: 'NESC requirements',
    leftValue: 'NESC §§ 230–235 (overhead line requirements). Loading districts (light/medium/heavy) drive design.',
    rightValue: 'NESC §§ 320–354 (underground requirements). Burial depth depends on voltage class of nearby conductors.',
  },
  {
    label: 'Maintenance access',
    leftValue: 'Immediate — bucket truck or climbing crew can access any span.',
    rightValue: 'Requires locating cable, excavation, or access at handholes/vaults only.',
  },
  {
    label: 'Best use case',
    leftValue: 'Rural routes with existing pole infrastructure. RUS-funded projects often default to aerial where poles exist.',
    rightValue: 'Urban areas, highway crossings, or where aerial is aesthetically/legally prohibited.',
  },
];

export default function SideBySideExample() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">SideBySide — Example Usage</h1>

      <SideBySide
        title="Aerial vs. Underground OSP Construction"
        description="These two deployment methods make up nearly all outside plant fiber routes. The right choice depends on existing infrastructure, budget, and the client's long-term maintenance tolerance."
        leftTitle="Aerial"
        rightTitle="Underground"
        comparisonRows={AERIAL_VS_UNDERGROUND}
        highlight="Upfront cost"
        leftColor="text-sky-300"
        rightColor="text-amber-300"
      />
    </div>
  );
}
