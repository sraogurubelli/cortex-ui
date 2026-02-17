import React from 'react';

export interface ScoreDisplayProps {
  scores: Array<{
    name: string;
    value: number;
    maxValue?: number;
  }>;
  layout?: 'horizontal' | 'vertical';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scores,
  layout = 'vertical',
}) => {
  return (
    <div
      className="cortex-score-display"
      style={{
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: '1rem',
      }}
    >
      {scores.map((score, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{score.name}</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {score.value.toFixed(2)}
            {score.maxValue && ` / ${score.maxValue}`}
          </span>
        </div>
      ))}
    </div>
  );
};
