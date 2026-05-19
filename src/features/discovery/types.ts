import type { ServiceType } from '@/src/features/projects';

// ─── Question building blocks ─────────────────────────────────────────────────

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'boolean'
  | 'select';

export type AnswerValue = string | string[] | boolean;

export interface DiscoveryQuestion {
  id: string;
  label: string;
  description?: string;
  type: QuestionType;
  /** Options for radio / checkbox / select */
  options?: string[];
  placeholder?: string;
  required?: boolean;
  /** Show this question only when another answer matches */
  showWhen?: {
    questionId: string;
    value: AnswerValue;
  };
}

export interface DiscoverySection {
  id: string;
  title: string;
  icon: string; // Material Symbol name
  description?: string;
  questions: DiscoveryQuestion[];
}

// ─── Stored record per project ────────────────────────────────────────────────

export type DiscoveryStatus = 'not_started' | 'draft' | 'submitted';

export interface ProjectDiscovery {
  projectId: string;
  serviceType: ServiceType;
  answers: Record<string, AnswerValue>;
  status: DiscoveryStatus;
  /** Timestamp of first submission */
  submittedAt?: number;
  submittedBy?: string;
  /** Last save (draft or edit) */
  savedAt?: number;
  savedBy?: string;
}
