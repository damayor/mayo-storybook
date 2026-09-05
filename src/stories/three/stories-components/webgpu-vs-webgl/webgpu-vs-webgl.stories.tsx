import { type StoryObj, type Meta } from '@storybook/react';
import WebGPUvsWebGL from './webgpu-vs-webgl';

const meta = {
  title: 'WebGL/WebGPU',
  component: WebGPUvsWebGL,
  argTypes: {
    bustCount: {
      control: { type: 'range', min: 20, max: 800, step: 20 },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Comparativa lado a lado: la misma escena (N bustos instanciados con LOD, en posiciones y rotaciones fijas) renderizada dos veces con el mismo `WebGPURenderer` de `three/webgpu`, cambiando únicamente el backend vía la opción `forceWebGL` — WebGPU a la izquierda, WebGL2 a la derecha. Al ser el mismo renderer y el mismo código en ambos lados, la única variable es el backend. Cada panel muestra el backend que realmente quedó activo y su FPS medido en vivo. Sube `bustCount` para forzar más trabajo por frame y hacer visible la diferencia. Nota: si el navegador no soporta WebGPU, el panel izquierdo también caerá a WebGL2 y ambos paneles mostrarán `webgl`. Además, luces/sombras y `envMapIntensity` actualmente solo se ven correctamente en el backend WebGPU real — el fallback WebGL de `WebGPURenderer` los renderiza en negro (ver comentarios en el componente).',
      },
    },
  },
} satisfies Meta<typeof WebGPUvsWebGL>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebGPU: Story = {
  args: {
    bustCount: 200,
  },
};
