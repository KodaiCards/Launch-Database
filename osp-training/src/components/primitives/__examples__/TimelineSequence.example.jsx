import React from 'react';
import TimelineSequence from '../TimelineSequence.jsx';

/**
 * TimelineSequence.example — OSP aerial project phases in chronological order.
 *
 * Covers the typical lifecycle from route survey to final as-built closeout.
 * Users drag or arrow the nodes into the correct sequence.
 */

const PROJECT_EVENTS = [
  { id: 'closeout',     label: 'As-built & closeout documentation' },
  { id: 'design',       label: 'Engineering design & staking' },
  { id: 'acceptance',   label: 'OTDR acceptance testing' },
  { id: 'survey',       label: 'Route survey & feasibility' },
  { id: 'construction', label: 'Aerial construction & lashing' },
  { id: 'permits',      label: 'Permit applications & make-ready survey' },
  { id: 'splicing',     label: 'Fiber splicing & splice case installation' },
  { id: 'makeready',    label: 'Make-ready construction' },
];

const CORRECT_ORDER = [
  'survey',
  'design',
  'permits',
  'makeready',
  'construction',
  'splicing',
  'acceptance',
  'closeout',
];

export default function TimelineSequenceExample() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">TimelineSequence — Example Usage</h1>

      <TimelineSequence
        title="Aerial OSP Project Lifecycle"
        prompt="Drag the project phases into the correct chronological order. Getting the sequence wrong in the field means wasted trips — you can't pull cable before make-ready is done, and you can't close out before you've passed OTDR acceptance."
        events={PROJECT_EVENTS}
        correctOrder={CORRECT_ORDER}
        explanation={
          'Make-ready always happens BEFORE construction — the poles have to be ready to accept new attachments. '
          + 'OTDR acceptance happens after splicing is complete and before the project is closed out. '
          + 'Closeout (as-built drawings, splice records, RUS Form 675 if applicable) is the final step — '
          + 'no payment on most government contracts until as-built is delivered.'
        }
        citation="RUS Bulletin 1751F-630 §3 — Project Completion Requirements."
        fieldNote="The most common scheduling mistake is starting construction before all permits are approved. A single missing pole attachment permit can halt an entire crew mid-route."
      />
    </div>
  );
}
