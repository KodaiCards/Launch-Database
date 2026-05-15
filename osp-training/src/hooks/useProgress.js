/**
 * useProgress — progress persistence hook (OSP-RW.2 real API implementation)
 *
 * Replaces the localStorage stub with real API calls backed by Postgres:
 *   GET  /api/training/progress  — full progress map on mount
 *   POST /api/training/progress  — persist lesson status / score
 *
 * Auth: lfs_session httpOnly cookie travels automatically on same-origin fetches
 * (credentials: 'include'). The SPA is served from launch-database at /training/
 * so all /api/* fetches are same-origin.
 *
 * React Query v5 is used for caching, optimistic updates, and stale-while-
 * revalidate behavior. The query client must be provided by a QueryClientProvider
 * wrapping the SPA root (App.jsx or main.jsx).
 *
 * @param {string} lessonId  — e.g. "T02.L01"
 * @returns {{ status, bestScore, markSeen, markComplete }}
 */

import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

// ─── Query key ───────────────────────────────────────────────────────────────

export const PROGRESS_QUERY_KEY = ['training-progress'];

// ─── API helpers ─────────────────────────────────────────────────────────────

/**
 * Fetch the full progress map from the server.
 * Returns a Map<lessonId, progressRow> for O(1) lookups.
 */
