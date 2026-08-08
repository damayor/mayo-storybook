import { type StoryObj, type Meta } from '@storybook/react';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import MayoCanvas from '../../three/non-stories-components/mayo-canvas/mayo-canvas';
import { HelloWasmMesh } from './HelloWasmMesh';
import { ContactShadows } from '@react-three/drei';
import {
  contactShadowsBlur,
  contactShadowsFar,
  contactShadowsOpacity,
  contactShadowsRotation,
} from '../../three/non-stories-components/scene-environment/scene-environment.config';

const meta = {
  title: 'C++/WebAssembly',
  component: HelloWasmMesh,
  decorators: [
    (Story) => (
      <MayoCanvas
        overrideCameraPos={new Vector3(-30, 0.5, 0)}
        enableOrbitControls={true}
        environmentPreset="studio"
        gizmoType={'viewPort'}
        renderShadows={false}
      >
        <Suspense fallback={<mesh />}>
          <Story />
          <ContactShadows
            rotation-x={contactShadowsRotation}
            position={[0, -2, 0]}
            opacity={contactShadowsOpacity}
            width={6}
            height={4}
            blur={contactShadowsBlur}
            far={contactShadowsFar}
          />
        </Suspense>
      </MayoCanvas>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

//ToDo enable Controls and all the right panel at default
export const WebAssembly: Story = {};
