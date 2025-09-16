import { ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Vector3 } from "three";
import { ambientLightIntensity, contactShadowsBlur, contactShadowsFar, contactShadowsHeight, contactShadowsOpacity, contactShadowsPosition, contactShadowsRotation, contactShadowsWidth, spotlightAngle, spotLightIntensity, spotLightPenumbra, spotLightPosition } from "./scene-environment.config";

interface SceneEnvironmentProps {
  lightPosition?: Vector3
}

export default function SceneEnvironment({ lightPosition = spotLightPosition }: SceneEnvironmentProps) {

  return (
    <>
      <ambientLight intensity={ambientLightIntensity} />
      <spotLight
        intensity={spotLightIntensity}
        angle={spotlightAngle}
        penumbra={spotLightPenumbra}
        position={lightPosition}
        castShadow
      />
      <Suspense fallback={<mesh />}>
        <ContactShadows
          rotation-x={contactShadowsRotation}
          position={contactShadowsPosition}
          opacity={contactShadowsOpacity}
          width={contactShadowsWidth}
          height={contactShadowsHeight}
          blur={contactShadowsBlur}
          far={contactShadowsFar}
        />
      </Suspense>
    </>
  )
}
