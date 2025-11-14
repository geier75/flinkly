import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VideoSceneProps {
  videoSrc: string;
  className?: string;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  opacity?: number;
}

export function VideoScene({
  videoSrc,
  className = '',
  blendMode = 'normal',
  opacity = 0.8,
}: VideoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    video: HTMLVideoElement;
    mesh: THREE.Mesh;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Video setup
    const video = document.createElement('video');
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.play().catch((err) => console.warn('Video autoplay failed:', err));

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // Shader material for blend modes
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D videoTexture;
      uniform float opacity;
      uniform int blendMode;
      varying vec2 vUv;

      vec3 blendMultiply(vec3 base, vec3 blend) {
        return base * blend;
      }

      vec3 blendScreen(vec3 base, vec3 blend) {
        return vec3(1.0) - (vec3(1.0) - base) * (vec3(1.0) - blend);
      }

      vec3 blendOverlay(vec3 base, vec3 blend) {
        return mix(
          2.0 * base * blend,
          vec3(1.0) - 2.0 * (vec3(1.0) - base) * (vec3(1.0) - blend),
          step(0.5, base)
        );
      }

      void main() {
        vec4 videoColor = texture2D(videoTexture, vUv);
        
        vec3 finalColor = videoColor.rgb;
        if (blendMode == 1) { // multiply
          finalColor = blendMultiply(vec3(0.1, 0.2, 0.3), videoColor.rgb);
        } else if (blendMode == 2) { // screen
          finalColor = blendScreen(vec3(0.1, 0.2, 0.3), videoColor.rgb);
        } else if (blendMode == 3) { // overlay
          finalColor = blendOverlay(vec3(0.1, 0.2, 0.3), videoColor.rgb);
        }

        gl_FragColor = vec4(finalColor, videoColor.a * opacity);
      }
    `;

    const blendModeMap: Record<string, number> = {
      normal: 0,
      multiply: 1,
      screen: 2,
      overlay: 3,
    };

    const material = new THREE.ShaderMaterial({
      uniforms: {
        videoTexture: { value: videoTexture },
        opacity: { value: opacity },
        blendMode: { value: blendModeMap[blendMode] },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    // Plane geometry (16:9 aspect ratio)
    const geometry = new THREE.PlaneGeometry(2, 1.125);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      sceneRef.current = { scene, camera, renderer, video, mesh, animationId };
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.video.pause();
        sceneRef.current.video.src = '';
        if (containerRef.current?.contains(sceneRef.current.renderer.domElement)) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [videoSrc, blendMode, opacity]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}
