import type { MaterialType } from '../../../types';
import { useConfigStore } from '../../../store/useConfigStore';
import useUIStore from '../../../store/useUIStore';

function getMaterialProps(materialType: MaterialType) {
  switch (materialType) {
    case 'matte':
      return { roughness: 0.9, metalness: 0 };
    case 'glossy':
      return { roughness: 0.1, metalness: 0.1 };
    case 'metallic':
      return { roughness: 0.3, metalness: 0.9 };
    case 'leather':
      return { roughness: 0.7, metalness: 0 };
    case 'fabric':
      return { roughness: 1.0, metalness: 0 };
    case 'rubber':
      return { roughness: 0.8, metalness: 0 };
    case 'plastic':
      return { roughness: 0.4, metalness: 0 };
    case 'glass':
      return { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.5 };
    default:
      return { roughness: 0.5, metalness: 0 };
  }
}

type GeometryKind = 'box' | 'cylinder' | 'torus' | 'circle';

interface PartMeshProps {
  partId: string;
  geometry: GeometryKind;
  args?: number[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

function renderGeometry(geometry: GeometryKind, args: number[]) {
  const a = (index: number, fallback: number) => args[index] ?? fallback;

  switch (geometry) {
    case 'box':
      return <boxGeometry args={[a(0, 1), a(1, 1), a(2, 1)]} />;
    case 'cylinder':
      return <cylinderGeometry args={[a(0, 1), a(1, 1), a(2, 1), a(3, 32)]} />;
    case 'torus':
      return (
        <torusGeometry
          args={[a(0, 1), a(1, 0.4), a(2, 16), a(3, 48), a(4, Math.PI * 2)]}
        />
      );
    case 'circle':
      return <circleGeometry args={[a(0, 1), a(1, 32)]} />;
  }
}

export function PartMesh({
  partId,
  geometry,
  args = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: PartMeshProps) {
  const color = useConfigStore((s) => s.config.colors[partId] ?? '#cccccc');
  const materialType = useConfigStore((s) => s.config.materials[partId] ?? 'matte');
  const hoveredPart = useUIStore((s) => s.hoveredPart);
  const selectedPart = useUIStore((s) => s.selectedPart);

  const isHovered = hoveredPart === partId;
  const isSelected = selectedPart === partId;
  const materialProps = getMaterialProps(materialType);

  const emissiveColor = isSelected ? '#4488ff' : '#000000';
  const emissiveIntensity = isSelected ? 0.3 : isHovered ? 0.15 : 0;

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        useUIStore.getState().setHoveredPart(partId);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        useUIStore.getState().setHoveredPart(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        useUIStore.getState().setSelectedPart(partId);
      }}
    >
      {renderGeometry(geometry, args)}
      <meshStandardMaterial
        color={color}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        transparent={materialProps.transparent}
        opacity={materialProps.opacity ?? 1}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}
