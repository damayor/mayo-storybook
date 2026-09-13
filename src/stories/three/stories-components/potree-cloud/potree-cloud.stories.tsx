import { type Meta, type StoryObj } from '@storybook/react';
import { PointColorType, PointShape, PointSizeType } from '@pnext/three-loader';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import PotreeCloud from './potree-cloud';

const meta = {
  title: 'ThreeJs/Components/PotreeCloud',
  component: PotreeCloud,
  decorators: [
    (Story) => (
      <MayoCanvas enableOrbitControls={true} background="#0d0d12" renderShadows={false}>
        <Suspense fallback={null}>
          <Story />
        </Suspense>
      </MayoCanvas>
    ),
  ],
  argTypes: {
    pointBudget: {
      control: { type: 'range', min: 50_000, max: 3_000_000, step: 50_000 },
      description: 'Max points on screen. The loader unloads octree nodes to stay under it.',
    },
    pointSize: {
      control: { type: 'range', min: 0.1, max: 5, step: 0.1 },
    },
    pointSizeType: {
      control: { type: 'select' },
      options: [PointSizeType.FIXED, PointSizeType.ATTENUATED, PointSizeType.ADAPTIVE],
      labels: {
        [PointSizeType.FIXED]: 'Fixed',
        [PointSizeType.ATTENUATED]: 'Attenuated',
        [PointSizeType.ADAPTIVE]: 'Adaptive',
      },
    },
    pointShape: {
      control: { type: 'select' },
      options: [PointShape.SQUARE, PointShape.CIRCLE, PointShape.PARABOLOID],
      labels: {
        [PointShape.SQUARE]: 'Square',
        [PointShape.CIRCLE]: 'Circle',
        [PointShape.PARABOLOID]: 'Paraboloid',
      },
    },
    pointColorType: {
      control: { type: 'select' },
      options: [
        PointColorType.RGB,
        PointColorType.LOD,
        PointColorType.INTENSITY,
        PointColorType.ELEVATION,
      ],
      labels: {
        [PointColorType.RGB]: 'RGB (scan colors)',
        [PointColorType.LOD]: 'LOD (octree depth)',
        [PointColorType.INTENSITY]: 'Intensity',
        [PointColorType.ELEVATION]: 'Elevation',
      },
    },
    enableLod: {
      control: 'boolean',
      description: 'Turns off the per-frame updatePointClouds call — the cloud stops refining.',
    },
    zUp: { control: 'boolean' },
    baseUrl: { control: 'text' },
  },
  args: {
    baseUrl: '/assets/meshes/pointclouds/lion_takanawa/',
    pointBudget: 1_000_000,
    pointSize: 1,
    pointSizeType: PointSizeType.ADAPTIVE,
    pointShape: PointShape.SQUARE,
    pointColorType: PointColorType.RGB,
    enableLod: true,
    zUp: true,
  },
} satisfies Meta<typeof PotreeCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The scan as captured: real RGB, adaptive point size, LOD streaming on. */
export const LionTakanawa: Story = {
  args: {
    pointBudget: 2250000,
  },
};

/**
 * Colors each point by its octree level, which makes the LOD structure
 * visible: orbit closer and watch deeper levels stream in and recolor.
 */
export const LodDebugView: Story = {
  args: {
    pointColorType: PointColorType.LOD,
    pointSize: 2,
  },
};
