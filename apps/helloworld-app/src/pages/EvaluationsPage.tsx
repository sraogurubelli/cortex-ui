import { Layout, Text } from '@harnessio/ui/components';
import { EvaluationsList } from '../features/evaluations/components/EvaluationsList';

/** List pillar: card grid of evaluations. */
export default function EvaluationsPage() {
  return (
    <Layout.Vertical gapY="lg" className="w-full">
      <Layout.Vertical gapY="sm">
        <Text variant="heading-large" color="foreground-1">
          Hi
        </Text>
        <Text variant="body-normal" color="foreground-3">
          Evaluations — list view
        </Text>
      </Layout.Vertical>
      <EvaluationsList />
    </Layout.Vertical>
  );
}
