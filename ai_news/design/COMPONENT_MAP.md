# Component Map — AI News RSS Feed

## Components

### ArticleCard
**Path:** `src/components/ArticleCard.tsx`

```typescript
interface ArticleCardProps {
  article: Article;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
}
```

**Purpose:** Displays a news article in a card layout with title, summary, category badge, source, time, and bookmark button.

**ARIA:** `role="article"` on wrapper. BookmarkButton inside handles its own aria.

---

### BookmarkButton
**Path:** `src/components/BookmarkButton.tsx`

```typescript
interface BookmarkButtonProps {
  articleId: string;
  isBookmarked: boolean;
  onToggle: (id: string) => void;
}
```

**Purpose:** Toggle bookmark state for an article. Stops click propagation so it works inside card links.

**ARIA:** `aria-pressed={isBookmarked}`, `aria-label="Bookmark article"` or `"Remove bookmark"`

---

### CategoryFilter
**Path:** `src/components/CategoryFilter.tsx`

```typescript
interface CategoryFilterProps {
  active: string;
  counts: Record<string, number>;
  onChange: (cat: string) => void;
}
```

**Purpose:** Horizontal tab bar for filtering articles by category.

**ARIA:** `role="tablist"`, `aria-label="Filter by category"` on container. Each button: `role="tab"`, `aria-selected`

---

### SearchBar
**Path:** `src/components/SearchBar.tsx`

```typescript
interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}
```

**Purpose:** Debounced search input (300ms) with clear button.

**ARIA:** `aria-label="Search articles"`, `role="searchbox"` on input. Clear button: `aria-label="Clear search"`

---

### FeedHeader
**Path:** `src/components/FeedHeader.tsx`

```typescript
interface FeedHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onSearchClear: () => void;
}
```

**Purpose:** Sticky top navigation — logo, search bar, bookmarks link, theme toggle.

**ARIA:** `<header>` semantic element. Nav links are standard anchors.

---

### ThemeToggle
**Path:** `src/components/ThemeToggle.tsx`

```typescript
// No props — reads/writes theme via useTheme hook
```

**Purpose:** Button to cycle light / dark / system theme. Writes to localStorage and toggles `dark` class on `<html>`.

**ARIA:** `aria-label="Toggle theme"`, `aria-pressed={isDark}`

---

### LoadingSkeleton
**Path:** `src/components/LoadingSkeleton.tsx`

```typescript
// No props
```

**Purpose:** Pulsing gray placeholder matching ArticleCard dimensions. Shown during feed loading.

**ARIA:** No specific ARIA needed — decorative loading indicator.

---

### Toast
**Path:** `src/components/Toast.tsx`

```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onDismiss: () => void;
}
```

**Purpose:** Notification toast that auto-dismisses after 3 seconds. Slides up from bottom of screen.

**ARIA:** `role="status"`, `aria-live="polite"` — announces to screen readers without interrupting.

---

## Hooks

### useBookmarks
**Path:** `src/hooks/useBookmarks.ts`

Returns: `{ bookmarks: string[], addBookmark, removeBookmark, isBookmarked, clearAll }`

Persists to `localStorage` key `"ai-news-bookmarks"`.

### useTheme
**Path:** `src/hooks/useTheme.ts`

Returns: `{ theme: 'light'|'dark'|'system', toggle, setTheme }`

Persists to `localStorage` key `"theme"`. Applies `dark` class to `document.documentElement`.
