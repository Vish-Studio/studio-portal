import TemplateShell, {
  DocDivider, SectionHeading, BodyText, BulletList,
} from '../../components/admin/templates/template-shell';

const SERVICES = [
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
  { name: 'Service Name', cost: '$00', qty: 1, amount: '$1,400' },
];

const TERMS = [
  'The project will follow a milestone payment system i.e. a certain percentage of payment is to be sent after completion after a certain amount of work is done and reviewed by client.',
  'The project shall commence on 15th December 2023 after 25% payment has been sent in advance.',
  'The Client shall pay each invoice within 28 days of receipt.',
  'The quote provided by the Contractor is subjected to change. Any additional services requested by the Client or any changes to the scope of work shall be subject to a revised quote.',
];

export default function QuotationTemplate() {
  return (
    <TemplateShell title="Quotation">
      <div className="px-14 py-12">

        {/* ── Title ── */}
        <h1 className="font-serif text-[56px] font-normal tracking-tight text-gray-900 mb-8 leading-none">
          Quotation
        </h1>

        <DocDivider className="mb-8" />

        {/* ── Header ── */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">To</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              Client Name<br />email@mail.com<br />City, State
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">From</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              My Name<br />email@mail.com<br />City, State
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">Date</p>
            <p className="text-[13px] font-semibold text-gray-800">12 December 2014</p>
          </div>
        </div>

        <DocDivider className="mb-10" />

        {/* ── About project ── */}
        <div className="mb-10">
          <SectionHeading>About Project</SectionHeading>
          <BodyText>
            We aim to empower users with the tools they need to make informed financial decisions and
            reach their financial goals. With features such as real-time spending tracking, personalised
            savings plans, and investment portfolios, our app will provide a comprehensive solution for all of a
            user's financial needs. We are confident that our app will make a meaningful impact in the fintech
            industry, and we are eager to bring this innovative solution to market.
          </BodyText>
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

        {/* ── Terms ── */}
        <div className="mb-10">
          <BulletList items={TERMS} />
        </div>

        <DocDivider className="mb-10" />

        {/* ── Signatures ── */}
        <div className="grid grid-cols-2 gap-16 mb-12">
          <div>
            <div className="border-b border-gray-800 mb-2" />
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500">Client Signature</p>
          </div>
          <div>
            <div className="border-b border-gray-800 mb-2" />
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500">Contractor Signature</p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-right">
          <p className="font-serif text-2xl text-gray-900 mb-1">Thank You!</p>
          <p className="text-[12px] text-gray-500">Your Name // email@email.com // +00-1111111111</p>
        </div>

      </div>
    </TemplateShell>
  );
}
