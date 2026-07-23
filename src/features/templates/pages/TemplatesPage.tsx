import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import { Button, CardContent, ConfirmDialog, FormField, MaterialIcon, Option, Select, StatusBadge, TextInput } from '@/src/shared/components';
import FormSidebar, { FormSidebarActions, FormSidebarError, getFormErrorMessage } from '@/src/shared/components/form-sidebar/form-sidebar';
import { SERVICE_META, type ServiceType } from '@/src/features/projects';
import TemplateCard from '../components/template-card/template-card';
import { formatPricingAmount, TEMPLATE_COLLECTION_PATHS, useDocumentTemplatesStore, usePricingPackagesStore, useQuestionnaireTemplatesStore, type DocumentTemplate, type PricingBilling, type PricingPackage, type PricingTemplateKind } from '@/src/features/templates';
import { isFirebaseConfigured } from '@/src/firebase/config';
import { firebaseErrorMessage } from '@/src/lib/firebase-errors';

interface PricingListItemFormValue {
  value: string;
}

interface PricingTemplateFormValues {
  service: ServiceType;
  kind: PricingTemplateKind;
  tier: string;
  badge: string;
  name: string;
  price: number;
  currency: string;
  priceSuffix: string;
  priceLabel: string;
  originalPrice: number | '';
  billing: PricingBilling;
  unit: string;
  timeline: string;
  bestFor: string;
  revisions: string;
  summary: string;
  features: PricingListItemFormValue[];
  sortOrder: number | '';
  status: 'active' | 'inactive';
  featured: 'yes' | 'no';
}

interface DocumentTemplateFormValues {
  slug: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  status: 'active' | 'inactive';
}

type SidebarMode = 'pricing' | 'document' | null;
export type TemplateSection = 'documents' | 'pricing' | 'questionnaires';

interface TemplatesPageProps {
  initialSection?: TemplateSection;
}

const serviceEntries = Object.entries(SERVICE_META) as [ServiceType, typeof SERVICE_META[ServiceType]][];
const pricingServices = serviceEntries.filter(([service]) => (
  service === 'website' || service === 'mobile-app' || service === 'software' || service === 'branding'
));

const sectionMeta: Record<TemplateSection, { label: string; icon: string; description: string }> = {
  documents: {
    label: 'Document templates',
    icon: 'description',
    description: 'Contracts, invoices, proposals, quotations, and reusable project documents.',
  },
  pricing: {
    label: 'Pricing packages',
    icon: 'request_quote',
    description: 'Service packages, care plans, and add-ons used when creating projects.',
  },
  questionnaires: {
    label: 'Questionnaires',
    icon: 'quiz',
    description: 'Discovery and intake questionnaires will be configured here later.',
  },
};

const pricingKindMeta: Record<PricingTemplateKind, { label: string; title: string; description: string; icon: string }> = {
  package: {
    label: 'Packages',
    title: 'Core packages',
    description: 'Starter, growth, premium, or other core project scopes.',
    icon: 'inventory_2',
  },
  maintenance: {
    label: 'Care plans',
    title: 'Maintenance and care',
    description: 'Recurring support plans paired with service complexity.',
    icon: 'health_and_safety',
  },
  addon: {
    label: 'Add-ons',
    title: 'Common add-ons',
    description: 'Typical additional costs, unit pricing, and optional services.',
    icon: 'add_circle',
  },
};

