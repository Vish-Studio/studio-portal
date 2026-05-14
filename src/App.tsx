import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Clients from './pages/admin/Clients';
import ClientDetail from './pages/admin/ClientDetail';
import Expenses from './pages/Expenses';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Templates from './pages/Templates';
import ContractTemplate from './pages/templates/contract';
import InvoiceTemplate from './pages/templates/invoice';
import OverdueInvoiceTemplate from './pages/templates/overdue-invoice';
import ProjectProposalTemplate from './pages/templates/project-proposal';
import QuotationTemplate from './pages/templates/quotation';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Dashboard from './pages/admin/Dashboard';
import Payments from './pages/admin/Payments';
import Chat from './pages/admin/Chat';
import TeamDetail from './pages/admin/TeamDetail';
import ProjectDetail from './pages/admin/ProjectDetail';
import TemplateEditor from './pages/admin/TemplateEditor';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import UserProjects from './pages/user/UserProjects';
import UserCalendar from './pages/user/UserCalendar';
import UserTasks from './pages/user/UserTasks';
import UserPayments from './pages/user/UserPayments';
import UserDocuments from './pages/user/UserDocuments';
import UserChat from './pages/user/UserChat';
import UserSettings from './pages/user/UserSettings';
import { AuthGate, AuthLanding, AuthProvider } from './components/common/auth-gate/auth-gate';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root based on auth role */}
          <Route path="/" element={<AuthLanding />} />

          {/* User / client routes */}
          <Route path="/user" element={<AuthGate role="client"><UserDashboard /></AuthGate>} />
          <Route path="/user/projects" element={<AuthGate role="client"><UserProjects /></AuthGate>} />
          <Route path="/user/calendar" element={<AuthGate role="client"><UserCalendar /></AuthGate>} />
          <Route path="/user/tasks" element={<AuthGate role="client"><UserTasks /></AuthGate>} />
          <Route path="/user/payments" element={<AuthGate role="client"><UserPayments /></AuthGate>} />
          <Route path="/user/documents" element={<AuthGate role="client"><UserDocuments /></AuthGate>} />
          <Route path="/user/chat" element={<AuthGate role="client"><UserChat /></AuthGate>} />
          <Route path="/user/settings" element={<AuthGate role="client"><UserSettings /></AuthGate>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AuthGate role="admin"><Dashboard /></AuthGate>} />
          <Route path="/admin/clients" element={<AuthGate role="admin"><Clients /></AuthGate>} />
          <Route path="/admin/clients/:id" element={<AuthGate role="admin"><ClientDetail /></AuthGate>} />
          <Route path="/admin/team" element={<AuthGate role="admin"><Team /></AuthGate>} />
          <Route path="/admin/team/:id" element={<AuthGate role="admin"><TeamDetail /></AuthGate>} />
          <Route path="/admin/expenses" element={<AuthGate role="admin"><Expenses /></AuthGate>} />
          <Route path="/admin/payments" element={<AuthGate role="admin"><Payments /></AuthGate>} />
          <Route path="/admin/chat" element={<AuthGate role="admin"><Chat /></AuthGate>} />
          <Route path="/admin/projects" element={<AuthGate role="admin"><Projects /></AuthGate>} />
          <Route path="/admin/projects/:id" element={<AuthGate role="admin"><ProjectDetail /></AuthGate>} />
          <Route path="/admin/projects/:projectId/templates/:assignmentId" element={<AuthGate role="admin"><TemplateEditor /></AuthGate>} />
          <Route path="/admin/tasks" element={<AuthGate role="admin"><Tasks /></AuthGate>} />
          <Route path="/admin/calendar" element={<AuthGate role="admin"><Calendar /></AuthGate>} />
          <Route path="/admin/documents" element={<AuthGate role="admin"><Documents /></AuthGate>} />
          <Route path="/admin/templates" element={<AuthGate role="admin"><Templates /></AuthGate>} />
          <Route path="/admin/templates/contract" element={<AuthGate role="admin"><ContractTemplate /></AuthGate>} />
          <Route path="/admin/templates/invoice" element={<AuthGate role="admin"><InvoiceTemplate /></AuthGate>} />
          <Route path="/admin/templates/overdue-invoice" element={<AuthGate role="admin"><OverdueInvoiceTemplate /></AuthGate>} />
          <Route path="/admin/templates/project-proposal" element={<AuthGate role="admin"><ProjectProposalTemplate /></AuthGate>} />
          <Route path="/admin/templates/quotation" element={<AuthGate role="admin"><QuotationTemplate /></AuthGate>} />
          <Route path="/admin/settings" element={<AuthGate role="admin"><Settings /></AuthGate>} />

          {/* Auth */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
