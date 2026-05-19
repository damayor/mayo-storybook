import type { Meta, StoryObj } from '@storybook/react'
import { XRHelloWorld } from './XRHelloWorld'

const meta: Meta<typeof XRHelloWorld> = {
  title: 'Three/Experiences/XR',
  component: XRHelloWorld,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A basic WebXR VR scene using @react-three/xr v5. Click "Enter VR" (rendered by VRButton) with the Immersive Web Emulator active, or tap it on Android Chrome. The box toggles color on click (mouse) or controller trigger (VR).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof XRHelloWorld>

export const HelloWorld: Story = {}
