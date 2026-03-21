# AI News App — Design Session

**Date:** 2026-03-19
**Method:** Two-agent design team (UX Designer + Devil's Advocate)

---

## What We Did

Ran a structured UX audit using a two-agent team:
- **ux-designer** — explored the codebase, produced an audit, proposed improvements
- **devil's-advocate** — critiqued each proposal against the actual code, rejected weak ones, refined the rest

---

## Existing App Overview

Next.js 14 news crawler with an AI pipeline:

```
Fetch RSS → Filter (AI) → Summarize (Anthropic SDK) → Save to data/articles.json → Serve via API
```

**Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Anthropic SDK
**Key components:** `FeedHeader`, `CategoryFilter`, `ArticleCard`, `BookmarkButton`, `SearchBar`, `Toast`, `LoadingSkeleton`
**Data store:** `data/articles.json` (flat file)
**API routes:** `GET /api/feed`, `POST /api/refresh`, `GET /api/feed/xml`

---

## UX Audit — Problems Found

1. **Search input desync bug** — `defaultValue` (uncontrolled) meant clicking "Clear search" reset parent state but left stale text visible in the input
2. **No bookmark on detail page** — users could only bookmark from feed cards, not from the detail page where reading intent actually forms
3. **Category counts missing** — tabs had rendering logic for count badges but only "All" ever got a number
4. **No progress feedback** — after loading multiple pages, users had no sense of how many articles remained
5. **Keyboard navigation missing** — tabs used `role="tablist"` and `aria-selected` but lacked arrow-key navigation (WAI-ARIA non-compliant)
6. **Dark mode badge regression** — `CATEGORY_COLORS` in `article/[id]/page.tsx` was missing `dark:` variants that already existed in `ArticleCard.tsx`

---

## Devil's Advocate — Rejected Proposals

| Proposal | Rejection Reason |
|---|---|
| Article images in cards | 100% of `imageUrl` values in `articles.json` are `null` — all cards would show fallback placeholders |
| Scroll-to-top button | `FeedHeader` is already `sticky top-0`; 12-per-page explicit "Load More" means the feed never gets long enough to justify it |

---

## Approved & Implemented Changes

### P0 — Correctness

**1. Fix search input desync** — [SearchBar.tsx](src/components/SearchBar.tsx)
- Converted `defaultValue` → controlled input with local `inputValue` state
- `useEffect` syncs `inputValue` when parent `value` prop changes (e.g. on clear)
- Debounce still propagates to parent after 300ms

**2. Bookmark on article detail page** — [ArticleActions.tsx](src/components/ArticleActions.tsx) + [article/[id]/page.tsx](src/app/article/[id]/page.tsx)
- Created `ArticleActions` client component (island) wrapping `BookmarkButton` + "Read Original Article" link
- Detail page stays server-rendered; only the actions row is a client island
- Passes `articleId` and `sourceUrl` as props from the server component

### P1 — Quick Wins

**3. Per-category counts in filter tabs** — [article.ts](src/types/article.ts) + [feed/route.ts](src/app/api/feed/route.ts) + [page.tsx](src/app/page.tsx)
- Added `categoryCounts: Record<string, number>` to `FeedResponse` type
- API computes counts server-side after search filter, before category filter (so counts are always accurate for the full dataset)
- `page.tsx` stores counts in state and passes to `CategoryFilter`

**4. "Showing X of Y articles"** — [page.tsx](src/app/page.tsx)
- Added one-liner using existing `articles.length` and `total` state, displayed above the Load More button

**5. Keyboard navigation for category tabs** — [CategoryFilter.tsx](src/components/CategoryFilter.tsx)
- Added `onKeyDown` handler for `ArrowLeft` / `ArrowRight` keys
- Uses `buttonRefs` array to focus adjacent tab and activate it
- Compliant with WAI-ARIA tabs pattern

**6. Dark mode fix for detail page badges** — [article/[id]/page.tsx](src/app/article/[id]/page.tsx)
- Copied `dark:bg-*` and `dark:text-*` variant classes from `ArticleCard.tsx`'s `CATEGORY_COLORS` map into the detail page's version

---

## Files Changed

| File | Change |
|---|---|
| `src/components/SearchBar.tsx` | Bug fix: controlled input |
| `src/components/ArticleActions.tsx` | **New file**: client island for detail page actions |
| `src/app/article/[id]/page.tsx` | Dark mode badge fix + uses `ArticleActions` |
| `src/types/article.ts` | Added `categoryCounts` to `FeedResponse` |
| `src/app/api/feed/route.ts` | Computes + returns `categoryCounts` |
| `src/app/page.tsx` | Wires `categoryCounts` + "Showing X of Y" text |
| `src/components/CategoryFilter.tsx` | Arrow key navigation |

---

## Future Considerations (Deferred)

- **Article images** — revisit when the data pipeline populates `imageUrl` (currently always `null`)
- **Scroll-to-top** — revisit if pagination switches to infinite scroll

## TODO
- **Figure out a way to deploy this app to aws. Have aws credentials setup locally**