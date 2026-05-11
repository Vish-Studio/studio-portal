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
import ProjectDetail from './pages/admin/ProjectDetail';
import TemplateEditor from './pages/admin/TemplateEditor';
import SignIn from './pages/SignIn';
import UserDashboard from './pages/user/UserDashboard';
import UserProjects from './pages/user/UserProjects';
import UserCalendar from './pages/user/UserCalendar';
import UserTasks from './pages/user/UserTasks';
import UserPayments from './pages/user/UserPayments';
import UserDocuments from './pages/user/UserDocuments';
import UserChat from './pages/user/UserChat';
import UserSettings from './pages/user/UserSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* User / client routes */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/projects" element={<UserProjects />} />
        <Route path="/user/calendar" element={<UserCalendar />} />
        <Route path="/user/tasks" element={<UserTasks />} />
        <Route path="/user/payments" element={<UserPayments />} />
        <Route path="/user/documents" element={<UserDocuments />} />
        <Route path="/user/chat" element={<UserChat />} />
        <Route path="/user/settings" element={<UserSettings />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/clients/:id" element={<ClientDetail />} />
        <Route path="/admin/team" element={<Team />} />
        <Route path="/admin/expenses" element={<Expenses />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/chat" element={<Chat />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/projects/:projectId/templates/:assignmentId" element={<TemplateEditor />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/calendar" element={<Calendar />} />
        <Route path="/admin/documents" element={<Documents />} />
        <Route path="/admin/templates" element={<Templates />} />
        <Route path="/admin/templates/contract" element={<ContractTemplate />} />
        <Route path="/admin/templates/invoice" element={<InvoiceTemplate />} />
        <Route path="/admin/templates/overdue-invoice" element={<OverdueInvoiceTemplate />} />
        <Route path="/admin/templates/project-proposal" element={<ProjectProposalTemplate />} />
        <Route path="/admin/templates/quotation" element={<QuotationTemplate />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Auth */}
        <Route path="/sign-in" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
