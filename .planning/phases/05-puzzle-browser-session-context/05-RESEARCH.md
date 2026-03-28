# Phase 5: Puzzle Browser & Session Context - Research

**Researched:** 2026-03-28
**Domain:** React puzzle browsing flow, difficulty-scoped session persistence, and app-shell context continuity
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Browser entry model
- **D-01:** Use a dedicated browser view first, then enter puzzle play.
- **D-02:** The browser should be the primary place to choose puzzle difficulty and puzzle id before opening the board.

### Difficulty navigation behavior
- **D-03:** Use segmented difficulty tabs (`Easy`, `Medium`, `Hard`) in the browser view.
- **D-04:** Puzzle list content switches directly by selected tab rather than secondary nested filters.

### Session restore policy
- **D-05:** Persist and restore selected difficulty only for this phase (roadmap minimum scope).
- **D-06:** Do not persist full browser/play UI state in Phase 5.

### First-load and invalid-storage fallback
- **D-07:** If saved difficulty is missing or invalid, derive fallback from the last playable puzzle context when available.
- **D-08:** If no derivable puzzle context exists, default to `Easy`.

### In-play difficulty context visibility
- **D-09:** Best-guess decision: keep active difficulty visibly present in play view (meta/context surface) so players see which browser context they came from.
- **D-10:** Best-guess decision: provide a clear path back to browser that preserves currently selected difficulty tab.

### Claude's Discretion
- Exact localStorage key naming and serialization format for selected difficulty.
- Exact browser-to-play transition animation/layout treatment within the established shell style.
- Exact copy for browser headings, empty-states, and back-to-browser affordance.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PACK-03 | Player can browse or select puzzles by difficulty across easy, medium, and hard groups | Browser-first two-view architecture; segmented `tablist` + difficulty-filtered puzzle list derived from `starterPackPuzzles`; explicit browser-to-play transition contract |
| SAVE-02 | System persists the last selected difficulty in localStorage | App-owned `selectedDifficulty` state hydrated from localStorage with strict difficulty validation and deterministic fallback to `Easy` |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Platform remains web browser only (desktop + mobile).
- Architecture remains frontend-only with localStorage persistence; no backend dependencies.
- Puzzle logic correctness remains deterministic and testable.
- MVP scope is tight; avoid expansion features in this phase.
- Use existing codebase patterns (currently App-owned state with presentational children).
- Workflow directive: phase work should stay aligned with GSD flow artifacts.

## Summary

Phase 5 should introduce a dedicated puzzle-browser view in front of the existing play shell, with difficulty tabs (`Easy`, `Medium`, `Hard`) as the primary browse control and puzzle selection entrypoint. The current code already has the right ownership boundary: `App.tsx` owns global session state and puzzle index, while shell components remain mostly presentational. Keep that pattern and add two new App-owned concerns only: `selectedDifficulty` and a lightweight `activeView` (`browser | play`).

For persistence, only write/read last selected difficulty (SAVE-02). Do not persist full route/UI state. On load, hydrate from localStorage, validate against the known `Difficulty` union (`easy|medium|hard`), and fallback safely (`Easy` default if no valid value). Keep in-play context visible by continuing to surface difficulty in `PuzzleMeta` and adding a back-to-browser affordance that preserves currently selected difficulty tab.

Testing should extend existing app-level Testing Library patterns (`getByRole` / interaction flows) with browser-tab and localStorage assertions. This phase can be delivered without new dependencies.

**Primary recommendation:** Implement a browser-first `App` state machine (`browser/play`) with App-owned `selectedDifficulty` persisted as a single validated localStorage string, and verify behavior with targeted App integration tests.

## Standard Stack

### Core
| Library | Version (project) | Current npm (verified 2026-03-28) | Purpose | Why Standard |
|---------|-------------------|-------------------------------------|---------|--------------|
| react | ^19.1.1 | 19.2.4 | UI state/view composition | Existing app foundation; keep consistency for Phase 5 scope |
| react-dom | ^19.1.1 | 19.2.4 | DOM renderer | Required by existing app runtime |
| vite | ^7.1.3 | 8.0.3 | Build/dev server | Existing project toolchain |
| typescript | ^5.9.2 | 6.0.2 | Static typing for difficulty/session contracts | Prevents invalid difficulty values from crossing boundaries |

### Supporting
| Library | Version (project) | Current npm (verified 2026-03-28) | Purpose | When to Use |
|---------|-------------------|-------------------------------------|---------|-------------|
| vitest | ^3.2.4 | 4.1.2 | Unit/integration tests | Existing test runner for app-level flow assertions |
| @testing-library/react | ^16.3.0 | 16.3.2 | DOM behavior tests | Browser tabs, selection flow, back-navigation behavior tests |
| jsdom | ^26.1.0 | 29.0.1 | Browser API emulation in tests | localStorage + DOM behavior in CI |
| @testing-library/jest-dom | ^6.6.3 | 6.9.1 | Matcher extensions | Accessibility/visibility assertions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| App-local view state (`browser|play`) | React Router | Router adds complexity not required by current two-view scope |
| App `useState` + derived selectors | Zustand/Redux | Overkill for single persisted field and small routing state |
| localStorage string value | serialized object blob | Blob creates avoidable parsing/migration surface for one field |

