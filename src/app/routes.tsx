import { Navigate, Route, Routes } from 'react-router-dom';

import { ClientDetailPage, ClientsPage } from '@/src/features/clients';
import Expenses from '@/src/pages/Expenses';
import { CalendarPage, UserCalendarPage } from '@/src/features/calendar';
import { ChatPage, UserChatPage } from '@/src/features/chat';
import { AdminDashboardPage, UserDashboardPage } from '@/src/features/dashboard';
import { DocumentsPage, UserDocumentsPage } from '@/src/features/documents';
import { PaymentsPage, UserPaymentsPage } from '@/src/features/payments';
import { ProjectDetailPage, ProjectsPage, UserProjectsPage } from '@/src/features/projects';
import { TasksPage, UserTasksPage } from '@/src/features/tasks';
import Templates from '@/src/pages/Templates';
import ContractTemplate from '@/src/pages/templates/contract';
import InvoiceTemplate from '@/src/pages/templates/invoice';
import OverdueInvoiceTemplate from '@/src/pages/templates/overdue-invoice';
import ProjectProposalTemplate from '@/src/pages/templates/project-proposal';
import QuotationTemplate from '@/src/pages/templates/quotation';
import Settings from '@/src/pages/Settings';
import { TeamDetailPage, TeamPage } from '@/src/features/team';
import TemplateEditor from '@/src/pages/admin/TemplateEditor';
import SignIn from '@/src/pages/SignIn';
import ForgotPassword from '@/src/pages/ForgotPassword';
import ResetPassword from '@/src/pages/ResetPassword';
import UserSettings from '@/src/pages/user/UserSettings';
import { AuthGate, AuthLanding } from '@/src/components/common/auth-gate/auth-gate';

const adminRoute = (page: React.ReactNode) => (
  <AuthGate role="admin">{page}</AuthGate>
);

const superadminRoute = (page: React.ReactNode) => (
  <AuthGate role="superadmin">{page}</AuthGate>
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
      <Route path="/user/settings" element={clientRoute(<UserSettings />)} />

      <Route path="/admin" element={adminRoute(<AdminDashboardPage />)} />
      <Route path="/admin/clients" element={adminRoute(<ClientsPage />)} />
      <Route path="/admin/clients/:id" element={adminRoute(<ClientDetailPage />)} />
      <Route path="/admin/team" element={adminRoute(<TeamPage />)} />
      <Route path="/admin/team/:id" element={adminRoute(<TeamDetailPage />)} />
      <Route path="/admin/expenses" element={superadminRoute(<Expenses />)} />
      <Route path="/admin/payments" element={adminRoute(<PaymentsPage />)} />
      <Route path="/admin/chat" element={adminRoute(<ChatPage />)} />
      <Route path="/admin/projects" element={adminRoute(<ProjectsPage />)} />
      <Route path="/admin/projects/:id" element={adminRoute(<ProjectDetailPage />)} />
      <Route path="/admin/projects/:projectId/templates/:assignmentId" element={adminRoute(<TemplateEditor />)} />
      <Route path="/admin/tasks" element={adminRoute(<TasksPage />)} />
      <Route path="/admin/calendar" element={adminRoute(<CalendarPage />)} />
      <Route path="/admin/documents" element={adminRoute(<DocumentsPage />)} />
      <Route path="/admin/templates" element={adminRoute(<Templates />)} />
      <Route path="/admin/templates/contract" element={adminRoute(<ContractTemplate />)} />
      <Route path="/admin/templates/invoice" element={adminRoute(<InvoiceTemplate />)} />
      <Route path="/admin/templates/overdue-invoice" element={adminRoute(<OverdueInvoiceTemplate />)} />
      <Route path="/admin/templates/project-proposal" element={adminRoute(<ProjectProposalTemplate />)} />
      <Route path="/admin/templates/quotation" element={adminRoute(<QuotationTemplate />)} />
      <Route path="/admin/settings" element={adminRoute(<Settings />)} />

      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
