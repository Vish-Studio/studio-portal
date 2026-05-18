import { Navigate, Route, Routes } from 'react-router-dom';

import { ClientDetailPage, ClientsPage } from '@/src/features/clients';
import Expenses from '@/src/pages/Expenses';
import { ProjectDetailPage, ProjectsPage } from '@/src/features/projects';
import { TasksPage, UserTasksPage } from '@/src/features/tasks';
import Calendar from '@/src/pages/Calendar';
import Documents from '@/src/pages/Documents';
import Templates from '@/src/pages/Templates';
import ContractTemplate from '@/src/pages/templates/contract';
import InvoiceTemplate from '@/src/pages/templates/invoice';
import OverdueInvoiceTemplate from '@/src/pages/templates/overdue-invoice';
import ProjectProposalTemplate from '@/src/pages/templates/project-proposal';
import QuotationTemplate from '@/src/pages/templates/quotation';
import Settings from '@/src/pages/Settings';
import { TeamDetailPage, TeamPage } from '@/src/features/team';
import Dashboard from '@/src/pages/admin/Dashboard';
import Payments from '@/src/pages/admin/Payments';
import Chat from '@/src/pages/admin/Chat';
import TemplateEditor from '@/src/pages/admin/TemplateEditor';
import SignIn from '@/src/pages/SignIn';
import ForgotPassword from '@/src/pages/ForgotPassword';
import ResetPassword from '@/src/pages/ResetPassword';
import UserDashboard from '@/src/pages/user/UserDashboard';
import UserProjects from '@/src/pages/user/UserProjects';
import UserCalendar from '@/src/pages/user/UserCalendar';
import UserPayments from '@/src/pages/user/UserPayments';
import UserDocuments from '@/src/pages/user/UserDocuments';
import UserChat from '@/src/pages/user/UserChat';
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

      <Route path="/user" element={clientRoute(<UserDashboard />)} />
      <Route path="/user/projects" element={clientRoute(<UserProjects />)} />
      <Route path="/user/calendar" element={clientRoute(<UserCalendar />)} />
      <Route path="/user/tasks" element={clientRoute(<UserTasksPage />)} />
      <Route path="/user/payments" element={clientRoute(<UserPayments />)} />
      <Route path="/user/documents" element={clientRoute(<UserDocuments />)} />
      <Route path="/user/chat" element={clientRoute(<UserChat />)} />
      <Route path="/user/settings" element={clientRoute(<UserSettings />)} />

      <Route path="/admin" element={adminRoute(<Dashboard />)} />
      <Route path="/admin/clients" element={adminRoute(<ClientsPage />)} />
      <Route path="/admin/clients/:id" element={adminRoute(<ClientDetailPage />)} />
      <Route path="/admin/team" element={adminRoute(<TeamPage />)} />
      <Route path="/admin/team/:id" element={adminRoute(<TeamDetailPage />)} />
      <Route path="/admin/expenses" element={superadminRoute(<Expenses />)} />
      <Route path="/admin/payments" element={adminRoute(<Payments />)} />
      <Route path="/admin/chat" element={adminRoute(<Chat />)} />
      <Route path="/admin/projects" element={adminRoute(<ProjectsPage />)} />
      <Route path="/admin/projects/:id" element={adminRoute(<ProjectDetailPage />)} />
      <Route path="/admin/projects/:projectId/templates/:assignmentId" element={adminRoute(<TemplateEditor />)} />
      <Route path="/admin/tasks" element={adminRoute(<TasksPage />)} />
      <Route path="/admin/calendar" element={adminRoute(<Calendar />)} />
      <Route path="/admin/documents" element={adminRoute(<Documents />)} />
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
