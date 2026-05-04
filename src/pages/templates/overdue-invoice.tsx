import TemplateShell, {
  DocDivider, SectionHeading, BulletList,
} from '../../components/admin/templates/template-shell';
import TemplateFooter from './template-footer/template-footer';

const SERVICES = [
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
];

const TERMS = [
  'A late fee of 20% will be added to all past due balances.',
  'Accepted forms of payments have been mentioned above.',
  'If you have any questions regarding your invoice, please contact at email@email.com',
];

export default function OverdueInvoiceTemplate() {
  return (
    <TemplateShell title="Overdue Invoice">
      <div className="px-14 py-12">

        {/* //TODO: use template header variant for invoice here */}
        {/* ── Title row ── */}
        <div className="flex items-start justify-between mb-8">
          <h1 className="font-serif text-[44px] font-normal tracking-tight text-gray-900 leading-tight">
            Overdue<br />Invoice
          </h1>
          <div className="text-right mt-2">
            <p className="text-[11px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Invoice No.</p>
            <p className="text-[20px] font-bold text-gray-900 tracking-wider">0000</p>
          </div>
        </div>

        <DocDivider className="mb-8" />

        {/* ── Header ── */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-8 mb-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">Billed To</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              Client Name<br />email@mail.com<br />City, State
            </p>
          </div>
          <div className="border-l border-[#C8BFB0] pl-8">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">From</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              My Name<br />email@mail.com<br />City, State
            </p>
          </div>
          <div className="border-l border-[#C8BFB0] pl-8">
            <div className="mb-3">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Issued Date</p>
              <p className="text-[13px] font-semibold text-gray-800">12 December 2014</p>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-1">Due Date</p>
              <p className="text-[13px] font-semibold text-gray-800">
                12 December 2014 <span className="text-red-600 font-bold">// Overdue</span>
              </p>
            </div>
          </div>
        </div>

        <DocDivider className="mb-8" />

        {/* ── Overdue notice ── */}
        <div className="mb-8">
          <p className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
            This invoice has been overdue for 54 days and I kindly request prompt payment.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-700">
            I would like to respectfully remind you of your obligation to make payment in a timely manner.
            I understand that sometimes things can fall through the cracks, but I want to ensure that this
            invoice is a priority and that payment is made as soon as possible. I would be happy to discuss
            any questions or concerns you may have regarding the invoice.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-700 mt-2">
            If you could arrange for payment at your earliest convenience, it would be greatly appreciated.
          </p>
        </div>

        <DocDivider className="mb-8" />

        {/* ── Services table ── */}
        <table className="w-full mb-2 text-[13px]">
          <thead>
            <tr className="border-b border-[#C8BFB0]">
              <th className="text-left font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3 w-1/2">Services</th>
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Cost</th>
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Quantity</th>
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s, i) => (
              <tr key={i} className="border-b border-[#D8D0C4]">
                <td className="py-3.5 text-gray-800">{s.name}</td>
                <td className="py-3.5 text-right text-gray-800">{s.cost}</td>
                <td className="py-3.5 text-right text-gray-800">{s.qty}</td>
                <td className="py-3.5 text-right text-gray-800">{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals ── */}
        <div className="flex justify-end mb-10">
          <div className="w-56">
            <div className="flex justify-between py-2 text-[13px]">
              <span className="font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 self-center">Subtotal</span>
              <span className="text-gray-800">$00</span>
            </div>
            <div className="flex justify-between py-2 text-[13px] border-b border-[#C8BFB0]">
              <span className="font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 self-center">Discount</span>
              <span className="text-gray-800">$00</span>
            </div>
            <div className="flex justify-between pt-3 text-[13px]">
              <span className="font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 self-center">Total</span>
              <span className="text-[16px] font-bold text-gray-900">$00</span>
            </div>
          </div>
        </div>

        <DocDivider className="mb-8" />

        {/* ── Payment info ── */}
        <SectionHeading>Payment Info</SectionHeading>

        <table className="w-full mb-8 text-[13px]">
          <thead>
            <tr className="border-b border-[#C8BFB0]">
              {['Name', 'Acc No', 'IFSC', 'GST No', 'UPI'].map(h => (
                <th key={h} className="text-left font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pt-3 text-gray-800">Your Name</td>
              <td className="pt-3 text-gray-800">12345678</td>
              <td className="pt-3 text-gray-800">12345678</td>
              <td className="pt-3 text-gray-800">000000</td>
              <td className="pt-3 text-gray-800">name@upi</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-10">
          <BulletList items={TERMS} />
        </div>

        <DocDivider className="mb-8" />

        {/* ── Footer ── */}
        <TemplateFooter />

      </div>
    </TemplateShell>
  );
}
