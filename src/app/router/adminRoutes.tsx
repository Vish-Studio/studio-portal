import { Navigate } from 'react-router-dom';
import { CalendarPage } from '@/src/features/calendar';
import { ChatPage } from '@/src/features/chat';
import { ClientDetailPage, ClientsPage } from '@/src/features/clients';
import { AdminDashboardPage } from '@/src/features/dashboard';
import { DiscoveryPage } from '@/src/features/discovery';
import { DocumentsPage } from '@/src/features/documents';
import { ExpensesPage } from '@/src/features/expenses';
import { PaymentsPage } from '@/src/features/payments';
import { ProjectDetailPage, ProjectsPage } from '@/src/features/projects';
import { SettingsPage } from '@/src/features/settings';
import { TasksPage } from '@/src/features/tasks';
import { TeamDetailPage, TeamPage } from '@/src/features/team';
import {
  ContractTemplatePage,
  InvoiceTemplatePage,
  OverdueInvoiceTemplatePage,
  ProjectProposalTemplatePage,
  QuotationTemplatePage,
  TemplateEditorPage,
  TemplatesPage,
} from '@/src/features/templates';
import { UsersPage } from '@/src/features/users';
import type { AppRouteDefinition } from './types';

export const adminRoutes: AppRouteDefinition[] = [
  { path: '/admin', element: <AdminDashboardPage /> },
  { path: '/admin/clients', element: <ClientsPage /> },
  { path: '/admin/clients/:id', element: <ClientDetailPage /> },
  { path: '/admin/team', element: <TeamPage /> },
  { path: '/admin/team/:id', element: <TeamDetailPage /> },
  { path: '/admin/users', element: <UsersPage /> },
  { path: '/admin/expenses', element: <ExpensesPage /> },
  { path: '/admin/payments', element: <PaymentsPage /> },
  { path: '/admin/chat', element: <ChatPage /> },
  { path: '/admin/projects', element: <ProjectsPage /> },
  { path: '/admin/projects/:id', element: <ProjectDetailPage /> },
  { path: '/admin/projects/:id/discovery', element: <DiscoveryPage /> },
  { path: '/admin/projects/:projectId/templates/:assignmentId', element: <TemplateEditorPage /> },
  { path: '/admin/tasks', element: <TasksPage /> },
  { path: '/admin/calendar', element: <CalendarPage /> },
  { path: '/admin/documents', element: <DocumentsPage /> },
  { path: '/admin/templates', element: <Navigate to="/admin/templates/pricing" replace /> },
  { path: '/admin/templates/pricing', element: <TemplatesPage initialSection="pricing" /> },
  { path: '/admin/templates/documents', element: <TemplatesPage initialSection="documents" /> },
  { path: '/admin/templates/questionnaires', element: <TemplatesPage initialSection="questionnaires" /> },
  { path: '/admin/templates/contract', element: <ContractTemplatePage /> },
  { path: '/admin/templates/invoice', element: <InvoiceTemplatePage /> },
  { path: '/admin/templates/overdue-invoice', element: <OverdueInvoiceTemplatePage /> },
  { path: '/admin/templates/project-proposal', element: <ProjectProposalTemplatePage /> },
  { path: '/admin/templates/quotation', element: <QuotationTemplatePage /> },
  { path: '/admin/settings', element: <SettingsPage /> },
];
