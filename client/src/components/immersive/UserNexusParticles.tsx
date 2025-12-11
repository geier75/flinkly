import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UserNexusParticlesProps {
  privacyStatus: "secure" | "synced" | "pending" | "warning";
  mousePosition: { x: number; y: number };
  isActive: boolean;
}

/**
 * UserNexusParticles - Privacy-aware particle system for User Nexus
 * 
 * Level 1 (Sensory Space): Living dark environment with calm particle flow
 * Level 2 (Responsive Presence): Mouse movement warps particles gently
 * 
 * Colors based on privacy status:
 * - Green: Synced/Safe
 * - Blue: Secure
 * - Yellow: Pending
 * - Red: Warning/Tracker detected
 */
export function UserNexusParticles({ 
  privacyStatus, 
  mousePosition, 
  isActive 
}: UserNexusParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Privacy status colors
  const statusColors = useMemo(() => ({
    secure: { r: 0.2, g: 0.6, b: 1.0 },      // Blue
    synced: { r: 0.2, g: 0.9, b: 0.4 },      // Green
    pending: { r: 1.0, g: 0.8, b: 0.2 },     // Yellow
    warning: { r: 1.0, g: 0.3, b: 0.3 },     // Red
  }), []);

  // Generate particle positions
  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    const color = statusColors[privacyStatus];

    for (let i = 0; i < count; i++) {
      // Spherical distribution with density falloff
      const radius = Math.pow(Math.random(), 0.5) * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color with variation
      const variation = 0.2 + Math.random() * 0.3;
      colors[i * 3] = color.r * variation;
      colors[i * 3 + 1] = color.g * variation;
      colors[i * 3 + 2] = color.b * variation;

      // Size variation
      sizes[i] = 0.02 + Math.random() * 0.04;

      // Initial velocities for flow
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions, colors, sizes, velocities };
  }, [privacyStatus, statusColors]);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const color = statusColors[privacyStatus];

    // Pulse intensity based on activity
    const pulseIntensity = isActive ? 0.3 : 0.1;
    const pulse = Math.sin(time * 2) * pulseIntensity + 1;

    for (let i = 0; i < positions.length / 3; i++) {
      const idx = i * 3;
      const x = positions[idx];
      const y = positions[idx + 1];
      const z = positions[idx + 2];

      // Gentle noise-based movement
      const noiseScale = 0.1;
      const noiseSpeed = 0.3;
      positions[idx] += Math.sin(time * noiseSpeed + y * noiseScale) * 0.002;
      positions[idx + 1] += Math.cos(time * noiseSpeed + x * noiseScale) * 0.002;
      positions[idx + 2] += Math.sin(time * noiseSpeed + z * noiseScale) * 0.002;

      // Mouse reactivity (Level 2 - Responsive Presence)
      const mouseX = mousePosition.x * 5;
      const mouseY = mousePosition.y * 5;
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        // Gentle push away from mouse
        const force = (3 - distance) * 0.002;
        positions[idx] -= dx * force;
        positions[idx + 1] -= dy * force;
      }

      // Keep particles within bounds
      const currentRadius = Math.sqrt(x * x + y * y + z * z);
      if (currentRadius > 10 || currentRadius < 1) {
        const scale = currentRadius > 10 ? 0.99 : 1.01;
        positions[idx] *= scale;
        positions[idx + 1] *= scale;
        positions[idx + 2] *= scale;
      }

      // Update colors with pulse
      const variation = 0.5 + Math.sin(time + i * 0.01) * 0.2;
      colors[idx] = color.r * variation * pulse;
      colors[idx + 1] = color.g * variation * pulse;
      colors[idx + 2] = color.b * variation * pulse;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // Rotate entire field slowly
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Animate core
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5;
      coreRef.current.rotation.x = time * 0.3;
      const coreScale = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(coreScale);
    }
  });

  const coreColor = useMemo(() => {
    const c = statusColors[privacyStatus];
    return new THREE.Color(c.r, c.g, c.b);
  }, [privacyStatus, statusColors]);

  return (
    <group>
      {/* Particle field */}
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
          size={0.03}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central core - Privacy indicator */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ambient light based on status */}
      <pointLight
        color={coreColor}
        intensity={2}
        distance={15}
        decay={2}
      />
    </group>
  );
}
