import type { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { buildDefaultPhases, type ClientProject, type Phase, type PhaseStatus } from '@/src/features/projects/types';
import type { Task } from '@/src/features/tasks/types';
import type { StudioDocument } from '@/src/features/documents/types';
import type { ChatMessage } from '@/src/features/chat/stores/chatStore';
import type { Client } from '@/src/features/clients/types';
import type { TeamMember } from '@/src/features/team/types';
import type { AuthRole } from '@/src/types/auth';

const toMillis = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (value && typeof (value as Timestamp).toMillis === 'function') return (value as Timestamp).toMillis();
  if (value instanceof Date) return value.getTime();
  return Date.now();
};

const toDateInput = (value: unknown) => {
  if (!value) return undefined;
  if (value && typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate().toISOString().slice(0, 10);
  }
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
};

const phaseStatus = (status: unknown): PhaseStatus => {
  if (status === 'completed') return 'done';
  if (status === 'active') return 'active';
  return 'pending';
};

export const userDocToClient = (doc: QueryDocumentSnapshot): Client => {
  const data = doc.data();
  const name = String(data.name ?? 'Unnamed client');
  return {
    id: doc.id,
    userId: doc.id,
    user_id: doc.id,
    fullName: name,
    full_name: name,
    email: String(data.email ?? ''),
    companyName: '',
    company_name: '',
    phone: '',
    phone_number: '',
    role: 'client',
    status: 'active',
    createdAt: data.createdAt as Client['createdAt'],
    created_at: data.createdAt as Client['created_at'],
  };
};

export const userDocToTeamMember = (doc: QueryDocumentSnapshot): TeamMember => {
  const data = doc.data();
  const name = String(data.name ?? 'Unnamed member');
  const role = String(data.role ?? 'freelancer');
  const accessRole = role === 'team' ? 'freelancer' : role;
  return {
    id: doc.id,
    userId: doc.id,
    user_id: doc.id,
    name,
    full_name: name,
    role: 'Team member',
    job_title: 'Team member',
    accessRole: (accessRole === 'superadmin' || accessRole === 'admin' || accessRole === 'freelancer')
      ? accessRole
      : 'freelancer',
    email: String(data.email ?? ''),
    assignedProjectId: null,
    createdAt: data.createdAt as TeamMember['createdAt'],
    created_at: data.createdAt as TeamMember['created_at'],
  };
};

export const projectDocToClientProject = (
  doc: QueryDocumentSnapshot,
  phases: Phase[] = [],
): ClientProject => {
  const data = doc.data();
  const rawStatus = data.status;
  const status = rawStatus === 'completed' ? 'completed' : rawStatus === 'planning' ? 'paused' : 'active';

  return {
    id: doc.id,
    clientId: String(data.clientId ?? ''),
    name: String(data.title ?? 'Untitled project'),
    status,
    phases: phases.length ? phases : buildDefaultPhases(0),
    agreedPayment: 0,
    paidPayment: 0,
    timeline: '',
    startedAt: toMillis(data.createdAt),
    service: 'software',
    assignedMemberIds: Array.isArray(data.assignedTeamIds) ? data.assignedTeamIds.map(String) : [],
  };
};

export const phaseDocToPhase = (doc: QueryDocumentSnapshot): Phase => {
  const data = doc.data();
  return {
    id: doc.id,
    title: String(data.name ?? 'Phase'),
    icon: 'radio_button_checked',
    status: phaseStatus(data.status),
    requiresClientAction: false,
    clientCompleted: data.status === 'completed',
    targetDate: toDateInput(data.endDate),
  };
};

export const taskDocToTask = (doc: QueryDocumentSnapshot): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: String(data.title ?? 'Untitled task'),
    description: String(data.description ?? ''),
    projectId: String(data.projectId ?? ''),
    status: data.status === 'review' ? 'to-test' : data.status === 'done' ? 'completed' : data.status === 'in-progress' ? 'in-progress' : 'todo',
    priority: 'medium',
    assigneeIds: data.assignedToId ? [String(data.assignedToId)] : [],
    dueDate: toDateInput(data.dueDate),
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt ?? data.createdAt),
  };
};

export const documentDocToStudioDocument = (doc: QueryDocumentSnapshot): StudioDocument => {
  const data = doc.data();
  const type = data.type === 'brief' || data.type === 'asset' ? 'onboarding' : data.type === 'contract' || data.type === 'invoice' ? data.type : 'proposal';
  return {
    id: doc.id,
    type,
    title: String(data.title ?? 'Untitled document'),
    url: String(data.fileUrl ?? ''),
    clientId: String(data.projectId ?? ''),
    isSigned: data.actionStatus === 'approved',
    createdAt: { toMillis: () => toMillis(data.updatedAt) },
    author: data.uploadedBy ? { type: 'member', name: String(data.uploadedBy) } : undefined,
  };
};

export const messageDocToChatMessage = (
  projectId: string,
  doc: QueryDocumentSnapshot,
): ChatMessage => {
  const data = doc.data();
  return {
    id: doc.id,
    conversationId: `chat_project_${projectId}`,
    senderRole: (data.senderRole === 'client' || data.senderRole === 'team') ? data.senderRole : 'admin',
    senderName: String(data.senderName ?? 'User'),
    body: String(data.text ?? ''),
    createdAt: toMillis(data.createdAt),
  };
};

export const isFirestoreRole = (role: unknown): role is AuthRole =>
  role === 'superadmin' || role === 'admin' || role === 'freelancer' || role === 'team' || role === 'client';
