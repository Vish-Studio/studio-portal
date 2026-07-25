---
name: studio-portal-ui
description: Maintain the Studio Portal visual system and interaction patterns. Use when modifying dashboards, onboarding, sidebars, layouts, forms, CRUD drawers, lists, responsive behavior, or reusable UI components.
---

# Studio Portal UI

Read `../../docs/architecture.md` before relocating UI and use the `studio-portal-development` skill for route, state, auth, or feature-architecture changes.

When changing dashboard pages:

- Keep the dashboard content width aligned with the app shell content and topbar span. Do not add a narrower centered max-width container inside dashboard pages unless the surrounding layout already uses the same width.
- Keep admin and user dashboards compact and scan-first. The primary surface should show ongoing, newly added, or recently updated projects.
- Dashboard lists and preview sections should show only 4 recent items by default for projects, tasks, documents, and similar repeated records.
- Preserve project progression, but present it as a low-noise strip or compact progress indicator rather than a large hero panel.
- Reuse existing shared components before creating new UI: `CardContent`, `StatCard`, `Button`, `ButtonIcon`, `StatusBadge`, `ProjectStatusBadge`, and `TaskStatusBadge`.
- When client or team creation generates local credentials, keep them visible from the admin `Users` sidebar section with reset controls and a read-only password status. Do not add a manual "changed" button; the status should move from temporary to changed only when the user completes the password-change flow.
- Right-side CRUD drawers use the dark `FormSidebar` surface. Inputs, selects, tabs, search bars, password panels, empty states, and list rows inside the drawer must use dark-compatible backgrounds/text; avoid white panels or white input overrides inside these sidebars.
- First-time signed-in users should see the illustrated `/walkthrough` onboarding before their dashboard. Keep the page accessible directly for review, and store completion locally per user profile.
- Onboarding must use the same responsive horizontal gutters as the app shell and dashboards (`px-4 sm:px-6 lg:px-8`). Keep it focused: one step at a time, one supporting visual, concise copy, and Back/Continue controls. Do not add a separate sidebar, bento grid, nested card collection, or a narrower content frame that conflicts with the dashboard layout.
