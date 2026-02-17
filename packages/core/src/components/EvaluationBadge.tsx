import React from 'react';

export interface EvaluationBadgeProps {
  score: number;
  maxScore?: number;
  label?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export const EvaluationBadge: React.FC<EvaluationBadgeProps> = ({
  score,
  maxScore = 1,
  label,
  variant = 'info',
}) => {
  const percentage = (score / maxScore) * 100;
  
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return percentage >= 80 ? '#22c55e' : '#84cc16';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div
      className="cortex-evaluation-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: `${getVariantColor()}20`,
        color: getVariantColor(),
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      {label && <span>{label}:</span>}
      <span>{score.toFixed(2)}</span>
      {maxScore !== 1 && <span>/ {maxScore}</span>}
    </div>
  );
};
