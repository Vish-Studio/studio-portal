import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClientDetailPage from '../ClientDetailPage';

const meta = {
  title: 'Features/Clients/Pages/ClientDetailPage',
  component: ClientDetailPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 900 } },
  },
} satisfies Meta<typeof ClientDetailPage>;

export default meta;

// ClientDetailPage reads :id from the URL — wrap each story in a router
// that seeds the correct client id.
const withClient = (id: string) => ({
  render: () => (
    <MemoryRouter initialEntries={[`/admin/clients/${id}`]}>
      <Routes>
        <Route path="/admin/clients/:id" element={<ClientDetailPage />} />
      </Routes>
    </MemoryRouter>
  ),
});

export const SarahMitchell: StoryObj = {
  ...withClient('c1'),
  parameters: { docs: { description: { story: 'Active client with 2 projects.' } } },
};

export const JamesLee: StoryObj = {
  ...withClient('c2'),
  parameters: { docs: { description: { story: 'Active client (Globex) with 2 projects.' } } },
};

export const NotFound: StoryObj = {
  ...withClient('c_doesnotexist'),
  parameters: { docs: { description: { story: 'Renders the "not found" state.' } } },
};
