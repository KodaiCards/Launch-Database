/**
 * LessonLayout — wraps every lesson in the OSP Training rewrite.
 *
 * Receives:
 *   meta     — the named export from the lesson file (see src/lessons/schema.md)
 *   children — the lesson body JSX (foundations / working / advanced sections)
 *
 * Renders:
 *   • Lesson header: title, type badge, estimated time
 *   • Prereq indicator (links to prereq lessons)
 *   • Tiered content (foundations always open; working open; advanced collapsible)
 *   • Footer nav: "Back to course" + "Next lesson" (React Router)
 *   • Progress save hook (stub for OSP-RW.2 API wiring)
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress.js';

// Lets Quiz (and other interactive primitives) report their score to the parent
// lesson so markComplete() is called with a real score once the learner passes.
export const LessonProgressContext = createContext(null);

// ── Tier badge config ───────────────────────────────────────────────────────
const LESSON_TYPE_CONFIG = {
  foundation: {
    label: 'Foundation',
    badge: 'bg-sky-700/30 text-sky-200 border border-sky-400/40',
  },
  working: {
    label: 'Working',
    badge: 'bg-amber-700/30 text-amber-200 border border-amber-400/40',
  },
  advanced: {
    label: 'Advanced',
    badge: 'bg-purple-700/30 text-purple-200 border border-purple-400/40',
  },
  'capstone-quiz': {
    label: 'Capstone Quiz',
    badge: 'bg-rose-700/30 text-rose-200 border border-rose-400/40',
  },
  'mock-exam': {
    label: 'Mock Exam',
    badge: 'bg-red-800/30 text-red-200 border border-red-400/40',
  },
  'hands-on-walkthrough': {
    label: 'Walkthrough',
    badge: 'bg-green-700/30 text-green-200 border border-green-400/40',
  },
};

// ── Clock icon (inline SVG, no icon library dependency) ────────────────────
function ClockIcon() {
  return (
    <svg
      className="inline-block w-4 h-4 mr-1 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Collapsible tier section ────────────────────────────────────────────────
function TierSection({ tierId, label, defaultOpen, className, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`mt-6 ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 text-left group"
        aria-expanded={open}
        aria-controls={`tier-${tierId}`}
      >
        <span
          className={[
            'text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded',
            tierId === 'foundations' ? 'bg-sky-800/40 text-sky-300'
              : tierId === 'working' ? 'bg-amber-800/40 text-amber-300'
              : 'bg-purple-800/40 text-purple-300',
          ].join(' ')}
        >
          {label}
        </span>
        <span className="flex-1 border-t border-white/10" />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div id={`tier-${tierId}`} className="mt-3 space-y-4 text-slate-200 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Prereq strip ────────────────────────────────────────────────────────────
function PrereqStrip({ prerequisites, courseId }) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300/90">
      <span className="font-semibold text-slate-200">Before this lesson, complete: </span>
      {prerequisites.map((prereqId, idx) => {
        // prereqId format: "T02.L01" → course T02, lesson L01
        const [topicId, lessonPart] = prereqId.split('.');
        const lessonId = lessonPart?.replace('L', '') || '01';
        return (
          <React.Fragment key={prereqId}>
            {idx > 0 && <span className="text-slate-500 mx-1">·</span>}
            <Link
              to={`/course/${topicId}/lesson/${String(Number(lessonId)).padStart(2, '0')}`}
              className="font-mono text-amber-300/90 hover:text-amber-200 underline decoration-dotted"
            >
              {prereqId}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Tiered body parser ──────────────────────────────────────────────────────
// Walks children and wraps sections with data-tier into TierSection accordions.
// Children without data-tier are rendered as-is (Quiz components, Flashcard, etc.).
function TieredBody({ children }) {
  const childArray = React.Children.toArray(children);
  const tierSections = { foundations: [], working: [], advanced: [] };
  const other = [];

  childArray.forEach(child => {
    if (!React.isValidElement(child)) {
      other.push(child);
      return;
    }
    const tier = child.props?.['data-tier'];
    if (tier && tierSections[tier]) {
      tierSections[tier].push(child);
    } else {
      other.push(child);
    }
  });

  return (
    <>
      {tierSections.foundations.length > 0 && (
        <TierSection tierId="foundations" label="Foundations" defaultOpen={true}>
          {tierSections.foundations}
        </TierSection>
      )}

      {tierSections.working.length > 0 && (
        <TierSection tierId="working" label="Working Knowledge" defaultOpen={true}>
          {tierSections.working}
        </TierSection>
      )}

      {tierSections.advanced.length > 0 && (
        <TierSection tierId="advanced" label="Advanced" defaultOpen={false}>
          {tierSections.advanced}
        </TierSection>
      )}

      {/* Non-tiered children (quizzes, flashcards, worked examples) render after tiers */}
      {other.length > 0 && (
        <div className="mt-6 space-y-4">
          {other}
        </div>
      )}
    </>
  );
}

