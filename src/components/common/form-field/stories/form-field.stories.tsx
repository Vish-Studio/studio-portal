import type { Meta, StoryObj } from '@storybook/react';
import FormField, { inputCls, selectCls } from '../form-field';
import Select from '../../select/select';
import Option from '../../select/option';

const meta = {
  title: 'Common/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: { layout: 'centered', backgrounds: { default: 'white' } },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Full Name',
    children: <input placeholder="e.g. Sarah Mitchell" className={inputCls(false)} />,
  },
};

export const Required: Story = {
  args: {
    label: 'Email Address',
    required: true,
    children: <input type="email" placeholder="you@studio.com" className={inputCls(false)} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    required: true,
    error: 'Enter a valid email address',
    children: <input type="email" placeholder="you@studio.com" className={inputCls(true)} />,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Phone Number',
    hint: 'Include country code, e.g. +1 (555) 000-0000',
    children: <input type="tel" placeholder="+1 (555) 000-0000" className={inputCls(false)} />,
  },
};

export const SelectField: Story = {
  args: {
    label: 'Status',
    required: true,
    children: (
      <Select className={selectCls(false)}>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
        <Option value="lost">Lost</Option>
      </Select>
    ),
  },
};

export const FullForm: StoryObj = {
  render: () => (
    <div className="w-80 flex flex-col gap-4">
      <FormField label="Full Name" required>
        <input placeholder="Sarah Mitchell" className={inputCls(false)} />
      </FormField>
      <FormField label="Company Name">
        <input placeholder="Acme Corp" className={inputCls(false)} />
      </FormField>
      <FormField label="Email" required error="Enter a valid email address">
        <input type="email" placeholder="sarah@acme.com" className={inputCls(true)} />
      </FormField>
      <FormField label="Status" required>
        <Select className={selectCls(false)}>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </FormField>
    </div>
  ),
};
