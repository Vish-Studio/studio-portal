import { Pencil, Trash2 } from '@/src/shared/components/material-icon/material-lucide-icons';
import { CardListItem, ClientStatusBadge, formatRecordDate, RecordMeta } from '@/src/shared/components';
import type { Client, ClientStatus } from '../../types';

interface ClientListItemProps {
  client: Client;
  onOpen: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const STATUS_COLOR: Record<ClientStatus, string> = {
  active: 'bg-green',
  inactive: 'bg-amber-400',
  lost: 'bg-red-400',
};

export default function ClientListItem({ client, onOpen, onEdit, onDelete }: ClientListItemProps) {
  return (
    <CardListItem
      item={client}
      onOpen={onOpen}
      title={client.fullName}
      subTitle={<RecordMeta items={[{ label: client.companyName || 'No company', icon: 'business' }]} className="client-list-item-company" />}
      icon={(
        <div className={`client-list-item-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${STATUS_COLOR[client.status]} text-xs font-bold text-white`}>
          {client.fullName.charAt(0).toUpperCase()}
        </div>
      )}
      actions={[
        { label: 'Edit client', icon: <Pencil size={14} />, onClick: () => onEdit(client) },
        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => onDelete(client), variant: 'danger' },
      ]}
      className="client-list-item flex min-h-[168px] flex-col rounded-[18px] border border-gray-200 bg-white text-left transition-colors hover:bg-gray-50"
      headerClassName="client-list-item-header"
      contentClassName="client-list-item-content"
      footerClassName="client-list-item-footer"
      footer={(
        <>
          <div className="client-list-item-footer-meta flex min-w-0 items-center gap-2">
            <ClientStatusBadge status={client.status} />
          </div>
          <RecordMeta className="client-list-item-created shrink-0" items={[{ label: formatRecordDate(client.createdAt?.toDate?.()), icon: 'event' }]} />
        </>
      )}
    >
        <div className="client-list-item-contact min-w-0">
          <p className="client-list-item-email type-label truncate text-gray-600">{client.email}</p>
          <RecordMeta items={[{ label: client.phone || 'No phone', icon: 'call' }]} className="client-list-item-phone mt-1" />
        </div>
    </CardListItem>
  );
}
