# AITRENDSDATA Design Guidelines

## Design Philosophy
Create a **clean, modern, futuristic, data-focused** interface inspired by Vercel, Linear, and OpenAI. The platform should feel fast, professional, and cutting-edge while remaining accessible and easy to navigate.

## Color System

**Primary Palette:**
- Electric Blue: #3B82F6 (primary actions, highlights, links)
- Deep Black: #0D0D0F (backgrounds in dark mode)
- Pure White: #FFFFFF (backgrounds in light mode)

**Secondary Palette:**
- Slate Gray: #1E1E20 (cards, secondary backgrounds)
- Soft Gray: #D4D4D8 (borders, dividers, muted text)
- Trend Green: #22C55E (positive trends, rising indicators)
- Trend Red: #EF4444 (declining trends, alerts)

**Dark Mode:** Auto-detect system preference with manual toggle. All components must intelligently invert colors while maintaining Electric Blue as the primary accent.

## Typography

**Font Families:**
- Primary: Inter (body text, UI elements, descriptions)
- Display: Space Grotesk (headings, numbers, statistics, trend scores)

**Hierarchy:**
- H1: Space Grotesk, 48px/56px (hero headlines)
- H2: Space Grotesk, 36px/44px (section headers)
- H3: Space Grotesk, 24px/32px (card titles)
- Body Large: Inter, 18px/28px (taglines, introductions)
- Body: Inter, 16px/24px (descriptions, content)
- Small: Inter, 14px/20px (metadata, labels)
- Numbers/Stats: Space Grotesk, bold (trend scores, view counts)

## Layout System

**Spacing:** Use Tailwind units of 2, 4, 8, 12, 16, 24 (p-2, p-4, p-8, etc.)

**Container Widths:**
- Max content width: max-w-7xl (1280px)
- Tool cards grid: max-w-6xl
- Form content: max-w-2xl

**Grid Systems:**
- Tool cards: 3-column on desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single column mobile
- Categories: 4-column grid (lg:grid-cols-4)
- Sponsors: Horizontal scrollable carousel on mobile, grid on desktop

## Navigation

**Desktop Header:**
- Fixed top position with backdrop blur
- Logo (left): Minimal upward trending line forming "A" + "AITRENDSDATA" wordmark
- Navigation (center): Home, Categories, Search, Sponsors
- Actions (right): Submit Tool (Electric Blue CTA), Dark Mode Toggle, Profile Avatar

**Mobile:**
- Bottom navigation bar (fixed) with 5 icons: Home, Search, Submit (+), Categories, Profile
- Submit button should be prominent with Electric Blue background, elevated slightly

**Sidebar (Desktop):**
- Left sidebar for categories/filters on search/browse pages
- Sticky positioning with smooth scrolling

## Key Components

### ToolCard
- White/Slate Gray background with subtle border
- Tool logo (64px, rounded-lg, top-left)
- Tool name (H3, Space Grotesk, bold)
- Tagline (Body, 2-line clamp)
- Category chip (Electric Blue, small, rounded-full)
- Stats row: Upvotes count, Views count, Trend badge (Green/Red arrow with percentage)
- Hover: Subtle lift with shadow, smooth transition

### TrendBadge
- Small pill shape with arrow icon
- Green background + up arrow for positive trends
- Red background + down arrow for declining
- Display percentage change prominently in Space Grotesk

### SearchBar
- Large, prominent (56px height on desktop)
- Electric Blue focus ring
- Search icon (left), Clear button (right when active)
- Instant filtering results below

### Trending Graph (7-day)
- Clean line chart using Recharts
- Electric Blue line with gradient fill
- Grid lines in Soft Gray
- Tooltips showing exact values
- Responsive, scales to container
- Dark mode compatible

### Screenshot Carousel
- Full-width images with 16:9 aspect ratio
- Navigation dots below (Electric Blue for active)
- Left/right arrows on hover
- Smooth transitions

### Embeddable Badge
- Compact horizontal layout: Logo + Tool Name + "View on AITRENDSDATA"
- Copy code button with syntax highlighting
- Live preview iframe

## Page-Specific Layouts

### Home Page
1. **Hero Section:** Full-width gradient background (Deep Black to Slate Gray), centered content with H1 headline, subtitle, two CTAs (Submit Tool - Electric Blue, Browse Tools - outline), hero image showing dashboard preview with blur effect behind buttons
2. **Trending Today:** 3-column grid of top tools, "View All" link
3. **Fastest Rising:** Horizontal scrollable cards showing growth percentages
4. **New Tools Today:** Grid with "NEW" badge
5. **Categories:** 8 category cards with icons, tool counts
6. **Sponsors Section:** Rotating sponsor cards, "Become a Sponsor" CTA

### Tool Page
- Two-column layout: Main content (left 2/3), Sidebar (right 1/3)
- Hero: Tool logo, name, tagline, Visit Website (Electric Blue), Upvote button
- Screenshots carousel (full-width)
- Description (rich text/markdown support)
- Pricing cards
- 7-day trend graph
- Related tools grid (3 tools)
- Sidebar: Category, Stats, Founder info, Embed badge

### Submit Tool Page
- Multi-step progress indicator at top (4 steps)
- Single form section visible at a time
- Electric Blue "Next" buttons, outline "Back" buttons
- Upload areas for logo/screenshots with drag-and-drop
- Success animation on completion

### Categories Page
- Hero with category count
- Grid of category cards with background gradients
- Each category shows top 3 trending tools below

## Images

**Hero Image:** Use a sleek, modern dashboard/data visualization mockup showing trending graphs and tool cards. Position behind headline with blur backdrop for button readability.

**Tool Logos:** 64px–128px, rounded corners, clean backgrounds

**Screenshots:** 16:9 ratio, high-quality, showing actual tool interfaces

**Category Icons:** Use Heroicons, 32px, Electric Blue color

## Special Features

**Sponsor Cards:** Premium feel with gradient borders, larger logos, "Sponsored" label in Soft Gray

**Upvote Animation:** Smooth scale-up with Electric Blue glow on click

**Loading States:** Skeleton screens matching component structure, subtle pulse animation

**Empty States:** Centered icon + message + CTA, maintain brand voice

## Accessibility
- WCAG AA contrast ratios minimum
- Focus indicators: 2px Electric Blue outline
- Keyboard navigation support throughout
- Screen reader labels for icon buttons
- Form validation with clear error states