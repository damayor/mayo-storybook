import { Html } from '@react-three/drei';
import { useState } from 'react';
import { Vector3 } from 'three';
import { hotspotsZIndexRange } from './hotspot-button.config';
import './hotspot-button.css';

/**
 * Cómo mostrar el `meshIndex` del pin:
 * - `none`   : el icono "+" de siempre.
 * - `inside` : el número reemplaza al "+".
 * - `badge`  : "+" con el número en una chapita al lado.
 */
export type HotspotIndexLabelMode = 'none' | 'inside' | 'badge';

export interface HotspotButtonProps {
  position?: Vector3;
  index?: number;
  isChecked?: boolean;
  onToggle: (value: boolean) => void;
  indexLabel?: HotspotIndexLabelMode;
}

export default function HotspotButton({
  position,
  index = 0,
  onToggle,
  isChecked,
  indexLabel = 'none',
}: HotspotButtonProps) {
  const [hidden, setHidden] = useState(false);
  const handleOcclusion = (toggle: boolean) => {
    setHidden(toggle);
    return null;
  };

  const showsNumberInside = indexLabel === 'inside';
  const showsBadge = indexLabel === 'badge';

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
        <div className="hotspot-button">
          <input
            type="checkbox"
            className="hotspot-button__checkbox"
            id={`hotspot-button-${index}`}
            onChange={(e) => onToggle(e.target.checked)}
            checked={isChecked}
          />
          <label
            htmlFor={`hotspot-button-${index}`}
            className="hotspot-button__btn"
            title={`Hotspot ${index}`}
          >
            <div className="hotspot-button__circle">
              {/* El modificador --number oculta las barras del "+" vía CSS. */}
              <div
                className={`hotspot-button__icon${
                  showsNumberInside ? ' hotspot-button__icon--number' : ''
                }`}
              >
                {showsNumberInside && <span className="hotspot-button__index">{index}</span>}
              </div>
            </div>
          </label>
          {showsBadge && <span className="hotspot-button__badge">{index}</span>}
        </div>
      </Html>
    </group>
  );
}
