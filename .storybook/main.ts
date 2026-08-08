import type { StorybookConfig } from '@storybook/react-vite';

const isProd = process.env.STORYBOOK_ENV === 'production';

// Base path (relative to src/stories) for each story group. `three` nests its
// components under an extra `stories-components` segment; other groups don't.
const groupBasePaths: Record<string, string> = {
  three: 'three/stories-components',
  cpp: 'cpp',
  html: 'html/experiences',
  webgl: 'webgl',
};

//Pre: folder and story file share the same name, in kebab-case, inside one of the groups above
const prodStories: Array<{ group: keyof typeof groupBasePaths; title: string }> = [
  { group: 'three', title: 'pool-3d' },
  { group: 'three', title: 'product-rotating-prd' },
  { group: 'three', title: 'floating-card' },
  { group: 'three', title: 'material-selector' },
  { group: 'three', title: 'terrain' },
  { group: 'cpp', title: 'webassembly' },
  { group: 'cpp', title: 'ply-renderer' },
  { group: 'webgl', title: 'webgl-basis' },
  { group: 'html', title: 'volvo-catalogue' },
];

const prodStoriesPaths = prodStories.map(
  ({ group, title }) => `../src/stories/${groupBasePaths[group]}/${title}/${title}.stories.tsx`
);

const config: StorybookConfig = {
  // "stories" : ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  stories: isProd
    ? [
        ...prodStoriesPaths,
        '../src/stories/Configure.mdx',
      ]
    : ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    // "@storybook/addon-vitest"
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  env: (config) => ({
    ...config,
    STORYBOOK_ENV: process.env.STORYBOOK_ENV || 'development',
  }),
};
export default config;
