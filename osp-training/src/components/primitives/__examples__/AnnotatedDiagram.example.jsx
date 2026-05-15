import React from 'react';
import AnnotatedDiagram from '../AnnotatedDiagram.jsx';

/**
 * AnnotatedDiagram.example — Fiber cable cross-section with labeled hot-points.
 *
 * NOTE: In production lessons, replace `src` with a real image path.
 * For this example we use a data-URI placeholder rectangle so the demo
 * runs without any external asset.
 */

// A simple SVG-as-data-URI placeholder that shows a cable cross-section shape.
// In a real lesson, swap this for: '/training/assets/cable-cross-section.png'
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
  <rect width="400" height="225" fill="#0b1d3a"/>
  <!-- Outer jacket -->
  <circle cx="200" cy="112" r="90" fill="#1f3a5f" stroke="#f59e0b" stroke-width="2"/>
  <!-- Strength members -->
  <circle cx="200" cy="112" r="65" fill="#0b1d3a" stroke="#475569" stroke-width="1"/>
  <!-- Buffer tubes (ring of 6) -->
  <circle cx="200" cy="55"  r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <circle cx="251" cy="84"  r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <circle cx="251" cy="140" r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <circle cx="200" cy="169" r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <circle cx="149" cy="140" r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <circle cx="149" cy="84"  r="14" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
  <!-- Central strength member -->
  <circle cx="200" cy="112" r="10" fill="#f59e0b" stroke="#fbbf24" stroke-width="1"/>
  <!-- Labels -->
  <text x="200" y="220" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="monospace">
    Loose-tube cable cross-section (schematic)
  </text>
</svg>
`)}`;

const CABLE_HOT_POINTS = [
  {
    id: 'jacket',
    x: 73,
    y: 28,
    label: 'Outer Jacket',
    explanation:
      'The outer jacket (typically HDPE or LLDPE) is the first line of defense against UV radiation, moisture, crush loads, and rodent damage. '
      + 'Aerial cables use UV-stabilized black polyethylene. Direct-buried cables get an additional flooding compound inside the jacket.',
    type: 'click',
  },
  {
    id: 'strength',
    x: 62,
    y: 55,
    label: 'Strength Members',
    explanation:
      'Aramid yarn (Kevlar®) or fiberglass rods run the length of the cable. They absorb tensile load during pulling and prevent the glass fibers '
      + 'from stretching beyond their rated strain limit (~0.30% for most single-mode fiber). Never cut these by accident — they carry the pull load, not the fibers.',
    type: 'click',
  },
  {
    id: 'buffer',
    x: 73,
    y: 72,
    label: 'Buffer Tubes',
    explanation:
      'Each blue cylinder is a loose buffer tube containing 12 single-mode fibers packed in gel or dry tape. '
      + 'The "loose" design lets fibers move slightly within the tube, which protects them from bending stress when the cable expands or contracts with temperature changes.',
    type: 'click',
  },
  {
    id: 'central',
    x: 50,
    y: 50,
    label: 'Central Member',
    explanation:
      'A glass-reinforced plastic (GRP) or steel rod at the center of the cable adds compressive rigidity. '
      + 'Without it, the cable would kink under its own weight when coiled. Ground this member at both ends of any metallic variant to prevent induced voltage buildup.',
    type: 'click',
  },
];

export default function AnnotatedDiagramExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">
        AnnotatedDiagram — Example Usage
      </h1>

      <AnnotatedDiagram
        title="Loose-Tube Cable Cross-Section"
        description="Click any pin or label to learn what that layer does and why it matters in the field."
        src={PLACEHOLDER_SVG}
        alt="Loose-tube fiber optic cable cross-section diagram"
        aspectRatio={16 / 9}
        hotPoints={CABLE_HOT_POINTS}
      />
    </div>
  );
}
