import { Briefcase, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { RowActionsMenu } from '@/src/shared/components';
import StatusIcon from '@/src/shared/components/status-icon/status-icon';
import { getMemberColors, type TeamMember, type TeamProject } from '../../types';

export type TeamMemberListItemData = TeamMember & { project?: TeamProject };

interface TeamMemberListItemProps {
  member: TeamMemberListItemData;
  canEdit: boolean;
  canAssign: boolean;
  canDelete: boolean;
  onOpen: (member: TeamMemberListItemData) => void;
  onEdit: (member: TeamMemberListItemData) => void;
  onAssign: (member: TeamMemberListItemData) => void;
  onDelete: (member: TeamMemberListItemData) => void;
}

export default function TeamMemberListItem({
  member,
  canEdit,
  canAssign,
  canDelete,
  onOpen,
  onEdit,
  onAssign,
  onDelete,
}: TeamMemberListItemProps) {
  const colors = getMemberColors(member.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(member)}
      onKeyDown={event => { if (event.key === 'Enter') onOpen(member); }}
      className="team-member-list-item grid cursor-pointer gap-3 rounded-[18px] border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 lg:grid-cols-[minmax(220px,1fr)_minmax(160px,0.8fr)_minmax(180px,1fr)_32px] lg:items-center"
    >
      <div className="team-member-list-item-profile flex min-w-0 items-center gap-3">
        <div className={`team-member-list-item-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${colors.bg} text-xs font-bold text-white`}>
          {member.name.charAt(0)}
        </div>
        <div className="team-member-list-item-copy min-w-0">
          <p className="team-member-list-item-name type-card-title truncate text-(--color-ink)">{member.name}</p>
          <p className="team-member-list-item-email type-muted truncate text-gray-400">{member.email || 'No email'}</p>
        </div>
      </div>

      <p className="team-member-list-item-role type-label truncate text-gray-600">{member.role}</p>

      <div className="team-member-list-item-assignment flex min-w-0 items-center gap-2">
        <StatusIcon status={member.assignedProjectId ? 'active' : 'inactive'} />
        <div className="team-member-list-item-assignment-copy min-w-0">
          <p className="team-member-list-item-project type-card-title truncate text-gray-800">
            {member.project?.name ?? 'Unassigned'}
          </p>
          <p className="team-member-list-item-client type-muted truncate text-gray-400">
            {member.project?.client ?? 'Available for a project'}
          </p>
        </div>
      </div>

      <div className="team-member-list-item-actions flex justify-end" onClick={event => event.stopPropagation()}>
        <RowActionsMenu
          actions={[
            ...(canEdit
              ? [{ label: 'Edit member', icon: <Pencil size={14} />, onClick: () => onEdit(member) }]
              : []),
            ...(canAssign
              ? [{ label: 'Assign project', icon: <Briefcase size={14} />, onClick: () => onAssign(member) }]
              : []),
            ...(canDelete
              ? [{ label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete(member), variant: 'danger' as const }]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
