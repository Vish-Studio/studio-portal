import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TemplateBlock, ServiceRow, PaymentRow, PartyInfo } from '../../../data/template-blocks';
import { newId } from '../../../data/template-blocks';

// ─── Shared editor primitives ─────────────────────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{children}</p>
);

const Inp = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-white border border-gray-200 text-gray-900 text-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all ${props.className ?? ''}`}
  />
);

const Txt = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    rows={3}
    {...props}
    className={`w-full bg-white border border-gray-200 text-gray-900 text-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none ${props.className ?? ''}`}
  />
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
  >
    <Plus size={12} />
    {label}
  </button>
);

const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
  >
    <Trash2 size={13} />
  </button>
);

// ─── Party sub-editor ─────────────────────────────────────────────────────────

const PartyEditor = ({
  label, value, onChange,
}: { label: string; value: PartyInfo; onChange: (v: PartyInfo) => void }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
    <div className="space-y-2">
      {(['name', 'email', 'location'] as const).map(f => (
        <Inp
          key={f}
          placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
          value={value[f]}
          onChange={e => onChange({ ...value, [f]: e.target.value })}
        />
      ))}
    </div>
  </div>
);

// ─── BlockEditorPanel ─────────────────────────────────────────────────────────

interface Props {
  block:    TemplateBlock;
  onChange: (updated: TemplateBlock) => void;
}

export default function BlockEditorPanel({ block, onChange }: Props) {
  const upd = (patch: Partial<TemplateBlock>) => onChange({ ...block, ...patch });

  // ── heading / paragraph ──
  if (block.type === 'heading') {
    return (
      <div>
        <Label>Section heading</Label>
        <Inp value={block.content ?? ''} onChange={e => upd({ content: e.target.value })} placeholder="Section Title" />
      </div>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <div>
        <Label>Paragraph text</Label>
        <Txt value={block.content ?? ''} onChange={e => upd({ content: e.target.value })} rows={4} placeholder="Write your paragraph…" />
      </div>
    );
  }

  // ── lists ──
  if (block.type === 'bullet-list' || block.type === 'numbered-list') {
    const items = block.items ?? [];
    const setItems = (next: string[]) => upd({ items: next });
    return (
      <div>
        <Label>{block.type === 'bullet-list' ? 'Bullet list' : 'Numbered list'} items</Label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 w-5 shrink-0 text-right">
                {block.type === 'numbered-list' ? `${i + 1}.` : '•'}
              </span>
              <Inp
                value={item}
                onChange={e => { const n = [...items]; n[i] = e.target.value; setItems(n); }}
                placeholder={`Item ${i + 1}`}
              />
              <RemoveBtn onClick={() => setItems(items.filter((_, j) => j !== i))} />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <AddBtn onClick={() => setItems([...items, ''])} label="Add item" />
        </div>
      </div>
    );
  }

  // ── divider ──
  if (block.type === 'divider') {
    return <p className="text-xs text-gray-400 italic">Divider — no content to edit.</p>;
  }

  // ── parties-header ──
  if (block.type === 'parties-header') {
    const extraDates = block.extraDates ?? [];
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <PartyEditor label="To" value={block.to ?? { name: '', email: '', location: '' }} onChange={v => upd({ to: v })} />
          <PartyEditor label="From" value={block.from ?? { name: '', email: '', location: '' }} onChange={v => upd({ from: v })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Inp value={block.date ?? ''} onChange={e => upd({ date: e.target.value })} placeholder="e.g. 12 December 2024" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Doc label</Label>
              <Inp value={block.docLabel ?? ''} onChange={e => upd({ docLabel: e.target.value })} placeholder="Invoice No." />
            </div>
            <div>
              <Label>Doc number</Label>
              <Inp value={block.docNumber ?? ''} onChange={e => upd({ docNumber: e.target.value })} placeholder="0001" />
            </div>
          </div>
        </div>
        <div>
          <Label>Extra dates</Label>
          <div className="space-y-2">
            {extraDates.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Inp value={d.label} onChange={e => { const n = [...extraDates]; n[i] = { ...d, label: e.target.value }; upd({ extraDates: n }); }} placeholder="Label" className="w-36 shrink-0" />
                <Inp value={d.value} onChange={e => { const n = [...extraDates]; n[i] = { ...d, value: e.target.value }; upd({ extraDates: n }); }} placeholder="Value" />
                <RemoveBtn onClick={() => upd({ extraDates: extraDates.filter((_, j) => j !== i) })} />
              </div>
            ))}
          </div>
          <div className="mt-2">
            <AddBtn onClick={() => upd({ extraDates: [...extraDates, { label: '', value: '' }] })} label="Add date row" />
          </div>
        </div>
      </div>
    );
  }

  // ── service-table ──
  if (block.type === 'service-table') {
    const services = block.services ?? [];
    const updSvc = (rows: ServiceRow[]) => upd({ services: rows });
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
            <input type="checkbox" checked={!!block.showQty} onChange={e => upd({ showQty: e.target.checked })} className="rounded" />
            Show Qty column
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
            <input type="checkbox" checked={!!block.showDiscount} onChange={e => upd({ showDiscount: e.target.checked })} className="rounded" />
            Show Discount
          </label>
        </div>

        {/* Header */}
        <div className={`grid gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${block.showQty ? 'grid-cols-[1fr_80px_60px_80px_28px]' : 'grid-cols-[1fr_80px_80px_28px]'}`}>
          <span>Service</span><span>Cost</span>{block.showQty && <span>Qty</span>}<span>Amount</span><span />
        </div>

        {/* Rows */}
        {services.map((s, i) => (
          <div key={s.id} className={`grid gap-2 items-center ${block.showQty ? 'grid-cols-[1fr_80px_60px_80px_28px]' : 'grid-cols-[1fr_80px_80px_28px]'}`}>
            <Inp value={s.name} onChange={e => { const n = [...services]; n[i] = { ...s, name: e.target.value }; updSvc(n); }} placeholder="Service name" />
            <Inp value={s.cost} onChange={e => { const n = [...services]; n[i] = { ...s, cost: e.target.value }; updSvc(n); }} placeholder="$00" />
            {block.showQty && <Inp value={s.qty} onChange={e => { const n = [...services]; n[i] = { ...s, qty: e.target.value }; updSvc(n); }} placeholder="1" />}
            <Inp value={s.amount} onChange={e => { const n = [...services]; n[i] = { ...s, amount: e.target.value }; updSvc(n); }} placeholder="$00" />
            <RemoveBtn onClick={() => updSvc(services.filter((_, j) => j !== i))} />
          </div>
        ))}

        <AddBtn onClick={() => updSvc([...services, { id: newId(), name: '', cost: '$00', qty: '1', amount: '$00' }])} label="Add service row" />

        {block.showDiscount && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Discount</span>
            <Inp value={block.discount ?? ''} onChange={e => upd({ discount: e.target.value })} placeholder="$00" className="w-28" />
          </div>
        )}
      </div>
    );
  }

  // ── two-column ──
  if (block.type === 'two-column') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Left column label</Label>
          <Inp value={block.leftLabel ?? ''} onChange={e => upd({ leftLabel: e.target.value })} placeholder="e.g. Resources" />
          <Txt value={block.leftContent ?? ''} onChange={e => upd({ leftContent: e.target.value })} placeholder="Left column content…" />
        </div>
        <div className="space-y-2">
          <Label>Right column label</Label>
          <Inp value={block.rightLabel ?? ''} onChange={e => upd({ rightLabel: e.target.value })} placeholder="e.g. Deliverables" />
          <Txt value={block.rightContent ?? ''} onChange={e => upd({ rightContent: e.target.value })} placeholder="Right column content…" />
        </div>
      </div>
    );
  }

  // ── payment-info ──
  if (block.type === 'payment-info') {
    const rows = block.paymentRows ?? [];
    return (
      <div className="space-y-3">
        <Label>Payment info rows</Label>
        {rows.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2">
            <Inp value={r.label} onChange={e => { const n = [...rows]; n[i] = { ...r, label: e.target.value }; upd({ paymentRows: n }); }} placeholder="Label" className="w-32 shrink-0" />
            <Inp value={r.value} onChange={e => { const n = [...rows]; n[i] = { ...r, value: e.target.value }; upd({ paymentRows: n }); }} placeholder="Value" />
            <RemoveBtn onClick={() => upd({ paymentRows: rows.filter((_, j) => j !== i) })} />
          </div>
        ))}
        <AddBtn onClick={() => upd({ paymentRows: [...rows, { id: newId(), label: '', value: '' } as PaymentRow] })} label="Add row" />
      </div>
    );
  }

  // ── signatures ──
  if (block.type === 'signatures') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Left label</Label>
          <Inp value={block.signLeft ?? ''} onChange={e => upd({ signLeft: e.target.value })} placeholder="Client Signature" />
        </div>
        <div>
          <Label>Right label</Label>
          <Inp value={block.signRight ?? ''} onChange={e => upd({ signRight: e.target.value })} placeholder="Contractor Signature" />
        </div>
      </div>
    );
  }

  // ── footer ──
  if (block.type === 'footer') {
    return (
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Name</Label><Inp value={block.footerName ?? ''} onChange={e => upd({ footerName: e.target.value })} placeholder="Your Name" /></div>
        <div><Label>Email</Label><Inp value={block.footerEmail ?? ''} onChange={e => upd({ footerEmail: e.target.value })} placeholder="you@studio.com" /></div>
        <div><Label>Phone</Label><Inp value={block.footerPhone ?? ''} onChange={e => upd({ footerPhone: e.target.value })} placeholder="+00-1111111111" /></div>
      </div>
    );
  }

  return null;
}
