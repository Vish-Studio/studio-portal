# Frontend Architecture

This app uses a feature-based React structure. The goal is simple ownership: a junior developer should know where a file belongs without checking five folders.

## Top-Level Folders

```txt
src/
  app/          App composition: routes, providers, global app components, app-wide Zustand stores
  auth/         Role and access helpers that are not React UI
  data/         Demo seed data only
  features/     Business modules grouped by domain
  firebase/     Firebase app initialization and shared Firebase exports
  layouts/      App shell, sidebars, topbar, and route layout components
  lib/          Cross-feature utilities and app bootstrapping helpers
  shared/       Reusable UI components with no business ownership
  types/        Global TypeScript types only when they are truly cross-feature
```

Do not create new files in legacy compatibility folders such as `src/pages`, `src/store`, `src/services`, or `src/components/common`.

## Feature Modules

Each domain lives under `src/features/<feature-name>`.

```txt
src/features/projects/
  components/   Project-only UI pieces
  pages/        Route-level pages for this feature
  services/     Firestore/API functions for this feature
  stores/       Zustand stores for this feature
  types.ts      Feature-owned types
  index.ts      Public exports for other modules
```

Use this rule:

- If a component is only used by one feature, keep it inside that feature.
- If a component is reused by multiple features and has no business rules, move it to `src/shared/components`.
- If a file manages routing, providers, app loading, or global feedback, keep it in `src/app`.
- If a file is a page shell, sidebar, or topbar, keep it in `src/layouts`.

## Imports

Prefer canonical imports:

```ts
import { useAuthStore } from '@/src/features/auth';
import { Button, Modal } from '@/src/shared/components';
import { AppShell } from '@/src/layouts';
```

Avoid importing through old wrapper paths or creating compatibility re-export files. If a path is confusing, rename or move the real file instead of adding a wrapper.

## Zustand Stores

Use Zustand for client-side app state.

- Feature state belongs in `src/features/<feature>/stores`.
- App-wide UI state belongs in `src/app/stores`.
- Stores should expose small actions instead of letting pages mutate nested state directly.
- Seed hydration is centralized through `src/data/seed.ts` and app bootstrapping helpers.

Example:

```txt
src/features/tasks/stores/taskStore.ts
src/features/calendar/stores/calendarStore.ts
src/app/stores/uiStore.ts
```

## Firebase and Services

`src/firebase/config.ts` owns Firebase initialization. Feature-specific Firestore calls belong in that feature:

```txt
src/features/clients/services/clientService.ts
src/features/team/services/teamService.ts
src/features/auth/services/authService.ts
```

Keep service functions framework-light: they should handle data access and normalization, not page state or UI side effects. Pages and stores decide how to use the returned data.

## RBAC

Authentication UI and route guards belong to `src/features/auth`.

- Use `AuthProvider` once at the app provider layer.
- Use `AuthGate` in routing for role-protected route branches.
- Keep role mapping helpers in `src/auth/roleAccess.ts`.

Do not scatter role checks through random components unless the UI itself has a small role-specific affordance. Route-level access should stay centralized.

## Shared Components

Shared components live in `src/shared/components` and are exported from `src/shared/components/index.ts`.

Shared components must be:

- Business-agnostic
- Reusable across more than one feature
- Named by what they are, not where they are used

Stories for shared components live beside the component:

```txt
src/shared/components/button/button.tsx
src/shared/components/button/stories/button.stories.tsx
```

## Pages and Stories

Route-level pages live inside their owning feature:

```txt
src/features/projects/pages/ProjectsPage.tsx
src/features/projects/pages/stories/ProjectsPage.stories.tsx
```

Do not recreate a global `src/pages` folder. It becomes hard to tell which feature owns the page, data, and state.

## Naming

Use explicit names:

- Pages: `ProjectsPage.tsx`, `ProjectDetailPage.tsx`
- Stores: `projectStore.ts`, `uiStore.ts`
- Services: `projectService.ts`, `authService.ts`
- Components: `project-card.tsx` for folder-local components, or `ProjectCard.tsx` only if that feature already uses PascalCase

When unsure, match the local folder style instead of introducing a new naming convention.

## Adding a New Feature

1. Create `src/features/<feature-name>`.
2. Add `pages`, `components`, `stores`, `services`, and `types.ts` only as needed.
3. Export public APIs from `index.ts`.
4. Register routes in `src/app/routes.tsx`.
5. Put reusable UI in `src/shared/components` only after it is genuinely shared.
6. Run `npm run lint`.

