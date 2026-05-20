import { MaterialIcon, RecordMeta, StatusBadge, formatRecordDate } from '@/src/shared/components';
import type { StudioDocument, DocumentType } from '../../types';
import type { TemplateAssignment } from '@/src/features/templates';

export const DOC_TYPE_ICON: Record<DocumentType, string> = {
  contract: 'draw',
  proposal: 'description',
  invoice: 'receipt',
  quotation: 'request_quote',
  onboarding: 'person_add',
};

export const DOC_TYPE_LABEL: Record<DocumentType, string> = {
  contract: 'Contract',
  proposal: 'Proposal',
  invoice: 'Invoice',
  quotation: 'Quotation',
  onboarding: 'Onboarding',
};

export type DocStatus =
  | 'awaits-client'
  | 'admin-action'
  | 'awaits-signature'
  | 'signed'
  | 'complete'
  | 'pending';

export interface UnifiedDocumentListItem {
  id: string;
  title: string;
  source: 'studio' | 'template';
  icon: string;
  typeLabel: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  phaseName?: string;
  date: number;
  status: DocStatus;
  studioDoc?: StudioDocument;
  assignment?: TemplateAssignment;
}

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  'awaits-client': 'Awaits Client',
  'admin-action': 'Admin Action',
  'awaits-signature': 'Awaits Signature',
  signed: 'Signed',
  complete: 'Complete',
  pending: 'Pending',
};

export const DOC_STATUS_VARIANT: Record<DocStatus, 'violet' | 'amber' | 'purple' | 'green' | 'gray' | 'blue'> = {
  'awaits-client': 'violet',
  'admin-action': 'amber',
  'awaits-signature': 'purple',
  signed: 'green',
  complete: 'green',
  pending: 'gray',
};

interface DocumentListItemProps {
  document: UnifiedDocumentListItem;
  onOpen: (document: UnifiedDocumentListItem) => void;
}

export default function DocumentListItem({ document, onOpen }: DocumentListItemProps) {
  return (
    <div
      onClick={() => onOpen(document)}
      className="document-list-item group flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors hover:bg-(--color-surface-subtle) md:px-6"
    >
      <div className="document-list-item-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-gray-100 transition-colors group-hover:bg-gray-200">
        <MaterialIcon name={document.icon} size={16} className="document-list-item-icon-symbol text-gray-500" />
      </div>

      <div className="document-list-item-copy min-w-0 flex-1">
        <div className="document-list-item-heading flex flex-wrap items-center gap-2">
          <p className="document-list-item-title truncate text-sm font-semibold leading-tight text-(--color-ink)">
            {document.title}
          </p>
          <StatusBadge
            label={DOC_STATUS_LABEL[document.status]}
            variant={DOC_STATUS_VARIANT[document.status]}
          />
        </div>
        <RecordMeta
          className="document-list-item-meta mt-1"
          items={[
            { label: document.typeLabel, icon: 'description' },
            document.projectName && { label: document.projectName, icon: 'work' },
            document.phaseName && { label: document.phaseName, icon: 'route' },
            document.clientName && { label: document.clientName, icon: 'person' },
          ]}
        />
      </div>

      <RecordMeta className="document-list-item-date hidden shrink-0 tabular-nums sm:flex" items={[{ label: formatRecordDate(document.date), icon: 'event' }]} />

      <MaterialIcon
        name="arrow_outward"
        size={14}
        className="document-list-item-open-icon shrink-0 text-gray-300 transition-colors group-hover:text-gray-600"
      />
    </div>
  );
}
