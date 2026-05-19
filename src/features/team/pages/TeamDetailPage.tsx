import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, CheckSquare, Clock3, Mail, Pencil } from 'lucide-react';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import CardContent from '@/src/components/common/card-content/card-content';
import FormSidebar, { FormSidebarFooter } from '@/src/components/common/form-sidebar/form-sidebar';
import Fab from '@/src/components/common/button-fab/button-fab';
import { ProjectCard } from '@/src/features/projects';
import TeamDetailCard from '../components/team-detail-card/team-detail-card';
import StatCard from '@/src/components/common/stat-card/stat-card';
import { Breadcrumb, Button, ButtonIcon, FormField, inputCls, Option, Select, TaskStatusBadge } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useTeamStore } from '../stores/teamStore';
import { useAuthStore } from '@/src/features/auth';
import type { TeamAccessRole } from '../types';

interface TeamMemberFormValues {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
}

const fieldCls = (hasError: boolean) =>
  inputCls(hasError) +
  ' disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:shadow-none disabled:focus:ring-0 disabled:focus:bg-transparent';

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { members, loading, subscribeMembers, updateMember } = useTeamStore();
  const profile = useAuthStore(state => state.profile);
  const { projects } = useProjectsStore();
  const { tasks } = useTasksStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const isSuperAdmin = profile?.role === 'superadmin';
  const canManageTeam = profile?.role === 'superadmin' || profile?.role === 'admin';

  useEffect(() => subscribeMembers(), [subscribeMembers]);

  const member = members.find(item => item.id === id);

  const memberProjects = useMemo(() => {
    if (!member) return [];
    return projects.filter(project =>
      project.assignedMemberIds?.includes(member.id) ||
      project.id === member.assignedProjectId,
    );
  }, [member, projects]);

  const currentProjects = memberProjects.filter(project => project.status !== 'completed');
  const pastProjects = memberProjects.filter(project => project.status === 'completed');

  const assignedTasks = useMemo(() => {
    if (!member) return [];
    return tasks
      .filter(task => task.assigneeIds?.includes(member.id))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [member, tasks]);

  const canEditMember = !!member && canManageTeam && (isSuperAdmin || member.accessRole !== 'superadmin');
  const roleOptions = isSuperAdmin
    ? (['freelancer', 'admin', 'superadmin'] as TeamAccessRole[])
    : (['freelancer', 'admin'] as TeamAccessRole[]);

  const openTasks = assignedTasks.filter(task => task.status !== 'completed');
  const completedTasks = assignedTasks.filter(task => task.status === 'completed');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<TeamMemberFormValues>({
    values: member
      ? {
        name: member.name,
        role: member.role,
        accessRole: member.accessRole ?? 'freelancer',
        email: member.email,
      }
      : undefined,
  });

  const onSubmit = async (data: TeamMemberFormValues) => {
    if (!member || !canEditMember) return;
    if (!isSuperAdmin && data.accessRole === 'superadmin') {
      throw new Error('Only a superadmin can assign the superadmin role.');
    }
    await updateMember(member.id, data);
    reset(data);
    setIsEditing(false);
    setEditSidebarOpen(false);
  };

  const handleCancel = () => {
    reset({
      name: member?.name ?? '',
      role: member?.role ?? '',
      accessRole: member?.accessRole ?? 'freelancer',
      email: member?.email ?? '',
    });
    setIsEditing(false);
    setEditSidebarOpen(false);
  };

  const openEdit = () => {
    if (!member || !canEditMember) return;
    reset({
      name: member.name,
      role: member.role,
      accessRole: member.accessRole ?? 'freelancer',
      email: member.email,
    });
    setIsEditing(true);
  };

  const openMobileEdit = () => {
    if (!member || !canEditMember) return;
    reset({
      name: member.name,
      role: member.role,
      accessRole: member.accessRole ?? 'freelancer',
      email: member.email,
    });
    setIsEditing(true);
    setEditSidebarOpen(true);
  };

  if (!member) {
    return (
      <DashboardLayout title="Team">
        <div className="team-detail-empty flex flex-col items-center justify-center gap-4 py-24">
          <div className="team-detail-empty-icon flex h-12 w-12 items-center justify-center rounded-full bg-(--color-surface)">
            <Briefcase size={20} className="text-gray-400" />
          </div>
          <p className="type-card-title text-gray-500">
            {loading ? 'Loading team member...' : 'Team member not found.'}
          </p>
          <Link to="/admin/team" className="text-sm font-semibold text-gray-900 underline underline-offset-4">
            Back to Team
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="team-detail flex flex-1 flex-col gap-4 md:gap-10">
        <Breadcrumb
          previousLink="/admin/team"
          previousPageName="Team"
          currentPageName={member.name}
        />

        <div className="team-detail-overview grid grid-cols-1 gap-4 md:grid-cols-2">
          <TeamDetailCard member={member} projects={memberProjects} tasks={assignedTasks} />

          <CardContent
            iconName="badge"
            title="Team Details"
            variant="white"
            className="hidden md:flex"
            action={
              isEditing ? (
                <div className="team-detail-actions flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="team-detail-cancel rounded-lg px-3 py-1.5 text-[12px] font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    form="team-edit-form"
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="team-detail-save rounded-lg bg-(--color-ink) px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              ) : (
                canEditMember ? <ButtonIcon iconName="edit" clickHandler={openEdit} /> : null
              )
            }
          >
            <form
              id="team-edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="team-detail-form space-y-4 px-4 py-4 md:px-6 md:py-5"
            >
              <FormField label="Full Name" required={isEditing} error={errors.name?.message}>
                <input
                  {...register('name', { required: isEditing ? 'Name is required' : false })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.name)}
                />
              </FormField>

              <FormField label="Role" required={isEditing} error={errors.role?.message}>
                <input
                  {...register('role', { required: isEditing ? 'Role is required' : false })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.role)}
                />
              </FormField>

              <FormField label="Access Role" required={isEditing} error={errors.accessRole?.message}>
                <Select
                  {...register('accessRole', { required: isEditing ? 'Access role is required' : false })}
                  disabled={!isEditing}
                  hasError={!!errors.accessRole}
                  className="disabled:bg-transparent disabled:border-transparent disabled:px-0 disabled:py-1 disabled:cursor-default disabled:text-gray-900 disabled:appearance-none disabled:shadow-none disabled:focus:ring-0"
                >
                  {roleOptions.map(role => (
                    <Option key={role} value={role}>
                      {role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Freelancer'}
                    </Option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Email" required={isEditing} error={errors.email?.message}>
                <input
                  type="email"
                  {...register('email', {
                    required: isEditing ? 'Email is required' : false,
                    pattern: isEditing
                      ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                      : undefined,
                  })}
                  disabled={!isEditing}
                  className={fieldCls(!!errors.email)}
                />
              </FormField>
            </form>
          </CardContent>
        </div>

        <div className="team-detail-stats grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            variant="lime"
            icon={<Briefcase size={18} />}
            label="Current Projects"
            value={currentProjects.length}
            badge={`${pastProjects.length} past`}
            badgeLabel="completed projects"
          />
          <StatCard
            variant="surface"
            icon={<CheckSquare size={18} />}
            label="Open Tasks"
            value={openTasks.length}
            badge={`${completedTasks.length} done`}
            badgeLabel="assigned tasks"
          />
          <StatCard
            variant="white"
            icon={<Mail size={18} />}
            label="Contact"
            value={<span className="text-xl">{member.email ? 'Ready' : 'Missing'}</span>}
            badge={member.role}
            badgeLabel="team role"
          />
        </div>

        <section className="team-detail-section">
          <div className="team-detail-section-header mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="type-section-title text-(--color-ink)">Current Projects</h2>
              <p className="type-muted mt-1 text-gray-400">Active or paused projects this member is working on.</p>
            </div>
            <span className="type-label text-gray-400">{currentProjects.length} project{currentProjects.length !== 1 ? 's' : ''}</span>
          </div>

          {currentProjects.length === 0 ? (
            <div className="team-detail-empty-card rounded-[18px] border border-gray-100 bg-white p-10 text-center">
              <p className="type-card-title text-gray-500">No current projects</p>
              <p className="type-muted mt-1 text-gray-400">Assigned projects will appear here.</p>
            </div>
          ) : (
            <div className="team-detail-project-grid grid grid-cols-1 gap-4 xl:grid-cols-2">
              {currentProjects.map(project => (
                <ProjectCard key={project.id} project={project} allMembers={members} variant="surface" />
              ))}
            </div>
          )}
        </section>

        <section className="team-detail-section">
          <div className="team-detail-section-header mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="type-section-title text-(--color-ink)">Assigned Tasks</h2>
              <p className="type-muted mt-1 text-gray-400">Open work and recent completed tasks assigned to this member.</p>
            </div>
            <span className="type-label text-gray-400">{assignedTasks.length} task{assignedTasks.length !== 1 ? 's' : ''}</span>
          </div>

          {assignedTasks.length === 0 ? (
            <div className="team-detail-empty-card rounded-[18px] border border-gray-100 bg-white p-10 text-center">
              <p className="type-card-title text-gray-500">No assigned tasks</p>
              <p className="type-muted mt-1 text-gray-400">Tasks assigned from the task board will appear here.</p>
            </div>
          ) : (
            <div className="team-detail-task-list flex flex-col gap-2">
              {assignedTasks.map(task => {
                const project = projects.find(item => item.id === task.projectId);

                return (
                  <div key={task.id} className="team-detail-task-row grid gap-3 rounded-[18px] border border-gray-200 bg-white p-4 md:grid-cols-[minmax(240px,1fr)_160px_120px] md:items-center">
                    <div className="team-detail-task-main min-w-0">
                      <p className="type-card-title truncate text-(--color-ink)">{task.title}</p>
                      <p className="type-muted mt-0.5 truncate text-gray-400">{project?.name ?? 'No project linked'}</p>
                    </div>
                    <div className="team-detail-task-meta flex items-center gap-2 text-gray-400">
                      <Clock3 size={14} />
                      <span className="type-label">{task.dueDate || 'No due date'}</span>
                    </div>
                    <div className="team-detail-task-status flex justify-start md:justify-end">
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="team-detail-section">
          <div className="team-detail-section-header mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="type-section-title text-(--color-ink)">Past Projects</h2>
              <p className="type-muted mt-1 text-gray-400">Completed projects this member contributed to.</p>
            </div>
            <span className="type-label text-gray-400">{pastProjects.length} project{pastProjects.length !== 1 ? 's' : ''}</span>
          </div>

          {pastProjects.length === 0 ? (
            <div className="team-detail-empty-card rounded-[18px] border border-gray-100 bg-white p-10 text-center">
              <p className="type-card-title text-gray-500">No past projects yet</p>
              <p className="type-muted mt-1 text-gray-400">Completed project history will appear here.</p>
            </div>
          ) : (
            <div className="team-detail-project-grid grid grid-cols-1 gap-4 xl:grid-cols-2">
              {pastProjects.map(project => (
                <ProjectCard key={project.id} project={project} allMembers={members} variant="surface" />
              ))}
            </div>
          )}
        </section>
      </div>

      {canEditMember && (
        <Fab
          icon={Pencil}
          ariaLabel="Edit team member"
          onClick={openMobileEdit}
          className="md:hidden"
        />
      )}

      <FormSidebar
        isOpen={editSidebarOpen}
        onClose={handleCancel}
        title="Edit Team Member"
        description={member.name}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="team-detail-sidebar-form flex min-h-0 flex-1 flex-col">
          <div className="team-detail-sidebar-fields flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <FormField label="Full Name" required error={errors.name?.message}>
              <input
                {...register('name', { required: 'Name is required' })}
                className={inputCls(!!errors.name)}
              />
            </FormField>

            <FormField label="Role" required error={errors.role?.message}>
              <input
                {...register('role', { required: 'Role is required' })}
                className={inputCls(!!errors.role)}
              />
            </FormField>

            <FormField label="Access Role" required error={errors.accessRole?.message}>
              <Select
                {...register('accessRole', { required: 'Access role is required' })}
                hasError={!!errors.accessRole}
              >
                {roleOptions.map(role => (
                  <Option key={role} value={role}>
                    {role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Freelancer'}
                  </Option>
                ))}
              </Select>
            </FormField>

            <FormField label="Email" required error={errors.email?.message}>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                className={inputCls(!!errors.email)}
              />
            </FormField>
          </div>

          <FormSidebarFooter>
            <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="flex-1">
              Save
            </Button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </DashboardLayout>
  );
}
