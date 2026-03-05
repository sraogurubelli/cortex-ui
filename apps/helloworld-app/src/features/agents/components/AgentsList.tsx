import { Layout, Text } from '@harnessio/ui/components';
import { useAgents } from '../hooks/useAgents';
import { AgentCard } from './AgentCard';

export const AgentsList: React.FC = () => {
  const { data: agents, isLoading, error } = useAgents();

  if (isLoading) {
    return (
      <Layout.Vertical className="p-cn-lg text-center">
        <Text variant="body-normal" color="foreground-3">
          Loading agents...
        </Text>
      </Layout.Vertical>
    );
  }

  if (error) {
    return (
      <Layout.Vertical className="p-cn-lg text-center">
        <Text variant="body-normal" color="danger">
          Error loading agents: {String(error)}
        </Text>
      </Layout.Vertical>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Layout.Vertical className="p-cn-lg text-center">
        <Text variant="body-normal" color="foreground-3">
          No agents found.
        </Text>
      </Layout.Vertical>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cn-md">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
