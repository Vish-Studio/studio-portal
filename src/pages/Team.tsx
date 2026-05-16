import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Briefcase, UserCheck } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import Modal from '../components/common/modal/modal';
import { RowActionsMenu } from '../components/common/table/table';
import TableTab, { type TabItem } from '../components/common/table-tab/table-tab';
import FormSidebar, { FormSidebarFooter } from '../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../components/common/form-field/form-field';
import Select from '../components/common/select/select';
import Option from '../components/common/select/option';
import Fab from '../components/common/button-fab/button-fab';
import Button from '../components/common/button/button';
import { useAuthStore } from '../store/auth';
import { useTeamStore } from '../store/team';
import { useUIStore } from '../store/ui';
import { withoutCurrentTeamMember } from '../lib/team-member-visibility';
import { getMemberColors } from '../data/team';
import type { TeamAccessRole, TeamMember, TeamProject } from '../data/team';
import StatusIcon from '../components/common/status-icon/status-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRow = TeamMember & { project?: TeamProject };
type FilterKey = 'all' | 'assigned' | 'unassigned';
type SortKey = 'name' | 'role';

interface MemberFormValues {
  name: string;
  role: string;
  accessRole: TeamAccessRole;
  email: string;
}

// ─── Assign Project Modal ──────────────────────────────────────────────────────

interface AssignModalProps {
  member: TeamMember;
  projects: TeamProject[];
  onClose: () => void;
  onAssign: (memberId: string, projectId: string | null) => Promise<void>;
}

