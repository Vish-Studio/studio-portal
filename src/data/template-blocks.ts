// ─── Block types ──────────────────────────────────────────────────────────────

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'bullet-list'
  | 'numbered-list'
  | 'divider'
  | 'parties-header'
  | 'service-table'
  | 'two-column'
  | 'payment-info'
  | 'signatures'
  | 'footer';

// ─── Sub-shapes ───────────────────────────────────────────────────────────────

export interface PartyInfo {
  name:     string;
  email:    string;
  location: string;
}

export interface ServiceRow {
  id:     string;
  name:   string;
  cost:   string;
  qty:    string;
  amount: string;
}

export interface PaymentRow {
  id:    string;
  label: string;
  value: string;
}

// ─── Block — single flat interface (discriminated via `type`) ─────────────────

export interface TemplateBlock {
  id:   string;
  type: BlockType;

  // heading | paragraph
  content?: string;

  // bullet-list | numbered-list
  items?: string[];

  // parties-header
  to?:         PartyInfo;
  from?:       PartyInfo;
  date?:       string;
  docLabel?:   string; // e.g. "Invoice No."
  docNumber?:  string;
  extraDates?: { label: string; value: string }[];

  // service-table
  services?:     ServiceRow[];
  showQty?:      boolean;
  showDiscount?: boolean;
  discount?:     string;

  // two-column
  leftLabel?:   string;
  leftContent?: string;
  rightLabel?:  string;
  rightContent?: string;

  // payment-info
  paymentRows?: PaymentRow[];

  // signatures
  signLeft?:  string;
  signRight?: string;

