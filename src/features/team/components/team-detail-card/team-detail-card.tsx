import { FunctionComponent } from 'react';
import { Mail, Phone } from '@/src/shared/components/material-icon/material-lucide-icons';
import { format } from 'date-fns';
import { DETAIL_COVER_IMAGES, DetailHeroCard, MaterialIcon } from '@/src/shared/components';
import { getMemberColors, type TeamMember } from '../../types';

interface TeamDetailCardProps {
  className?: string;
  member: TeamMember;
}

const formatOnlineStatus = (member: TeamMember) => {
  if (member.isOnline) return 'Online now';
  const value = member.lastOnlineAt;
  if (!value) return 'Last online unknown';
  if (typeof value === 'string') return value ? `Last online ${value.replace('T', ' ')}` : 'Last online unknown';
  if (typeof value === 'number') return `Last online ${format(value, 'MMM d, yyyy')}`;
  return `Last online ${format(value.toDate(), 'MMM d, yyyy')}`;
};

const TeamDetailCard: FunctionComponent<TeamDetailCardProps> = ({
  className = '',
  member,
}) => {
  const colors = getMemberColors(member.id);

  return (
    <DetailHeroCard className={`team-detail-card ${className}`}>
      <DetailHeroCard.Hero title={member.name} coverImage={DETAIL_COVER_IMAGES.team}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-start">
          <div className="min-w-0">
            <div className={`team-detail-card-avatar relative z-20 -mt-12 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white ${colors.bg} text-4xl font-black text-white`}>
              {member.name.charAt(0).toUpperCase()}
            </div>

            <p className="team-detail-card-role mt-1 max-w-full truncate text-sm font-semibold text-gray-500">{member.role}</p>
            <p className="team-detail-card-access mt-2 inline-flex self-start rounded-[6px] bg-gray-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {member.status === 'fired' ? 'fired' : member.status === 'on-leave' ? 'on leave' : member.accessRole ?? 'freelancer'}
            </p>
            <p className="team-detail-card-date mt-3 text-[11px] font-semibold text-gray-400">
              Team member since{' '}
              {member.createdAt?.toDate ? format(member.createdAt.toDate(), 'MMM d, yyyy') : '—'}
            </p>
          </div>

          <div className="grid gap-3 pt-6 sm:grid-cols-2 lg:pt-5">
            <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
              <span className="team-detail-card-email min-w-0 truncate text-sm font-semibold text-(--color-ink)">{member.email}</span>
            </DetailHeroCard.IconRow>
            {member.phone && (
              <DetailHeroCard.IconRow icon={<Phone size={12} className="text-gray-400" />}>
                <span className="team-detail-card-phone min-w-0 truncate text-sm font-semibold text-(--color-ink)">{member.phone}</span>
              </DetailHeroCard.IconRow>
            )}
            <DetailHeroCard.IconRow icon={<MaterialIcon name={member.isOnline ? 'radio_button_checked' : 'schedule'} size={12} className={member.isOnline ? 'text-green-500' : 'text-gray-400'} />}>
              <span className="team-detail-card-online min-w-0 truncate text-sm font-semibold text-(--color-ink)">{formatOnlineStatus(member)}</span>
            </DetailHeroCard.IconRow>
            <DetailHeroCard.IconRow icon={<MaterialIcon name="work_history" size={12} className="text-gray-400" />}>
              <span className="team-detail-card-status min-w-0 truncate text-sm font-semibold text-(--color-ink)">
                {member.status === 'fired' ? 'Fired' : member.status === 'on-leave' ? 'On leave' : 'Working'}
              </span>
            </DetailHeroCard.IconRow>
            {(member.salaryAmount ?? 0) > 0 && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="payments" size={12} className="text-gray-400" />}>
                <span className="team-detail-card-salary min-w-0 truncate text-sm font-semibold text-(--color-ink)">
                  ${member.salaryAmount?.toLocaleString()} / {member.salaryType === 'per-project' ? 'project' : 'month'}
                </span>
              </DetailHeroCard.IconRow>
            )}
          </div>
        </div>
      </DetailHeroCard.Hero>
    </DetailHeroCard>
  );
};

TeamDetailCard.displayName = 'TeamDetailCard';
export default TeamDetailCard;
