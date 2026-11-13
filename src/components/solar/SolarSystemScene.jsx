import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PLANETS, SUN } from "@/lib/solar-data";
import { buildPlanetTexture } from "@/components/solar/planet-texture";

const labelSprite = (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 26px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 42);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(2.6, 0.65, 1);
  return sprite;
};

export default function SolarSystemScene({
  selectedId,
  onSelect,
  showOrbits = true,
  speed = 1,
  paused = false,
  onReady,
}) {
  const mountRef = useRef(null);
  const optionsRef = useRef({ speed, paused, selectedId });
  const selectRef = useRef(onSelect);
  const orbitsRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  optionsRef.current = { speed, paused, selectedId };
  selectRef.current = onSelect;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError("3D graphics are unavailable in this browser. Planet data is still available below.");
      setLoading(false);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 400);
    camera.position.set(0, 16, 40);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6;
    controls.maxDistance = 110;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sunLight = new THREE.PointLight(0xfff2d0, 2.4, 0, 0.35);
    scene.add(sunLight);

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(SUN.size, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffb347 }),
    );
    scene.add(sun);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gtx = glowCanvas.getContext("2d");
    const grad = gtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,196,110,0.95)");
    grad.addColorStop(0.35, "rgba(255,150,60,0.35)");
    grad.addColorStop(1, "rgba(255,140,50,0)");
    gtx.fillStyle = grad;
    gtx.fillRect(0, 0, 256, 256);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false }),
    );
    glow.scale.set(SUN.size * 7, SUN.size * 7, 1);
    scene.add(glow);
    const sunLabel = labelSprite("Sun");
    sunLabel.position.set(0, SUN.size + 1.1, 0);
    scene.add(sunLabel);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1800 * 3);
    for (let i = 0; i < starPositions.length; i += 3) {
      const radius = 90 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.cos(phi);
      starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.65, sizeAttenuation: true })));

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    orbitsRef.current = orbitGroup;

    const bodies = PLANETS.map((planet) => {
      const geometry = new THREE.SphereGeometry(planet.size, 40, 28);
      const material = new THREE.MeshStandardMaterial({
        map: buildPlanetTexture(planet),
        roughness: 0.85,
        metalness: 0.02,
        emissive: new THREE.Color(planet.color),
        emissiveIntensity: 0.04,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.planetId = planet.id;
      scene.add(mesh);

      if (planet.ring) {
        const ringGeometry = new THREE.RingGeometry(planet.size * planet.ring.inner, planet.size * planet.ring.outer, 72);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(planet.ring.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: planet.ring.opacity,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.35;
        mesh.add(ring);
      }

      const linePoints = [];
      for (let i = 0; i <= 128; i += 1) {
        const angle = (i / 128) * Math.PI * 2;
        linePoints.push(new THREE.Vector3(Math.cos(angle) * planet.orbitRadius, 0, Math.sin(angle) * planet.orbitRadius));
      }
      const orbitLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePoints),
        new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.22 }),
      );
      orbitGroup.add(orbitLine);

      const label = labelSprite(planet.name);
      scene.add(label);

      return { planet, mesh, label, angle: Math.random() * Math.PI * 2 };
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(bodies.map((body) => body.mesh), false);
      if (hits.length) selectRef.current?.(hits[0].object.userData.planetId);
    };
    const handleMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      renderer.domElement.style.cursor = raycaster.intersectObjects(bodies.map((b) => b.mesh), false).length
        ? "pointer"
        : "grab";
    };
    renderer.domElement.addEventListener("pointerdown", handleClick);
    renderer.domElement.addEventListener("pointermove", handleMove);

    const clock = new THREE.Clock();
    let days = 0;
    let frame = 0;
    let started = false;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const { speed: currentSpeed, paused: isPaused, selectedId: currentSelected } = optionsRef.current;
      if (!isPaused) days += delta * currentSpeed * 3.5;

      for (const body of bodies) {
        const { planet, mesh, label, angle } = body;
        const theta = angle + (days / planet.orbitalPeriodDays) * Math.PI * 2;
        mesh.position.set(Math.cos(theta) * planet.orbitRadius, 0, Math.sin(theta) * planet.orbitRadius);
        mesh.rotation.y += delta * (paused ? 0 : 0.35) * 60 / Math.max(Math.abs(planet.facts.rotationHours), 1);
        label.position.set(mesh.position.x, mesh.position.y + planet.size + 0.85, mesh.position.z);
        mesh.material.emissiveIntensity = planet.id === currentSelected ? 0.32 : 0.04;
      }
      sun.rotation.y += delta * 0.05;
      controls.update();
      renderer.render(scene, camera);
      if (!started) {
        started = true;
        setLoading(false);
        onReady?.();
      }
    };
    animate();

    const resize = () => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handleClick);
      renderer.domElement.removeEventListener("pointermove", handleMove);
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orbitsRef.current) orbitsRef.current.visible = showOrbits;
  }, [showOrbits]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-border/70 bg-[#05080f] sm:h-[520px]">
      <div ref={mountRef} className="h-full w-full" />
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#05080f]/80 text-xs text-muted-foreground">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          Loading 3D solar system…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-muted-foreground">
          {error}
        </div>
      )}
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-white/70">
        Drag to rotate · Scroll to zoom · Click a planet · Sizes not to scale
      </p>
    </div>
  );
}