**Installation:**
```bash
npm install
```

**Version verification:**
```bash
npm view react version time.modified
npm view vite version time.modified
npm view vitest version time.modified
npm view @testing-library/react version time.modified
npm view typescript version time.modified
npm view @vitejs/plugin-react version time.modified
npm view jsdom version time.modified
npm view @testing-library/jest-dom version time.modified
```
Verified on 2026-03-28 with live npm registry responses.

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── App.tsx                         # Owns browser/play route + selectedDifficulty persistence
├── components/
│   ├── PuzzleBrowser.tsx           # New: difficulty tabs + filtered puzzle list + select action
│   ├── PuzzleShell.tsx             # Existing play shell; receives back action + context props
│   └── PuzzleMeta.tsx              # Existing context strip; keep difficulty visible in play
├── data/starterPack.ts             # Source of truth for puzzle list + difficulty labels
└── components/__tests__/
   └── App.browser.test.tsx         # New: PACK-03/SAVE-02 integration tests
```

### Pattern 1: App-Owned Session State + Presentational Children
**What:** Keep `selectedDifficulty`, `activeView`, and selected puzzle identity in `App`; pass down callbacks and render-only props.
**When to use:** For cross-component state that must persist or coordinate browser and play screens.
**Example:**
```tsx
// Source: local codebase pattern (src/App.tsx)
const [activeView, setActiveView] = useState<"browser" | "play">("browser");
const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
```

### Pattern 2: Validate Persistence Boundaries
**What:** Treat localStorage as untrusted input and coerce to typed domain values only after validation.
**When to use:** Hydrating any value from browser storage (especially across versions/old tabs/private mode).
**Example:**
```ts
// Source: MDN localStorage + project difficulty union
function parseStoredDifficulty(value: string | null): Difficulty | null {
  return value === "easy" || value === "medium" || value === "hard" ? value : null;
}
```

### Pattern 3: Accessibility-First Segmented Tabs
**What:** Implement difficulty selector as `tablist`/`tab` semantics and test with role queries.
**When to use:** Switching visible puzzle groups in one panel.
**Example:**
```tsx
// Source: MDN tab panel role + Testing Library ByRole guidance
<div role="tablist" aria-label="Difficulty">
  <button role="tab" aria-selected={selectedDifficulty === "easy"}>Easy</button>
</div>
```

### Anti-Patterns to Avoid
- **Persisting full UI snapshots:** Violates D-06 and increases migration risk; persist only `selectedDifficulty`.
- **Resetting selected difficulty on every puzzle open:** Breaks SAVE-02 and user orientation.
- **Mixing difficulty tabs with index-only navigation rules:** Causes hidden cross-difficulty jumps and ambiguous context.
- **Mount-position bugs that reset state unexpectedly:** Keep browser/play state in stable App positions; avoid accidental key churn.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session persistence | Custom storage abstraction with schema engine | native `window.localStorage` with strict parsing | Only one field; abstraction cost > value for Phase 5 |
| Difficulty grouping | Secondary duplicated data model | derive groups from `starterPackPuzzles` | Avoids drift from canonical pack metadata |
| Browser test selectors | brittle class/text-only DOM targeting | Testing Library role/name queries | More resilient + accessibility-aligned |
| View routing | Complex URL router state | simple App enum state (`browser|play`) | Matches exact scope and current architecture |

**Key insight:** Phase 5 is a narrow state-orchestration change, not a platform rewrite. Reuse existing App ownership patterns and avoid adding framework layers.

## Common Pitfalls

### Pitfall 1: Crashing on malformed storage values
**What goes wrong:** App assumes stored difficulty is valid and uses it directly.
**Why it happens:** localStorage is mutable and can contain stale/invalid strings.
**How to avoid:** Validate against strict union before use; fallback deterministically.
**Warning signs:** Blank browser lists, impossible tab states, runtime type assertions failing.

### Pitfall 2: Losing context when switching to play
**What goes wrong:** Player enters puzzle play but cannot tell which difficulty context they came from.
**Why it happens:** Browser state not threaded into play metadata/back path.
**How to avoid:** Keep difficulty visible in `PuzzleMeta`; include explicit back-to-browser action preserving tab.
**Warning signs:** UX confusion and regressions in “return to browser context” acceptance tests.

### Pitfall 3: Difficulty and puzzle selection drifting apart
**What goes wrong:** Selected puzzle belongs to different difficulty than active tab.
**Why it happens:** Index-based navigation logic reused without difficulty guardrails.
**How to avoid:** Select by puzzle id from filtered list and derive active difficulty from the selected record at transition points.
**Warning signs:** Play view displays difficulty mismatch vs selected tab.

### Pitfall 4: Inaccessible tab implementation
**What goes wrong:** Visual tabs exist but no semantic tab roles or selected state.
**Why it happens:** Styling-first implementation without ARIA semantics.
**How to avoid:** Implement `tablist`/`tab`/`tabpanel` semantics and test with `getByRole`.
**Warning signs:** Keyboard and assistive tech cannot identify active difficulty.

## Code Examples

Verified patterns from official sources:

### Persist selected difficulty with validation
```tsx
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// Source: https://react.dev/reference/react/useEffect
const STORAGE_KEY = "squares.selectedDifficulty.v1";

