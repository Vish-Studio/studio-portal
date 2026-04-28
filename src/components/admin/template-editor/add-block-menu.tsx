import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { BlockType, TemplateBlock } from '../../../data/template-blocks';
import { newId } from '../../../data/template-blocks';

// ─── Block type catalogue ─────────────────────────────────────────────────────

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: 'heading',        icon: 'title',        label: 'Heading',         description: 'Section heading in caps' },
  { type: 'paragraph',      icon: 'notes',        label: 'Paragraph',       description: 'Body text block' },
  { type: 'bullet-list',    icon: 'list',         label: 'Bullet list',     description: 'Unordered list' },
  { type: 'numbered-list',  icon: 'format_list_numbered', label: 'Numbered list', description: 'Ordered list' },
  { type: 'divider',        icon: 'horizontal_rule', label: 'Divider',      description: 'Horizontal separator line' },
  { type: 'parties-header', icon: 'contacts',     label: 'Parties header',  description: 'To / From / Date columns' },
  { type: 'service-table',  icon: 'table_chart',  label: 'Service table',   description: 'Line items with totals' },
  { type: 'two-column',     icon: 'view_column',  label: 'Two column',      description: 'Side-by-side content' },
  { type: 'payment-info',   icon: 'payments',     label: 'Payment info',    description: 'Payment details table' },
  { type: 'signatures',     icon: 'draw',         label: 'Signatures',      description: 'Signature lines' },
  { type: 'footer',         icon: 'sentiment_satisfied', label: 'Footer',   description: '"Thank you" footer' },
];

// ─── Default content for a new block ─────────────────────────────────────────

function makeNewBlock(type: BlockType): TemplateBlock {
  const id = newId();
  switch (type) {
    case 'heading':        return { id, type, content: 'New Section' };
    case 'paragraph':      return { id, type, content: '' };
    case 'bullet-list':    return { id, type, items: [''] };
    case 'numbered-list':  return { id, type, items: [''] };
    case 'divider':        return { id, type };
    case 'parties-header': return { id, type, to: { name: '', email: '', location: '' }, from: { name: '', email: '', location: '' }, date: '' };
    case 'service-table':  return { id, type, services: [{ id: newId(), name: '', cost: '$00', qty: '1', amount: '$00' }], showQty: true, showDiscount: false };
    case 'two-column':     return { id, type, leftLabel: '', leftContent: '', rightLabel: '', rightContent: '' };
    case 'payment-info':   return { id, type, paymentRows: [{ id: newId(), label: 'Name', value: '' }] };
    case 'signatures':     return { id, type, signLeft: 'Client Signature', signRight: 'Contractor Signature' };
    case 'footer':         return { id, type, footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' };
  }
}

// ─── AddBlockMenu ─────────────────────────────────────────────────────────────

interface Props {
  onAdd: (block: TemplateBlock) => void;
}

export default function AddBlockMenu({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const pick = (type: BlockType) => {
    onAdd(makeNewBlock(type));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex justify-center my-1 group">
      {/* Trigger line + button */}
      <div className="flex items-center gap-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex-1 h-px bg-gray-200" />
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
            open
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <Plus size={11} strokeWidth={2.5} />
          Add block
        </button>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden w-72">
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Insert block</p>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            {BLOCK_OPTIONS.map(opt => (
              <button
                key={opt.type}
                type="button"
                onClick={() => pick(opt.type)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="material-symbols-rounded text-gray-400 text-[18px]">{opt.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-[11px] text-gray-400">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
