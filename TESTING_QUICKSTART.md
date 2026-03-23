# Testing Quick Start Guide

Quick reference for testing Phase 4 enhancements.

---

## 🚀 Quick Test Commands

### Automated Basic Checks
```bash
./test-phase4.sh
```
Runs automated file existence checks, export verification, and optional build/lint.

---

### Manual Build & Lint

```bash
# Build platform package
npm run build:platform

# Run linter
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format
```

---

## 📋 Quick Manual Test Checklist

### 1. Component Library (5 min)

**NumberInput:**
- [ ] Open chat settings, adjust temperature with ▲▼ buttons
- [ ] Verify min (0) and max (1) boundaries enforced

**CheckboxInput:**
- [ ] Open chat settings, toggle "Enable Streaming"
- [ ] Open scorer form, check "Case Sensitive" (conditional visibility)

**RadioInput:**
- [ ] Open scorer form, select different scorer types
- [ ] Verify descriptions show for each option

**FileInput:**
- [ ] Open dataset items upload form
- [ ] Drag a .json file to drop zone
- [ ] Verify file preview appears

---

### 2. Forms Validation (5 min)

**Dataset Form:**
- [ ] Try creating dataset with empty name → Error
- [ ] Try identifier with spaces → Error
- [ ] Create valid dataset → Success

**Scorer Form:**
- [ ] Select "Semantic" type → Threshold field appears
- [ ] Select "Exact Match" type → Case sensitive appears
- [ ] Select "LLM Judge" → Custom prompt appears

**Chat Settings:**
- [ ] Set temperature to 1.5 → Error (max 1)
- [ ] Set max_tokens to 50 → Error (min 100)
- [ ] Save valid settings → Toast shows success

---

### 3. CRUD Operations (5 min)

**Datasets:**
- [ ] Create new dataset → Toast confirms creation
- [ ] Delete dataset → AlertDialog appears
- [ ] Confirm delete → Dataset removed, toast shows

**Documents:**
- [ ] Upload file → Toast confirms upload
- [ ] Delete document → AlertDialog appears (not window.confirm!)
- [ ] Search documents → Results or "No results found" toast

**Chat Settings:**
- [ ] Open settings dialog
- [ ] Change model to "Claude 3.5 Sonnet"
- [ ] Save → Toast confirms, badge updates

---

### 4. UI/UX (3 min)

**Toasts:**
- [ ] Perform any action → Toast appears with proper styling
- [ ] Toast auto-dismisses after ~5 seconds
- [ ] Multiple toasts queue properly

**Dialogs:**
- [ ] Open any dialog → Overlay darkens background
- [ ] Click outside → Dialog closes
- [ ] Press Escape → Dialog closes

**Tabs:**
- [ ] Navigate between tabs in DatasetList (All, Recent)
- [ ] Navigate tabs in ScorerList (All, By Type, Recent)
- [ ] Navigate tabs in ResultsTable (All, Completed, Running, Failed)

**Badges:**
- [ ] Hover chat model badge → Tooltip shows settings
- [ ] Check scorer card → Type badge shows color
- [ ] Check results table → Status badges color-coded

---

### 5. Accessibility (2 min)

- [ ] Tab through form → All fields reachable
- [ ] Press Escape in dialog → Closes
- [ ] Use arrow keys in NumberInput → Value changes
- [ ] Press Space on checkbox → Toggles

---

## 🐛 Common Issues & Fixes

### Issue: TypeScript Errors

**Symptom:** Files have `// @ts-nocheck` at the top

**Fix:**
```bash
# Check for @ts-nocheck files
grep -r "// @ts-nocheck" packages/platform/src/

# Fix imports in affected files
# Usually Dialog component imports need adjustment
```

---

### Issue: Build Fails

**Symptom:** `npm run build:platform` errors

**Fix:**
1. Check error message for missing imports
2. Verify all `@harnessio/*` packages installed
3. Run `npm install` again
4. Check TypeScript errors in IDE

---

### Issue: Lint Errors

**Symptom:** `npm run lint` shows errors

**Fix:**
```bash
# Auto-fix most issues
npm run lint:fix

# Format code
npm run format

# Manually fix remaining issues
```

---

### Issue: Component Not Rendering

**Symptom:** Enhanced component doesn't show up

**Fix:**
1. Check export in `components/index.ts`
2. Verify import path in consuming file
3. Check browser console for errors
4. Verify component is registered in InputFactory (for inputs)

---

## 🎯 Priority Test Areas

### High Priority (Must Test)
1. ✅ Create/Delete operations work with Toast feedback
2. ✅ AlertDialog replaces window.confirm (no browser popups!)
3. ✅ All forms validate correctly
4. ✅ NumberInput ▲▼ controls work
5. ✅ Conditional form fields appear/hide

### Medium Priority (Should Test)
1. ✅ Tabs navigate correctly
2. ✅ Tooltips display on hover
3. ✅ Empty states show when no data
4. ✅ File upload accepts/rejects based on type/size
5. ✅ Search functionality works

### Low Priority (Nice to Have)
1. ✅ Keyboard navigation smooth
2. ✅ All badges display correctly
3. ✅ Performance is acceptable
4. ✅ Works in different browsers

---

## 📊 Test Results Template

### Date: _______
### Tester: _______

#### Files Created: ✅ All present
- [ ] NumberInput.tsx
- [ ] CheckboxInput.tsx
- [ ] RadioInput.tsx
- [ ] FileInput.tsx
- [ ] Evals forms (3 files)
- [ ] Chat forms (2 files)
- [ ] Enhanced components (5 files)

#### Build Status
- [ ] `npm run build:platform` → ✅ Success / ❌ Failed
- [ ] `npm run lint` → ✅ Clean / ⚠️ Warnings / ❌ Errors

#### Component Tests
- [ ] NumberInput → ✅ / ❌
- [ ] CheckboxInput → ✅ / ❌
- [ ] RadioInput → ✅ / ❌
- [ ] FileInput → ✅ / ❌

#### CRUD Operations
- [ ] Datasets → ✅ / ❌
- [ ] Scorers → ✅ / ❌
- [ ] Documents → ✅ / ❌
- [ ] Chat Settings → ✅ / ❌

#### Critical Checks
- [ ] No `window.confirm()` or `window.alert()` → ✅ / ❌
- [ ] All toasts use `showToast` → ✅ / ❌
- [ ] All dialogs use AlertDialog → ✅ / ❌
- [ ] All colors use design tokens → ✅ / ❌

#### Issues Found
1. _________________________________
2. _________________________________
3. _________________________________

#### Overall Status
- [ ] ✅ Ready for production
- [ ] ⚠️ Minor issues, can deploy
- [ ] ❌ Blocking issues, do not deploy

---

## 🔗 Related Documentation

- **Full Testing Plan:** [TESTING_PLAN.md](TESTING_PLAN.md)
- **Phase 4 Summary:** See PHASE_4_WEEK_*_COMPLETE.md files
- **Component Docs:** packages/platform/src/forms/inputs/
- **Form Docs:** features/*/forms/

---

**Last Updated:** 2026-03-23
