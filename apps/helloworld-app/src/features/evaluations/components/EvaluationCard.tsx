import React from 'react';
import { Layout, Text } from '@harnessio/ui/components';
import { Link } from 'react-router-dom';
import type { Evaluation } from '../types';

export interface EvaluationCardProps {
  evaluation: Evaluation;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const averageScore =
    evaluation.scores.length > 0
      ? evaluation.scores.reduce((sum, s) => sum + s.value, 0) / evaluation.scores.length
      : 0;

  return (
    <Link to={`/evaluations/${evaluation.id}`} className="no-underline">
      <div className="p-cn-lg rounded-cn-2 border border-cn-border-1 bg-cn-1 hover:bg-cn-background-hover transition-colors">
        <Layout.Vertical gapY="sm">
          <Text variant="body-strong" color="foreground-1">
            {evaluation.name}
          </Text>
          <span className="text-cn-size-2 text-cn-foreground-3">{evaluation.status}</span>
          {evaluation.description && (
            <Text variant="body-normal" color="foreground-3" className="line-clamp-2">
              {evaluation.description}
            </Text>
          )}
          <Text variant="caption-single-line-normal" color="foreground-3">
            Agent: {evaluation.agentName} · {new Date(evaluation.createdAt).toLocaleDateString()}
          </Text>
          {evaluation.scores.length > 0 && (
            <Text variant="body-normal" color="foreground-2">
              Avg score: {(averageScore * 100).toFixed(0)}% · {evaluation.scores.length} metrics
            </Text>
          )}
        </Layout.Vertical>
      </div>
    </Link>
  );
};
