import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * HeroScene - WebGL Hero Layer
 * 
 * SOTA 2025 WebGL Scene with:
 * - Particle field with noise + reactivity
 * - Post-processing (Bloom, Vignette)
 * - 60fps performance target
 * - Responsive (adaptive quality)
 */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]} // Adaptive pixel ratio
        performance={{ min: 0.5 }} // Adaptive performance
      >
        <Suspense fallback={null}>
          {/* Ambient Light */}
          <ambientLight intensity={0.5} />
          
          {/* Particle Field */}
          <ParticleField />
          
          {/* Post-Processing */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <Vignette
              offset={0.3}
              darkness={0.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
