/**
 * NotFound — 404 fallback for unmatched /training/* routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="panel text-center py-16">
      <div className="text-5xl font-bold text-slate-600 mb-4">404</div>
      <p className="text-xl font-semibold text-slate-300">Page not found</p>
      <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
        The route you requested doesn't exist in the training platform.
      </p>
      <div className="mt-8">
        <Link
          to="/training/"
          className="inline-block px-5 py-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-semibold hover:bg-amber-500/30 transition"
        >
          Back to courses
        </Link>
      </div>
    </div>
  );
}
