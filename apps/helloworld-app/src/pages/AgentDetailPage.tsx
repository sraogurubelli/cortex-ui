import { useParams, Link } from 'react-router-dom';
import { useAgent } from '../features/agents/hooks/useAgents';
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
      <Link to="/agents" className="back-link">
        ← Back to Agents
      </Link>

      <div className="agent-detail-header">
        <h1>{agent.name}</h1>
        {agent.description && <p className="description">{agent.description}</p>}
        <span className={`status-badge status-${agent.status}`}>{agent.status}</span>
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
              <p className="metric-value">{(agent.metrics.averageScore * 100).toFixed(0)}%</p>
            </div>
            <div className="metric-card">
              <h3>Success Rate</h3>
              <p className="metric-value">{(agent.metrics.successRate * 100).toFixed(0)}%</p>
            </div>
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
