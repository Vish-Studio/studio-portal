import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import CardContent from '../components/common/card-content/card-content';
import StatCard from '../components/common/stat-card/stat-card';
import TableTab, { type TabItem } from '../components/common/table-tab/table-tab';
import { MaterialIcon, StatusBadge } from '@/src/shared/components';
import { useDocumentsStore } from '../store/documents';
import { useTemplateAssignmentsStore } from '../store/template-assignments';
import { useProjectsStore } from '../store/projects';
import { useClientsStore } from '../store/clients';
import { TEMPLATES } from '../data/templates';
import type { StudioDocument, DocumentType } from '../store/documents';
import type { TemplateAssignment } from '../store/template-assignments';

// ─── Document type icons ──────────────────────────────────────────────────────

const DOC_TYPE_ICON: Record<DocumentType, string> = {
  contract:   'draw',
  proposal:   'description',
  invoice:    'receipt',
  quotation:  'request_quote',
  onboarding: 'person_add',
};

const DOC_TYPE_LABEL: Record<DocumentType, string> = {
  contract:   'Contract',
  proposal:   'Proposal',
  invoice:    'Invoice',
  quotation:  'Quotation',
  onboarding: 'Onboarding',
};

// ─── Unified entry shape ──────────────────────────────────────────────────────

type DocStatus =
  | 'awaits-client'    // phase flagged for client, not yet completed
  | 'admin-action'     // admin-owned active phase with a doc
  | 'awaits-signature' // contract not yet signed (StudioDoc)
  | 'signed'           // signed contract
  | 'complete'         // phase done
  | 'pending';         // phase not yet started

interface UnifiedDoc {
  id:           string;
  title:        string;
  source:       'studio' | 'template';
  icon:         string;
  typeLabel:    string;
  projectId?:   string;
  projectName?: string;
  clientName?:  string;
  phaseName?:   string;
  date:         number; // ms timestamp — used for sorting
  status:       DocStatus;
  studioDoc?:   StudioDocument;
  assignment?:  TemplateAssignment;
}

const STATUS_LABEL: Record<DocStatus, string> = {
  'awaits-client':    'Awaits Client',
  'admin-action':     'Admin Action',
  'awaits-signature': 'Awaits Signature',
  'signed':           'Signed',
  'complete':         'Complete',
  'pending':          'Pending',
};

const STATUS_VARIANT: Record<DocStatus, 'violet' | 'amber' | 'purple' | 'green' | 'gray' | 'blue'> = {
  'awaits-client':    'violet',
  'admin-action':     'amber',
  'awaits-signature': 'purple',
  'signed':           'green',
  'complete':         'green',
  'pending':          'gray',
};

type FilterKey = 'all' | DocStatus;

// ─── Documents page ───────────────────────────────────────────────────────────

export default function Documents() {
  const navigate = useNavigate();
  const { documents }   = useDocumentsStore();
  const { assignments } = useTemplateAssignmentsStore();
  const { projects }    = useProjectsStore();
  const { clients }     = useClientsStore();

  const [activeTab, setActiveTab] = useState<FilterKey>('all');

  // ── Build unified list ────────────────────────────────────────────────────

  const unified = useMemo<UnifiedDoc[]>(() => {
    const entries: UnifiedDoc[] = [];

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
      const tpl     = TEMPLATES.find(t => t.slug === a.templateSlug);

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
  }, [documents, assignments, projects, clients]);

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

  const openDoc = (doc: UnifiedDoc) => {
    if (doc.source === 'template' && doc.assignment) {
      navigate(`/admin/projects/${doc.assignment.projectId}/templates/${doc.assignment.id}`);
    } else if (doc.studioDoc) {
      window.open(doc.studioDoc.url, '_blank', 'noreferrer');
    }
  };

  return (
    <DashboardLayout title="Documents">
      <div className="flex flex-col gap-5 pb-10">

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            variant="white"
            icon={<MaterialIcon name="folder" size={16} />}
            label="Total Documents"
            value={unified.length}
            badge={tabCounts['pending'] ?? 0}
            badgeLabel="pending"
          />
          <StatCard
            variant="surface"
            icon={<MaterialIcon name="person_check" size={16} />}
            label="Awaits Client"
            value={tabCounts['awaits-client'] ?? 0}
            badge={tabCounts['awaits-signature'] ?? 0}
            badgeLabel="awaiting signature"
          />
          <StatCard
            variant="lime"
            icon={<MaterialIcon name="edit_document" size={16} />}
            label="Admin Action"
            value={tabCounts['admin-action'] ?? 0}
            badge={filtered.length}
            badgeLabel="visible"
          />
          <StatCard
            variant="dark"
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
                <div
                  key={doc.id}
                  onClick={() => openDoc(doc)}
                  className="flex items-center gap-3 px-4 md:px-6 py-3.5 hover:bg-(--color-surface-subtle) transition-colors cursor-pointer group"
                >
                  {/* Type icon */}
                  <div className="w-9 h-9 rounded-[12px] bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                    <MaterialIcon name={doc.icon} size={16} className="text-gray-500" />
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-(--color-ink) truncate leading-tight">
                        {doc.title}
                      </p>
                      <StatusBadge
                        label={STATUS_LABEL[doc.status]}
                        variant={STATUS_VARIANT[doc.status]}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {/* Type label */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {doc.typeLabel}
                      </span>
                      {/* Project */}
                      {doc.projectName && (
                        <>
                          <span className="text-gray-200 text-[10px]">·</span>
                          <span className="text-[10px] text-gray-400 truncate flex items-center gap-0.5">
                            <MaterialIcon name="work" size={9} />
                            {doc.projectName}
                          </span>
                        </>
                      )}
                      {/* Phase */}
                      {doc.phaseName && (
                        <>
                          <span className="text-gray-200 text-[10px]">·</span>
                          <span className="text-[10px] text-gray-400 truncate flex items-center gap-0.5">
                            <MaterialIcon name="route" size={9} />
                            {doc.phaseName}
                          </span>
                        </>
                      )}
                      {/* Client */}
                      {doc.clientName && (
                        <>
                          <span className="text-gray-200 text-[10px]">·</span>
                          <span className="text-[10px] text-gray-400 truncate">
                            {doc.clientName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <span className="hidden sm:block text-[11px] text-gray-400 shrink-0 tabular-nums">
                    {format(doc.date, 'MMM d, yyyy')}
                  </span>

                  {/* Open arrow */}
                  <MaterialIcon
                    name="arrow_outward"
                    size={14}
                    className="text-gray-300 group-hover:text-gray-600 transition-colors shrink-0"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        )}

      </div>
    </DashboardLayout>
  );
}
