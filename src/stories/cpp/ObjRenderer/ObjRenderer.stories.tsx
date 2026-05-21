import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import MayoCanvas from '../../three/non-stories-components/mayo-canvas/mayo-canvas'
import { ObjRenderer } from './ObjRenderer'

const meta = {
  title: 'C++/Obj3DRenderer',
  component: ObjRenderer,
  decorators: [
    (Story) =>
      <MayoCanvas overrideCameraPos={new Vector3(-30, 0.5, 0)} enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'} renderShadows={false}>
        <Suspense fallback={<mesh />}>
          <gridHelper
            args={[20, 10, 0xbbb, 0xbbb]}
            position={[0, 0, 0]}
          />
          <Story />
        </Suspense>
      </MayoCanvas>
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Obj3DRenderer: Story = {};
