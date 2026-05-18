import type { Meta, StoryObj } from '@storybook/react';
import Topbar from '../Topbar';

const meta = {
  title: 'Layouts/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component:
          'App topbar — includes search bar (desktop), mobile search toggle, notifications dropdown, and user menu dropdown. ' +
          'Requires MemoryRouter (provided by Storybook preview decorator).',
      },
    },
  },
} satisfies Meta<typeof Topbar>;

export default meta;

export const Dashboard: StoryObj = {
  render: () => (
    <div className="bg-white/80 backdrop-blur-md px-6 py-6">
      <Topbar setIsMobileMenuOpen={() => {}} title="Dashboard" />
    </div>
  ),
};

export const Projects: StoryObj = {
  render: () => (
    <div className="bg-white/80 backdrop-blur-md px-6 py-6">
      <Topbar setIsMobileMenuOpen={() => {}} title="Projects" />
    </div>
  ),
};

export const Clients: StoryObj = {
  render: () => (
    <div className="bg-white/80 backdrop-blur-md px-6 py-6">
      <Topbar setIsMobileMenuOpen={() => {}} title="Clients" />
    </div>
  ),
};
