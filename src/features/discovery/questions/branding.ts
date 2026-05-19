import type { DiscoverySection } from '../types';

/**
 * Branding project discovery sections.
 */
export const BRANDING_SECTIONS: DiscoverySection[] = [
  {
    id: 'brand_identity',
    title: 'Current Brand Identity',
    icon: 'auto_awesome',
    description: 'Tell us about where your brand stands today.',
    questions: [
      {
        id: 'brand_stage',
        label: 'Where are you in your brand journey?',
        type: 'radio',
        required: true,
        options: [
          'New business — starting from zero',
          'Existing business — refreshing / rebranding',
          'Existing business — expanding into new markets',
          'Merger / acquisition — unifying brands',
        ],
      },
      {
        id: 'brand_existing_elements',
        label: 'What existing brand elements do you want to keep?',
        type: 'textarea',
        placeholder: 'e.g. We want to keep our blue colour and the leaf motif, but modernise everything else…',
      },
      {
        id: 'brand_why_rebrand',
        label: 'Why are you rebranding / creating a new brand now?',
        type: 'textarea',
        placeholder: 'Our current brand feels dated, we are targeting a new audience…',
        required: true,
      },
    ],
  },

  {
    id: 'brand_positioning',
    title: 'Brand Positioning & Values',
    icon: 'psychology',
    description: 'Help us define the foundation of your brand.',
    questions: [
      {
        id: 'brand_values',
        label: 'What are your core brand values?',
        description: 'What principles does your brand stand for?',
        type: 'textarea',
        placeholder: 'e.g. Transparency, Innovation, Sustainability, Community…',
        required: true,
      },
      {
        id: 'brand_personality_words',
        label: 'Pick words that best describe your brand personality',
        type: 'checkbox',
        options: [
          'Bold & disruptive',
          'Trustworthy & reliable',
          'Innovative & forward-thinking',
          'Warm & human',
          'Premium & exclusive',
          'Playful & energetic',
          'Calm & minimal',
          'Authoritative & expert',
          'Eco-conscious & sustainable',
          'Fun & irreverent',
        ],
      },
      {
        id: 'brand_not_like',
        label: 'What should the brand NOT feel like?',
        type: 'textarea',
        placeholder: 'e.g. Cheap, corporate, generic, outdated…',
      },
      {
        id: 'brand_differentiator',
        label: "What makes you different from your competitors?",
        type: 'textarea',
        placeholder: 'We are the only company in our region that offers…',
        required: true,
      },
    ],
  },

  {
    id: 'brand_deliverables',
    title: 'Deliverables',
    icon: 'inventory_2',
    description: 'Tell us what brand assets you need.',
    questions: [
      {
        id: 'brand_deliverables_list',
        label: 'Which deliverables are included in this project?',
        type: 'checkbox',
        required: true,
        options: [
          'Logo (primary + variations)',
          'Brand colour palette',
          'Typography system',
          'Brand guidelines / style guide',
          'Business card design',
          'Letterhead / stationery',
          'Social media templates',
          'Email signature',
          'Packaging design',
          'Signage / environmental',
          'Pitch deck / presentation template',
          'Brand photography direction',
          'Icon / illustration set',
        ],
      },
      {
        id: 'brand_file_formats',
        label: 'What file formats do you need?',
        type: 'checkbox',
        options: [
          'AI (Adobe Illustrator)',
          'EPS (vector)',
          'SVG (web vector)',
          'PNG (transparent background)',
          'PDF (print-ready)',
          'JPG (web use)',
          'Figma source file',
        ],
      },
    ],
  },

  {
    id: 'brand_style',
    title: 'Style Preferences',
    icon: 'style',
    description: 'Give us a visual direction to work from.',
    questions: [
      {
        id: 'brand_style_direction',
        label: 'Which style direction resonates most?',
        type: 'checkbox',
        options: [
          'Minimal & clean',
          'Bold & geometric',
          'Hand-crafted / artisanal',
          'Corporate & structured',
          'Retro / vintage',
          'Modern & tech',
          'Nature-inspired / organic',
          'Luxury & sophisticated',
          'Abstract & conceptual',
        ],
      },
      {
        id: 'brand_colour_direction',
        label: 'Do you have colour preferences for the brand?',
        type: 'textarea',
        placeholder: 'e.g. Earth tones with an accent of deep green, or "open to suggestions"',
      },
      {
        id: 'brand_avoid',
        label: 'Are there any styles, colours, or visual elements to avoid?',
        type: 'textarea',
        placeholder: 'e.g. No red, avoid clichéd icons like a lightbulb for innovation…',
      },
    ],
  },
];
