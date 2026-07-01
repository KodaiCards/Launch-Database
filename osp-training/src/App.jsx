/**
 * App.jsx — OSP Training SPA root
 *
 * Production cut complete. The legacy 12-module sidebar is gone; the
 * new Router-based SPA (Splash → Course → Lesson + Field Tools + Cert
 * Tracks) is the only path. Legacy module files remain on disk as
 * source material for ongoing lesson migration but are no longer
 * imported from this entry point.
 */

import React from 'react';

import {
  HashRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVisibilityStream } from './hooks/useMyContent.js';

import ErrorBoundary    from './components/ErrorBoundary.jsx';
import ProductChooser   from './pages/ProductChooser.jsx';
import Splash           from './pages/Splash.jsx';
import CourseView       from './pages/CourseView.jsx';
import LessonRouter     from './pages/LessonRouter.jsx';
import FieldTools       from './pages/FieldTools.jsx';
import CertTrack        from './pages/CertTrack.jsx';
import CertTrackChooser from './pages/CertTrackChooser.jsx';
import NotFound         from './pages/NotFound.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppLayout() {
  const location = useLocation();
  // Live training-visibility: refetch my-content on an SSE push (no page refresh).
  useVisibilityStream();

  const navLinks = [
    { to: '/', exact: true, label: 'Courses' },
    { to: '/tools', label: 'Field Tools' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-ospnavy/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300/80">
              Launch Fiber Services · Training
            </div>
            <Link to="/" className="text-lg font-semibold hover:text-amber-200 transition">
              Training
            </Link>
          </div>

          <nav className="flex items-center gap-4" aria-label="Training navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive: active }) =>
                  [
                    'text-sm transition px-3 py-1 rounded-md',
                    active
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                      : 'text-slate-300 hover:text-amber-200 hover:bg-white/5',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <Routes>
          {/* Top-level chooser */}
          <Route path="/" element={<ProductChooser />} />

          {/* Section-scoped topic lists */}
          <Route path="/osp"  element={<Splash section="osp" />} />
          <Route path="/isp"  element={<Splash section="isp" />} />
          <Route path="/cert" element={<CertTrackChooser />} />

          {/* Course + lesson routes (shared across sections) */}
          <Route path="/course/:courseId" element={<CourseView />} />
          <Route path="/course/:courseId/lesson/:lessonOrder" element={<LessonRouter />} />

          {/* Individual cert track landing */}
          <Route path="/cert/:certId" element={<CertTrack />} />

          {/* Field tools */}
          <Route path="/tools" element={<FieldTools />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-white/10 text-xs text-slate-400/70">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between flex-wrap gap-2">
          <span>
            Training content includes textbook references and field practice.
            Not a substitute for AHJ-issued permits or stamped engineering drawings.
          </span>
          <span className="text-slate-500">
            Macon, GA · NESC Light loading district
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
