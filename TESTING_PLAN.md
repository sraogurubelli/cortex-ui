# Cortex UI Testing Plan - Phase 4 Enhancements

**Date:** 2026-03-23
**Scope:** All Phase 4 enhancements (Weeks 1-5)
**Status:** Ready for Testing

---

## Overview

This testing plan covers verification of all enhancements made during Phase 4:
- **Week 1**: Prompts Feature (JSON validation, dual forms)
- **Week 2**: Component Library (4 new input components)
- **Week 3-4**: Evals Feature (CRUD, forms, enhanced components)
- **Week 5**: Final Polish (Documents & Chat)

---

## 1. Pre-Testing Setup

### 1.1 Fix TypeScript Issues

**Status:** 🔴 Required

Several files have `// @ts-nocheck` added, indicating type issues need resolution.

**Files to Fix:**
- `/features/documents/pages/DocumentsPageEnhanced.tsx`
- `/features/chat/pages/ChatPageEnhanced.tsx`
- `/features/chat/forms/chat-settings-form.ts`

**Known Issues:**
- Dialog component imports may not match actual exports from `@harnessio/ui/components`
- Mock components created as workarounds (DialogContent, DialogHeader, etc.)

**Action Items:**
1. Verify Dialog component exports from @harnessio/ui
2. Fix imports or use correct component names
3. Remove `// @ts-nocheck` directives
4. Ensure all types are properly imported

---

### 1.2 Install Dependencies

```bash
cd /Users/sgurubelli/aiplatform/cortex-ui
npm install
```

**Verify:**
- All `@harnessio/*` packages installed
- No missing peer dependencies
- Package versions match requirements

---

## 2. Build Verification

### 2.1 Platform Build

```bash
npm run build:platform
```

**Expected:** Clean build with no errors

**Check for:**
- ✅ TypeScript compilation successful
- ✅ No type errors
- ✅ No import errors
- ✅ All enhanced components included in bundle
- ✅ Form definitions compile correctly

**If Errors:**
- Document each error
- Fix imports/types
- Retry build
- Verify error resolution

---

### 2.2 Lint Check

```bash
npm run lint
```

**Expected:** No linting errors (warnings acceptable)

**Common Issues:**
- Unused imports (clean up)
- Missing keys in map functions
- Console.log statements (remove or comment)
- Accessibility warnings (fix if critical)

**Auto-fix:**
```bash
npm run lint:fix
```

---

## 3. Component Library Testing

### 3.1 NumberInput Component

**File:** `/forms/inputs/NumberInput.tsx`

**Test Cases:**

| Test | Input | Expected Output | Status |
|------|-------|-----------------|--------|
| Basic increment | Click ▲ button | Value increases by step | ⏳ |
| Basic decrement | Click ▼ button | Value decreases by step | ⏳ |
| Min boundary | Decrement at min value | Button disabled, value unchanged | ⏳ |
| Max boundary | Increment at max value | Button disabled, value unchanged | ⏳ |
| Manual input | Type "5.5" | Value updates to 5.5 | ⏳ |
| Invalid input | Type "abc" | Value reverts or shows error | ⏳ |
| Step precision | step=0.1, increment | Value increases by 0.1 | ⏳ |
| Keyboard arrows | Arrow up/down keys | Value changes by step | ⏳ |

**Integration Test:**
- Use in scorer form (threshold field)
- Use in chat settings (temperature, max_tokens, top_p)
- Verify validation works with z.coerce.number()

---

### 3.2 CheckboxInput Component

**File:** `/forms/inputs/CheckboxInput.tsx`

**Test Cases:**

| Test | Mode | Input | Expected Output | Status |
|------|------|-------|-----------------|--------|
| Single checkbox | No options | Click | Boolean true/false | ⏳ |
| Checkbox group | 3 options | Select 2 | Array with 2 values | ⏳ |
| Checkbox group | 3 options | Select all | Array with 3 values | ⏳ |
| Checkbox group | 3 options | Deselect all | Empty array | ⏳ |
| Default value | Single | default: true | Checkbox checked | ⏳ |
| Default value | Group | default: ['a', 'b'] | 2 checkboxes checked | ⏳ |

