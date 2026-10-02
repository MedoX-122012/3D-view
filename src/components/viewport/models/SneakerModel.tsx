import { useConfigStore } from '../../../store/useConfigStore';
import { PartMesh } from './PartMesh';

const SOLE_TOP = -0.5;
const DEFAULT_SOLE_HEIGHT = 0.28;

const SOLE_HEIGHT: Record<string, number> = {
  flat: 0.2,
  running: 0.28,
  platform: 0.45,
};

const DEFAULT_LACES = [-0.4, -0.12, 0.16, 0.44];

const LACE_X: Record<string, number[]> = {
  standard: [-0.4, -0.12, 0.16, 0.44],
  flat: [-0.4, -0.12, 0.16, 0.44],
  elastic: [-0.3, 0.05, 0.4],
};

export function SneakerModel() {
  const size = useConfigStore((s) => s.config.dimensions['size'] ?? 9);
  const width = useConfigStore((s) => s.config.dimensions['width'] ?? 9.5);
  const soleType = useConfigStore((s) => s.config.components['sole-type'] ?? 'running');
  const laceType = useConfigStore((s) => s.config.components['lace-type'] ?? 'standard');

  const lengthScale = size / 9;
  const widthScale = width / 9.5;
  const soleHeight = SOLE_HEIGHT[soleType] ?? DEFAULT_SOLE_HEIGHT;
  const soleCenterY = SOLE_TOP - soleHeight / 2;

  const laces = LACE_X[laceType] ?? DEFAULT_LACES;

  return (
    <group scale={[lengthScale, 1, widthScale]}>
      <PartMesh
        partId="sole"
        geometry="box"
        args={[2.2, soleHeight, 0.9]}
        position={[0, soleCenterY, 0]}
      />

      <PartMesh
        partId="upper"
        geometry="box"
        args={[2.0, 0.6, 0.85]}
        position={[0, -0.2, 0]}
      />

      <PartMesh
        partId="tongue"
        geometry="box"
        args={[0.3, 0.4, 0.7]}
        position={[0.55, 0.15, 0]}
      />

      <PartMesh
        partId="heel"
        geometry="box"
        args={[0.3, 0.5, 0.8]}
        position={[-0.95, -0.1, 0]}
      />

      {laces.map((x) =>
        laceType === 'flat' ? (
          <PartMesh
            key={`lace-${x}`}
            partId="laces"
            geometry="box"
            args={[0.7, 0.02, 0.05]}
            position={[x, 0.15, 0]}
          />
        ) : (
          <PartMesh
            key={`lace-${x}`}
            partId="laces"
            geometry="cylinder"
            args={[laceType === 'elastic' ? 0.03 : 0.02, laceType === 'elastic' ? 0.03 : 0.02, 0.65, 8]}
            position={[x, 0.15, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        )
      )}

      <PartMesh
        partId="logo"
        geometry="torus"
        args={[0.12, 0.03, 8, 16]}
        position={[0, -0.15, 0.44]}
      />

      <PartMesh
        partId="inner-lining"
        geometry="box"
        args={[1.6, 0.05, 0.7]}
        position={[0.1, 0.05, 0]}
      />
    </group>
  );
}
