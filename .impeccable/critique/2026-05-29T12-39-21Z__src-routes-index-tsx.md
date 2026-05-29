---
target: homepage
total_score: 24
p0_count: 0
p1_count: 2
p2_count: 3
timestamp: 2026-05-29T12-39-21Z
slug: src-routes-index-tsx
---
# Critique: SavorSanctum Homepage

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good loading skeletons and result counter; no search-in-progress indicator |
| 2 | Match System / Real World | 3 | Food domain language works; "Surprise Me" could be more descriptive |
| 3 | User Control and Freedom | 3 | Search clear, category filters, scroll-to-top; no undo on filter combos |
| 4 | Consistency and Standards | 2 | Sort buttons and category pills use different styling patterns |
| 5 | Error Prevention | 3 | Empty state, fuzzy search, debounced input |
| 6 | Recognition Rather Than Recall | 3 | Icons on categories, visible filter chips |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, share button buried |
| 8 | Aesthetic and Minimalist Design | 2 | Footer sparse, header compression abrupt, some layout monotony |
| 9 | Error Recovery | 2 | 404 page disconnected from design system |
| 10 | Help and Documentation | 1 | Minimal help; footer is just a credit link |
| **Total** | | **24/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment**: The design avoids the worst AI tells (no gradient text, no glassmorphism, no hero-metric template). However, it sits squarely in the "card grid directory" pattern that is the first training-data reflex for "food catalog site." The Fredoka font and warm OKLCH palette give it personality, but the layout structure (header + sticky filters + masonry cards) is the expected shape. The bounce animations on SurpriseMe and ScrollToTop are the most AI-typical element; they violate the motion laws.

**Deterministic scan**: Detector script unavailable (bundled detect.mjs not found). Manual review conducted.

## Overall Impression

A solid foundation with good instincts: the OKLCH warm palette, Fredoka font, fuzzy search, and "Surprise Me" feature show thoughtful curation. The codebase is clean and well-structured. But the design plays it safe; it's functional-first with brand personality sprinkled on top rather than baked in. The biggest opportunity is committing to the warm/playful brand identity at every touchpoint, not just the font and color tokens.

## What's Working

1. **OKLCH token system with warm hues**: The palette (hue 35 primary, hue 80 accents) is distinctive and on-brand. Dark mode adapts well. This is the strongest design decision.

2. **Sticky header with scroll-triggered scaling**: The header shrinking on scroll is a purposeful interaction that keeps the brand present while freeing screen real estate. Well-implemented with CSS data attributes.

3. **"Surprise Me" feature**: Opening a random item is playful and on-brand for a curated directory. The fixed-position shuffle button is discoverable without being intrusive.

## Priority Issues

### [P1] Bounce animations violate motion guidelines and feel AI-typical
**What**: `animate-bounce-in` and `animate-bounce-out` in globals.css use `scale(1.05)` overshoot and `scale(0.95)` settle. Applied to SurpriseMe and ScrollToTop buttons.
**Why it matters**: Bounce/elastic easing is explicitly banned by the motion guidelines. It reads as "AI added this for fun" rather than purposeful motion. Undermines the warm/playful brand by making it feel toyish.
**Fix**: Replace with ease-out-quart or ease-out-expo. No overshoot. A simple fade-in with subtle translateY is enough for FABs.
**Suggested command**: `impeccable animate`

### [P1] Category colors are hardcoded outside the token system
**What**: `item-card.tsx:14-18` defines `categoryColors` with Tailwind classes (`bg-orange-100 text-orange-700`, etc.) instead of using OKLCH tokens.
**Why it matters**: These colors won't adapt to dark mode properly (the dark variants are separate hardcoded values), and they drift from the brand palette. Creates a visual disconnect between the warm primary palette and the utilitarian category badges.
**Fix**: Define category token variables in globals.css that reference the brand hue family. Use semantic classes or inline token references.
**Suggested command**: `impeccable colorize`

### [P2] 404 page is disconnected from the design system
**What**: `src/lib/pages/404/index.tsx` uses a Freepik illustration, plain text, and a bare `<Link>` with no styling. Doesn't use the Button component, Badge, or any design tokens.
**Why it matters**: A dead-end page that looks like it was pasted from a template. Breaks the warm/playful brand experience. Users who hit a 404 should feel guided back, not abandoned.
**Fix**: Restyle with the brand palette, use the Button component, add warm copy, and integrate with the layout system.
**Suggested command**: `impeccable polish`

### [P2] Sort buttons and share button use inconsistent styling patterns
**What**: `result-counter.tsx:36-54` uses inline Tailwind classes for sort toggle buttons instead of the Button or Badge component. Different padding, rounding, and color logic from the category filter pills.
**Why it matters**: Two interactive toggle patterns (category pills vs sort buttons) look similar but are built differently. Creates visual inconsistency and makes future changes error-prone.
**Fix**: Extract a shared toggle/pill component or reuse the Badge component with interactive variants.
**Suggested command**: `impeccable polish`

### [P2] Footer is barebones and off-brand
**What**: Footer is a single line: year + credit link. No brand voice, no navigation, no warmth.
**Why it matters**: For a brand surface, the footer is the last impression. A one-line credit feels like a developer placeholder, not a curated experience.
**Fix**: Add brand voice copy, maybe a warm sign-off. Consider light navigation or a "made with care" statement that reinforces the curation angle.
**Suggested command**: `impeccable polish`

### [P3] Skeleton card uses hardcoded `rounded-[20px]` instead of design tokens
**What**: `skeleton-card.tsx:3` uses `rounded-[20px]` while item cards use `rounded-lg` (0.75rem = 12px). Inconsistent radius.
**Why it matters**: Loading skeletons should match the shape of the content they replace. Different rounding creates layout shift perception.
**Fix**: Use `rounded-lg` to match item cards, or define a card-specific radius token.
**Suggested command**: `impeccable polish`

## Persona Red Flags

**Alex (Power User)**: No keyboard shortcuts for common actions (search focus, category cycling, sort toggle). The Share button copies the URL but there's no visual feedback beyond a brief "Copied!" text that's easy to miss. Infinite scroll with no page indicators means no way to bookmark a position. Frustration risk: medium.

**Jordan (First-Timer)**: The sticky header scaling animation on scroll is disorienting on first visit; the header text shrinking by 25% with no explanation feels like a glitch. The "Surprise Me" shuffle button has no tooltip or onboarding hint; its purpose is unclear until clicked. Category filter has no count indicators, so "Products" might have zero items and still be selectable. Abandonment risk: low-medium.

## Minor Observations

- `aspect-${ratio}` in `image-with-loader.tsx:28` uses dynamic Tailwind class construction which won't be compiled. Should use static classes or CSS custom properties.
- The `reading` category is commented out in category-filter.tsx but still defined in DIR_CATEGORIES. Dead code or coming soon?
- The header's `origin-top-left` transform origin means the scale animation anchors to the top-left corner, which looks intentional but creates asymmetric whitespace on the right side.
- `theme-color` meta tag in `__root.tsx:59` is hardcoded to `#000000` regardless of theme.

## Questions to Consider

- What if the homepage had a hero moment before the filters? A single evocative image or a warm welcome line could set the mood before the utility kicks in.
- Does the "Surprise Me" feature need more context? What if it showed a brief preview tooltip before opening the link?
- The card grid is uniform. What if featured or pinned items had a different card treatment (larger image, different layout) to break the rhythm?
