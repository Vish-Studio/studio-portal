import TemplateShell, {
  DocDivider, SectionHeading, BodyText, BulletList,
} from '../../components/admin/templates/template-shell';

const PAYMENT_TERMS = [
  'The Client shall pay the Contractor as follows: (i) 25% of the total project fee upon execution of this Agreement, which shall be refundable in the event of termination of this Agreement by the Client prior to the completion of the Work Product, (ii) 50% of the total project fee upon completion of the halfway milestone of the Work Product, and (iii) the remaining 25% of the total project fee upon completion of the Work Product.',
  'The Client shall pay all invoices within 28 days of receipt.',
  'If the Client fails to pay any invoices when due, the Contractor may, in addition to any other rights and remedies, charge interest on the overdue amount at the rate of 15%.',
  'All payments made by the Client under this Agreement shall be in INR.',
];

const SECTIONS = [
  {
    title: 'Confidentiality',
    paragraphs: [
      'Contractor agrees to keep all information provided by Client, including but not limited to business plans, financial information, marketing strategies, and any other proprietary or confidential information, strictly confidential and will not disclose any such information to any third parties without the prior written consent of Client. This obligation of confidentiality will continue to apply even after the termination of this Agreement.',
      'Contractor will use commercially reasonable efforts to protect the confidentiality of the confidential information, including implementing appropriate security measures and limiting access to authorized personnel only.',
      'Contractor may only use the confidential information for the purpose of completing the services described in this Agreement and will not use the confidential information for any other purpose without the prior written consent of Client.',
      'Contractor may only disclose the confidential information as required by law or legal process, provided that Contractor promptly informs Client of such requirement and cooperates with Client in any efforts to seek a protective order or other appropriate remedy.',
    ],
  },
  {
    title: 'Intellectual Rights',
    paragraphs: [
      'The Contractor acknowledges that any and all work product created as part of this Agreement, including but not limited to all designs, drawings, specifications, software, and other materials produced by the Contractor, is the sole property of the Client and the Contractor shall have no right, title or interest in or to the Work Product except as expressly set forth in this Agreement.',
      "The Contractor hereby assigns and transfers to the Client all right, title, and interest in and to the Work Product, including without limitation all copyrights, trademarks, trade names, and other proprietary rights. The Contractor agrees to execute any and all documents and perform any and all acts necessary or desirable to evidence or effectuate the assignment and transfer of such rights to the Client.",
      "The Contractor acknowledges that the Client shall have the right to use the Work Product for any purpose, including without limitation, for the Client's business, advertising, promotion and trade. The Contractor shall not use the Work Product for any other purpose without the Client's prior written consent.",
    ],
  },
  {
    title: 'Termination Clause',
    paragraphs: [
      'Either party may terminate this Agreement at any time upon written notice to the other party if the other party breaches any material term or condition of this Agreement.',
      'Either party may terminate this Agreement at any time upon written notice to the other party if the other party becomes insolvent or otherwise unable to perform its obligations under this Agreement.',
      "Upon termination of this Agreement for any reason, the Contractor shall immediately stop work and deliver to the Client any and all Work Product and other materials in the Contractor's possession or control that relate to the project.",
      'The termination of this Agreement shall not affect the rights and obligations of the parties accruing prior to the date of termination.',
    ],
  },
  {
    title: 'Dispute Resolution',
    paragraphs: [
      'In the event of any dispute arising under or in connection with this Agreement, the parties agree to negotiate in good faith to resolve the dispute.',
      'If the parties are unable to resolve the dispute through negotiation, the dispute shall be resolved through mediation, with a mutually agreed upon mediator.',
      'If the parties are unable to resolve the dispute through mediation, the dispute shall be finally resolved by binding arbitration, in accordance with the rules of the American Arbitration Association.',
    ],
  },
  {
    title: 'Revisions',
    paragraphs: [
      'The Client may request revisions during the project. The Contractor shall use commercially reasonable efforts to make such revisions within a reasonable time frame.',
      'The Client shall have 4 rounds of revisions included in the project fee. Any additional revisions requested by the Client shall be subject to additional charges.',
      'The Contractor shall have the right to invoice the Client for any additional charges incurred in making revisions requested by the Client, and the Client shall pay such invoices within 28 days of receipt.',
      'The Contractor shall not be required to make any revisions that would result in the creation of a new and distinct project or require additional compensation.',
    ],
  },
  {
    title: 'Force Majeure',
    paragraphs: [
      'Neither party shall be liable for any failure or delay in performance under this Agreement to the extent such failure or delay is caused by events beyond the reasonable control of such party, including but not limited to acts of God, war, civil unrest, acts of terrorism, natural disasters, pandemics, and power or communication failures. If any such event occurs, the affected party shall promptly notify the other party and shall use commercially reasonable efforts to minimize the impact of such event on the performance of its obligations under this Agreement.',
    ],
  },
];

export default function ContractTemplate() {
  return (
    <TemplateShell title="Contract">
      <div className="px-14 py-12">

        {/* ── Title ── */}
        <h1 className="font-serif text-[56px] font-normal tracking-tight text-gray-900 mb-8 leading-none">
          Contract
        </h1>

        <DocDivider className="mb-8" />

        {/* ── Header: To / From / Date ── */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">To</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              Client Name<br />
              email@mail.com<br />
              City, State
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">From</p>
            <p className="text-[13px] text-gray-800 leading-relaxed">
              My Name<br />
              email@mail.com<br />
              City, State
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">Date</p>
            <p className="text-[13px] font-semibold text-gray-800">12 December 2014</p>
          </div>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Budget ── */}
        <SectionHeading>Budget</SectionHeading>

        <table className="w-full mb-6 text-[13px]">
          <thead>
            <tr className="border-b border-[#C8BFB0]">
              <th className="text-left font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-2">Services</th>
              <th className="text-right font-black tracking-[0.12em] uppercase text-[10px] text-gray-500 pb-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['App Illustration', '$700'],
              ['Brand Identity', '$3,000'],
              ['Wireframes', '$1,000'],
            ].map(([service, cost]) => (
              <tr key={service} className="border-b border-[#D8D0C4]">
                <td className="py-3 text-gray-800">{service}</td>
                <td className="py-3 text-right text-gray-800">{cost}</td>
              </tr>
            ))}
            <tr>
              <td className="pt-4" />
              <td className="pt-4 text-right">
                <span className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mr-4">Total</span>
                <span className="text-[15px] font-bold text-gray-900">$4,700</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mb-8">
          <BulletList items={PAYMENT_TERMS} />
        </div>

        <DocDivider className="mb-8" />

        {/* ── Resources / Deliverables ── */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-3">Resources</p>
            <BodyText>Figma, Adobe Photoshop, Adobe Illustrator, Canva, Miro, Jira, Protopie</BodyText>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-3">Deliverables</p>
            <BodyText>Design System, Wireframes, Prototype, UIs</BodyText>
          </div>
        </div>

        <DocDivider className="mb-10" />

        {/* ── Legal sections ── */}
        {SECTIONS.map(section => (
          <div key={section.title} className="mb-10">
            <SectionHeading>{section.title}</SectionHeading>
            <div className="space-y-4">
              {section.paragraphs.map((p, i) => (
                <BodyText key={i}>{p}</BodyText>
              ))}
            </div>
          </div>
        ))}

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
        <div className="text-center">
          <p className="font-serif text-2xl text-gray-900 mb-2">Thank You!</p>
          <p className="text-[12px] text-gray-500">Your Name // email@email.com // +00-1111111111</p>
        </div>

      </div>
    </TemplateShell>
  );
}
