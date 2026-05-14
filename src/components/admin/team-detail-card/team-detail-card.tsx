import { FunctionComponent } from 'react';
import { Briefcase, CheckSquare, Mail, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import DetailHeroCard from '../detail-hero-card/detail-hero-card';
import { getMemberColors, type TeamMember } from '@/src/data/team';
import type { ClientProject } from '@/src/data/projects';
import type { Task } from '@/src/data/tasks';

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

  return (
    <DetailHeroCard className={`team-detail-card ${className}`}>
      <DetailHeroCard.Hero>
        <DetailHeroCard.Glow />

        <div className={`team-detail-card-avatar mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} text-2xl font-black text-white shadow-lg`}>
          {member.name.charAt(0).toUpperCase()}
        </div>

        <h2 className="team-detail-card-name text-xl font-bold leading-tight text-white">{member.name}</h2>
        <p className="team-detail-card-role mt-0.5 text-sm text-gray-400">{member.role}</p>
        <p className="team-detail-card-access mt-2 inline-flex rounded-[6px] bg-white/8 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50">
          {member.accessRole ?? 'freelancer'}
        </p>
        <p className="team-detail-card-date mt-3 text-[11px] text-gray-600">
          Team member since{' '}
          {member.createdAt?.toDate ? format(member.createdAt.toDate(), 'MMM d, yyyy') : '—'}
        </p>
      </DetailHeroCard.Hero>

      <DetailHeroCard.Section className="space-y-3">
        <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
          <span className="team-detail-card-email truncate text-sm text-gray-300">{member.email}</span>
        </DetailHeroCard.IconRow>
        <DetailHeroCard.IconRow icon={<UserRound size={12} className="text-gray-400" />}>
          <span className="team-detail-card-position truncate text-sm text-gray-300">{member.role}</span>
        </DetailHeroCard.IconRow>
      </DetailHeroCard.Section>

      <DetailHeroCard.Stats>
        <DetailHeroCard.Stat
          label="Projects"
          icon={<Briefcase size={11} />}
          value={projects.length}
          sub={`${activeProjects} current`}
        />
        <DetailHeroCard.Stat
          label="Tasks"
          icon={<CheckSquare size={11} />}
          value={openTasks}
          sub={`${completedTasks} completed`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
        />
      </DetailHeroCard.Stats>
    </DetailHeroCard>
  );
};

TeamDetailCard.displayName = 'TeamDetailCard';
export default TeamDetailCard;
