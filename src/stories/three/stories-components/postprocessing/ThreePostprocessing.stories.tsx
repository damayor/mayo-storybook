import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ThreePostprocessing } from './ThreePostprocessing'

const meta: Meta<typeof ThreePostprocessing> = {
  title: 'three/Postprocessing',
  component: ThreePostprocessing,
  argTypes: {
    noiseOpacity:    { control: { type: 'range', min: 0,   max: 0.3, step: 0.01 } },
    scanlineDensity: { control: { type: 'range', min: 0.5, max: 3,   step: 0.1  } },
    vignetteOffset:  { control: { type: 'range', min: 0,   max: 0.8, step: 0.01 } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <Canvas
          camera={{ position: [-30, 0.5, 0], fov: 60 }}
          gl={{ antialias: false }}
        >
          <color attach="background" args={['#111111']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <OrbitControls />
          <Story />
        </Canvas>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThreePostprocessing>

export const Default: Story = {
  args: {
    noiseOpacity: 0.09,
    scanlineDensity: 1.4,
    vignetteOffset: 0.28,
  },
}
