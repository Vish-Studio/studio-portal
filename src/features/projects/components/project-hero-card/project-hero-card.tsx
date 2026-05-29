import { FunctionComponent } from 'react';
import { format } from 'date-fns';
import { Avatar, DETAIL_COVER_IMAGES, DetailHeroCard, MaterialIcon, ProjectStatusBadge } from '@/src/shared/components';
import { getProjectAccent, type ClientProject } from '../../types';
import { useClientsStore } from '@/src/features/clients';

interface Props { project: ClientProject; className?: string; }

const ProjectHeroCard: FunctionComponent<Props> = ({ project, className = '' }) => {
  const { clients }    = useClientsStore();
  const accent         = getProjectAccent(project.service, project.package);
  const client         = clients.find(c => c.id === project.clientId);
  const activePhase    = project.phases.find(p => p.status === 'active');

  return (
    <DetailHeroCard className={className}>
      <DetailHeroCard.Hero title={project.name} coverImage={DETAIL_COVER_IMAGES.project}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-start">
          <div className="min-w-0">
            <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-100 ${accent.bg}`}>
              <MaterialIcon name={accent.icon} size={34} className={accent.iconText} />
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badgeBg} ${accent.badgeText}`}>{accent.label}</span>
              <ProjectStatusBadge status={project.status} />
            </div>

            {activePhase && project.status === 'active' && (
              <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <MaterialIcon name="radio_button_checked" size={10} className="text-gray-400" />
                Currently in <span className="font-semibold text-(--color-ink)">{activePhase.title}</span>
              </p>
            )}

            <p className="text-[11px] font-semibold text-gray-400 mt-1.5">
              Started {format(project.startedAt, 'MMM d, yyyy')}
              {project.endDate ? ` · Ends ${format(new Date(project.endDate), 'MMM d, yyyy')}` : ''}
            </p>
          </div>

          <div className="grid gap-3 pt-6 sm:grid-cols-2 lg:pt-5">
            {client && (
              <DetailHeroCard.IconRow icon={<Avatar name={client.fullName} id={client.id} size="xs" />}>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Client</p>
                  <p className="truncate text-sm font-bold text-(--color-ink)">{client.fullName}</p>
                </div>
              </DetailHeroCard.IconRow>
            )}
            {project.timeline && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="schedule" size={12} className="text-gray-400" />}>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Timeline</p>
                  <p className="truncate text-sm font-bold text-(--color-ink)">{project.timeline}</p>
                </div>
              </DetailHeroCard.IconRow>
            )}
            <DetailHeroCard.IconRow icon={<MaterialIcon name="payments" size={12} className="text-gray-400" />}>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Budget</p>
                <p className="truncate text-sm font-bold text-(--color-ink)">${project.agreedPayment.toLocaleString()}</p>
              </div>
            </DetailHeroCard.IconRow>
          </div>
        </div>
      </DetailHeroCard.Hero>

    </DetailHeroCard>
  );
};

ProjectHeroCard.displayName = 'ProjectHeroCard';
export default ProjectHeroCard;
