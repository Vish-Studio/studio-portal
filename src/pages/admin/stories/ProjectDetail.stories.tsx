import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetail from '../ProjectDetail';

const meta = {
  title: 'Pages/Admin/ProjectDetail',
  component: ProjectDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof ProjectDetail>;

export default meta;

const withProject = (id: string) => ({
  render: () => (
    <MemoryRouter initialEntries={[`/admin/projects/${id}`]}>
      <Routes>
        <Route path="/admin/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>
  ),
});

export const BrandRefresh: StoryObj = {
  ...withProject('p1'),
  parameters: { docs: { description: { story: 'Branding project — mid progress, 4/8 phases.' } } },
};

export const ECommerceRedesign: StoryObj = {
  ...withProject('p3'),
  parameters: { docs: { description: { story: 'Website · Premium — 6/8 phases done.' } } },
};

export const MobileAppMVP: StoryObj = {
  ...withProject('p4'),
  parameters: { docs: { description: { story: 'Mobile App — fully completed and settled.' } } },
};

export const NotFound: StoryObj = {
  ...withProject('p_doesnotexist'),
  parameters: { docs: { description: { story: 'Renders the "not found" state.' } } },
};
