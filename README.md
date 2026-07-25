# VISH Studio Portal

VISH Studio Portal is a React application for managing studio operations and client project collaboration. It provides separate staff and client workspaces while sharing the same feature modules and design system.

## Start Here

```bash
npm install
npm run dev
```

The local development server normally starts at `http://localhost:3000`.

Useful entry points:

- `/admin` - staff dashboard
- `/user` - client dashboard
- `/sign-in` - local sign-in flow
- `/walkthrough` - first-time onboarding

Run the project checks before committing:

```bash
npm run lint
npm run build
```

## Developer Map

- [Architecture](docs/architecture.md) explains folder ownership and dependency boundaries.
- [Application flow](docs/local-app-flow.md) maps startup, routing, auth, onboarding, layouts, and CRUD.
- [Development guide](docs/development-guide.md) explains where to add pages, components, stores, routes, and shared UI.

The application starts in `src/main.tsx`, composes global providers in `src/app/providers.tsx`, and registers routes in `src/app/router/AppRoutes.tsx`.
