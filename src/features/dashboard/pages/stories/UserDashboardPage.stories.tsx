import type { Meta, StoryObj } from '@storybook/react';
import { UserDashboardPage } from '@/src/features/dashboard';
import { DEMO_CLIENTS, DEMO_DOCUMENTS, DEMO_PROJECTS, DEMO_TASKS } from '@/src/data/seed';
import { useClientsStore } from '@/src/features/clients';
import { useDocumentsStore } from '@/src/features/documents';
import { useProjectsStore } from '@/src/features/projects';
import { useTasksStore } from '@/src/features/tasks';

const SeededUserDashboard = () => {
  useClientsStore.setState({ clients: DEMO_CLIENTS, ready: true });
  useDocumentsStore.setState({ documents: DEMO_DOCUMENTS });
  useProjectsStore.setState({ projects: DEMO_PROJECTS, ready: true });
  useTasksStore.setState({ tasks: DEMO_TASKS, ready: true });

  return <UserDashboardPage />;
};

const meta = {
  title: 'Pages/User/Dashboard',
  component: SeededUserDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    docs: { story: { inline: false, iframeHeight: 980 } },
  },
} satisfies Meta<typeof SeededUserDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
