import { type StoryObj, type Meta } from '@storybook/react';
import Terrain from './terrain.component';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

const meta = {
  title: 'Three/Components/TerrainGenerator',
  component: Terrain,
  decorators: [
    (Story) => (
      <MayoCanvas
        overrideCameraPos={[10, 10, 10]}
        enableOrbitControls={true}
        environmentPreset="studio"
        gizmoType={'viewPort'}
      >
        <Suspense fallback={<mesh />}>
          <directionalLight position={[10, 100, 10]} intensity={1} castShadow />
          <Story />
        </Suspense>
      </MayoCanvas>
    ),
  ],
} satisfies Meta<typeof Terrain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TerrainGenerator: Story = {};
