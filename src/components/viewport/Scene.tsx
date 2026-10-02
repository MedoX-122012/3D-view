import { useRef, useEffect } from 'react';
import type { ComponentRef } from 'react';
import { Environment, ContactShadows, OrbitControls, Lightformer } from '@react-three/drei';
import { Lighting } from './Lighting';
import { ProductModel } from './ProductModel';

export function Scene() {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  useEffect(() => {
    function handleCameraAction(e: Event) {
      const action = (e as CustomEvent<string>).detail;
      const controls = controlsRef.current;
      if (!controls) return;

      switch (action) {
        case 'reset':
          controls.reset();
          break;
        case 'front':
          controls.object.position.set(0, 1.5, 5);
          controls.target.set(0, 0, 0);
          controls.update();
          break;
        case 'side':
          controls.object.position.set(5, 1.5, 0);
          controls.target.set(0, 0, 0);
          controls.update();
          break;
        case 'top':
          controls.object.position.set(0, 6, 0.01);
          controls.target.set(0, 0, 0);
          controls.update();
          break;
      }
    }

    window.addEventListener('camera-action', handleCameraAction);
    return () => window.removeEventListener('camera-action', handleCameraAction);
  }, []);

  return (
    <>
      <Lighting />
      <ProductModel />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} blur={2.5} far={4} />

      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2.2}
          position={[0, 4, -6]}
          scale={[12, 6, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.2}
          position={[-6, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 6, 1]}
          color="#9db4ff"
        />
        <Lightformer
          intensity={1.2}
          position={[6, 1, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 6, 1]}
          color="#ffd0a0"
        />
        <Lightformer
          intensity={1.6}
          position={[0, 6, 0]}
          rotation-x={Math.PI / 2}
          scale={[10, 10, 1]}
        />
      </Environment>

      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}
