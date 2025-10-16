import { create } from 'storybook/theming';

import './styles/sb-config.css'
import './styles/sb-sidebar.css'

export default create({
  base: 'dark',

  colorPrimary: '#d68dab',
  colorSecondary: '#8f3056',

  appBg: '#1e1e1e',
  appContentBg: 'black',
  appBorderColor: 'white',
  appBorderRadius: 0,

  fontCode: 'monospace',

  textColor: 'white',
  textInverseColor: 'white',
  textMutedColor: '#999999',

  barTextColor: '#999999',
  barSelectedColor: 'white',
  barBg: '#1e1e1e',

  //Ahh en controls!
  inputBg: 'black',
  inputBorder: 'silver',
  inputTextColor: 'white',
  inputBorderRadius: 4,

  brandTitle: 'May Interactive Storybook',
  brandUrl: '/',
  brandImage: '/mayint_header.png',
  brandTarget: '_self',

})