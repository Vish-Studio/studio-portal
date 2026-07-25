---
name: studio-portal-development
description: Maintain and extend the Studio Portal React application using its feature-first architecture, Zustand state boundaries, route groups, authentication ownership, layouts, and shared component system. Use when adding or moving Studio Portal pages, features, stores, routes, auth rules, application flows, developer documentation, or backend adapters.
---

# Studio Portal Development

## Start With The Project Map

Read the relevant project documentation before editing:

- Read `../../docs/architecture.md` for ownership and dependency boundaries.
- Read `../../docs/local-app-flow.md` for startup, session, route, and CRUD flow.
- Read `../../docs/development-guide.md` when adding or relocating code.
- Use the `studio-portal-ui` skill as well for visual or interaction changes.

Inspect the owning feature and its `index.ts` before creating files.

## Preserve Feature Ownership

- Keep route-level screens in `src/features/<feature>/pages`.
- Keep business-specific UI in `src/features/<feature>/components`.
- Keep Zustand state and mutations in `src/features/<feature>/stores`.
- Keep domain types inside the owning feature.
- Export only the API needed outside the feature from `index.ts`.
- Import another feature through its public index when practical.
- Keep shared visual primitives independent from feature pages and stores.

Do not add a service layer unless it owns an active external boundary. Remove or avoid no-op wrappers that only mirror store methods.

## Keep App Composition Explicit

- Start application tracing at `src/main.tsx`, then `src/App.tsx` and `src/app/providers.tsx`.
- Add canonical pages to `src/app/router/adminRoutes.tsx`, `userRoutes.tsx`, or `publicRoutes.tsx`.
- Keep `legacyRoutes.tsx` limited to compatibility redirects.
- Keep full application shells and navigation in `src/layouts`.
- Keep app-wide feedback, loading, messages, and UI state under `src/app`.

## Keep Auth Together

Use `src/features/auth` as the only auth ownership boundary:

- Put session/profile state in `stores/authStore.ts`.
- Put auth domain types in `types.ts`.
- Put role routing and labels in `access/roleAccess.ts`.
- Put resource/action rules in `access/permissions.ts`.
- Put password and onboarding redirects in `components/AuthGate.tsx`.
- Import the public auth API from `@/src/features/auth` outside the feature.

## Change State Safely

- Put create, update, and delete behavior in the owning store.
- Normalize input once in the store.
- Keep cross-entity synchronization explicit.
- Keep browser persistence feature-owned and outside page components.
- Preserve the store API used by pages when adding a remote adapter.
- Keep provider SDK types out of domain types and presentational components.

## Maintain Documentation

Update architecture or flow documentation when entry points, ownership, route groups, auth flow, or data boundaries change. Document stable contracts and behavior only; do not describe temporary fixture records or seed contents.

## Verify

Run:

```bash
npm run lint
npm run build
```

Also search for imports from removed paths and verify the canonical route for any changed page.
