import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Briefcase, UserCheck } from 'lucide-react';
import Layout from '../components/common/layout/layout';
import Modal from '../components/common/modal/modal';
import TableData, { RowActions, type Column } from '../components/common/table/table';
import TableToolbar, { type TabItem } from '../components/common/table-tab/table-tab';
import FormSidebar, { FormSidebarFooter } from '../components/common/form-sidebar/form-sidebar';
import FormField, { inputCls } from '../components/common/form-field/form-field';
import Fab from '../components/common/button-fab/button-fab';
import { useTeamStore } from '../store/team';
import { useUIStore } from '../store/ui';
import { getMemberColors } from '../data/team';
import type { TeamMember, TeamProject } from '../data/team';
import StatusIcon from '../components/common/status-icon/status-icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRow = TeamMember & { project?: TeamProject };
type FilterKey = 'all' | 'assigned' | 'unassigned';

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

// ─── Member avatar cell ───────────────────────────────────────────────────────

function TeamMember({ member }: { member: TeamMember }) {
  const colors = getMemberColors(member.id);
  return (
    <div className="flex items-center gap-3 min-w-0">
      <StatusIcon status={member.assignedProjectId ? 'active' : 'inactive'} />
      <span className="font-normal text-gray-900 truncate">{member.name}</span>
    </div>
  );
}

// ─── Team Page ────────────────────────────────────────────────────────────────

export default function Team() {
  const { members, projects, addMember, updateMember, removeMember, assignMember } = useTeamStore();
  const { searchQuery } = useUIStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');
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
    return list.map(m => ({ ...m, project: projects.find(p => p.id === m.assignedProjectId) }));
  }, [members, projects, activeTab, searchQuery]);

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



  const columns: Column<MemberRow>[] = [
    {
      key: 'name',
      label: 'Name',
      render: row => <TeamMember member={row} />
    },
    {
      key: 'email',
      label: 'Email',
      hideBelow: 'md',
      render: row => <span className="text-sm text-gray-900">{row.email || '—'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      hideBelow: 'sm',
      render: row => <span className="text-sm text-gray-900">{row.role}</span>,
    },
    {
      key: 'project',
      label: 'Project',
      render: row =>
        row.project ? (
          <div>
            <span className="text-sm text-gray-900">{row.project.name}</span>
          </div>
        ) : (
          <div>
            <span className="text-sm text-gray-400">Unassigned</span>
          </div>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      width: 'w-10 md:w-auto',
      render: row => (
        <RowActions
          actions={[
            { label: 'Edit member', icon: <Pencil size={14} />, onClick: () => openEdit(row) },
            { label: 'Assign project', icon: <Briefcase size={14} />, onClick: () => setAssigningMember(row) },
            { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => handleDelete(row), variant: 'danger' },
          ]}
        />
      ),
    },
  ];

  return (
    <Layout title="Team" fullHeight>
      <div className="flex-1 min-h-0 flex flex-col gap-3 w-full mx-auto pb-6">
        <TableToolbar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={key => setActiveTab(key as FilterKey)}
          actionLabel="Add Member"
          onAction={openAdd}
        />

        <div className="flex-1 min-h-0">
          <TableData<MemberRow>
            columns={columns}
            data={tableData}
            className="h-full"
            emptyMessage={searchQuery ? `No members match "${searchQuery}".` : 'No team members yet.'}
            onRowClick={openEdit}
          />
        </div>

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
            <button type="button" onClick={() => setSidebarOpen(false)}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50">
              {editingMember ? 'Save' : 'Add Member'}
            </button>
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
