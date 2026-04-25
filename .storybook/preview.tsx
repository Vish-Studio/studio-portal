import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app',   value: '#e2e5e2' }, // --color-body-bg
        { name: 'white', value: '#ffffff' },
        { name: 'dark',  value: '#101113' }, // sidebar / dark cards
        { name: 'surface', value: '#f5f6f8' },
      ],
    },
    layout: 'padded',
  },
  decorators: [
    // Wrap every story in MemoryRouter so components that use
    // react-router hooks (Link, useNavigate, etc.) work without errors.
    (Story) => (
      <MemoryRouter initialEntries={['/admin']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
