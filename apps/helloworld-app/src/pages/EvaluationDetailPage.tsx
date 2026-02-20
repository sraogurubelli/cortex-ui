import { useParams, Link } from 'react-router-dom';
import { Layout, Text } from '@harnessio/ui/components';
import { MOCK_EVALUATIONS } from '../features/evaluations/data/mockEvaluations';

export default function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const evaluation = id ? MOCK_EVALUATIONS.find((e) => e.id === id) : null;

  if (!evaluation) {
    return (
      <Layout.Vertical gapY="sm" className="p-cn-lg">
        <Text variant="body-normal" color="foreground-2">
          Evaluation not found.
        </Text>
        <Link to="/evaluations" className="text-cn-brand">
          ← Back to Evaluations
        </Link>
      </Layout.Vertical>
    );
  }

  const averageScore =
    evaluation.scores.length > 0
      ? evaluation.scores.reduce((sum, s) => sum + s.value, 0) / evaluation.scores.length
      : 0;

  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Link to="/evaluations" className="no-underline text-cn-foreground-2 hover:text-cn-brand">
        ← Back to Evaluations
      </Link>

      <Layout.Vertical gapY="sm">
        <Text variant="heading-section" color="foreground-1">
          {evaluation.name}
        </Text>
        {evaluation.description && (
          <Text variant="body-normal" color="foreground-2">
            {evaluation.description}
          </Text>
        )}
        <Text variant="body-normal" color="foreground-3">
          Agent: {evaluation.agentName} · {evaluation.status}
        </Text>
      </Layout.Vertical>

      {evaluation.scores.length > 0 && (
        <Layout.Vertical gapY="md">
          <Text variant="body-strong" color="foreground-1">
            Scores
          </Text>
          <Layout.Vertical gapY="xs">
            <Text variant="body-normal" color="foreground-2">
              Average: {(averageScore * 100).toFixed(0)}%
            </Text>
            {evaluation.scores.map((score, idx) => (
              <div key={idx} className="flex justify-between items-center p-cn-sm rounded-cn-1 bg-cn-1">
                <Text variant="body-normal" color="foreground-1">
                  {score.name}
                </Text>
                <Text variant="body-normal" color="foreground-2">
                  {((score.value / (score.maxValue ?? 1)) * 100).toFixed(0)}%
                </Text>
              </div>
            ))}
          </Layout.Vertical>
        </Layout.Vertical>
      )}

      <Layout.Vertical gapY="xs">
        <Text variant="body-strong" color="foreground-1">
          Details
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Created: {new Date(evaluation.createdAt).toLocaleString()}
        </Text>
        {evaluation.completedAt && (
          <Text variant="body-normal" color="foreground-3">
            Completed: {new Date(evaluation.completedAt).toLocaleString()}
          </Text>
        )}
        <Text variant="body-normal" color="foreground-3">
          Status: {evaluation.status}
        </Text>
      </Layout.Vertical>
    </Layout.Vertical>
  );
}
