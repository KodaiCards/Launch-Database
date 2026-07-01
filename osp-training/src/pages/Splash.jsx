/**
 * Splash — section-scoped course catalog page.
 *
 * Used for two routes:
 *   /osp   → section="osp"  — shows all general OSP topics (T01-T20 + C05 final exam)
 *   /isp   → section="isp"  — ISP placeholder ("coming soon") + migrated ISP catalog entries
 *
 * Cert tracks live at /cert → CertTrackChooser (separate component).
 *
 * Per directive 36 (2026-05-18): top-level chooser is / → ProductChooser.
 * Splash is a section-scoped sub-page, not the root.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/course-catalog.js';
import { useAllProgress } from '../hooks/useProgress.js';
import { useMyContent } from '../hooks/useMyContent.js';

// ── Progress ring (simple CSS arc) ─────────────────────────────────────────
function ProgressRing({ pct }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg width="40" height="40" className="shrink-0" aria-hidden="true">
      <circle cx="20" cy="20" r={r} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r}
        fill="none"
        stroke={pct === 100 ? '#4ade80' : '#f59e0b'}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
      <text x="20" y="24" textAnchor="middle" fontSize="9" fill="white" fillOpacity="0.7">
        {pct}%
      </text>
    </svg>
  );
}

// ── CTA button label ────────────────────────────────────────────────────────
function ctaLabel(pct) {
  if (pct === 0) return 'Start';
  if (pct === 100) return 'Completed';
  return 'Continue';
}

// ── Locked tile (coming soon) ───────────────────────────────────────────────
function LockedCourseTile({ course }) {
  const isMigrated = course.migrated === true;
  const badge = isMigrated ? 'Coming in ISP Course' : 'Coming Soon';

  return (
    <div
      className="block panel opacity-50 cursor-not-allowed select-none"
      aria-disabled="true"
      role="article"
    >
      <div className="flex items-start gap-4">
        <svg width="40" height="40" className="shrink-0" aria-hidden="true">
          <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="3" />
          <text x="20" y="24" textAnchor="middle" fontSize="14" fill="white" fillOpacity="0.25">🔒</text>
        </svg>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-500">{course.id}</span>
            <h3 className="text-base font-semibold text-slate-400 truncate">
              {course.title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>{course.lesson_count} lessons</span>
          </div>
        </div>

        <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full border self-center border-slate-600/40 text-slate-500 bg-slate-800/20">
          {badge}
        </span>
      </div>
    </div>
  );
}

// ── Course tile ─────────────────────────────────────────────────────────────
function CourseTile({ course, progressPct }) {
  const cta = ctaLabel(progressPct);
  const completed = progressPct === 100;

  if (course.available === false) {
    return <LockedCourseTile course={course} />;
  }

  return (
    <Link
      to={`/course/${course.id}`}
      className={[
        'block panel hover:ring-1 hover:ring-amber-400/40 transition group',
        completed ? 'border-green-500/30' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <ProgressRing pct={progressPct} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-400">{course.id}</span>
            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-amber-200 transition">
              {course.title}
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{course.lesson_count} lessons</span>
            {course.prerequisites?.length > 0 && (
              <>
                <span>&middot;</span>
                <span>Prereq: {course.prerequisites.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        <span
          className={[
            'shrink-0 text-xs font-semibold px-3 py-1 rounded-full border self-center',
            completed
              ? 'border-green-400/40 text-green-300 bg-green-800/20'
              : 'border-amber-400/40 text-amber-300 bg-amber-800/20',
          ].join(' ')}
        >
          {cta}
        </span>
      </div>
    </Link>
  );
}

// ── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ label, count, description }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-slate-100">{label}</h2>
        {count != null && (
          <span className="text-xs text-slate-400">{count} courses</span>
        )}
      </div>
      {description && (
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}

// ── ISP coming-soon placeholder ─────────────────────────────────────────────
function ISPComingSoon({ ispCourses }) {
  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="panel border-ospsteel/60 bg-ospsteel/20 text-center py-10">
        <div className="text-4xl mb-3">🏢</div>
        <h2 className="text-2xl font-bold mb-2">Inside Plant Course</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Deep inside-plant training covering CO and headend architecture, structured cabling
          (TIA-568/569/606/607), data center standards (TIA-942), full multimode treatment,
          long-haul and DWDM awareness, and RCDD certification prep.
        </p>
        <div className="mt-4 inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-ospsteel/60 text-slate-300 border border-white/10">
          Launching after OSP course rollout — 2026 Q3
        </div>
      </div>

      {/* Migrated course previews */}
      {ispCourses.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">
            Coming in ISP Course
          </div>
          <div className="space-y-3">
            {ispCourses.map(course => (
              <div
                key={course.id}
                className="block panel opacity-40 cursor-not-allowed select-none"
                aria-disabled="true"
                role="article"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-white/10 text-slate-500 text-lg">
                    🔒
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-mono text-xs text-slate-500">{course.id}</span>
                      <h3 className="text-base font-semibold text-slate-400 truncate">
                        {course.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                      {course.description?.replace(/^MIGRATED TO FUTURE ISP COURSE[^.]*\. /, '')}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full border self-center border-slate-600/40 text-slate-500 bg-slate-800/20">
                    ISP Course
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Splash ──────────────────────────────────────────────────────────────────
// section prop: 'osp' | 'isp'
// (cert section handled separately by CertTrackChooser)
export default function Splash({ section = 'osp' }) {
  const { getTopicProgress } = useAllProgress();
  const mc = useMyContent();

  const coursesArray = courses || [];

  // OSP section: show general topics (section: 'general') + C05 final exam,
  // filtered to what this person may see (content visibility).
  const ospCourses = coursesArray.filter(
    c => (c?.section === 'general' || c?.id === 'C05') && mc.subjectVisible(c.id)
  );

  // ISP section: show isp-tagged courses (C01/C02/C03 migrated placeholders)
  const ispCourses = coursesArray.filter(c => c?.section === 'isp');

  if (section === 'isp') {
    return (
      <div className="space-y-6">
        {/* Back navigation breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-amber-200 transition">
            ← Back to Courses
          </Link>
        </div>
        <ISPComingSoon ispCourses={ispCourses} />
      </div>
    );
  }

  // Default: OSP section
  return (
    <div className="space-y-8">
      {/* Back navigation breadcrumb */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-slate-400 hover:text-amber-200 transition">
          ← Back to Courses
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-1">OSP Course</h1>
        <p className="text-slate-400 text-sm">
          Outside Plant engineering — from fundamentals to construction, testing, and program compliance.
          Follow the teaching order: start at T01 and work through to T20.
        </p>
      </div>

      {/* OSP general topics */}
      <section aria-label="OSP course topics">
        <SectionHeader
          label="Course Topics"
          count={mc.ready ? ospCourses.length : undefined}
          description="No prior engineering background required. Every term is defined before it's used."
        />
        <div className="space-y-3">
          {/* Skeleton until visibility resolves — never render-all-then-hide (WP-A). */}
          {!mc.ready && [0, 1, 2].map(i => (
            <div key={i} className="panel animate-pulse">
              <div className="h-5 w-48 bg-white/15 rounded" />
              <div className="mt-2 h-3 w-full bg-white/5 rounded" />
            </div>
          ))}
          {mc.ready && ospCourses.map(course => (
            <CourseTile
              key={course?.id}
              course={course}
              progressPct={getTopicProgress(course?.id, course?.lesson_count || 0)}
            />
          ))}
          {mc.ready && ospCourses.length === 0 && (
            <div className="panel text-slate-400 text-sm">No OSP topics are available to your account yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
