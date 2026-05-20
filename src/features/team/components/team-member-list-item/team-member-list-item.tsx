import { Briefcase, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { ListItemRow } from '@/src/shared/components';
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
    <ListItemRow
      item={member}
      onOpen={onOpen}
      title={member.name}
      subtitle={<p className="team-member-list-item-email type-muted truncate text-gray-400">{member.email || 'No email'}</p>}
      icon={(
        <div className={`team-member-list-item-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${colors.bg} text-xs font-bold text-white`}>
          {member.name.charAt(0)}
        </div>
      )}
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
      secondary={<p className="team-member-list-item-role type-label truncate text-gray-600">{member.role}</p>}
      tertiary={(
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
      )}
      className="team-member-list-item"
      gridClassName="lg:grid-cols-[minmax(240px,1fr)_minmax(180px,0.7fr)_minmax(220px,1fr)_120px_32px]"
    />
  );
}
