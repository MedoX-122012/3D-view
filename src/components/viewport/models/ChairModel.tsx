import { useConfigStore } from '../../../store/useConfigStore';
import { PartMesh } from './PartMesh';

const SEAT_HEIGHT_DEFAULT = 80;
const WIDTH_DEFAULT = 60;
const LEG_RADIUS = 0.04;
const SEAT_THICKNESS = 0.12;
const SEAT_DEPTH = 1.0;

export function ChairModel() {
  const seatHeightDim = useConfigStore(
    (s) => s.config.dimensions['seat-height'] ?? SEAT_HEIGHT_DEFAULT
  );
  const widthDim = useConfigStore((s) => s.config.dimensions['width'] ?? WIDTH_DEFAULT);
  const legStyle = useConfigStore((s) => s.config.components['leg-style'] ?? 'straight');
  const armrestStyle = useConfigStore((s) => s.config.components['armrest-style'] ?? 'none');

  const legHeight = 0.8 * (seatHeightDim / SEAT_HEIGHT_DEFAULT);
  const seatWidth = 1.2 * (widthDim / WIDTH_DEFAULT);
  const seatY = 0;

  const legPositions: [number, number, number][] = [
    [seatWidth / 2 - 0.1, seatY - SEAT_THICKNESS / 2 - legHeight / 2, SEAT_DEPTH / 2 - 0.1],
    [-seatWidth / 2 + 0.1, seatY - SEAT_THICKNESS / 2 - legHeight / 2, SEAT_DEPTH / 2 - 0.1],
    [seatWidth / 2 - 0.1, seatY - SEAT_THICKNESS / 2 - legHeight / 2, -SEAT_DEPTH / 2 + 0.1],
    [-seatWidth / 2 + 0.1, seatY - SEAT_THICKNESS / 2 - legHeight / 2, -SEAT_DEPTH / 2 + 0.1],
  ];

  return (
    <group>
      <PartMesh
        partId="seat"
        geometry="box"
        args={[seatWidth, SEAT_THICKNESS, SEAT_DEPTH]}
        position={[0, seatY, 0]}
      />

      <PartMesh
        partId="backrest"
        geometry="box"
        args={[seatWidth, 0.8, 0.1]}
        position={[0, seatY + 0.46, -SEAT_DEPTH / 2 + 0.05]}
        rotation={[0.1, 0, 0]}
      />

      {legStyle === 'straight' &&
        legPositions.map((pos, i) => (
          <PartMesh
            key={`leg-${i}`}
            partId="legs"
            geometry="cylinder"
            args={[LEG_RADIUS, LEG_RADIUS, legHeight, 12]}
            position={pos}
          />
        ))}

      {legStyle === 'curved' &&
        legPositions.map((pos, i) => {
          const angleX = i < 2 ? 0.08 : -0.08;
          const angleZ = i % 2 === 0 ? 0.08 : -0.08;
          return (
            <PartMesh
              key={`leg-${i}`}
              partId="legs"
              geometry="cylinder"
              args={[LEG_RADIUS, LEG_RADIUS, legHeight, 12]}
              position={pos}
              rotation={[angleX, 0, angleZ]}
            />
          );
        })}

      {legStyle === 'sled' && (
        <>
          <PartMesh
            partId="legs"
            geometry="cylinder"
            args={[LEG_RADIUS, LEG_RADIUS, SEAT_DEPTH - 0.2, 12]}
            position={[seatWidth / 2 - 0.1, seatY - SEAT_THICKNESS / 2 - legHeight + 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <PartMesh
            partId="legs"
            geometry="cylinder"
            args={[LEG_RADIUS, LEG_RADIUS, SEAT_DEPTH - 0.2, 12]}
            position={[-seatWidth / 2 + 0.1, seatY - SEAT_THICKNESS / 2 - legHeight + 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <PartMesh
            partId="legs"
            geometry="cylinder"
            args={[LEG_RADIUS, LEG_RADIUS, seatWidth - 0.2, 12]}
            position={[0, seatY - SEAT_THICKNESS / 2 - legHeight + 0.05, SEAT_DEPTH / 2 - 0.1]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <PartMesh
            partId="legs"
            geometry="cylinder"
            args={[LEG_RADIUS, LEG_RADIUS, seatWidth - 0.2, 12]}
            position={[0, seatY - SEAT_THICKNESS / 2 - legHeight + 0.05, -SEAT_DEPTH / 2 + 0.1]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </>
      )}

      {armrestStyle === 'padded' && (
        <>
          <PartMesh
            partId="armrests"
            geometry="box"
            args={[0.08, 0.06, SEAT_DEPTH - 0.3]}
            position={[seatWidth / 2 + 0.04, seatY + 0.35, 0]}
          />
          <PartMesh
            partId="armrests"
            geometry="box"
            args={[0.08, 0.06, SEAT_DEPTH - 0.3]}
            position={[-seatWidth / 2 - 0.04, seatY + 0.35, 0]}
          />
        </>
      )}

      {armrestStyle === 'wooden' && (
        <>
          <PartMesh
            partId="armrests"
            geometry="box"
            args={[0.06, 0.04, SEAT_DEPTH - 0.3]}
            position={[seatWidth / 2 + 0.03, seatY + 0.35, 0]}
          />
          <PartMesh
            partId="armrests"
            geometry="box"
            args={[0.06, 0.04, SEAT_DEPTH - 0.3]}
            position={[-seatWidth / 2 - 0.03, seatY + 0.35, 0]}
          />
        </>
      )}
    </group>
  );
}
