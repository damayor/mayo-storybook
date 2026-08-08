import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import sbTheme from './sb-theme';
import '../src/index.css'; // replace with the name of your tailwind css file
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';

//este si lee desde /.storybook
import './styles.css';
import { Decorator } from '@storybook/react';
import { useEffect } from 'react';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme}>
      <Story />
    </div>
  );
};

const customViewports = {
  instagramPost: {
    name: 'Instagram Post (4:5)',
    styles: {
      width: '600px',
      height: '750px',
    },
    type: 'mobile', // purely for grouping, optional
  },
  instagramSquare: {
    name: 'Instagram Square (1:1)',
    styles: {
      width: '600px',
      height: '600px',
    },
    type: 'mobile',
  },
  laptop: {
    name: 'Laptop estándar',
    styles: {
      width: '1440px',
      height: '900px',
    },
    type: 'desktop',
  },
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'On Light' },
          { value: 'dark', title: 'On Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Welcome', 'ThreeJs', 'WebGL', 'C++', 'Html', 'Pixi', '*', 'Example'],
      },
    },
    docs: {
      theme: sbTheme,
    },

    test: { disable: true },
    viewMode: 'docs',
    // viewport: MINIMAL_VIEWPORTS,
    viewport: {
      options: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
    previewTabs: {
      'storybook/docs/panel': { hidden: false },
      'storybook/test/panel': { hidden: true },
      canvas: { hidden: true },
    },
    backgrounds: {
      default: 'onlight',
      options: {
        onlight: { name: 'onlight', value: '#fff' },
        ondark: { name: 'ondark', value: 'oklch(25.33% 0.016 252.42)' },
      },
    },
  },
  decorators: [
    // withThemeByClassName({
    //   themes: {
    //     dark: 'dark',
    //     light: 'light'
    //   },
    //   defaultTheme: 'dark',
    // }),
    withTheme,
  ],
};

export default preview;
