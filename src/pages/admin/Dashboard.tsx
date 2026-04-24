
import { useNavigate } from 'react-router-dom';
import { Command, Users, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { useDocumentsStore } from '@/src/store/documents';
import { useTeamStore } from '@/src/store/team';
import StatCard from '@/src/components/stat-card/stat-card';
import ProjectsOverview from '@/src/components/projects-overview/projects-overview';
import DocumentOverview from '@/src/components/document-overview/document-overview';
import Layout from '@/src/components/layout/layout';
import Calendar from '@/src/components/calendar/calendar';



export default function Dashboard() {
  const navigate = useNavigate();
  const { documents } = useDocumentsStore();
  const { projects, members } = useTeamStore();

  return (
    <Layout>
      <div className="flex-1 flex flex-col gap-4 md:gap-6">

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
            icon={<BarChart2 size={16} />}
            label="Expense Overview"
            value="$4,250"
            valueSubLabel="/ $5,000"
            badge={<><TrendingDown size={14} className="text-red-400" /> -5%</>}
            badgeLabel="Versus budget"
            onAction={() => navigate('/admin/expenses')}
          />
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <Calendar />
          </div>
        </div>

        {/* Projects + Documents overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <ProjectsOverview projects={projects} members={members} limit={5} />
          </div>
          <div className="lg:col-span-1">
            <DocumentOverview documents={documents} limit={5} />
          </div>
        </div>

      </div>
    </Layout>
  );
}