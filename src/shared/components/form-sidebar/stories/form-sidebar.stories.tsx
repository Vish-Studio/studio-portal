import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FormSidebar, { FormSidebarFooter } from '../form-sidebar';
import FormField, { inputCls, selectCls } from '../../form-field/form-field';
import Select from '../../select/select';
import Option from '../../select/option';

const meta = {
  title: 'Common/FormSidebar',
  component: FormSidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    width: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof FormSidebar>;

export default meta;

const SidebarDemo = ({ width = 'md', title = 'New Client', description = 'Fill in the details below.' }: {
  width?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8 min-h-screen bg-gray-100 flex items-start gap-4">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl"
      >
        Open Sidebar
      </button>

      <FormSidebar isOpen={open} onClose={() => setOpen(false)} title={title} description={description} width={width}>
        <form className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <FormField label="Full Name" required>
              <input placeholder="Sarah Mitchell" className={inputCls(false)} />
            </FormField>
            <FormField label="Company Name">
              <input placeholder="Acme Corp" className={inputCls(false)} />
            </FormField>
            <FormField label="Email Address" required>
              <input type="email" placeholder="sarah@acme.com" className={inputCls(false)} />
            </FormField>
            <FormField label="Status" required>
              <Select className={selectCls(false)}>
                <Option value="">Active</Option>
                <Option value="">Inactive</Option>
                <Option value="">Lost</Option>
              </Select>
            </FormField>
          </div>
          <FormSidebarFooter>
            <button type="button" onClick={() => setOpen(false)}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-xl transition-colors">
              Save Client
            </button>
          </FormSidebarFooter>
        </form>
      </FormSidebar>
    </div>
  );
};

export const Default: StoryObj = { render: () => <SidebarDemo /> };
export const Narrow: StoryObj = { render: () => <SidebarDemo width="sm" title="Quick Edit" /> };
export const Wide: StoryObj = { render: () => <SidebarDemo width="lg" title="New Project" description="Configure all project settings." /> };
