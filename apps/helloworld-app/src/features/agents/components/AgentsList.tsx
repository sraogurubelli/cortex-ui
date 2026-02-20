import { Layout, Text } from '@harnessio/ui/components';
import { AgentCard } from './AgentCard';
import { MOCK_AGENTS } from '../data/mockAgents';

export const AgentsList: React.FC = () => {
  if (!MOCK_AGENTS.length) {
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
      {MOCK_AGENTS.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
