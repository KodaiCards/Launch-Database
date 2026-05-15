/**
 * CertTrack — cert-prep track landing page.
 * Route: /training/cert/:certId
 *
 * Lists lessons in the cert track + mock exam access.
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { certTracks } from '../data/course-catalog.js';
import { useAllProgress } from '../hooks/useProgress.js';

const STATUS_CONFIG = {
  completed:   { label: 'Done',        badge: 'bg-green-800/20 text-green-300 border-green-500/30' },
  in_progress: { label: 'In progress', badge: 'bg-purple-800/20 text-purple-300 border-purple-500/30' },
  not_started: { label: 'Not started', badge: 'bg-white/5 text-slate-400 border-white/10' },
};

export default function CertTrack() {
  const { certId } = useParams();
  const { store, getTopicProgress } = useAllProgress();

  const track = certTracks.find(t => t.id === certId);

  if (!track) {
    return (
      <div className="panel text-rose-300">
        Cert track <span className="font-mono">{certId}</span> not found.{' '}
        <Link to="/" className="underline text-amber-300">Back to courses</Link>
      </div>
    );
  }

  const pct = getTopicProgress(certId, track.lesson_count);
  const completedCount = Math.round(pct / 100 * track.lesson_count);

  const lessons = Array.from({ length: track.lesson_count }, (_, i) => {
    const order = i + 1;
    const lessonId = `${certId}.L${String(order).padStart(2, '0')}`;
    const entry = store[lessonId];
    return {
      order,
      lessonId,
      status: entry?.status || 'not_started',
      path: `/course/${certId}/lesson/${String(order).padStart(2, '0')}`,
    };
  });

  const { mock_exam_spec: exam } = track;

  return (
    <div className="space-y-4">
      {/* ── Track header ──────────────────────────────────────────── */}
      <header className="panel border-purple-500/20">
        <div className="flex items-start gap-3 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-purple-800/30 text-purple-300 border border-purple-500/30">
            Cert Prep
          </span>
          <span className="font-mono text-sm text-purple-400">{certId}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-50">{track.title}</h1>

        {/* Progress */}
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="text-xs text-slate-400 mt-2">
          {completedCount}/{track.lesson_count} lessons complete · {pct}%
        </div>

        {/* Prereq info */}
        {track.required_topics?.length > 0 && (
          <p className="text-sm text-slate-400 mt-3">
            Recommended before starting:{' '}
            {track.required_topics.map((tid, i) => (
              <React.Fragment key={tid}>
                {i > 0 && <span className="text-slate-600 mx-1">·</span>}
                <Link to={`/course/${tid}`} className="font-mono text-amber-300/80 hover:text-amber-200">
                  {tid}
                </Link>
              </React.Fragment>
            ))}
          </p>
        )}
      </header>

      {/* ── Mock exam card ────────────────────────────────────────── */}
      <div className="panel border-purple-500/20">
        <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-2">Mock Exam</div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-base font-semibold text-slate-100">{track.title} Practice Exam</p>
            <p className="text-sm text-slate-400 mt-1">
              {exam.items} questions · {exam.time_minutes} minutes · Pass: {Math.round(exam.pass_threshold * 100)}%
            </p>
            {exam.domains_weighting && (
              <p className="text-xs text-slate-500 mt-1">{exam.domains_weighting}</p>
            )}
          </div>
          <button
            type="button"
            disabled
            className="shrink-0 px-4 py-2 rounded-lg border border-purple-400/30 text-purple-300 text-sm font-semibold opacity-50 cursor-not-allowed"
            title="Mock exam unlocks after completing all lessons in this track"
          >
            Start exam
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Mock exam unlocks after completing all lessons in this track.
          Hands-on components (where applicable) must be completed at an approved testing center.
        </p>
      </div>

      {/* ── Lesson list ───────────────────────────────────────────── */}
      <div className="panel">
        <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-3">Lessons</div>
        <ol className="space-y-1">
          {lessons.map(lesson => {
            const cfg = STATUS_CONFIG[lesson.status];
            return (
              <li key={lesson.lessonId}>
                <Link
                  to={lesson.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 transition group"
                >
                  <span className="font-mono text-xs text-slate-400 w-8 shrink-0">
                    {String(lesson.order).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm text-slate-200 group-hover:text-purple-200 transition">
                    Lesson {lesson.order}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="text-sm">
        <Link to="/" className="text-slate-400 hover:text-amber-300 transition">
          ← All courses
        </Link>
      </div>
    </div>
  );
}
