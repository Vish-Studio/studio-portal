import { FunctionComponent } from 'react';
import { Mail, Phone } from '@/src/shared/components/material-icon/material-lucide-icons';
import { format } from 'date-fns';
import { Avatar, CardContent, MaterialIcon } from '@/src/shared/components';
import { ClientStatusBadge } from '@/src/shared/components';
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
  return (
    <CardContent
      className={`client-detail-card ${className}`}
      iconName="business_center"
      title="Client profile"
      action={<ClientStatusBadge status={client.status} />}
      bodyClassName="p-4 md:p-5"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            name={client.fullName}
            id={client.id}
            color={client.avatarColor}
            size="lg"
            className="shrink-0"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-(--color-ink)">{client.fullName}</h1>
            <p className="mt-0.5 truncate text-sm font-medium text-gray-500">
              {client.companyName || 'Independent client'}
            </p>
            <p className="mt-2 text-[11px] font-semibold text-gray-400">
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
        </div>

        <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <Mail size={13} className="shrink-0 text-gray-400" />
            <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex min-w-0 items-center gap-2.5">
              <Phone size={13} className="shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.phone}</span>
            </div>
          )}
          {client.website && (
            <div className="flex min-w-0 items-center gap-2.5">
              <MaterialIcon name="language" size={14} className="shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.website}</span>
            </div>
          )}
          {client.industry && (
            <div className="flex min-w-0 items-center gap-2.5">
              <MaterialIcon name="category" size={14} className="shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.industry}</span>
            </div>
          )}
          {client.location && (
            <div className="flex min-w-0 items-center gap-2.5">
              <MaterialIcon name="location_on" size={14} className="shrink-0 text-gray-400" />
              <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{client.location}</span>
            </div>
          )}
          <div className="flex min-w-0 items-center gap-2.5">
            <MaterialIcon name={client.isOnline ? 'radio_button_checked' : 'schedule'} size={14} className={client.isOnline ? 'shrink-0 text-green-500' : 'shrink-0 text-gray-400'} />
            <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">{formatOnlineStatus(client)}</span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

ClientDetailCard.displayName = 'ClientDetailCard';
export default ClientDetailCard;
