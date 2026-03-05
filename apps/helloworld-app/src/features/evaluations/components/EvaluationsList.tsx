import { useEvaluations } from '../hooks/useEvaluations';
import { EvaluationCard } from './EvaluationCard';
import './EvaluationsList.css';

export const EvaluationsList: React.FC = () => {
  const { data: evaluations, isLoading, error } = useEvaluations();

  if (isLoading) {
    return <div className="evaluations-list-loading">Loading evaluations...</div>;
  }

  if (error) {
    return (
      <div className="evaluations-list-error">
        Error loading evaluations: {String(error)}
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return <div className="evaluations-list-empty">No evaluations found.</div>;
  }

  return (
    <div className="evaluations-list">
      {evaluations.map((evaluation) => (
        <EvaluationCard key={evaluation.id} evaluation={evaluation} />
      ))}
    </div>
  );
};
