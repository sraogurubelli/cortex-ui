# AI Evals App

Standalone single-feature app for AI Evals: datasets, scorers, and results. Uses `@cortex/platform`; standalone.

For **one host with multiple features** (evals + connectors, agents, etc.), use the [Cortex host](../cortex-core-ui/README.md) (`pnpm dev:host`) instead; evals registers there along with other features.

## Prerequisites

- aiEvals API running (e.g. `http://localhost:9000`).

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_AI_EVALS_API_URL` | (Optional) Backend base URL. Unset → Vite proxies `/evals` to `http://localhost:9000`. |

## Run

From this app:

```bash
pnpm install
pnpm dev
```

From repo root:

```bash
pnpm dev:evals
```

Runs at **http://localhost:5176**.

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/overview` |
| `/overview` | Evals overview (counts) |
| `/datasets` | Dataset list |
| `/datasets/:datasetId` | Dataset detail |
| `/scorers` | Scorer list |
| `/results` | Results (runs) table |
