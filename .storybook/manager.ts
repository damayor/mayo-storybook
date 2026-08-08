import { addons } from 'storybook/manager-api';
import { create, themes } from 'storybook/theming';
import sbTheme from './sb-theme';

addons.register('panel-visibility', (api) => {
  api.on('storyChanged', () => {
    const story = api.getCurrentStoryData();
    const showPanel = (story as any)?.parameters?.showPanel ?? false;
    api.togglePanel(showPanel);
  });
});

addons.setConfig({
  base: '/storybook/',
  sidebar: {
    // showRoots: false,
    collapsedRoots: ['ThreeJs','WebGL', 'pixi', 'example'],
  },
  theme: sbTheme,
});
