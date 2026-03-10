import type { StorybookConfig } from '@storybook/react-vite';

const isProd = process.env.STORYBOOK_ENV === 'production';

//ToDo Map including also from HTML
const prodStories = [
  'pool-3d',
  'product-rotating-prd',
  'floating-card',
  'material-selector', 
  'terrain'
]

//Pre: folder and story have the same name
const prodStoriesPaths = prodStories.map((title) => `../src/stories/three/stories-components/${title}/${title}.stories.tsx` )

const config: StorybookConfig = {
  // "stories" : ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  "stories": isProd
  ? [
    ...prodStoriesPaths,
    '../src/stories/html/experiences/volvo-catalogue/volvo-catalogue.stories.tsx'
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