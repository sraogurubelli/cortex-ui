# Cortex UI

Monorepo for Cortex UI: shared packages and standalone apps. Cortex-only.

## Structure

```
cortex-ui/
├── apps/
│   ├── ai-evals-app/      # Single-feature evals app (standalone)
│   ├── cortex-core-ui/    # Host app: unified shell + platform features
│   ├── helloworld-app/    # Sample app (agents, evaluations, chat)
│   └── showcase/         # Component showcase
├── packages/
│   ├── core/              # Primitives (chat, agents, badges, layout building blocks)
│   ├── platform/          # Platform logic (host registration) + feature modules (evals, …)
│   └── design-system/     # Design tokens / shared styles
└── pnpm-workspace.yaml
```

- **packages/core** — UI primitives only; no feature logic.
- **packages/platform** — Platform logic (host registration contract, feature descriptors) and feature modules (evals first); any app can depend on it and run standalone.
- **apps/ai-evals-app** — Evals-only app (standalone); routes at `/overview`, `/datasets`, `/scorers`, `/results`.
- **apps/cortex-core-ui** — **One host, multiple features register.** Single shell; each feature registers nav + routes. Evals first; add more in `src/features.ts`.

## One host, features register

The Cortex host (`cortex-core-ui`) is the single entry point. Features don’t live in the host code—they **register** with it:

- **Platform** exposes a feature descriptor per feature (e.g. `getEvalsFeature('/evals')`) with `sectionLabel`, `navItems`, and `routes`.
- **Host** keeps a list of registered features in `src/features.ts`. Layout and routes are built from that list.
- To add a feature: implement `getXxxFeature(pathPrefix)` in platform (same shape as `getEvalsFeature`), then add it to `registeredFeatures` in the host. No other host changes.

**Running the host is sufficient:** `pnpm dev:host` gives you the full platform; all registered products (evals and any others you add) are available from that one app. Use `pnpm dev:evals` only when you need the evals UI as a standalone app.

## Prerequisites

- **Node.js** 20.19+ or 22.12+ (for Vite 7)
- **pnpm** (e.g. `npm install -g pnpm`)
- For evals apps: **aiEvals API** running (e.g. `http://localhost:9000`)

## Quick start

```bash
pnpm install
```

Then run **one** of these. For the platform and all its products, **`pnpm dev:host` is enough** (no need to run multiple apps):

| Command          | What it runs | When to use                                                  | URL                   |
| ---------------- | ------------ | ------------------------------------------------------------ | --------------------- |
| `pnpm dev:host`  | Cortex host  | The platform—evals and all registered products; **use this** | http://localhost:5177 |
| `pnpm dev:evals` | AI Evals app | Evals UI only, standalone                                    | http://localhost:5176 |
| `pnpm dev`       | Sample app   | Demo (agents, evaluations, chat)                             | http://localhost:5175 |

## Environment (evals apps)

- **VITE_AI_EVALS_API_URL** (optional) — Backend base URL.  
  Leave unset to use the Vite proxy: `/evals` → `http://localhost:9000`. Set it to point at another host if needed.

## Build

```bash
pnpm --filter @cortex/ai-evals-app build   # ai-evals-app
pnpm --filter @cortex/core-ui build        # cortex-core-ui host
```

## Testing

We use **Vitest** with React Testing Library for unit and integration tests.

### Run Tests

```bash
# Run all tests (cortex-core-ui)
pnpm --filter @cortex/core-ui test

# Run with UI
pnpm --filter @cortex/core-ui test:ui

# Run with coverage
pnpm --filter @cortex/core-ui test:coverage
```

### Coverage Targets

- Statements: 50%
- Branches: 40%
- Functions: 50%
- Lines: 50%

See [docs/testing.md](docs/testing.md) for detailed testing guide.

## Code Quality

### Pre-commit Hooks

Husky runs automatically on `git commit`:

- **Prettier** — Auto-formats code
- **ESLint** — Lints and auto-fixes TypeScript/React code

### Manual Commands

```bash
# Format all code
pnpm format

# Check formatting (without changes)
pnpm format:check

# Lint all code
pnpm lint

# Lint with auto-fix
pnpm lint:fix
```

### Configuration Files

- `.prettierrc.json` — Prettier settings
- `eslint.config.js` — ESLint rules (flat config)
- `.lintstagedrc.json` — Pre-commit file patterns

## Development Workflows

### Using Node 20+

This project requires Node.js 20+. If using nvm:

```bash
nvm use 20
```

### Separate Dev/Prod Builds

Each app has separate Vite configurations:

- `vite.config.dev.ts` — Fast HMR, no minification
- `vite.config.prod.ts` — Minified, optimized, chunk retry

Production builds include:

- Chunk splitting (vendor-react, vendor-query, vendor-ui)
- Automatic chunk load retry (3 attempts)
- Content hashing for cache busting
- Full source maps

## Design system

Use **only the Canary design system** (Apache-2.0). For components or patterns that don’t exist in Canary, **build from scratch** using Canary tokens and primitives (e.g. Radix UI). See [packages/design-system](packages/design-system/README.md).

## Docs

- [packages/design-system](packages/design-system/README.md) — Design tokens and shared styles; Canary-only policy
- [packages/platform](packages/platform/README.md) — Platform API, evals hooks/components, host registration (`HostFeature`, `getEvalsFeature`)
- [apps/cortex-core-ui](apps/cortex-core-ui/README.md) — Cortex host: one host, features register
- [apps/ai-evals-app](apps/ai-evals-app/README.md) — Evals standalone app (single-feature)
