import { useConfigStore } from '../../../store/useConfigStore';
import { PartMesh } from './PartMesh';

const CASE_DEFAULT = 42;
const STRAP_DEFAULT = 20;
const STRAP_LENGTH = 1.2;
const SEGMENTS = 6;

export function WatchModel() {
  const caseSize = useConfigStore((s) => s.config.dimensions['case-size'] ?? CASE_DEFAULT);
  const strapWidth = useConfigStore((s) => s.config.dimensions['strap-width'] ?? STRAP_DEFAULT);
  const faceStyle = useConfigStore((s) => s.config.components['face-style'] ?? 'minimal');
  const strapType = useConfigStore((s) => s.config.components['strap-type'] ?? 'leather');

  const radius = 0.5 * (caseSize / CASE_DEFAULT);
  const strapW = 0.22 * (strapWidth / STRAP_DEFAULT);
  const strapStart = radius + 0.05;
  const handLength = radius * 0.7;

  const strapSides = [1, -1] as const;

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <PartMesh
        partId="case"
        geometry="cylinder"
        args={[radius, radius, 0.12, 32]}
      />

      <PartMesh
        partId="screen"
        geometry="circle"
        args={[radius * 0.84, 32]}
        position={[0, 0.065, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {strapType === 'metal'
        ? strapSides.map((side) =>
            Array.from({ length: SEGMENTS }, (_, i) => {
              const segmentLength = STRAP_LENGTH / SEGMENTS;
              const z =
                side * (strapStart + (i + 0.5) * segmentLength);
              return (
                <PartMesh
                  key={`link-${side}-${i}`}
                  partId="strap"
                  geometry="box"
                  args={[strapW, 0.04, segmentLength - 0.02]}
                  position={[0, 0, z]}
                />
              );
            })
          )
        : strapSides.map((side) => (
            <PartMesh
              key={`strap-${side}`}
              partId="strap"
              geometry="box"
              args={[strapW, 0.05, STRAP_LENGTH]}
              position={[0, 0, side * (strapStart + STRAP_LENGTH / 2)]}
            />
          ))}

      <PartMesh
        partId="crown"
        geometry="cylinder"
        args={[0.04, 0.04, 0.08, 12]}
        position={[radius + 0.04, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />

      <PartMesh
        partId="buckle"
        geometry="box"
        args={[strapW * 0.6, 0.06, 0.08]}
        position={[0, 0.03, -strapStart - STRAP_LENGTH + 0.1]}
      />

      {faceStyle === 'analog' && (
        <>
          <PartMesh
            partId="case"
            geometry="box"
            args={[0.03, 0.012, handLength * 0.7]}
            position={[0, 0.07, -handLength * 0.35]}
          />
          <PartMesh
            partId="case"
            geometry="box"
            args={[0.025, 0.012, handLength]}
            position={[handLength / 2, 0.07, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />
        </>
      )}

      {faceStyle === 'digital' &&
        [-0.3, 0, 0.3].map((offset) => (
          <PartMesh
            key={`digit-${offset}`}
            partId="case"
            geometry="box"
            args={[radius * 0.16, 0.012, radius * 0.34]}
            position={[offset * radius, 0.07, 0]}
          />
        ))}
    </group>
  );
}
