#!/bin/bash

# Phase 4 Testing Script
# Automates basic verification of Phase 4 enhancements

set -e

echo "🧪 Phase 4 Enhancement Testing"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 1. Check TypeScript files
section "1. Checking TypeScript Files"

FILES_TO_CHECK=(
    "packages/platform/src/forms/inputs/NumberInput.tsx"
    "packages/platform/src/forms/inputs/CheckboxInput.tsx"
    "packages/platform/src/forms/inputs/RadioInput.tsx"
    "packages/platform/src/forms/inputs/FileInput.tsx"
    "packages/platform/src/features/evals/forms/dataset-form.ts"
    "packages/platform/src/features/evals/forms/scorer-form.ts"
    "packages/platform/src/features/chat/forms/chat-settings-form.ts"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        pass "Found: $file"
    else
        fail "Missing: $file"
    fi
done

# 2. Check for @ts-nocheck directives
section "2. Checking for TypeScript Issues"

TS_NOCHECK_FILES=$(grep -r "// @ts-nocheck" packages/platform/src/features/ packages/platform/src/forms/ 2>/dev/null | wc -l)

if [ "$TS_NOCHECK_FILES" -gt 0 ]; then
    warn "Found $TS_NOCHECK_FILES file(s) with @ts-nocheck directive"
    grep -r "// @ts-nocheck" packages/platform/src/features/ packages/platform/src/forms/ 2>/dev/null || true
    warn "These should be fixed before production"
else
    pass "No @ts-nocheck directives found"
fi

# 3. Check exports
section "3. Checking Feature Exports"

EXPORT_FILES=(
    "packages/platform/src/forms/inputs/index.ts"
    "packages/platform/src/features/evals/forms/index.ts"
    "packages/platform/src/features/evals/components/index.ts"
    "packages/platform/src/features/chat/forms/index.ts"
)

for file in "${EXPORT_FILES[@]}"; do
    if [ -f "$file" ]; then
        pass "Export file exists: $file"
    else
        fail "Missing export file: $file"
    fi
done

# 4. Check documentation
section "4. Checking Documentation"

DOC_FILES=(
    "PHASE_4_WEEK_1_COMPLETE.md"
    "PHASE_4_WEEK_2_COMPLETE.md"
    "PHASE_4_WEEK_3_4_COMPLETE.md"
    "PHASE_4_WEEK_5_COMPLETE.md"
    "TESTING_PLAN.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        pass "Documentation exists: $file"
    else
        fail "Missing documentation: $file"
    fi
done

# 5. Check for console.log statements (should be minimal)
section "5. Checking for Debug Statements"

CONSOLE_LOGS=$(grep -r "console\.log" packages/platform/src/forms/ packages/platform/src/features/*/forms/ 2>/dev/null | grep -v "console.error" | wc -l)

if [ "$CONSOLE_LOGS" -gt 5 ]; then
    warn "Found $CONSOLE_LOGS console.log statements"
    warn "Consider removing debug logs before production"
else
    pass "Minimal console.log statements ($CONSOLE_LOGS found)"
fi

# 6. Build test (optional - commented out as it takes time)
section "6. Build Verification (Optional)"

read -p "Run build verification? This may take a few minutes. (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running: npm run build:platform"
    if npm run build:platform > /tmp/build-output.log 2>&1; then
        pass "Build successful"
    else
        fail "Build failed - check /tmp/build-output.log"
        tail -20 /tmp/build-output.log
    fi
else
    warn "Build verification skipped"
fi

# 7. Lint check (optional)
section "7. Lint Check (Optional)"

read -p "Run lint check? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running: npm run lint"
    if npm run lint > /tmp/lint-output.log 2>&1; then
        pass "Lint check passed"
    else
        warn "Lint issues found - check /tmp/lint-output.log"
        tail -20 /tmp/lint-output.log
    fi
else
    warn "Lint check skipped"
fi

# Summary
section "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo ""
echo "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests:  $TOTAL_TESTS"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All automated checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review TESTING_PLAN.md for manual tests"
    echo "2. Fix any @ts-nocheck issues if found"
    echo "3. Run full build and lint if skipped"
    echo "4. Perform manual UI testing"
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Please address the failed checks above"
fi

echo ""
