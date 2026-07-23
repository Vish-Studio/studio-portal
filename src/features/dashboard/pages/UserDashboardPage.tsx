import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ComponentType, CSSProperties } from 'react';
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
  TrendSparkline,
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

  const roleCanSeeAll = profile?.role === 'superadmin';
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

  const activeProject = useMemo(() => {
    return ongoingProjects
      .slice()
      .sort((a, b) => getPhaseProgress(b.phases) - getPhaseProgress(a.phases))[0] ?? visibleProjects[0];
  }, [visibleProjects, ongoingProjects]);

  const activeAccent = activeProject ? getProjectAccent(activeProject.service, activeProject.package) : null;
  const activeProgress = activeProject ? getPhaseProgress(activeProject.phases) : 0;
  const activePhaseIndex = activeProject ? getActivePhaseIndex(activeProject.phases) : 0;
  const activePhase = activeProject?.phases[activePhaseIndex] ?? activeProject?.phases.at(-1);
  const nextPhase = activeProject?.phases.find(phase => phase.status === 'pending');
  const health = getProjectHealth(activeProject);
  const recentDocuments = visibleDocuments
    .slice()
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, 3);
  const Layout = (audience === 'staff' ? DashboardLayout : UserLayout) as ComponentType<DashboardLayoutProps>;
  const routeBase = audience === 'staff' ? '/admin' : '/user';
  const ownerLabel = canSeeAll
    ? `${clients.length} clients`
    : currentClient?.companyName ?? 'Client portal';
  const dashboardTitle = canSeeAll
    ? 'Studio dashboard'
    : currentClient?.fullName ? `${currentClient.fullName}'s project hub` : 'Project hub';
  const dashboardDescription = canSeeAll
    ? 'Monitor project health, client actions, payments, documents, and delivery momentum across the studio.'
    : 'Track progress, approvals, documents, payments, and the next studio milestone from one place.';
  const actionStatLabel = canSeeAll ? 'Open Tasks' : 'Client Actions';
  const projectStatCaption = canSeeAll ? 'across studio' : 'in your portal';
  const commandTitle = canSeeAll ? 'Priority delivery command' : 'Active project command';
  const actionQueueTitle = canSeeAll ? 'Open task queue' : 'Your next actions';
  const documentActionLabel = canSeeAll ? `${unsignedDocuments.length} pending` : `${unsignedDocuments.length} unsigned`;

  return (
    <Layout title="Dashboard">
      <div className="flex-1 py-6 md:py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:gap-6">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="type-label text-gray-400">{ownerLabel}</p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-(--color-ink) md:text-4xl">
                {dashboardTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
                {dashboardDescription}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                iconLeft={<MaterialIcon name="folder_open" size={16} />}
                onClick={() => navigate(`${routeBase}/documents`)}
              >
                Documents
              </Button>
              <Button
                variant="primary"
                size="md"
                iconLeft={<MaterialIcon name="chat" size={16} />}
                onClick={() => navigate(`${routeBase}/chat`)}
              >
                Message studio
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <CardContent
              iconName={activeAccent?.icon ?? 'work'}
              title={commandTitle}
              className="xl:col-span-8 min-h-[430px]"
              bodyClassName="p-4 md:p-6"
              action={activeProject && <ProjectStatusBadge status={activeProject.status} />}
            >
              {activeProject ? (
                <div className="flex h-full flex-col gap-6">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeAccent && (
                          <span className={`type-label rounded-[8px] px-2.5 py-1 ${activeAccent.badgeBg} ${activeAccent.badgeText}`}>
                            {activeAccent.label}
                          </span>
                        )}
                        <StatusBadge label={health.label} variant={health.variant} />
                      </div>
                      <h2 className="mt-4 text-3xl font-bold leading-tight text-(--color-ink) md:text-4xl">
                        {activeProject.name}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-gray-500">
                        Current phase: <span className="text-(--color-ink)">{activePhase?.title ?? 'Planning'}</span>
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-(--color-ink) p-4 text-white md:min-w-[170px]">
                      <p className="type-label text-gray-400">Progress</p>
                      <div className="mt-2 flex items-end gap-1">
                        <span className="text-5xl font-bold leading-none">{activeProgress}</span>
                        <span className="pb-1 text-sm font-semibold text-gray-400">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-(--color-surface-alt) p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="type-panel-title text-(--color-ink)">Project timeline</p>
                        <p className="type-muted mt-1 text-gray-500">{activeProject.timeline}</p>
                      </div>
                      <ButtonIcon
                        iconName="arrow_outward"
                        label="Open project"
                        clickHandler={() => navigate(`${routeBase}/projects`)}
                        className="bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                      {activeProject.phases.slice(0, 6).map((phase, index) => {
                        const isDone = phase.status === 'done';
                        const isActive = phase.status === 'active';

                        return (
                          <div key={phase.id} className="min-w-0">
                            <div
                              className={`h-2 rounded-full ${
                                isDone
                                  ? 'bg-(--color-ink)'
                                  : isActive
                                    ? 'bg-(--color-accent-lime)'
                                    : 'bg-gray-200'
                              }`}
                            />
                            <p className={`mt-2 truncate text-[11px] font-semibold ${isActive ? 'text-(--color-ink)' : 'text-gray-500'}`}>
                              {index + 1}. {phase.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                      <p className="type-label text-gray-400">Next milestone</p>
                      <p className="mt-2 text-sm font-bold text-(--color-ink)">{nextPhase?.title ?? 'Final review'}</p>
                    </div>
                    <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                      <p className="type-label text-gray-400">Start date</p>
                      <p className="mt-2 text-sm font-bold text-(--color-ink)">{formatShortDate(activeProject.startDate)}</p>
                    </div>
                    <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                      <p className="type-label text-gray-400">Balance due</p>
                      <p className="mt-2 text-sm font-bold text-(--color-ink)">{formatMoney(activeProject.agreedPayment - activeProject.paidPayment)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-[18px] bg-(--color-surface-alt) p-8 text-center">
                  <p className="text-sm font-medium text-gray-500">No active projects yet.</p>
                </div>
              )}
            </CardContent>

            <div className="grid gap-4 sm:grid-cols-2 xl:col-span-4">
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
                className="sm:col-span-2"
              />
              <CardContent
                iconName="analytics"
                title="Delivery pulse"
                className="sm:col-span-2 min-h-[166px]"
                bodyClassName="p-4 md:p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold leading-none text-(--color-ink)">{openTasks.length}</p>
                    <p className="mt-2 type-muted text-gray-500">Open items across the current delivery path.</p>
                  </div>
                  <TrendSparkline
                    data={[12, 22, 18, 28, Math.max(12, pendingApprovals.length * 12), Math.max(8, openTasks.length * 8)]}
                    variant="accent"
                    width={170}
                    height={72}
                    className="w-36 shrink-0 md:w-44"
                    style={{ '--trend-sparkline-color': 'var(--color-ink)' } as CSSProperties}
                  />
                </div>
              </CardContent>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <CardContent
              iconName="task_alt"
              title={actionQueueTitle}
              className="lg:col-span-7 min-h-[300px]"
              bodyClassName="p-0"
              action={
                <ButtonIcon
                  iconName="arrow_outward"
                  label="Open tasks"
                  clickHandler={() => navigate(`${routeBase}/projects`)}
                  className="h-8 w-8 bg-white"
                />
              }
            >
              {openTasks.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {openTasks.slice(0, 4).map(task => (
                    <div key={task.id} className="px-4 py-4 md:px-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-(--color-ink)">{task.title}</p>
                          <p className="mt-1 type-muted text-gray-400">{formatDueDate(task.dueDate)}</p>
                        </div>
                        <TaskStatusBadge status={task.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <p className="text-sm font-medium text-gray-500">No actions waiting on you.</p>
                </div>
              )}
            </CardContent>

            <CardContent
              iconName="account_balance_wallet"
              title="Commercial snapshot"
              className="lg:col-span-5 min-h-[300px]"
              bodyClassName="p-5 md:p-6"
              action={<StatusBadge label={totalDue > 0 ? 'Open balance' : 'Settled'} variant={totalDue > 0 ? 'amber' : 'green'} />}
            >
              <div className="flex h-full flex-col gap-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="type-label text-gray-400">Payment progress</p>
                    <p className="text-sm font-bold text-(--color-ink)">{paidPercent}%</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-(--color-surface-alt)">
                    <div
                      className="h-full rounded-full bg-(--color-accent-lime) transition-all duration-500"
                      style={{ width: `${Math.min(paidPercent, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                    <p className="type-label text-gray-400">Paid</p>
                    <p className="mt-1 text-lg font-bold text-(--color-ink)">{formatMoney(totalPaid)}</p>
                  </div>
                  <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                    <p className="type-label text-gray-400">Due</p>
                    <p className="mt-1 text-lg font-bold text-(--color-ink)">{formatMoney(totalDue)}</p>
                  </div>
                </div>
                <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="type-label text-gray-400">Documents</p>
                    <StatusBadge label={documentActionLabel} variant={unsignedDocuments.length > 0 ? 'amber' : 'green'} />
                  </div>
                  {recentDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {recentDocuments.map(document => (
                        <div key={document.id} className="flex items-center gap-2">
                          <MaterialIcon name={document.type === 'invoice' ? 'receipt_long' : 'description'} size={15} className="text-gray-400" />
                          <p className="min-w-0 flex-1 truncate text-xs font-semibold text-(--color-ink)">{document.title}</p>
                          <span className="text-[10px] font-bold uppercase text-gray-400">{document.isSigned ? 'Signed' : 'Review'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-500">Documents will appear here.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;
