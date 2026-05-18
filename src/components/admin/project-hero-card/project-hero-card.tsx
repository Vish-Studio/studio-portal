import { FunctionComponent } from 'react';
import { format } from 'date-fns';
import DetailHeroCard from '../detail-hero-card/detail-hero-card';
import { ProjectStatusBadge } from '../../common/status-badge/status-badge';
import MaterialIcon from '../../common/material-icon/material-icon';
import Avatar from '../../common/avatar/avatar';
import { getProjectAccent, getPhaseProgress } from '@/src/data/projects';
import type { ClientProject } from '@/src/data/projects';
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

        <div className={`w-12 h-12 rounded-2xl ${accent.bg} flex items-center justify-center mb-4 shadow-md`}>
          <MaterialIcon name={accent.icon} size={22} className={accent.iconText} />
        </div>

        <h2 className="text-xl font-bold text-white leading-tight">{project.name}</h2>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>{accent.label}</span>
          <ProjectStatusBadge status={project.status} />
        </div>

        {activePhase && project.status === 'active' && (
          <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
            <MaterialIcon name="radio_button_checked" size={10} className="text-gray-500" />
            Currently in <span className="text-gray-300 font-medium">{activePhase.title}</span>
          </p>
        )}

        <p className="text-[11px] text-gray-600 mt-1.5">Started {format(project.startedAt, 'MMM d, yyyy')}</p>
      </DetailHeroCard.Hero>

      {(client || project.timeline) && (
        <DetailHeroCard.Section className="space-y-3">
          {client && (
            <DetailHeroCard.IconRow icon={<Avatar name={client.fullName} id={client.id} size="xs" />}>
              <div className="min-w-0">
                <p className="text-sm text-gray-300 truncate">{client.fullName}</p>
                {client.companyName && <p className="text-[11px] text-gray-500 truncate">{client.companyName}</p>}
              </div>
            </DetailHeroCard.IconRow>
          )}
          {project.timeline && (
            <DetailHeroCard.IconRow icon={<MaterialIcon name="schedule" size={12} className="text-gray-400" />}>
              <span className="text-sm text-gray-300">{project.timeline}</span>
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
        />
        <DetailHeroCard.Stat
          label="Budget"
          icon={<MaterialIcon name="payments" size={11} />}
          value={`$${(project.agreedPayment / 1000).toFixed(0)}k`}
          sub={`$${project.paidPayment.toLocaleString()} paid`}
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
