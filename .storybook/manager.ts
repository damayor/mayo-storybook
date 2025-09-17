import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import MayoTheme from './MayoTheme';
 
addons.setConfig({
  theme: MayoTheme,
});