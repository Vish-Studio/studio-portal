# Architecture

The app is a Vite React dashboard backed by local Zustand stores. Feature folders own their page, component, type, and store code.

```text
src/
  app/                 Providers, routes, loaders, messages
  auth/                Role helpers and permission matrix
  data/                Demo seed data
  features/            Product feature modules
  layouts/             Shared app shells
  lib/                 Shared utilities
  shared/components/   Design-system primitives
  types/               Shared types
```

## Data Flow

`src/lib/initStores.ts` hydrates feature stores from `src/data/seed.ts` before React mounts. CRUD actions update the relevant Zustand store arrays directly.

Feature code should keep data mutations in the feature store where possible. Services may exist for compatibility with existing imports, but they should not own remote connections.

## Components

Reusable UI belongs in `src/shared/components`. Feature-specific UI belongs in the owning feature folder. If a component is reused by multiple features and has no business rules, move it to shared components.

## Roles

Role checks are centralized in:

- `src/auth/roleAccess.ts`
- `src/auth/permissions.ts`

Supported access roles are `superadmin`, `admin`, and `user`.

## Flow Chart

See `docs/local-app-flow.md` for the local startup and dashboard routing flow chart.
