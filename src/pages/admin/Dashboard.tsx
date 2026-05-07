import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, Users, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { useDocumentsStore } from '@/src/store/documents';
import { useTeamStore } from '@/src/store/team';
import { useProjectsStore } from '@/src/store/projects';
import { useTasksStore } from '@/src/store/tasks';
import StatCard from '@/src/components/common/stat-card/stat-card';
import ProjectsOverview from '@/src/components/admin/projects-overview/projects-overview';
import DocumentOverview from '@/src/components/admin/document-overview/document-overview';
import TasksOverview from '@/src/components/admin/tasks-overview/tasks-overview';
import Layout from '@/src/components/common/layout/layout';
import Calendar from '@/src/components/admin/calendar/calendar';
import ScheduleList from '@/src/components/admin/calendar/schedule-list';

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents } = useDocumentsStore();
  const { members } = useTeamStore();
  const { projects } = useProjectsStore();
  const { tasks } = useTasksStore();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());

  return (
    <Layout>
      <div className="flex-1 flex flex-col gap-4 md:gap-6 py-10 pt-6">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            variant="lime"
            icon={<Command size={16} />}
            label="Ongoing Projects"
            value="12"
            badge="68% capacity"
            badgeLabel="Projects in progress"
            onAction={() => navigate('/admin/projects')}
          />
          <StatCard
            variant="surface"
            icon={<Users size={16} />}
            label="Client Overview"
            value="24"
            badge={<><TrendingUp size={14} className="text-green-600" /> +12%</>}
            badgeLabel="Active this month"
            onAction={() => navigate('/admin/clients')}
          />
          <StatCard
            variant="dark"
            icon={<CreditCard size={16} />}
            label="Payment Overview"
            value="$18,240"
            valueSubLabel="collected"
            badge={<><TrendingDown size={14} className="text-red-400" /> -5%</>}
            badgeLabel="Versus last month"
            onAction={() => navigate('/admin/payments')}
          />
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Calendar
            variant="dashboard"
            selectedDate={selectedCalendarDate}
            onDateChange={setSelectedCalendarDate}
            className="aspect-square"
          />
          <div className="lg:col-span-2">
            <ScheduleList date={selectedCalendarDate} />
          </div>
        </div>

        {/* Projects + Documents overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <ProjectsOverview projects={projects} members={members} limit={4} />
          </div>
        </div>

        {/* Tasks overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <DocumentOverview documents={documents} limit={5} />
          </div>
          <div className="lg:col-span-2">
            <TasksOverview tasks={tasks} limit={5} />
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
