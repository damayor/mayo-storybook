import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import FluidShader from './fluid-shader'
import { Canvas } from '@react-three/fiber'

const meta = {
  title: 'Three/Fluid Shader',
  component: FluidShader,
  decorators: [
    (Story) => 
      // <Canvas

        // gl={{ antialias: true }}
        // camera={{ position: [0, 0, 1], fov: 45 }}
        // onPointerMove={(e) => e.stopPropagation()}

      <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType='viewPort'>
          <Suspense fallback={<mesh/>}>
            <Story />
          </Suspense>
        {/* </Canvas */}

      </MayoCanvas>
  ],
  argTypes: {
    // gizmoType: {
    //   options: ['none', 'viewCube', 'viewPort'],
    //   control: {
    //     type: 'select',
    //   },
    // },
  },
} satisfies Meta<typeof FluidShader>

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    // lineWidth: 15, 
    // followMouse: true,
    // isPlaneTransparent: true,
    // enableOrbitControl: false
  }
};
