import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/internal/theming';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css'; // replace with the name of your tailwind css file

//este si lee desde /.storybook
import './styles.css';
import { Decorator } from '@storybook/react';
import { useEffect } from 'react';

const withTheme:Decorator = (Story, context) => {
  const theme = context.globals.theme || 'dark'; 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme} className="p-1">
      <Story />
    </div>
  );
};


const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Onn Light' },
          { value: 'dark', title: 'Onn Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  // initialGlobals: {
  //   theme: 'dark',
  // },
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
      theme: themes.normal,
    },

    test: { disable: true },
    viewMode: 'docs',
    previewTabs: {
      'storybook/docs/panel': { hidden: false },
      'storybook/test/panel': { hidden: true },      
      canvas: { hidden: true },
    },
    backgrounds: {
      default: "onlight",
      options: {
        onlight: { name: 'onlight', value: '#fff' },
        ondark: { name: 'ondark', value: 'oklch(25.33% 0.016 252.42)' },
      },
    }
  },
  decorators: [
    // withThemeByClassName({
    //   themes: {
    //     dark: 'dark',
    //     light: 'light'
    //   },
    //   defaultTheme: 'dark',
    // }),
    withTheme
  ]
};

export default preview;