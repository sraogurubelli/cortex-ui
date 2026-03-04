import { Link } from 'react-router-dom';
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
    <Link to={to} className="landing__glance-card">
      <div className="landing__glance-card-header">
        <span className="landing__glance-card-value">
          {isLoading ? '—' : count}
        </span>
      </div>
      <span className="landing__glance-card-label">{label}</span>
      {sublabel && (
        <span className="landing__glance-card-sublabel">{sublabel}</span>
      )}
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
    <div className="landing">
      <h1 className="landing__title">Welcome</h1>
      <p className="landing__subtitle">
        Your evals metrics at a glance.
      </p>

      <section className="landing__glance">
        <h2 className="landing__glance-title">At a Glance</h2>
        <p className="landing__glance-desc">
          Summary of datasets, scorers, and evaluation runs.
        </p>
        <div className="landing__glance-grid">
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
      </section>

      <section className="landing__products">
        <h2 className="landing__products-title">Products</h2>
        <p className="landing__products-desc">Choose a product to get started.</p>
        <div className="landing__cards">
          {features.map((feature) => {
            const firstPath = feature.navItems[0]?.path ?? '#';
            return (
              <Link
                key={feature.id}
                to={firstPath}
                className="landing__card"
              >
                <span className="landing__card-label">{feature.sectionLabel}</span>
                <span className="landing__card-arrow">→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
