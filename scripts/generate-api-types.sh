#!/usr/bin/env bash
#
# Generate TypeScript types from the cortex-ai OpenAPI schema.
#
# Prerequisites:
#   pnpm add -Dw openapi-typescript
#
# Usage:
#   # With cortex-ai running locally:
#   ./scripts/generate-api-types.sh
#
#   # With a custom URL:
#   CORTEX_API_URL=https://api.example.com ./scripts/generate-api-types.sh
#

set -euo pipefail

API_URL="${CORTEX_API_URL:-http://localhost:8000}"
SCHEMA_URL="${API_URL}/openapi.json"
OUTPUT="packages/core/src/api/generated.ts"

echo "Fetching OpenAPI schema from ${SCHEMA_URL}..."
npx openapi-typescript "${SCHEMA_URL}" -o "${OUTPUT}"

echo "Types written to ${OUTPUT}"
