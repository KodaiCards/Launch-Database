/**
 * useProgress — progress persistence hook (stub for OSP-RW.2)
 *
 * OSP-RW.2 will replace this stub with real API calls:
 *   GET  /api/training/progress        — load full progress map
 *   POST /api/training/progress        — save lesson status / score
 *
 * Until then, progress is stored in localStorage so the UI works locally.
 * The stub API matches what LessonLayout and Splash expect to call.
 *
 * @param {string} lessonId  — e.g. "T02.L01"
 * @returns {{ status, markSeen, markComplete, bestScore }}
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'osp_training_progress';

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage not available — silently ignore
  }
}

export function useProgress(lessonId) {
  const [store, setStore] = useState(() => readStore());

  const entry = store[lessonId] || { status: 'not_started', best_score: null };

  const markSeen = useCallback(() => {
    setStore(prev => {
      if (prev[lessonId]?.status === 'completed') return prev; // don't regress
      const next = {
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          status: 'in_progress',
          last_seen_at: new Date().toISOString(),
        },
      };
      writeStore(next);
      return next;
    });
  }, [lessonId]);

  const markComplete = useCallback((score = null) => {
    setStore(prev => {
      const existing = prev[lessonId] || {};
      const next = {
        ...prev,
        [lessonId]: {
          ...existing,
          status: 'completed',
          completed_at: existing.completed_at || new Date().toISOString(),
          best_score: score !== null
            ? Math.max(score, existing.best_score ?? 0)
            : existing.best_score,
        },
      };
      writeStore(next);
      return next;
    });
  }, [lessonId]);

  return {
    status: entry.status,           // 'not_started' | 'in_progress' | 'completed'
    bestScore: entry.best_score,    // 0–100 or null
    markSeen,
    markComplete,
  };
}

/**
 * useAllProgress — returns the full progress map.
 * Used by Splash and CourseView to render completion percentages.
 */
export function useAllProgress() {
  const [store, setStore] = useState(() => readStore());

  const refresh = useCallback(() => {
    setStore(readStore());
  }, []);

  const getTopicProgress = useCallback((courseId, totalLessons) => {
    let completed = 0;
    for (let i = 1; i <= totalLessons; i++) {
      const lessonId = `${courseId}.L${String(i).padStart(2, '0')}`;
      if (store[lessonId]?.status === 'completed') completed++;
    }
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }, [store]);

  return { store, refresh, getTopicProgress };
}
