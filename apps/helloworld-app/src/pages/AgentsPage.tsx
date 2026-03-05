import { Layout, Text } from '@harnessio/ui/components';
import { AgentsList } from '../features/agents/components/AgentsList';

export default function AgentsPage() {
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-section" color="foreground-1">
          Agents
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Manage and monitor your AI agents
        </Text>
      </Layout.Vertical>
      <AgentsList />
    </Layout.Vertical>
  );
}
