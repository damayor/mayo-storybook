import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/internal/theming';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css'; // replace with the name of your tailwind css file

//este si lee desde /.storybook
import './styles.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
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
        order: ['Welcome', 'Html', 'Three', 'Pixi', '*' , 'Example'],
      },
      // you can also use a custom sorter function
    },
    docs: {
      theme: themes.dark,
    },

    test: { disable: true },
    viewMode: 'docs',
    previewTabs: {
      'storybook/docs/panel': { hidden: false },
      'storybook/test/panel': { hidden: true },      
      canvas: { hidden: true },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
  ]
  
};

export default preview;