import React from 'react';
import { Layout, Text } from '@harnessio/ui/components';
import { Link } from 'react-router-dom';
import type { Agent } from '../types';

export interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <Link to={`/agents/${agent.id}`} className="no-underline">
      <div className="h-full p-cn-lg rounded-cn-2 border border-cn-border-1 bg-cn-1 hover:bg-cn-background-hover transition-colors">
        <Layout.Vertical gapY="md">
          <Text variant="body-strong" color="foreground-1">
            {agent.name}
          </Text>
          <span className={`text-cn-size-2 ${agent.status === 'active' ? 'text-cn-success-primary' : agent.status === 'running' ? 'text-cn-warning' : 'text-cn-foreground-3'}`}>
            {agent.status}
          </span>
          {agent.description && (
            <Text variant="body-normal" color="foreground-3" className="line-clamp-2">
              {agent.description}
            </Text>
          )}
        </Layout.Vertical>
      </div>
    </Link>
  );
};
