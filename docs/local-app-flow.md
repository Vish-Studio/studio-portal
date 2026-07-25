# Application Flow

## Startup To Screen

```mermaid
flowchart TD
  A[index.html] --> B[src/main.tsx]
  B --> C[Initialize application stores]
  C --> D[Render App]
  D --> E[AppProviders]
  E --> F[BrowserRouter]
  F --> G[AuthProvider]
  G --> H[Loading and feedback providers]
  H --> I[AppRoutes]
  I --> J{Route group}
  J -->|Public| K[Auth or walkthrough page]
  J -->|/admin/*| L[AuthGate: staff context]
  J -->|/user/*| M[AuthGate: user context]
  J -->|Old URL| N[Redirect to canonical route]
  L --> O[Admin layout]
  M --> P[User layout]
  O --> Q[Feature page]
  P --> Q
```

## Session And Onboarding

```mermaid
flowchart TD
  A[AuthProvider starts session] --> B[authStore is ready]
  B --> C{Password change required?}
  C -->|Yes| D[/change-password]
  C -->|No| E{Walkthrough complete?}
  E -->|No| F[/walkthrough]
  E -->|Yes| G{Profile role}
  D --> E
  F --> G
  G -->|superadmin or admin| H[/admin]
  G -->|user| I[/user]
```

`AuthGate` prepares the role context for a route family. `AuthLanding` chooses the correct dashboard entry. The auth store owns the active local profile and session actions.

## Page And CRUD Flow

```mermaid
flowchart LR
  A[Route] --> B[Feature page]
  B --> C[Feature component]
  B --> D[Zustand selector]
  C --> E[User action]
  E --> F[Feature store action]
  F --> G[Normalize and update state]
  G --> D
  D --> C
```

Keep data mutations in the owning store. Pages should coordinate forms, navigation, and feedback; reusable components should receive values and callbacks through props.

## Route Families

```text
Public
  /
  /sign-in
  /change-password
  /forgot-password
  /reset-password
  /walkthrough

Staff
  /admin
  /admin/clients
  /admin/team
  /admin/users
  /admin/projects
  /admin/tasks
  /admin/calendar
  /admin/payments
  /admin/documents
  /admin/templates/*
  /admin/chat
  /admin/expenses
  /admin/settings

Client
  /user
  /user/projects
  /user/tasks
  /user/calendar
  /user/payments
  /user/documents
  /user/chat
  /user/settings
```

Canonical routes are defined in `src/app/router`. Unprefixed historical URLs are redirects and should not become a second route registry.
