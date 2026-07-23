import type { TeamMember } from '@/src/features/team';
import type { AuthProfile } from '@/src/types/auth';

export const isCurrentTeamMember = (
  member: TeamMember,
  profile?: AuthProfile | null,
) => {
  if (!profile || profile.role === 'user') return false;

  const profileEmail = profile.email?.trim().toLowerCase();
  const memberEmail = member.email?.trim().toLowerCase();

  return (
    member.id === profile.uid ||
    member.userId === profile.uid ||
    (!!profileEmail && memberEmail === profileEmail)
  );
};

export const withoutCurrentTeamMember = (
  members: TeamMember[],
  profile?: AuthProfile | null,
) => members.filter(member => !isCurrentTeamMember(member, profile));
