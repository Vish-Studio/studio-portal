import { create } from 'zustand';
import type { StageKey } from '../data/projects';
import type { TemplateBlock } from '../data/template-blocks';

export interface TemplateAssignment {
  id:            string;
  projectId:     string;
  phaseKey:      StageKey;
  templateSlug:  string;
  documentTitle: string;
  blocks:        TemplateBlock[];
  createdAt:     number;
  updatedAt:     number;
}

interface TemplateAssignmentsState {
  assignments: TemplateAssignment[];
  addAssignment:    (a: TemplateAssignment) => void;
  updateAssignment: (id: string, updates: Partial<Omit<TemplateAssignment, 'id' | 'createdAt'>>) => void;
  removeAssignment: (id: string) => void;
  getProjectAssignments: (projectId: string) => TemplateAssignment[];
  getPhaseAssignment:    (projectId: string, phaseKey: StageKey) => TemplateAssignment | undefined;
}

export const useTemplateAssignmentsStore = create<TemplateAssignmentsState>((set, get) => ({
  assignments: [],

  addAssignment: (a) =>
    set(state => ({ assignments: [...state.assignments, a] })),

  updateAssignment: (id, updates) =>
    set(state => ({
      assignments: state.assignments.map(a =>
        a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a,
      ),
    })),

  removeAssignment: (id) =>
    set(state => ({ assignments: state.assignments.filter(a => a.id !== id) })),

  getProjectAssignments: (projectId) =>
    get().assignments.filter(a => a.projectId === projectId),

  getPhaseAssignment: (projectId, phaseKey) =>
    get().assignments.find(a => a.projectId === projectId && a.phaseKey === phaseKey),
}));
