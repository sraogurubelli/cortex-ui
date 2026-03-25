import { useMemo } from 'react';

import { IconV2, Layout, Text } from '@harnessio/ui/components';
import { Page } from '@harnessio/ui/views';

import { StatCard } from '../components/StatCard';
import { useDatasets } from '../hooks/useDatasets';
import { useScorers } from '../hooks/useScorers';
import { useResults } from '../hooks/useResults';

export function OverviewPage() {
  // Fetch all data (with large page sizes to get totals)
  const { data: datasetsResponse, isLoading: isLoadingDatasets } = useDatasets(0, 1000);
  const { data: scorersResponse, isLoading: isLoadingScorers } = useScorers(0, 1000);
  const { data: resultsResponse, isLoading: isLoadingResults } = useResults(0, 1000);

  const stats = useMemo(() => {
    const datasets = datasetsResponse?.data?.length || 0;
    const scorers = scorersResponse?.data?.length || 0;

    const results = resultsResponse?.data || [];
    // Calculate pass rate based on success_count vs total_items
    const passedResults = results.filter(
      r => r.success_count && r.total_items && r.success_count === r.total_items
    ).length;
    const totalResults = results.length;
    const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;

    return {
      datasets,
      scorers,
      totalRuns: totalResults,
      passRate,
    };
  }, [datasetsResponse, scorersResponse, resultsResponse]);

  const recentResults = useMemo(() => {
    return (resultsResponse?.data || []).slice(0, 5);
  }, [resultsResponse]);

  const isLoading = isLoadingDatasets || isLoadingScorers || isLoadingResults;

  return (
    <Page.Root>
      <Page.Header title="AI Evals Overview" />
      <Page.Content>
        <Layout.Vertical gap="xl" className="p-cn-md">
          {/* Stats Grid */}
          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Quick Stats</Text>
            <Layout.Horizontal gap="md" className="flex-wrap">
              <StatCard
                title="Datasets"
                value={isLoading ? '...' : stats.datasets}
                icon="database"
              />
              <StatCard title="Scorers" value={isLoading ? '...' : stats.scorers} icon="check" />
              <StatCard
                title="Total Runs"
                value={isLoading ? '...' : stats.totalRuns}
                icon="loader"
              />
              <StatCard
                title="Pass Rate"
                value={isLoading ? '...' : `${stats.passRate}%`}
                icon="shield"
                color="text-cn-success-primary"
              />
            </Layout.Horizontal>
          </Layout.Vertical>

          {/* Recent Results */}
          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Recent Evaluation Results</Text>
            <Layout.Vertical gap="sm">
              {isLoading ? (
                <Text color="foreground-3">Loading recent results...</Text>
              ) : recentResults.length === 0 ? (
                <Text color="foreground-3">No evaluation results yet</Text>
              ) : (
                recentResults.map((result, index) => {
                  const passed =
                    result.success_count != null &&
                    result.total_items != null &&
                    result.success_count === result.total_items;
                  return (
                    <Layout.Horizontal
                      key={result.run_id || index}
                      gap="md"
                      align="center"
                      className="rounded-cn-md border border-cn-borders-2 bg-cn-background-2 p-cn-md"
                    >
                      <IconV2
                        name={passed ? 'check' : 'xmark'}
                        size="md"
                        className={passed ? 'text-cn-success-primary' : 'text-cn-danger-primary'}
                      />
                      <Layout.Vertical gap="xs" className="flex-1">
                        <Text variant="body-strong">{result.name || 'Unnamed Run'}</Text>
                        <Text variant="caption-normal" color="foreground-3">
                          {result.success_count}/{result.total_items} passed • {result.status}
                        </Text>
                      </Layout.Vertical>
                      <Layout.Vertical align="end" gap="xs">
                        <Text variant="body-normal" color="foreground-2">
                          {result.completed_at
                            ? new Date(result.completed_at).toLocaleDateString()
                            : 'In progress'}
                        </Text>
                        {result.started_at && result.completed_at && (
                          <Text variant="caption-normal" color="foreground-3">
                            {Math.round(
                              (new Date(result.completed_at).getTime() -
                                new Date(result.started_at).getTime()) /
                                60000
                            )}{' '}
                            min
                          </Text>
                        )}
                      </Layout.Vertical>
                    </Layout.Horizontal>
                  );
                })
              )}
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Vertical>
      </Page.Content>
    </Page.Root>
  );
}
