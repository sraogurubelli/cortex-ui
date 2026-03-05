import { Layout, Text } from '@harnessio/ui/components';
import { EvaluationsList } from '../features/evaluations/components/EvaluationsList';

export default function EvaluationsPage() {
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-section" color="foreground-1">
          Evaluations
        </Text>
        <Text variant="body-normal" color="foreground-3">
          View and manage agent evaluations
        </Text>
      </Layout.Vertical>
      <EvaluationsList />
    </Layout.Vertical>
  );
}
