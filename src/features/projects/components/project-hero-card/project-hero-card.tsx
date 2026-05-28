import { FunctionComponent } from 'react';
import { format } from 'date-fns';
import { DetailHeroCard } from '@/src/shared/components';
import { Avatar, MaterialIcon, ProjectStatusBadge } from '@/src/shared/components';
import { getProjectAccent, getPhaseProgress, type ClientProject } from '../../types';
import { useClientsStore } from '@/src/features/clients';

interface Props { project: ClientProject; className?: string; }

const ProjectHeroCard: FunctionComponent<Props> = ({ project, className = '' }) => {
  const { clients }    = useClientsStore();
  const accent         = getProjectAccent(project.service, project.package);
  const doneCount      = project.phases.filter(p => p.status === 'done').length;
  const progress       = getPhaseProgress(project.phases);
  const remaining      = project.agreedPayment - project.paidPayment;
  const client         = clients.find(c => c.id === project.clientId);
  const activePhase    = project.phases.find(p => p.status === 'active');

  return (
    <DetailHeroCard className={className}>
      <DetailHeroCard.Hero>
        <div aria-hidden="true" className={`absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-15 pointer-events-none blur-2xl ${accent.bar}`} />

        <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] ${accent.bg} shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/15`}>
          <MaterialIcon name={accent.icon} size={26} className={accent.iconText} />
        </div>

        <h2 className="text-2xl font-black leading-tight text-white">{project.name}</h2>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>{accent.label}</span>
          <ProjectStatusBadge status={project.status} />
        </div>

        {activePhase && project.status === 'active' && (
          <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <MaterialIcon name="radio_button_checked" size={10} className="text-gray-500" />
            Currently in <span className="font-medium text-gray-300">{activePhase.title}</span>
          </p>
        )}

        <p className="text-[11px] text-gray-600 mt-1.5">
          Started {format(project.startedAt, 'MMM d, yyyy')}
          {project.endDate ? ` · Ends ${format(new Date(project.endDate), 'MMM d, yyyy')}` : ''}
        </p>
      </DetailHeroCard.Hero>

      {(client || project.timeline) && (
        <DetailHeroCard.Section title="Project Details" icon={<MaterialIcon name="fact_check" size={16} />}>
          {client && (
            <DetailHeroCard.IconRow icon={<Avatar name={client.fullName} id={client.id} size="xs" />}>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-(--color-ink)">{client.fullName}</p>
                {client.companyName && <p className="text-[11px] text-gray-500 truncate">{client.companyName}</p>}
              </div>
            </DetailHeroCard.IconRow>
          )}
          {project.timeline && (
            <DetailHeroCard.IconRow icon={<MaterialIcon name="schedule" size={12} className="text-gray-400" />}>
              <span className="min-w-0 truncate text-sm font-bold text-(--color-ink)">{project.timeline}</span>
            </DetailHeroCard.IconRow>
          )}
          {(project.startDate || project.endDate) && (
            <DetailHeroCard.IconRow icon={<MaterialIcon name="event" size={12} className="text-gray-400" />}>
              <span className="min-w-0 truncate text-sm font-bold text-(--color-ink)">
                {project.startDate ?? format(project.startedAt, 'yyyy-MM-dd')}
                {project.endDate ? ` - ${project.endDate}` : ' - No end date'}
              </span>
            </DetailHeroCard.IconRow>
          )}
        </DetailHeroCard.Section>
      )}

      <DetailHeroCard.Stats>
        <DetailHeroCard.Stat
          label="Progress"
          icon={<MaterialIcon name="donut_small" size={11} />}
          value={`${progress}%`}
          sub={`${doneCount}/${project.phases.length} phases`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
          trendData={[0, Math.max(8, progress * 0.35), Math.max(18, progress * 0.68), progress]}
          trendVariant="accent"
        />
        <DetailHeroCard.Stat
          label="Budget"
          icon={<MaterialIcon name="payments" size={11} />}
          value={`$${(project.agreedPayment / 1000).toFixed(0)}k`}
          sub={`$${project.paidPayment.toLocaleString()} paid`}
          trendData={[0, project.paidPayment * 0.4, project.paidPayment, project.agreedPayment]}
          trendVariant={remaining > 0 ? 'warning' : 'positive'}
        />
      </DetailHeroCard.Stats>

      {remaining > 0 && (
        <DetailHeroCard.Footer
          label="Outstanding"
          value={<span className="text-sm font-bold text-amber-400">${remaining.toLocaleString()}</span>}
        />
      )}
    </DetailHeroCard>
  );
};

ProjectHeroCard.displayName = 'ProjectHeroCard';
export default ProjectHeroCard;
