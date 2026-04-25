import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
  ],

  // Storybook 10 bundles essentials — no separate addon packages needed.
  addons: [],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Forward the same Vite plugins the app uses so Tailwind v4 and the
  // @/src/* path alias work identically inside Storybook.
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        tailwindcss(),
        tsconfigPaths(),
      ],
    });
  },
};

export default config;
