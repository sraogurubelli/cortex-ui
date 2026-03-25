import React from 'react';
import { Link } from 'react-router-dom';
import type { Evaluation } from '../types';
import './EvaluationCard.css';

export interface EvaluationCardProps {
  evaluation: Evaluation;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const averageScore =
    evaluation.scores.length > 0
      ? evaluation.scores.reduce((sum, s) => sum + s.value, 0) / evaluation.scores.length
      : 0;

  return (
    <Link to={`/evaluations/${evaluation.id}`} className="evaluation-card-link">
      <div className="evaluation-card">
        <div className="evaluation-card-header">
          <h3>{evaluation.name}</h3>
          <span className={`status-badge status-${evaluation.status}`}>{evaluation.status}</span>
        </div>
        {evaluation.description && (
          <p className="evaluation-card-description">{evaluation.description}</p>
        )}
        <div className="evaluation-card-meta">
          <span>Agent: {evaluation.agentName}</span>
          <span>{new Date(evaluation.createdAt).toLocaleDateString()}</span>
        </div>
        {evaluation.scores.length > 0 && (
          <div className="evaluation-card-scores">
            <span className="score-badge">Avg Score: {(averageScore * 100).toFixed(0)}%</span>
            <span className="score-count">{evaluation.scores.length} metrics</span>
          </div>
        )}
      </div>
    </Link>
  );
};
