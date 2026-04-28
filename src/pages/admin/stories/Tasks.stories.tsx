import type { Meta, StoryObj } from '@storybook/react';
import Tasks from '../../Tasks';

const meta = {
  title: 'Pages/Admin/Tasks',
  component: Tasks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, iframeHeight: 900 },
      description: {
        component:
          'Task management page — project-linked tasks with statuses: todo, in-progress, to-test, completed. ' +
          'Supports full CRUD via the Add Task sidebar. Status and priority can be changed directly from each card.',
      },
    },
  },
} satisfies Meta<typeof Tasks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
