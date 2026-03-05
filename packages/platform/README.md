# @cortex/platform

Cortex platform layer: platform logic (host registration contract, feature descriptors) and feature modules—evals first (API, context, hooks, components). Any app can depend on `@cortex/platform` and run standalone. Cortex only.

## Evals feature

- **API** — Thin client for aiEvals (`/evals/api/v1/...`): datasets, items, scorers, runs.
- **Context** — `EvalsApiProvider`, `useEvalsApi()`; base URL from app (e.g. `''` when using Vite proxy).
- **Hooks** — `useDatasets`, `useDataset`, `useScorers`, `useScorer`, `useResults`, `useRun`, plus create/update/delete for datasets, items, scorers.
- **Components** — `DatasetCard`, `DatasetList`, `ScorerCard`, `ScorerList`, `ResultsTable`, `EvalsOverview`, `DatasetDetail`.

## Usage

```ts
import { EvalsApiProvider, DatasetList, useDatasets } from '@cortex/platform';

// In your app root or evals subtree
<EvalsApiProvider baseUrl={import.meta.env.VITE_AI_EVALS_API_URL ?? ''}>
  <DatasetList onSelectDataset={(id) => navigate(`/datasets/${id}`)} />
</EvalsApiProvider>
```

When `baseUrl` is `''`, the app should proxy `/evals` to the backend so requests are same-origin.

## Host registration

For the Cortex host, each feature exports a descriptor so the host can build nav and routes without hardcoding them:

```ts
import { getEvalsFeature } from '@cortex/platform';

const features = [getEvalsFeature('/evals')];
// Host renders sidebar from feature.sectionLabel + feature.navItems
// Host renders <Route> for each feature.routes
```

Types: `HostFeature`, `HostNavItem` (path + label). New features implement the same shape and register in the host’s `features` array.

## Dependencies

- `@cortex/core` (workspace)
- `@tanstack/react-query`, `react`, `react-dom`, `react-router-dom`
