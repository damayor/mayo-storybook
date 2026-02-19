import { type StoryObj, type Meta } from '@storybook/react'
import { Suspense } from 'react'
import { Vector3 } from 'three'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import type { JSX } from 'react/jsx-runtime'
import { WasmMesh } from './WasmMesh'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

const meta = {
  title: 'Three/Views/C++ WASM',
  component: WasmMesh,
  decorators: [
    (Story) => 
    <MayoCanvas overrideCameraPos={new Vector3(0, 20, -30)} enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'}>
      <Suspense fallback={<mesh/>}>
        <Story />
      </Suspense>
    </MayoCanvas>
  ],
} satisfies Meta;



export default meta;
type Story = StoryObj<typeof meta>;

export const WASM: Story = {};