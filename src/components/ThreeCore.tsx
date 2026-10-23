import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface ThreeCoreProps {
  className?: string;
  onInteracted?: () => void;
}

export const ThreeCore: React.FC<ThreeCoreProps> = ({ className = '', onInteracted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [coreMode, setCoreMode] = useState<'nominal' | 'overdrive' | 'quantum'>('nominal');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);

  // Mutable refs to pass UI state into animation tick without re-mounting Three.js
  const modeRef = useRef(coreMode);
  modeRef.current = coreMode;
  const speedRef = useRef(rotationSpeed);
  speedRef.current = rotationSpeed;
  const wireframeRef = useRef(isWireframe);
  wireframeRef.current = isWireframe;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to balance performance
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.035);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig: 3-point studio lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const crimsonRimLight = new THREE.PointLight(0xe11d48, 8, 20);
    crimsonRimLight.position.set(-6, -3, 4);
    scene.add(crimsonRimLight);

    const cyanAccentLight = new THREE.PointLight(0x38bdf8, 3, 20);
    cyanAccentLight.position.set(6, -4, -4);
    scene.add(cyanAccentLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x090d16, 0.6);
    scene.add(hemiLight);

    // Assembly: 3-12 Part Composite Procedural JARVIS AI Core
    const coreGroup = new THREE.Group();

    // 1. Titanium Gimbal Outer Ring
    const outerRingGeo = new THREE.TorusGeometry(3.2, 0.07, 16, 100);
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.18,
      wireframe: false
    });
    const outerRing = new THREE.Mesh(outerRingGeo, titaniumMat);
    coreGroup.add(outerRing);

    // 2. Intermediate Counter-Rotating Gimbal Ring (Ruby Trim)
    const midRingGeo = new THREE.TorusGeometry(2.6, 0.05, 16, 80);
    const crimsonMetalMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4
    });
    const midRing = new THREE.Mesh(midRingGeo, crimsonMetalMat);
    coreGroup.add(midRing);

    // 3. Equatorial Notched Tech Ring
    const innerRingGeo = new THREE.TorusGeometry(2.0, 0.035, 12, 60);
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.1
    });
    const innerRing = new THREE.Mesh(innerRingGeo, silverMat);
    coreGroup.add(innerRing);

    // 4. Central Faceted Ruby Energy Reactor
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x881337,
      emissive: 0xe11d48,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const centralReactor = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(centralReactor);

    // 5. Inner Luminous Singularity Core
    const singularityGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const singularityMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const singularity = new THREE.Mesh(singularityGeo, singularityMat);
    coreGroup.add(singularity);

    // 6. Orbital Satellite Sensor Nodes (8 instances)
    const satelliteGroup = new THREE.Group();
    const satGeo = new THREE.BoxGeometry(0.12, 0.12, 0.25);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6
    });

    const satCount = 8;
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.6;
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      sat.lookAt(0, 0, 0);
      satelliteGroup.add(sat);
    }
    coreGroup.add(satelliteGroup);

    // 7. Floating Quantum Particle Swarm
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfb7185,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 8. Contact shadow plane grounding underneath
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.4;
    scene.add(shadowPlane);

    scene.add(coreGroup);

    // Pointer tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetTiltY = mouseX * 0.45;
      targetTiltX = -mouseY * 0.35;
      if (onInteracted) onInteracted();
    };

    window.addEventListener('mousemove', onPointerMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const speed = speedRef.current;
      const mode = modeRef.current;
      const wire = wireframeRef.current;

      // Mode adjustments
      const speedMultiplier = mode === 'overdrive' ? 2.2 : mode === 'quantum' ? 0.6 : 1.0;
      const currentSpeed = speed * speedMultiplier;

      // Rotate Gimbal Rings in counter-directions
      outerRing.rotation.x += delta * 0.35 * currentSpeed;
      outerRing.rotation.y += delta * 0.25 * currentSpeed;

      midRing.rotation.y -= delta * 0.45 * currentSpeed;
      midRing.rotation.z += delta * 0.3 * currentSpeed;

      innerRing.rotation.x += delta * 0.55 * currentSpeed;
      innerRing.rotation.z -= delta * 0.4 * currentSpeed;

      // Central Reactor Breathing Pulse
      const pulseRate = mode === 'overdrive' ? 6 : 2.5;
      const pulseScale = 1 + Math.sin(elapsed * pulseRate) * 0.06;
      centralReactor.scale.set(pulseScale, pulseScale, pulseScale);
      centralReactor.rotation.y += delta * 0.2 * currentSpeed;
      centralReactor.rotation.x += delta * 0.15 * currentSpeed;

      // Wireframe toggle update
      titaniumMat.wireframe = wire;
      crimsonMetalMat.wireframe = wire;
      coreMat.wireframe = wire;

      // Emissive surge
      const emissiveSurge = 0.8 + Math.sin(elapsed * pulseRate) * 0.4;
      coreMat.emissiveIntensity = emissiveSurge * (mode === 'overdrive' ? 1.6 : 1.0);

      // Orbital Satellites
      satelliteGroup.rotation.y += delta * 0.6 * currentSpeed;

      // Particle Drift
      particles.rotation.y += delta * 0.1 * currentSpeed;
      particles.rotation.x -= delta * 0.05 * currentSpeed;

      // Smooth pointer damping
      coreGroup.rotation.x = THREE.MathUtils.damp(coreGroup.rotation.x, targetTiltX, 4, delta);
      coreGroup.rotation.y = THREE.MathUtils.damp(coreGroup.rotation.y, targetTiltY, 4, delta);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerRingGeo.dispose();
      midRingGeo.dispose();
      innerRingGeo.dispose();
      coreGeo.dispose();
      singularityGeo.dispose();
      satGeo.dispose();
      particleGeo.dispose();
      shadowGeo.dispose();
      titaniumMat.dispose();
      crimsonMetalMat.dispose();
      silverMat.dispose();
      coreMat.dispose();
      singularityMat.dispose();
      satMat.dispose();
      particleMat.dispose();
      shadowMat.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-[520px] md:h-[620px] select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Holographic Ambient HUD Badges */}
      <div className="absolute top-4 left-6 pointer-events-none hidden sm:flex flex-col gap-1">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-mono-code flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>JARVIS 3.1 CORE ENGAGED</span>
        </div>
        <div className="text-slate-500 text-xs font-mono-code">
          ENGINEERED BY ABHINAV ANAND
        </div>
      </div>

      <div className="absolute top-4 right-6 pointer-events-none hidden sm:flex flex-col items-end gap-1">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-mono-code">
          FREQUENCY: 432.8 THZ
        </div>
        <div className="text-slate-500 text-xs font-mono-code">
          SYS STATUS: READY
        </div>
      </div>

      {/* Sleek Collapsible Bottom Dock (Zero Viewport Occlusion as required by Three.js directives) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[560px] px-4 pointer-events-auto">
        <div className="flex flex-col items-center">
          {/* Collapse Toggle */}
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="mb-1 text-[11px] font-mono-code text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3 py-1 rounded-t-md border border-b-0 border-white/10"
          >
            {hudCollapsed ? '▲ Show 3D Core Controls' : '▼ Hide Controls'}
          </button>

          {!hudCollapsed && (
            <div className="w-full p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Reactor Mode Selector */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono-code mr-1">Core Mode:</span>
                {(['nominal', 'overdrive', 'quantum'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCoreMode(mode)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium uppercase tracking-wider transition-all ${
                      coreMode === mode
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Wireframe & Speed Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono-code">Speed:</span>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-slate-800 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-2 py-1 rounded text-[11px] border font-mono-code transition-all ${
                    isWireframe
                      ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Wireframe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
