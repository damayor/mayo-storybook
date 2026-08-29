import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ThreePostprocessing } from './ThreePostprocessing';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

const meta: Meta<typeof ThreePostprocessing> = {
  title: 'ThreeJs/Postprocessing',
  component: ThreePostprocessing,
  argTypes: {
    // — Noise (film grain) —
    noiseOpacity: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Grain intensity',
    },

    // — Scanline (CRT lines) —
    scanlineDensity: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Line spacing — higher = tighter lines',
    },
    scanlineOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Line visibility',
    },

    // — Chromatic Aberration (RGB channel shift) —
    chromaticOffsetX: {
      control: { type: 'range', min: -0.01, max: 0.015, step: 0.0001 },
      description: 'Horizontal channel split width',
    },
    chromaticOffsetY: {
      control: { type: 'range', min: -0.01, max: 0.015, step: 0.0001 },
      description: 'Vertical channel split width',
    },

    // — Vignette (edge darkening) —
    vignetteOffset: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'How far the dark border extends inward',
    },
    vignetteDarkness: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Darkness of the vignette border',
    },

    // — Glitch (signal corruption) —
    glitchDelayMin: {
      control: { type: 'range', min: 0, max: 30, step: 0.5 },
      description: 'Min seconds between glitch bursts',
    },
    glitchDelayMax: {
      control: { type: 'range', min: 0, max: 30, step: 0.5 },
      description: 'Max seconds between glitch bursts',
    },
    glitchDurationMin: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Min duration of each glitch burst',
    },
    glitchDurationMax: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Max duration of each glitch burst',
    },
    glitchStrengthMin: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Min pixel displacement during glitch',
    },
    glitchStrengthMax: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Max pixel displacement during glitch',
    },
    glitchRatio: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Fraction of time spent in weak-glitch mode vs strong',
    },
  },
  decorators: [
    (Story) => (
      <MayoCanvas
        background="#111111"
        renderShadows={false}
        enableOrbitControls
        overrideCameraPos={[-30, 5, 0]}
      >
        <Story />
      </MayoCanvas>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThreePostprocessing>;

export const Default: Story = {
  args: {
    noiseOpacity: 0.5,
    scanlineDensity: 0.5,
    scanlineOpacity: 0.9,
    chromaticOffsetX: 0.004,
    chromaticOffsetY: -0.003,
    vignetteOffset: 0.58,
    vignetteDarkness: 0.58,
    glitchDelayMin: 6.5,
    glitchDelayMax: 12.5,
    glitchDurationMin: 0.6,
    glitchDurationMax: 0.9,
    glitchStrengthMin: 0.3,
    glitchStrengthMax: 0.38,
    glitchRatio: 1.0,
  },
};
