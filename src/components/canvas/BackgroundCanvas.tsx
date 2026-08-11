"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null!);

  const positions = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 35;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7C5CFC"
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50 transition-opacity">
      <Canvas camera={{ position: [0, 0, 3] }} gl={{ powerPreference: "high-performance" }}>
        <Particles />
      </Canvas>
    </div>
  );
}
