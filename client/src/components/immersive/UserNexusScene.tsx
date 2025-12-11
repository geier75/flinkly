import { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { UserNexusParticles } from "./UserNexusParticles";

interface UserNexusSceneProps {
  privacyStatus: "secure" | "synced" | "pending" | "warning";
  isActive: boolean;
}

/**
 * UserNexusScene - 3D Scene wrapper for the User Nexus
 * 
 * Provides the immersive 3D background with privacy-aware particles
 */
export function UserNexusScene({ privacyStatus, isActive }: UserNexusSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />
          
          {/* Privacy-aware particle system */}
          <UserNexusParticles
            privacyStatus={privacyStatus}
            mousePosition={mousePosition}
            isActive={isActive}
          />
          
          {/* Subtle camera movement */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
