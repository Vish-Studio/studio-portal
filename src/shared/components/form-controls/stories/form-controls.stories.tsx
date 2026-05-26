import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormField, TextArea, TextInput, Checkbox, Toggle, DatePicker } from '@/src/shared/components';

function FormControlsDemo() {
  const [checked, setChecked] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [date, setDate] = useState('2026-05-27');

  return (
    <div className="grid w-[720px] grid-cols-1 gap-5 rounded-[18px] bg-white p-6 md:grid-cols-2">
      <FormField label="Text input" required>
        <TextInput placeholder="Project name" defaultValue="Studio portal" />
      </FormField>

      <FormField label="Text input with error" required error="Name is required">
        <TextInput placeholder="Project name" hasError />
      </FormField>

      <FormField label="Date picker">
        <DatePicker
          value={date}
          onChange={event => setDate(event.target.value)}
        />
      </FormField>

      <FormField label="Toggle">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
          <Toggle checked={toggle} onChange={setToggle} />
          <span className="text-sm font-semibold text-gray-700">{toggle ? 'Enabled' : 'Disabled'}</span>
        </div>
      </FormField>

      <FormField label="Checkbox">
        <Checkbox
          checked={checked}
          onChange={event => setChecked(event.target.checked)}
          label="Generate temporary password"
          description="Creates an initial password for new users."
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Text area">
          <TextArea rows={4} placeholder="Add notes or acceptance criteria..." />
        </FormField>
      </div>
    </div>
  );
}

const meta = {
  title: 'Common/FormControls',
  component: FormControlsDemo,
  parameters: { layout: 'centered', backgrounds: { default: 'app' } },
} satisfies Meta<typeof FormControlsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllControls: Story = {};

export const DisabledControls: Story = {
  render: () => (
    <div className="grid w-[520px] grid-cols-1 gap-5 rounded-[18px] bg-white p-6">
      <FormField label="Disabled input">
        <TextInput disabled value="Read-only value" />
      </FormField>
      <Checkbox disabled checked label="Disabled checkbox" />
      <Toggle disabled checked onChange={() => undefined} />
    </div>
  ),
};
