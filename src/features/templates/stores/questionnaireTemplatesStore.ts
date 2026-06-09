import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ServiceType } from '@/src/features/projects';

export interface QuestionnaireTemplate {
  id: string;
  service: ServiceType;
  title: string;
  description: string;
  questionCount: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

type QuestionnaireTemplateInput = Omit<QuestionnaireTemplate, 'id' | 'createdAt' | 'updatedAt'>;

interface QuestionnaireTemplatesState {
  templates: QuestionnaireTemplate[];
  addTemplate: (input: QuestionnaireTemplateInput) => QuestionnaireTemplate;
  updateTemplate: (id: string, updates: Partial<QuestionnaireTemplateInput>) => void;
  removeTemplate: (id: string) => void;
}

export const TEMPLATE_COLLECTION_PATHS = {
  prices: 'templates/prices',
  documents: 'templates/documents',
  questionnaires: 'templates/questionnaires',
} as const;

export const useQuestionnaireTemplatesStore = create<QuestionnaireTemplatesState>()(
  persist(
    (set) => ({
      templates: [],

      addTemplate: (input) => {
        const timestamp = Date.now();
        const next: QuestionnaireTemplate = {
          ...input,
          id: `questionnaire_${timestamp}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set(state => ({ templates: [...state.templates, next] }));
        return next;
      },

      updateTemplate: (id, updates) =>
        set(state => ({
          templates: state.templates.map(template => (
            template.id === id ? { ...template, ...updates, updatedAt: Date.now() } : template
          )),
        })),

      removeTemplate: (id) =>
        set(state => ({ templates: state.templates.filter(template => template.id !== id) })),
    }),
    {
      name: 'studio-portal-questionnaire-templates',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ templates: state.templates }),
    },
  ),
);
