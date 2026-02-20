import { useParams, Link } from 'react-router-dom';
import { Layout, Text } from '@harnessio/ui/components';
import { MOCK_AGENTS } from '../features/agents/data/mockAgents';

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const agent = id ? MOCK_AGENTS.find((a) => a.id === id) : null;

  if (!agent) {
    return (
      <Layout.Vertical gapY="sm" className="p-cn-lg">
        <Text variant="body-normal" color="foreground-2">
          Agent not found.
        </Text>
        <Link to="/agents" className="text-cn-brand">
          ← Back to Agents
        </Link>
      </Layout.Vertical>
    );
  }

  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Link to="/agents" className="no-underline text-cn-foreground-2 hover:text-cn-brand">
        ← Back to Agents
      </Link>

      <Layout.Vertical gapY="sm">
        <Text variant="heading-section" color="foreground-1">
          {agent.name}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {agent.status}
        </Text>
        {agent.description && (
          <Text variant="body-normal" color="foreground-2">
            {agent.description}
          </Text>
        )}
      </Layout.Vertical>

      {agent.metrics && (
        <Layout.Vertical gapY="md">
          <Text variant="body-strong" color="foreground-1">
            Metrics
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-cn-md">
            <div className="p-cn-md rounded-cn-2 border border-cn-border-1 bg-cn-1">
              <Text variant="caption-single-line-normal" color="foreground-3">
                Total Evaluations
              </Text>
              <Text variant="heading-small" color="foreground-1">
                {agent.metrics.totalEvaluations}
              </Text>
            </div>
            <div className="p-cn-md rounded-cn-2 border border-cn-border-1 bg-cn-1">
              <Text variant="caption-single-line-normal" color="foreground-3">
                Average Score
              </Text>
              <Text variant="heading-small" color="foreground-1">
                {(agent.metrics.averageScore * 100).toFixed(0)}%
              </Text>
            </div>
            <div className="p-cn-md rounded-cn-2 border border-cn-border-1 bg-cn-1">
              <Text variant="caption-single-line-normal" color="foreground-3">
                Success Rate
              </Text>
              <Text variant="heading-small" color="foreground-1">
                {(agent.metrics.successRate * 100).toFixed(0)}%
              </Text>
            </div>
          </div>
        </Layout.Vertical>
      )}

      <Layout.Vertical gapY="xs">
        <Text variant="body-strong" color="foreground-1">
          Details
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Created: {new Date(agent.createdAt).toLocaleString()}
        </Text>
        {agent.lastActiveAt && (
          <Text variant="body-normal" color="foreground-3">
            Last active: {new Date(agent.lastActiveAt).toLocaleString()}
          </Text>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  );
}
