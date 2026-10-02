export function Lighting() {
  return (
    <group>
      <ambientLight intensity={0.3} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight position={[-3, 4, -3]} intensity={0.4} />

      <pointLight position={[0, 3, 0]} intensity={0.3} />
    </group>
  );
}
