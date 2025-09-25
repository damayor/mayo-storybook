import { addons } from 'storybook/manager-api';
import { create, themes } from 'storybook/theming';
import sbTheme from './sb-theme'


 
addons.setConfig({
  sidebar: {
    renderLabel: ({ name }) => name, // didnt work
    // showRoots: false,
     collapsedRoots: [
      'three',
      'pixi',
      'example'
    ]
  
  },
  theme: sbTheme

  // theme: create({
  //   base: 'dark',
  //   colorPrimary: '#FF0000', // color de las carpetas :P
  //   colorSecondary: '#242424', //la story abierta, el boton selecionado, y la opcion del topbar selected

  //   appBg: 'black',
  //   appContentBg: '#222222',
  //   appBorderColor: 'white',
  //   appBorderRadius: 0,

  //   fontCode: 'monospace',

  //   textColor: 'white',
  //   textInverseColor: '#BEBEFF', 
  //   textMutedColor: '#BEBEBE',


  //   // Topbar
  //   barBg: 'black',   // toolbar background
  //   barTextColor: '#999999',
  //   barSelectedColor: '#FFF',
  //   barHoverColor: '#BBB', //hover en btns


  //   inputBg: 'black',
  //   inputBorder: 'silver',
  //   inputTextColor: 'white',
  //   inputBorderRadius: 4,

  // })
  
});