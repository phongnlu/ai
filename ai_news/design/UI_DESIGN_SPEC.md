# UI Design Specification — AI News RSS Feed

## 1. Information Architecture

| Route | View | Description |
|---|---|---|
| `/` | Feed | Article cards, category filter tabs, search, Load More |
| `/article/[id]` | Article Detail | AI summary card, source link, related articles |
| `/bookmarks` | Bookmarks | Saved articles grid, empty state, Clear All |
| Settings modal | Modal | Theme, articles per page, default sort |

**Navigation:**
- Top header (sticky) — logo, search bar, bookmarks link, theme toggle
- Category tab bar — below header on Feed and Bookmarks views
- Breadcrumb — on Article Detail: `Feed > [category] > [title]`

---

## 2. Design System

### Color Palette

```css
/* Light Mode */
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --text-primary: #1A1A2E;
  --text-secondary: #6B7280;
  --accent: #2563EB;
  --accent-hover: #1D4ED8;
  --border: #E5E7EB;
  --category-research: #7C3AED;
  --category-product: #2563EB;
  --category-policy: #DC2626;
  --category-open-source: #16A34A;
}

/* Dark Mode */
.dark {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --accent: #3B82F6;
  --border: #334155;
  --category-research: #A78BFA;
  --category-product: #60A5FA;
  --category-policy: #F87171;
  --category-open-source: #4ADE80;
}
```

### Typography

Font stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| text-xs | 12px | 400 | 1.5 | Badges, timestamps |
| text-sm | 14px | 400 | 1.5 | Metadata, captions |
| text-base | 16px | 400 | 1.6 | Body, summaries |
| text-lg | 18px | 500 | 1.5 | Card titles |
| text-xl | 20px | 600 | 1.4 | Section headings |
| text-2xl | 24px | 700 | 1.3 | Page titles |
| text-3xl | 30px | 700 | 1.2 | Article detail title |

### Spacing (4px base unit)

`space-1`=4px, `space-2`=8px, `space-3`=12px, `space-4`=16px, `space-6`=24px, `space-8`=32px, `space-10`=40px, `space-12`=48px, `space-16`=64px

### Border Radius

`radius-sm`=4px, `radius-md`=8px, `radius-lg`=12px, `radius-full`=9999px

### Shadows

Light mode: `shadow-sm: 0 1px 2px rgba(0,0,0,0.05)`, `shadow-md: 0 4px 6px rgba(0,0,0,0.07)`
Dark mode: replace with `border: 1px solid var(--border)`

### Transitions

All interactive elements: `transition: all 150ms ease-in-out`

---

## 3. Responsive Breakpoints (Mobile-First)

| Breakpoint | Width | Card Grid |
|---|---|---|
| xs | 0px | 1 column |
| sm | 640px | 1 column, wider padding |
| md | 768px | 2 columns |
| lg | 1024px | 3 columns |
| xl | 1280px | 3 columns, max-width 1200px |

Container: `max-width: 1200px`, centered, `padding-x: 16px (mobile) / 32px (desktop)`

---

## 4. Text Wireframes

### Feed View (/)

```
+------------------------------------------------------------------+
| [AI News]              [Search articles...]    [Bookmark] [Sun]  |
+------------------------------------------------------------------+
| [All (48)] [Research (12)] [Product (15)] [Policy (9)] [OSS(12)] |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------+  +--------------------+  +--------------+ |
|  | RESEARCH           |  | PRODUCT            |  | OPEN-SOURCE  | |
|  | Article Title Two  |  | Article Title Two  |  | Article ...  | |
|  | Lines Max Clamped  |  | Lines Max Clamped  |  |              | |
|  |                    |  |                    |  |              | |
|  | Summary text here  |  | Summary text here  |  | Summary...   | |
|  | three lines clamp  |  | three lines clamp  |  | three lines  | |
|  | max overflow hid   |  | max overflow hid   |  | max overflow | |
|  |                    |  |                    |  |              | |
|  | Source    2h ago   |  | Source    5h ago   |  | Source  1d   | |
|  +--------------------+  +--------------------+  +--------------+ |
|                                                                    |
|                    [ Load More Articles ]                          |
+------------------------------------------------------------------+
```

### Article Detail View (/article/[id])