async function fetchProgress() {
  const res = await fetch('/api/training/progress', {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
  if (res.status === 401) {
    // Session expired — redirect to login so the user can re-auth.
    // Use replace() so the browser Back button doesn't return to a
    // half-loaded training page with no session.
    window.location.replace('/login.html?reason=session_expired');
    // Return an empty map so React doesn't blow up before the redirect.
    return new Map();
  }
  if (!res.ok) {
    throw new Error(`Failed to load training progress (${res.status})`);
  }
  const { progress } = await res.json();
  const map = new Map();
  for (const row of progress) {
    map.set(row.lesson_id, row);
  }
  return map;
}

/**
 * POST a progress update for one lesson.
 * @param {{ lessonId, courseId, status, completionPct, score? }} payload
 */
async function postProgress({ lessonId, courseId, status, completionPct, score }) {
  const body = {
    lesson_id:      lessonId,
    course_id:      courseId,
    status,
    completion_pct: completionPct,
  };
  if (score !== undefined && score !== null) body.score = score;

  const res = await fetch('/api/training/progress', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    window.location.replace('/login.html?reason=session_expired');
    return null;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to save progress (${res.status}): ${text}`);
  }
  const { progress: updated } = await res.json();
  return updated;
}

// ─── useProgress ─────────────────────────────────────────────────────────────

/**
 * Per-lesson hook. Returns reactive status + mutation helpers.
 *
 * courseId is derived from lessonId by taking the part before the first '.'.
 * e.g. "T02.L05" → courseId "T02". Override with explicit prop if needed.
 *
 * @param {string} lessonId   e.g. "T02.L01"
 * @param {string} [courseId] optional override; defaults to lessonId.split('.')[0]
 */
export function useProgress(lessonId, courseId) {
  const qc = useQueryClient();

  // Derive courseId from lessonId when not provided (T02.L01 → T02)
  const resolvedCourseId = courseId || (lessonId ? lessonId.split('.')[0] : null);

  // ── Load the full progress map ──────────────────────────────────────────────
  const { data: progressMap = new Map() } = useQuery({
    queryKey: PROGRESS_QUERY_KEY,
    queryFn:  fetchProgress,
    staleTime: 30_000,           // 30s stale window — splash + course views benefit
    retry: 2,
    retryDelay: 1_000,
  });

  const entry = progressMap.get(lessonId) || { status: 'not_started', best_score: null };

  // ── Mutation — optimistic update + cache invalidation ──────────────────────
  const mutation = useMutation({
    mutationFn: postProgress,
    onMutate: async ({ lessonId: lid, status: newStatus, completionPct, score }) => {
      // Cancel any in-flight fetches so they don't overwrite our optimistic state.
      await qc.cancelQueries({ queryKey: PROGRESS_QUERY_KEY });

      // Snapshot for rollback.
      const prev = qc.getQueryData(PROGRESS_QUERY_KEY);

      // Apply optimistic update.
      qc.setQueryData(PROGRESS_QUERY_KEY, (old = new Map()) => {
        const next = new Map(old);
        const existing = next.get(lid) || { status: 'not_started', best_score: null };
        // Status can only advance.
        const STATUS_RANK = { not_started: 0, in_progress: 1, completed: 2 };
        const advancedStatus =
          STATUS_RANK[newStatus] > STATUS_RANK[existing.status]
            ? newStatus
            : existing.status;
        next.set(lid, {
          ...existing,
          status:         advancedStatus,
          completion_pct: Math.max(existing.completion_pct || 0, completionPct),
          best_score:     score !== undefined && score !== null
            ? Math.max(score, existing.best_score ?? 0)
            : existing.best_score,
          last_seen_at: new Date().toISOString(),
        });
        return next;
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Roll back optimistic update on error.
      if (ctx?.prev !== undefined) {
        qc.setQueryData(PROGRESS_QUERY_KEY, ctx.prev);
      }
    },
    onSettled: () => {
      // Always invalidate to sync with server truth.
      qc.invalidateQueries({ queryKey: PROGRESS_QUERY_KEY });
    },
  });

  // ── markSeen — transition to in_progress ────────────────────────────────────
  const markSeen = useCallback(() => {
    if (!lessonId || !resolvedCourseId) return;
    if (entry.status === 'completed') return; // never regress
    mutation.mutate({
      lessonId,
      courseId:      resolvedCourseId,
      status:        'in_progress',
      completionPct: Math.max(entry.completion_pct || 0, 10), // at least 10% on first view
    });
  }, [lessonId, resolvedCourseId, entry.status, entry.completion_pct, mutation]);

  // ── markComplete — transition to completed, optionally with quiz score ──────
  const markComplete = useCallback((score = null) => {
    if (!lessonId || !resolvedCourseId) return;
    mutation.mutate({
      lessonId,
      courseId:      resolvedCourseId,
      status:        'completed',
      completionPct: 100,
      score:         score !== null ? score : undefined,
    });
  }, [lessonId, resolvedCourseId, mutation]);

  return {
    status:    entry.status,       // 'not_started' | 'in_progress' | 'completed'
    bestScore: entry.best_score,   // 0–100 or null
    markSeen,
    markComplete,
  };
}

// ─── useAllProgress ──────────────────────────────────────────────────────────

/**
 * Returns the full progress map and helpers for course-level aggregation.
 * Used by Splash and CourseView to render per-tile completion percentages.
 */
export function useAllProgress() {
  const qc = useQueryClient();

  const { data: progressMap = new Map(), isLoading, isError } = useQuery({
    queryKey: PROGRESS_QUERY_KEY,
    queryFn:  fetchProgress,
    staleTime: 30_000,
    retry: 2,
    retryDelay: 1_000,
  });

  /**
   * Compute percentage of lessons completed for a given course.
   * @param {string} courseId      e.g. 'T02'
   * @param {number} totalLessons  total lesson count for this course
   */
  const getTopicProgress = useCallback((courseId, totalLessons) => {
    if (!totalLessons || totalLessons < 1) return 0;
    let completed = 0;
    for (let i = 1; i <= totalLessons; i++) {
      const lessonId = `${courseId}.L${String(i).padStart(2, '0')}`;
      if (progressMap.get(lessonId)?.status === 'completed') completed++;
    }
    return Math.round((completed / totalLessons) * 100);
  }, [progressMap]);

  /**
   * Force-refresh the progress cache (e.g., after returning from a lesson).
   */
  const refresh = useCallback(() => {
    qc.invalidateQueries({ queryKey: PROGRESS_QUERY_KEY });
  }, [qc]);

  return { store: progressMap, isLoading, isError, refresh, getTopicProgress };
}
