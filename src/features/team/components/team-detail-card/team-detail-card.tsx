import { FunctionComponent } from 'react';
import { Briefcase, CheckSquare, Mail, TrendingUp, UserRound } from '@/src/shared/components/material-icon/material-lucide-icons';
import { format } from 'date-fns';
import { DetailHeroCard } from '@/src/shared/components';
import { getMemberColors, type TeamMember } from '../../types';
import type { ClientProject } from '@/src/features/projects';
import type { Task } from '@/src/features/tasks';

interface TeamDetailCardProps {
  className?: string;
  member: TeamMember;
  projects: ClientProject[];
  tasks: Task[];
}

const TeamDetailCard: FunctionComponent<TeamDetailCardProps> = ({
  className = '',
  member,
  projects,
  tasks,
}) => {
  const colors = getMemberColors(member.id);
  const activeProjects = projects.filter(project => project.status !== 'completed').length;
  const openTasks = tasks.filter(task => task.status !== 'completed').length;
  const completedTasks = tasks.length - openTasks;
  const totalProjectValue = projects.reduce((sum, project) => sum + project.agreedPayment, 0);

  return (
    <DetailHeroCard className={`team-detail-card ${className}`}>
      <DetailHeroCard.Hero>
        <DetailHeroCard.Glow />

        <div className={`team-detail-card-avatar mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] ${colors.bg} text-2xl font-black text-white shadow-[0_14px_32px_rgba(0,0,0,0.24)] ring-1 ring-white/15`}>
          {member.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="team-detail-card-name max-w-full truncate text-[26px] font-black leading-tight text-white">{member.name}</h2>
        <p className="team-detail-card-role mt-1 max-w-full truncate text-sm font-medium text-gray-400">{member.role}</p>
        <p className="team-detail-card-access mt-2 inline-flex self-start rounded-[6px] bg-white/8 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
          {member.accessRole ?? 'freelancer'}
        </p>
        <p className="team-detail-card-date mt-3 text-[11px] text-gray-600">
          Team member since{' '}
          {member.createdAt?.toDate ? format(member.createdAt.toDate(), 'MMM d, yyyy') : '—'}
        </p>
      </DetailHeroCard.Hero>

      <DetailHeroCard.Section title="Member Info" icon={<UserRound size={15} />}>
        <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
          <span className="team-detail-card-email min-w-0 truncate text-sm font-semibold text-(--color-ink)">{member.email}</span>
        </DetailHeroCard.IconRow>
        <DetailHeroCard.IconRow icon={<UserRound size={12} className="text-gray-400" />}>
          <span className="team-detail-card-position min-w-0 truncate text-sm font-semibold text-(--color-ink)">{member.role}</span>
        </DetailHeroCard.IconRow>
      </DetailHeroCard.Section>

      <DetailHeroCard.Stats>
        <DetailHeroCard.Stat
          label="Projects"
          icon={<Briefcase size={11} />}
          value={projects.length}
          sub={`${activeProjects} current`}
          trendData={[0, Math.max(1, activeProjects), projects.length, projects.length + activeProjects]}
          trendVariant={activeProjects > 0 ? 'positive' : 'neutral'}
        />
        <DetailHeroCard.Stat
          label="Tasks"
          icon={<CheckSquare size={11} />}
          value={openTasks}
          sub={`${completedTasks} completed`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
          trendData={[tasks.length, openTasks + completedTasks * 0.6, openTasks + 1, openTasks]}
          trendVariant={openTasks > completedTasks ? 'warning' : 'accent'}
        />
        <DetailHeroCard.Stat
          label="Value"
          icon={<TrendingUp size={11} />}
          value={`$${(totalProjectValue / 1000).toFixed(0)}k`}
          sub={member.accessRole ?? 'freelancer'}
          trendData={[0, totalProjectValue * 0.35, totalProjectValue * 0.68, totalProjectValue]}
          trendVariant="positive"
        />
      </DetailHeroCard.Stats>
    </DetailHeroCard>
  );
};

TeamDetailCard.displayName = 'TeamDetailCard';
export default TeamDetailCard;
