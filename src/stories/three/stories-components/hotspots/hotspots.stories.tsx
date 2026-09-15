import { type StoryObj, type Meta } from '@storybook/react';
import { Suspense } from 'react';
import { Vector3 } from 'three';

import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { ProductWithHotspots } from './product-with-hotspots';

/**
 * Experiencia de hotspots sobre un producto: cada pin del GLB abre un modal con
 * su contenido mientras la cámara viaja hasta encuadrarlo.
 *
 * El GLB, el contenido (mock JSON) y la vista inicial son fijos: los controls
 * que quedan son los que afectan a los hotspots, que es el foco del demo.
 */
const meta = {
  title: 'ThreeJs/Experiences/Hotspots',
  component: ProductWithHotspots,
  decorators: [
    (Story) => (
      <MayoCanvas
        enableOrbitControls
        environmentPreset="studio"
        gizmoType="none"
        fullscreen
        background="#ffffff"
        overrideCameraPos={new Vector3(0, 1, 3.5)}
      >
        <Suspense fallback={<mesh />}>
          <Story />
        </Suspense>
      </MayoCanvas>
    ),
  ],
  argTypes: {
    indexLabel: {
      options: ['none', 'inside', 'badge'],
      control: { type: 'inline-radio' },
      description: 'Muestra el `meshIndex` del pin: dentro del botón, en chapita, o nada.',
    },
    imageSize: {
      options: ['S', 'M', 'L'],
      control: { type: 'inline-radio' },
      description: 'Tamaño de la miniatura del modal.',
    },
    modalAnchor: {
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      control: { type: 'inline-radio' },
      description: 'Esquina del canvas donde se ancla el modal.',
    },
    showOrphanPins: {
      control: 'boolean',
      description: 'Renderiza también los pines del GLB que aún no tienen contenido en el JSON.',
    },
    debugShowPinCubes: {
      control: 'boolean',
      description:
        'Depuración: dibuja un cubo clicable sobre cada pin. Al pincharlo cambia de color e ' +
        'imprime en consola su posición 3D, su proyección en píxeles del canvas y cuánto se ' +
        'desvía del centro.',
    },
    hotspotOffset: { control: { type: 'range', min: 1, max: 1.5, step: 0.01 } },
    transitionDuration: { control: { type: 'range', min: 200, max: 3000, step: 100 } },
    scale: { control: { type: 'range', min: 1, max: 20, step: 0.5 } },
  },
} satisfies Meta<typeof ProductWithHotspots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hotspots: Story = {
  args: {
    scale: 8,
    hotspotOffset: 1.05,
    transitionDuration: 1000,
    modalAnchor: 'top-left',
    imageSize: 'M',
    indexLabel: 'none',
    showOrphanPins: false,
    debugShowPinCubes: false,
  },
};
