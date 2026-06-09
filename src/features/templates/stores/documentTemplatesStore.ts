import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TEMPLATES, type TemplateDefinition } from '../templates';

export interface DocumentTemplate extends TemplateDefinition {
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

type DocumentTemplateInput = Omit<DocumentTemplate, 'createdAt' | 'updatedAt'>;

interface DocumentTemplatesState {
  templates: DocumentTemplate[];
  addTemplate: (input: DocumentTemplateInput) => DocumentTemplate;
  updateTemplate: (slug: string, updates: Partial<DocumentTemplateInput>) => void;
  removeTemplate: (slug: string) => void;
  getTemplateBySlug: (slug: string) => DocumentTemplate | undefined;
  getActiveTemplates: () => DocumentTemplate[];
}

const now = Date.now();

export const DEFAULT_DOCUMENT_TEMPLATES: DocumentTemplate[] = TEMPLATES.map(template => ({
  ...template,
  isActive: true,
  createdAt: now,
  updatedAt: now,
}));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `template-${Date.now()}`;

export const useDocumentTemplatesStore = create<DocumentTemplatesState>()(
  persist(
    (set, get) => ({
      templates: DEFAULT_DOCUMENT_TEMPLATES,

      addTemplate: (input) => {
        const timestamp = Date.now();
        const baseSlug = slugify(input.slug || input.title);
        const existing = new Set(get().templates.map(template => template.slug));
        const slug = existing.has(baseSlug) ? `${baseSlug}-${timestamp}` : baseSlug;
        const next: DocumentTemplate = {
          ...input,
          slug,
          path: input.path || `/admin/templates/${slug}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set(state => ({ templates: [...state.templates, next] }));
        return next;
      },

      updateTemplate: (slug, updates) =>
        set(state => ({
          templates: state.templates.map(template => (
            template.slug === slug ? { ...template, ...updates, slug, updatedAt: Date.now() } : template
          )),
        })),

      removeTemplate: (slug) =>
        set(state => ({ templates: state.templates.filter(template => template.slug !== slug) })),

      getTemplateBySlug: (slug) =>
        get().templates.find(template => template.slug === slug),

      getActiveTemplates: () =>
        get().templates.filter(template => template.isActive),
    }),
    {
      name: 'studio-portal-document-templates',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ templates: state.templates }),
      migrate: (persisted) => {
        const state = persisted as Partial<DocumentTemplatesState> | undefined;
        const templates = Array.isArray(state?.templates) ? state.templates : [];
        return templates.length
          ? { templates: templates.map(template => ({ ...template, isActive: template.isActive !== false })) }
          : { templates: DEFAULT_DOCUMENT_TEMPLATES };
      },
    },
  ),
);