```
+------------------------------------------------------------------+
| [AI News]              [Search...]             [Bookmark] [Sun]  |
+------------------------------------------------------------------+
| ← Back to Feed                                                    |
|                                                                    |
| RESEARCH                                                          |
| Article Full Title in Large Bold Text                             |
| Source Name · March 6, 2026 · 4 min read                         |
|                                                                    |
| ┌──────────────────────────────────────────────────────────────┐ |
| │ AI SUMMARY                                                    │ |
| │                                                               │ |
| │ Claude-generated 2-3 sentence summary displayed here in a    │ |
| │ card with a 4px blue left border accent.                     │ |
| └──────────────────────────────────────────────────────────────┘ |
|                                                                    |
| [Read Original Article →]                                         |
|                                                                    |
| Related Articles                                                   |
| +------------------+  +------------------+  +------------------+ |
| | Related 1        |  | Related 2        |  | Related 3        | |
| +------------------+  +------------------+  +------------------+ |
+------------------------------------------------------------------+
```

### Bookmarks View (/bookmarks)

```
+------------------------------------------------------------------+
| [AI News]              [Search...]             [Bookmarks] [Sun] |
+------------------------------------------------------------------+
| ← Feed   Saved Articles (5)                      [Clear All]     |
+------------------------------------------------------------------+
| [card grid — same as Feed view]                                   |
|                                                                    |
| --- Empty state ---                                               |
| [Bookmark icon]                                                    |
| No saved articles yet.                                            |
| Browse the feed and bookmark articles to read later.              |
| [Browse Feed →]                                                   |
+------------------------------------------------------------------+
```

---

## 5. UX Interactions

### Load More (not infinite scroll)
- 12 articles per page
- Button at bottom, shows spinner while loading
- New cards animate in: fade-up 300ms, staggered 50ms per card
- Button hidden when `hasMore === false`

### Category Filter
- Tab bar: All / Research / Product / Policy / Open Source
- Active: accent bottom border 2px, bold text
- URL param: `?category=research`
- Count badges on each tab

### Search
- Desktop: expanded in header; Mobile: icon → full overlay
- 300ms debounce
- URL param: `?q=...`, combines with category
- Escape clears and closes (mobile)

### Article Card Hover
- `shadow-sm` → `shadow-md`, `translateY(-2px)`, 150ms
- Full card is a Next.js Link
- Bookmark button: `stopPropagation()`, scale animation on click

### Dark Mode
- Three states: light / dark / system
- `localStorage` key: `"theme"`
- 200ms transition on `<html>` element
- `document.documentElement.classList.toggle('dark')`

### Bookmarks
- `localStorage` key: `"ai-news-bookmarks"` (array of IDs)
- Add → toast "Article saved to bookmarks" (success)
- Remove → toast "Article removed from bookmarks" (info)
- Clear All → confirmation modal

### Toast Notifications
- Position: bottom-right desktop, bottom-center mobile
- 3s auto-dismiss, slide-up entrance
- Types: success (green), info (blue), error (red)
- Stack multiple toasts vertically

---

## 6. Accessibility

| Component | ARIA Requirements |
|---|---|
| CategoryFilter container | `role="tablist"`, `aria-label="Filter by category"` |
| CategoryFilter tab | `role="tab"`, `aria-selected="true/false"` |
| SearchBar input | `aria-label="Search articles"`, `role="searchbox"` |
| ArticleCard wrapper | `role="article"` |
| BookmarkButton | `aria-pressed`, `aria-label="Bookmark article"` / `"Remove bookmark"` |
| ThemeToggle | `aria-label="Toggle theme"`, `aria-pressed` |
| Toast | `role="status"`, `aria-live="polite"` |
| Settings modal | `role="dialog"`, `aria-modal="true"` |

**Keyboard:** Tab for focus, arrow keys between tabs (roving tabindex), Escape closes modal/search.
**Contrast:** All text meets WCAG 2.1 AA (4.5:1 normal, 3:1 large text).
**Motion:** Respect `prefers-reduced-motion` — disable all transitions/animations.

---

## 7. API Data Shape

```typescript
interface Article {
  id: string;
  title: string;
  summary: string;          // AI-generated, 2-3 sentences
  category: 'research' | 'product' | 'policy' | 'open-source';
  source: string;
  sourceUrl: string;
  publishedAt: string;      // ISO 8601
  readTimeMinutes: number;
  imageUrl: string | null;
  tags: string[];
}

interface FeedResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// GET /api/feed query params:
// page (default 1), pageSize (default 12),
// category, q (search), sort ('latest'|'relevance')
```
