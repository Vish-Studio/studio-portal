import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Briefcase, UserCheck } from 'lucide-react';
import Layout from '../components/layout/layout';
import Modal from '../components/modal/modal';
import DataTable, { RowActionsMenu, type Column } from '../components/table/table';
import { useTeamStore } from '../store/team';
import { getMemberColors } from '../data/team';
import type { TeamMember, TeamProject } from '../data/team';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRow = TeamMember & { project?: TeamProject };

type FilterTab = 'All' | 'Assigned' | 'Unassigned';

// ─── Member Form Modal (Add + Edit) ───────────────────────────────────────────

interface MemberFormModalProps {
  initial?: TeamMember;
  onClose: () => void;
  onSave: (data: Pick<TeamMember, 'name' | 'role' | 'email'>) => void;
}

function MemberFormModal({ initial, onClose, onSave }: MemberFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const isEdit = !!initial;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onSave({ name: name.trim(), role: role.trim(), email: email.trim() });
  };

  return (
    <Modal
      variant="dialog"
      size="md"
      onClose={onClose}
      title={isEdit ? 'Edit Member' : 'Add Team Member'}
      description={isEdit ? `Editing ${initial!.name}` : 'New members start unassigned.'}
    >
      <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            placeholder="e.g. Jordan Clarke"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Role *
          </label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            placeholder="e.g. Frontend Developer"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="team@studio.com"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !role.trim()}
            className="flex-1 py-3 bg-black text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            {isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
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
                ${isSelected
                  ? 'bg-black border-black'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <Briefcase size={14} className={isSelected ? 'text-white/50 shrink-0' : 'text-gray-400 shrink-0'} />
              <div className="min-w-0 flex-1">
                <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {project.name}
                </p>
                <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                  {project.client}
                  {project.status === 'paused' && <span className="ml-1.5">· Paused</span>}
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

// ─── Avatar cell ──────────────────────────────────────────────────────────────

function MemberAvatar({ member }: { member: TeamMember }) {
  const colors = getMemberColors(member.id);
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
        {member.name.charAt(0)}
      </div>
      <span className="font-medium text-gray-900 truncate">{member.name}</span>
    </div>
  );
}

// ─── Filter tab ───────────────────────────────────────────────────────────────

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: FilterTab;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${active
          ? 'bg-black text-white'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
    >
      {label}
      <span
        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
          }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Team Page ─────────────────────────────────────────────────────────────────

export default function Team() {
  const { members, projects, addMember, updateMember, removeMember, assignMember } = useTeamStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [assigningMember, setAssigningMember] = useState<TeamMember | null>(null);

  const tabCounts = useMemo(() => ({
    All: members.length,
    Assigned: members.filter(m => m.assignedProjectId !== null).length,
    Unassigned: members.filter(m => m.assignedProjectId === null).length,
  }), [members]);

  const tableData: MemberRow[] = useMemo(() => {
    let list = members;

    if (activeTab === 'Assigned') list = list.filter(m => m.assignedProjectId !== null);
    if (activeTab === 'Unassigned') list = list.filter(m => m.assignedProjectId === null);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
      );
    }

    return list.map(m => ({
      ...m,
      project: projects.find(p => p.id === m.assignedProjectId),
    }));
  }, [members, projects, activeTab, search]);

  const handleAdd = ({ name, role, email }: Pick<TeamMember, 'name' | 'role' | 'email'>) => {
    addMember({ id: 'm_' + Date.now(), name, role, email, assignedProjectId: null });
    setShowAddModal(false);
  };

  const handleEdit = ({ name, role, email }: Pick<TeamMember, 'name' | 'role' | 'email'>) => {
    if (!editingMember) return;
    updateMember(editingMember.id, { name, role, email });
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this team member?')) removeMember(id);
  };

  const columns: Column<MemberRow>[] = [
    {
      key: 'name',
      label: 'Name',
      render: row => <MemberAvatar member={row} />,
    },
    {
      key: 'email',
      label: 'Email',
      hideBelow: 'md',
      render: row => (
        <span className="text-gray-500 text-sm">{row.email || '—'}</span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      hideBelow: 'sm',
      render: row => (
        <span className="text-gray-700 text-sm font-medium">{row.role}</span>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      render: row =>
        row.project ? (
          <button
            onClick={e => { e.stopPropagation(); setAssigningMember(row); }}
            className="flex items-center gap-1.5 text-sm text-gray-700 font-medium hover:text-black transition-colors group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            {row.project.name}
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); setAssigningMember(row); }}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-black transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
            Unassigned
          </button>
        ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      width: 'w-10',
      render: row => (
        <RowActionsMenu
          actions={[
            {
              label: 'Edit member',
              icon: <Pencil size={14} />,
              onClick: () => setEditingMember(row),
            },
            {
              label: 'Assign project',
              icon: <Briefcase size={14} />,
              onClick: () => setAssigningMember(row),
            },
            {
              label: 'Delete',
              icon: <Trash2 size={14} />,
              onClick: () => handleDelete(row.id),
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Layout title="Team">
      <div className="flex flex-col h-full gap-5">
        {/* ── Toolbar: tabs + search ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            {(['All', 'Assigned', 'Unassigned'] as FilterTab[]).map(tab => (
              <FilterTab
                key={tab}
                label={tab}
                count={tabCounts[tab]}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {/* Add new member */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shrink-0"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <DataTable<MemberRow>
            columns={columns}
            data={tableData}
            emptyMessage={
              search ? `No members match "${search}".` : 'No team members yet.'
            }
          />
        </div>

      </div>

      {/* ── Modals ── */}
      {showAddModal && (
        <MemberFormModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}

      {editingMember && (
        <MemberFormModal
          initial={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleEdit}
        />
      )}

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
