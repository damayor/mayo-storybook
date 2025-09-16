import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import DreiLine, { type DreiLineProps } from './drei-line'
import type { JSX } from 'react/jsx-runtime'

const meta = {
  title: 'Three/Components/Drei Line',
  component: DreiLine,
  decorators: [
    (Story) => <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'}>
      <Suspense fallback={<mesh/>}>
        <Story />
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
} satisfies Meta<typeof DreiLine>;



export default meta;
type Story = StoryObj<typeof meta>;

export const Card3D: Story = {
  args: {
    gizmoType: 'viewCube',
    lineWidth: 7, 
    endPosition: [1, 1, 0]
  }
};