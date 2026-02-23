'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Coming Soon landing with Three.js curved light streak (Odontoa blue gradient)
 * and card layout. Uses project fonts (font-manrope, Inter) and no email form.
 */
export default function ComingSoonLanding() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;
    cancelledRef.current = false;

    let animationId: number | undefined;

    const initThree = async () => {
      const three = await import('three');
      const {
        Scene,
        PerspectiveCamera,
        WebGLRenderer,
        QuadraticBezierCurve3,
        Vector3,
        TubeGeometry,
        ShaderMaterial,
        Mesh,
        AdditiveBlending,
        DoubleSide,
      } = three;

      const scene = new Scene();
      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x0f172a, 1);
      mountRef.current!.appendChild(renderer.domElement);

      const curve = new QuadraticBezierCurve3(
        new Vector3(-15, -4, 0),
        new Vector3(2, 3, 0),
        new Vector3(18, 0.8, 0)
      );

      const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false);
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const fragmentShader = `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec3 color1 = vec3(0.145, 0.39, 0.92);
          vec3 color2 = vec3(0.25, 0.55, 0.95);
          vec3 color3 = vec3(0.04, 0.65, 0.92);
          vec3 finalColor = mix(color1, color2, vUv.x);
          finalColor = mix(finalColor, color3, vUv.x * 0.6);
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 2.0);
          float fade = 1.0;
          if (vUv.x > 0.85) fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.75);
        }
      `;

      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { time: { value: 0 } },
        transparent: true,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      const lightStreak = new Mesh(tubeGeometry, material);
      scene.add(lightStreak);

      const glowGeometry = new TubeGeometry(curve, 200, 1.5, 32, false);
      const glowMaterial = new ShaderMaterial({
        vertexShader,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          void main() {
            vec3 color1 = vec3(0.2, 0.45, 0.92);
            vec3 color2 = vec3(0.04, 0.65, 0.92);
            vec3 finalColor = mix(color1, color2, vUv.x);
            float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
            glow = pow(glow, 4.0);
            float fade = 1.0;
            if (vUv.x > 0.85) fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
            float pulse = sin(time * 1.5) * 0.05 + 0.95;
            gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * 0.25);
          }
        `,
        uniforms: { time: { value: 0 } },
        transparent: true,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      const glowLayer = new Mesh(glowGeometry, glowMaterial);
      scene.add(glowLayer);

      camera.position.z = 7;
      camera.position.y = -0.8;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        material.uniforms.time.value = time;
        glowMaterial.uniforms.time.value = time;
        lightStreak.rotation.z = Math.sin(time * 0.2) * 0.05;
        glowLayer.rotation.z = Math.sin(time * 0.2) * 0.05;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId !== undefined) cancelAnimationFrame(animationId);
        if (mountRef.current?.contains(renderer.domElement)) mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        tubeGeometry.dispose();
        glowGeometry.dispose();
        material.dispose();
        glowMaterial.dispose();
      };
    };

    initThree().then((cleanup) => {
      if (cancelledRef.current) {
        cleanup();
        return;
      }
      cleanupRef.current = cleanup;
    });

    return () => {
      cancelledRef.current = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden w-full bg-[#0f172a]">
      <div ref={mountRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 flex justify-center">
          <img
            src="/images/Odontoa-New-logo-pack-2026/horiyotal_light.png"
            alt="Odontoa Logo"
            className="h-10 sm:h-12 w-auto"
          />
        </div>
        <div className="relative w-full max-w-[420px]">
          <div
            className={cn(
              'relative overflow-hidden rounded-3xl p-8 shadow-2xl',
              'backdrop-blur-xl border border-white/20',
              'bg-slate-900/80'
            )}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 pointer-events-none" />

            <div className="relative z-10 text-center">
              <h1 className="font-manrope text-5xl sm:text-6xl font-light text-white mb-4 tracking-wide">
                Odontoa je online.
              </h1>
              <p className="text-white/80 text-base leading-relaxed mb-6">
                Platforma za upravljanje stomatološkom ordinacijom.
              </p>

              <ul className="space-y-2 text-left max-w-sm mx-auto text-white/75 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5" aria-hidden>•</span>
                  <span>Termini, kartoni i tim na jednom mestu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5" aria-hidden>•</span>
                  <span>Uvid u rad i rezultate ordinacije</span>
                </li>
              </ul>

              <p className="text-sm text-white/60 mb-8">
                Sajt je u izradi. Za demo i informacije:{' '}
                <a
                  href="mailto:info@odontoa.info"
                  className="text-white/90 underline underline-offset-2 hover:text-white"
                >
                  info@odontoa.info
                </a>
              </p>

              <Button asChild variant="pillPrimary" size="pill" className="opacity-100 font-semibold">
                <a href="mailto:info@odontoa.info">
                  <span className="text-nowrap">Zakaži demo</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-xl scale-110 -z-10" />
        </div>
      </div>
    </main>
  );
}
