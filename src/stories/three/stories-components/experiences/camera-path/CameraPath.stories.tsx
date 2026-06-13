import type { Meta, StoryObj } from '@storybook/react'
import { Vector3 } from 'three'
import { getProject } from '@theatre/core'
import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'
import MayoCanvas from '../../../non-stories-components/mayo-canvas/mayo-canvas'
import { CameraPath } from './CameraPath'

studio.initialize()
;(window as any).studio = studio

// Theatre.js 0.7.x auto-saves state to localStorage — __experimental_getStore() is gone.
// Run getTheatreState() in the IFRAME console (localhost:6006/iframe.html?...) not the main frame.
;(window as any).getTheatreState = () => {
  const key = Object.keys(localStorage).find(k => k.toLowerCase().includes('theatre'))
  if (!key) {
    console.warn('No Theatre.js data in localStorage yet — add at least one keyframe first.')
    console.log('Available localStorage keys:', Object.keys(localStorage))
    return null
  }
  const full = JSON.parse(localStorage.getItem(key) ?? '{}')
  const json = JSON.stringify(full, null, 2)
  console.log('%c Theatre.js state — paste into theatreState.json:', 'color: cyan; font-weight: bold')
  console.log(json)
  navigator.clipboard?.writeText(json).then(
    () => console.log('%c ✅ Copied to clipboard!', 'color: lime'),
    () => console.log('%c ⚠ Copy manually from the log above', 'color: orange'),
  )
  return full
}

const sheet = getProject('BerlinTour').sheet('Scene')

const meta: Meta<typeof CameraPath> = {
  title: 'three/Experiences/CameraPath',
  component: CameraPath,
  decorators: [
    (Story) => (
      <MayoCanvas
        overrideCameraPos={new Vector3(-30, 0.5, 0)}
        enableOrbitControls={false}
        background="#111111"
        renderShadows={false}
      >
        <SheetProvider sheet={sheet}>
          <Story />
        </SheetProvider>
      </MayoCanvas>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CameraPath>

export const Default: Story = {}
