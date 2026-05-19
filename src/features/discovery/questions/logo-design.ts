import type { DiscoverySection } from '../types';

/**
 * Logo design discovery sections.
 */
export const LOGO_DESIGN_SECTIONS: DiscoverySection[] = [
  {
    id: 'logo_details',
    title: 'Logo Details',
    icon: 'star',
    description: 'The basics we need to design your logo.',
    questions: [
      {
        id: 'logo_name_exact',
        label: 'Business / brand name exactly as it should appear in the logo',
        description: 'Capitalisation and spacing matter.',
        type: 'text',
        placeholder: 'e.g. VISH Studio  or  Vish studio  or  vish.studio',
        required: true,
      },
      {
        id: 'logo_has_tagline',
        label: 'Do you want a tagline included?',
        type: 'boolean',
      },
      {
        id: 'logo_tagline',
        label: 'What is the tagline?',
        type: 'text',
        placeholder: 'e.g. Design that works.',
        showWhen: { questionId: 'logo_has_tagline', value: true },
      },
      {
        id: 'logo_industry',
        label: 'What industry / niche is the logo for?',
        type: 'text',
        placeholder: 'e.g. Legal services, Plant-based food, SaaS startup',
        required: true,
      },
      {
        id: 'logo_variations',
        label: 'What logo variations do you need?',
        type: 'checkbox',
        options: [
          'Primary logo (horizontal)',
          'Stacked / vertical version',
          'Icon / symbol only (for favicon, app icon)',
          'Wordmark only (text only)',
          'Dark background version',
          'Monochrome / single colour version',
        ],
      },
    ],
  },

  {
    id: 'logo_style',
    title: 'Style & Aesthetic',
    icon: 'design_services',
    description: 'Give us a visual direction to design from.',
    questions: [
      {
        id: 'logo_style_type',
        label: 'What logo style do you prefer?',
        type: 'checkbox',
        options: [
          'Wordmark (stylised text only)',
          'Lettermark (initials / monogram)',
          'Pictorial mark (recognisable icon)',
          'Abstract mark (geometric / conceptual)',
          'Combination mark (icon + text)',
          'Emblem (badge / shield style)',
          'Open to suggestions',
        ],
      },
      {
        id: 'logo_feel',
        label: 'What feeling should the logo convey?',
        type: 'checkbox',
        options: [
          'Professional & trustworthy',
          'Modern & innovative',
          'Friendly & approachable',
          'Bold & powerful',
          'Elegant & premium',
          'Playful & fun',
          'Minimalist & clean',
          'Traditional & established',
          'Creative & artistic',
        ],
      },
      {
        id: 'logo_colour_pref',
        label: 'Do you have colour preferences?',
        type: 'textarea',
        placeholder: 'e.g. Navy blue and gold, earthy greens, or "open to suggestions"',
      },
      {
        id: 'logo_colour_avoid',
        label: 'Any colours to avoid?',
        type: 'text',
        placeholder: 'e.g. No red, avoid neon colours',
      },
      {
        id: 'logo_competitors_avoid',
        label: "Competitors' logos you want to differentiate from",
        type: 'textarea',
        placeholder: 'Competitor A uses a blue globe — we want to look very different',
      },
    ],
  },

  {
    id: 'logo_usage',
    title: 'Usage & Deliverables',
    icon: 'inventory_2',
    description: 'Help us prepare the right files for your needs.',
    questions: [
      {
        id: 'logo_usage_contexts',
        label: 'Where will the logo be used?',
        type: 'checkbox',
        required: true,
        options: [
          'Website / digital',
          'Social media profiles',
          'Print (business cards, flyers)',
          'Merchandise / branded products',
          'Signage / large format',
          'Vehicle wraps',
          'Embroidery / apparel',
          'Packaging',
          'App icon (iOS / Android)',
        ],
      },
      {
        id: 'logo_file_formats',
        label: 'Which file formats do you need?',
        type: 'checkbox',
        options: [
          'SVG (web / scalable vector)',
          'PNG (transparent background)',
          'PDF (print-ready)',
          'EPS (professional print)',
          'AI (source file — Adobe Illustrator)',
          'Figma source file',
          'JPG (web use)',
        ],
      },
      {
        id: 'logo_concepts',
        label: 'How many initial concepts would you like?',
        type: 'select',
        options: [
          '1 concept (focused approach)',
          '2 concepts',
          '3 concepts (recommended)',
          '5+ concepts (exploratory)',
        ],
      },
      {
        id: 'logo_revision_rounds',
        label: 'Any notes on timeline or revision expectations?',
        type: 'textarea',
        placeholder: 'e.g. Need final files by end of month, prefer 2 revision rounds…',
      },
    ],
  },
];
