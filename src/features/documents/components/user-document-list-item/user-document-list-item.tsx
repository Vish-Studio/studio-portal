import { format } from 'date-fns';
import { MaterialIcon, StatusBadge } from '@/src/shared/components';
import type { StudioDocument, DocumentType } from '../../types';

export const USER_DOC_META: Record<DocumentType, { icon: string; label: string; iconClass: string; bgClass: string }> = {
  contract: { icon: 'draw', label: 'Contract', iconClass: 'text-violet-500', bgClass: 'bg-violet-50' },
  proposal: { icon: 'description', label: 'Proposal', iconClass: 'text-blue-500', bgClass: 'bg-blue-50' },
  invoice: { icon: 'receipt', label: 'Invoice', iconClass: 'text-green-500', bgClass: 'bg-green-50' },
  quotation: { icon: 'request_quote', label: 'Quotation', iconClass: 'text-amber-500', bgClass: 'bg-amber-50' },
  onboarding: { icon: 'person_add', label: 'Onboarding', iconClass: 'text-rose-500', bgClass: 'bg-rose-50' },
};

interface UserDocumentListItemProps {
  document: StudioDocument;
  onSign: () => void;
}

export default function UserDocumentListItem({ document, onSign }: UserDocumentListItemProps) {
  const meta = USER_DOC_META[document.type];
  const isContract = document.type === 'contract';
  const needsSignature = isContract && !document.isSigned;
  const isSigned = isContract && !!document.isSigned;

  return (
    <div className="user-document-list-item group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-(--color-surface-subtle) md:px-6">
      <div className={`user-document-list-item-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${meta.bgClass}`}>
        <MaterialIcon name={meta.icon} size={16} className={`user-document-list-item-icon-symbol ${meta.iconClass}`} />
      </div>

      <div className="user-document-list-item-copy min-w-0 flex-1">
        <div className="user-document-list-item-heading flex flex-wrap items-center gap-2">
          <p className="user-document-list-item-title truncate text-sm font-semibold leading-tight text-(--color-ink)">{document.title}</p>
          {needsSignature && (
            <StatusBadge label="Action Required" variant="violet" className="user-document-list-item-status shrink-0" />
          )}
          {isSigned && (
            <StatusBadge label="Signed" variant="green" className="user-document-list-item-status shrink-0" />
          )}
        </div>
        <div className="user-document-list-item-meta mt-0.5 flex items-center gap-2">
          <span className="user-document-list-item-type text-[10px] font-bold uppercase tracking-wider text-gray-400">{meta.label}</span>
          {document.createdAt && (
            <>
              <span className="user-document-list-item-separator text-[10px] text-gray-300">-</span>
              <span className="user-document-list-item-date text-[10px] text-gray-400">
                {format(document.createdAt.toMillis(), 'MMM dd, yyyy')}
              </span>
            </>
          )}
          {document.author && (
            <>
              <span className="user-document-list-item-separator text-[10px] text-gray-300">-</span>
              <span className="user-document-list-item-author text-[10px] text-gray-400">{document.author.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="user-document-list-item-actions flex shrink-0 items-center gap-2">
        {needsSignature && (
          <button
            onClick={onSign}
            className="user-document-list-item-sign hidden items-center gap-1.5 rounded-[10px] bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-violet-700 sm:flex"
          >
            <MaterialIcon name="draw" size={12} />
            Sign
          </button>
        )}
        <a
          href={document.url}
          target="_blank"
          rel="noreferrer"
          className="user-document-list-item-open flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
          title="Open document"
          onClick={event => event.stopPropagation()}
        >
          <MaterialIcon name="open_in_new" size={14} />
        </a>
      </div>
    </div>
  );
}
