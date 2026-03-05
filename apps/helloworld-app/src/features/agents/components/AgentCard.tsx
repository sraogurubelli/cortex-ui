import React from 'react';
import { AgentCard as CortexAgentCard } from '@cortex/core';
import { Card, Layout, Text } from '@harnessio/ui/components';
import { Link } from 'react-router-dom';
import type { Agent } from '../types';

export interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <Link to={`/agents/${agent.id}`} className="no-underline">
      <Card.Root interactive className="h-full">
        <Card.Body>
          <Layout.Vertical gapY="md">
            <CortexAgentCard
              name={agent.name}
              description={agent.description}
              status={agent.status}
              avatar={agent.avatar}
            />
            {agent.description && (
              <Text variant="body-normal" color="foreground-3" className="line-clamp-2">
                {agent.description}
              </Text>
            )}
          </Layout.Vertical>
        </Card.Body>
      </Card.Root>
    </Link>
  );
};
