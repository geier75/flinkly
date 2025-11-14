import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleField - Noise-driven particle system
 * 
 * Features:
 * - 5000 particles
 * - Noise-based movement
 * - Mouse reactivity
 * - Depth-based opacity
 * - Performance-optimized
 */
export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Generate particle positions
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position in sphere
      const radius = Math.random() * 10 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient (blue to cyan)
      const t = Math.random();
      colors[i * 3] = 0.2 + t * 0.3; // R
      colors[i * 3 + 1] = 0.4 + t * 0.4; // G
      colors[i * 3 + 2] = 0.8 + t * 0.2; // B
    }

    return { positions, colors };
  }, []);

  // Mouse tracking
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Animate particles with noise
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      // Simple noise simulation (sine-based)
      const noiseX = Math.sin(time * 0.5 + x * 0.1) * 0.01;
      const noiseY = Math.cos(time * 0.5 + y * 0.1) * 0.01;
      const noiseZ = Math.sin(time * 0.5 + z * 0.1) * 0.01;

      positions[i] += noiseX;
      positions[i + 1] += noiseY;
      positions[i + 2] += noiseZ;

      // Mouse reactivity
      const dx = mouseRef.current.x * 5 - x;
      const dy = mouseRef.current.y * 5 - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2) {
        positions[i] += dx * 0.001;
        positions[i + 1] += dy * 0.001;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate entire field slowly
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
