# Local App Flow

The app starts with local Zustand state only. There is no remote auth gate and no remote database requirement.

```mermaid
flowchart TD
  A[main.tsx] --> B[initStores]
  B --> C[Seed demo data from src/data/seed.ts]
  C --> D[Hydrate feature Zustand stores]
  D --> E[Render App]
  E --> F[AppProviders]
  F --> G[AuthProvider sets local superadmin default]
  G --> H[AppRoutes]

  H --> I{Route family}
  I -->|/admin/* or unprefixed staff routes| J[AuthGate staff mode]
  I -->|/user/* or /user-dashboard| K[AuthGate user mode]
  I -->|/sign-in| L[Local sign-in page]

  J --> M[Set local superadmin profile when needed]
  K --> N[Set local user profile]
  L --> O{Email contains role hint}
  O -->|admin| P[Local admin profile]
  O -->|user or client| N
  O -->|anything else| M

  M --> Q[Staff dashboard shell]
  P --> Q
  N --> R[User dashboard shell]

  Q --> S[Clients]
  Q --> T[Team]
  Q --> U[Projects]
  Q --> V[Tasks]
  Q --> W[Calendar]
  Q --> X[Documents]
  Q --> Y[Expenses]
  Q --> Z[Payments]
  Q --> AA[Templates]
  Q --> AB[Chat]
  Q --> AC[Settings]

  R --> AD[User projects]
  R --> AE[User tasks]
  R --> AF[User calendar]
  R --> AG[User payments]
  R --> AH[User documents]
  R --> AI[User chat]
  R --> AJ[User settings]

  S --> AK[Zustand CRUD]
  T --> AK
  U --> AK
  V --> AK
  W --> AK
  X --> AK
  Y --> AK
  Z --> AK
  AA --> AK
  AB --> AK
  AD --> AK
  AE --> AK
  AF --> AK
  AG --> AK
  AH --> AK
  AI --> AK
```

## Route Map

Staff dashboard routes are available with and without the `/admin` prefix:

- `/admin` and `/dashboard`
- `/admin/clients` and `/clients`
- `/admin/projects` and `/projects`
- `/admin/tasks` and `/tasks`
- `/admin/calendar` and `/calendar`
- `/admin/documents` and `/documents`
- `/admin/team` and `/team`
- `/admin/expenses` and `/expenses`
- `/admin/templates/pricing` and `/templates/pricing`

User dashboard routes:

- `/user`
- `/user-dashboard`
- `/user/projects`
- `/user/tasks`
- `/user/calendar`
- `/user/payments`
- `/user/documents`
- `/user/chat`
- `/user/settings`

## Feature Ownership

- `src/features/auth` owns local role selection.
- `src/lib/initStores.ts` owns startup hydration.
- Each feature store owns its local CRUD mutations.
- `src/app/routes.tsx` owns route aliases and dashboard entry points.
