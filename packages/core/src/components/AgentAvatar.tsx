import React from 'react';

export interface AgentAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  name,
  avatar,
  size = 'md',
}) => {
  const sizeMap = {
    sm: '32px',
    md: '48px',
    lg: '64px',
  };

  return (
    <div
      className="cortex-agent-avatar"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {avatar ? (
        <img src={avatar} alt={name} style={{ width: '100%', height: '100%' }} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};
