import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, UserRoundCheck, UserRoundX, Users } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import FormSidebar, { FormSidebarActions } from '@/src/shared/components/form-sidebar/form-sidebar';
import Fab from '@/src/shared/components/button-fab/button-fab';
import { Button, Checkbox, ConfirmDialog, FormField, Option, Select, TextInput } from '@/src/shared/components';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import { useAuthStore } from '@/src/features/auth';
import { useTeamStore } from '../stores/teamStore';
import { useUIStore } from '@/src/app/stores/uiStore';
import { withoutCurrentTeamMember } from '@/src/lib/team-member-visibility';
import type { TeamAccessRole, TeamMember } from '../types';
import TeamMemberListItem, { type TeamMemberListItemData } from '../components/team-member-list-item/team-member-list-item';
import AssignProjectModal from '../components/assign-project-modal/assign-project-modal';
import { generateTemporaryPassword } from '@/src/lib/temporary-password';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRow = TeamMemberListItemData;
type FilterKey = 'all' | 'assigned' | 'unassigned';
type SortKey = 'name' | 'role';

interface MemberFormValues {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
  generatePassword: boolean;
  temporaryPassword: string;
}

interface TemporaryAccess {
  name: string;
  email: string;
  temporaryPassword: string;
}

// ─── Team Page ────────────────────────────────────────────────────────────────

