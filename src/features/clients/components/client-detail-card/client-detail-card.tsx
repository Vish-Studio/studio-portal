import { FunctionComponent } from 'react';
import { Briefcase, Building2, Mail, Phone, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import DetailHeroCard from '@/src/components/admin/detail-hero-card/detail-hero-card';
import { avatarColor, ClientStatusBadge } from '@/src/shared/components';
import { DEMO_PROJECTS } from '@/src/data/projects';
import type { Client } from '../../types';

interface Props {
  className?: string;
  client: Client;
}

const ClientDetailCard: FunctionComponent<Props> = ({ className = '', client }) => {
  const avatarBg     = avatarColor(client.id ?? client.fullName);
  const projects     = DEMO_PROJECTS.filter(p => p.clientId === client.id);
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
          className={`client-detail-card-avatar w-14 h-14 rounded-2xl ${avatarBg} flex items-center justify-center text-2xl font-black text-white mb-4 shadow-lg`}
        >
          {client.fullName.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-xl font-bold text-white leading-tight">{client.fullName}</h2>
        {client.companyName && (
          <p className="text-sm text-gray-400 mt-0.5">{client.companyName}</p>
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
      <DetailHeroCard.Section className="space-y-3">
        <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
          <span className="text-sm text-gray-300 truncate">{client.email}</span>
        </DetailHeroCard.IconRow>
        {client.phone && (
          <DetailHeroCard.IconRow icon={<Phone size={12} className="text-gray-400" />}>
            <span className="text-sm text-gray-300">{client.phone}</span>
          </DetailHeroCard.IconRow>
        )}
        {client.companyName && (
          <DetailHeroCard.IconRow icon={<Building2 size={12} className="text-gray-400" />}>
            <span className="text-sm text-gray-300 truncate">{client.companyName}</span>
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
        />
        <DetailHeroCard.Stat
          label="Value"
          icon={<TrendingUp size={11} />}
          value={`$${(totalAgreed / 1000).toFixed(0)}k`}
          sub={`$${totalPaid.toLocaleString()} paid`}
          valueStyle={{ color: 'var(--color-accent-lime)' }}
        />
      </DetailHeroCard.Stats>

      {/* ── Balance footer ── */}
      {totalRemaining > 0 && (
        <DetailHeroCard.Footer
          label="Outstanding balance"
          value={<span className="text-sm font-bold text-amber-400">${totalRemaining.toLocaleString()}</span>}
        />
      )}
    </DetailHeroCard>
  );
};

ClientDetailCard.displayName = 'ClientDetailCard';
export default ClientDetailCard;
