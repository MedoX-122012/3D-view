import { useConfigStore } from '../../../store/useConfigStore';
import { PartMesh } from './PartMesh';

const EARCUP_DEFAULT = 5.5;
const HEADBAND_DEFAULT = 3.5;
const HEADBAND_RADIUS = 0.8;

export function HeadsetModel() {
  const earcupSize = useConfigStore(
    (s) => s.config.dimensions['earcup-size'] ?? EARCUP_DEFAULT
  );
  const headbandWidth = useConfigStore(
    (s) => s.config.dimensions['headband-width'] ?? HEADBAND_DEFAULT
  );
  const cableType = useConfigStore((s) => s.config.components['cable-type'] ?? 'wired');
  const earcupType = useConfigStore((s) => s.config.components['earcup-type'] ?? 'over-ear');

  const isOverEar = earcupType === 'over-ear';
  const cupRadius = (0.35 * earcupSize) / EARCUP_DEFAULT * (isOverEar ? 1 : 0.45);
  const cupDepth = isOverEar ? 0.15 : 0.08;
  const headbandTube = (0.06 * headbandWidth) / HEADBAND_DEFAULT;

  return (
    <group>
      <PartMesh
        partId="headband"
        geometry="torus"
        args={[HEADBAND_RADIUS, headbandTube, 8, 32, Math.PI]}
        position={[0, 0.3, 0]}
      />

      <PartMesh
        partId="earcups"
        geometry="cylinder"
        args={[cupRadius, cupRadius, cupDepth, 24]}
        position={[HEADBAND_RADIUS, -0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      <PartMesh
        partId="earcups"
        geometry="cylinder"
        args={[cupRadius, cupRadius, cupDepth, 24]}
        position={[-HEADBAND_RADIUS, -0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />

      <PartMesh
        partId="mic"
        geometry="cylinder"
        args={[0.015, 0.015, 0.35, 8]}
        position={[-HEADBAND_RADIUS - 0.15, -0.35, 0.15]}
        rotation={[0.4, 0, 0]}
      />

      {cableType === 'wired' && (
        <PartMesh
          partId="cable"
          geometry="cylinder"
          args={[0.02, 0.02, 0.6, 8]}
          position={[-HEADBAND_RADIUS, -0.5, 0]}
        />
      )}

      <PartMesh
        partId="controls"
        geometry="box"
        args={[0.04, 0.08, 0.04]}
        position={[HEADBAND_RADIUS + 0.08, -0.15, 0.2]}
      />
      <PartMesh
        partId="controls"
        geometry="box"
        args={[0.04, 0.06, 0.04]}
        position={[HEADBAND_RADIUS + 0.08, -0.15, 0.1]}
      />
    </group>
  );
}
