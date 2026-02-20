import { Layout, Text } from '@harnessio/ui/components';
import { EvaluationCard } from './EvaluationCard';
import { MOCK_EVALUATIONS } from '../data/mockEvaluations';

export const EvaluationsList: React.FC = () => {
  if (!MOCK_EVALUATIONS.length) {
    return (
      <Layout.Vertical className="p-cn-lg text-center">
        <Text variant="body-normal" color="foreground-3">
          No evaluations found.
        </Text>
      </Layout.Vertical>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cn-md">
      {MOCK_EVALUATIONS.map((evaluation) => (
        <EvaluationCard key={evaluation.id} evaluation={evaluation} />
      ))}
    </div>
  );
};
