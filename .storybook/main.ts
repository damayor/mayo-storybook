import type { StorybookConfig } from '@storybook/react-vite';

const isProd = process.env.STORYBOOK_ENV === 'production';

const config: StorybookConfig = {
  // "stories" : ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  "stories": isProd
  ? [
      '../src/stories/three/stories-components/pool-3d/pool3D.stories.tsx',
      '../src/stories/three/stories-components/product-rotating-prd/product-rotating-prd.stories.tsx', //ToDo Regex on un prd.stories
      '../src/stories/three/stories-components/floating-card/floating-card.stories.tsx',
    ]
  : ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    // "@storybook/addon-vitest"
    "@storybook/addon-a11y",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  env: (config) => ({
    ...config,
    STORYBOOK_ENV: process.env.STORYBOOK_ENV || 'development',
  }),
};
export default config;