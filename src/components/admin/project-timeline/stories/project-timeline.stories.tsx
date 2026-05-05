import type { Meta, StoryObj } from '@storybook/react';
import ProjectTimeline from '../project-timeline';
import type { ClientProject } from '../../../../data/projects';
import type { TemplateAssignment } from '../../../../store/template-assignments';

const project: ClientProject = {
  id: 'p_story',
  clientId: 'c_story',
  name: 'Social Media Kit',
  status: 'active',
  agreedPayment: 5000,
  paidPayment: 2500,
  timeline: 'May - July 2026',
  startedAt: Date.now(),
  service: 'website',
  package: 'growth',
  assignedMemberIds: [],
  phases: [
    { id: 'ph_1', title: 'Discovery/Brief', icon: 'explore', status: 'done', requiresClientAction: false, clientCompleted: true },
    { id: 'ph_2', title: 'Proposal', icon: 'description', status: 'done', requiresClientAction: false, clientCompleted: true },
    { id: 'ph_3', title: 'Quotation', icon: 'request_quote', status: 'active', requiresClientAction: true, clientCompleted: false, targetDate: '15 May 2026', description: 'Client to review pricing.' },
    { id: 'ph_4', title: 'Invoice', icon: 'receipt', status: 'pending', requiresClientAction: false, clientCompleted: false },
    { id: 'ph_5', title: 'Design', icon: 'design_services', status: 'pending', requiresClientAction: false, clientCompleted: false },
  ],
};

const assignment: TemplateAssignment = {
  id: 'ta_story',
  projectId: project.id,
  phaseKey: 'ph_2',
  templateSlug: 'project-proposal',
  documentTitle: 'Project Proposal',
  blocks: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const meta = {
  title: 'Admin/ProjectTimeline',
  component: ProjectTimeline,
  args: {
    project,
    isManaging: false,
    getPhaseAssignment: (_projectId: string, phaseId: string) => phaseId === assignment.phaseKey ? assignment : undefined,
    onToggleManage: () => {},
    onAddPhase: () => {},
    onEditPhase: () => {},
    onAssignTemplate: () => {},
    onOpenDocument: () => {},
    onCompletePhase: () => {},
    onSetActivePhase: () => {},
    onMovePhase: () => {},
    onDeletePhase: () => {},
    onCreateDefaultPhase: () => {},
  },
} satisfies Meta<typeof ProjectTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Managing: Story = {
  args: {
    isManaging: true,
  },
};

export const Empty: Story = {
  args: {
    project: {
      ...project,
      phases: [],
    },
  },
};
