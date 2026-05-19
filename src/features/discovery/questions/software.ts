import type { DiscoverySection } from '../types';

/**
 * Software / SaaS / web application discovery sections.
 */
export const SOFTWARE_SECTIONS: DiscoverySection[] = [
  {
    id: 'sw_type',
    title: 'Software Type & Scope',
    icon: 'code',
    description: 'Help us understand the nature of the application.',
    questions: [
      {
        id: 'sw_type_select',
        label: 'What type of software do you need?',
        type: 'checkbox',
        required: true,
        options: [
          'Web application (browser-based)',
          'SaaS product (subscription)',
          'Internal / back-office tool',
          'API / backend service',
          'Desktop application',
          'Data dashboard / reporting tool',
          'Automation / workflow system',
          'Other',
        ],
      },
      {
        id: 'sw_problem',
        label: 'What problem does this software solve?',
        type: 'textarea',
        placeholder: 'Our team manually tracks invoices in spreadsheets — we need this automated…',
        required: true,
      },
      {
        id: 'sw_existing',
        label: 'Is this a new build or an improvement to existing software?',
        type: 'radio',
        required: true,
        options: [
          'Brand new — starting from scratch',
          'Rebuilding existing software',
          'Adding features to an existing codebase',
          'Integrating / connecting existing tools',
        ],
      },
      {
        id: 'sw_existing_stack',
        label: 'If existing — what tech stack / language is it in?',
        type: 'text',
        placeholder: 'e.g. React + Node.js, Laravel, Django, Ruby on Rails',
        showWhen: { questionId: 'sw_existing', value: 'Adding features to an existing codebase' },
      },
    ],
  },

  {
    id: 'sw_users',
    title: 'Users & Access Control',
    icon: 'group',
    description: 'Tell us about who will use the software.',
    questions: [
      {
        id: 'sw_user_types',
        label: 'What user roles / types will the software have?',
        type: 'textarea',
        placeholder: 'Admin, Manager, Staff, Client — describe what each can do',
        required: true,
      },
      {
        id: 'sw_expected_users',
        label: 'How many users are expected initially?',
        type: 'select',
        options: [
          '1–10 (small team / internal)',
          '11–50',
          '51–200',
          '200–1,000',
          '1,000+ (scale-ready)',
          'Unknown / depends on growth',
        ],
      },
      {
        id: 'sw_auth_required',
        label: 'Does the app require user authentication?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sw_auth_method',
        label: 'Authentication method preferences?',
        type: 'checkbox',
        showWhen: { questionId: 'sw_auth_required', value: true },
        options: [
          'Email & password',
          'Google / Social login',
          'Magic link (email)',
          'Two-factor authentication (2FA)',
          'Single Sign-On (SSO / SAML)',
        ],
      },
    ],
  },

  {
    id: 'sw_features',
    title: 'Core Features',
    icon: 'widgets',
    description: 'List the key features the software must have.',
    questions: [
      {
        id: 'sw_must_have',
        label: 'What are the must-have features (MVP)?',
        type: 'textarea',
        placeholder: 'User registration, dashboard, invoice creation, PDF export, email notifications…',
        required: true,
      },
      {
        id: 'sw_nice_to_have',
        label: 'What are the nice-to-have features (future)?',
        type: 'textarea',
        placeholder: 'Mobile app, advanced analytics, API access, white-labelling…',
      },
      {
        id: 'sw_common_features',
        label: 'Which of these does your software need?',
        type: 'checkbox',
        options: [
          'Dashboard / data visualisation',
          'File uploads / document management',
          'Email / notification system',
          'Reporting & analytics',
          'Payment processing',
          'Subscription / billing management',
          'Real-time updates (websockets)',
          'Search & filtering',
          'Import / export (CSV, Excel, PDF)',
          'Audit trail / activity log',
          'Multi-tenancy (multiple organisations)',
          'REST or GraphQL API',
        ],
      },
    ],
  },

  {
    id: 'sw_technical',
    title: 'Technical Requirements',
    icon: 'settings',
    description: 'Any technical preferences or constraints.',
    questions: [
      {
        id: 'sw_tech_preference',
        label: 'Do you have a technology stack preference?',
        type: 'text',
        placeholder: 'e.g. React, Vue, Next.js, Node.js, PostgreSQL — or "no preference"',
      },
      {
        id: 'sw_hosting_preference',
        label: 'Hosting / infrastructure preference?',
        type: 'radio',
        options: [
          'Cloud (AWS / GCP / Azure)',
          'Vercel / Netlify (serverless)',
          'Self-hosted / on-premises',
          'No preference — recommend one',
        ],
      },
      {
        id: 'sw_third_party',
        label: 'Any third-party APIs or services to integrate?',
        type: 'textarea',
        placeholder: 'e.g. Stripe, Twilio, SendGrid, QuickBooks, Salesforce, Google Maps',
      },
      {
        id: 'sw_data_sensitivity',
        label: 'Does the software handle sensitive or regulated data?',
        type: 'radio',
        options: [
          'No — standard business data',
          'Yes — personal data (GDPR compliance needed)',
          'Yes — financial / payment data',
          'Yes — health / medical data (HIPAA)',
          'Yes — other regulated data',
        ],
      },
    ],
  },
];
