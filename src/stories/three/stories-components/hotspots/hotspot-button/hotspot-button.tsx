import { Html } from '@react-three/drei'
import { useState, type JSX } from 'react'
import { Vector3 } from 'three'
import { hotspotsZIndexRange } from './hotspot-button.config'
import './hotspot-button.css'

export interface HotspotButtonProps {
  position?: Vector3
  index?: number
  isChecked?: boolean
  onToggle: (value: boolean) => void
  customButton?: JSX.Element
}

export default function HotspotButton({ position, index = 0, onToggle, isChecked, customButton }: HotspotButtonProps) {
  const [hidden, setHidden] = useState(false)
  const handleOcclusion = (toggle: boolean) => {
    setHidden(toggle)
    return null
  }

  return (
    <group>
      <Html
        position={position}
        occlude
        onOcclude={handleOcclusion}
        style={{
          transition: 'all 0.25s',
          opacity: hidden ? 0 : 1,
          transform: `scale(${hidden ? 0.5 : 1}) translate(-50%, -50%)`,
          transformOrigin: 'left top',
        }}
        zIndexRange={hotspotsZIndexRange}
      >
        {customButton !== undefined ? (
          <div className='hotspot-button--custom' id={`hotspot-button-custom-${index}`} onClick={() => onToggle(true)}>
            {customButton}
          </div>
        ) : (
          <div className='hotspot-button'>
            <input
              type='checkbox'
              className='hotspot-button__checkbox'
              id={`hotspot-button-${index}`}
              onChange={(e) => onToggle(e.target.checked)}
              checked={isChecked}
            />
            <label htmlFor={`hotspot-button-${index}`} className='hotspot-button__btn'>
              <div className='hotspot-button__circle'>
                <div className='hotspot-button__icon'></div>
              </div>
            </label>
          </div>
        )}
      </Html>
    </group>
  )
}
