import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ServiceType } from '@/src/features/projects';

export type PricingTemplateKind = 'package' | 'maintenance' | 'addon';
export type PricingBilling = 'one-time' | 'monthly' | 'unit' | 'split';

export interface PricingPackage {
  id: string;
  service: ServiceType;
  kind: PricingTemplateKind;
  tier?: string;
  badge?: string;
  name: string;
  price: number;
  currency: string;
  priceSuffix?: string;
  priceLabel?: string;
  originalPrice?: number;
  billing: PricingBilling;
  unit?: string;
  summary: string;
  features: string[];
  timeline?: string;
  bestFor?: string;
  revisions?: string;
  sortOrder?: number;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt: number;
  updatedAt: number;
}

type PricingPackageInput = Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'>;

interface PricingPackagesState {
  packages: PricingPackage[];
  loading: boolean;
  error: string | null;
  ready: boolean;
  setPackages: (packages: PricingPackage[]) => void;
  subscribeToPackages: () => () => void;
  addPackage: (input: PricingPackageInput) => Promise<PricingPackage>;
  updatePackage: (id: string, updates: Partial<PricingPackageInput>) => Promise<void>;
  removePackage: (id: string) => Promise<void>;
  getPackagesByService: (service: ServiceType, kind?: PricingTemplateKind) => PricingPackage[];
  getPackageById: (id: string) => PricingPackage | undefined;
}

export const PRICING_PACKAGES_COLLECTION_PATH = 'local/templates/prices/items';

const optionalString = (value: unknown) => {
  const next = typeof value === 'string' ? value.trim() : '';
  return next || undefined;
};

const now = Date.now();
const website = 'website' as const;
const software = 'software' as const;
const mobileApp = 'mobile-app' as const;
const branding = 'branding' as const;

const timestamped = <T extends Omit<PricingPackage, 'createdAt' | 'updatedAt'>>(item: T): PricingPackage => ({
  ...item,
  createdAt: now,
  updatedAt: now,
});

