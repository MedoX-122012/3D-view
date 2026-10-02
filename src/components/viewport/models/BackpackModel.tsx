import { useConfigStore } from '../../../store/useConfigStore';
import { PartMesh } from './PartMesh';

const HEIGHT_DEFAULT = 42;
const CAPACITY_DEFAULT = 25;
const BASE_HEIGHT = 1.6;
const BASE_WIDTH = 1.2;
const BASE_DEPTH = 0.7;

export function BackpackModel() {
  const height = useConfigStore((s) => s.config.dimensions['height'] ?? HEIGHT_DEFAULT);
  const capacity = useConfigStore(
    (s) => s.config.dimensions['capacity'] ?? CAPACITY_DEFAULT
  );
  const style = useConfigStore((s) => s.config.components['style'] ?? 'urban');
  const closure = useConfigStore((s) => s.config.components['closure'] ?? 'zipper');

  const bodyHeight = (BASE_HEIGHT * height) / HEIGHT_DEFAULT;
  const volumeScale = Math.cbrt(capacity / CAPACITY_DEFAULT);
  const bodyWidth = BASE_WIDTH * volumeScale;
  const bodyDepth = BASE_DEPTH * volumeScale;

  const frontZ = bodyDepth / 2 + 0.03;
  const backZ = -(bodyDepth / 2 + 0.03);
  const pocketHeight = 0.5 * volumeScale;
  const pocketY = -bodyHeight * 0.2;
  const strapLength = 0.8 * volumeScale;

  return (
    <group>
      <PartMesh
        partId="main-body"
        geometry="box"
        args={[bodyWidth, bodyHeight, bodyDepth]}
      />

      <PartMesh
        partId="front-pocket"
        geometry="box"
        args={[bodyWidth * 0.83, pocketHeight, 0.15]}
        position={[0, pocketY, frontZ]}
      />

      {[0.35, -0.35].map((x) => (
        <PartMesh
          key={`strap-${x}`}
          partId="straps"
          geometry="box"
          args={[0.1, strapLength, 0.06]}
          position={[x * volumeScale, 0.1, backZ]}
          rotation={[0.15, 0, 0]}
        />
      ))}

      {closure === 'zipper' && (
        <PartMesh
          partId="zipper"
          geometry="cylinder"
          args={[0.015, 0.015, bodyWidth * 0.7, 8]}
          position={[0, pocketY + 0.26, frontZ]}
          rotation={[0, 0, Math.PI / 2]}
        />
      )}
      {closure === 'magnetic' && (
        <PartMesh
          partId="zipper"
          geometry="box"
          args={[0.12, 0.12, 0.04]}
          position={[0, pocketY + pocketHeight / 2 + 0.06, frontZ + 0.04]}
        />
      )}
      {closure === 'velcro' && (
        <PartMesh
          partId="zipper"
          geometry="box"
          args={[bodyWidth * 0.5, 0.08, 0.03]}
          position={[0, pocketY + pocketHeight / 2 + 0.04, frontZ + 0.03]}
        />
      )}

      <PartMesh
        partId="handles"
        geometry="torus"
        args={[0.1, 0.02, 8, 16, Math.PI]}
        position={[0, bodyHeight / 2 + 0.05, -0.15]}
      />

      {style === 'travel' &&
        [-1, 1].map((side) => (
          <PartMesh
            key={`pocket-${side}`}
            partId="front-pocket"
            geometry="box"
            args={[0.12, pocketHeight * 0.9, bodyDepth * 0.5]}
            position={[side * (bodyWidth / 2 + 0.05), pocketY, 0]}
          />
        ))}

      {style === 'sport' && (
        <PartMesh
          partId="straps"
          geometry="box"
          args={[bodyWidth * 0.55, 0.07, 0.05]}
          position={[0, 0.1, backZ - 0.04]}
        />
      )}
    </group>
  );
}
