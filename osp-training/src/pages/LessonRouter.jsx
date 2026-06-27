/**
 * LessonRouter — dynamically imports the lesson JSX file from
 * src/lessons/T<NN>/L<NN>.<slug>.jsx and renders it inside LessonLayout.
 *
 * Route: /training/course/:courseId/lesson/:lessonOrder
 *
 * lessonOrder is the two-digit order number (e.g., "01", "02").
 * The router resolves the lesson file using the course catalog's lesson
 * file index. Until OSP-RW.4/5 authors the lesson files, it renders a
 * "Lesson not yet authored" placeholder.
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lessonFileIndex } from '../data/course-catalog.js';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { useMyContent } from '../hooks/useMyContent.js';

// Vite processes this glob at build time, producing code-split chunks for every
// lesson file. Browser never resolves a runtime-relative path — Vite handles it.
const lessonModules = import.meta.glob('../lessons/**/*.jsx');

// ── Loading skeleton ────────────────────────────────────────────────────────
function LessonSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="panel">
        <div className="h-4 w-24 bg-white/10 rounded mb-2" />
        <div className="h-7 w-64 bg-white/15 rounded" />
        <div className="mt-4 h-3 w-full bg-white/5 rounded" />
        <div className="mt-2 h-3 w-3/4 bg-white/5 rounded" />
      </div>
      <div className="panel">
        <div className="h-5 w-32 bg-white/10 rounded mb-3" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-white/5 rounded" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Not-yet-authored placeholder ─────────────────────────────────────────────
function LessonPlaceholder({ courseId, lessonOrder }) {
  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="text-xs uppercase tracking-widest text-slate-300/60 mb-1">
          <Link to="/" className="hover:text-amber-300 transition">All courses</Link>
          {' → '}
          <Link to={`/course/${courseId}`} className="hover:text-amber-300 transition font-mono">{courseId}</Link>
          {' → '}
          <span className="font-mono">Lesson {lessonOrder}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-50">
          {courseId} · Lesson {lessonOrder}
        </h1>
      </div>
      <div className="panel text-center py-12 text-slate-400">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-lg font-semibold text-slate-300">Lesson content coming in OSP-RW.4</p>
        <p className="text-sm mt-2 max-w-md mx-auto">
          The course structure and routing are wired. Lesson files will be authored
          topic-by-topic in the content pipeline (OSP-RW.4 and OSP-RW.5).
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to={`/course/${courseId}`}
            className="text-sm text-amber-300 hover:text-amber-100 transition"
          >
            ← Back to course
          </Link>
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-amber-300 transition"
          >
            All courses
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── LessonRouter ─────────────────────────────────────────────────────────────
export default function LessonRouter() {
  const { courseId, lessonOrder } = useParams();
  const mc = useMyContent();
  const [LessonComponent, setLessonComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const lessonKey = `${courseId}.L${String(lessonOrder).padStart(2, '0')}`;
  // Content visibility: if this lesson isn't assigned to the user, don't load it.
  const blocked = mc.ready && !mc.lessonVisible(lessonKey);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setLessonComponent(null);

    // Look up the lesson file path from the catalog index.
    // Keys are relative to src/data/ (e.g. "../lessons/T02/L01.fiber-vocabulary.jsx")
    // which also matches the glob keys produced by import.meta.glob above.
    // Note: lessonOrder from URL is padded (01, 02, ..., 15) to match lessonFileIndex keys
    const key = `${courseId}.L${String(lessonOrder).padStart(2, '0')}`;
    const filePath = lessonFileIndex[key];

    if (!filePath) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Resolve using the build-time glob map. Vite produces a loader function per
    // matched file — calling it returns a Promise<module> with proper code splitting.
    const loader = lessonModules[filePath];
    if (!loader) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    loader()
      .then(mod => {
        if (mod.default) {
          setLessonComponent(() => mod.default);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId, lessonOrder]);

  if (blocked) {
    return (
      <div className="panel text-center py-12 text-slate-400">
        <div className="text-4xl mb-4">🔒</div>
        <p className="text-lg font-semibold text-slate-300">This lesson isn't part of your assigned training.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to={`/course/${courseId}`} className="text-sm text-amber-300 hover:text-amber-100 transition">← Back to course</Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-amber-300 transition">All courses</Link>
        </div>
      </div>
    );
  }
  if (loading) return <LessonSkeleton />;
  if (notFound) return <LessonPlaceholder courseId={courseId} lessonOrder={lessonOrder} />;
  if (LessonComponent) return <ErrorBoundary><LessonComponent /></ErrorBoundary>;
  return <LessonPlaceholder courseId={courseId} lessonOrder={lessonOrder} />;
}