function AssignModal({ member, projects, onClose, onAssign }: AssignModalProps) {
  const colors = getMemberColors(member.id);
  return (
    <Modal
      variant="dialog"
      size="sm"
      onClose={onClose}
      title="Assign Project"
      description={member.name}
      headerIcon={
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center text-white font-bold text-base shrink-0`}>
          {member.name.charAt(0)}
        </div>
      }
    >
      <div className="px-4 pb-4 flex flex-col gap-1.5 max-h-80 overflow-y-auto">
        {projects.map(project => {
          const isSelected = project.id === member.assignedProjectId;
          return (
            <button
              key={project.id}
              onClick={() => { onAssign(member.id, project.id); onClose(); }}
              className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center gap-3
                ${isSelected ? 'bg-black border-black' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <Briefcase size={14} className={isSelected ? 'text-white/50 shrink-0' : 'text-gray-400 shrink-0'} />
              <div className="min-w-0 flex-1">
                <p className={`type-card-title truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                <p className={`type-muted mt-0.5 truncate ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                  {project.client}{project.status === 'paused' && <span className="ml-1.5">· Paused</span>}
                </p>
              </div>
              {isSelected && <UserCheck size={14} className="text-white/70 shrink-0" />}
            </button>
          );
        })}
        <button
          onClick={() => { onAssign(member.id, null); onClose(); }}
          disabled={member.assignedProjectId === null}
          className="w-full mt-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 border border-dashed border-gray-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          Remove assignment
        </button>
      </div>
    </Modal>
  );
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
  const visibleMembers = useMemo(
    () => withoutCurrentTeamMember(members, profile),
    [members, profile],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemberFormValues>({
    defaultValues: { name: '', role: '', accessRole: 'freelancer', email: '' },
  });

  useEffect(() => subscribeMembers(), [subscribeMembers]);

  const tabCounts = useMemo(() => ({
    all: visibleMembers.length,
    assigned: visibleMembers.filter(m => m.assignedProjectId !== null).length,
    unassigned: visibleMembers.filter(m => m.assignedProjectId === null).length,
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
    reset({ name: '', role: '', accessRole: 'freelancer', email: '' });
    setSidebarOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    if (!canManageTeam || (!isSuperAdmin && member.accessRole === 'superadmin')) return;
    setEditingMember(member);
    reset({
      name: member.name,
      role: member.role,
      accessRole: member.accessRole ?? 'freelancer',
      email: member.email,
    });
    setSidebarOpen(true);
  };

  const onSubmit = async (data: MemberFormValues) => {
    if (!canManageTeam) return;
    if (!isSuperAdmin && data.accessRole === 'superadmin') {
      throw new Error('Only a superadmin can assign the superadmin role.');
    }

    if (editingMember) {
      await updateMember(editingMember.id, data);
    } else {
      await addMember({ assignedProjectId: null, ...data });
    }
    setSidebarOpen(false);
  };

  const handleDelete = async (member: TeamMember) => {
    if (confirm(`Remove ${member.name} from the team?`)) await removeMember(member.id);
  };

  return (
    <Layout title="Team">
      <div className="flex flex-col gap-3 w-full mx-auto py-6 md:py-10">
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
          <div className="flex flex-col gap-2">
            <div className="type-eyebrow hidden grid-cols-[minmax(220px,1fr)_minmax(160px,0.8fr)_minmax(180px,1fr)_32px] items-center gap-3 px-4 text-gray-400 md:grid">
              <span>Member</span>
              <span>Role</span>
              <span>Assignment</span>
              <span />
            </div>

            {tableData.map(member => {
              const colors = getMemberColors(member.id);
              const canEditMember = canManageTeam && (isSuperAdmin || member.accessRole !== 'superadmin');
              const canAssignMember = isSuperAdmin || member.accessRole !== 'superadmin';

              return (
                <div
                  key={member.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/team/${member.id}`)}
                  onKeyDown={event => { if (event.key === 'Enter') navigate(`/admin/team/${member.id}`); }}
                  className="grid cursor-pointer gap-3 rounded-[18px] border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 md:grid-cols-[minmax(220px,1fr)_minmax(160px,0.8fr)_minmax(180px,1fr)_32px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${colors.bg} text-xs font-bold text-white`}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="type-card-title truncate text-(--color-ink)">{member.name}</p>
                      <p className="type-muted truncate text-gray-400">{member.email || 'No email'}</p>
                    </div>
                  </div>

                  <p className="type-label truncate text-gray-600">{member.role}</p>

                  <div className="flex min-w-0 items-center gap-2">
                    <StatusIcon status={member.assignedProjectId ? 'active' : 'inactive'} />
                    <div className="min-w-0">
                      <p className="type-card-title truncate text-gray-800">
                        {member.project?.name ?? 'Unassigned'}
                      </p>
                      <p className="type-muted truncate text-gray-400">
                        {member.project?.client ?? 'Available for a project'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end" onClick={event => event.stopPropagation()}>
                    <RowActionsMenu
                      actions={[
                        ...(canEditMember
                          ? [{ label: 'Edit member', icon: <Pencil size={14} />, onClick: () => openEdit(member) }]
                          : []),
                        ...(canAssignMember
                          ? [{ label: 'Assign project', icon: <Briefcase size={14} />, onClick: () => setAssigningMember(member) }]
                          : []),
                        ...(isSuperAdmin
                          ? [{ label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(member), variant: 'danger' as const }]
                          : []),
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Mobile FAB */}
      {canManageTeam && <Fab onClick={openAdd} ariaLabel="Add team member" />}

      {/* Member Form Sidebar */}
      <FormSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingMember ? 'Edit Member' : 'Add Team Member'}
        description={editingMember ? `Editing ${editingMember.name}` : 'New members start unassigned.'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <FormField label="Full Name" required error={errors.name?.message}>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g. Jordan Clarke"
                className={inputCls(!!errors.name)}
              />
            </FormField>
            <FormField label="Role" required error={errors.role?.message}>
              <input
                {...register('role', { required: 'Role is required' })}
                placeholder="e.g. Frontend Developer"
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
            <FormField label="Email" error={errors.email?.message}>
              <input
                {...register('email', {
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                type="email"
                placeholder="team@studio.com"
                className={inputCls(!!errors.email)}
              />
            </FormField>
          </div>
          <FormSidebarFooter>
            <Button type="button" onClick={() => setSidebarOpen(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editingMember ? 'Save' : 'Add Member'}
            </Button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>

      {/* Assign Project Modal */}
      {assigningMember && (
        <AssignModal
          member={assigningMember}
          projects={projects}
          onClose={() => setAssigningMember(null)}
          onAssign={assignMember}
        />
      )}
    </Layout>
  );
}