const PASS_THRESHOLD = 70; // must match routes/training.js PASS_THRESHOLD

// ── Main LessonLayout ───────────────────────────────────────────────────────
export function LessonLayout({ meta, children }) {
  const { courseId } = useParams();

  const { markSeen, markComplete, status } = useProgress(meta?.id);

  // Best quiz percentage achieved this session (null = no quiz attempted yet)
  const [bestQuizPct, setBestQuizPct] = useState(null);
  // True once the server has confirmed completion_credited in this session
  const [sessionCredited, setSessionCredited] = useState(false);

  useEffect(() => {
    markSeen?.();
  }, [meta?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called by Quiz (and other primitives) via LessonProgressContext when the
  // learner finishes an interactive element with a measurable score (0–100).
  const reportScore = useCallback((pct) => {
    setBestQuizPct(prev => (prev === null ? pct : Math.max(prev, pct)));
    if (pct >= PASS_THRESHOLD) {
      markComplete?.(pct);
      setSessionCredited(true);
    }
  }, [markComplete]);

  if (!meta) {
    return (
      <div className="panel text-rose-300">
        Lesson metadata missing — check the lesson file's named <code>meta</code> export.
      </div>
    );
  }

  const typeConfig = LESSON_TYPE_CONFIG[meta.lesson_type] ?? LESSON_TYPE_CONFIG.foundation;
  const backCourseId = courseId || meta.course_id;
  const nextOrder = (meta.order || 1) + 1;
  const nextLessonPath = `/course/${backCourseId}/lesson/${String(nextOrder).padStart(2, '0')}`;

  const isCredited = sessionCredited || status === 'completed';

  return (
    <LessonProgressContext.Provider value={{ reportScore }}>
      <article className="space-y-0">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="panel">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-1">
                {meta.course_id} &middot; L{String(meta.order).padStart(2, '0')}
              </div>
              <h1 className="text-2xl font-bold text-slate-50">{meta.title}</h1>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeConfig.badge}`}>
                {typeConfig.label}
              </span>
              <span className="text-xs text-slate-400">
                <ClockIcon />
                {meta.estimated_minutes} min
              </span>
            </div>
          </div>

          {/* Prereq strip */}
          <PrereqStrip prerequisites={meta.prerequisites} courseId={backCourseId} />
        </header>

        {/* ── Lesson body ────────────────────────────────────────────── */}
        <div className="panel mt-0 pt-0">
          <TieredBody>{children}</TieredBody>
        </div>

        {/* ── Footer nav ─────────────────────────────────────────────── */}
        <footer className="panel mt-4 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to={`/course/${backCourseId}`}
            className="text-sm text-slate-300 hover:text-amber-200 transition"
          >
            ← Back to course
          </Link>

          {/* No manual "Mark complete" — completion is earned solely by passing
              the lesson's assessment/interactive (reportScore → server gate at
              >=70%). We only surface status here, never a shortcut. */}
          {isCredited ? (
            <span className="text-xs px-3 py-1 rounded border border-emerald-400/40 text-emerald-300 bg-emerald-700/30 font-semibold">
              ✓ Complete
            </span>
          ) : bestQuizPct !== null && bestQuizPct < PASS_THRESHOLD ? (
            <span className="text-[11px] text-rose-300/80 text-center">
              Score {bestQuizPct}% — need {PASS_THRESHOLD}% to earn credit
            </span>
          ) : (
            <span className="text-[11px] text-slate-400/80 text-center">
              Pass the lesson quiz ({PASS_THRESHOLD}%+) to earn credit
            </span>
          )}

          <Link
            to={nextLessonPath}
            className="text-sm text-amber-300 hover:text-amber-100 transition font-semibold"
          >
            Next lesson →
          </Link>
        </footer>
      </article>
    </LessonProgressContext.Provider>
  );
}

export default LessonLayout;
