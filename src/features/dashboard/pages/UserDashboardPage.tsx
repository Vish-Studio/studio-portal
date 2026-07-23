import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import UserLayout from '@/src/layouts/UserLayout';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import {
  Button,
  ButtonIcon,
  CardContent,
  MaterialIcon,
  ProjectStatusBadge,
  StatCard,
  StatusBadge,
  TaskStatusBadge,
} from '@/src/shared/components';
import { Briefcase, CheckSquare, CreditCard } from '@/src/shared/components/material-icon/material-lucide-icons';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useClientsStore } from '@/src/features/clients';
import { useDocumentsStore } from '@/src/features/documents';
import { useAuthStore } from '@/src/features/auth';
import { getActivePhaseIndex, getPhaseProgress, getProjectAccent, type ClientProject } from '@/src/features/projects';

type DashboardAudience = 'client' | 'staff';
type DashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

interface UserDashboardPageProps {
  audience?: DashboardAudience;
}

const STORYBOOK_CLIENT_ID = 'c1';
const DASHBOARD_ITEM_LIMIT = 4;

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatShortDate = (value?: string) => {
  if (!value) return 'Not scheduled';

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatDueDate = (value?: string) => (value ? `Due ${formatShortDate(value)}` : 'No due date');

const getProjectHealth = (project?: ClientProject) => {
  if (!project) return { label: 'No project', variant: 'gray' as const };
  if (project.status === 'completed') return { label: 'Delivered', variant: 'green' as const };
  if (project.status === 'paused') return { label: 'Paused', variant: 'amber' as const };

  const progress = getPhaseProgress(project.phases);
  if (progress >= 65) return { label: 'On track', variant: 'green' as const };
  if (progress >= 35) return { label: 'In motion', variant: 'blue' as const };
  return { label: 'Starting', variant: 'amber' as const };
};

const UserDashboardPage = ({ audience = 'client' }: UserDashboardPageProps) => {
  const navigate = useNavigate();
  const profile = useAuthStore(state => state.profile);
  const { projects } = useProjectsStore();
  const { tasks } = useTasksStore();
  const { clients } = useClientsStore();
  const { documents } = useDocumentsStore();

  const roleCanSeeAll = profile?.role === 'superadmin' || profile?.role === 'admin';
  const canSeeAll = roleCanSeeAll || (audience === 'staff' && !profile);
  const profileClientId = profile?.uid ?? profile?.id;
  const currentClient = canSeeAll
    ? undefined
    : clients.find(client => client.id === profileClientId)
      ?? clients.find(client => profile?.email && client.email === profile.email)
      ?? clients.find(client => client.id === STORYBOOK_CLIENT_ID);
  const scopedClientId = canSeeAll ? undefined : currentClient?.id ?? profileClientId ?? STORYBOOK_CLIENT_ID;
  const visibleProjects = canSeeAll
    ? projects
    : projects.filter(project => project.clientId === scopedClientId);
  const visibleProjectIds = new Set(visibleProjects.map(project => project.id));
  const visibleTasks = canSeeAll
    ? tasks
    : tasks.filter(task => (
      visibleProjectIds.has(task.projectId)
      && (task.clientAssigneeId === scopedClientId || task.clientId === scopedClientId)
    ));
  const visibleDocuments = canSeeAll
    ? documents
    : documents.filter(document => document.clientId === scopedClientId);
  const openTasks = visibleTasks.filter(task => task.status !== 'completed');
  const pendingApprovals = openTasks.filter(task => task.status === 'to-test' || task.priority === 'high');
  const unsignedDocuments = visibleDocuments.filter(document => !document.isSigned);
  const ongoingProjects = visibleProjects.filter(project => project.status === 'active');

  const totalAgreed = visibleProjects.reduce((sum, project) => sum + project.agreedPayment, 0);
  const totalPaid = visibleProjects.reduce((sum, project) => sum + project.paidPayment, 0);
  const totalDue = Math.max(totalAgreed - totalPaid, 0);
  const paidPercent = totalAgreed > 0 ? Math.round((totalPaid / totalAgreed) * 100) : 0;

  const featuredProject = useMemo(() => {
    return ongoingProjects
      .slice()
      .sort((a, b) => getPhaseProgress(b.phases) - getPhaseProgress(a.phases))[0] ?? visibleProjects[0];
  }, [visibleProjects, ongoingProjects]);

  const featuredAccent = featuredProject ? getProjectAccent(featuredProject.service, featuredProject.package) : null;
  const recentProjects = visibleProjects
    .slice()
    .sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0))
    .slice(0, DASHBOARD_ITEM_LIMIT);
  const priorityProjects = [
    ...ongoingProjects,
    ...recentProjects.filter(project => !ongoingProjects.some(item => item.id === project.id)),
  ].slice(0, DASHBOARD_ITEM_LIMIT);
  const recentDocuments = visibleDocuments
    .slice()
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, DASHBOARD_ITEM_LIMIT);
  const Layout = (audience === 'staff' ? DashboardLayout : UserLayout) as ComponentType<DashboardLayoutProps>;
  const routeBase = audience === 'staff' ? '/admin' : '/user';
  const ownerLabel = canSeeAll
    ? `${clients.length} clients`
    : currentClient?.companyName ?? 'Client portal';
  const dashboardTitle = canSeeAll
    ? 'Studio overview'
    : 'Project overview';
  const dashboardDescription = canSeeAll
    ? 'Recent and active project movement across the studio.'
    : 'Your active work, upcoming tasks, documents, and payment status.';
  const actionStatLabel = canSeeAll ? 'Open Tasks' : 'Client Actions';
  const projectStatCaption = canSeeAll ? 'across studio' : 'in your portal';
  const projectListTitle = canSeeAll ? 'New and updated projects' : 'Your ongoing projects';
  const actionQueueTitle = canSeeAll ? 'Open tasks' : 'Your next actions';
  const documentActionLabel = canSeeAll ? `${unsignedDocuments.length} pending` : `${unsignedDocuments.length} unsigned`;
  const clientNameForProject = (project: ClientProject) =>
    clients.find(client => client.id === project.clientId)?.companyName
    ?? clients.find(client => client.id === project.clientId)?.fullName
    ?? 'Unassigned client';

  return (
    <Layout title="Dashboard">
      <div className="flex-1 py-4 md:py-6">
        <div className="flex w-full flex-col gap-4">
          <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="type-label text-gray-400">{ownerLabel}</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-(--color-ink) md:text-3xl">
                {dashboardTitle}
              </h1>
              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-gray-500">
                {dashboardDescription}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<MaterialIcon name="folder_open" size={16} />}
                onClick={() => navigate(`${routeBase}/documents`)}
              >
                Documents
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconLeft={<MaterialIcon name="chat" size={16} />}
                onClick={() => navigate(`${routeBase}/chat`)}
              >
                Message
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                variant="lime"
                size="sm"
                icon={<Briefcase size={16} />}
                label="Active Projects"
                value={ongoingProjects.length}
                badge={`${visibleProjects.length} total`}
                badgeLabel={projectStatCaption}
                onAction={() => navigate(`${routeBase}/projects`)}
              />
              <StatCard
                variant="surface"
                size="sm"
                icon={<CheckSquare size={16} />}
                label={actionStatLabel}
                value={pendingApprovals.length}
                badge={`${openTasks.length} open`}
                badgeLabel="tasks"
                onAction={() => navigate(`${routeBase}/projects`)}
              />
              <StatCard
                variant="white"
                size="sm"
                icon={<CreditCard size={16} />}
                label="Outstanding"
                value={formatMoney(totalDue)}
                badge={`${paidPercent}% paid`}
                badgeLabel="overall"
                onAction={() => navigate(`${routeBase}/payments`)}
              />
              <StatCard
                variant="surface"
                size="sm"
                icon={<MaterialIcon name="description" size={16} />}
                label="Documents"
                value={unsignedDocuments.length}
                badge={documentActionLabel}
                badgeLabel="needs review"
                onAction={() => navigate(`${routeBase}/documents`)}
              />
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <CardContent
              iconName={featuredAccent?.icon ?? 'work'}
              title={projectListTitle}
              className="lg:col-span-8"
              bodyClassName="p-0"
              action={
                <ButtonIcon
                  iconName="arrow_outward"
                  label="Open projects"
                  clickHandler={() => navigate(`${routeBase}/projects`)}
                  className="h-8 w-8 bg-white"
                />
              }
            >
              {priorityProjects.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {priorityProjects.map(project => {
                    const progress = getPhaseProgress(project.phases);
                    const phase = project.phases[getActivePhaseIndex(project.phases)] ?? project.phases.at(-1);
                    const accent = getProjectAccent(project.service, project.package);
                    const projectHealth = getProjectHealth(project);

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => navigate(`${routeBase}/projects${audience === 'staff' ? `/${project.id}` : ''}`)}
                        className="grid w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-(--color-surface-alt) md:grid-cols-[minmax(0,1fr)_140px] md:items-center md:px-5"
                      >
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className={`type-label rounded-[8px] px-2 py-0.5 ${accent.badgeBg} ${accent.badgeText}`}>
                              {accent.label}
                            </span>
                            <StatusBadge label={projectHealth.label} variant={projectHealth.variant} />
                          </div>
                          <p className="truncate text-sm font-bold text-(--color-ink)">{project.name}</p>
                          <p className="mt-1 truncate text-xs font-semibold text-gray-400">
                            {canSeeAll ? `${clientNameForProject(project)} - ` : ''}{phase?.title ?? 'Planning'} - {project.timeline}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <ProjectStatusBadge status={project.status} />
                            <span className="text-xs font-bold text-(--color-ink)">{progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-(--color-accent-lime)" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center p-8 text-center">
                  <p className="text-sm font-medium text-gray-500">No projects to show yet.</p>
                </div>
              )}
            </CardContent>

            <CardContent
              iconName="task_alt"
              title={actionQueueTitle}
              className="lg:col-span-4"
              bodyClassName="p-0"
              action={<StatusBadge label={`${openTasks.length} open`} variant={openTasks.length > 0 ? 'amber' : 'green'} />}
            >
              {openTasks.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {openTasks.slice(0, DASHBOARD_ITEM_LIMIT).map(task => (
                    <div key={task.id} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-(--color-ink)">{task.title}</p>
                          <p className="mt-1 type-muted text-gray-400">{formatDueDate(task.dueDate)}</p>
                        </div>
                        <TaskStatusBadge status={task.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center p-8 text-center">
                  <p className="text-sm font-medium text-gray-500">No actions waiting.</p>
                </div>
              )}
            </CardContent>
          </section>

          {featuredProject && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <CardContent
                iconName="account_balance_wallet"
                title="Payments and documents"
                className="lg:col-span-5"
                bodyClassName="p-4"
                action={<StatusBadge label={totalDue > 0 ? 'Open balance' : 'Settled'} variant={totalDue > 0 ? 'amber' : 'green'} />}
              >
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="type-label text-gray-400">Payment progress</p>
                      <p className="text-sm font-bold text-(--color-ink)">{paidPercent}%</p>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-(--color-surface-alt)">
                      <div
                        className="h-full rounded-full bg-(--color-accent-lime) transition-all duration-500"
                        style={{ width: `${Math.min(paidPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="type-label text-gray-400">Paid</p>
                      <p className="mt-1 text-lg font-bold text-(--color-ink)">{formatMoney(totalPaid)}</p>
                    </div>
                    <div>
                      <p className="type-label text-gray-400">Due</p>
                      <p className="mt-1 text-lg font-bold text-(--color-ink)">{formatMoney(totalDue)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardContent
                iconName="description"
                title="Recent documents"
                className="lg:col-span-7"
                bodyClassName="p-0"
                action={<StatusBadge label={documentActionLabel} variant={unsignedDocuments.length > 0 ? 'amber' : 'green'} />}
              >
                {recentDocuments.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {recentDocuments.map(document => (
                      <div key={document.id} className="flex items-center gap-3 px-4 py-3">
                        <MaterialIcon name={document.type === 'invoice' ? 'receipt_long' : 'description'} size={16} className="text-gray-400" />
                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-(--color-ink)">{document.title}</p>
                        <span className="text-[10px] font-bold uppercase text-gray-400">{document.isSigned ? 'Signed' : 'Review'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[120px] items-center justify-center p-6 text-center">
                    <p className="text-sm font-medium text-gray-500">Documents will appear here.</p>
                  </div>
                )}
              </CardContent>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;
