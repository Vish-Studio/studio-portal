import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Briefcase, UserCheck } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import Modal from '../components/common/modal/modal';
import { RowActionsMenu } from '../components/common/table/table';
import TableTab, { type TabItem } from '../components/common/table-tab/table-tab';
import FormSidebar, { FormSidebarFooter } from '../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../components/common/form-field/form-field';
import Fab from '../components/common/button-fab/button-fab';
import Button from '../components/common/button/button';
import { useTeamStore } from '../store/team';
import { useUIStore } from '../store/ui';
import { getMemberColors } from '../data/team';
import type { TeamMember, TeamProject } from '../data/team';
import StatusIcon from '../components/common/status-icon/status-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRow = TeamMember & { project?: TeamProject };
type FilterKey = 'all' | 'assigned' | 'unassigned';
type SortKey = 'name' | 'role';

interface MemberFormValues {
  name: string;
  role: string;
  email: string;
}

// ─── Assign Project Modal ──────────────────────────────────────────────────────

interface AssignModalProps {
  member: TeamMember;
  projects: TeamProject[];
  onClose: () => void;
  onAssign: (memberId: string, projectId: string | null) => void;
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
                <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
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
  const { members, projects, addMember, updateMember, removeMember, assignMember } = useTeamStore();
  const { searchQuery } = useUIStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [assigningMember, setAssigningMember] = useState<TeamMember | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemberFormValues>({
    defaultValues: { name: '', role: '', email: '' },
  });

  const tabCounts = useMemo(() => ({
    all: members.length,
    assigned: members.filter(m => m.assignedProjectId !== null).length,
    unassigned: members.filter(m => m.assignedProjectId === null).length,
  }), [members]);

  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'assigned', label: 'Assigned', count: tabCounts.assigned },
    { key: 'unassigned', label: 'Unassigned', count: tabCounts.unassigned },
  ];

  const tableData: MemberRow[] = useMemo(() => {
    let list = members;
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
  }, [members, projects, activeTab, searchQuery, sortKey, sortDirection]);

  const openAdd = () => {
    setEditingMember(null);
    reset({ name: '', role: '', email: '' });
    setSidebarOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    reset({ name: member.name, role: member.role, email: member.email });
    setSidebarOpen(true);
  };

  const onSubmit = (data: MemberFormValues) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      addMember({ id: 'm_' + Date.now(), assignedProjectId: null, ...data });
    }
    setSidebarOpen(false);
  };

  const handleDelete = (member: TeamMember) => {
    if (confirm(`Remove ${member.name} from the team?`)) removeMember(member.id);
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
            onAction={openAdd}
          />
        </div>

        {tableData.length === 0 ? (
          <div className="rounded-[18px] border border-gray-100 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-gray-500">
              {searchQuery ? `No members match "${searchQuery}".` : 'No team members yet.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[minmax(220px,1fr)_minmax(160px,0.8fr)_minmax(180px,1fr)_32px] items-center gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
              <span>Member</span>
              <span>Role</span>
              <span>Assignment</span>
              <span />
            </div>

            {tableData.map(member => {
              const colors = getMemberColors(member.id);

              return (
                <div
                  key={member.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEdit(member)}
                  onKeyDown={event => { if (event.key === 'Enter') openEdit(member); }}
                  className="grid cursor-pointer gap-3 rounded-[18px] border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 md:grid-cols-[minmax(220px,1fr)_minmax(160px,0.8fr)_minmax(180px,1fr)_32px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${colors.bg} text-sm font-bold text-white`}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-(--color-ink)">{member.name}</p>
                      <p className="truncate text-xs font-medium text-gray-400">{member.email || 'No email'}</p>
                    </div>
                  </div>

                  <p className="truncate text-sm font-semibold text-gray-600">{member.role}</p>

                  <div className="flex min-w-0 items-center gap-2">
                    <StatusIcon status={member.assignedProjectId ? 'active' : 'inactive'} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {member.project?.name ?? 'Unassigned'}
                      </p>
                      <p className="truncate text-xs font-medium text-gray-400">
                        {member.project?.client ?? 'Available for a project'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end" onClick={event => event.stopPropagation()}>
                    <RowActionsMenu
                      actions={[
                        { label: 'Edit member', icon: <Pencil size={14} />, onClick: () => openEdit(member) },
                        { label: 'Assign project', icon: <Briefcase size={14} />, onClick: () => setAssigningMember(member) },
                        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(member), variant: 'danger' },
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
      <Fab onClick={openAdd} ariaLabel="Add team member" />

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
                autoFocus
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
