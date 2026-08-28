import { type StoryObj, type Meta } from '@storybook/react';
import WebGPUHelloWorld from './webgpu-hello-world';

const meta = {
  title: 'ThreeJs/Native/WebGPUHelloWorld',
  component: WebGPUHelloWorld,
  parameters: {
    docs: {
      description: {
        component:
          'Hola Mundo con `WebGPURenderer` de three.js (`three/webgpu`) y un material de nodos TSL (`three/tsl`), inyectado en `@react-three/fiber` vía el prop `gl` como función async. Si el navegador no soporta WebGPU, `WebGPURenderer` hace fallback automático a WebGL2 — el badge en la esquina superior izquierda indica qué backend quedó activo.',
      },
    },
  },
} satisfies Meta<typeof WebGPUHelloWorld>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebGPU_Hello_World: Story = {};
