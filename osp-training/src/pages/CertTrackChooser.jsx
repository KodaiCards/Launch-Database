/**
 * CertTrackChooser — Certification track selection (v3).
 *
 * Lists available cert tracks (OSP Designer, CFOT, CFOS/O).
 * Each links to /cert/:certId for the full track mock exam.
 *
 * Per directive 36 (2026-05-18): cert tracks are separate products from
 * the OSP / ISP courses. RCDD migrated to future ISP course.
 *
 * Also shows T21/T22 cert-prep courses from the catalog (course-based cert prep
 * with lesson content) distinct from the exam-only certTracks.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { certTracks, courses } from '../data/course-catalog.js';
import { useAllProgress } from '../hooks/useProgress.js';
import { useMyContent } from '../hooks/useMyContent.js';

// ── Progress ring ────────────────────────────────────────────────────────────
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
        stroke={pct === 100 ? '#4ade80' : '#a78bfa'}
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

function ctaLabel(pct) {
  if (pct === 0) return 'Start';
  if (pct === 100) return 'Completed';
  return 'Continue';
}

// ── Mock-exam track tile ─────────────────────────────────────────────────────
function CertTrackTile({ track, progressPct }) {
  const spec = track.mock_exam_spec || {};
  const cta = ctaLabel(progressPct);
  const completed = progressPct === 100;

  return (
    <Link
      to={`/cert/${track.id}`}
      className={[
        'block panel hover:ring-1 hover:ring-purple-400/40 transition group',
        completed ? 'border-green-500/30' : 'border-purple-500/20',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <ProgressRing pct={progressPct} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-purple-400">{track.id}</span>
            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-purple-200 transition">
              {track.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
            {spec.items > 0 && <span>{spec.items}-question mock exam</span>}
            {spec.items > 0 && spec.time_minutes > 0 && <span>&middot;</span>}
            {spec.time_minutes > 0 && <span>{spec.time_minutes} min</span>}
            {spec.pass_threshold > 0 && (
              <>
                <span>&middot;</span>
                <span>Pass: {Math.round(spec.pass_threshold * 100)}%</span>
              </>
            )}
            {track.required_topics?.length > 0 && (
              <>
                <span>&middot;</span>
                <span>Requires: {track.required_topics.join(', ')}</span>
              </>
            )}
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

// ── Course-based cert prep tile (T21, T22) ──────────────────────────────────
function CertCourseTile({ course, progressPct }) {
  const cta = ctaLabel(progressPct);
  const completed = progressPct === 100;

  return (
    <Link
      to={`/course/${course.id}`}
      className={[
        'block panel hover:ring-1 hover:ring-purple-400/40 transition group',
        completed ? 'border-green-500/30' : 'border-purple-500/20',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <ProgressRing pct={progressPct} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-purple-400">{course.id}</span>
            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-purple-200 transition">
              {course.title}
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{course.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{course.lesson_count} lessons</span>
            <span>&middot;</span>
            <span>{Math.round(course.estimated_minutes / 60 * 10) / 10} hr</span>
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

// ── RCDD placeholder ─────────────────────────────────────────────────────────
function RCDDPlaceholder() {
  return (
    <div
      className="block panel opacity-50 cursor-not-allowed select-none border-slate-700/30"
      aria-disabled="true"
      role="article"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-white/10 text-slate-500 text-lg">
          🔒
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-xs text-slate-500">C04-RCDD</span>
            <h3 className="text-base font-semibold text-slate-400 truncate">BICSI RCDD Certification</h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Registered Communications Distribution Designer — covers the full TDMM scope
            (inside plant, pathways, spaces, administration, grounding). Part of the future ISP course.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full border self-center border-slate-600/40 text-slate-500 bg-slate-800/20">
          Coming in ISP Course
        </span>
      </div>
    </div>
  );
}

export default function CertTrackChooser() {
  const { getTopicProgress } = useAllProgress();
  const mc = useMyContent();

  // Content visibility: exam tracks only when the cert track is visible.
  const certVisible = mc.trackVisible('cert');
  const availableTracks = certVisible ? (certTracks || []).filter(t => t.id !== 'C04-RCDD') : [];

  // Course-based cert prep (T21 CFOS/O, T22 CFOT) — filtered to visible subjects.
  const certCourses = (courses || []).filter(c => c?.section === 'cert' && c.id !== 'C04' && mc.subjectVisible(c.id));

  // C04 BICSI mock exam (lesson-based)
  const c04full = (courses || []).find(c => c?.id === 'C04');
  const c04 = (c04full && mc.subjectVisible('C04')) ? c04full : null;

  return (
    <div className="space-y-8">
      {/* Back breadcrumb */}
      <div className="flex items-center gap-2">
        <Link to="/" className="text-sm text-slate-400 hover:text-amber-200 transition">
          ← All Sections
        </Link>
      </div>

      {/* Skeleton until visibility resolves — no flash of wrong cert content (WP-A). */}
      {!mc.ready && (
        <div className="space-y-3 animate-pulse">
          {[0, 1].map(i => (
            <div key={i} className="panel"><div className="h-5 w-44 bg-white/15 rounded" /><div className="mt-2 h-3 w-2/3 bg-white/5 rounded" /></div>
          ))}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold mb-1">Certification Tracks</h1>
        <p className="text-slate-400 text-sm">
          Accelerated cert-prep courses and mock exams. Recommended after completing the OSP General Course.
          RCDD certification prep is part of the future ISP course.
        </p>
      </div>

      {/* Cert-prep lesson courses (T21/T22 + C04) */}
      {(certCourses.length > 0 || c04) && (
        <section aria-label="Cert prep courses">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
            Cert Prep Courses — with Lessons
          </div>
          <div className="space-y-3">
            {certCourses.map(course => (
              <CertCourseTile
                key={course.id}
                course={course}
                progressPct={getTopicProgress(course.id, course.lesson_count || 0)}
              />
            ))}
            {c04 && (
              <CertCourseTile
                key="C04"
                course={c04}
                progressPct={getTopicProgress('C04', c04.lesson_count || 0)}
              />
            )}
          </div>
        </section>
      )}

      {/* Mock exam tracks */}
      {availableTracks.length > 0 && (
        <section aria-label="Mock exam tracks">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
            Mock Exams
          </div>
          <div className="space-y-3">
            {availableTracks.map(track => (
              <CertTrackTile
                key={track.id}
                track={track}
                progressPct={getTopicProgress(track.id, 0)}
              />
            ))}
          </div>
        </section>
      )}

      {/* RCDD coming-soon placeholder */}
      <section aria-label="Future certifications">
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
          Future — ISP Course
        </div>
        <RCDDPlaceholder />
      </section>
    </div>
  );
}