const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(() => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "easy" || stored === "medium" || stored === "hard" ? stored : "easy";
});

useEffect(() => {
  window.localStorage.setItem(STORAGE_KEY, selectedDifficulty);
}, [selectedDifficulty]);
```

### Test browser tabs with accessible role queries
```tsx
// Source: https://testing-library.com/docs/queries/byrole/
render(<App />);
fireEvent.click(screen.getByRole("tab", { name: "Medium" }));
expect(screen.getByRole("tab", { name: "Medium", selected: true })).toBeInTheDocument();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Puzzle navigation primarily by global prev/next index | Difficulty-first browser entry with explicit puzzle selection | Phase 5 scope (2026-03-28 planning) | Better discoverability and meets PACK-03 |
| Unpersisted browsing context | Persist last selected difficulty in localStorage | Phase 5 scope (2026-03-28 planning) | Meets SAVE-02 and improves return-session continuity |
| Non-semantic segmented controls | ARIA tab semantics tested by role | Current accessibility standard | Improves keyboard/screen-reader reliability |

**Deprecated/outdated:**
- Persisting broad UI snapshots for this phase: out of scope and risk-heavy vs requirement.

## Open Questions

1. **Interpretation of D-07 “last playable puzzle context” without full state persistence**
   - What we know: D-05/D-06 limit persistence to selected difficulty only.
   - What's unclear: Whether fallback should inspect current in-memory puzzle when storage is invalid.
   - Recommendation: Implement fallback precedence as `(valid stored difficulty) -> (current puzzle difficulty if available in session) -> easy`.

2. **Back-to-browser UX placement**
   - What we know: D-10 requires clear path back preserving selected tab.
   - What's unclear: Whether this belongs in `PuzzleMeta`, nav controls, or shell header CTA.
   - Recommendation: Place near existing puzzle navigation controls for consistency and testability.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | React/Vite/Vitest execution | ✓ | v22.16.0 | — |
| npm | package scripts/test execution | ✓ | 11.12.1 | — |
| Vitest CLI | requirement-level automated verification | ✓ | vitest/3.2.4 | `npm test -- --run` |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + Testing Library React 16.3.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test -- --run src/components/__tests__/App.browser.test.tsx` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PACK-03 | Browse by Easy/Medium/Hard tabs and open puzzle from selected group | integration | `npm test -- --run src/components/__tests__/App.browser.test.tsx -t "browses puzzles by difficulty"` | ❌ Wave 0 |
| SAVE-02 | Restore last selected difficulty after remount/reload | integration | `npm test -- --run src/components/__tests__/App.browser.test.tsx -t "restores selected difficulty from localStorage"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --run src/components/__tests__/App.browser.test.tsx`
- **Per wave merge:** `npm test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/__tests__/App.browser.test.tsx` — PACK-03 and SAVE-02 flow coverage
- [ ] localStorage fixture helper in test file (or shared helper) — deterministic storage preloading/cleanup

## Sources

### Primary (HIGH confidence)
- Local phase context and requirements:
  - `.planning/phases/05-puzzle-browser-session-context/05-CONTEXT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
- Local code references:
  - `src/App.tsx`
  - `src/data/starterPack.ts`
  - `src/types/puzzle.ts`
  - `src/components/PuzzleShell.tsx`
  - `src/components/PuzzleMeta.tsx`
  - `src/components/PuzzleNavigator.tsx`
  - `src/components/__tests__/App.test.tsx`
  - `src/components/__tests__/App.placement.test.tsx`
  - `vitest.config.ts`
  - `package.json`
- Official docs:
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  - https://react.dev/reference/react/useEffect
  - https://react.dev/learn/preserving-and-resetting-state
  - https://vitest.dev/config/environment
  - https://vitest.dev/guide/environment.html
  - https://testing-library.com/docs/queries/byrole/
  - https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tabpanel_role
- npm registry verification via command line on 2026-03-28:
  - `npm view react version time.modified`
  - `npm view vite version time.modified`
  - `npm view vitest version time.modified`
  - `npm view @testing-library/react version time.modified`
  - `npm view typescript version time.modified`
  - `npm view @vitejs/plugin-react version time.modified`
  - `npm view jsdom version time.modified`
  - `npm view @testing-library/jest-dom version time.modified`

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - live npm verification plus existing project lockstep
- Architecture: HIGH - directly aligned with current App ownership patterns in repo
- Pitfalls: HIGH - grounded in official docs and current component/test architecture

**Research date:** 2026-03-28
**Valid until:** 2026-04-27
