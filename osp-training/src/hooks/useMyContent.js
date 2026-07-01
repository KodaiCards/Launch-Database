/**
 * useMyContent — the signed-in user's training content visibility.
 *
 * Backed by GET /api/training/my-content (routes/training.js), which is the SINGLE
 * server-authoritative resolver:
 *   visible(non-admin) = ( new-user-default ∪ per-user SHOW − per-user HIDE ) ∩ published
 *   visible(admin)     = everything   → { all: true }
 *
 * WP-A: this hook is server-authoritative and does NOT fail open. While the first
 * fetch is in flight we report ready:false with EMPTY sets — consumers render a
 * skeleton, never "show everything" (that render-all-then-hide was the ~0.5s flash
 * and the leak). On a transient error we keep the last-good data (React-Query cache)
 * if we have it, otherwise empty — we never widen visibility on failure.
 *
 * Real-time: useVisibilityStream() (wired once in App.jsx) invalidates ['my-content']
 * on an SSE 'training_visibility_changed' event, so an admin's publish / default change
 * / per-user grant or revoke updates the learner's open SPA with no page refresh.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

async function fetchMyContent() {
  const res = await fetch('/api/training/my-content', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401) {
    window.location.replace('/login.html?reason=session_expired');
    // Throw so React-Query keeps any last-good data instead of caching a wide set.
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    // 503 (server-authoritative de-fail-open) or any error → throw so the query
    // retains last-good data; we do NOT resolve to { all: true }.
    throw new Error('my-content ' + res.status);
  }
  return res.json();
}

export function useMyContent() {
  const { data, isSuccess } = useQuery({
    queryKey: ['my-content'],
    queryFn: fetchMyContent,
    staleTime: 60_000,
    retry: 1,
  });

  // ready = we have a successful resolution to render against. Until then,
  // consumers show a skeleton (they gate their content on `ready`).
  const ready = isSuccess && data !== undefined;
  // all = true ONLY when the server explicitly says so (admin). Never on load/error.
  const all = ready && data.all === true;
  const tracks = new Set((data && data.tracks) || []);
  const subjects = new Set((data && data.subjects) || []);
  const lessons = new Set((data && data.lessons) || []);

  return {
    ready,
    all,
    // Before ready, every *Visible check is false → consumers render skeletons,
    // not hidden-content placeholders and not everything.
    trackVisible: (id) => all || (ready && tracks.has(id)),
    subjectVisible: (id) => all || (ready && subjects.has(id)),
    lessonVisible: (id) => all || (ready && lessons.has(id)),
  };
}

/**
 * useVisibilityStream — subscribe once to the shared SSE endpoint and refetch
 * visibility (and progress, so admin-side denominators stay honest) whenever the
 * server signals a training-visibility change. Mount ONCE near the app root.
 *
 * EventSource carries the lfs_session cookie (same-origin), auto-reconnects on drop,
 * and is closed on unmount. The event payload is intentionally content-free — we just
 * invalidate and let the server re-resolve this user's set.
 */
export function useVisibilityStream() {
  const queryClient = useQueryClient();
  useEffect(() => {
    let es;
    try {
      es = new EventSource('/api/events/stream', { withCredentials: true });
    } catch (_) {
      return; // EventSource unavailable — visibility still works on next nav/refetch.
    }
    const onChange = () => {
      queryClient.invalidateQueries({ queryKey: ['my-content'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    };
    es.addEventListener('training_visibility_changed', onChange);
    // If the server signals the session is invalid, send the user to login.
    es.addEventListener('session_invalid', () => {
      window.location.replace('/login.html?reason=session_expired');
    });
    return () => {
      try { es.removeEventListener('training_visibility_changed', onChange); } catch (_) {}
      try { es.close(); } catch (_) {}
    };
  }, [queryClient]);
}