**Integration Test:**
- Use in scorer form (case_sensitive field)
- Use in chat settings (stream field)
- Verify boolean vs array handling

---

### 3.3 RadioInput Component

**File:** `/forms/inputs/RadioInput.tsx`

**Test Cases:**

| Test | Input | Expected Output | Status |
|------|-------|-----------------|--------|
| Select option | Click option 1 | Value updates to option 1 | ⏳ |
| Switch option | Select option 2 | Value changes to option 2 | ⏳ |
| Default value | default: 'option1' | Option 1 pre-selected | ⏳ |
| Required validation | Submit without selection | Validation error | ⏳ |
| Layout vertical | layout: 'vertical' | Options stacked | ⏳ |
| Layout horizontal | layout: 'horizontal' | Options in row | ⏳ |
| With descriptions | Include descriptions | Descriptions visible | ⏳ |

**Integration Test:**
- Use in scorer form (type field with descriptions)
- Use in dataset items upload form (format field)
- Verify option descriptions display correctly

---

### 3.4 FileInput Component

**File:** `/forms/inputs/FileInput.tsx`

**Test Cases:**

| Test | Input | Expected Output | Status |
|------|-------|-----------------|--------|
| File selection | Click + select file | File name displayed | ⏳ |
| Drag and drop | Drag file to drop zone | File accepted | ⏳ |
| Drag feedback | Drag file over zone | Visual feedback (highlight) | ⏳ |
| File type validation | Upload .txt (accept: .pdf) | Error message shown | ⏳ |
| File size validation | Upload 15MB (max: 10MB) | Error message shown | ⏳ |
| Valid file | Upload 5MB .json | File accepted, preview shown | ⏳ |
| Remove file | Click remove button | File cleared | ⏳ |
| Multiple files | Upload 3 files | All 3 displayed | ⏳ |

**Integration Test:**
- Use in dataset items upload form
- Verify accept: '.json,.jsonl,.csv' works
- Verify maxSize: 10MB enforced
- Test file preview display

---

## 4. Form Validation Testing

### 4.1 Prompts Feature Forms

**Form:** `prompt-template-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| template | Empty | "" | Error: "Template cannot be empty" | ⏳ |
| template | Too long | 11000 chars | Error: "Maximum 10000 characters" | ⏳ |
| template | Valid | "Hello {{name}}" | Accepted | ⏳ |

**Form:** `prompt-test-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| variables | Valid JSON | `{"name": "John"}` | Accepted | ⏳ |
| variables | Invalid JSON | `{name: John}` | Error: "Must be valid JSON" | ⏳ |
| variables | Empty | "" | Accepted (empty object) | ⏳ |
| variables | Malformed | `{"incomplete":` | Error: "Must be valid JSON" | ⏳ |

---

### 4.2 Evals Feature Forms

**Form:** `dataset-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| name | Empty | "" | Error: "Name is required" | ⏳ |
| name | Too long | 101 chars | Error: "Maximum 100 characters" | ⏳ |
| name | Valid | "Test Dataset" | Accepted | ⏳ |
| identifier | Invalid chars | "My Dataset!" | Error: "lowercase, numbers, hyphens only" | ⏳ |
| identifier | Valid | "my-dataset-1" | Accepted | ⏳ |
| description | Too long | 501 chars | Error: "Maximum 500 characters" | ⏳ |
| description | Optional | "" | Accepted | ⏳ |

**Form:** `scorer-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| type | exact_match | Select | threshold hidden, case_sensitive shown | ⏳ |
| type | semantic | Select | threshold shown, case_sensitive hidden | ⏳ |
| type | llm_judge | Select | threshold + custom_prompt shown | ⏳ |
| threshold | Below min | -0.1 | Error: "Minimum 0" | ⏳ |
| threshold | Above max | 1.1 | Error: "Maximum 1" | ⏳ |
| threshold | Valid | 0.75 | Accepted | ⏳ |
| custom_prompt | Too short | "Hi" | Error: "Minimum 10 characters" | ⏳ |
| custom_prompt | Too long | 2001 chars | Error: "Maximum 2000 characters" | ⏳ |

