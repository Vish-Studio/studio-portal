import type { Meta, StoryObj } from '@storybook/react';
import Select from '../select';
import Option from '../option';
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
        <Option value="">— Select an option —</Option>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
        <Option value="lost">Lost</Option>
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
        <Option value="">— Select an option —</Option>
        <Option value="active">Active</Option>
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
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
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
        <Option value="all">All</Option>
        <Option value="todo">Todo</Option>
        <Option value="in-progress">In Progress</Option>
        <Option value="to-test">To Test</Option>
        <Option value="completed">Completed</Option>
      </>
    ),
  },
};

export const InsideFormField: StoryObj = {
  render: () => (
    <div className="w-72 flex flex-col gap-4">
      <FormField label="Status" required>
        <Select>
          <Option value="">— Select status —</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="lost">Lost</Option>
        </Select>
      </FormField>
      <FormField label="Priority" required error="Priority is required">
        <Select hasError>
          <Option value="">— Select priority —</Option>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      </FormField>
    </div>
  ),
};
