import { EvaluationBadge, ScoreDisplay } from '@cortex/core';
import './EvaluationComponentsPage.css';

export default function EvaluationComponentsPage() {
  const scores = [
    { name: 'Accuracy', value: 0.92, maxValue: 1 },
    { name: 'Precision', value: 0.88, maxValue: 1 },
    { name: 'Recall', value: 0.95, maxValue: 1 },
    { name: 'F1 Score', value: 0.91, maxValue: 1 },
  ];

  return (
    <div className="evaluation-components-page">
      <div className="page-header">
        <h1>Evaluation Components</h1>
        <p>
          Components for displaying evaluation results, scores, and metrics.
        </p>
      </div>

      <div className="evaluation-demo-section">
        <h2>EvaluationBadge</h2>
        <p className="section-description">
          Display evaluation scores with color-coded badges based on performance.
        </p>
        <div className="badge-examples">
          <div className="badge-group">
            <h3>Success Variant</h3>
            <div className="badge-row">
              <EvaluationBadge score={0.95} maxScore={1} label="Score" variant="success" />
              <EvaluationBadge score={0.85} maxScore={1} label="Score" variant="success" />
              <EvaluationBadge score={0.75} maxScore={1} label="Score" variant="success" />
            </div>
          </div>
          <div className="badge-group">
            <h3>Warning Variant</h3>
            <div className="badge-row">
              <EvaluationBadge score={0.65} maxScore={1} label="Score" variant="warning" />
              <EvaluationBadge score={0.55} maxScore={1} label="Score" variant="warning" />
            </div>
          </div>
          <div className="badge-group">
            <h3>Error Variant</h3>
            <div className="badge-row">
              <EvaluationBadge score={0.45} maxScore={1} label="Score" variant="error" />
              <EvaluationBadge score={0.35} maxScore={1} label="Score" variant="error" />
            </div>
          </div>
          <div className="badge-group">
            <h3>Info Variant</h3>
            <div className="badge-row">
              <EvaluationBadge score={0.82} maxScore={1} label="Score" variant="info" />
              <EvaluationBadge score={85} maxScore={100} label="Score" variant="info" />
            </div>
          </div>
        </div>
      </div>

      <div className="evaluation-demo-section">
        <h2>ScoreDisplay</h2>
        <p className="section-description">
          Display multiple evaluation metrics in a structured layout.
        </p>
        <div className="score-display-examples">
          <div className="score-display-group">
            <h3>Vertical Layout</h3>
            <ScoreDisplay scores={scores} layout="vertical" />
          </div>
          <div className="score-display-group">
            <h3>Horizontal Layout</h3>
            <ScoreDisplay scores={scores} layout="horizontal" />
          </div>
        </div>
      </div>

      <div className="component-info">
        <h2>Component Details</h2>
        <div className="component-list">
          <div className="component-item">
            <h3>EvaluationBadge</h3>
            <p>
              Badge component for displaying evaluation scores with color-coded
              variants based on performance levels.
            </p>
            <div className="props-list">
              <strong>Props:</strong>
              <ul>
                <li><code>score</code> - Score value (required)</li>
                <li><code>maxScore</code> - Maximum score (default: 1)</li>
                <li><code>label</code> - Label text (optional)</li>
                <li><code>variant</code> - 'success' | 'warning' | 'error' | 'info'</li>
              </ul>
            </div>
          </div>
          <div className="component-item">
            <h3>ScoreDisplay</h3>
            <p>
              Component for displaying multiple evaluation metrics in a
              structured vertical or horizontal layout.
            </p>
            <div className="props-list">
              <strong>Props:</strong>
              <ul>
                <li><code>scores</code> - Array of score objects (required)</li>
                <li><code>layout</code> - 'horizontal' | 'vertical' (default: 'vertical')</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
