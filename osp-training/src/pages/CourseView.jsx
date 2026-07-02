/**
 * CourseView — lists all lessons in a course with progress indicators.
 * Route: /training/course/:courseId
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { courses, certTracks, lessonTitleIndex } from '../data/course-catalog.js';
import { useAllProgress } from '../hooks/useProgress.js';
import { useMyContent } from '../hooks/useMyContent.js';
import TopicFinal from '../components/primitives/TopicFinal.jsx';

// Map course section → back-link info
const SECTION_BACK = {
  general: { to: '/osp',  label: 'OSP Course' },
  cert:    { to: '/cert', label: 'Cert Tracks' },
  isp:     { to: '/isp',  label: 'ISP Course'  },
};

const STATUS_CONFIG = {
  completed:   { label: 'Done',        badge: 'bg-green-800/20 text-green-300 border-green-500/30' },
  in_progress: { label: 'In progress', badge: 'bg-amber-800/20 text-amber-300 border-amber-500/30' },
  not_started: { label: 'Not started', badge: 'bg-white/5 text-slate-400 border-white/10' },
};

// Inline clock icon
function ClockIcon() {
  return (
    <svg className="inline-block w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function CourseView() {
  const { courseId } = useParams();
  const { store } = useAllProgress();
  const mc = useMyContent();

  // Look up course in both general courses and cert courses
  const allCourses = [...courses, ...certTracks];
  const course = allCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="panel text-rose-300">
        Course <span className="font-mono">{courseId}</span> not found in catalog.{' '}
        <Link to="/" className="underline text-amber-300">Back to courses</Link>
      </div>
    );
  }

  // Skeleton until visibility resolves — don't render a 0-lesson course then pop in
  // the lessons (WP-A: no render-all-then-hide / no flash of the wrong count).
  if (!mc.ready) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="panel">
          <div className="h-6 w-56 bg-white/15 rounded" />
          <div className="mt-3 h-2 w-full bg-white/10 rounded" />
        </div>
        <div className="panel space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${88 - i * 9}%` }} />)}
        </div>
      </div>
    );
  }

  const allLessons = Array.from({ length: course.lesson_count || 0 }, (_, i) => {
    const order = i + 1;
    const paddedOrder = String(order).padStart(2, '0');
    const lessonId = `${courseId}.L${paddedOrder}`;  // Padded: matches lessonFileIndex keys
    const entry = store[lessonId];
    return {
      order,
      lessonId,
      title: lessonTitleIndex[lessonId] || `Lesson ${order}`,  // fallback for unauthored lessons
      status: entry?.status || 'not_started',
      bestScore: entry?.best_score ?? null,
      path: `/course/${courseId}/lesson/${paddedOrder}`,  // Padded to match LessonRouter key lookup
    };
  });

  // Content visibility: only show lessons this person may see (default = all).
  const lessons = allLessons.filter(l => mc.lessonVisible(l.lessonId));
  const lessonCount = lessons.length;

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const pct = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* ── Back button ────────────────────────────────────────────── */}
      {(() => {
        const back = SECTION_BACK[course.section] || { to: '/', label: 'Courses' };
        return (
          <div className="flex items-center gap-2">
            <Link to={back.to} className="text-sm text-slate-400 hover:text-amber-200 transition">
              ← Back to {back.label}
            </Link>
          </div>
        );
      })()}

      {/* ── Course header ─────────────────────────────────────────── */}
      <header className="panel">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-1">
              {(() => {
                const back = SECTION_BACK[course.section] || { to: '/', label: 'Courses' };
                return (
                  <>
                    <Link to={back.to} className="hover:text-amber-300 transition">{back.label}</Link>
                    {' → '}
                    <span className="font-mono">{courseId}</span>
                  </>
                );
              })()}
            </div>
            <h1 className="text-2xl font-bold text-slate-50">{course.title}</h1>
            {course.description && (
              <p className="text-sm text-slate-400 mt-1">{course.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold text-amber-300">{pct}%</div>
            <div className="text-xs text-slate-400">{completedCount}/{lessonCount} complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <span>{lessonCount} lessons</span>
          {course.prerequisites?.length > 0 && (
            <>
              <span>&middot;</span>
              <span>Prereq topics: {course.prerequisites.join(', ')}</span>
            </>
          )}
        </div>
      </header>

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
                  <span className="flex-1 text-sm text-slate-200 group-hover:text-amber-200 transition">
                    {lesson.title}
                  </span>
                  {lesson.bestScore !== null && (
                    <span className="text-xs text-slate-400">{lesson.bestScore}%</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {lessonCount === 0 && (
            <li className="text-sm text-slate-400 px-3 py-2">
              No lessons available to you in this course.
            </li>
          )}
        </ol>
      </div>

      {/* ── Topic Final (self-gates: renders only when a final pool exists) ── */}
      <TopicFinal courseId={courseId} courseTitle={course.title} />

      {/* ── Back link ─────────────────────────────────────────────── */}
      <div className="text-sm">
        {(() => {
          const back = SECTION_BACK[course.section] || { to: '/', label: 'Courses' };
          return (
            <Link to={back.to} className="text-slate-400 hover:text-amber-300 transition">
              ← {back.label}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
