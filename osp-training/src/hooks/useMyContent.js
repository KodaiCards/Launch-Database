/**
 * useMyContent — the signed-in user's training content visibility.
 *
 * Backed by GET /api/training/my-content (see routes/training.js). Default is
 * "see all" (admins always, and anyone with no restriction). When restricted,
 * the server returns the visible track / subject / lesson id sets and the SPA
 * filters its catalog + nav on them.
 *
 * Visibility is a CURATION tool, not a security boundary (lessons ship as static
 * bundles), so this fails OPEN — on error or while loading we show everything
 * rather than lock someone out.
 */

import { useQuery } from '@tanstack/react-query';

async function fetchMyContent() {
  const res = await fetch('/api/training/my-content', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401) {
    window.location.replace('/login.html?reason=session_expired');
    return { all: true };
  }
  if (!res.ok) return { all: true };
  return res.json();
}

export function useMyContent() {
  const { data } = useQuery({
    queryKey: ['my-content'],
    queryFn: fetchMyContent,
    staleTime: 60_000,
    retry: 1,
  });

  // While loading (data === undefined) default to "see all" so content never
  // flickers hidden for the common (unrestricted) case.
  const all = !data || data.all !== false;
  const tracks = new Set((data && data.tracks) || []);
  const subjects = new Set((data && data.subjects) || []);
  const lessons = new Set((data && data.lessons) || []);

  return {
    ready: data !== undefined,
    all,
    trackVisible: (id) => all || tracks.has(id),
    subjectVisible: (id) => all || subjects.has(id),
    lessonVisible: (id) => all || lessons.has(id),
  };
}
