# Test Strategy — AI News RSS Feed

## Test Pyramid

```
         /  E2E (4 specs)  \          Playwright — Chromium, Firefox, WebKit
        /  Integration (3)  \         Jest — API routes + pipeline
       /   Component (6)     \        React Testing Library
      /      Unit (4)         \       Jest + ts-jest — agent modules
     /____________________________\
```

## Coverage Targets

| Layer | Target | Rationale |
|---|---|---|
| Unit | 90%+ | Core agent logic must be bulletproof |
| Component | 85%+ | UI correctness and accessibility |
| Integration | 80%+ | API contracts and data flow |
| E2E | Key flows | Critical user journeys in real browsers |

## Mock Strategy

| Dependency | Mock Approach |
|---|---|
| `rss-parser` | `jest.mock` — returns controlled feed objects |
| `@anthropic-ai/sdk` | `jest.mock` + `createMockAnthropicClient()` factory |
| `fs` | `jest.mock('fs')` — avoids real filesystem reads/writes |
| `next/navigation` | Mocked in `jest.setup.ts` globally |
| `localStorage` | In-memory mock in `jest.setup.ts` |

## Running Tests

```bash
# All unit + integration + component tests
npm test

# Unit tests only
npm test -- --selectProjects=node --testPathPattern=tests/unit

# Component tests only
npm test -- --selectProjects=jsdom

# Integration tests only
npm test -- --selectProjects=node --testPathPattern=tests/integration

# With coverage report
npm test -- --coverage

# E2E tests (requires running dev server)
npx playwright test --config=tests/e2e/playwright.config.ts

# E2E single browser
npx playwright test --project=chromium
```

## CI/CD Order

1. `eslint` + TypeScript type check
2. Unit tests (fastest feedback loop)
3. Component tests
4. Integration tests
5. `next build` (catches type errors in full build)
6. E2E tests against production build

## ARIA Attributes Required by Tests

Each component must expose the following for tests to work:

| Component | Required ARIA |
|---|---|
| `ArticleCard` | `role="article"` on wrapper |
| `CategoryFilter` | `role="tablist"` on container, `role="tab"` + `aria-selected` on each tab |
| `SearchBar` | `aria-label="Search articles"` + `role="searchbox"` on input |
| `BookmarkButton` | `aria-pressed` + `aria-label` ("Bookmark article" / "Remove bookmark") |
| `ThemeToggle` | `aria-label="Toggle theme"` + `aria-pressed` |
| `Toast` | `role="status"` + `aria-live="polite"` |
| Settings modal | `role="dialog"` + `aria-modal="true"` |
