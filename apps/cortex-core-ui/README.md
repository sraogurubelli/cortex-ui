# Cortex Core UI (Host)

**One host, multiple features.** Unified shell (layout + sidebar); each feature registers its nav items and routes. Evals is registered first; add connectors, agents, etc. by adding them to the registry. Cortex only.

## How registration works

- **Platform** exports a feature descriptor per feature (e.g. `getEvalsFeature('/evals')`) with `sectionLabel`, `navItems`, and `routes`.
- **Host** imports registered features in `src/features.ts`. Layout and routes are built from that list—no host code changes when you add a new feature, only a new entry in `registeredFeatures`.

## Prerequisites

- aiEvals API running (e.g. `http://localhost:9000`) when using Evals.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_AI_EVALS_API_URL` | (Optional) Backend base URL. Unset → Vite proxies `/evals` to `http://localhost:9000`. |
| `VITE_OAUTH_GITHUB_URL` | (Optional) OAuth redirect URL for GitHub. If set, clicking GitHub opens this; otherwise opens github.com in a new tab. |
| `VITE_OAUTH_GOOGLE_URL` | (Optional) OAuth redirect for Google. Same pattern as GitHub. |
| `VITE_OAUTH_LINKEDIN_URL`, `VITE_OAUTH_AZURE_URL` | (Optional) Same for LinkedIn and Azure. |
| `VITE_OAUTH_SSO_URL` | (Optional) Single sign-on URL. If set, "Single sign-on" button redirects here. |

## Run

From this app:

```bash
pnpm install
pnpm dev
```

From repo root:

```bash
pnpm dev:host
```

Runs at **http://localhost:5177**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/signin` | Sign-in page (email/password, social icons, SSO) |
| `/evals/overview` | Evals overview |
| `/evals/datasets` | Dataset list |
| `/evals/datasets/:datasetId` | Dataset detail |
| `/evals/scorers` | Scorer list |
| `/evals/results` | Results table |

To add a feature: implement `getXxxFeature(pathPrefix)` in platform (same shape as `getEvalsFeature`), then add it to `registeredFeatures` in `src/features.ts`.