  // footer
  footerName?:  string;
  footerEmail?: string;
  footerPhone?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _seq = 0;
export const newId = () => `b_${Date.now()}_${++_seq}`;

const defaultParties = (): { to: PartyInfo; from: PartyInfo } => ({
  to:   { name: 'Client Name',  email: 'client@mail.com',  location: 'City, State' },
  from: { name: 'Your Name',    email: 'you@studio.com',   location: 'City, State' },
});

const defaultServices = (): ServiceRow[] => [
  { id: newId(), name: 'Service Name', cost: '$00', qty: '1', amount: '$1,400' },
  { id: newId(), name: 'Service Name', cost: '$00', qty: '1', amount: '$1,400' },
  { id: newId(), name: 'Service Name', cost: '$00', qty: '1', amount: '$1,400' },
];

const defaultPaymentRows = (): PaymentRow[] => [
  { id: newId(), label: 'Name',   value: 'Your Name'  },
  { id: newId(), label: 'Acc No', value: '12345678'   },
  { id: newId(), label: 'IFSC',   value: '12345678'   },
  { id: newId(), label: 'GST No', value: '000000'     },
  { id: newId(), label: 'UPI',    value: 'name@upi'   },
];

// ─── Default block sets per template slug ─────────────────────────────────────

export function getDefaultBlocks(slug: string): TemplateBlock[] {
  switch (slug) {
    case 'contract':         return contractBlocks();
    case 'invoice':          return invoiceBlocks();
    case 'overdue-invoice':  return overdueInvoiceBlocks();
    case 'project-proposal': return projectProposalBlocks();
    case 'quotation':        return quotationBlocks();
    default:                 return [];
  }
}

function contractBlocks(): TemplateBlock[] {
  const p = defaultParties();
  return [
    { id: newId(), type: 'parties-header', ...p, date: '12 December 2024' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Budget' },
    {
      id: newId(), type: 'service-table',
      services: [
        { id: newId(), name: 'App Illustration', cost: '$700',   qty: '1', amount: '$700'   },
        { id: newId(), name: 'Brand Identity',   cost: '$3,000', qty: '1', amount: '$3,000' },
        { id: newId(), name: 'Wireframes',       cost: '$1,000', qty: '1', amount: '$1,000' },
      ],
      showQty: false, showDiscount: false,
    },
    {
      id: newId(), type: 'bullet-list',
      items: [
        'The Client shall pay the Contractor as follows: (i) 25% upon execution, (ii) 50% at the halfway milestone, and (iii) the remaining 25% upon completion.',
        'The Client shall pay all invoices within 28 days of receipt.',
        'Overdue amounts accrue interest at 15% per annum.',
        'All payments shall be made in the agreed currency.',
      ],
    },
    { id: newId(), type: 'divider' },
    {
      id: newId(), type: 'two-column',
      leftLabel: 'Resources', leftContent: 'Figma, Adobe Photoshop, Adobe Illustrator, Canva, Miro, Jira, Protopie',
      rightLabel: 'Deliverables', rightContent: 'Design System, Wireframes, Prototype, UIs',
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Confidentiality' },
    { id: newId(), type: 'paragraph', content: 'Contractor agrees to keep all information provided by Client strictly confidential and will not disclose any such information to any third parties without the prior written consent of Client. This obligation continues after termination of this Agreement.' },
    { id: newId(), type: 'heading', content: 'Intellectual Rights' },
    { id: newId(), type: 'paragraph', content: 'All work product created as part of this Agreement is the sole property of the Client. The Contractor assigns and transfers to the Client all right, title, and interest including all copyrights, trademarks, and other proprietary rights.' },
    { id: newId(), type: 'heading', content: 'Termination Clause' },
    { id: newId(), type: 'bullet-list', items: ['Either party may terminate upon written notice if the other party breaches any material term.', 'Either party may terminate if the other becomes insolvent or unable to perform.', 'Upon termination, the Contractor shall immediately stop work and deliver all Work Product to the Client.'] },
    { id: newId(), type: 'heading', content: 'Dispute Resolution' },
    { id: newId(), type: 'bullet-list', items: ['Parties agree to negotiate in good faith to resolve any dispute.', 'Unresolved disputes proceed to mediation with a mutually agreed mediator.', 'If mediation fails, disputes are resolved by binding arbitration (AAA rules).'] },
    { id: newId(), type: 'heading', content: 'Revisions' },
    { id: newId(), type: 'bullet-list', items: ['The Client shall have 4 rounds of revisions included in the project fee.', 'Additional revisions are subject to additional charges invoiced within 28 days.'] },
    { id: newId(), type: 'heading', content: 'Force Majeure' },
    { id: newId(), type: 'paragraph', content: 'Neither party shall be liable for failure or delay caused by events beyond their reasonable control, including acts of God, war, natural disasters, or pandemics.' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'signatures', signLeft: 'Client Signature', signRight: 'Contractor Signature' },
    { id: newId(), type: 'footer', footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' },
  ];
}

function invoiceBlocks(): TemplateBlock[] {
  const p = defaultParties();
  return [
    {
      id: newId(), type: 'parties-header', ...p,
      date: '12 December 2024',
      docLabel: 'Invoice No.', docNumber: '0001',
      extraDates: [{ label: 'Due Date', value: '9 January 2025' }],
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'service-table', services: defaultServices(), showQty: true, showDiscount: true, discount: '$00' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Payment Info' },
    { id: newId(), type: 'payment-info', paymentRows: defaultPaymentRows() },
    {
      id: newId(), type: 'bullet-list',
      items: [
        'Invoices are due and payable within 28 days of the invoice date.',
        'A late fee of 20% will be added to all past-due balances.',
        'Accepted forms of payment are listed above.',
      ],
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'footer', footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' },
  ];
}

function overdueInvoiceBlocks(): TemplateBlock[] {
  const p = defaultParties();
  return [
    {
      id: newId(), type: 'parties-header', ...p,
      date: '12 December 2024',
      docLabel: 'Invoice No.', docNumber: '0001',
      extraDates: [{ label: 'Due Date', value: '12 December 2024 // Overdue' }],
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Overdue Notice' },
    { id: newId(), type: 'paragraph', content: 'This invoice has been overdue for 54 days and I kindly request prompt payment. I would like to respectfully remind you of your obligation to make payment in a timely manner. If you could arrange for payment at your earliest convenience, it would be greatly appreciated.' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'service-table', services: defaultServices(), showQty: true, showDiscount: true, discount: '$00' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Payment Info' },
    { id: newId(), type: 'payment-info', paymentRows: defaultPaymentRows() },
    {
      id: newId(), type: 'bullet-list',
      items: [
        'A late fee of 20% will be added to all past-due balances.',
        'Accepted forms of payment are listed above.',
      ],
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'footer', footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' },
  ];
}

function projectProposalBlocks(): TemplateBlock[] {
  const p = defaultParties();
  return [
    { id: newId(), type: 'parties-header', ...p, date: '12 December 2024' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'About Project' },
    { id: newId(), type: 'paragraph', content: 'We aim to empower users with the tools they need to make informed decisions and reach their goals. Our solution will provide a comprehensive platform for all of their needs.' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Objective' },
    { id: newId(), type: 'numbered-list', items: ['Define a single platform for the core user journey.', 'Provide users with the tools they need to make informed decisions.', 'Improve engagement through educational resources and personalised advice.'] },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Approach' },
    { id: newId(), type: 'numbered-list', items: ['Gather information about the target audience to understand their behaviour and preferences.', 'Define the specific features and functionalities the solution will offer.', 'Develop wireframes to define the overall structure and flow.', 'Create a visually appealing interface that aligns with the brand.', 'Conduct user testing to gather feedback and refine the design.'] },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'Benefits for You' },
    { id: newId(), type: 'paragraph', content: 'Focusing on quality design yields improved user experience, enhanced brand identity, boosted user trust, and increased adoption. A well-designed product instils confidence and encourages ongoing engagement.' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'footer', footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' },
  ];
}

function quotationBlocks(): TemplateBlock[] {
  const p = defaultParties();
  return [
    { id: newId(), type: 'parties-header', ...p, date: '12 December 2024' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'heading', content: 'About Project' },
    { id: newId(), type: 'paragraph', content: 'We aim to deliver a high-quality solution that meets your goals and exceeds expectations. This quotation outlines the scope, services, and investment required.' },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'service-table', services: defaultServices(), showQty: true, showDiscount: true, discount: '$00' },
    {
      id: newId(), type: 'bullet-list',
      items: [
        'The project will follow a milestone payment system.',
        'The project commences after 25% advance payment.',
        'The Client shall pay each invoice within 28 days of receipt.',
        'The quote is subject to change if scope changes.',
      ],
    },
    { id: newId(), type: 'divider' },
    { id: newId(), type: 'signatures', signLeft: 'Client Signature', signRight: 'Contractor Signature' },
    { id: newId(), type: 'footer', footerName: 'Your Name', footerEmail: 'you@studio.com', footerPhone: '+00-1111111111' },
  ];
}
