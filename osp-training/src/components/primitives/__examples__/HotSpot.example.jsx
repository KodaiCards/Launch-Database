import React from 'react';
import HotSpot from '../HotSpot.jsx';

/**
 * HotSpot.example — "Find the safety violation" on an aerial pole attachment.
 *
 * The placeholder image is a solid dark rectangle. In a real lesson, replace
 * `src` with an actual pole photograph. Region coordinates (x, y, w, h) are
 * percentages of the image dimensions, so they travel with the image regardless
 * of viewport size.
 */

// Placeholder image — a simple SVG pole diagram so the example is self-contained.
const POLE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#0b1d3a"/>
  <!-- Sky / background -->
  <rect width="400" height="200" fill="#0f2744"/>
  <!-- Ground -->
  <rect y="200" width="400" height="100" fill="#1a2e1a"/>
  <!-- Pole -->
  <rect x="185" y="20" width="30" height="260" fill="#8B6914" rx="3"/>
  <!-- Crossarm -->
  <rect x="100" y="70" width="200" height="12" fill="#6B5010" rx="2"/>
  <!-- Guy wire (normal) -->
  <line x1="185" y1="75" x2="50" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <!-- NESC violation: guy wire attached too high (above attachment point) -->
  <line x1="215" y1="40" x2="360" y2="200" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 3"/>
  <!-- Power conductors -->
  <line x1="100" y1="76" x2="50" y2="90" stroke="#fbbf24" stroke-width="3"/>
  <line x1="300" y1="76" x2="350" y2="90" stroke="#fbbf24" stroke-width="3"/>
  <!-- Fiber attachment (too close to power) -->
  <circle cx="200" cy="100" r="6" fill="#22d3ee" stroke="#0ea5e9" stroke-width="2"/>
  <line x1="200" y1="106" x2="200" y2="170" stroke="#22d3ee" stroke-width="2"/>
  <!-- Splice case (unsupported) -->
  <rect x="195" y="155" width="30" height="18" fill="#6366f1" rx="3"/>
  <!-- Labels -->
  <text x="200" y="292" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="monospace">
    Pole attachment diagram (schematic — not to scale)
  </text>
</svg>
`)}`;

const POLE_REGIONS = [
  {
    id: 'guy-wire-violation',
    x: 50,
    y: 5,
    w: 25,
    h: 60,
    isCorrect: true,
    label: 'Guy wire attachment height',
    feedback:
      'The red dashed guy wire is attached ABOVE the crossarm — a NESC §261 violation. '
      + 'Guy wires must attach at or below the level of the highest attachment on the pole. '
      + 'A guy wire higher than the top attachment creates a lever arm that increases bending '
      + 'moment on the pole under ice/wind load, potentially causing pole failure.',
  },
  {
    id: 'fiber-clearance',
    x: 42,
    y: 28,
    w: 16,
    h: 22,
    isCorrect: true,
    label: 'Fiber-to-power clearance',
    feedback:
      'The fiber attachment (cyan circle) is only ~2 ft below the power conductors. '
      + 'NESC §235C Table 235-5 requires a minimum 40-inch vertical separation between '
      + 'power conductors and communication cables on a jointly-used pole. '
      + 'This attachment would fail a make-ready inspection.',
  },
  {
    id: 'splice-case',
    x: 46,
    y: 52,
    w: 12,
    h: 10,
    isCorrect: false,
    label: 'Splice case (acceptable)',
    feedback:
      'The splice case location is not the violation here. It is within the communications '
      + 'space and appears to have a support bracket. Check that it is within the 40-inch '
      + 'separation zone from power, but in this diagram the main issues are above it.',
  },
];

export default function HotSpotExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">HotSpot — Example Usage</h1>

      <HotSpot
        title="Find the NESC Violations"
        description={
          'This pole attachment has two NESC violations that would fail a make-ready inspection. '
          + 'Click each region you think contains a violation. '
          + 'You can click multiple regions — each click reveals feedback.'
        }
        src={POLE_SVG}
        alt="Pole attachment diagram showing NESC violations"
        aspectRatio={4 / 3}
        mode="challenge"
        regions={POLE_REGIONS}
      />
    </div>
  );
}
