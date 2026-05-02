import React, { useState } from 'react';
import { format } from 'date-fns';
import { FileText, ShieldCheck, Clock } from 'lucide-react';
import UserLayout from '@/src/components/user/user-layout/user-layout';
import StatCard from '@/src/components/common/stat-card/stat-card';
import CardContent from '@/src/components/common/card-content/card-content';
import MaterialIcon from '@/src/components/common/material-icon/material-icon';
import TableTab, { type TabItem } from '@/src/components/common/table-tab/table-tab';
import StatusBadge from '@/src/components/common/status-badge/status-badge';
import { useDocumentsStore } from '@/src/store/documents';
import type { StudioDocument, DocumentType } from '@/src/store/documents';

const CURRENT_CLIENT_ID = 'c1';

// ─── Document type metadata ───────────────────────────────────────────────────

const DOC_META: Record<DocumentType, { icon: string; label: string; iconClass: string; bgClass: string }> = {
  contract:   { icon: 'draw',         label: 'Contract',   iconClass: 'text-violet-500', bgClass: 'bg-violet-50' },
  proposal:   { icon: 'description',  label: 'Proposal',   iconClass: 'text-blue-500',   bgClass: 'bg-blue-50'   },
  invoice:    { icon: 'receipt',      label: 'Invoice',    iconClass: 'text-green-500',  bgClass: 'bg-green-50'  },
  quotation:  { icon: 'request_quote',label: 'Quotation',  iconClass: 'text-amber-500',  bgClass: 'bg-amber-50'  },
  onboarding: { icon: 'person_add',   label: 'Onboarding', iconClass: 'text-rose-500',   bgClass: 'bg-rose-50'   },
};

type FilterKey = 'all' | DocumentType;

// ─── Sign modal ───────────────────────────────────────────────────────────────

