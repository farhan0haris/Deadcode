import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGitNodes() {
  const ref = useRef<THREE.Points>(null!);

  // Generate random 3D points representing Git nodes
  const sphere = React.useMemo(() => {
    const points = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      points[i * 3] = (Math.random() - 0.5) * 15;
      points[i * 3 + 1] = (Math.random() - 0.5) * 15;
      points[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7C5CFC"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export function GitNodeCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <FloatingGitNodes />
      </Canvas>
    </div>
  );
}
