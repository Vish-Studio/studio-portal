import type { Meta, StoryObj } from '@storybook/react';
import Select from '../select';
import FormField from '../../form-field/form-field';

const meta = {
  title: 'Common/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">— Select an option —</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="lost">Lost</option>
      </>
    ),
  },
  decorators: [Story => <div className="w-72"><Story /></div>],
};

export const WithError: Story = {
  args: {
    hasError: true,
    children: (
      <>
        <option value="">— Select an option —</option>
        <option value="active">Active</option>
      </>
    ),
  },
  decorators: [Story => <div className="w-72"><Story /></div>],
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'active',
    children: (
      <>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </>
    ),
  },
  decorators: [Story => <div className="w-72"><Story /></div>],
};

export const CompactFilter: Story = {
  args: {
    className: 'text-[11px] font-semibold text-gray-600 bg-gray-100 border-0 rounded-lg px-2.5 py-1.5 pr-6',
    children: (
      <>
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="to-test">To Test</option>
        <option value="completed">Completed</option>
      </>
    ),
  },
};

export const InsideFormField: StoryObj = {
  render: () => (
    <div className="w-72 flex flex-col gap-4">
      <FormField label="Status" required>
        <Select>
          <option value="">— Select status —</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="lost">Lost</option>
        </Select>
      </FormField>
      <FormField label="Priority" required error="Priority is required">
        <Select hasError>
          <option value="">— Select priority —</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </FormField>
    </div>
  ),
};
