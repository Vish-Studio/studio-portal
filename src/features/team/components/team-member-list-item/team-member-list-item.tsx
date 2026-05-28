import { Briefcase, Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { CardListItem, formatRecordDate, RecordMeta, StatusBadge } from '@/src/shared/components';
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
  const assigned = Boolean(member.assignedProjectId);
  const workStatus = member.status === 'fired' ? 'Fired' : member.status === 'on-leave' ? 'On leave' : 'Working';

  return (
    <CardListItem
      item={member}
      onOpen={onOpen}
      title={member.name}
      subTitle={<p className="team-member-list-item-email type-muted truncate text-gray-400">{member.email || 'No email'}</p>}
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
      className="team-member-list-item flex min-h-[168px] flex-col rounded-[18px] border border-gray-200 bg-white text-left transition-colors hover:bg-gray-50"
      headerClassName="team-member-list-item-header"
      contentClassName="team-member-list-item-content"
      footerClassName="team-member-list-item-footer"
      footer={(
        <>
          <div className="team-member-list-item-footer-meta flex min-w-0 items-center gap-2">
            <StatusBadge label={assigned ? 'Assigned' : 'Available'} variant={assigned ? 'green' : 'gray'} />
          </div>
          <RecordMeta className="team-member-list-item-created shrink-0" items={[{ label: formatRecordDate(member.createdAt?.toDate?.()), icon: 'event' }]} />
        </>
      )}
    >
        <div className="team-member-list-item-role-row mb-3 flex min-w-0 flex-wrap items-center gap-2">
          <span className="team-member-list-item-role-chip type-count max-w-[180px] truncate rounded-lg bg-gray-100 px-2 py-1 text-gray-500">
            {member.role || 'No role'}
          </span>
          <span className={`team-member-list-item-access type-count rounded-lg px-2 py-1 ${member.accessRole === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
            {member.accessRole ?? 'freelancer'}
          </span>
          <span className={`team-member-list-item-status type-count rounded-lg px-2 py-1 ${
            member.status === 'fired' ? 'bg-red-50 text-red-600' : member.status === 'on-leave' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
          }`}>
            {workStatus}
          </span>
          {member.phone && (
            <span className="team-member-list-item-phone type-count rounded-lg bg-gray-100 px-2 py-1 text-gray-500">
              {member.phone}
            </span>
          )}
          {(member.salaryAmount ?? 0) > 0 && (
            <span className="team-member-list-item-salary type-count rounded-lg bg-(--color-accent-lime) px-2 py-1 text-(--color-ink)">
              ${member.salaryAmount?.toLocaleString()} / {member.salaryType === 'per-project' ? 'project' : 'month'}
            </span>
          )}
        </div>
        <div className="team-member-list-item-assignment flex min-w-0 items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2.5">
          <StatusIcon status={assigned ? 'active' : 'inactive'} />
          <div className="team-member-list-item-assignment-copy min-w-0">
            <p className="team-member-list-item-project type-card-title truncate text-gray-800">
              {member.project?.name ?? 'Unassigned'}
            </p>
            <p className="team-member-list-item-client type-muted truncate text-gray-400">
              {member.project?.client ?? 'Available for a project'}
            </p>
          </div>
        </div>
    </CardListItem>
  );
}
