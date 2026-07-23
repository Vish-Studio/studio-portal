import type { Meta, StoryObj } from '@storybook/react';
import Toast from '../toast';

const meta = {
  title: 'Common/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'white' },
  },
  argTypes: {
    status: { control: 'select', options: ['success', 'error', 'info'] },
    onDismiss: { action: 'dismissed' },
  },
  args: {
    status: 'success',
    title: 'Changes saved',
    message: 'Your updates were synced successfully.',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Schedule created',
    message: 'The meeting was added to the calendar.',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Unable to save schedule',
    message: 'Your account does not have permission to access this data.',
  },
};

export const Info: Story = {
  args: {
    status: 'info',
    title: 'Sync in progress',
    message: 'We are updating the latest project data.',
  },
};

export const WithoutMessage: Story = {
  args: {
    status: 'success',
    title: 'Profile updated',
    message: undefined,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-[390px] flex-col gap-3">
      <Toast
        status="success"
        title="Client created"
        message="Temporary login details are ready to share."
        onDismiss={() => undefined}
      />
      <Toast
        status="error"
        title="Unable to create record"
        message="Amount must be greater than 0."
        onDismiss={() => undefined}
      />
      <Toast
        status="info"
        title="Sync in progress"
        message="The app is refreshing local data."
        onDismiss={() => undefined}
      />
    </div>
  ),
};
