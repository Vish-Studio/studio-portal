import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, ChevronUp, ChevronDown, Printer, Check } from '@/src/shared/components/material-icon/material-lucide-icons';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import BlockEditorPanel from '../components/editor/block-editor-panel';
import AddBlockMenu from '../components/editor/add-block-menu';
import ConfirmDialog from '@/src/shared/components/confirm-dialog/confirm-dialog';
import { useTemplateAssignmentsStore } from '../stores/templateAssignmentsStore';
import { useDocumentTemplatesStore } from '../stores/documentTemplatesStore';
import { useProjectsStore } from '@/src/features/projects';
import { useClientsStore } from '@/src/features/clients';
import { getDefaultBlocks } from '../templateBlocks';
import ProjectTemplateDocument from '../components/document/project-template-document';
import type { BlockType, TemplateBlock } from '../templateBlocks';

const LOCKED_TEMPLATE_BLOCKS: BlockType[] = ['parties-header', 'footer'];

const editableBlocksOnly = (items: TemplateBlock[]) =>
  items.filter(block => !LOCKED_TEMPLATE_BLOCKS.includes(block.type));

// ─── TemplateEditor Page ──────────────────────────────────────────────────────

export default function TemplateEditorPage() {
  const { projectId, assignmentId } = useParams<{ projectId: string; assignmentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { projects }                                         = useProjectsStore();
  const { clients }                                          = useClientsStore();
  const { assignments, addAssignment, updateAssignment }     = useTemplateAssignmentsStore();
  const templateDefs                                         = useDocumentTemplatesStore(state => state.templates);

  const project = projects.find(p => p.id === projectId);
  const client = project ? clients.find(c => c.id === project.clientId) : null;

  // Determine if creating new or editing existing
  const isNew   = assignmentId === 'new';
  const phaseKey  = searchParams.get('phase');
  const templateSlug = searchParams.get('template') ?? 'contract';
  const tplMeta  = templateDefs.find(t => t.slug === templateSlug);

  const existing = isNew ? null : assignments.find(a => a.id === assignmentId);
  const currentTemplateSlug = existing?.templateSlug ?? templateSlug;
  const currentTplMeta = templateDefs.find(t => t.slug === currentTemplateSlug);

  // ── Local block state ──
  const [blocks,       setBlocks]       = useState<TemplateBlock[]>([]);
  const [docTitle,     setDocTitle]     = useState('');
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [saved,        setSaved]        = useState(false);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [titleEditing, setTitleEditing] = useState(false);

  // ── Initialise ──
  useEffect(() => {
    if (existing) {
      setBlocks(editableBlocksOnly(existing.blocks));
      setDocTitle(existing.documentTitle);
    } else if (isNew && templateSlug) {
      setBlocks(editableBlocksOnly(getDefaultBlocks(templateSlug)));
      setDocTitle(tplMeta?.title ?? 'Document');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]);

  // ── Block mutations ──
  const updateBlock = useCallback((updated: TemplateBlock) => {
    setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
  }, []);

  const addBlockAfter = (afterId: string | null, block: TemplateBlock) => {
    setBlocks(prev => {
      if (afterId === null) return [...prev, block];
      const idx = prev.findIndex(b => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, block);
      return next;
    });
    setEditingId(block.id);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveBlock = (id: string, dir: 'up' | 'down') => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (dir === 'up' && idx === 0) return prev;
      if (dir === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  // ── Save ──
  const handleSave = () => {
    if (!projectId) return;
    const now = Date.now();
    const saveBlocks = editableBlocksOnly(blocks);

    if (isNew && phaseKey) {
      addAssignment({
        id:            `ta_${now}`,
        projectId,
        phaseKey,
        templateSlug,
        documentTitle: docTitle,
        blocks: saveBlocks,
        createdAt:     now,
        updatedAt:     now,
      });
    } else if (existing) {
      updateAssignment(existing.id, { blocks: saveBlocks, documentTitle: docTitle });
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate(`/admin/projects/${projectId}`);
    }, 800);
  };

  // ── Topbar breadcrumb ──
  const topbarActions = (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Link to="/admin/projects" className="hover:text-gray-700 transition-colors">Projects</Link>
      <span>/</span>
      <Link to={`/admin/projects/${projectId}`} className="hover:text-gray-700 transition-colors truncate max-w-32">
        {project?.name ?? '…'}
      </Link>
      <span>/</span>
      <span className="text-gray-700 font-semibold truncate max-w-40">{docTitle}</span>
    </div>
  );

  if (!project) {
    return (
      <DashboardLayout title="Template Editor" hideSearch>
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 font-medium">Project not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="" hideSearch topbarActions={topbarActions}>

      {/* ── Page toolbar ── */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/projects/${projectId}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </Link>

          {/* Editable document title */}
          {titleEditing ? (
            <input
              autoFocus
              value={docTitle}
              onChange={e => setDocTitle(e.target.value)}
              onBlur={() => setTitleEditing(false)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setTitleEditing(false); }}
              className="text-lg font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          ) : (
            <button
              type="button"
              onClick={() => setTitleEditing(true)}
              className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-gray-600 transition-colors group"
            >
              {docTitle}
              <Pencil size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          )}

          {/* Phase badge — look up from the project's phases array */}
          {(() => {
            const pid = phaseKey ?? existing?.phaseKey;
            const phase = pid ? project?.phases.find(p => p.id === pid) : null;
            if (!phase) return null;
            return (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                <span className="material-symbols-rounded text-[14px]">{phase.icon}</span>
                {phase.title}
              </span>
            );
          })()}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Printer size={13} />
            Print
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {saved ? <><Check size={14} />Saved</> : isNew ? 'Save to Project' : 'Save & Close'}
          </button>
        </div>
      </div>

      {/* ── Two-panel layout: editor left, document right ── */}
      <div className="flex flex-col xl:flex-row gap-5 pb-12">

        {/* ── Block list (editor panel) ── */}
        <div className="xl:w-96 shrink-0 flex flex-col gap-1 print:hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Blocks</p>

          {/* First add-slot */}
          <AddBlockMenu onAdd={b => addBlockAfter(null, b)} />

          {blocks.map((block, idx) => {
            const isEditing = editingId === block.id;
            return (
              <div key={block.id}>
                {/* Block card */}
                <div
                  className={`rounded-2xl border transition-all ${
                    isEditing
                      ? 'border-gray-900 bg-white shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : block.id)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                    >
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        {block.type.replace(/-/g, ' ')}
                      </span>
                      {block.type === 'heading' && block.content && (
                        <span className="text-xs text-gray-500 truncate">— {block.content}</span>
                      )}
                    </button>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(block.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Inline editor */}
                  {isEditing && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <BlockEditorPanel
                        block={block}
                        onChange={updateBlock}
                      />
                    </div>
                  )}
                </div>

                {/* Add-block slot after each block */}
                <AddBlockMenu onAdd={b => addBlockAfter(block.id, b)} />
              </div>
            );
          })}
        </div>

        {/* ── Document preview ── */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1 print:hidden">Preview</p>
          <ProjectTemplateDocument
            slug={currentTemplateSlug}
            title={currentTplMeta?.title ?? docTitle}
            blocks={blocks}
            selectedBlockId={editingId}
            onSelectBlock={setEditingId}
            clientName={client?.fullName ?? 'Client Name'}
            clientEmail={client?.email ?? 'client@email.com'}
          />
        </div>
      </div>

      {/* ── Delete block confirmation ── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remove block"
        message="This block will be removed from the document."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => { if (deleteId) removeBlock(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardLayout>
  );
}
