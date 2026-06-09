import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import CardContent from '@/src/shared/components/card-content/card-content';
import StatCard from '@/src/shared/components/stat-card/stat-card';
import TableTab, { type TabItem } from '@/src/shared/components/table-tab/table-tab';
import { MaterialIcon } from '@/src/shared/components';
import { useDocumentsStore } from '../stores/documentStore';
import { useDocumentTemplatesStore, useTemplateAssignmentsStore } from '@/src/features/templates';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import DocumentListItem, {
  DOC_TYPE_ICON,
  DOC_TYPE_LABEL,
  type DocStatus,
  type UnifiedDocumentListItem,
} from '../components/document-list-item/document-list-item';

type FilterKey = 'all' | DocStatus;

// ─── Documents page ───────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { documents }   = useDocumentsStore();
  const { assignments } = useTemplateAssignmentsStore();
  const templateDefs = useDocumentTemplatesStore(state => state.templates);
  const { projects }    = useProjectsStore();
  const { clients }     = useClientsStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');

  // ── Build unified list ────────────────────────────────────────────────────

  const unified = useMemo<UnifiedDocumentListItem[]>(() => {
    const entries: UnifiedDocumentListItem[] = [];

    // 1. StudioDocuments
    for (const doc of documents) {
      const client  = clients.find(c => c.id === doc.clientId);
      const isContract = doc.type === 'contract';
      let status: DocStatus = 'pending';
      if (isContract && doc.isSigned)  status = 'signed';
      else if (isContract && !doc.isSigned) status = 'awaits-signature';
      else status = 'complete'; // proposals, invoices etc.

      entries.push({
        id:          doc.id,
        title:       doc.title,
        source:      'studio',
        icon:        DOC_TYPE_ICON[doc.type] ?? 'description',
        typeLabel:   DOC_TYPE_LABEL[doc.type] ?? doc.type,
        clientName:  client?.fullName,
        date:        doc.createdAt.toMillis(),
        status,
        studioDoc:   doc,
      });
    }

    // 2. TemplateAssignments (project template docs)
    for (const a of assignments) {
      const project = projects.find(p => p.id === a.projectId);
      if (!project) continue;

      const phase   = project.phases.find(ph => ph.id === a.phaseKey);
      const client  = clients.find(c => c.id === project.clientId);
      const tpl     = templateDefs.find(t => t.slug === a.templateSlug);

      let status: DocStatus = 'pending';
      if (phase) {
        if (phase.status === 'done') {
          status = 'complete';
        } else if (phase.status === 'active') {
          status = phase.requiresClientAction && !phase.clientCompleted
            ? 'awaits-client'
            : 'admin-action';
        } else {
          status = 'pending';
        }
      }

      entries.push({
        id:          a.id,
        title:       a.documentTitle,
        source:      'template',
        icon:        tpl?.icon ?? 'edit_document',
        typeLabel:   tpl?.title ?? 'Document',
        projectId:   project.id,
        projectName: project.name,
        clientName:  client?.fullName,
        phaseName:   phase?.title,
        date:        a.updatedAt,
        status,
        assignment:  a,
      });
    }

    // Sort most recent first
    return entries.sort((a, b) => b.date - a.date);
  }, [documents, assignments, projects, clients, templateDefs]);

  // ── Tab counts ────────────────────────────────────────────────────────────

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: unified.length };
    for (const doc of unified) {
      counts[doc.status] = (counts[doc.status] ?? 0) + 1;
    }
    return counts;
  }, [unified]);

  const tabs: TabItem[] = [
    { key: 'all',             label: 'All',             count: tabCounts['all'] ?? 0 },
    { key: 'awaits-client',   label: 'Awaits Client',   count: tabCounts['awaits-client'] ?? 0 },
    { key: 'admin-action',    label: 'Admin Action',    count: tabCounts['admin-action'] ?? 0 },
    { key: 'awaits-signature',label: 'Awaits Signature',count: tabCounts['awaits-signature'] ?? 0 },
    { key: 'signed',          label: 'Signed',          count: tabCounts['signed'] ?? 0 },
    { key: 'complete',        label: 'Complete',        count: tabCounts['complete'] ?? 0 },
  ].filter(t => t.key === 'all' || (t.count ?? 0) > 0);

  const filtered = activeTab === 'all'
    ? unified
    : unified.filter(d => d.status === activeTab);

  // ── Actions ───────────────────────────────────────────────────────────────

  const openDoc = (doc: UnifiedDocumentListItem) => {
    if (doc.source === 'template' && doc.assignment) {
      navigate(`/admin/projects/${doc.assignment.projectId}/templates/${doc.assignment.id}`);
    } else if (doc.studioDoc) {
      window.open(doc.studioDoc.url, '_blank', 'noreferrer');
    }
  };

  return (
    <DashboardLayout title="Documents">
      <div className="flex flex-col gap-5 pb-10">

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard size="sm" variant="lime"
            icon={<MaterialIcon name="folder" size={16} />}
            label="Total Documents"
            value={unified.length}
            badge={tabCounts['pending'] ?? 0}
            badgeLabel="pending"
          />
          <StatCard size="sm" variant="surface"
            icon={<MaterialIcon name="person_check" size={16} />}
            label="Awaits Client"
            value={tabCounts['awaits-client'] ?? 0}
            badge={tabCounts['awaits-signature'] ?? 0}
            badgeLabel="awaiting signature"
          />
          <StatCard size="sm" variant="white"
            icon={<MaterialIcon name="edit_document" size={16} />}
            label="Admin Action"
            value={tabCounts['admin-action'] ?? 0}
            badge={filtered.length}
            badgeLabel="visible"
          />
          <StatCard size="sm" variant="dark"
            icon={<MaterialIcon name="verified" size={16} />}
            label="Completed"
            value={(tabCounts['signed'] ?? 0) + (tabCounts['complete'] ?? 0)}
            badge={tabCounts['signed'] ?? 0}
            badgeLabel="signed"
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
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <MaterialIcon name="folder_open" size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No documents found</p>
          </div>
        ) : (
          <CardContent
            iconName="folder"
            title={`${filtered.length} document${filtered.length !== 1 ? 's' : ''}`}
          >
            <div className="divide-y divide-gray-100">
              {filtered.map(doc => (
                <DocumentListItem
                  key={doc.id}
                  document={doc}
                  onOpen={openDoc}
                />
              ))}
            </div>
          </CardContent>
        )}

      </div>
    </DashboardLayout>
  );
}
