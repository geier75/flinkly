import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * CosmicBackground - Deep space environment with nebulae and stars
 * 
 * Creates an immersive cosmic atmosphere for the dashboard
 */

function StarField({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const colorPalette = [
      [0.4, 0.6, 1.0],   // Blue
      [0.8, 0.4, 1.0],   // Purple
      [1.0, 0.8, 0.4],   // Gold
      [0.4, 1.0, 0.8],   // Cyan
      [1.0, 1.0, 1.0],   // White
    ];
    
    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = color[0];
      cols[i * 3 + 1] = color[1];
      cols[i * 3 + 2] = color[2];
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        vertexColors
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </Points>
  );
}

function Nebula({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
      ref.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
    }
  });

  return (
    <Sphere ref={ref} args={[3, 32, 32]} position={position}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
}

function FloatingOrb({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = initialY + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <Sphere ref={ref} args={[size, 16, 16]} position={position}>
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </Sphere>
  );
}

function EnergyRing({ radius = 5, color = "#8b5cf6" }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
    return geo;
  }, [radius]);

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function CosmicScene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
      
      {/* Star field */}
      <StarField count={8000} />
      
      {/* Nebulae */}
      <Nebula position={[-8, 5, -15]} color="#8b5cf6" scale={2} />
      <Nebula position={[10, -3, -20]} color="#06b6d4" scale={1.5} />
      <Nebula position={[0, 8, -25]} color="#ec4899" scale={1.8} />
      
      {/* Floating orbs */}
      <FloatingOrb position={[-4, 2, -5]} color="#8b5cf6" size={0.2} />
      <FloatingOrb position={[3, -1, -4]} color="#06b6d4" size={0.15} />
      <FloatingOrb position={[5, 3, -6]} color="#f59e0b" size={0.25} />
      <FloatingOrb position={[-3, -2, -3]} color="#10b981" size={0.18} />
      
      {/* Energy rings */}
      <EnergyRing radius={8} color="#8b5cf6" />
      <EnergyRing radius={12} color="#06b6d4" />
    </>
  );
}

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/30 to-slate-950 z-10 pointer-events-none" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #020617, #0f0a1e, #020617)' }}
      >
        <CosmicScene />
      </Canvas>
    </div>
  );
}
