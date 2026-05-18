/**
 * Splash — course catalog landing page.
 *
 * Two sections per Carter's locked 2026-05-15 spec:
 *   1. General Learning Topics (18 topics, top / default)
 *   2. Certification Prep — Advanced (4 cert tracks, bottom / opt-in)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { courses, certTracks } from '../data/course-catalog.js';
import { useAllProgress } from '../hooks/useProgress.js';

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
            <span>&middot;</span>
            <span>{Math.round(course.estimated_minutes / 60 * 10) / 10} hr</span>
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
            <span>&middot;</span>
            <span>{Math.round(course.estimated_minutes / 60 * 10) / 10} hr</span>
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

// ── Cert track tile ─────────────────────────────────────────────────────────
function CertTile({ track, progressPct }) {
  const cta = ctaLabel(progressPct);
  const completed = progressPct === 100;

  // Defensive: guard against missing track or mock_exam_spec
  const spec = track?.mock_exam_spec || { items: 0, time_minutes: 0, pass_threshold: 0 };

  return (
    <Link
      to={`/cert/${track?.id || 'unknown'}`}
      className={[
        'block panel hover:ring-1 hover:ring-purple-400/40 transition group',
        completed ? 'border-green-500/30' : 'border-purple-500/20',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <ProgressRing pct={progressPct} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-purple-400">{track?.id || 'N/A'}</span>
            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-purple-200 transition">
              {track?.title || 'Unknown Cert Track'}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{track?.lesson_count || 0} lessons</span>
            <span>&middot;</span>
            <span>
              Mock exam: {spec.items} Q / {spec.time_minutes} min
            </span>
            <span>&middot;</span>
            <span>Pass: {Math.round((spec.pass_threshold || 0) * 100)}%</span>
          </div>
        </div>

        <span
          className={[
            'shrink-0 text-xs font-semibold px-3 py-1 rounded-full border self-center',
            completed
              ? 'border-green-400/40 text-green-300 bg-green-800/20'
              : 'border-purple-400/40 text-purple-300 bg-purple-800/20',
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
        <span className="text-xs text-slate-400">{count} courses</span>
      </div>
      {description && (
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}

// ── Splash ──────────────────────────────────────────────────────────────────
export default function Splash() {
  const { getTopicProgress } = useAllProgress();

  // Defensive: guard against undefined imports or data shape mismatches
  const coursesArray = courses || [];
  const tracksArray = certTracks || [];

  const generalCourses = coursesArray.filter(c => c?.section === 'general');
  const certCourses    = coursesArray.filter(c => c?.section === 'cert');

  return (
    <div className="space-y-12">
      {/* ── Section 1: General Learning Topics ─────────────────────── */}
      <section aria-labelledby="general-section-heading">
        <SectionHeader
          label="General Learning Topics"
          count={generalCourses.length}
          description="Build OSP knowledge from the ground up — no prior engineering background required. Start at T01 and follow the learning path."
        />
        <div className="space-y-3">
          {(generalCourses || []).map(course => (
            <CourseTile
              key={course?.id}
              course={course}
              progressPct={getTopicProgress(course?.id, course?.lesson_count || 0)}
            />
          ))}
        </div>
      </section>

      {/* ── Section 2: Certification Prep ──────────────────────────── */}
      <section aria-labelledby="cert-section-heading">
        <div className="border-t border-white/10 pt-10">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-purple-800/30 text-purple-300 border border-purple-500/30">
              Advanced — Certification Prep
            </span>
          </div>
          <SectionHeader
            label="Certification Prep"
            count={tracksArray.length}
            description="Dedicated cert-track courses with practice exams. Recommended after completing the General Learning Topics."
          />

          {/* Cert tracks */}
          <div className="space-y-3">
            {tracksArray.map(track => (
              <CertTile
                key={track?.id || 'unknown'}
                track={track}
                progressPct={getTopicProgress(track?.id, track?.lesson_count || 0)}
              />
            ))}
          </div>

          {/* Cert courses (C01-C03 are also courses with lesson content) */}
          {(certCourses?.length || 0) > 0 && (
            <div className="mt-4 space-y-3">
              {(certCourses || []).map(course => (
                <CourseTile
                  key={course?.id}
                  course={course}
                  progressPct={getTopicProgress(course?.id, course?.lesson_count || 0)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
