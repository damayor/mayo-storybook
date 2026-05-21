import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import { BerlinCityBackground } from './WasmCpp'
import { ContactShadows } from '@react-three/drei'
import { contactShadowsBlur, contactShadowsFar, contactShadowsOpacity, contactShadowsRotation } from '../../non-stories-components/scene-environment/scene-environment.config'

const meta = {
  title: 'C++/Experiences/ObjRenderer',
  component: BerlinCityBackground,
  decorators: [
    (Story) => 
      <MayoCanvas overrideCameraPos={new Vector3(-30, 0.5, 0)} enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'} renderShadows={false}>
        <Suspense fallback={<mesh/>}>
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

//ToDo enable Controls and all the right panel at default
export const WebAssembly: Story = {};