import { FunctionComponent } from 'react';
import { Mail, Phone } from '@/src/shared/components/material-icon/material-lucide-icons';
import { format } from 'date-fns';
import { DETAIL_COVER_IMAGES, DetailHeroCard, MaterialIcon } from '@/src/shared/components';
import { avatarColor, ClientStatusBadge } from '@/src/shared/components';
import type { Client } from '../../types';

interface Props {
  className?: string;
  client: Client;
}

const formatOnlineStatus = (client: Client) => {
  if (client.isOnline) return 'Online now';
  const value = client.lastOnlineAt;
  if (!value) return 'Last online unknown';
  if (typeof value === 'string') return value ? `Last online ${value.replace('T', ' ')}` : 'Last online unknown';
  if (typeof value === 'number') return `Last online ${format(value, 'MMM d, yyyy')}`;
  return `Last online ${format(value.toDate(), 'MMM d, yyyy')}`;
};

const ClientDetailCard: FunctionComponent<Props> = ({ className = '', client }) => {
  const avatarBg     = avatarColor(client.id ?? client.fullName);

  return (
    <DetailHeroCard className={`client-detail-card ${className}`}>
      {/* ── Hero ── */}
      <DetailHeroCard.Hero title={client.fullName} coverImage={DETAIL_COVER_IMAGES.client}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:items-start">
          <div className="min-w-0">
            <div
              className={`client-detail-card-avatar relative z-20 -mt-12 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white ${avatarBg} text-4xl font-black text-white`}
            >
              {client.fullName.charAt(0).toUpperCase()}
            </div>

            {client.companyName && (
              <p className="mt-1 max-w-full truncate text-sm font-semibold text-gray-500">{client.companyName}</p>
            )}
            <div className="mt-2.5">
              <ClientStatusBadge status={client.status} />
            </div>
            <p className="mt-3 text-[11px] font-semibold text-gray-400">
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
          </div>

          <div className="grid gap-3 pt-6 sm:grid-cols-2 lg:pt-5">
            <DetailHeroCard.IconRow icon={<Mail size={12} className="text-gray-400" />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.email}</span>
            </DetailHeroCard.IconRow>
            {client.phone && (
              <DetailHeroCard.IconRow icon={<Phone size={12} className="text-gray-400" />}>
                <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.phone}</span>
              </DetailHeroCard.IconRow>
            )}
            {client.website && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="language" size={12} className="text-gray-400" />}>
                <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.website}</span>
              </DetailHeroCard.IconRow>
            )}
            {client.industry && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="category" size={12} className="text-gray-400" />}>
                <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.industry}</span>
              </DetailHeroCard.IconRow>
            )}
            {client.location && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="location_on" size={12} className="text-gray-400" />}>
                <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.location}</span>
              </DetailHeroCard.IconRow>
            )}
            {client.companySize && (
              <DetailHeroCard.IconRow icon={<MaterialIcon name="groups" size={12} className="text-gray-400" />}>
                <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.companySize}</span>
              </DetailHeroCard.IconRow>
            )}
            <DetailHeroCard.IconRow icon={<MaterialIcon name={client.isOnline ? 'radio_button_checked' : 'schedule'} size={12} className={client.isOnline ? 'text-green-500' : 'text-gray-400'} />}>
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{formatOnlineStatus(client)}</span>
            </DetailHeroCard.IconRow>
          </div>
        </div>
      </DetailHeroCard.Hero>

    </DetailHeroCard>
  );
};

ClientDetailCard.displayName = 'ClientDetailCard';
export default ClientDetailCard;
