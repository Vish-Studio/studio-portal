import { FunctionComponent } from 'react';
import { Briefcase, Building2, Mail, Phone, TrendingUp } from '@/src/shared/components/material-icon/material-lucide-icons';
import { format } from 'date-fns';
import { DetailHeroCard } from '@/src/shared/components';
import { avatarColor, ClientStatusBadge } from '@/src/shared/components';
import type { Client } from '../../types';
import type { ClientProject } from '@/src/features/projects';

interface Props {
  className?: string;
  client: Client;
  projects?: ClientProject[];
}

const ClientDetailCard: FunctionComponent<Props> = ({ className = '', client, projects = [] }) => {
  const avatarBg     = avatarColor(client.id ?? client.fullName);
  const activeCount  = projects.filter(p => p.status === 'active').length;
  const totalAgreed  = projects.reduce((s, p) => s + p.agreedPayment, 0);
  const totalPaid    = projects.reduce((s, p) => s + p.paidPayment, 0);
  const totalRemaining = totalAgreed - totalPaid;

  return (
    <DetailHeroCard className={`client-detail-card ${className}`}>
      {/* ── Hero ── */}
      <DetailHeroCard.Hero>
        <DetailHeroCard.Glow />

        {/* Letter avatar */}
        <div
          className={`client-detail-card-avatar mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] ${avatarBg} text-2xl font-black text-white shadow-[0_14px_32px_rgba(0,0,0,0.24)] ring-1 ring-white/15`}
        >
          {client.fullName.charAt(0).toUpperCase()}
        </div>

        <h2 className="max-w-full truncate text-[26px] font-black leading-tight text-white">{client.fullName}</h2>
        {client.companyName && (
          <p className="mt-1 max-w-full truncate text-sm font-medium text-gray-400">{client.companyName}</p>
        )}
        <div className="mt-2.5">
          <ClientStatusBadge status={client.status} />
        </div>
        <p className="text-[11px] text-gray-600 mt-3">
          Client since{' '}
          {client.createdAt
            ? format(
                client.createdAt instanceof Date
                  ? client.createdAt
                  : client.createdAt.toDate(),
                'MMM d, yyyy',
              )
            : '—'}
        </p>
      </DetailHeroCard.Hero>

      {/* ── Contact info ── */}
      <DetailHeroCard.Section title="Contact & Info" icon={<Building2 size={15} />}>
        <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
          <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.email}</span>
        </DetailHeroCard.IconRow>
        {client.phone && (
          <DetailHeroCard.IconRow icon={<Phone size={12} className="text-gray-400" />}>
            <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.phone}</span>
          </DetailHeroCard.IconRow>
        )}
        {client.companyName && (
          <DetailHeroCard.IconRow icon={<Building2 size={12} className="text-gray-400" />}>
            <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.companyName}</span>
          </DetailHeroCard.IconRow>
        )}
      </DetailHeroCard.Section>

      {/* ── Stats ── */}
      <DetailHeroCard.Stats>
        <DetailHeroCard.Stat
          label="Projects"
          icon={<Briefcase size={11} />}
          value={projects.length}
          sub={`${activeCount} active`}
          trendData={[1, Math.max(1, projects.length - 1), projects.length, activeCount + 1, projects.length + activeCount]}
          trendVariant={activeCount > 0 ? 'positive' : 'neutral'}
        />
        <DetailHeroCard.Stat
          label="Value"
          icon={<TrendingUp size={11} />}
          value={`$${(totalAgreed / 1000).toFixed(0)}k`}
          sub={`$${totalPaid.toLocaleString()} paid`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
          trendData={[0, totalPaid * 0.35, totalPaid * 0.58, totalPaid * 0.78, totalAgreed]}
          trendVariant="accent"
        />
        <DetailHeroCard.Stat
          label="Balance"
          icon={<TrendingUp size={11} />}
          value={totalRemaining > 0 ? `$${(totalRemaining / 1000).toFixed(0)}k` : 'Settled'}
          sub={totalRemaining > 0 ? 'outstanding' : 'fully paid'}
          valueClassName={totalRemaining > 0 ? 'text-amber-400' : 'text-green-400'}
          trendData={totalRemaining > 0 ? [totalAgreed, totalAgreed * 0.72, totalAgreed * 0.58, totalRemaining] : [8, 6, 3, 0]}
          trendVariant={totalRemaining > 0 ? 'warning' : 'positive'}
        />
      </DetailHeroCard.Stats>
    </DetailHeroCard>
  );
};

ClientDetailCard.displayName = 'ClientDetailCard';
export default ClientDetailCard;