const SignModal = ({
  doc,
  onSign,
  onClose,
}: {
  doc: StudioDocument;
  onSign: (name: string) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSign(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-[28px] max-w-md w-full shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
          <MaterialIcon name="draw" size={22} className="text-violet-500" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-1">Sign Contract</h3>
        <p className="text-sm font-medium text-gray-500 mb-6">
          Electronically signing:{' '}
          <span className="font-bold text-gray-900">{doc.title}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Full Legal Name
            </label>
            <input
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium py-3 px-4 rounded-[12px] focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-black hover:bg-gray-800 text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-colors"
            >
              Confirm & Sign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Document row ─────────────────────────────────────────────────────────────

const DocumentRow = ({
  doc,
  onSign,
}: {
  doc: StudioDocument;
  onSign: () => void;
}) => {
  const meta             = DOC_META[doc.type];
  const isContract       = doc.type === 'contract';
  const needsSignature   = isContract && !doc.isSigned;
  const isSigned         = isContract && !!doc.isSigned;

  return (
    <div className="flex items-center gap-3 px-4 md:px-6 py-3.5 hover:bg-(--color-surface-subtle) transition-colors group">
      {/* Type icon */}
      <div className={`w-9 h-9 rounded-[12px] ${meta.bgClass} flex items-center justify-center shrink-0`}>
        <MaterialIcon name={meta.icon} size={16} className={meta.iconClass} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-(--color-ink) truncate leading-tight">{doc.title}</p>
          {needsSignature && (
            <StatusBadge label="Action Required" variant="violet" className="shrink-0" />
          )}
          {isSigned && (
            <StatusBadge label="Signed" variant="green" className="shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{meta.label}</span>
          {doc.createdAt && (
            <>
              <span className="text-gray-300 text-[10px]">·</span>
              <span className="text-[10px] text-gray-400">
                {format(doc.createdAt.toMillis(), 'MMM dd, yyyy')}
              </span>
            </>
          )}
          {doc.author && (
            <>
              <span className="text-gray-300 text-[10px]">·</span>
              <span className="text-[10px] text-gray-400">{doc.author.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {needsSignature && (
          <button
            onClick={onSign}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold rounded-[10px] transition-colors"
          >
            <MaterialIcon name="draw" size={12} />
            Sign
          </button>
        )}
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          title="Open document"
          onClick={e => e.stopPropagation()}
        >
          <MaterialIcon name="open_in_new" size={14} />
        </a>
      </div>
    </div>
  );
};

// ─── UserDocuments page ───────────────────────────────────────────────────────

const UserDocuments = () => {
  const { documents, signDocument } = useDocumentsStore();
  const [signingDoc,  setSigningDoc]  = useState<StudioDocument | null>(null);
  const [activeTab,   setActiveTab]   = useState<FilterKey>('all');

  const myDocuments = documents.filter(d => !d.clientId || d.clientId === CURRENT_CLIENT_ID);

  const contracts        = myDocuments.filter(d => d.type === 'contract');
  const pendingSignature = contracts.filter(d => !d.isSigned).length;
  const signedCount      = contracts.filter(d => d.isSigned).length;

  // Unique types for tabs
  const presentTypes = [...new Set(myDocuments.map(d => d.type))] as DocumentType[];
  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: myDocuments.length },
    ...presentTypes.map(t => ({ key: t as string, label: DOC_META[t].label, count: myDocuments.filter(d => d.type === t).length })),
  ];

  const filtered = activeTab === 'all'
    ? myDocuments
    : myDocuments.filter(d => d.type === activeTab);

  const handleSign = (name: string) => {
    if (!signingDoc) return;
    signDocument(signingDoc.id, name);
    setSigningDoc(null);
  };

  return (
    <UserLayout title="Documents">
      <div className="flex flex-col gap-5 pb-10">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            variant="lime"
            icon={<FileText size={16} />}
            label="Total Documents"
            value={myDocuments.length}
            badge={`${presentTypes.length} type${presentTypes.length !== 1 ? 's' : ''}`}
            badgeLabel="of documents"
          />
          <StatCard
            variant="surface"
            icon={<ShieldCheck size={16} />}
            label="Signed"
            value={signedCount}
            badge={signedCount === contracts.length && contracts.length > 0 ? 'All signed' : `${contracts.length} contract${contracts.length !== 1 ? 's' : ''}`}
            badgeLabel={contracts.length > 0 ? 'total' : 'no contracts'}
          />
          <StatCard
            variant="dark"
            icon={<Clock size={16} />}
            label="Pending Signature"
            value={pendingSignature}
            badge={pendingSignature > 0 ? 'Action required' : 'All clear'}
            badgeLabel={pendingSignature > 0 ? 'awaiting your signature' : 'nothing to sign'}
          />
        </div>

        {/* Tab toolbar */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
          <TableTab
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as FilterKey)}
          />
        </div>

        {/* Document list */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[18px] py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <MaterialIcon name="folder_open" size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No documents found</p>
          </div>
        ) : (
          <CardContent
            iconName="folder"
            title={`${filtered.length} document${filtered.length !== 1 ? 's' : ''}`}
            bodyClassName="divide-y divide-gray-100"
          >
            {filtered.map(doc => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onSign={() => setSigningDoc(doc)}
              />
            ))}
          </CardContent>
        )}

        {/* Pending signature callout */}
        {pendingSignature > 0 && activeTab === 'all' && (
          <div className="flex items-start gap-3 px-4 py-3.5 bg-violet-50 border border-violet-200 rounded-[14px]">
            <MaterialIcon name="info" size={16} className="text-violet-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-violet-900">
                {pendingSignature} contract{pendingSignature !== 1 ? 's' : ''} require{pendingSignature === 1 ? 's' : ''} your signature
              </p>
              <p className="text-[11px] text-violet-600 mt-0.5">
                Click the <strong>Sign</strong> button next to each contract to proceed.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Sign modal */}
      {signingDoc && (
        <SignModal
          doc={signingDoc}
          onSign={handleSign}
          onClose={() => setSigningDoc(null)}
        />
      )}
    </UserLayout>
  );
};

export default UserDocuments;