export default function Team() {
  const navigate = useNavigate();
  const {
    members,
    projects,
    loading,
    error,
    subscribeMembers,
    addMember,
    updateMember,
    removeMember,
    assignMember,
  } = useTeamStore();
  const { searchQuery } = useUIStore();
  const profile = useAuthStore(state => state.profile);
  const isSuperAdmin = profile?.role === 'superadmin';
  const canManageTeam = profile?.role === 'superadmin' || profile?.role === 'admin';
  const roleOptions = isSuperAdmin
    ? (['freelancer', 'admin', 'superadmin'] as TeamAccessRole[])
    : (['freelancer', 'admin'] as TeamAccessRole[]);

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [assigningMember, setAssigningMember] = useState<TeamMember | null>(null);
  const [deleteMember, setDeleteMember] = useState<TeamMember | null>(null);
  const [temporaryAccess, setTemporaryAccess] = useState<TemporaryAccess | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const visibleMembers = useMemo(
    () => withoutCurrentTeamMember(members, profile),
    [members, profile],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<MemberFormValues>({
    defaultValues: {
      name: '',
      role: '',
      accessRole: 'freelancer',
      email: '',
      generatePassword: true,
      temporaryPassword: generateTemporaryPassword(),
    },
  });
  const generatePassword = watch('generatePassword');

  useEffect(() => subscribeMembers(), [subscribeMembers]);

  const tabCounts = useMemo(() => ({
    all: visibleMembers.length,
    assigned: visibleMembers.filter(m => m.assignedProjectId !== null).length,
    unassigned: visibleMembers.filter(m => m.assignedProjectId === null).length,
  }), [visibleMembers]);

  const accessCounts = useMemo(() => ({
    admins: visibleMembers.filter(m => m.accessRole === 'admin' || m.accessRole === 'superadmin').length,
    freelancers: visibleMembers.filter(m => m.accessRole === 'freelancer' || m.accessRole === 'team').length,
  }), [visibleMembers]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'assigned', label: 'Assigned', count: tabCounts.assigned },
    { key: 'unassigned', label: 'Unassigned', count: tabCounts.unassigned },
  ];

  const tableData: MemberRow[] = useMemo(() => {
    let list = visibleMembers;
    if (activeTab === 'assigned') list = list.filter(m => m.assignedProjectId !== null);
    if (activeTab === 'unassigned') list = list.filter(m => m.assignedProjectId === null);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
      );
    }
    return list
      .map(m => ({ ...m, project: projects.find(p => p.id === m.assignedProjectId) }))
      .sort((a, b) => {
        const aVal = sortKey === 'role' ? a.role : a.name;
        const bVal = sortKey === 'role' ? b.role : b.name;
        const result = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
        return sortDirection === 'asc' ? result : -result;
      });
  }, [visibleMembers, projects, activeTab, searchQuery, sortKey, sortDirection]);

  const openAdd = () => {
    if (!canManageTeam) return;
    setEditingMember(null);
    setTemporaryAccess(null);
    setSubmitError(null);
    reset({
      name: '',
      role: '',
      accessRole: 'freelancer',
      email: '',
      generatePassword: true,
      temporaryPassword: generateTemporaryPassword(),
    });
    setSidebarOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    if (!canManageTeam || (!isSuperAdmin && member.accessRole === 'superadmin')) return;
    setEditingMember(member);
    setTemporaryAccess(null);
    setSubmitError(null);
    reset({
      name: member.name,
      role: member.role,
      accessRole: member.accessRole ?? 'freelancer',
      email: member.email,
      generatePassword: false,
      temporaryPassword: '',
    });
    setSidebarOpen(true);
  };

  const onSubmit = async (data: MemberFormValues) => {
    if (!canManageTeam) return;
    if (!isSuperAdmin && data.accessRole === 'superadmin') {
      setSubmitError('Only a superadmin can assign the superadmin role.');
      return;
    }
    setSubmitError(null);
    try {
      if (editingMember) {
        await updateMember(editingMember.id, data);
        setSidebarOpen(false);
      } else {
        const result = await addMember({ assignedProjectId: null, ...data });
        if (result) {
          setTemporaryAccess({
            name: data.name,
            email: result.email,
            temporaryPassword: result.temporaryPassword,
          });
          reset({
            name: '',
            role: '',
            accessRole: 'freelancer',
            email: '',
            generatePassword: true,
            temporaryPassword: generateTemporaryPassword(),
          });
        }
      }
    } catch (err: unknown) {
      setSubmitError((err as Error).message ?? 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteMember) return;
    await removeMember(deleteMember.id);
    setDeleteMember(null);
  };

  return (
    <DashboardLayout title="Team">
      <div className="flex flex-col gap-3 w-full mx-auto py-6 md:py-10">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            size="sm"
            variant="lime"
            icon={<Users size={16} />}
            label="Team Members"
            value={tabCounts.all}
            badge={`${accessCounts.freelancers} freelancer${accessCounts.freelancers !== 1 ? 's' : ''}`}
            badgeLabel="delivery team"
          />
          <StatCard
            size="sm"
            variant="surface"
            icon={<UserRoundCheck size={16} />}
            label="Assigned"
            value={tabCounts.assigned}
            badge={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
            badgeLabel="available to assign"
          />
          <StatCard
            size="sm"
            variant="white"
            icon={<UserRoundX size={16} />}
            label="Available"
            value={tabCounts.unassigned}
            badge={tabCounts.unassigned > 0 ? 'Ready' : 'Fully assigned'}
            badgeLabel="unassigned members"
          />
          <StatCard
            size="sm"
            variant="dark"
            icon={<ShieldCheck size={16} />}
            label="Admin Access"
            value={accessCounts.admins}
            badge={isSuperAdmin ? 'Full control' : 'Limited'}
            badgeLabel="role access"
          />
        </div>

        <div className="sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as FilterKey)}
            sortValue={sortKey}
            sortOptions={[
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
            ]}
            onSortChange={key => setSortKey(key as SortKey)}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            actionLabel="Add Member"
            onAction={canManageTeam ? openAdd : undefined}
          />
        </div>

        {error && (
          <div className="team-error rounded-[16px] border border-red-100 bg-red-50 px-4 py-3">
            <p className="type-label text-red-600">{error}</p>
          </div>
        )}

        {loading && tableData.length === 0 ? (
          <div className="team-loading rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="type-card-title text-gray-500">Loading team members...</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="type-card-title text-gray-500">
              {searchQuery ? `No members match "${searchQuery}".` : 'No team members yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tableData.map(member => (
              <TeamMemberListItem
                key={member.id}
                member={member}
                canEdit={canManageTeam && (isSuperAdmin || member.accessRole !== 'superadmin')}
                canAssign={isSuperAdmin || member.accessRole !== 'superadmin'}
                canDelete={isSuperAdmin}
                onOpen={item => navigate(`/admin/team/${item.id}`)}
                onEdit={openEdit}
                onAssign={setAssigningMember}
                onDelete={setDeleteMember}
              />
            ))}
          </div>
        )}

      </div>

      {/* Mobile FAB */}
      {canManageTeam && <Fab onClick={openAdd} ariaLabel="Add team member" />}

      {/* Member Form Sidebar */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setTemporaryAccess(null);
        }}
        title={editingMember ? 'Edit Member' : 'Add Team Member'}
        description={editingMember ? `Editing ${editingMember.name}` : 'New members start unassigned.'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {submitError && (
              <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3">
                <p className="type-label font-semibold text-red-700">Failed to create member</p>
                <p className="type-muted mt-1 text-red-600">{submitError}</p>
              </div>
            )}

            {temporaryAccess ? (
              <div className="team-temporary-access rounded-[18px] border border-green-100 bg-green-50 p-4">
                <p className="type-card-title text-green-700">Team login created</p>
                <p className="type-muted mt-1 text-green-700/70">
                  Share this temporary password with {temporaryAccess.name}. They can sign in and change it from settings.
                </p>
                <div className="team-temporary-access-details mt-4 rounded-[14px] bg-white p-3">
                  <p className="type-label text-gray-400">Email</p>
                  <p className="type-card-title mt-1 break-all text-(--color-ink)">{temporaryAccess.email}</p>
                  <p className="type-label mt-3 text-gray-400">Temporary password</p>
                  <p className="type-card-title mt-1 break-all text-(--color-ink)">{temporaryAccess.temporaryPassword}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(`${temporaryAccess.email}\n${temporaryAccess.temporaryPassword}`)}
                  className="team-temporary-access-copy mt-3 w-full"
                >
                  Copy login details
                </Button>
              </div>
            ) : null}

            <FormField label="Full Name" required error={errors.name?.message}>
              <TextInput
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g. Jordan Clarke"
                hasError={!!errors.name}
              />
            </FormField>
            <FormField label="Job Title" required error={errors.role?.message}>
              <TextInput
                {...register('role', { required: 'Job title is required' })}
                placeholder="e.g. Frontend Developer"
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
            <FormField label="Email" error={errors.email?.message}>
              <TextInput
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                type="email"
                placeholder="team@studio.com"
                hasError={!!errors.email}
              />
            </FormField>

            {!editingMember ? (
              <div className="team-password-section rounded-[18px] border border-gray-100 bg-(--color-surface-alt) p-4">
                <label className="team-password-toggle flex items-center gap-3">
                  <Checkbox {...register('generatePassword')} />
                  <span className="type-card-title text-(--color-ink)">Generate temporary password</span>
                </label>
                <div className="team-password-field mt-4">
                  <FormField label="Temporary Password" required error={errors.temporaryPassword?.message}>
                    <div className="team-password-row flex gap-2">
                      <TextInput
                        {...register('temporaryPassword', {
                          required: 'Temporary password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                        type="text"
                        readOnly={generatePassword}
                        hasError={!!errors.temporaryPassword}
                        className={generatePassword ? 'bg-white text-gray-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setValue('temporaryPassword', generateTemporaryPassword(), { shouldDirty: true, shouldValidate: true })}
                        className="team-password-generate"
                      >
                        Generate
                      </Button>
                    </div>
                  </FormField>
                </div>
              </div>
            ) : null}
          </div>
          <FormSidebarActions
            onCancel={() => setSidebarOpen(false)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            submitLabel={editingMember ? 'Save' : 'Add Member'}
          />
        </form>
      </FormSidebar>

      {/* Assign Project Modal */}
      {assigningMember && (
        <AssignProjectModal
          member={assigningMember}
          projects={projects}
          onClose={() => setAssigningMember(null)}
          onAssign={assignMember}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteMember}
        title="Remove team member?"
        message={deleteMember ? `Remove ${deleteMember.name} from the team? This cannot be undone.` : ''}
        confirmLabel="Remove Member"
        onConfirm={handleDelete}
        onCancel={() => setDeleteMember(null)}
      />
    </DashboardLayout>
  );
}
