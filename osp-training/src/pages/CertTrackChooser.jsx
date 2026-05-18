/**
 * CertTrackChooser — Certification track selection (v3).
 *
 * Lists available cert tracks (OSP Designer, CFOS-O, RCDD).
 * Each links to /training/cert/:slug for the full track.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { certTracks } from '../data/course-catalog.js';

function CertTrackTile({ track }) {
  return (
    <Link
      to={`/training/cert/${track.slug}`}
      className="block panel hover:ring-1 hover:ring-amber-400/40 transition group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-semibold">{track.title}</h3>
            <span className="text-xs text-slate-500 font-mono">{track.id}</span>
          </div>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{track.description}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            {track.exam_questions && (
              <>
                <span>{track.exam_questions} questions</span>
                <span>&middot;</span>
              </>
            )}
            <span>Mock exam included</span>
          </div>
        </div>
        <button className="shrink-0 text-amber-300 group-hover:text-amber-200 transition font-semibold">
          Start →
        </button>
      </div>
    </Link>
  );
}

export default function CertTrackChooser() {
  const available = certTracks.filter(t => t.available !== false);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/training/" className="text-sm text-slate-400 hover:text-amber-200 transition">
          ← All Products
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Certification Tracks</h1>
        <p className="text-slate-400">
          Specialized courses for formal certifications. Complete General Learning Topics first.
        </p>
      </div>

      <div className="space-y-3">
        {available.map(track => (
          <CertTrackTile key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
