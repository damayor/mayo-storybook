import { type StoryObj, type Meta } from '@storybook/react';
import MaterialSelector from './material-selector';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

const meta = {
  title: 'Three/Experiences/DynamicMaterial',
  component: MaterialSelector,
  decorators: [
    (Story) => (
      <MayoCanvas enableOrbitControls={true} environmentPreset="studio" gizmoType={'viewPort'}>
        <Suspense fallback={<mesh />}>
          <directionalLight position={[10, 100, 10]} intensity={1} castShadow />
          <Story />
        </Suspense>
      </MayoCanvas>
    ),
  ],
} satisfies Meta<typeof MaterialSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DynamicMaterial: Story = {
  parameters: { showPanel: true },
  args: {
    customColor: '#0000ff',
  },
};
