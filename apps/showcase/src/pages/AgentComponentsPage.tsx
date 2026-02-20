import { AgentCard, AgentAvatar } from '@cortex/core';
import './AgentComponentsPage.css';

export default function AgentComponentsPage() {
  const agents = [
    {
      name: 'Research Agent',
      description: 'Specialized in conducting deep research and analysis',
      status: 'active' as const,
      avatar: undefined,
    },
    {
      name: 'Code Generation Agent',
      description: 'Generates and reviews code based on requirements',
      status: 'running' as const,
      avatar: undefined,
    },
    {
      name: 'Data Analysis Agent',
      description: 'Analyzes datasets and generates insights',
      status: 'inactive' as const,
      avatar: undefined,
    },
  ];

  return (
    <div className="agent-components-page">
      <div className="page-header">
        <h1>Agent Components</h1>
        <p>
          Components for displaying and managing AI agents, including AgentCard
          and AgentAvatar.
        </p>
      </div>

      <div className="agent-demo-section">
        <h2>AgentCard</h2>
        <p className="section-description">
          Display agent information with name, description, avatar, and status.
        </p>
        <div className="agent-cards-grid">
          {agents.map((agent, idx) => (
            <AgentCard
              key={idx}
              name={agent.name}
              description={agent.description}
              status={agent.status}
              onClick={() => alert(`Clicked on ${agent.name}`)}
            />
          ))}
        </div>
      </div>

      <div className="agent-demo-section">
        <h2>AgentAvatar</h2>
        <p className="section-description">
          Display agent avatars with fallback to initials.
        </p>
        <div className="agent-avatars-grid">
          {agents.map((agent, idx) => (
            <div key={idx} className="avatar-demo-item">
              <AgentAvatar name={agent.name} size="lg" />
              <span>{agent.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="component-info">
        <h2>Component Details</h2>
        <div className="component-list">
          <div className="component-item">
            <h3>AgentCard</h3>
            <p>
              Card component for displaying agent information including name,
              description, avatar, and status indicator. Supports click handlers
              for interaction.
            </p>
            <div className="props-list">
              <strong>Props:</strong>
              <ul>
                <li><code>name</code> - Agent name (required)</li>
                <li><code>description</code> - Agent description (optional)</li>
                <li><code>avatar</code> - Avatar image URL (optional)</li>
                <li><code>status</code> - Status: 'active' | 'inactive' | 'running'</li>
                <li><code>onClick</code> - Click handler (optional)</li>
              </ul>
            </div>
          </div>
          <div className="component-item">
            <h3>AgentAvatar</h3>
            <p>
              Avatar component that displays agent image or falls back to
              initials based on the agent name.
            </p>
            <div className="props-list">
              <strong>Props:</strong>
              <ul>
                <li><code>name</code> - Agent name (required)</li>
                <li><code>avatar</code> - Avatar image URL (optional)</li>
                <li><code>size</code> - Avatar size in pixels (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
