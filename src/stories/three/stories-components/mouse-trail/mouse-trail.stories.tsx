import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import MouseTrail, { type MouseTrailProps } from './mouse-trail'

const meta = {
  title: 'Three/Components/MouseTrailLegacy',
  component: MouseTrail,
  decorators: [
    (Story) => <MayoCanvas enableOrbitControls={false} environmentPreset='studio' gizmoType='viewPort'>
      <Suspense fallback={<mesh/>}>
        <Story/>
      </Suspense>
    </MayoCanvas>
  ],
  argTypes: {
    gizmoType: {
      options: ['none', 'viewCube', 'viewPort'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof MouseTrail>

export default meta;
type Story = StoryObj<typeof meta>;
export const MouseTrailLegacy: Story = {
  args: {
    lineWidth: 15, 
    followMouse: true,
    isPlaneTransparent: true,
    enableOrbitControl: false
  }
};
