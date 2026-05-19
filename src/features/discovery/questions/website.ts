import type { DiscoverySection } from '../types';

/**
 * Website-specific discovery sections.
 * Add questions here for all website projects.
 */
export const WEBSITE_SECTIONS: DiscoverySection[] = [
  {
    id: 'web_purpose',
    title: 'Website Type & Purpose',
    icon: 'language',
    description: 'Help us understand what kind of website you need.',
    questions: [
      {
        id: 'web_type',
        label: 'What type of website do you need?',
        type: 'checkbox',
        required: true,
        options: [
          'Portfolio / Showcase',
          'Business / Corporate',
          'Landing page',
          'E-commerce / Online store',
          'Blog / Editorial',
          'Booking / Appointments',
          'Directory / Marketplace',
          'Membership / Community',
          'Other',
        ],
      },
      {
        id: 'web_pages_count',
        label: 'Approximately how many pages?',
        type: 'select',
        options: [
          '1–3 pages (micro-site)',
          '4–8 pages (standard)',
          '9–20 pages (medium)',
          '20+ pages (large)',
          "Not sure yet — let's scope it",
        ],
      },
      {
        id: 'web_purpose_description',
        label: 'Describe what visitors should be able to do on the site',
        type: 'textarea',
        placeholder: 'Browse products, book a call, read articles, submit a form…',
        required: true,
      },
    ],
  },

  {
    id: 'web_features',
    title: 'Features & Functionality',
    icon: 'widgets',
    description: 'Select all the features your website needs.',
    questions: [
      {
        id: 'web_features_list',
        label: 'Which features do you need?',
        type: 'checkbox',
        options: [
          'Contact / enquiry form',
          'Newsletter signup',
          'E-commerce / shopping cart',
          'Online payments (Stripe, PayPal, etc.)',
          'User accounts / login',
          'Booking / appointment system',
          'Live chat widget',
          'Blog / news section',
          'Search functionality',
          'Photo / video gallery',
          'Google Maps / location',
          'Social media feed',
          'Multi-language support',
          'Accessibility compliance (WCAG)',
        ],
      },
      {
        id: 'web_ecommerce_details',
        label: 'E-commerce: how many products roughly?',
        type: 'select',
        showWhen: { questionId: 'web_features_list', value: 'E-commerce / shopping cart' },
        options: [
          '1–10 products',
          '11–50 products',
          '51–200 products',
          '200+ products',
          'Digital products / downloads only',
          'Services only (no physical stock)',
        ],
      },
    ],
  },

  {
    id: 'web_technical',
    title: 'Technical Setup',
    icon: 'settings',
    description: 'Tell us about your existing infrastructure.',
    questions: [
      {
        id: 'web_has_domain',
        label: 'Do you already have a domain name?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'web_domain_name',
        label: "What is your domain?",
        type: 'text',
        placeholder: 'e.g. mybusiness.com',
        showWhen: { questionId: 'web_has_domain', value: true },
      },
      {
        id: 'web_has_hosting',
        label: 'Do you have existing hosting?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'web_hosting_provider',
        label: 'Which hosting provider?',
        type: 'text',
        placeholder: 'e.g. Vercel, Netlify, SiteGround, WP Engine',
        showWhen: { questionId: 'web_has_hosting', value: true },
      },
      {
        id: 'web_needs_cms',
        label: 'Do you need a CMS to manage content yourself?',
        type: 'boolean',
      },
      {
        id: 'web_cms_preference',
        label: 'Do you have a CMS preference?',
        type: 'radio',
        showWhen: { questionId: 'web_needs_cms', value: true },
        options: [
          'WordPress',
          'Webflow',
          'Sanity',
          'Contentful',
          'Strapi',
          'No preference — recommend one',
        ],
      },
      {
        id: 'web_seo',
        label: 'Is SEO optimisation required?',
        type: 'boolean',
      },
      {
        id: 'web_analytics',
        label: 'Do you need analytics / visitor tracking?',
        type: 'boolean',
      },
      {
        id: 'web_integrations',
        label: 'Any third-party tools to integrate?',
        type: 'textarea',
        placeholder: 'e.g. Mailchimp, HubSpot, Stripe, Calendly, Google Analytics',
      },
    ],
  },

  {
    id: 'web_content',
    title: 'Content & Media',
    icon: 'article',
    description: 'Help us understand what content is ready.',
    questions: [
      {
        id: 'web_copy_ready',
        label: 'Is your website copy / text ready?',
        type: 'radio',
        required: true,
        options: [
          'Yes — fully written and ready',
          'Partially ready',
          'No — I need copywriting help',
        ],
      },
      {
        id: 'web_images_ready',
        label: 'Do you have images / photography?',
        type: 'radio',
        required: true,
        options: [
          'Yes — all professional photos ready',
          'Partially — some images available',
          'No — I need stock images or photography',
        ],
      },
      {
        id: 'web_video',
        label: 'Will the site include video content?',
        type: 'boolean',
      },
    ],
  },
];
