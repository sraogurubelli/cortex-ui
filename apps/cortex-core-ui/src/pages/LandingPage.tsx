import { Link } from 'react-router-dom';
import { Layout, Text, Card } from '@harnessio/ui/components';
import { useDatasets, useScorers, useResults } from '@cortex/platform';
import type { HostFeature } from '@cortex/platform';

interface LandingPageProps {
  features: HostFeature[];
}

function AtAGlanceCard({
  label,
  count,
  isLoading,
  to,
  sublabel,
}: {
  label: string;
  count: number;
  isLoading: boolean;
  to: string;
  sublabel?: string;
}) {
  return (
    <Link to={to} className="no-underline">
      <Card.Root className="p-5 transition-colors hover:cn-bg-background-3 hover:border-cn-brand-primary">
        <Layout.Vertical gapY="xs">
          <Text variant="heading-section" className="cn-text-foreground-1">
            {isLoading ? '—' : count}
          </Text>
          <Text variant="body-strong" className="cn-text-foreground-1">
            {label}
          </Text>
          {sublabel && (
            <Text variant="heading-small" className="uppercase cn-text-foreground-3">
              {sublabel}
            </Text>
          )}
        </Layout.Vertical>
      </Card.Root>
    </Link>
  );
}

export default function LandingPage({ features }: LandingPageProps) {
  const { data: datasetsData, isLoading: datasetsLoading } = useDatasets(0, 1);
  const { data: scorersData, isLoading: scorersLoading } = useScorers(0, 1);
  const { data: runsData, isLoading: runsLoading } = useResults(0, 1);

  const datasetsCount = datasetsData?.total_elements ?? 0;
  const scorersCount = scorersData?.total_elements ?? 0;
  const runsCount = runsData?.total_elements ?? 0;

  return (
    <div className="max-w-4xl p-6">
      <Layout.Vertical gapY="lg">
        <Layout.Vertical gapY="xs">
          <Text variant="heading-section" className="cn-text-foreground-1">
            Welcome
          </Text>
          <Text variant="body-normal" className="cn-text-foreground-2">
            Your evals metrics at a glance.
          </Text>
        </Layout.Vertical>

        <section>
          <Layout.Vertical gapY="md">
            <Layout.Vertical gapY="xs">
              <Text variant="heading-subsection" className="cn-text-foreground-1">
                At a Glance
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-2">
                Summary of datasets, scorers, and evaluation runs.
              </Text>
            </Layout.Vertical>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AtAGlanceCard
                label="Datasets"
                count={datasetsCount}
                isLoading={datasetsLoading}
                to="/evals/datasets"
                sublabel="EVALS DATASETS"
              />
              <AtAGlanceCard
                label="Scorers"
                count={scorersCount}
                isLoading={scorersLoading}
                to="/evals/scorers"
                sublabel="EVALS SCORERS"
              />
              <AtAGlanceCard
                label="Runs"
                count={runsCount}
                isLoading={runsLoading}
                to="/evals/results"
                sublabel="RUNS IN LAST 7 DAYS"
              />
            </div>
          </Layout.Vertical>
        </section>

        <section>
          <Layout.Vertical gapY="md">
            <Layout.Vertical gapY="xs">
              <Text variant="heading-subsection" className="cn-text-foreground-1">
                Products
              </Text>
              <Text variant="body-normal" className="cn-text-foreground-2">
                Choose a product to get started.
              </Text>
            </Layout.Vertical>
            <div className="flex flex-wrap gap-4">
              {features.map((feature) => {
                const firstPath = feature.navItems[0]?.path ?? '#';
                return (
                  <Link key={feature.id} to={firstPath} className="no-underline">
                    <Card.Root className="min-w-[200px] p-5 transition-colors hover:cn-bg-background-3 hover:border-cn-brand-primary">
                      <Layout.Horizontal justify="between" align="center">
                        <Text variant="body-strong" className="cn-text-foreground-1">
                          {feature.sectionLabel}
                        </Text>
                        <Text variant="body-normal" className="cn-text-foreground-3">
                          →
                        </Text>
                      </Layout.Horizontal>
                    </Card.Root>
                  </Link>
                );
              })}
            </div>
          </Layout.Vertical>
        </section>
      </Layout.Vertical>
    </div>
  );
}