const pricingServiceCopy: Record<ServiceType, { index: string; title: string; description: string; careTitle: string; addonTitle: string }> = {
  website: {
    index: '01',
    title: 'Website',
    description: 'Compare starter, growth, and premium scopes for website projects. Below the packages, you will find the matching care plan and common additional costs for this service.',
    careTitle: 'Each website package can be paired with its own maintenance scope after launch, so support scales with the complexity of the work.',
    addonTitle: 'These are typical add-on prices for website projects. Final pricing depends on complexity, content readiness, integrations, and timeline.',
  },
  'mobile-app': {
    index: '02',
    title: 'Mobile Apps',
    description: 'Compare starter, growth, and premium scopes for mobile app projects. Below the packages, you will find the matching care plan and common additional costs for this service.',
    careTitle: 'Each mobile app package can be paired with its own maintenance scope after launch, so support scales with the complexity of the work.',
    addonTitle: 'These are typical add-on prices for mobile app projects. Final pricing depends on complexity, content readiness, integrations, and timeline.',
  },
  software: {
    index: '03',
    title: 'Softwares',
    description: 'Compare starter, growth, and premium scopes for software projects. Below the packages, you will find the matching care plan and common additional costs for this service.',
    careTitle: 'Each software package can be paired with its own maintenance scope after launch, so support scales with the complexity of the work.',
    addonTitle: 'These are typical add-on prices for software projects. Final pricing depends on complexity, content readiness, integrations, and timeline.',
  },
  branding: {
    index: '04',
    title: 'Branding',
    description: 'Compare starter, growth, and premium scopes for branding projects. Below the packages, you will find the matching care plan and common additional costs for this service.',
    careTitle: 'Each branding package can be paired with its own maintenance scope after launch, so support scales with the complexity of the work.',
    addonTitle: 'These are typical add-on prices for branding projects. Final pricing depends on complexity, content readiness, integrations, and timeline.',
  },
  'logo-design': {
    index: '05',
    title: 'Logo Design',
    description: 'Logo design pricing is managed through branding packages.',
    careTitle: 'Logo care plans are managed through branding packages.',
    addonTitle: 'Logo add-ons are managed through branding packages.',
  },
};

const sortPricingTemplates = (a: PricingPackage, b: PricingPackage) => (a.sortOrder ?? a.price) - (b.sortOrder ?? b.price);

const pricingToFormValues = (item: PricingPackage): PricingTemplateFormValues => ({
  service: item.service,
  kind: item.kind,
  tier: item.tier ?? '',
  badge: item.badge ?? '',
  name: item.name,
  price: item.price,
  currency: item.currency,
  priceSuffix: item.priceSuffix ?? '',
  priceLabel: item.priceLabel ?? '',
  originalPrice: item.originalPrice ?? '',
  billing: item.billing,
  unit: item.unit ?? '',
  timeline: item.timeline ?? '',
  bestFor: item.bestFor ?? '',
  revisions: item.revisions ?? '',
  summary: item.summary,
  features: item.features.length > 0 ? item.features.map(value => ({ value })) : [{ value: '' }],
  sortOrder: item.sortOrder ?? '',
  status: item.isActive ? 'active' : 'inactive',
  featured: item.isFeatured ? 'yes' : 'no',
});

const documentToFormValues = (item: DocumentTemplate): DocumentTemplateFormValues => ({
  slug: item.slug,
  title: item.title,
  description: item.description,
  icon: item.icon,
  path: item.path,
  status: item.isActive ? 'active' : 'inactive',
});

const defaultPricingValues: PricingTemplateFormValues = {
  service: 'website',
  kind: 'package',
  tier: '',
  badge: '',
  name: '',
  price: 0,
  currency: 'MUR',
  priceSuffix: '',
  priceLabel: '',
  originalPrice: '',
  billing: 'one-time',
  unit: '',
  timeline: '',
  bestFor: '',
  revisions: '',
  summary: '',
  features: [{ value: '' }],
  sortOrder: '',
  status: 'active',
  featured: 'no',
};

const defaultDocumentValues: DocumentTemplateFormValues = {
  slug: '',
  title: '',
  description: '',
  icon: 'description',
  path: '',
  status: 'active',
};

