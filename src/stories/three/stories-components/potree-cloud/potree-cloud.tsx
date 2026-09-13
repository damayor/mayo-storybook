import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, PerspectiveCamera, Sphere, Vector3 } from 'three';
import {
  PointColorType,
  PointShape,
  PointSizeType,
  Potree,
  type PointCloudOctree,
} from '@pnext/three-loader';

type OrbitLike = { target: Vector3; update: () => void };

export interface PotreeCloudProps {
  /** Folder holding metadata.json, octree.bin and hierarchy.bin. */
  baseUrl?: string;
  /**
   * Max points on screen at once. Potree unloads octree nodes to stay under
   * this, so it is the single knob trading visual quality for framerate.
   */
  pointBudget?: number;
  pointSize?: number;
  /**
   * ADAPTIVE derives size from each node's `spacing`, so coarse nodes draw
   * bigger points and hide the gaps between them. That is what makes a
   * partially-loaded octree still look like a solid surface.
   */
  pointSizeType?: PointSizeType;
  pointShape?: PointShape;
  /** LOD tints points by octree depth — makes the LOD structure visible. */
  pointColorType?: PointColorType;
  /** Skips the per-frame visibility update, freezing the octree as-is. */
  enableLod?: boolean;
  /** LAS/LAZ is typically Z-up; three.js is Y-up. */
  zUp?: boolean;
  onProgress?: (loaded: number, total: number) => void;
}

export default function PotreeCloud({
  baseUrl = '/assets/meshes/pointclouds/lion_takanawa/',
  pointBudget = 1_000_000,
  pointSize = 1,
  pointSizeType = PointSizeType.ADAPTIVE,
  pointShape = PointShape.SQUARE,
  pointColorType = PointColorType.RGB,
  enableLod = true,
  zUp = true,
  onProgress,
}: PotreeCloudProps) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls) as OrbitLike | null;

  // 'v2' reads PotreeConverter 2.x (metadata.json); 'v1' reads cloud.js.
  const potree = useMemo(() => new Potree('v2'), []);
  const [cloud, setCloud] = useState<PointCloudOctree | null>(null);
  const cloudsRef = useRef<PointCloudOctree[]>([]);

  useEffect(() => {
    let disposed = false;
    let loaded: PointCloudOctree | null = null;

    // Resolves as soon as metadata.json + hierarchy.bin are parsed — the
    // points themselves stream in later, per node, via HTTP Range requests.
    potree
      .loadPointCloud('metadata.json', (relativeUrl) => baseUrl + relativeUrl)
      .then((pco) => {
        if (disposed) {
          pco.dispose();
          return;
        }
        loaded = pco;
        cloudsRef.current = [pco];
        setCloud(pco);
      })
      .catch((err) => {
        console.error(
          `[PotreeCloud] failed to load "${baseUrl}metadata.json".`,
          err,
        );
      });

    return () => {
      disposed = true;
      cloudsRef.current = [];
      setCloud(null);
      loaded?.dispose();
    };
  }, [potree, baseUrl]);

  useEffect(() => {
    if (!cloud) return;
    const m = cloud.material;
    m.size = pointSize;
    m.pointSizeType = pointSizeType;
    m.shape = pointShape;
    m.pointColorType = pointColorType;
  }, [cloud, pointSize, pointSizeType, pointShape, pointColorType]);

  useEffect(() => {
    potree.pointBudget = pointBudget;
  }, [potree, pointBudget]);

  const framedRef = useRef(false);

  useEffect(() => {
    framedRef.current = false;
  }, [cloud]);

  useEffect(() => {
    if (!cloud || framedRef.current) return;
    if (!controls) return;

    // `pco.boundingBox` comes from metadata.json and is correct immediately.
    // `setFromObject` is not: right after load the octree holds no geometry
    // yet, so it would return an empty box.
    const box = cloud.boundingBox.isEmpty()
      ? new Box3().setFromObject(cloud)
      : cloud.boundingBox;
    if (box.isEmpty()) return;

    const center = cloud.localToWorld(box.getCenter(new Vector3()));
    const radius = box.getBoundingSphere(new Sphere()).radius;
    if (radius === 0) return;

    camera.position
      .copy(center)
      .add(new Vector3(radius, radius * 0.6, radius).multiplyScalar(1.4));
    if (camera instanceof PerspectiveCamera) {
      camera.near = Math.max(radius / 1000, 0.001);
      camera.far = radius * 100;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(center);

    controls.target.copy(center);
    controls.update();
    framedRef.current = true;
  }, [cloud, camera, controls, zUp]);

  useFrame(() => {
    if (!enableLod || cloudsRef.current.length === 0) return;

    // The call that drives the whole LOD system: frustum-culls nodes, scores
    // the rest by screen-space error, then loads what is worth showing and
    // unloads what is not — all bounded by pointBudget. Without it the octree
    // never refines past whatever the root node happened to hold.
    const result = potree.updatePointClouds(cloudsRef.current, camera, gl);
    onProgress?.(result.numVisiblePoints, potree.pointBudget);

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__potreeDebug = {
        visiblePoints: result.numVisiblePoints,
        visibleNodes: result.visibleNodes.length,
        camera: camera.position.toArray().map((n) => +n.toFixed(2)),
        near: (camera as { near?: number }).near,
        far: (camera as { far?: number }).far,
      };
    }
  });

  if (!cloud) return null;

  return (
    <primitive object={cloud} rotation={zUp ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} />
  );
}
