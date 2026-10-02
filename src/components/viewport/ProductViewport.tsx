import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { Scene } from './Scene';
import { CameraToolbar } from './CameraToolbar';
import useUIStore from '../../store/useUIStore';

export default function ProductViewport() {
  const isFullscreen = useUIStore((s) => s.isFullscreen);
  const { active, progress } = useProgress();

  return (
    <div
      className={`viewport-container${isFullscreen ? ' fullscreen' : ''}`}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Canvas
        shadows
        camera={{ fov: 45, position: [3, 2, 5] }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          preserveDrawingBuffer: true,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="viewport-loading" style={{ display: active ? 'flex' : 'none' }}>
        <div className="spinner" />
        <p>Loading model… {Math.round(progress)}%</p>
      </div>

      <CameraToolbar />
    </div>
  );
}
