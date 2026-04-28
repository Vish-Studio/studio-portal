export interface TemplateDefinition {
  slug:        string;
  title:       string;
  description: string;
  icon:        string; // Material Symbol name
  path:        string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    slug:        'contract',
    title:       'Contract',
    description: 'Full service agreement with payment terms, IP rights, confidentiality, and dispute resolution clauses.',
    icon:        'handshake',
    path:        '/admin/templates/contract',
  },
  {
    slug:        'invoice',
    title:       'Invoice',
    description: 'Clean itemised invoice with services, costs, payment info, and terms.',
    icon:        'receipt_long',
    path:        '/admin/templates/invoice',
  },
  {
    slug:        'overdue-invoice',
    title:       'Overdue Invoice',
    description: 'Follow-up invoice template with overdue notice and late-fee reminder.',
    icon:        'warning',
    path:        '/admin/templates/overdue-invoice',
  },
  {
    slug:        'project-proposal',
    title:       'Project Proposal',
    description: 'Project brief covering objectives, approach, timeline, and client benefits.',
    icon:        'description',
    path:        '/admin/templates/project-proposal',
  },
  {
    slug:        'quotation',
    title:       'Quotation',
    description: 'Service quotation with line items, payment terms, and signature block.',
    icon:        'request_quote',
    path:        '/admin/templates/quotation',
  },
];
