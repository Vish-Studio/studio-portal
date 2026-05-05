import BlockRenderer from '../template-editor/block-renderer';
import TemplateHeader from '@/src/pages/templates/template-header/template-header';
import TemplateFooter from '@/src/pages/templates/template-footer/template-footer';
import { DocDivider } from './template-shell';
import type { TemplateBlock } from '@/src/data/template-blocks';

const templateTitle = (slug: string, fallback: string) => {
  if (slug === 'project-proposal') return 'Proposal';
  if (slug === 'overdue-invoice') return 'Overdue Invoice';
  return fallback;
};

function LockedInvoiceHeader({
  overdue = false,
  clientName,
  clientEmail,
}: {
  overdue?: boolean;
  clientName: string;
  clientEmail: string;
}) {
  const title = overdue ? <>Overdue<br />Invoice</> : 'Invoice';

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <h1 className={`${overdue ? 'text-[44px] leading-tight' : 'text-[56px] leading-none'} font-serif font-normal tracking-tight text-gray-900`}>
          {title}
        </h1>
        <div className="text-right mt-2">
          <p className="text-[11px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Invoice No.</p>
          <p className="text-[20px] font-bold text-gray-900 tracking-wider">0000</p>
        </div>
      </div>

      <DocDivider className="mb-8" />

      <div className="grid grid-cols-[1fr_auto_1fr] gap-8 mb-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">Billed To</p>
          <p className="text-[13px] text-gray-800 leading-relaxed">
            {clientName}<br />{clientEmail}<br />Mauritius
          </p>
        </div>
        <div className="border-l border-[#C8BFB0] pl-8">
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">From</p>
          <p className="text-[13px] text-gray-800 leading-relaxed">
            Vishroy Seenarain<br />hello@vish.studio<br />Grand Gaube, Mauritius
          </p>
        </div>
        <div className="border-l border-[#C8BFB0] pl-8">
          <div className="mb-3">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Issued Date</p>
            <p className="text-[13px] font-semibold text-gray-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Due Date</p>
            <p className="text-[13px] font-semibold text-gray-800">
              TBD {overdue && <span className="text-red-600 font-bold">// Overdue</span>}
            </p>
          </div>
        </div>
      </div>

      <DocDivider className="mb-8" />
    </>
  );
}

export default function ProjectTemplateDocument({
  slug,
  title,
  blocks,
  selectedBlockId,
  onSelectBlock,
  clientName = 'Client Name',
  clientEmail = 'client@email.com',
}: {
  slug: string;
  title: string;
  blocks: TemplateBlock[];
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  clientName?: string;
  clientEmail?: string;
}) {
  return (
    <div className="bg-[#F5EFE4] mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="px-14 py-12">
        {slug === 'invoice' || slug === 'overdue-invoice' ? (
          <LockedInvoiceHeader overdue={slug === 'overdue-invoice'} clientName={clientName} clientEmail={clientEmail} />
        ) : (
          <TemplateHeader
            title={templateTitle(slug, title)}
            clientInfo={{ name: clientName, email: clientEmail, city: 'Mauritius' }}
          />
        )}

        <div className="flex flex-col gap-6">
          {blocks.map(block => {
            const selectable = !!onSelectBlock;
            return (
              <div
                key={block.id}
                onClick={() => onSelectBlock?.(block.id)}
                className={`${selectable ? 'cursor-pointer' : ''} transition-all rounded-lg print:cursor-default print:rounded-none ${
                  selectedBlockId === block.id
                    ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-[#F5EFE4]'
                    : selectable ? 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 hover:ring-offset-[#F5EFE4]' : ''
                }`}
              >
                <BlockRenderer block={block} />
              </div>
            );
          })}
        </div>

        <DocDivider className="my-8" />
        <TemplateFooter />
      </div>
    </div>
  );
}
