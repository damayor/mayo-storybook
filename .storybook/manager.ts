import { addons } from 'storybook/manager-api';
import { STORY_PREPARED } from 'storybook/internal/core-events';
import sbTheme from './sb-theme';

addons.register('panel-visibility', (api) => {
  // storyChanged fires before parameters are available; STORY_PREPARED's payload carries them.
  api.on(STORY_PREPARED, ({ parameters }: { parameters?: { showPanel?: boolean } }) => {
    api.togglePanel(parameters?.showPanel ?? false);
  });
});

addons.setConfig({
  base: '/storybook/',
  sidebar: {
    // showRoots: false,
    collapsedRoots: ['ThreeJs','WebGL', 'pixi', 'example'],
  },
  theme: sbTheme,
  selectedPanel: 'storybook/controls/panel',
  panelPosition: 'right',
  rightPanelWidth: 400,
});
