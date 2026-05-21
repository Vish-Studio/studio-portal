import { Navigate, Route, Routes } from 'react-router-dom';

import { ForgotPasswordPage, ResetPasswordPage, SignInPage } from '@/src/features/auth';
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

const adminRoute = (page: React.ReactNode) => (
  <AuthGate role="admin">{page}</AuthGate>
);

const clientRoute = (page: React.ReactNode) => (
  <AuthGate role="client">{page}</AuthGate>
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

      <Route path="/admin" element={adminRoute(<AdminDashboardPage />)} />
      <Route path="/admin/clients" element={adminRoute(<ClientsPage />)} />
      <Route path="/admin/clients/:id" element={adminRoute(<ClientDetailPage />)} />
      <Route path="/admin/team" element={adminRoute(<TeamPage />)} />
      <Route path="/admin/team/:id" element={adminRoute(<TeamDetailPage />)} />
      <Route path="/admin/expenses" element={adminRoute(<ExpensesPage />)} />
      <Route path="/admin/payments" element={adminRoute(<PaymentsPage />)} />
      <Route path="/admin/chat" element={adminRoute(<ChatPage />)} />
      <Route path="/admin/projects" element={adminRoute(<ProjectsPage />)} />
      <Route path="/admin/projects/:id" element={adminRoute(<ProjectDetailPage />)} />
      <Route path="/admin/projects/:id/discovery" element={adminRoute(<DiscoveryPage />)} />
      <Route path="/admin/projects/:projectId/templates/:assignmentId" element={adminRoute(<TemplateEditorPage />)} />
      <Route path="/admin/tasks" element={adminRoute(<TasksPage />)} />
      <Route path="/admin/calendar" element={adminRoute(<CalendarPage />)} />
      <Route path="/admin/documents" element={adminRoute(<DocumentsPage />)} />
      <Route path="/admin/templates" element={adminRoute(<TemplatesPage />)} />
      <Route path="/admin/templates/contract" element={adminRoute(<ContractTemplatePage />)} />
      <Route path="/admin/templates/invoice" element={adminRoute(<InvoiceTemplatePage />)} />
      <Route path="/admin/templates/overdue-invoice" element={adminRoute(<OverdueInvoiceTemplatePage />)} />
      <Route path="/admin/templates/project-proposal" element={adminRoute(<ProjectProposalTemplatePage />)} />
      <Route path="/admin/templates/quotation" element={adminRoute(<QuotationTemplatePage />)} />
      <Route path="/admin/settings" element={adminRoute(<SettingsPage />)} />

      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
