import type { DiscoverySection } from '../types';

/**
 * Common sections shown for EVERY service type.
 * Add new questions here to include them across all briefs.
 */
export const COMMON_SECTIONS: DiscoverySection[] = [
  {
    id: 'business',
    title: 'About Your Business',
    icon: 'business',
    description: 'Help us understand who you are and what you do.',
    questions: [
      {
        id: 'biz_name',
        label: 'Business / Brand Name',
        type: 'text',
        placeholder: 'e.g. Acme Studio',
        required: true,
      },
      {
        id: 'biz_description',
        label: 'What does your business do?',
        description: 'Describe your products, services, and what makes you different.',
        type: 'textarea',
        placeholder: 'We help small businesses build…',
        required: true,
      },
      {
        id: 'biz_industry',
        label: 'What industry are you in?',
        type: 'text',
        placeholder: 'e.g. Real estate, Health & wellness, Tech',
      },
      {
        id: 'biz_target_audience',
        label: 'Who is your target audience?',
        description: 'Describe the ideal customer — age, profession, needs, location, etc.',
        type: 'textarea',
        placeholder: 'Small business owners aged 30–50 in Mauritius…',
        required: true,
      },
      {
        id: 'biz_competitors',
        label: 'List 2–3 competitors or similar brands',
        description: 'This helps us understand your market positioning.',
        type: 'textarea',
        placeholder: 'Competitor A (competitor-a.com) — what they do well / poorly',
      },
    ],
  },

  {
    id: 'brand_assets',
    title: 'Brand & Visual Identity',
    icon: 'palette',
    description: 'Tell us about any existing brand materials.',
    questions: [
      {
        id: 'has_logo',
        label: 'Do you have an existing logo?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'has_brand_colors',
        label: 'Do you have established brand colors?',
        type: 'boolean',
      },
      {
        id: 'brand_colors',
        label: 'What are your brand colors?',
        type: 'text',
        placeholder: 'e.g. #1A2B3C, Navy Blue, Gold',
        showWhen: { questionId: 'has_brand_colors', value: true },
      },
      {
        id: 'brand_fonts',
        label: 'Do you have brand fonts?',
        type: 'text',
        placeholder: 'e.g. Outfit, Helvetica, Poppins',
      },
      {
        id: 'brand_tone',
        label: 'How would you describe your brand personality?',
        type: 'checkbox',
        options: [
          'Professional & corporate',
          'Friendly & approachable',
          'Bold & confident',
          'Minimal & clean',
          'Playful & fun',
          'Luxury & premium',
          'Innovative & tech-forward',
          'Trustworthy & reliable',
        ],
      },
    ],
  },

  {
    id: 'project_goals',
    title: 'Project Goals & Scope',
    icon: 'flag',
    description: 'Help us understand what success looks like for this project.',
    questions: [
      {
        id: 'goal_main',
        label: 'What is the main goal of this project?',
        description: 'What problem are we solving? What outcome are you expecting?',
        type: 'textarea',
        placeholder: 'We want to increase online bookings by 30%…',
        required: true,
      },
      {
        id: 'goal_budget',
        label: 'What is your estimated budget range?',
        type: 'select',
        options: [
          'Under $1,000',
          '$1,000 – $3,000',
          '$3,000 – $7,500',
          '$7,500 – $15,000',
          '$15,000 – $30,000',
          '$30,000+',
          'Flexible / To be discussed',
        ],
      },
      {
        id: 'goal_deadline',
        label: 'Do you have a specific deadline?',
        type: 'text',
        placeholder: 'e.g. August 1, 2026 — or "no hard deadline"',
      },
      {
        id: 'goal_references',
        label: 'Share any references, inspiration, or examples you like',
        type: 'textarea',
        placeholder: 'https://example.com — I like their layout and colour usage',
      },
      {
        id: 'goal_additional',
        label: 'Anything else we should know before starting?',
        type: 'textarea',
        placeholder: 'Any constraints, preferences, or requirements not covered above…',
      },
    ],
  },
];
