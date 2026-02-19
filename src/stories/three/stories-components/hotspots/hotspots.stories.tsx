
import { type StoryObj, type Meta } from '@storybook/react'

import { Suspense } from 'react'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import ProductRotating from '../product-rotating/product-rotating'
import { HOTSPOTS_SHOE_URL, hotspotsCopaData, ProductModels, SHOE_COPA_URL, SHOE_URL } from '../../helpers/constants/scene-constants'
import { FootwearViews } from '../product-rotating/product-rotating.config'
import { ProductRotatingPrd } from '../product-rotating-prd/product-rotating-prd'
import Hotspots from './hotspots'
import { defaultHotspotsConfiguration } from './constants/default-product-config'

const meta = {
  title: 'Three/Experiences/Hotspots',
  component: ProductRotatingPrd,
  decorators: [
    (Story) => <MayoCanvas enableOrbitControls={false} environmentPreset='studio' gizmoType='viewPort'>
      <Suspense fallback={<mesh/>}>
        <Story/>
      </Suspense>
    </MayoCanvas>
  ],

  argTypes: {
    glbUrl: {
      options: Object.keys(ProductModels),
      mapping: ProductModels,
      control: {
        type: 'select',
      },
    },
    cameraView: {
      options: Object.keys(FootwearViews),
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof ProductRotatingPrd>

export default meta;
type Story = StoryObj<typeof meta>;
export const Sample: Story = { 
  args : {
    glbUrl: HOTSPOTS_SHOE_URL,
    cameraView : FootwearViews.RIGHT,
    // gizmoType: 'none',
    // hotspotsData: hotspotsPredatorData,
    // sceneConfig: defaultSceneConfiguration,
    // hotspotsConfig: defaultHotspotsConfiguration,
  

  }
}
