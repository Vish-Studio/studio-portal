# VISH Studio Portal

VISH Studio Portal is the internal React dashboard for studio operations and client work. It has three local role experiences:

- `/admin` - staff workspace for clients, team, projects, tasks, payments, documents, templates, chat, calendar, expenses, and settings.
- `/user` - client workspace for projects, tasks, payments, documents, chat, calendar, and settings.
- `superadmin` - full studio access, including everything an admin can use.

## Local Auth And Data

The app runs without a remote auth or database service. Auth profiles are local demo profiles, and CRUD operations update Zustand stores directly.

Available local roles:

- `superadmin` - full studio access.
- `admin` - staff dashboard access.
- `user` - client dashboard access.

Demo data is loaded into Zustand stores from `src/data/seed.ts` before React mounts.

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
- `http://localhost:3000/dashboard`
- `http://localhost:3000/user`
- `http://localhost:3000/user-dashboard`
- `http://localhost:3000/sign-in`

See [docs/local-app-flow.md](docs/local-app-flow.md) for the startup flow chart, role mapping, route aliases, and feature map.

Run checks before committing:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/                 App providers, routes, loaders, and global wiring
  auth/                Role helpers and permission helpers
  features/            Feature modules grouped by product area
    auth/              Local auth store, auth mode, and auth pages
    calendar/          Studio and user calendar
    chat/              Admin/client chat workspace
    clients/           Client records and local client provisioning
    dashboard/         Admin and user dashboard pages
    documents/         Document lists and document UI
    expenses/          Expense tracking
    payments/          Payment views
    projects/          Project list, detail, phases, and project store
    settings/          Settings pages
    tasks/             Task list and task store
    team/              Team management
    templates/         Document template pages/editors
  layouts/             Admin and user shells, sidebars, and topbar
  lib/                 Shared utilities
  shared/components/   Design-system primitives used across features
  types/               Shared TypeScript types
```

## Development Workflow

1. Start from the feature folder that owns the behavior.
2. Reuse existing shared components from `src/shared/components` before creating new markup.
3. Keep role checks centralized in `src/auth/roleAccess.ts` and `src/auth/permissions.ts`.
4. Use Zustand stores inside each feature for local UI state and CRUD.
5. Run `npm run lint` and `npm run build` after code changes.

## UI Rules

This project uses its own Studio Portal design system. Before adding any control, check for existing Button, Input, Select, Tabs, Card, Dialog, FormField, Switch, Badge, Table/list, and layout primitives. New components should only be added when a reusable component does not already exist, and they should live in:

```text
components/[component-name]/[ComponentName].tsx
```

For app-wide shared UI, prefer `src/shared/components` and match the existing typography, spacing, colors, radii, and interaction states.
