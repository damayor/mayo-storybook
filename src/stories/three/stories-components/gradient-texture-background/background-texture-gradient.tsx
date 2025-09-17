
import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'


export interface GradientTextureBackgroundProps {
  firstColor: string
  secondColor: string
  direction?: "vertical" | "horizontal"
}


export default function GradientTextureBackground({
   firstColor,
  secondColor,
  direction = "vertical",
}: GradientTextureBackgroundProps) {
 

  const { scene } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;

    const gradient =
      direction === "vertical"
        ? context.createLinearGradient(0, 0, 0, canvas.height)
        : context.createLinearGradient(0, 0, canvas.width, 0);

    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(1, secondColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [firstColor, secondColor, direction]);

  scene.background = texture;

  return null;
}
