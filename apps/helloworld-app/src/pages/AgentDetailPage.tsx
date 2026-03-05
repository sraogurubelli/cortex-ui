import { useParams, Link } from 'react-router-dom';
import { useAgent } from '../features/agents/hooks/useAgents';
import { AgentCard as CortexAgentCard, EvaluationBadge, ScoreDisplay } from '@cortex/core';
import './AgentDetailPage.css';

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading, error } = useAgent(id || '');

  if (isLoading) {
    return <div className="agent-detail-loading">Loading agent...</div>;
  }

  if (error || !agent) {
    return (
      <div className="agent-detail-error">
        <p>Error loading agent: {String(error)}</p>
        <Link to="/agents">← Back to Agents</Link>
      </div>
    );
  }

  return (
    <div className="agent-detail-page">
      <Link to="/agents" className="back-link">← Back to Agents</Link>
      
      <div className="agent-detail-header">
        <CortexAgentCard
          name={agent.name}
          description={agent.description}
          status={agent.status}
          avatar={agent.avatar}
        />
      </div>

      {agent.metrics && (
        <div className="agent-detail-metrics">
          <h2>Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Evaluations</h3>
              <p className="metric-value">{agent.metrics.totalEvaluations}</p>
            </div>
            <div className="metric-card">
              <h3>Average Score</h3>
              <EvaluationBadge
                score={agent.metrics.averageScore}
                maxScore={1}
                variant="success"
              />
            </div>
            <div className="metric-card">
              <h3>Success Rate</h3>
              <EvaluationBadge
                score={agent.metrics.successRate}
                maxScore={1}
                variant="success"
              />
            </div>
          </div>
          <div className="score-display-section">
            <ScoreDisplay
              scores={[
                { name: 'Average Score', value: agent.metrics.averageScore, maxValue: 1 },
                { name: 'Success Rate', value: agent.metrics.successRate, maxValue: 1 },
              ]}
              layout="horizontal"
            />
          </div>
        </div>
      )}

      <div className="agent-detail-info">
        <h2>Details</h2>
        <dl className="info-list">
          <dt>Created At</dt>
          <dd>{new Date(agent.createdAt).toLocaleString()}</dd>
          {agent.lastActiveAt && (
            <>
              <dt>Last Active</dt>
              <dd>{new Date(agent.lastActiveAt).toLocaleString()}</dd>
            </>
          )}
          <dt>Status</dt>
          <dd className={`status-${agent.status}`}>{agent.status}</dd>
        </dl>
      </div>
    </div>
  );
}