export const DEFAULT_PRICING_PACKAGES: PricingPackage[] = [
  timestamped({
    id: 'pkg_website_essentials',
    service: website,
    kind: 'package',
    tier: 'Starter',
    name: 'Essentials',
    price: 8500,
    currency: 'MUR',
    originalPrice: 9500,
    billing: 'one-time',
    priceLabel: 'One-time',
    summary: 'A focused, conversion-ready website for getting online quickly.',
    timeline: '4-7 business days',
    bestFor: 'Freelancers, consultants, pop-up businesses',
    revisions: '1 revision round',
    sortOrder: 1,
    features: [
      'Single-page website',
      'Contact form',
      '4-6 content sections',
      'Mobile responsive layout',
      'Basic SEO setup',
      '6 months hosting',
    ],
    isActive: true,
  }),
  timestamped({
    id: 'pkg_website_growth',
    service: website,
    kind: 'package',
    tier: 'Studio',
    badge: 'Most popular',
    name: 'Growth',
    price: 14500,
    currency: 'MUR',
    originalPrice: 15500,
    billing: 'one-time',
    priceLabel: 'One-time',
    summary: 'A polished multi-page website for brands ready to grow online.',
    timeline: '7-13 business days',
    bestFor: 'Restaurants, salons, clinics, local services',
    revisions: '2 revision rounds',
    sortOrder: 2,
    features: [
      'Up to 5 pages',
      'Contact and booking forms',
      'Google Maps integration',
      'Custom design system',
      'Advanced SEO structure',
      '12 months hosting',
    ],
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'pkg_website_premium',
    service: website,
    kind: 'package',
    tier: 'Pro',
    name: 'Premium',
    price: 35500,
    currency: 'MUR',
    priceSuffix: '+',
    originalPrice: 38000,
    billing: 'split',
    priceLabel: 'On start 50% - end 50%',
    summary: 'A premium web system engineered for credibility, SEO, and scale.',
    timeline: '2-4 weeks',
    bestFor: 'Tourism, real estate, retail, established brands',
    revisions: 'Unlimited during project',
    sortOrder: 3,
    features: [
      'Up to 10 pages',
      'Blog or news section',
      'Email marketing integration',
      'Premium custom design',
      'Analytics dashboard setup',
      'Priority launch support',
    ],
    isActive: true,
  }),
  timestamped({
    id: 'care_website_essentials',
    service: website,
    kind: 'maintenance',
    tier: 'Starter',
    name: 'Essentials Care',
    price: 1500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Core uptime checks, light content edits, backups, and monthly health monitoring.',
    features: ['Uptime checks', 'Light content edits', 'Backups', 'Monthly health monitoring'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'care_website_growth',
    service: website,
    kind: 'maintenance',
    tier: 'Studio',
    name: 'Growth Care',
    price: 2500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Performance checks, minor content updates, SEO hygiene, uptime monitoring, and hosting support.',
    features: ['Performance checks', 'Minor content updates', 'SEO hygiene', 'Hosting support'],
    sortOrder: 2,
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'care_website_premium',
    service: website,
    kind: 'maintenance',
    tier: 'Pro',
    name: 'Premium Care',
    price: 4500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Priority support, conversion checks, technical SEO review, analytics monitoring, and monthly improvement planning.',
    features: ['Priority support', 'Conversion checks', 'Technical SEO review', 'Monthly improvement planning'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_website_page',
    service: website,
    kind: 'addon',
    name: 'Additional content page',
    price: 1500,
    currency: 'MUR',
    billing: 'unit',
    unit: 'page',
    summary: 'For service, landing, legal, or campaign pages.',
    features: ['Additional page design', 'Responsive layout', 'Page setup'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'addon_website_home_section',
    service: website,
    kind: 'addon',
    name: 'Additional homepage section',
    price: 900,
    currency: 'MUR',
    billing: 'unit',
    unit: 'section',
    summary: 'Useful for testimonials, FAQs, galleries, or conversion blocks.',
    features: ['Additional homepage block', 'Responsive layout', 'Content placement'],
    sortOrder: 2,
    isActive: true,
  }),
  timestamped({
    id: 'addon_website_blog_article',
    service: website,
    kind: 'addon',
    name: 'Blog article setup',
    price: 600,
    currency: 'MUR',
    billing: 'unit',
    unit: 'article',
    summary: 'Formatting, metadata, image placement, and publishing support.',
    features: ['Article formatting', 'Metadata setup', 'Image placement', 'Publishing support'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_website_seo_pass',
    service: website,
    kind: 'addon',
    name: 'Advanced SEO pass',
    price: 3500,
    currency: 'MUR',
    billing: 'one-time',
    summary: 'Keyword structure, metadata, schema, and internal linking review.',
    features: ['Keyword structure', 'Metadata review', 'Schema setup', 'Internal linking review'],
    sortOrder: 4,
    isActive: true,
  }),
  timestamped({
    id: 'pkg_software_essentials',
    service: software,
    kind: 'package',
    tier: 'Starter',
    name: 'Essentials',
    price: 75000,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'Starting from',
    summary: 'A focused custom tool to automate one high-value workflow.',
    timeline: '4-6 weeks',
    bestFor: 'Internal tools, lead capture systems, workflow prototypes',
    revisions: '1 revision round',
    sortOrder: 1,
    features: ['Single workflow application', 'Basic dashboard view', 'Local or API integration', 'Responsive React interface', 'Form and data capture', 'Deployment and handoff'],
    isActive: true,
  }),
  timestamped({
    id: 'pkg_software_growth',
    service: software,
    kind: 'package',
    tier: 'Studio',
    badge: 'Most popular',
    name: 'Growth',
    price: 90000,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'Starting from',
    summary: 'A scalable web app foundation with authenticated workflows.',
    timeline: '5-8 weeks',
    bestFor: 'Client portals, booking systems, operational dashboards',
    revisions: '2 revision rounds',
    sortOrder: 2,
    features: ['Custom React or Next.js app', 'Database-backed dashboard', 'Admin management screens', 'Authentication flow', 'Secure backend integration', 'Performance-focused deployment'],
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'pkg_software_premium',
    service: software,
    kind: 'package',
    tier: 'Pro',
    name: 'Premium',
    price: 150000,
    currency: 'MUR',
    priceSuffix: '+',
    billing: 'split',
    priceLabel: 'Custom scope',
    summary: 'A production-grade software build for serious operational scale.',
    timeline: '8-12+ weeks',
    bestFor: 'SaaS products, CRM systems, marketplaces, enterprise workflows',
    revisions: 'Scoped iteration cycles',
    sortOrder: 3,
    features: ['Custom product architecture', 'Complex database workflows', 'Reporting and analytics', 'Advanced user roles', 'Third-party API integrations', 'Launch, testing, and growth support'],
    isActive: true,
  }),
  timestamped({
    id: 'care_software_essentials',
    service: software,
    kind: 'maintenance',
    tier: 'Starter',
    name: 'Essentials Software Support',
    price: 5500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Bug triage, dependency checks, uptime review, and minor workflow support.',
    features: ['Bug triage', 'Dependency checks', 'Uptime review', 'Minor workflow support'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'care_software_growth',
    service: software,
    kind: 'maintenance',
    tier: 'Studio',
    name: 'Growth Software Support',
    price: 8500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Bug triage, dependency updates, small workflow improvements, and release support.',
    features: ['Bug triage', 'Dependency updates', 'Small workflow improvements', 'Release support'],
    sortOrder: 2,
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'care_software_premium',
    service: software,
    kind: 'maintenance',
    tier: 'Pro',
    name: 'Premium Software Support',
    price: 15000,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Priority engineering support, monitoring review, release planning, reporting checks, and iterative product improvements.',
    features: ['Priority engineering support', 'Monitoring review', 'Release planning', 'Iterative improvements'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_software_dashboard_screen',
    service: software,
    kind: 'addon',
    name: 'Additional dashboard screen',
    price: 5500,
    currency: 'MUR',
    billing: 'unit',
    unit: 'screen',
    summary: 'Designed and engineered into the active product flow.',
    features: ['Dashboard UI', 'Data state', 'Responsive implementation'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'addon_software_user_role',
    service: software,
    kind: 'addon',
    name: 'Advanced user role',
    price: 6500,
    currency: 'MUR',
    billing: 'unit',
    unit: 'role',
    summary: 'Permissions, routing, and interface states for a new role.',
    features: ['Permissions', 'Role routing', 'Interface states'],
    sortOrder: 2,
    isActive: true,
  }),
  timestamped({
    id: 'addon_software_integration',
    service: software,
    kind: 'addon',
    name: 'Third-party integration',
    price: 12000,
    currency: 'MUR',
    billing: 'unit',
    unit: 'integration',
    priceLabel: 'From',
    summary: 'API, CRM, payment, booking, automation, or analytics connection.',
    features: ['API setup', 'Credential configuration', 'Integration testing'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_software_reporting_module',
    service: software,
    kind: 'addon',
    name: 'Reporting module',
    price: 15000,
    currency: 'MUR',
    billing: 'unit',
    unit: 'module',
    priceLabel: 'From',
    summary: 'Metrics, filtering, export, and admin visibility.',
    features: ['Metrics', 'Filtering', 'Export', 'Admin visibility'],
    sortOrder: 4,
    isActive: true,
  }),
  timestamped({
    id: 'pkg_mobile_essentials',
    service: mobileApp,
    kind: 'package',
    tier: 'Starter',
    name: 'Essentials',
    price: 65000,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'Starting from',
    summary: 'A focused mobile app prototype for validating a core product flow.',
    timeline: '4-6 weeks',
    bestFor: 'MVPs, booking tools, client intake apps',
    revisions: '1 revision round',
    sortOrder: 1,
    features: ['Single core app flow', 'Basic UI/UX design', 'Deployment guidance', '4 features', 'Mobile-first interface design', 'Local or API connection', 'Basic app testing'],
    isActive: true,
  }),
  timestamped({
    id: 'pkg_mobile_growth',
    service: mobileApp,
    kind: 'package',
    tier: 'Studio',
    badge: 'Most popular',
    name: 'Growth',
    price: 85000,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'Starting from',
    summary: 'A polished mobile application for authenticated customer or team workflows.',
    timeline: '7-10 weeks',
    bestFor: 'Customer portals, booking apps, operational tools',
    revisions: '2 revision rounds',
    sortOrder: 2,
    features: ['Custom app interface system', 'Custom UI/UX design', 'Database-backed workflows', 'Admin interface (App based)', '10 features', 'Authentication and user profiles', 'Dashboard or account screens', 'Push-ready architecture planning', 'Launch testing and handoff'],
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'pkg_mobile_premium',
    service: mobileApp,
    kind: 'package',
    tier: 'Pro',
    name: 'Premium',
    price: 100000,
    currency: 'MUR',
    priceSuffix: '+',
    billing: 'split',
    priceLabel: 'Custom scope',
    summary: 'A scalable mobile product build with advanced workflows and growth-ready architecture.',
    timeline: '10-16+ weeks',
    bestFor: 'Marketplaces, SaaS apps, internal platforms, funded products',
    revisions: 'Scoped iteration cycles',
    sortOrder: 3,
    features: ['Full product architecture', 'Custom UI/UX design', 'Third-party integrations', 'Admin interface (App based)', '15 - 20 features', 'Complex app workflows', 'Advanced user roles and permissions', 'Analytics and reporting setup', 'Launch, QA, and growth support'],
    isActive: true,
  }),
  timestamped({
    id: 'care_mobile_essentials',
    service: mobileApp,
    kind: 'maintenance',
    tier: 'Starter',
    name: 'Essentials App Support',
    price: 6500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Basic QA support, app health checks, issue triage, and store readiness checks.',
    features: ['QA support', 'App health checks', 'Issue triage', 'Store readiness checks'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'care_mobile_growth',
    service: mobileApp,
    kind: 'maintenance',
    tier: 'Studio',
    name: 'Growth App Support',
    price: 10000,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'App monitoring, QA support, minor improvements, release support, and launch-readiness maintenance.',
    features: ['App monitoring', 'QA support', 'Minor improvements', 'Release support'],
    sortOrder: 2,
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'care_mobile_premium',
    service: mobileApp,
    kind: 'maintenance',
    tier: 'Pro',
    name: 'Premium App Support',
    price: 18000,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Priority mobile support, release planning, feature iteration, analytics checks, and store optimization guidance.',
    features: ['Priority mobile support', 'Release planning', 'Feature iteration', 'Analytics checks'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_mobile_screen',
    service: mobileApp,
    kind: 'addon',
    name: 'Additional app screen',
    price: 6500,
    currency: 'MUR',
    billing: 'unit',
    unit: 'screen',
    summary: 'Interface, state handling, and implementation for one new screen.',
    features: ['Screen interface', 'State handling', 'Implementation'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'addon_mobile_push_notification',
    service: mobileApp,
    kind: 'addon',
    name: 'Push notification flow',
    price: 9500,
    currency: 'MUR',
    billing: 'unit',
    unit: 'flow',
    priceLabel: 'From',
    summary: 'Notification triggers, copy, setup, and testing.',
    features: ['Notification triggers', 'Copy setup', 'Testing'],
    sortOrder: 2,
    isActive: true,
  }),
  timestamped({
    id: 'addon_mobile_store_launch',
    service: mobileApp,
    kind: 'addon',
    name: 'App store launch support',
    price: 12000,
    currency: 'MUR',
    billing: 'one-time',
    summary: 'Listing guidance, assets, metadata, and submission support.',
    features: ['Listing guidance', 'Assets', 'Metadata', 'Submission support'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_mobile_advanced_workflow',
    service: mobileApp,
    kind: 'addon',
    name: 'Advanced app workflow',
    price: 18000,
    currency: 'MUR',
    billing: 'unit',
    unit: 'workflow',
    priceLabel: 'From',
    summary: 'Multi-step flows, permissions, data rules, or integrations.',
    features: ['Multi-step flow', 'Permissions', 'Data rules', 'Integrations'],
    sortOrder: 4,
    isActive: true,
  }),
  timestamped({
    id: 'pkg_branding_essentials',
    service: branding,
    kind: 'package',
    tier: 'Starter',
    name: 'Essentials',
    price: 15500,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'One-time',
    summary: 'A lean brand identity foundation for clear market presence.',
    timeline: '5-8 business days',
    bestFor: 'New ventures, freelancers, small teams',
    revisions: '1 revision round',
    sortOrder: 1,
    features: ['Logo refinement or starter mark', 'Typography pairing', 'Basic brand usage sheet', 'Core color palette', 'Social profile assets', 'Export-ready brand files'],
    isActive: true,
  }),
  timestamped({
    id: 'pkg_branding_growth',
    service: branding,
    kind: 'package',
    tier: 'Studio',
    badge: 'Most popular',
    name: 'Growth',
    price: 34600,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'One-time',
    summary: 'A complete visual identity system for a more premium brand presence.',
    timeline: '2-3 weeks',
    bestFor: 'Growing brands, boutiques, hospitality, service businesses',
    revisions: '2 revision rounds',
    sortOrder: 2,
    features: ['Primary and secondary logo system', 'Color and typography system', 'Brand guidelines document', 'Visual identity direction', 'Social media starter kit', 'Launch asset exports'],
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'pkg_branding_premium',
    service: branding,
    kind: 'package',
    tier: 'Pro',
    name: 'Premium',
    price: 90000,
    currency: 'MUR',
    billing: 'one-time',
    priceLabel: 'One-time',
    summary: 'A strategic brand architecture package for scaling companies.',
    timeline: '3-6 weeks',
    bestFor: 'Scaling brands, product launches, premium repositioning',
    revisions: 'Unlimited during project',
    sortOrder: 3,
    features: ['Brand strategy workshop', 'Art direction and visual language', 'Extended brand guidelines', 'Complete identity system', 'Messaging and positioning notes', 'Priority rollout support'],
    isActive: true,
  }),
  timestamped({
    id: 'care_branding_essentials',
    service: branding,
    kind: 'maintenance',
    tier: 'Starter',
    name: 'Essentials Brand Support',
    price: 1200,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Light brand file upkeep, small export requests, and visual consistency checks.',
    features: ['Brand file upkeep', 'Small export requests', 'Visual consistency checks'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'care_branding_growth',
    service: branding,
    kind: 'maintenance',
    tier: 'Studio',
    name: 'Growth Brand Support',
    price: 1800,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Social asset support, campaign graphics, brand file maintenance, and monthly creative guidance.',
    features: ['Social asset support', 'Campaign graphics', 'Brand file maintenance', 'Creative guidance'],
    sortOrder: 2,
    isActive: true,
    isFeatured: true,
  }),
  timestamped({
    id: 'care_branding_premium',
    service: branding,
    kind: 'maintenance',
    tier: 'Pro',
    name: 'Premium Brand Support',
    price: 3500,
    currency: 'MUR',
    billing: 'monthly',
    summary: 'Priority creative support, campaign system refinement, launch assets, and ongoing brand direction.',
    features: ['Priority creative support', 'Campaign refinement', 'Launch assets', 'Brand direction'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_branding_logo_lockup',
    service: branding,
    kind: 'addon',
    name: 'Additional logo lockup',
    price: 1200,
    currency: 'MUR',
    billing: 'one-time',
    summary: 'Alternative layout or usage-specific mark.',
    features: ['Alternate mark', 'Export files', 'Usage notes'],
    sortOrder: 1,
    isActive: true,
  }),
  timestamped({
    id: 'addon_branding_social_template',
    service: branding,
    kind: 'addon',
    name: 'Social media template',
    price: 750,
    currency: 'MUR',
    billing: 'unit',
    unit: 'template',
    summary: 'Reusable branded layout for posts, stories, or promos.',
    features: ['Reusable layout', 'Post/story format', 'Export-ready file'],
    sortOrder: 2,
    isActive: true,
  }),
  timestamped({
    id: 'addon_branding_campaign_set',
    service: branding,
    kind: 'addon',
    name: 'Campaign creative set',
    price: 4500,
    currency: 'MUR',
    billing: 'one-time',
    summary: 'A compact set of campaign visuals for one launch or offer.',
    features: ['Campaign visuals', 'Launch assets', 'Export-ready files'],
    sortOrder: 3,
    isActive: true,
  }),
  timestamped({
    id: 'addon_branding_guideline_page',
    service: branding,
    kind: 'addon',
    name: 'Extended brand guideline page',
    price: 1000,
    currency: 'MUR',
    billing: 'unit',
    unit: 'page',
    summary: 'More detail for usage, tone, layouts, or production rules.',
    features: ['Usage detail', 'Tone notes', 'Layout rules', 'Production notes'],
    sortOrder: 4,
    isActive: true,
  }),
];

const byDisplayOrder = (a: PricingPackage, b: PricingPackage) => (a.sortOrder ?? a.price) - (b.sortOrder ?? b.price);
const hasRequiredPricingFamilies = (items: PricingPackage[]) => (
  ['website', 'software', 'mobile-app', 'branding'].every(service =>
    items.filter(item => item.service === service && item.kind === 'package').length >= 3 &&
    items.filter(item => item.service === service && item.kind === 'maintenance').length >= 3 &&
    items.filter(item => item.service === service && item.kind === 'addon').length >= 4,
  )
);

export const formatPricingAmount = (item: Pick<PricingPackage, 'currency' | 'price' | 'billing' | 'unit' | 'priceSuffix'>) => {
  const amount = item.currency === 'MUR'
    ? `Rs ${item.price.toLocaleString()}`
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency, maximumFractionDigits: 0 }).format(item.price);
  const amountWithSuffix = `${amount}${item.priceSuffix ?? ''}`;

  if (item.billing === 'monthly') return `${amountWithSuffix} / mo`;
  if (item.billing === 'unit' && item.unit) return `${amountWithSuffix} / ${item.unit}`;
  return amountWithSuffix;
};

export const usePricingPackagesStore = create<PricingPackagesState>()(
  persist(
    (set, get) => ({
      packages: DEFAULT_PRICING_PACKAGES,
      loading: false,
      error: null,
      ready: false,

      setPackages: (packages) => set({ packages, ready: true }),

      subscribeToPackages: () => {
        set({ loading: false, error: null, ready: true });
        return () => undefined;
      },

      addPackage: async (input) => {
        const timestamp = Date.now();
        const next: PricingPackage = {
          ...input,
          id: `pricing_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set(state => ({ packages: [...state.packages, next] }));
        return next;
      },

      updatePackage: async (id, updates) => {
        set(state => ({
          packages: state.packages.map(item => (
            item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
          )),
        }));
      },

      removePackage: async (id) => {
        set(state => ({ packages: state.packages.filter(item => item.id !== id) }));
      },

      getPackagesByService: (service, kind) =>
        get().packages
          .filter(item => item.service === service && item.isActive && (!kind || item.kind === kind))
          .sort(byDisplayOrder),

      getPackageById: (id) =>
        get().packages.find(item => item.id === id),
    }),
    {
      name: 'studio-portal-pricing-packages',
      version: 4,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ packages: state.packages }),
      migrate: (persisted) => {
        const state = persisted as Partial<PricingPackagesState> | undefined;
        const packages = Array.isArray(state?.packages) ? state.packages : [];
        return packages.every(item => item && 'kind' in item && 'currency' in item && 'sortOrder' in item) && hasRequiredPricingFamilies(packages as PricingPackage[])
          ? { packages }
          : { packages: DEFAULT_PRICING_PACKAGES };
      },
    },
  ),
);
