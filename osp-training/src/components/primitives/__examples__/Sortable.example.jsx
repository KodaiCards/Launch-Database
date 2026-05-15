import React from 'react';
import Sortable from '../Sortable.jsx';

/**
 * Sortable.example — Correct order of steps for a fiber fusion splice.
 * Demonstrates the drag-to-reorder pattern for OSP procedural content.
 */

const SPLICE_STEPS = [
  { id: 'strip-jacket',   label: 'Strip the cable jacket back 1 m using a mid-span access tool.' },
  { id: 'clean-buffer',   label: 'Clean the buffer tubes and remove the flooding gel with isopropyl alcohol.' },
  { id: 'strip-buffer',   label: 'Strip the 250 µm buffer coating from each fiber using a thermal or mechanical stripper.' },
  { id: 'clean-fiber',    label: 'Clean each bare fiber with a lint-free wipe and 99% IPA, wiping from buffer to tip.' },
  { id: 'cleave',         label: 'Cleave the fiber at a 90 ± 0.5° angle using a precision cleaver.' },
  { id: 'splice',         label: 'Load both fibers into the fusion splicer and initiate the fusion cycle.' },
  { id: 'protect',        label: 'Slide a heat-shrink splice protector over the fusion joint and cure in the splicer\'s heater.' },
  { id: 'test-otdr',      label: 'OTDR-test the completed splice from both ends and verify loss ≤ 0.10 dB.' },
  { id: 'organise',       label: 'Organise the spliced fibers in the splice tray with proper bend radius (≥ 30 mm).' },
  { id: 'close-enclosure', label: 'Close and seal the splice enclosure per manufacturer\'s torque specifications.' },
];

// Correct order — matches the array above (they happen to be in order already)
const CORRECT_ORDER = [
  'strip-jacket',
  'clean-buffer',
  'strip-buffer',
  'clean-fiber',
  'cleave',
  'splice',
  'protect',
  'test-otdr',
  'organise',
  'close-enclosure',
];

export default function SortableExample() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">Sortable — Example Usage</h1>

      <Sortable
        title="Fusion Splice Procedure"
        prompt="Drag these steps into the correct sequence for a safe, low-loss fusion splice. Getting the order wrong in the field can mean a bad cleave, contaminated fiber, or a splice that fails acceptance."
        items={SPLICE_STEPS}
        correctOrder={CORRECT_ORDER}
        explanation={
          'Cleaning must happen BEFORE stripping the buffer (not after) to avoid recontaminating the fiber. '
          + 'Cleaving comes immediately before splicing so the end-face doesn\'t have time to collect dust. '
          + 'OTDR testing happens before closing the enclosure so you can still access the splice if it fails.'
        }
        citation="FOA Reference Guide to Fiber Optics, Chapter 8 — Splicing."
        fieldNote="The most common mistake is skipping the IPA clean after stripping. One fingerprint on the fiber end will give you a 0.5 dB or worse splice — it reads as a reflective event on the OTDR and is a dead giveaway."
      />
    </div>
  );
}
