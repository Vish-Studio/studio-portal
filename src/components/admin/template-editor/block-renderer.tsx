import type { TemplateBlock } from '../../../data/template-blocks';

// ─── Shared document micro-styles ────────────────────────────────────────────

const HR   = () => <div className="border-b border-[#C8BFB0] my-0" />;
const Head = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] font-black tracking-[0.22em] uppercase text-center text-gray-800 mb-3">
    {children}
  </h2>
);

// ─── BlockRenderer ────────────────────────────────────────────────────────────

export default function BlockRenderer({ block }: { block: TemplateBlock }) {
  switch (block.type) {

    case 'heading':
      return <Head>{block.content}</Head>;

    case 'paragraph':
      return <p className="text-[13px] leading-[1.75] text-gray-700">{block.content}</p>;

    case 'bullet-list':
      return (
        <ul className="space-y-2">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-700 leading-relaxed">
              <span className="mt-1.75 w-1 h-1 rounded-full bg-gray-700 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'numbered-list':
      return (
        <ol className="space-y-3">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[13px] text-gray-700 leading-relaxed">
              <span className="shrink-0 font-bold text-gray-400 mt-0.5 w-4">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'divider':
      return <HR />;

    case 'parties-header':
      return (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-8">
          {/* To */}
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">To</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              {block.to?.name}<br />{block.to?.email}<br />{block.to?.location}
            </p>
          </div>
          {/* From */}
          <div className="border-l border-[#C8BFB0] pl-8">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">From</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              {block.from?.name}<br />{block.from?.email}<br />{block.from?.location}
            </p>
          </div>
          {/* Dates / doc number */}
          <div className="border-l border-[#C8BFB0] pl-8 flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Date</p>
              <p className="text-[13px] font-semibold text-gray-800">{block.date}</p>
            </div>
            {block.docLabel && (
              <div>
                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">{block.docLabel}</p>
                <p className="text-[13px] font-semibold text-gray-800">{block.docNumber}</p>
              </div>
            )}
            {(block.extraDates ?? []).map((d, i) => (
              <div key={i}>
                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">{d.label}</p>
                <p className="text-[13px] font-semibold text-gray-800">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'service-table': {
      const services = block.services ?? [];
      const total = services.reduce((s, r) => s + (parseFloat(r.amount.replace(/[^0-9.]/g, '')) || 0), 0);
      return (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#C8BFB0]">
              <th className="text-left font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3 w-1/2">Services</th>
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Cost</th>
              {block.showQty && <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Qty</th>}
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="border-b border-[#D8D0C4]">
                <td className="py-3 text-gray-800">{s.name}</td>
                <td className="py-3 text-right text-gray-800">{s.cost}</td>
                {block.showQty && <td className="py-3 text-right text-gray-800">{s.qty}</td>}
                <td className="py-3 text-right text-gray-800">{s.amount}</td>
              </tr>
            ))}
            {block.showDiscount && (
              <tr className="border-b border-[#D8D0C4]">
                <td colSpan={block.showQty ? 2 : 1} />
                <td className="py-2 text-right text-[10px] font-black tracking-[0.12em] uppercase text-gray-500 pr-4">Discount</td>
                <td className="py-2 text-right text-gray-800">{block.discount ?? '$00'}</td>
              </tr>
            )}
            <tr>
              <td colSpan={block.showQty ? 2 : 1} />
              <td className="pt-4 text-right text-[10px] font-black tracking-[0.12em] uppercase text-gray-500 pr-4">Total</td>
              <td className="pt-4 text-right text-[16px] font-bold text-gray-900">
                {total > 0 ? `$${total.toLocaleString()}` : '$00'}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    case 'two-column':
      return (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">{block.leftLabel}</p>
            <p className="text-[13px] text-gray-700 leading-relaxed">{block.leftContent}</p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">{block.rightLabel}</p>
            <p className="text-[13px] text-gray-700 leading-relaxed">{block.rightContent}</p>
          </div>
        </div>
      );

    case 'payment-info':
      return (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#C8BFB0]">
              {(block.paymentRows ?? []).map(r => (
                <th key={r.id} className="text-left font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-2">{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {(block.paymentRows ?? []).map(r => (
                <td key={r.id} className="pt-3 text-gray-800">{r.value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      );

    case 'signatures':
      return (
        <div className="grid grid-cols-2 gap-16">
          {[block.signLeft, block.signRight].map((label, i) => (
            <div key={i}>
              <div className="border-b border-gray-800 mb-2" />
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      );

    case 'footer':
      return (
        <div className="text-right">
          <p className="font-serif text-2xl text-gray-900 mb-1">Thank You!</p>
          <p className="text-[12px] text-gray-500">
            {block.footerName} // {block.footerEmail} // {block.footerPhone}
          </p>
        </div>
      );

    default:
      return null;
  }
}
