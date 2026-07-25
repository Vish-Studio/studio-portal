import { Navigate, useParams } from 'react-router-dom';
import type { AppRouteDefinition } from './types';

function LegacyRedirect({ to }: { to: string }) {
  const params = useParams();
  const destination = Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value ?? ''),
    to,
  );

  return <Navigate to={destination} replace />;
}

const alias = (path: string, to: string): AppRouteDefinition => ({
  path,
  element: <LegacyRedirect to={to} />,
});

/** Compatibility redirects. Add new pages to canonical route groups, not here. */
export const legacyRoutes: AppRouteDefinition[] = [
  alias('/dashboard', '/admin'),
  alias('/clients', '/admin/clients'),
  alias('/clients/:id', '/admin/clients/:id'),
  alias('/team', '/admin/team'),
  alias('/team/:id', '/admin/team/:id'),
  alias('/users', '/admin/users'),
  alias('/expenses', '/admin/expenses'),
  alias('/payments', '/admin/payments'),
  alias('/chat', '/admin/chat'),
  alias('/projects', '/admin/projects'),
  alias('/projects/:id', '/admin/projects/:id'),
  alias('/projects/:id/discovery', '/admin/projects/:id/discovery'),
  alias('/projects/:projectId/templates/:assignmentId', '/admin/projects/:projectId/templates/:assignmentId'),
  alias('/tasks', '/admin/tasks'),
  alias('/calendar', '/admin/calendar'),
  alias('/documents', '/admin/documents'),
  alias('/templates', '/admin/templates'),
  alias('/templates/pricing', '/admin/templates/pricing'),
  alias('/templates/documents', '/admin/templates/documents'),
  alias('/templates/questionnaires', '/admin/templates/questionnaires'),
  alias('/templates/contract', '/admin/templates/contract'),
  alias('/templates/invoice', '/admin/templates/invoice'),
  alias('/templates/overdue-invoice', '/admin/templates/overdue-invoice'),
  alias('/templates/project-proposal', '/admin/templates/project-proposal'),
  alias('/templates/quotation', '/admin/templates/quotation'),
  alias('/settings', '/admin/settings'),
  alias('/user-dashboard', '/user'),
];
