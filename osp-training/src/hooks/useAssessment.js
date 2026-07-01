/**
 * useAssessment — client for the server-authoritative assessment engine.
 *
 * The engine (routes/_assessment_pools.js + /api/training/assessment/*) draws a
 * random question subset PER ATTEMPT, ships them WITHOUT answer keys, and grades
 * server-side on submit. This module is the SPA's thin transport for that:
 *
 *   startAssessment(id)          → POST  /assessment/:id/start  → { attempt_id, questions, ... }
 *   submitAssessment(id, body)   → POST  /assessment/:id/submit → { score, passed, per_question, ... }
 *   useAvailableAssessments()    → GET   /assessment/available  (React Query; gates UI)
 *
 * Auth = same-origin lfs_session cookie (credentials:'include'), matching
 * useProgress.js. A 401 redirects to login just like the rest of the SPA.
 */

import { useQuery } from '@tanstack/react-query';

function bounceOn401(res) {
  if (res.status === 401) {
    window.location.replace('/login.html?reason=session_expired');
    return true;
  }
  return false;
}

/** Begin an attempt: server draws + opens an attempt row, returns keyless questions. */
export async function startAssessment(assessmentId) {
  const res = await fetch(`/api/training/assessment/${encodeURIComponent(assessmentId)}/start`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
  if (bounceOn401(res)) return null;
  if (res.status === 404) { const e = new Error('Assessment not found'); e.code = 404; throw e; }
  if (!res.ok) throw new Error(`Failed to start assessment (${res.status})`);
  return res.json();
}

/**
 * Submit an attempt for server-side grading.
 * @param {string} assessmentId
 * @param {{ attempt_id:number, answers:Object, duration_seconds?:number }} body
 */
export async function submitAssessment(assessmentId, { attempt_id, answers, duration_seconds }) {
  const res = await fetch(`/api/training/assessment/${encodeURIComponent(assessmentId)}/submit`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ attempt_id, answers, duration_seconds }),
  });
  if (bounceOn401(res)) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to submit assessment (${res.status}): ${text}`);
  }
  return res.json();
}

/** The learner's own submitted attempts (I11 dashboard). Answer keys never appear. */
export async function fetchAttempts({ assessmentId, courseId } = {}) {
  const qs = new URLSearchParams();
  if (assessmentId) qs.set('assessment_id', assessmentId);
  if (courseId) qs.set('course_id', courseId);
  const res = await fetch(`/api/training/assessment/attempts?${qs.toString()}`, {
    credentials: 'include', headers: { 'Accept': 'application/json' },
  });
  if (bounceOn401(res)) return [];
  if (!res.ok) throw new Error(`Failed to load attempts (${res.status})`);
  const { attempts } = await res.json();
  return attempts;
}

/**
 * Which assessments exist (metadata only). Used to gate UI — e.g. only render a
 * Topic Final entry when a final pool is authored for the course.
 * @param {string} [courseId]
 */
export function useAvailableAssessments(courseId) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['assessment-available', courseId || 'all'],
    queryFn: async () => {
      const qs = courseId ? `?course_id=${encodeURIComponent(courseId)}` : '';
      const res = await fetch(`/api/training/assessment/available${qs}`, {
        credentials: 'include', headers: { 'Accept': 'application/json' },
      });
      if (bounceOn401(res)) return [];
      if (!res.ok) throw new Error(`Failed to list assessments (${res.status})`);
      const { assessments } = await res.json();
      return assessments;
    },
    staleTime: 60_000,
  });
  return { assessments: data, isLoading };
}
