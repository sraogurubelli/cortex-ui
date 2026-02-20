import { Link } from 'react-router-dom';
import { Layout, Text, IconV2 } from '@harnessio/ui/components';
import type { IconV2NamesType } from '@harnessio/ui/components';
import { MOCK_AGENTS } from '../features/agents/data/mockAgents';
import { MOCK_EVALUATIONS } from '../features/evaluations/data/mockEvaluations';

/**
 * WebChatUI Dashboard pillar: overview with stat cards and quick links.
 */
export default function HomePage() {
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-large" color="foreground-1">
          Hi
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Welcome to Cortex UI Hello World. Use the left nav to open Dashboard, Agents, Evaluations, or Conversations.
        </Text>
      </Layout.Vertical>

      {/* Stat cards – Dashboards pillar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-cn-md">
        <Link to="/agents" className="no-underline">
          <StatCard
            title="Agents"
            value={String(MOCK_AGENTS.length)}
            description="View and manage agents"
            icon="ai-ml-ops"
          />
        </Link>
        <Link to="/evaluations" className="no-underline">
          <StatCard
            title="Evaluations"
            value={String(MOCK_EVALUATIONS.length)}
            description="View evaluations"
            icon="target"
          />
        </Link>
        <Link to="/conversations" className="no-underline">
          <StatCard
            title="Conversations"
            value="Chat"
            description="Open chat"
            icon="code-chat"
          />
        </Link>
      </div>

      {/* Getting started – framework pillars */}
      <div className="p-cn-lg rounded-cn-2 border border-cn-border-1 bg-cn-1">
        <Text variant="body-strong" color="foreground-1" className="mb-cn-sm block">
          WebChatUI framework
        </Text>
        <Text variant="body-normal" color="foreground-3" className="mb-cn-md">
          This app follows the four pillars: Left Nav (sidebar), Chat (Conversations), List (Agents & Evaluations), and Dashboards (this page).
        </Text>
        <Layout.Vertical gapY="xs">
          <Text variant="caption-single-line-normal" color="foreground-2">
            • Left Nav → Sidebar with scope selector and nav items
          </Text>
          <Text variant="caption-single-line-normal" color="foreground-2">
            • Chat → Conversations page with @cortex/core chat components
          </Text>
          <Text variant="caption-single-line-normal" color="foreground-2">
            • List → Agents and Evaluations card grids
          </Text>
          <Text variant="caption-single-line-normal" color="foreground-2">
            • Dashboards → This overview and stat cards
          </Text>
        </Layout.Vertical>
      </div>
    </Layout.Vertical>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: IconV2NamesType;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="p-cn-lg rounded-cn-2 border border-cn-border-1 bg-cn-1 hover:bg-cn-background-hover transition-colors h-full">
      <Layout.Vertical gapY="sm">
        <Layout.Horizontal justify="between" align="center">
          <Text variant="body-normal" color="foreground-3">
            {title}
          </Text>
          <IconV2 name={icon} size="sm" color="secondary" />
        </Layout.Horizontal>
        <Text variant="heading-section" color="foreground-1">
          {value}
        </Text>
        <Text variant="caption-single-line-normal" color="foreground-3">
          {description}
        </Text>
      </Layout.Vertical>
    </div>
  );
}
