import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Pencil } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import Fab from '@/src/shared/components/button-fab/button-fab';
import { ProjectCard } from '@/src/features/projects';
import TeamDetailCard from '../components/team-detail-card/team-detail-card';
import { Breadcrumb, Button, FormField, Option, Select, TextInput } from '@/src/shared/components';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';
import { useTeamStore } from '../stores/teamStore';
import { useAuthStore } from '@/src/features/auth';
import { useUIStore } from '@/src/app/stores/uiStore';
import { FEEDBACK_MESSAGES } from '@/src/app/messages';
import type { TeamAccessRole } from '../types';
import TeamDetailTaskRow from '../components/team-detail-task-row/team-detail-task-row';

interface TeamMemberFormValues {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { members, loading, subscribeMembers, updateMember } = useTeamStore();
  const showToast = useUIStore(state => state.showToast);
  const profile = useAuthStore(state => state.profile);
  const { projects } = useProjectsStore();
  const { tasks } = useTasksStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<TeamMemberFormValues>({
    defaultValues: {
      name: '',
      role: '',
      accessRole: 'freelancer',
      email: '',
    },
  });

  const watchedMemberForm = watch();
  const hasMemberChanges = !!member && isEditing && (
    watchedMemberForm.name !== member.name ||
    watchedMemberForm.role !== member.role ||
    watchedMemberForm.accessRole !== (member.accessRole ?? 'freelancer') ||
    watchedMemberForm.email !== member.email
  );

  useEffect(() => {
    if (!member || isEditing) return;
    reset({
      name: member.name,
      role: member.role,
      accessRole: member.accessRole ?? 'freelancer',
      email: member.email,
    });
  }, [member, isEditing, reset]);

  const onSubmit = async (data: TeamMemberFormValues) => {
    if (!member || !canEditMember) return;
    if (!isSuperAdmin && data.accessRole === 'superadmin') {
      const message = FEEDBACK_MESSAGES.sidebar.superadminRequired;
      setSubmitError(message);
      showToast({ status: 'error', title: FEEDBACK_MESSAGES.sidebar.memberSaveToast, message });
      return;
    }
    setSubmitError(null);
    try {
      await updateMember(member.id, data);
      reset(data);
      setIsEditing(false);
      setEditSidebarOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : FEEDBACK_MESSAGES.sidebar.memberUpdateToast;
      setSubmitError(message);
      showToast({ status: 'error', title: FEEDBACK_MESSAGES.sidebar.memberUpdateToast, message });
    }
  };

  const onInvalidSubmit = (invalidErrors: unknown) => {
    setSubmitError(getFormErrorMessage(invalidErrors as Record<string, unknown>));
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
    setSubmitError(null);
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
    setSubmitError(null);
    setEditSidebarOpen(true);
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
    setSubmitError(null);
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
      <div className="team-detail flex flex-1 flex-col gap-4 md:gap-7">
        <Breadcrumb
          previousLink="/admin/team"
          previousPageName="Team"
          currentPageName={member.name}
          action={
            canEditMember ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={openEdit}
                iconLeft={<Pencil size={14} />}
                className="hidden md:inline-flex"
              >
                Edit member
              </Button>
            ) : null
          }
        />

        <TeamDetailCard member={member} projects={memberProjects} tasks={assignedTasks} />

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
                  <TeamDetailTaskRow key={task.id} task={task} project={project} />
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
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="team-detail-sidebar-form flex min-h-0 flex-1 flex-col">
          <div className="team-detail-sidebar-fields flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <FormSidebarError title={FEEDBACK_MESSAGES.sidebar.memberUpdateDetailFailed} message={submitError} />

            <FormField label="Full Name" required error={errors.name?.message}>
              <TextInput
                {...register('name', { required: 'Name is required' })}
                hasError={!!errors.name}
              />
            </FormField>

            <FormField label="Role" required error={errors.role?.message}>
              <TextInput
                {...register('role', { required: 'Role is required' })}
                hasError={!!errors.role}
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
              <TextInput
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                hasError={!!errors.email}
              />
            </FormField>
          </div>

          <FormSidebarActions
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isDirty={isDirty || hasMemberChanges}
            submitLabel="Save"
          />
        </form>
      </FormSidebar>
    </DashboardLayout>
  );
}
