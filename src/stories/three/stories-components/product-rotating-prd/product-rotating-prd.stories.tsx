import { ProductModels, SHOE_URL } from '../../helpers/constants/scene-constants';
import type { Meta, StoryObj } from '@storybook/react';
import { FootwearViews } from '../product-rotating/product-rotating.config';
import { ProductRotatingPrd } from './product-rotating-prd';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { Vector3 } from 'three';

// NOTE: product-rotating-prd (ProductRotatingPrd) duplicates the logic in
// ../product-rotating/product-rotating.tsx (ProductRotating) with fewer exposed
// props — it's the curated/prod variant, while product-rotating is the full dev
// playground. If you decide to drop one of the two components:
// - To keep only this one: point this story's `component` at `ProductRotating`
//   instead (with fixed args: enableOrbitControl=false, gizmoType='none', a
//   single glbUrl), delete product-rotating-prd.tsx, and delete
//   product-rotating.stories.tsx (or fold RotatingPDP into this file as a second
//   story export). Update .storybook/main.ts's production story whitelist to
//   reference the surviving story file.
// - To keep only product-rotating: delete this file and product-rotating-prd.tsx,
//   then update .storybook/main.ts's production whitelist to point at
//   product-rotating.stories.tsx with args pinned the same way as above.
// Either way, .storybook/main.ts currently whitelists 'product-rotating-prd' for
// STORYBOOK_ENV=production — that entry must be updated or prod builds will lose
// this story.
const meta = {
  title: 'ThreeJs/Experiences/EcommerceInteractive',
  component: ProductRotatingPrd,
  decorators: [
    (Story) => (
      <div className="relative">
        <MayoCanvas
          enableOrbitControls={false}
          environmentPreset="studio"
          gizmoType="viewCube"
          overrideCameraPos={new Vector3(0, 1, 1.5)}
        >
          <Suspense fallback={<mesh />}>
            <Story />
          </Suspense>
        </MayoCanvas>
        <p className="absolute bottom-2 left-1/2 w-full -translate-x-1/2 text-center text-xs text-neutral-500">
          All 3D assets displayed are property of <b>adidas</b> and are used here only for
          demonstration purposes.
        </p>
      </div>
    ),
  ],
  argTypes: {
    cameraView: {
      options: Object.keys(FootwearViews),
      control: { type: 'select' },
    },
    glbUrl: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof ProductRotatingPrd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EcommerceInteractive: Story = {
  parameters: { showPanel: true },
  args: {
    cameraView: FootwearViews.LEFT,
    glbUrl: SHOE_URL,
  },
};
