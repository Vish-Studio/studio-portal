import { Navigate, Route, Routes } from 'react-router-dom';

import { ClientDetailPage, ClientsPage } from '@/src/features/clients';
import { CalendarPage, UserCalendarPage } from '@/src/features/calendar';
import { ChatPage, UserChatPage } from '@/src/features/chat';
import { AdminDashboardPage, UserDashboardPage } from '@/src/features/dashboard';
import { DocumentsPage, UserDocumentsPage } from '@/src/features/documents';
import { ExpensesPage } from '@/src/features/expenses';
import { PaymentsPage, UserPaymentsPage } from '@/src/features/payments';
import { ProjectDetailPage, ProjectsPage, UserProjectsPage } from '@/src/features/projects';
import { SettingsPage, UserSettingsPage } from '@/src/features/settings';
import { TasksPage, UserTasksPage } from '@/src/features/tasks';
import {
  ContractTemplatePage,
  InvoiceTemplatePage,
  OverdueInvoiceTemplatePage,
  ProjectProposalTemplatePage,
  QuotationTemplatePage,
  TemplateEditorPage,
  TemplatesPage,
} from '@/src/features/templates';
import { TeamDetailPage, TeamPage } from '@/src/features/team';
import { DiscoveryPage } from '@/src/features/discovery';
import { AuthGate, AuthLanding } from '@/src/features/auth';

const superadminRoute = (page: React.ReactNode) => (
  <AuthGate role="superadmin">{page}</AuthGate>
);

const clientRoute = (page: React.ReactNode) => (
  <AuthGate role="user">{page}</AuthGate>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLanding />} />

      <Route path="/user" element={clientRoute(<UserDashboardPage />)} />
      <Route path="/user/projects" element={clientRoute(<UserProjectsPage />)} />
      <Route path="/user/calendar" element={clientRoute(<UserCalendarPage />)} />
      <Route path="/user/tasks" element={clientRoute(<UserTasksPage />)} />
      <Route path="/user/payments" element={clientRoute(<UserPaymentsPage />)} />
      <Route path="/user/documents" element={clientRoute(<UserDocumentsPage />)} />
      <Route path="/user/chat" element={clientRoute(<UserChatPage />)} />
      <Route path="/user/settings" element={clientRoute(<UserSettingsPage />)} />

      <Route path="/admin" element={superadminRoute(<AdminDashboardPage />)} />
      <Route path="/admin/clients" element={superadminRoute(<ClientsPage />)} />
      <Route path="/admin/clients/:id" element={superadminRoute(<ClientDetailPage />)} />
      <Route path="/admin/team" element={superadminRoute(<TeamPage />)} />
      <Route path="/admin/team/:id" element={superadminRoute(<TeamDetailPage />)} />
      <Route path="/admin/expenses" element={superadminRoute(<ExpensesPage />)} />
      <Route path="/admin/payments" element={superadminRoute(<PaymentsPage />)} />
      <Route path="/admin/chat" element={superadminRoute(<ChatPage />)} />
      <Route path="/admin/projects" element={superadminRoute(<ProjectsPage />)} />
      <Route path="/admin/projects/:id" element={superadminRoute(<ProjectDetailPage />)} />
      <Route path="/admin/projects/:id/discovery" element={superadminRoute(<DiscoveryPage />)} />
      <Route path="/admin/projects/:projectId/templates/:assignmentId" element={superadminRoute(<TemplateEditorPage />)} />
      <Route path="/admin/tasks" element={superadminRoute(<TasksPage />)} />
      <Route path="/admin/calendar" element={superadminRoute(<CalendarPage />)} />
      <Route path="/admin/documents" element={superadminRoute(<DocumentsPage />)} />
      <Route path="/admin/templates" element={<Navigate to="/admin/templates/pricing" replace />} />
      <Route path="/admin/templates/pricing" element={superadminRoute(<TemplatesPage initialSection="pricing" />)} />
      <Route path="/admin/templates/documents" element={superadminRoute(<TemplatesPage initialSection="documents" />)} />
      <Route path="/admin/templates/questionnaires" element={superadminRoute(<TemplatesPage initialSection="questionnaires" />)} />
      <Route path="/admin/templates/contract" element={superadminRoute(<ContractTemplatePage />)} />
      <Route path="/admin/templates/invoice" element={superadminRoute(<InvoiceTemplatePage />)} />
      <Route path="/admin/templates/overdue-invoice" element={superadminRoute(<OverdueInvoiceTemplatePage />)} />
      <Route path="/admin/templates/project-proposal" element={superadminRoute(<ProjectProposalTemplatePage />)} />
      <Route path="/admin/templates/quotation" element={superadminRoute(<QuotationTemplatePage />)} />
      <Route path="/admin/settings" element={superadminRoute(<SettingsPage />)} />

      <Route path="/sign-in" element={<Navigate to="/admin" replace />} />
      <Route path="/change-password" element={<Navigate to="/admin" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/admin" replace />} />
      <Route path="/reset-password" element={<Navigate to="/admin" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
