# VISH Studio Portal

VISH Studio Portal is the internal React dashboard for studio operations and client work. It has two active dashboard experiences:

- `/admin` - superadmin workspace with access to clients, team, projects, tasks, payments, documents, templates, chat, calendar, expenses, and settings.
- `/user` - client workspace for projects, tasks, payments, documents, chat, calendar, and settings.

The active role model is intentionally small:

- `superadmin` - full studio access.
- `user` - client access.

Older role names such as `admin`, `manager`, `member`, and `client` should not be used for access control in new app code. Some feature labels still use words like "admin" or "client" for UI copy, chat modes, or business objects; those are not access roles.

## Current Auth Mode

Authentication is currently disconnected so dashboards can be opened freely during development.

The switch lives in [src/features/auth/authMode.ts](src/features/auth/authMode.ts):

```ts
export const AUTH_FLOW_ENABLED = false;
```

When `AUTH_FLOW_ENABLED` is `false`:

- `/` redirects to `/admin`.
- `/admin` uses a local superadmin profile.
- `/user` uses a local user profile.
- Sign-in and password-reset routes redirect to `/admin`.
- Demo data is loaded into Zustand stores from `src/data/seed.ts`.
- Firestore real-time streams are disabled to avoid permission errors from unauthenticated Firebase reads.

When auth is re-enabled later, set the flag to `true`, verify Firebase rules are deployed, and reconnect any required sign-in routes.

## Superadmin Accounts

The app recognizes these emails as superadmin accounts in the Firebase auth service and rules helpers:

- `vishseenarain@gmail.com`
- `vishstudio.ltd@gmail.com`
- `vishroy@vish.studio`
- `divesh@vish.studio`

With auth disabled, these accounts are not required to browse the dashboards locally.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Useful routes:

- `http://localhost:3000/admin`
- `http://localhost:3000/user`

Run checks before committing:

```bash
npm run lint
npm run build
```

Build Firestore rules after editing rule fragments:

```bash
npm run build:firestore-rules
```

Deploy rules only when you intentionally want to update Firebase:

```bash
npm run deploy:rules
```

## Project Structure

```text
src/
  app/                 App providers, routes, loaders, and global wiring
  auth/                Role helpers and permission helpers
  features/            Feature modules grouped by product area
    auth/              Auth store, auth mode, auth pages, Firebase auth service
    calendar/          Studio and user calendar
    chat/              Admin/client chat workspace
    clients/           Client records and client provisioning
    dashboard/         Admin and user dashboard pages
    documents/         Document lists and document UI
    expenses/          Expense tracking
    payments/          Payment views
    projects/          Project list, detail, phases, and project store
    settings/          Settings pages
    tasks/             Task list and task store
    team/              Team management
    templates/         Document template pages/editors
  firebase/            Firebase config, Firestore transformers, shared helpers
  layouts/             Admin and user shells, sidebars, and topbar
  lib/                 Shared utilities
  shared/components/   Design-system primitives used across features
  types/               Shared TypeScript types
```

Firestore security rules are authored as fragments in `firestore-rules/` and compiled into `firestore.rules`.

## Development Workflow

1. Start from the feature folder that owns the behavior.
2. Reuse existing shared components from `src/shared/components` before creating new markup.
3. Keep role checks centralized in `src/auth/roleAccess.ts` and `src/auth/permissions.ts`.
4. Keep Firebase document mapping in `src/firebase/firestoreTransformers.ts`.
5. Use Zustand stores inside each feature for local UI state and Firestore subscriptions.
6. Run `npm run lint` and `npm run build` after code changes.

## UI Rules

This project uses its own Studio Portal design system. Before adding any control, check for existing Button, Input, Select, Tabs, Card, Dialog, FormField, Switch, Badge, Table/list, and layout primitives. New components should only be added when a reusable component does not already exist, and they should live in:

```text
components/[component-name]/[ComponentName].tsx
```

For app-wide shared UI, prefer `src/shared/components` and match the existing typography, spacing, colors, radii, and interaction states.
