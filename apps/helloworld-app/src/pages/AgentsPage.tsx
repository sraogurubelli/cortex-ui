import { Layout, Text } from '@harnessio/ui/components';
import { AgentsList } from '../features/agents/components/AgentsList';

/** List pillar: card grid of agents. */
export default function AgentsPage() {
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-large" color="foreground-1">
          Hi
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Agents — list view
        </Text>
      </Layout.Vertical>
      <AgentsList />
    </Layout.Vertical>
  );
}
