import { useParams, Link } from 'react-router-dom';
import { useEvaluation } from '../features/evaluations/hooks/useEvaluations';
import './EvaluationDetailPage.css';

export default function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: evaluation, isLoading, error } = useEvaluation(id || '');

  if (isLoading) {
    return <div className="evaluation-detail-loading">Loading evaluation...</div>;
  }

  if (error || !evaluation) {
    return (
      <div className="evaluation-detail-error">
        <p>Error loading evaluation: {String(error)}</p>
        <Link to="/evaluations">← Back to Evaluations</Link>
      </div>
    );
  }

  const averageScore =
    evaluation.scores.length > 0
      ? evaluation.scores.reduce((sum, s) => sum + s.value, 0) / evaluation.scores.length
      : 0;

  return (
    <div className="evaluation-detail-page">
      <Link to="/evaluations" className="back-link">
        ← Back to Evaluations
      </Link>

      <div className="evaluation-detail-header">
        <h1>{evaluation.name}</h1>
        {evaluation.description && <p className="description">{evaluation.description}</p>}
        <div className="header-meta">
          <span>Agent: {evaluation.agentName}</span>
          <span className={`status-badge status-${evaluation.status}`}>{evaluation.status}</span>
        </div>
      </div>

      {evaluation.scores.length > 0 && (
        <div className="evaluation-detail-scores">
          <h2>Scores</h2>
          <div className="scores-summary">
            <div className="score-badge">Average: {(averageScore * 100).toFixed(0)}%</div>
          </div>
          <div className="scores-detailed">
            {evaluation.scores.map((score, idx) => (
              <div key={idx} className="score-item">
                <div className="score-header">
                  <span className="score-name">{score.name}</span>
                  <span className="score-value">
                    {score.value} / {score.maxValue || 1}
                  </span>
                </div>
                {score.comment && <p className="score-comment">{score.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="evaluation-detail-info">
        <h2>Details</h2>
        <dl className="info-list">
          <dt>Created At</dt>
          <dd>{new Date(evaluation.createdAt).toLocaleString()}</dd>
          {evaluation.completedAt && (
            <>
              <dt>Completed At</dt>
              <dd>{new Date(evaluation.completedAt).toLocaleString()}</dd>
            </>
          )}
          <dt>Status</dt>
          <dd className={`status-${evaluation.status}`}>{evaluation.status}</dd>
        </dl>
      </div>
    </div>
  );
}
