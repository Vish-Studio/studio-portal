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
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }
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
  if (status === 'done') return 'done';
  if (status === 'completed') return 'done';
  if (status === 'active') return 'active';
  return 'pending';
};

const isServiceType = (value: unknown): value is ClientProject['service'] =>
  value === 'website' || value === 'software' || value === 'mobile-app' || value === 'branding' || value === 'logo-design';

const isPackageType = (value: unknown): value is NonNullable<ClientProject['package']> =>
  value === 'essentials' || value === 'growth' || value === 'premium';

const rawPhaseToPhase = (raw: unknown, index: number): Phase | null => {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  return {
    id: String(data.id ?? `ph_${index}`),
    title: String(data.title ?? data.name ?? 'Phase'),
    icon: String(data.icon ?? 'radio_button_checked'),
    status: phaseStatus(data.status),
    requiresClientAction: data.requiresClientAction === true,
    clientCompleted: data.clientCompleted === true || data.status === 'completed',
    targetDate: typeof data.targetDate === 'string' ? data.targetDate : toDateInput(data.endDate),
    description: typeof data.description === 'string' ? data.description : undefined,
    phaseAmount: typeof data.phaseAmount === 'number' ? data.phaseAmount : undefined,
  };
};

export const userDocToClient = (doc: QueryDocumentSnapshot): Client => {
  const data = doc.data();
  const name = String(data.fullName ?? data.name ?? data.full_name ?? 'Unnamed client');
  const companyName = String(data.companyName ?? data.company_name ?? '');
  const phone = String(data.phoneNumber ?? data.phone_number ?? data.phone ?? '');
  const status = data.status === 'inactive' || data.status === 'lost' ? data.status : 'active';
  const companySize = String(data.companySize ?? data.company_size ?? '');
  return {
    id: doc.id,
    userId: doc.id,
    fullName: name,
    email: String(data.email ?? ''),
    companyName,
    phone,
    website: String(data.website ?? ''),
    industry: String(data.industry ?? ''),
    location: String(data.location ?? ''),
    companySize,
    isOnline: data.isOnline === true || data.is_online === true,
    lastOnlineAt: data.lastOnlineAt as Client['lastOnlineAt'],
    role: 'client',
    status,
    createdAt: data.createdAt as Client['createdAt'],
  };
};

export const userDocToTeamMember = (doc: QueryDocumentSnapshot): TeamMember => {
  const data = doc.data();
  const name = String(data.fullName ?? data.name ?? data.full_name ?? 'Unnamed member');
  const role = String(data.role ?? 'freelancer');
  const accessRole = role === 'team' ? 'freelancer' : role;
  const jobTitle = String(data.jobTitle ?? data.job_title ?? 'Team member');
  const rawStatus = data.workStatus ?? data.status;
  const status = rawStatus === 'fired' ? 'fired' : rawStatus === 'on-leave' ? 'on-leave' : 'working';
  const salaryType = data.salaryType === 'per-project' || data.salary_type === 'per-project' ? 'per-project' : 'monthly';
  const salaryAmount = Number(data.salaryAmount ?? data.salary_amount ?? 0);
  return {
    id: doc.id,
    userId: doc.id,
    name,
    role: jobTitle,
    accessRole: (accessRole === 'superadmin' || accessRole === 'admin' || accessRole === 'freelancer')
      ? accessRole
      : 'freelancer',
    email: String(data.email ?? ''),
    phone: String(data.phoneNumber ?? data.phone_number ?? data.phone ?? ''),
    isOnline: data.isOnline === true || data.is_online === true,
    lastOnlineAt: data.lastOnlineAt as TeamMember['lastOnlineAt'],
    salaryAmount,
    salaryType,
    assignedProjectId: typeof data.assignedProjectId === 'string' ? data.assignedProjectId : null,
    status,
    createdAt: data.createdAt as TeamMember['createdAt'],
    updatedAt: data.updatedAt as TeamMember['updatedAt'],
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
    name: String(data.name ?? data.title ?? 'Untitled project'),
    status,
    phases: phases.length
      ? phases
      : Array.isArray(data.phases)
        ? data.phases.map(rawPhaseToPhase).filter((phase): phase is Phase => Boolean(phase))
        : buildDefaultPhases(0),
    agreedPayment: typeof data.agreedPayment === 'number' ? data.agreedPayment : typeof data.budget === 'number' ? data.budget : 0,
    paidPayment: typeof data.paidPayment === 'number' ? data.paidPayment : 0,
    timeline: String(data.timeline ?? ''),
    startedAt: toMillis(data.startedAt ?? data.startDate ?? data.createdAt),
    startDate: toDateInput(data.startDate ?? data.startedAt ?? data.createdAt),
    endDate: toDateInput(data.endDate),
    service: isServiceType(data.service) ? data.service : 'software',
    package: isPackageType(data.package) ? data.package : undefined,
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
  const status = data.status === 'review' ? 'to-test' : data.status === 'done' ? 'completed' : data.status === 'in-progress' ? 'in-progress' : data.completed === true ? 'completed' : 'todo';
  const priority = data.priority === 'high' || data.priority === 'low' ? data.priority : 'medium';
  return {
    id: doc.id,
    clientId: typeof data.clientId === 'string' ? data.clientId : undefined,
    title: String(data.title ?? 'Untitled task'),
    description: String(data.description ?? ''),
    projectId: String(data.projectId ?? ''),
    status,
    priority,
    assigneeIds: Array.isArray(data.assigneeIds)
      ? data.assigneeIds.map(String)
      : data.assignedToId ? [String(data.assignedToId)] : [],
    clientAssigneeId: typeof data.clientAssigneeId === 'string'
      ? data.clientAssigneeId
      : data.visibleToClient === true && typeof data.clientId === 'string' ? data.clientId : undefined,
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
