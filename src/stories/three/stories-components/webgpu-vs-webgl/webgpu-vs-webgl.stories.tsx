import { type StoryObj, type Meta } from '@storybook/react';
import WebGPUvsWebGL from './webgpu-vs-webgl';

const meta = {
  title: 'ThreeJs/Native/WebGPUvsWebGL',
  component: WebGPUvsWebGL,
  argTypes: {
    cubeCount: {
      control: { type: 'range', min: 100, max: 20000, step: 100 },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Comparativa lado a lado: la misma escena (N cubos instanciados, cada uno rotando por separado en CPU cada frame) renderizada dos veces con el mismo `WebGPURenderer` de `three/webgpu`, cambiando únicamente el backend vía la opción `forceWebGL` — WebGPU a la izquierda, WebGL2 a la derecha. Al ser el mismo renderer y el mismo código en ambos lados, la única variable es el backend. Cada panel muestra el backend que realmente quedó activo y su FPS medido en vivo. Sube `cubeCount` para forzar más trabajo por frame y hacer visible la diferencia — con pocos cubos ambos van a 60fps y no hay nada que comparar. Nota: si el navegador no soporta WebGPU, el panel izquierdo también caerá a WebGL2 y ambos paneles mostrarán `webgl`.',
      },
    },
  },
} satisfies Meta<typeof WebGPUvsWebGL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebGPU_vs_WebGL: Story = {
  args: {
    cubeCount: 4000,
  },
};