**Form:** `dataset-items-upload-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| format | Not selected | null | Error: "Required" | ⏳ |
| format | Valid | "json" | Accepted | ⏳ |
| file | Not selected | null | Error: "Please select a file" | ⏳ |
| file | Wrong type | .txt file | Error (if accept restrictions work) | ⏳ |
| file | Too large | 15MB | Error: "Exceeds 10MB limit" | ⏳ |
| file | Valid | 5MB .json | Accepted | ⏳ |

---

### 4.3 Chat Feature Forms

**Form:** `chat-settings-form.ts`

| Field | Test | Input | Expected | Status |
|-------|------|-------|----------|--------|
| model | Not selected | "" | Error: "Please select a model" | ⏳ |
| model | Valid | "gpt-4" | Accepted | ⏳ |
| system_prompt | Too long | 4001 chars | Error: "Maximum 4000 characters" | ⏳ |
| system_prompt | Optional | "" | Accepted | ⏳ |
| temperature | Below min | -0.1 | Error: "Minimum 0" | ⏳ |
| temperature | Above max | 1.1 | Error: "Maximum 1" | ⏳ |
| temperature | Valid | 0.7 | Accepted | ⏳ |
| max_tokens | Below min | 50 | Error: "Minimum 100" | ⏳ |
| max_tokens | Above max | 9000 | Error: "Maximum 8000" | ⏳ |
| max_tokens | Valid | 2000 | Accepted | ⏳ |

---

## 5. CRUD Operations Testing

### 5.1 Datasets (Evals Feature)

**Component:** `DatasetListEnhanced`

| Operation | Steps | Expected | Status |
|-----------|-------|----------|--------|
| **List** | Navigate to datasets page | All datasets displayed in cards | ⏳ |
| **Create** | Click "Create Dataset" button | Dialog opens | ⏳ |
| **Create** | Fill form + submit | Dataset created, toast shown, dialog closes | ⏳ |
| **Create** | Invalid form + submit | Validation errors shown | ⏳ |
| **Read** | Click dataset card | Navigate to detail page | ⏳ |
| **Delete** | Hover card, click Delete | Confirmation dialog opens | ⏳ |
| **Delete** | Confirm deletion | Dataset deleted, toast shown, list refreshes | ⏳ |
| **Delete** | Cancel deletion | Dialog closes, dataset not deleted | ⏳ |
| **Tabs** | Click "Recent" tab | Shows 6 most recent datasets | ⏳ |
| **Empty State** | No datasets exist | Shows empty state with CTA | ⏳ |

---

### 5.2 Scorers (Evals Feature)

**Component:** `ScorerListEnhanced`

| Operation | Steps | Expected | Status |
|-----------|-------|----------|--------|
| **List** | Navigate to scorers page | All scorers displayed | ⏳ |
| **Create** | Click "Create Scorer", fill form | Scorer created | ⏳ |
| **Create** | Select "semantic" type | Threshold field appears | ⏳ |
| **Create** | Select "exact_match" type | Case sensitive checkbox appears | ⏳ |
| **Create** | Select "llm_judge" type | Custom prompt field appears | ⏳ |
| **Delete** | Hover card, confirm delete | Scorer deleted | ⏳ |
| **Tabs - By Type** | Click "By Type" tab | Scorers grouped by type | ⏳ |
| **Tabs - Recent** | Click "Recent" tab | Shows 6 most recent | ⏳ |

---

### 5.3 Documents

**Component:** `DocumentsPageEnhanced`

| Operation | Steps | Expected | Status |
|-----------|-------|----------|--------|
| **Upload** | Drag file to drop zone | File uploaded, toast shown | ⏳ |
| **Upload** | Upload via file picker | File uploaded | ⏳ |
| **Upload Error** | Upload fails | Error toast shown | ⏳ |
| **Search** | Enter query, click Search | Results displayed | ⏳ |
| **Search** | Press Enter in input | Search triggered | ⏳ |
| **Search - No Results** | Search nonexistent term | "No results found" toast | ⏳ |
| **View** | Click View button | Preview modal opens | ⏳ |
| **Delete** | Click Delete button | AlertDialog opens | ⏳ |
| **Delete** | Confirm deletion | Document deleted, toast shown | ⏳ |
| **Delete** | Cancel deletion | Dialog closes, document persists | ⏳ |

---

### 5.4 Chat Settings

**Component:** `ChatPageEnhanced`

| Operation | Steps | Expected | Status |
|-----------|-------|----------|--------|
| **Open Settings** | Click Settings button | Dialog opens | ⏳ |
| **Change Model** | Select different model | Model updated | ⏳ |
| **Adjust Temperature** | Use ▲▼ buttons | Temperature changes by 0.1 | ⏳ |
| **Set System Prompt** | Enter custom prompt | Prompt saved | ⏳ |
| **Save Settings** | Click Save | Dialog closes, toast shown | ⏳ |
| **Cancel** | Click Cancel | Dialog closes, settings unchanged | ⏳ |
| **Reset to Defaults** | Click Reset button | All settings reset, toast shown | ⏳ |
| **Model Badge** | Hover model badge | Tooltip shows all settings | ⏳ |
| **Quick Action** | Click "Change settings" in quick actions | Dialog opens | ⏳ |

---

## 6. UI/UX Testing

### 6.1 Design System Consistency

**Check all enhanced components:**

| Aspect | Expected | Components to Check | Status |
|--------|----------|---------------------|--------|
| Colors | All use `var(--cn-*)` design tokens | All enhanced components | ⏳ |
| Typography | Consistent font sizes/weights | All text elements | ⏳ |
| Spacing | Uses `var(--cn-spacing-*)` | All layouts | ⏳ |
| Borders | Uses `var(--cn-border-*)` | All cards/dialogs | ⏳ |
| Hover States | Proper hover feedback | All interactive elements | ⏳ |
| Focus States | Visible focus indicators | All inputs/buttons | ⏳ |

---

### 6.2 Toast Notifications

**Verify all toast messages:**

| Feature | Action | Expected Toast | Status |
|---------|--------|----------------|--------|
| Documents | Upload success | "Document uploaded successfully" | ⏳ |
| Documents | Upload error | "Upload failed" + description | ⏳ |
| Documents | Delete success | "Document deleted" + name | ⏳ |
| Documents | Delete error | "Failed to delete document" | ⏳ |
| Documents | Search no results | "No results found" | ⏳ |
| Evals | Dataset created | "Dataset created" + name | ⏳ |
| Evals | Dataset deleted | "Dataset deleted" + name | ⏳ |
| Evals | Scorer created | "Scorer created" + name | ⏳ |
| Evals | Scorer deleted | "Scorer deleted" + name | ⏳ |
| Chat | Settings saved | "Settings updated" + model | ⏳ |
| Chat | Settings reset | "Settings reset to defaults" | ⏳ |

---

### 6.3 Dialog Behavior

**Test all dialogs:**

| Dialog | Trigger | Expected Behavior | Status |
|--------|---------|-------------------|--------|
| Create Dataset | Click button | Opens, form visible, focus on first field | ⏳ |
| Create Scorer | Click button | Opens, scrollable if long | ⏳ |
| Chat Settings | Click button/badge | Opens, current settings pre-filled | ⏳ |
| Delete Confirmation | Click delete | Opens, shows item name | ⏳ |
| Close via X | Click X | Closes without saving | ⏳ |
| Close via Overlay | Click outside | Closes without saving | ⏳ |
| Close via Escape | Press Esc | Closes without saving | ⏳ |

---

### 6.4 Tabs

**Test tab navigation:**

| Component | Tab | Expected | Status |
|-----------|-----|----------|--------|
| DatasetList | All Datasets | Shows all datasets | ⏳ |
| DatasetList | Recent | Shows 6 most recent | ⏳ |
| ScorerList | All Scorers | Shows all scorers | ⏳ |
| ScorerList | By Type | Groups by type with headers | ⏳ |
| ScorerList | Recent | Shows 6 most recent | ⏳ |
| ResultsTable | All Runs | Shows all runs | ⏳ |
| ResultsTable | Completed | Filters to completed only | ⏳ |
| ResultsTable | Running | Filters to running only | ⏳ |
| ResultsTable | Failed | Filters to failed only | ⏳ |

---

### 6.5 Badges

**Verify badge display:**

| Component | Badge | Expected | Status |
|-----------|-------|----------|--------|
| DatasetCard | Item count | Shows "{count} items" | ⏳ |
| ScorerCard | Type | Color-coded by type | ⏳ |
| ScorerCard | Config | Shows up to 3 config entries | ⏳ |
| ResultsTable | Status | Color-coded (success/destructive/outline) | ⏳ |
| ResultsTable | Success rate | Shows percentage | ⏳ |
| ChatPage | Model | Shows current model name | ⏳ |

---

### 6.6 Tooltips

**Test tooltip behavior:**

| Component | Trigger | Expected Content | Status |
|-----------|---------|------------------|--------|
| Chat Model Badge | Hover badge | Shows model, temperature, max_tokens, streaming | ⏳ |
| Any button with icon | Hover | Shows descriptive text (if tooltips added) | ⏳ |

---

## 7. Accessibility Testing

### 7.1 Keyboard Navigation

**Test keyboard-only navigation:**

| Action | Keys | Expected | Status |
|--------|------|----------|--------|
| Navigate to form | Tab | Focus moves through form fields | ⏳ |
| Submit form | Enter on button | Form submits | ⏳ |
| Close dialog | Escape | Dialog closes | ⏳ |
| Select radio option | Arrow keys | Selection changes | ⏳ |
| Toggle checkbox | Space | Checkbox toggles | ⏳ |
| Increment number | Arrow up | Value increases | ⏳ |
| Decrement number | Arrow down | Value decreases | ⏳ |
| Activate card | Enter on card | Card action triggered | ⏳ |

---

### 7.2 Screen Reader Support

**Check ARIA attributes:**

| Component | Attribute | Expected | Status |
|-----------|-----------|----------|--------|
| All buttons | aria-label or text | Descriptive label | ⏳ |
| All inputs | aria-required | Set when required | ⏳ |
| All inputs | aria-invalid | Set when validation fails | ⏳ |
| Dialogs | role="dialog" | Present | ⏳ |
| Dialogs | aria-labelledby | Points to title | ⏳ |
| Cards | role="article" | Present | ⏳ |
| Cards | tabIndex={0} | Keyboard focusable | ⏳ |

---

## 8. Performance Testing

### 8.1 Form Rendering

**Test form performance:**

| Form | Fields | Expected Render Time | Status |
|------|--------|---------------------|--------|
| Dataset Form | 3 fields | <50ms | ⏳ |
| Scorer Form | 7 fields (conditionally visible) | <100ms | ⏳ |
| Chat Settings | 7 fields | <100ms | ⏳ |

---

### 8.2 List Rendering

**Test large lists:**

| Component | Items | Expected | Status |
|-----------|-------|----------|--------|
| DatasetList | 20 datasets | Smooth scrolling, no lag | ⏳ |
| ScorerList | 20 scorers | Smooth scrolling | ⏳ |
| ResultsTable | 50 runs | Smooth scrolling | ⏳ |

---

## 9. Error Handling

### 9.1 Network Errors

**Simulate network failures:**

| Operation | Failure Point | Expected | Status |
|-----------|---------------|----------|--------|
| Create Dataset | API returns 500 | Error toast with description | ⏳ |
| Delete Dataset | Network timeout | Error toast shown | ⏳ |
| Load Datasets | API returns 404 | Error message displayed | ⏳ |
| Upload Document | Upload fails | Error toast with description | ⏳ |

---

### 9.2 Validation Errors

**Test error display:**

| Field | Error | Expected Display | Status |
|-------|-------|------------------|--------|
| Required text | Empty | Error below field | ⏳ |
| Number out of range | 1.5 (max: 1) | Error message with constraint | ⏳ |
| Invalid format | "ABC" in identifier | Error with format hint | ⏳ |
| Invalid JSON | Malformed JSON | Specific parse error | ⏳ |

---

## 10. Browser Compatibility

**Test in multiple browsers:**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ⏳ |
| Firefox | Latest | ⏳ |
| Safari | Latest | ⏳ |
| Edge | Latest | ⏳ |

**Check for:**
- Layout consistency
- Form functionality
- Toast positioning
- Dialog behavior
- Input component rendering

---

## 11. Testing Checklist Summary

### Phase 1: Pre-Testing
- [ ] Fix TypeScript errors (remove `@ts-nocheck`)
- [ ] Run `npm install`
- [ ] Run `npm run build:platform` successfully
- [ ] Run `npm run lint` (no errors)

### Phase 2: Component Testing
- [ ] NumberInput: All 8 test cases pass
- [ ] CheckboxInput: All 6 test cases pass
- [ ] RadioInput: All 7 test cases pass
- [ ] FileInput: All 8 test cases pass

### Phase 3: Form Validation
- [ ] Prompts forms: All validation tests pass
- [ ] Evals forms: All validation tests pass
- [ ] Chat settings form: All validation tests pass

### Phase 4: CRUD Operations
- [ ] Datasets: Create, Read, Delete work
- [ ] Scorers: Create, Read, Delete work
- [ ] Documents: Upload, Search, View, Delete work
- [ ] Chat Settings: All settings can be configured

### Phase 5: UI/UX
- [ ] All toasts display correctly
- [ ] All dialogs open/close properly
- [ ] All tabs navigate correctly
- [ ] All badges display correctly
- [ ] Tooltips show proper content

### Phase 6: Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader attributes present
- [ ] Focus management correct

### Phase 7: Performance
- [ ] Forms render quickly (<100ms)
- [ ] Lists scroll smoothly
- [ ] No UI freezing

### Phase 8: Error Handling
- [ ] Network errors show toasts
- [ ] Validation errors display properly
- [ ] Recovery from errors works

### Phase 9: Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## 12. Test Results Documentation

**After testing, document:**

### Passed Tests
- List all passing tests
- Note any performance metrics
- Capture screenshots of key features

### Failed Tests
- Document each failure
- Include error messages
- Note reproduction steps
- Assign priority (P0, P1, P2)

### Known Issues
- List any known limitations
- Document workarounds
- Plan for future fixes

---

## 13. Sign-Off Criteria

**Ready for production when:**
- [ ] All P0 (critical) issues resolved
- [ ] Build completes without errors
- [ ] All forms validate correctly
- [ ] All CRUD operations functional
- [ ] All toasts/dialogs work
- [ ] Keyboard navigation functional
- [ ] Works in all target browsers
- [ ] No TypeScript errors
- [ ] Documentation complete

---

## Next Steps After Testing

1. **Fix Issues**: Address all identified bugs
2. **Optimize**: Improve any performance issues
3. **Document**: Update user documentation
4. **Deploy**: Prepare for production deployment
5. **Monitor**: Set up error tracking and analytics

---

**Testing Status:** 🟡 Ready to Begin

Last Updated: 2026-03-23
