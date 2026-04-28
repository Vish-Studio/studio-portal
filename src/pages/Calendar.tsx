import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import CardContent from '../components/common/card-content/card-content';
import MaterialIcon from '../components/common/material-icon/material-icon';
import Avatar from '../components/common/avatar/avatar';
import CalendarWidget from '../components/admin/calendar/calendar';
import { ProjectStatusBadge } from '../components/common/status-badge/status-badge';
import { useProjectsStore } from '../store/projects';
import { useClientsStore } from '../store/clients';
import { useTeamStore } from '../store/team';
import { getProjectAccent, ALL_STAGES } from '../data/projects';
import type { ClientProject } from '../data/projects';
import type { TeamMember } from '../data/team';

// ─── Active project row ───────────────────────────────────────────────────────

const ProjectRow = ({ project }: { project: ClientProject }) => {
  const navigate   = useNavigate();
  const { clients } = useClientsStore();
  const accent      = getProjectAccent(project.service, project.package);
  const client      = clients.find(c => c.id === project.clientId);
  const done        = project.stages.filter(s => s.status === 'completed').length;
  const progress    = Math.round((done / ALL_STAGES.length) * 100);

  return (
    <button
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="w-full flex items-center gap-3 px-4 md:px-6 py-3 hover:bg-(--color-surface-subtle) transition-colors group text-left"
    >
      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <MaterialIcon name={accent.icon} size={13} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{project.name}</p>
        {client && <p className="text-[10px] text-gray-400 truncate">{client.displayName}</p>}
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-gray-400 w-6 text-right tabular-nums">{progress}%</span>
      </div>
      <ProjectStatusBadge status={project.status} />
      <ExternalLink size={11} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
};

// ─── Team member row ──────────────────────────────────────────────────────────

const TeamRow = ({ member }: { member: TeamMember }) => {
  const navigate   = useNavigate();
  const { projects } = useProjectsStore();
  const project    = projects.find(p => p.id === member.assignedProjectId);

  return (
    <button
      onClick={() => navigate('/admin/team')}
      className="w-full flex items-center gap-3 px-4 md:px-6 py-3 hover:bg-(--color-surface-subtle) transition-colors group text-left"
    >
      <Avatar name={member.name} id={member.id} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
        <p className="text-[10px] text-gray-400 truncate">{member.role}</p>
      </div>
      {project ? (
        <span className="hidden sm:inline text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-[4px] shrink-0 truncate max-w-28">
          {project.name}
        </span>
      ) : (
        <span className="text-[10px] text-gray-300 shrink-0">Unassigned</span>
      )}
      <ExternalLink size={11} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
};

// ─── Calendar Page ────────────────────────────────────────────────────────────
// Reuses the same CalendarWidget component as the Dashboard — single source of
// truth for the grid + daily schedule + add/edit/delete events (useCalendarStore).

const CalendarPage = () => {
  const { projects } = useProjectsStore();
  const { members }  = useTeamStore();

  const activeProjects = projects.filter(p => p.status === 'active');
  const assignedMembers = members.filter(m => m.assignedProjectId !== null);
  const freeMembers     = members.filter(m => m.assignedProjectId === null);

  return (
    <Layout title="Calendar">
      <div className="flex flex-col gap-6 pb-10">

        {/* ── Shared calendar widget (same component as Dashboard) ── */}
        <CalendarWidget />

        {/* ── Context panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Active Projects */}
          <CardContent
            iconName="work"
            title={`Active Projects (${activeProjects.length})`}
            variant="white"
            action={
              <button
                onClick={() => { window.location.href = '/admin/projects'; }}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                View all
              </button>
            }
          >
            {activeProjects.length === 0 ? (
              <p className="px-4 md:px-6 py-4 text-sm text-gray-400">No active projects.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {activeProjects.map(p => <ProjectRow key={p.id} project={p} />)}
              </div>
            )}
          </CardContent>

          {/* Team */}
          <CardContent
            iconName="group"
            title={`Team (${members.length})`}
            variant="white"
            action={
              <button
                onClick={() => { window.location.href = '/admin/team'; }}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                View all
              </button>
            }
          >
            <div className="divide-y divide-gray-50">
              {assignedMembers.map(m => <TeamRow key={m.id} member={m} />)}
              {freeMembers.map(m => <TeamRow key={m.id} member={m} />)}
            </div>
          </CardContent>

        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
