import React from 'react';
import PooledAssessment from './PooledAssessment.jsx';
import { useAvailableAssessments } from '../../hooks/useAssessment.js';

/**
 * GatedAssessment — swaps a lesson's inline graded <Quiz> for the
 * server-authoritative <PooledAssessment> once that lesson's pool has been
 * authored + published. Renders `fallback` (the lesson's existing inline
 * <Quiz>) until the pool is confirmed available, so a lesson never
 * hard-breaks mid pool-authoring rollout.
 *
 * @param {string} courseId       e.g. 'T01'
 * @param {string} assessmentId   pool id, e.g. 'T01-L01'
 * @param {string} [title]
 * @param {React.ReactNode} fallback  rendered while the pool isn't available
 */
export default function GatedAssessment({ courseId, assessmentId, title, fallback = null }) {
  const { assessments, isLoading } = useAvailableAssessments(courseId);
  if (isLoading) return fallback;
  const available = assessments.some(a => a.assessmentId === assessmentId && a.kind === 'lesson');
  if (!available) return fallback;
  return <PooledAssessment assessmentId={assessmentId} title={title} />;
}
