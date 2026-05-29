import type { Meta, StoryObj } from '@storybook/react';
import { Building2, Mail, Phone } from '@/src/shared/components/material-icon/material-lucide-icons';
import { DetailHeroCardIconRow, DetailHeroCardSection } from '../../detail-hero-card';

const meta = {
  title: 'Common/Detail Pages/DetailHeroCard/Section',
  component: DetailHeroCardSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'app' },
  },
  args: {
    children: null,
    title: 'Contact & Info',
    icon: <Building2 size={15} />,
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle'],
    },
  },
} satisfies Meta<typeof DetailHeroCardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContactInfo: Story = {
  render: args => (
    <div className="w-[520px] max-w-[calc(100vw-48px)]">
      <DetailHeroCardSection {...args}>
        <DetailHeroCardIconRow icon={<Mail size={12} />}>
          <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">janesh@ikigai.com</span>
        </DetailHeroCardIconRow>
        <DetailHeroCardIconRow icon={<Phone size={12} />}>
          <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">+230 5818 8684</span>
        </DetailHeroCardIconRow>
        <DetailHeroCardIconRow icon={<Building2 size={12} />}>
          <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">Port Louis, Mauritius</span>
        </DetailHeroCardIconRow>
      </DetailHeroCardSection>
    </div>
  ),
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
  },
  render: args => (
    <div className="w-[520px] max-w-[calc(100vw-48px)]">
      <DetailHeroCardSection {...args}>
        <DetailHeroCardIconRow icon={<Mail size={12} />}>
          <span className="min-w-0 truncate text-sm font-semibold text-(--color-ink)">member@studio.test</span>
        </DetailHeroCardIconRow>
      </DetailHeroCardSection>
    </div>
  ),
};
