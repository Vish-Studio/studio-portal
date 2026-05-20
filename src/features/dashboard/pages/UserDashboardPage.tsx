import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckSquare, CreditCard } from '@/src/shared/components/material-icon/material-lucide-icons';
import UserLayout from '@/src/layouts/UserLayout';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import CardContent from '@/src/shared/components/card-content/card-content';
import { MaterialIcon, ProjectStatusBadge, TaskStatusBadge } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useClientsStore } from '@/src/features/clients';
import { getPhaseProgress, getProjectAccent } from '@/src/features/projects';

// Simulated logged-in client — would come from auth context in production
const CURRENT_CLIENT_ID = 'c1';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { projects } = useProjectsStore();
  const { tasks } = useTasksStore();
  const { clients } = useClientsStore();
  const currentClient = clients.find(c => c.id === CURRENT_CLIENT_ID);

  // This client's projects only
  const myProjects = projects.filter(p => p.clientId === CURRENT_CLIENT_ID);
  const myProjectIds = new Set(myProjects.map(p => p.id));
  const ongoingProjects = myProjects.filter(p => p.status === 'active');

  // Tasks explicitly assigned to this client through their projects
  const myTasks = tasks.filter(t => t.clientAssigneeId === CURRENT_CLIENT_ID && myProjectIds.has(t.projectId));
  const myOpenTasks = myTasks.filter(t => t.status !== 'completed');

  // Payment summary for this client's projects
  const totalAgreed = myProjects.reduce((sum, p) => sum + p.agreedPayment, 0);
  const totalPaid = myProjects.reduce((sum, p) => sum + p.paidPayment, 0);
  const totalDue = totalAgreed - totalPaid;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <UserLayout title="Dashboard">
      <div className="flex-1 flex flex-col gap-4 md:gap-6 py-10">

        {/* Greeting */}
        <div>
          <p className="text-sm text-gray-500 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-(--color-ink)">{currentClient?.fullName}</h1>
          {currentClient?.companyName && (
            <p className="text-sm text-gray-400 mt-0.5">{currentClient.companyName}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            variant="lime"
            icon={<Briefcase size={16} />}
            label="Ongoing Projects"
            value={ongoingProjects.length}
            badge={`${myProjects.length} total`}
            badgeLabel="Your active projects"
            onAction={() => navigate('/user/projects')}
          />
          <StatCard
            variant="surface"
            icon={<CheckSquare size={16} />}
            label="Ongoing Tasks"
            value={myOpenTasks.length}
            badge={`${myTasks.length} total`}
            badgeLabel="Across your projects"
            onAction={() => navigate('/user/projects')}
          />
          <StatCard
            variant="dark"
            icon={<CreditCard size={16} />}
            label="Outstanding Balance"
            value={`$${totalDue.toLocaleString()}`}
            valueSubLabel="due"
            badge={`$${totalPaid.toLocaleString()} paid`}
            badgeLabel={`of $${totalAgreed.toLocaleString()} agreed`}
            onAction={() => navigate('/user/payments')}
          />
        </div>

        {/* Projects + Tasks overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* My Projects */}
          <div className="lg:col-span-2">
            <CardContent
              iconName="work"
              title="My Projects"
              className="h-full"
              action={
                <button
                  onClick={() => navigate('/user/projects')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MaterialIcon name="arrow_outward" size={16} />
                </button>
              }
            >
              {myProjects.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-400 font-medium">No projects yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myProjects.map(project => {
                    const accent = getProjectAccent(project.service, project.package);
                    const progress = getPhaseProgress(project.phases);
                    const projectTaskCount = myTasks.filter(t => t.projectId === project.id).length;
                    const openTaskCount = myTasks.filter(t => t.projectId === project.id && t.status !== 'completed').length;

                    return (
                      <div
                        key={project.id}
                        className="px-4 md:px-6 py-4 flex items-center gap-3"
                      >
                        {/* Service icon */}
                        <div className={`w-9 h-9 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
                          <MaterialIcon name={accent.icon} size={15} className={accent.iconText} />
                        </div>

                        {/* Name + service */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-(--color-ink) truncate leading-tight">
                            {project.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold ${accent.badgeText}`}>
                              {accent.label}
                            </span>
                            <span className="text-[10px] text-gray-400">·</span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {openTaskCount}/{projectTaskCount} tasks open
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="hidden sm:flex items-center gap-2 w-28 shrink-0">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${accent.bar}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-400 tabular-nums w-6 text-right">
                            {progress}%
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className="hidden md:flex items-center gap-1 shrink-0">
                          <MaterialIcon name="schedule" size={12} className="text-gray-400" />
                          <span className="text-[11px] text-gray-400 font-medium">{project.timeline}</span>
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                          <ProjectStatusBadge status={project.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </div>

          {/* Open Tasks */}
          <div className="lg:col-span-1">
            <CardContent
              iconName="task_alt"
              title="Open Tasks"
              className="h-full"
            >
              {myOpenTasks.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-400 font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myOpenTasks.slice(0, 6).map(task => (
                    <div key={task.id} className="px-4 md:px-6 py-3.5 flex flex-col gap-1">
                      <p className="text-sm font-medium text-(--color-ink) leading-snug">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <TaskStatusBadge status={task.status} />
                        {task.dueDate && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {myOpenTasks.length > 6 && (
                    <div className="px-4 md:px-6 py-3 text-center">
                      <span className="text-xs text-gray-400 font-medium">
                        +{myOpenTasks.length - 6} more tasks
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </div>
        </div>

      </div>
    </UserLayout>
  );
};

export default UserDashboardPage;
