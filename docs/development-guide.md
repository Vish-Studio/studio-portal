# Development Guide

## Find The Owner First

Use this lookup before editing:

| Change | Start here |
| --- | --- |
| App startup or providers | `src/main.tsx`, `src/App.tsx`, `src/app/providers.tsx` |
| Routes | `src/app/router` |
| Auth, roles, permissions | `src/features/auth` |
| Admin/client page shell | `src/layouts` |
| Product page or business behavior | `src/features/<feature>` |
| Reusable UI primitive | `src/shared/components` |
| Global operation feedback | `src/app/components/feedback`, `src/app/messages` |
| Shared non-UI helper | `src/lib` |

## Add A Feature Page

1. Create the page in `src/features/<feature>/pages`.
2. Keep feature-specific components in `src/features/<feature>/components`.
3. Put state and CRUD actions in `src/features/<feature>/stores`.
4. Put domain types in the feature `types.ts` or a focused types module.
5. Export only the cross-feature API from `src/features/<feature>/index.ts`.
6. Register the page in `adminRoutes.tsx`, `userRoutes.tsx`, or `publicRoutes.tsx`.
7. Add navigation in the matching sidebar only when the page is user-facing.

## Add Or Change UI

1. Search `src/shared/components` for an existing component.
2. Search the owning feature for a feature-specific component.
3. Compose existing components in the page.
4. Create a shared primitive only when multiple features need the same behavior and it has no business rules.
5. Match existing tokens, typography, spacing, radii, and responsive gutters.

Shared component folders use:

```text
src/shared/components/<component-name>/<component-name>.tsx
```

## Add Store Behavior

1. Define the action in the owning Zustand store.
2. Normalize input inside the store, not in multiple pages.
3. Keep related entity synchronization explicit in the action.
4. Expose stable selectors and action names through the feature public API.
5. Keep storage-provider details behind a feature adapter when remote persistence is introduced.

## Work With Auth

- Read and update the active profile through `useAuthStore`.
- Add role routing rules in `features/auth/access/roleAccess.ts`.
- Add resource/action policy in `features/auth/access/permissions.ts`.
- Keep redirects and first-time flow in `features/auth/components/AuthGate.tsx`.
- Import the public API from `@/src/features/auth` outside the auth feature.

## Import Rules

- Use `@/src/...` for imports across top-level folders.
- Use relative imports within the same feature.
- Import another feature through its `index.ts` where practical.
- Do not import a page from another feature's internal path.
- Do not make shared components depend on feature stores.

## Before Finishing

```bash
npm run lint
npm run build
```

Also verify the canonical route affected by the change and check both desktop and mobile layouts for user-facing work.