export default function TemplatesPage({ initialSection }: TemplatesPageProps) {
  const navigate = useNavigate();
  const { packages, addPackage, updatePackage, removePackage, subscribeToPackages } = usePricingPackagesStore();
  const { templates, addTemplate, updateTemplate, removeTemplate } = useDocumentTemplatesStore();
  const questionnaires = useQuestionnaireTemplatesStore(state => state.templates);
  const [activeSection, setActiveSection] = useState<TemplateSection>(initialSection ?? 'documents');
  const [selectedService, setSelectedService] = useState<ServiceType>('website');
  const [activeKind, setActiveKind] = useState<PricingTemplateKind>('package');
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(null);
  const [editingPricing, setEditingPricing] = useState<PricingPackage | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentTemplate | null>(null);
  const [confirmPricing, setConfirmPricing] = useState<PricingPackage | null>(null);
  const [confirmDocument, setConfirmDocument] = useState<DocumentTemplate | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pricingForm = useForm<PricingTemplateFormValues>({ defaultValues: defaultPricingValues });
  const documentForm = useForm<DocumentTemplateFormValues>({ defaultValues: defaultDocumentValues });
  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: pricingForm.control,
    name: 'features',
  });

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return subscribeToPackages();
  }, [subscribeToPackages]);

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  const selectedServiceMeta = SERVICE_META[selectedService];
  const selectedServicePricing = useMemo(() => (
    packages
      .filter(item => item.service === selectedService)
      .sort(sortPricingTemplates)
  ), [packages, selectedService]);
  const packageTemplates = selectedServicePricing.filter(item => item.kind === 'package');
  const careTemplates = selectedServicePricing.filter(item => item.kind === 'maintenance');
  const addonTemplates = selectedServicePricing.filter(item => item.kind === 'addon');
  const selectedPricingCopy = pricingServiceCopy[selectedService];

  const sectionCounts: Record<TemplateSection, number> = {
    documents: templates.length,
    pricing: packages.length,
    questionnaires: questionnaires.length,
  };

  const openAddPricing = (kind: PricingTemplateKind = activeKind, service: ServiceType = 'website') => {
    setEditingPricing(null);
    setSubmitError(null);
    const nextOrder = packages.filter(item => item.service === service && item.kind === kind).length + 1;
    setActiveKind(kind);
    pricingForm.reset({ ...defaultPricingValues, kind, service, billing: kind === 'maintenance' ? 'monthly' : kind === 'addon' ? 'unit' : 'one-time', sortOrder: nextOrder });
    setSidebarMode('pricing');
  };

  const openEditPricing = (item: PricingPackage) => {
    setEditingPricing(item);
    setSubmitError(null);
    pricingForm.reset(pricingToFormValues(item));
    setSidebarMode('pricing');
  };

  const openAddDocument = () => {
    setEditingDocument(null);
    setSubmitError(null);
    documentForm.reset(defaultDocumentValues);
    setSidebarMode('document');
  };

  const openEditDocument = (item: DocumentTemplate) => {
    setEditingDocument(item);
    setSubmitError(null);
    documentForm.reset(documentToFormValues(item));
    setSidebarMode('document');
  };

  const closeSidebar = () => {
    setSidebarMode(null);
    setEditingPricing(null);
    setEditingDocument(null);
  };

  const onSubmitPricing = async (data: PricingTemplateFormValues) => {
    const features = data.features.map(item => item.value.trim()).filter(Boolean);
    if (features.length === 0) {
      setSubmitError('Add at least one inclusion or service detail.');
      return;
    }
    const originalPrice = typeof data.originalPrice === 'number' && Number.isFinite(data.originalPrice) ? data.originalPrice : undefined;
    const sortOrder = typeof data.sortOrder === 'number' && Number.isFinite(data.sortOrder) ? data.sortOrder : undefined;

    const payload = {
      service: data.service,
      kind: data.kind,
      tier: data.tier.trim() || undefined,
      badge: data.badge.trim() || undefined,
      name: data.name.trim(),
      price: Number(data.price ?? 0),
      currency: data.currency.trim() || 'MUR',
      originalPrice,
      priceSuffix: data.priceSuffix.trim() || undefined,
      priceLabel: data.priceLabel.trim() || undefined,
      billing: data.billing,
      unit: data.unit.trim() || undefined,
      timeline: data.timeline.trim() || undefined,
      bestFor: data.bestFor.trim() || undefined,
      revisions: data.revisions.trim() || undefined,
      summary: data.summary.trim(),
      features,
      sortOrder,
      isActive: data.status === 'active',
      isFeatured: data.featured === 'yes',
    };

    try {
      if (editingPricing) await updatePackage(editingPricing.id, payload);
      else await addPackage(payload);
      closeSidebar();
    } catch (error) {
      setSubmitError(firebaseErrorMessage(error));
    }
  };

  const onSubmitDocument = (data: DocumentTemplateFormValues) => {
    const payload = {
      slug: data.slug.trim(),
      title: data.title.trim(),
      description: data.description.trim(),
      icon: data.icon.trim() || 'description',
      path: data.path.trim(),
      isActive: data.status === 'active',
    };

    if (editingDocument) updateTemplate(editingDocument.slug, payload);
    else addTemplate(payload);
    closeSidebar();
  };

  const onInvalidSubmit = (invalidErrors: unknown) => {
    setSubmitError(getFormErrorMessage(invalidErrors as Record<string, unknown>));
  };

  return (
    <DashboardLayout title={initialSection ? sectionMeta[initialSection].label : 'Templates'}>
      <div className="flex flex-col gap-6 pb-10">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <p className="type-label text-gray-400">Template library</p>
            <h1 className="mt-1 text-3xl font-bold text-(--color-ink)">
              {initialSection ? sectionMeta[initialSection].label : 'Templates'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
              {initialSection
                ? sectionMeta[initialSection].description
                : `Manage app-wide templates now, with stores shaped for Firebase collections at ${TEMPLATE_COLLECTION_PATHS.documents}, ${TEMPLATE_COLLECTION_PATHS.priceItems}, and ${TEMPLATE_COLLECTION_PATHS.questionnaires}.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSection === 'documents' && (
              <Button type="button" variant="primary" size="md" iconLeft={<MaterialIcon name="description" size={16} />} onClick={openAddDocument}>
                Add document
              </Button>
            )}
            {activeSection === 'pricing' && (
              <Button type="button" variant="primary" size="md" iconLeft={<MaterialIcon name="add" size={16} />} onClick={() => openAddPricing(activeKind, selectedService)}>
                Add pricing
              </Button>
            )}
          </div>
        </section>

        {!initialSection && (
          <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {(Object.keys(sectionMeta) as TemplateSection[]).map(section => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`rounded-[18px] p-4 text-left transition-colors ${
                  activeSection === section
                    ? 'bg-(--color-ink) text-white'
                    : 'border border-gray-200 bg-white text-(--color-ink) hover:bg-(--color-surface-alt)'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${activeSection === section ? 'bg-white/10' : 'bg-(--color-surface-alt)'}`}>
                    <MaterialIcon name={sectionMeta[section].icon} size={18} />
                  </span>
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${activeSection === section ? 'bg-white/10 text-white' : 'bg-(--color-surface-alt) text-gray-500'}`}>
                    {sectionCounts[section]}
                  </span>
                </div>
                <p className="mt-4 text-base font-bold">{sectionMeta[section].label}</p>
                <p className={`mt-1 text-xs font-medium leading-relaxed ${activeSection === section ? 'text-gray-300' : 'text-gray-500'}`}>
                  {sectionMeta[section].description}
                </p>
              </button>
            ))}
          </section>
        )}

        {activeSection === 'pricing' && (
          <CardContent
            iconName="request_quote"
            title="Pricing packages"
            bodyClassName="p-4 md:p-5"
            action={<StatusBadge label={`${packages.length} total`} variant="gray" />}
          >
            <div className="mb-5 grid gap-3 xl:grid-cols-4">
              {pricingServices.map(([service, meta]) => {
                const serviceItems = packages.filter(item => item.service === service);
                const startingPackage = serviceItems.filter(item => item.kind === 'package').sort(sortPricingTemplates)[0];
                const isSelected = selectedService === service;

                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`rounded-[16px] p-4 text-left transition-colors ${
                      isSelected ? 'bg-(--color-accent-lime) text-(--color-ink)' : 'bg-(--color-surface-alt) text-gray-600 hover:text-(--color-ink)'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${isSelected ? 'bg-white/50' : `${meta.accent.bg} ${meta.accent.iconText}`}`}>
                        <MaterialIcon name={meta.icon} size={17} />
                      </span>
                      <span className="text-xs font-bold">{serviceItems.length} items</span>
                    </div>
                    <p className="mt-3 text-sm font-bold">{meta.label}</p>
                    {startingPackage && <p className={`mt-1 text-xs font-semibold ${isSelected ? 'text-(--color-ink)' : 'text-gray-400'}`}>From {formatPricingAmount(startingPackage)}</p>}
                  </button>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-[22px] bg-(--color-ink) text-white">
              <div className="grid gap-5 border-b border-white/10 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <p className="type-label text-(--color-accent-lime)">{selectedPricingCopy.index} / Service pricing</p>
                  <h2 className="mt-2 text-4xl font-bold leading-none tracking-normal">{selectedPricingCopy.title}<span className="text-(--color-accent-lime)">.</span></h2>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-gray-400">{selectedPricingCopy.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-[16px] bg-white/5 p-2 text-center">
                  <div className="rounded-[12px] bg-black/20 px-4 py-3">
                    <p className="text-xl font-bold leading-none">{packageTemplates.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Packages</p>
                  </div>
                  <div className="rounded-[12px] bg-black/20 px-4 py-3">
                    <p className="text-xl font-bold leading-none">{careTemplates.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Care</p>
                  </div>
                  <div className="rounded-[12px] bg-black/20 px-4 py-3">
                    <p className="text-xl font-bold leading-none">{addonTemplates.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">Add-ons</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {packageTemplates.map(item => (
                  <div key={item.id} className={`grid gap-5 p-5 xl:grid-cols-[minmax(190px,0.78fr)_minmax(180px,0.72fr)_minmax(320px,1.25fr)_auto] ${item.isFeatured ? 'bg-(--color-accent-lime)/5' : ''}`}>
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {item.tier && <span className="type-label text-(--color-accent-lime)">{item.tier}</span>}
                        {item.badge && <StatusBadge label={item.badge} variant="amber" />}
                        {!item.isActive && <StatusBadge label="Inactive" variant="gray" />}
                      </div>
                      <p className="text-2xl font-bold leading-tight">{item.name}</p>
                      <p className="mt-3 max-w-xs text-sm font-semibold leading-relaxed text-gray-400">{item.summary}</p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <p className="text-4xl font-bold leading-none">{formatPricingAmount(item)}</p>
                        {item.originalPrice && <p className="text-sm font-bold text-gray-600 line-through">{item.currency === 'MUR' ? `Rs ${item.originalPrice.toLocaleString()}` : item.originalPrice}</p>}
                      </div>
                      <p className="mt-2 type-label text-gray-500">{item.priceLabel || item.billing.replace('-', ' ')}</p>
                      {item.timeline && <p className="mt-4 text-xs font-bold text-gray-400"><span className="text-(--color-accent-lime)">•</span> Delivery: {item.timeline}</p>}
                      {item.bestFor && <p className="mt-3 text-xs font-semibold leading-relaxed text-gray-500">Best for: {item.bestFor}</p>}
                      {item.revisions && <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-500">Revisions: {item.revisions}</p>}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {item.features.map(feature => (
                        <div key={feature} className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-gray-300">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-(--color-accent-lime)">
                            <MaterialIcon name="check" size={11} />
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start justify-end gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => openEditPricing(item)}>Edit</Button>
                      <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmPricing(item)}>Delete</Button>
                    </div>
                  </div>
                ))}

                {packageTemplates.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-gray-400">No packages for {selectedServiceMeta.label} yet.</p>
                    <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={() => openAddPricing('package', selectedService)}>Add package</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.35fr)]">
              <div className="rounded-[22px] border border-(--color-accent-lime)/35 bg-(--color-ink) p-5 text-white">
                <p className="type-label text-(--color-accent-lime)">Care plans</p>
                <h3 className="mt-4 max-w-xs text-3xl font-bold leading-tight">Monthly care by package</h3>
                <p className="mt-6 text-sm font-semibold leading-relaxed text-gray-400">{selectedPricingCopy.careTitle}</p>
                <Button type="button" variant="secondary" size="sm" className="mt-6" onClick={() => openAddPricing('maintenance', selectedService)}>Add care plan</Button>
              </div>

              <div className="rounded-[22px] border border-gray-200 bg-white p-5">
                <div className="mb-4 grid gap-3 border-b border-gray-100 pb-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <div>
                    <p className="type-label text-(--color-accent-lime)">Maintenance</p>
                    <h3 className="mt-2 text-2xl font-bold leading-tight text-(--color-ink)">Package care</h3>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-gray-500">Monthly support is priced against the selected package tier, from essential checks to priority improvement cycles.</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {careTemplates.map(item => (
                    <div key={item.id} className="grid gap-4 py-4 md:grid-cols-[minmax(150px,0.72fr)_150px_minmax(0,1fr)_auto] md:items-start">
                      <div>
                        {item.tier && <p className="type-label text-(--color-accent-lime)">{item.tier}</p>}
                        <p className="mt-1 text-xl font-bold leading-tight text-(--color-ink)">{item.name}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-tight text-(--color-ink)">{formatPricingAmount(item)}</p>
                        <p className="mt-1 type-label text-gray-400">{item.priceLabel || 'Monthly'}</p>
                      </div>
                      <p className="text-sm font-semibold leading-relaxed text-gray-500">{item.summary}</p>
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => openEditPricing(item)}>Edit</Button>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmPricing(item)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                  {careTemplates.length === 0 && <p className="py-6 text-center text-sm font-semibold text-gray-500">No care plans for {selectedServiceMeta.label} yet.</p>}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-gray-200 bg-white p-5">
              <div className="mb-4 grid gap-4 border-b border-gray-100 pb-4 lg:grid-cols-[280px_minmax(0,1fr)_auto] lg:items-start">
                <div>
                  <p className="type-label text-(--color-accent-lime)">Additional costs</p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight text-(--color-ink)">Common add-ons</h3>
                </div>
                <p className="text-sm font-semibold leading-relaxed text-gray-500">{selectedPricingCopy.addonTitle}</p>
                <Button type="button" variant="ghost" size="sm" onClick={() => openAddPricing('addon', selectedService)}>Add add-on</Button>
              </div>

              <div className="divide-y divide-gray-100">
                {addonTemplates.map(item => (
                  <div key={item.id} className="grid gap-3 py-4 md:grid-cols-[minmax(220px,0.9fr)_170px_minmax(0,1fr)_auto] md:items-center">
                    <p className="text-lg font-bold text-(--color-ink)">{item.name}</p>
                    <div>
                      <p className="type-label text-(--color-accent-lime)">{item.priceLabel ? `${item.priceLabel} ${formatPricingAmount(item)}` : formatPricingAmount(item)}</p>
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-gray-500">{item.summary}</p>
                    <div className="flex items-center justify-end gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => openEditPricing(item)}>Edit</Button>
                      <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmPricing(item)}>Delete</Button>
                    </div>
                  </div>
                ))}
                {addonTemplates.length === 0 && <p className="py-6 text-center text-sm font-semibold text-gray-500">No add-ons for {selectedServiceMeta.label} yet.</p>}
              </div>
            </div>
          </CardContent>
        )}

        {activeSection === 'documents' && (
          <CardContent
            iconName="description"
            title="Document templates"
            bodyClassName="p-4 md:p-5"
            action={<StatusBadge label={`${templates.length} total`} variant="gray" />}
          >
            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                <p className="type-label text-gray-400">Collection</p>
                <p className="mt-1 text-sm font-bold text-(--color-ink)">{TEMPLATE_COLLECTION_PATHS.documents}</p>
              </div>
              <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                <p className="type-label text-gray-400">Active</p>
                <p className="mt-1 text-sm font-bold text-(--color-ink)">{templates.filter(template => template.isActive).length} templates</p>
              </div>
              <div className="rounded-[16px] bg-(--color-surface-alt) p-4">
                <p className="type-label text-gray-400">Usage</p>
                <p className="mt-1 text-sm font-bold text-(--color-ink)">Project document assignment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map(tpl => (
                <div key={tpl.slug} className="relative">
                  <TemplateCard
                    slug={tpl.slug}
                    title={tpl.title}
                    description={tpl.description}
                    icon={tpl.icon}
                    onOpen={() => {
                      if (tpl.path) navigate(tpl.path);
                      else openEditDocument(tpl);
                    }}
                  />
                  <div className="absolute right-3 top-3 flex gap-1">
                    {!tpl.isActive && <StatusBadge label="Inactive" variant="gray" />}
                    <Button type="button" variant="secondary" size="sm" onClick={() => openEditDocument(tpl)}>Edit</Button>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setConfirmDocument(tpl)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {activeSection === 'questionnaires' && (
          <CardContent
            iconName="quiz"
            title="Questionnaires"
            bodyClassName="p-4 md:p-5"
            action={<StatusBadge label="Coming later" variant="amber" />}
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-[18px] bg-(--color-surface-alt) p-6">
                <p className="type-label text-gray-400">Collection</p>
                <p className="mt-1 text-lg font-bold text-(--color-ink)">{TEMPLATE_COLLECTION_PATHS.questionnaires}</p>
                <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-gray-500">
                  This section is reserved for service discovery questionnaires. The Zustand store and Firebase collection path are already in place, so we can add the editor without changing the page structure later.
                </p>
              </div>
              <div className="rounded-[18px] bg-(--color-ink) p-6 text-white">
                <p className="type-label text-gray-400">Stored templates</p>
                <p className="mt-2 text-5xl font-bold leading-none">{questionnaires.length}</p>
                <p className="mt-3 text-sm font-medium text-gray-400">Questionnaire builder pending.</p>
              </div>
            </div>
          </CardContent>
        )}
      </div>

      <FormSidebar
        isOpen={sidebarMode === 'pricing'}
        onClose={closeSidebar}
        title={editingPricing ? 'Edit Pricing Template' : 'Add Pricing Template'}
        description={editingPricing ? editingPricing.name : 'Create a package, care plan, or add-on.'}
        width="md"
      >
        <form onSubmit={pricingForm.handleSubmit(onSubmitPricing, onInvalidSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <FormSidebarError title="Pricing template could not be saved" message={submitError} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Service" required error={pricingForm.formState.errors.service?.message}>
                <Select {...pricingForm.register('service', { required: true })}>
                  {pricingServices.map(([key, meta]) => <Option key={key} value={key}>{meta.label}</Option>)}
                </Select>
              </FormField>
              <FormField label="Type" required error={pricingForm.formState.errors.kind?.message}>
                <Select {...pricingForm.register('kind', { required: true })}>
                  <Option value="package">Package</Option>
                  <Option value="maintenance">Care plan</Option>
                  <Option value="addon">Add-on</Option>
                </Select>
              </FormField>
            </div>

            <FormField label="Name" required error={pricingForm.formState.errors.name?.message}>
              <TextInput {...pricingForm.register('name', { required: 'Name is required' })} placeholder="e.g. Growth" hasError={!!pricingForm.formState.errors.name} />
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FormField label="Tier">
                <TextInput {...pricingForm.register('tier')} placeholder="Starter" />
              </FormField>
              <FormField label="Badge">
                <TextInput {...pricingForm.register('badge')} placeholder="Most popular" />
              </FormField>
              <FormField label="Featured">
                <Select {...pricingForm.register('featured')}>
                  <Option value="no">No</Option>
                  <Option value="yes">Yes</Option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FormField label="Currency">
                <TextInput {...pricingForm.register('currency')} placeholder="MUR" />
              </FormField>
              <FormField label="Price" required error={pricingForm.formState.errors.price?.message}>
                <TextInput {...pricingForm.register('price', { valueAsNumber: true, required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })} type="number" min="0" step="0.01" hasError={!!pricingForm.formState.errors.price} />
              </FormField>
              <FormField label="Price Suffix">
                <TextInput {...pricingForm.register('priceSuffix')} placeholder="+" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FormField label="Original Price">
                <TextInput {...pricingForm.register('originalPrice', { valueAsNumber: true })} type="number" min="0" step="0.01" placeholder="Optional" />
              </FormField>
              <FormField label="Price Label">
                <TextInput {...pricingForm.register('priceLabel')} placeholder="Starting from / One-time" />
              </FormField>
              <FormField label="Display Order">
                <TextInput {...pricingForm.register('sortOrder', { valueAsNumber: true })} type="number" min="1" step="1" placeholder="1" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Billing">
                <Select {...pricingForm.register('billing')}>
                  <Option value="one-time">One-time</Option>
                  <Option value="split">Split payment</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="unit">Unit price</Option>
                </Select>
              </FormField>
              <FormField label="Unit">
                <TextInput {...pricingForm.register('unit')} placeholder="page / section" />
              </FormField>
            </div>

            <FormField label="Summary" required error={pricingForm.formState.errors.summary?.message}>
              <TextInput {...pricingForm.register('summary', { required: 'Summary is required' })} placeholder="Short client-facing description" hasError={!!pricingForm.formState.errors.summary} />
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FormField label="Delivery">
                <TextInput {...pricingForm.register('timeline')} placeholder="4-7 business days" />
              </FormField>
              <FormField label="Best For">
                <TextInput {...pricingForm.register('bestFor')} placeholder="Restaurants, salons..." />
              </FormField>
              <FormField label="Revisions">
                <TextInput {...pricingForm.register('revisions')} placeholder="2 revision rounds" />
              </FormField>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="type-label text-gray-400">Features / Inclusions <span className="text-red-500">*</span></p>
                <Button type="button" variant="secondary" size="sm" iconLeft={<MaterialIcon name="add" size={14} />} onClick={() => appendFeature({ value: '' })}>
                  Add item
                </Button>
              </div>
              <div className="space-y-2">
                {featureFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <TextInput
                      {...pricingForm.register(`features.${index}.value`, { required: 'Feature is required' })}
                      placeholder={index === 0 ? 'e.g. Up to 5 pages' : 'Add another inclusion'}
                      hasError={!!pricingForm.formState.errors.features?.[index]?.value}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-12"
                      disabled={featureFields.length === 1}
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              {pricingForm.formState.errors.features && (
                <p className="mt-2 text-xs font-semibold text-red-500">Add at least one inclusion.</p>
              )}
            </div>

            <FormField label="Status">
              <Select {...pricingForm.register('status')}>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </FormField>
          </div>
          <FormSidebarActions onCancel={closeSidebar} isSubmitting={pricingForm.formState.isSubmitting} isDirty={pricingForm.formState.isDirty} submitLabel={editingPricing ? 'Save Pricing' : 'Add Pricing'} />
        </form>
      </FormSidebar>

      <FormSidebar
        isOpen={sidebarMode === 'document'}
        onClose={closeSidebar}
        title={editingDocument ? 'Edit Document Template' : 'Add Document Template'}
        description={editingDocument ? editingDocument.title : 'Create a reusable document template option.'}
        width="md"
      >
        <form onSubmit={documentForm.handleSubmit(onSubmitDocument, onInvalidSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <FormSidebarError title="Document template could not be saved" message={submitError} />
            <FormField label="Title" required error={documentForm.formState.errors.title?.message}>
              <TextInput {...documentForm.register('title', { required: 'Title is required' })} placeholder="e.g. Project Proposal" hasError={!!documentForm.formState.errors.title} />
            </FormField>
            <FormField label="Slug">
              <TextInput {...documentForm.register('slug')} placeholder="project-proposal" readOnly={Boolean(editingDocument)} className={editingDocument ? 'cursor-not-allowed opacity-70' : ''} />
            </FormField>
            <FormField label="Description" required error={documentForm.formState.errors.description?.message}>
              <TextInput {...documentForm.register('description', { required: 'Description is required' })} placeholder="What this template is used for" hasError={!!documentForm.formState.errors.description} />
            </FormField>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Icon">
                <TextInput {...documentForm.register('icon')} placeholder="description" />
              </FormField>
              <FormField label="Preview Path">
                <TextInput {...documentForm.register('path')} placeholder="/admin/templates/quotation" />
              </FormField>
            </div>
            <FormField label="Status">
              <Select {...documentForm.register('status')}>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </FormField>
          </div>
          <FormSidebarActions onCancel={closeSidebar} isSubmitting={documentForm.formState.isSubmitting} isDirty={documentForm.formState.isDirty} submitLabel={editingDocument ? 'Save Template' : 'Add Template'} />
        </form>
      </FormSidebar>

      <ConfirmDialog
        isOpen={!!confirmPricing}
        title="Delete pricing template"
        message={confirmPricing ? `"${confirmPricing.name}" will be removed from future project selection.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (!confirmPricing) return;
          try {
            await removePackage(confirmPricing.id);
            setConfirmPricing(null);
          } catch (error) {
            setSubmitError(firebaseErrorMessage(error));
            setConfirmPricing(null);
          }
        }}
        onCancel={() => setConfirmPricing(null)}
      />

      <ConfirmDialog
        isOpen={!!confirmDocument}
        title="Delete document template"
        message={confirmDocument ? `"${confirmDocument.title}" will no longer be available when assigning documents.` : ''}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (confirmDocument) removeTemplate(confirmDocument.slug);
          setConfirmDocument(null);
        }}
        onCancel={() => setConfirmDocument(null)}
      />
    </DashboardLayout>
  );
}
