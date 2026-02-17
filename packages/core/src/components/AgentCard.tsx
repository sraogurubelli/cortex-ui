import React from 'react';

export interface AgentCardProps {
  name: string;
  description?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'running';
  onClick?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  avatar,
  status = 'inactive',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cortex-agent-card"
      style={{
        padding: '1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {avatar && (
        <img
          src={avatar}
          alt={name}
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
        />
      )}
      <h3>{name}</h3>
      {description && <p>{description}</p>}
      <span className={`status status-${status}`}>{status}</span>
    </div>
  );
};
