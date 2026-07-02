import React, { useState } from 'react';
import PooledAssessment from './PooledAssessment.jsx';
import { useAvailableAssessments } from '../../hooks/useAssessment.js';

/**
 * TopicFinal — the per-topic final quiz (a NEW construct between per-lesson tests
 * and the cert exams). Draws a larger pool (launch dial: 15 of ~22) via the same
 * server-authoritative engine as lesson tests, kind='topic_final'.
 *
 * Convention: a topic final's assessment id is `${courseId}-final`. This component
 * SELF-GATES — it renders nothing until such a pool is authored + available, so it
 * can be dropped into a course view now and simply appears once content lands.
 *
 * @param {string} courseId  e.g. 'T01'
 * @param {string} [courseTitle]
 */
export default function TopicFinal({ courseId, courseTitle }) {
  const { assessments, isLoading } = useAvailableAssessments(courseId);
  const [open, setOpen] = useState(false);

  const finalId = `${courseId}-final`;
  const available = assessments.some(a => a.assessmentId === finalId && a.kind === 'topic_final');

  if (isLoading || !available) return null;

  if (open) {
    return (
      <PooledAssessment
        assessmentId={finalId}
        title={`${courseTitle || courseId} — Topic Final`}
      />
    );
  }

  return (
    <div className="panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Topic Final</h3>
          <p className="text-sm text-slate-300/75 mt-1">
            A cumulative quiz over {courseTitle || courseId}. Each attempt draws a fresh
            random set — you can retake it for a new set.
          </p>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setOpen(true)}>Start Topic Final</button>
      </div>
    </div>
  );
}
