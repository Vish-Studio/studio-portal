import { useState } from 'react';
import { FileText, ShieldCheck, Clock } from '@/src/shared/components/material-icon/material-lucide-icons';
import UserLayout from '@/src/layouts/UserLayout';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import CardContent from '@/src/shared/components/card-content/card-content';
import { MaterialIcon } from '@/src/shared/components';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { useDocumentsStore } from '../stores/documentStore';
import type { StudioDocument, DocumentType } from '../types';
import UserDocumentListItem, { USER_DOC_META } from '../components/user-document-list-item/user-document-list-item';
import SignDocumentModal from '../components/sign-document-modal/sign-document-modal';

const CURRENT_CLIENT_ID = 'c1';

type FilterKey = 'all' | DocumentType;

// ─── UserDocuments page ───────────────────────────────────────────────────────

const UserDocumentsPage = () => {
  const { documents, signDocument } = useDocumentsStore();
  const [signingDoc, setSigningDoc] = useState<StudioDocument | null>(null);
  const [activeTab, setActiveTab] = useState<FilterKey>('all');

  const myDocuments = documents.filter(d => !d.clientId || d.clientId === CURRENT_CLIENT_ID);

  const contracts = myDocuments.filter(d => d.type === 'contract');
  const pendingSignature = contracts.filter(d => !d.isSigned).length;
  const signedCount = contracts.filter(d => d.isSigned).length;

  // Unique types for tabs
  const presentTypes = [...new Set(myDocuments.map(d => d.type))] as DocumentType[];
  const tabs: TabItem[] = [
    { key: 'all', label: 'All', count: myDocuments.length },
    ...presentTypes.map(t => ({ key: t as string, label: USER_DOC_META[t].label, count: myDocuments.filter(d => d.type === t).length })),
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
      <div className="flex flex-col gap-5 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <StatCard size="sm" variant="lime"
            icon={<FileText size={16} />}
            label="Total Documents"
            value={myDocuments.length}
            badge={`${presentTypes.length} type${presentTypes.length !== 1 ? 's' : ''}`}
            badgeLabel="of documents"
          />
          <StatCard size="sm" variant="surface"
            icon={<ShieldCheck size={16} />}
            label="Signed"
            value={signedCount}
            badge={signedCount === contracts.length && contracts.length > 0 ? 'All signed' : `${contracts.length} contract${contracts.length !== 1 ? 's' : ''}`}
            badgeLabel={contracts.length > 0 ? 'total' : 'no contracts'}
          />
          <StatCard size="sm" variant="dark"
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
              <UserDocumentListItem
                key={doc.id}
                document={doc}
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
        <SignDocumentModal
          document={signingDoc}
          onSign={handleSign}
          onClose={() => setSigningDoc(null)}
        />
      )}
    </UserLayout>
  );
};

export default UserDocumentsPage;
