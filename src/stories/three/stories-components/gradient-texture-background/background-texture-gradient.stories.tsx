import type { Meta, StoryObj } from "@storybook/react";
import type FiberCanvas from "../../FiberCanvas";
import GradientTextureBackground from "./background-texture-gradient";
import { Suspense } from "react";
import MayoCanvas from "../../non-stories-components/mayo-canvas/mayo-canvas";
import { Bounds } from "@react-three/drei";
import { Color } from "three";
import { bufferGeometry, metalness, roughness } from "./background-texture-gradient.config";


const meta = {
  title: 'Three/Components/GradientTextureBackground',
  component: GradientTextureBackground,
  decorators: [
    (Story) => <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'}>
      <Suspense fallback={<mesh/>}>
        <Story />
        <Bounds fit clip margin={1.2}>
          <mesh
            scale={[0.5, 0.5, 0.5]}
            geometry={bufferGeometry}
          >
            <meshStandardMaterial metalness={metalness} roughness={roughness} emissive={new Color(0xee0000)} />
          </mesh>
        </Bounds>
      </Suspense>
    </MayoCanvas>
  ],

  argTypes:{
    firstColor: {
      control:  { type: 'color' },
    },
    secondColor: {
      control: { type: 'color' },
    },
    direction: {
      control: { type: 'select' },
      options: ["vertical" , "horizontal" ],
    }
  }

} satisfies Meta<typeof GradientTextureBackground>;


export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    firstColor: '#eeffdd',
    secondColor: '#ffffff',
    direction: 'vertical' 
  }
};
