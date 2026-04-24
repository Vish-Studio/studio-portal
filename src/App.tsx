import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Clients from './pages/admin/Clients';
import ClientDetail from './pages/admin/ClientDetail';
import Expenses from './pages/Expenses';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Team from './pages/Team';
import Dashboard from './pages/admin/Dashboard';
import Payments from './pages/admin/Payments';
import ProjectDetail from './pages/admin/ProjectDetail';
import SignIn from './pages/SignIn';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/clients/:id" element={<ClientDetail />} />
        <Route path="/admin/team" element={<Team />} />
        <Route path="/admin/expenses" element={<Expenses />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/projects" element={<Projects />} />
        <Route path="/admin/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/calendar" element={<Calendar />} />
        <Route path="/admin/documents" element={<Documents />} />
        <Route path="/admin/templates" element={<Templates />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Auth */}
        <Route path="/sign-in" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
