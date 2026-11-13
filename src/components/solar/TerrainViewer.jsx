import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cn } from "@/lib/utils";

const PALETTE = {
  mars: { ground: 0x9e4a2f, ridge: 0xc2683f, sky: 0x1b0f0a },
  moon: { ground: 0x8b8b86, ridge: 0xb4b4ae, sky: 0x07090d },
  asteroid: { ground: 0x6d6559, ridge: 0x8d8577, sky: 0x080a0c },
};

export default function TerrainViewer({ terrain = "mars", features = [], selected, onSelect }) {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  const markersRef = useRef([]);

  selectRef.current = onSelect;
  selectedRef.current = selected;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError("3D terrain is unavailable in this browser.");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const palette = PALETTE[terrain] || PALETTE.mars;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.sky);
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 400);
    camera.position.set(0, 22, 34);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 8;
    controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.set(0, 0, 0);

    const light = new THREE.DirectionalLight(0xfff0dc, 2.2);
    light.position.set(24, 30, 12);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x6f7d94, 0.5));

    const segments = 110;
    const size = 60;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const position = geometry.attributes.position;
    const craters = Array.from({ length: 14 }, () => ({
      x: (Math.random() - 0.5) * size * 0.9,
      z: (Math.random() - 0.5) * size * 0.9,
      r: 2 + Math.random() * 5,
      depth: 1.5 + Math.random() * 3,
    }));

    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getY(i);
      let height =
        Math.sin(x * 0.16) * Math.cos(z * 0.19) * 1.9 +
        Math.sin(x * 0.05 + z * 0.08) * 2.6 +
        Math.cos(z * 0.32) * 0.7;
      for (const crater of craters) {
        const distance = Math.hypot(x - crater.x, z - crater.z);
        if (distance < crater.r) {
          const rim = Math.sin(((distance / crater.r) * Math.PI) / 1) * 1.6;
          height -= crater.depth * (1 - distance / crater.r) - rim;
        }
      }
      if (terrain === "asteroid") height *= 1.8;
      position.setZ(i, height);
    }
    geometry.computeVertexNormals();

    const ground = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: palette.ground, flatShading: true, roughness: 0.95 }),
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const ridge = new THREE.Mesh(
      new THREE.PlaneGeometry(size * 3, size * 3),
      new THREE.MeshStandardMaterial({ color: palette.ridge, roughness: 1, transparent: true, opacity: 0.18 }),
    );
    ridge.rotation.x = -Math.PI / 2;
    ridge.position.y = -6;
    scene.add(ridge);

    const markerMeshes = features.slice(0, 6).map((feature, index) => {
      const angle = (index / Math.max(features.length, 1)) * Math.PI * 2;
      const radius = 9 + (index % 3) * 4;
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 20, 16),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.7 }),
      );
      marker.position.set(Math.cos(angle) * radius, 4, Math.sin(angle) * radius);
      marker.userData.featureId = feature.id;
      scene.add(marker);
      return marker;
    });
    markersRef.current = markerMeshes;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(markerMeshes, false);
      if (hits.length) selectRef.current?.(hits[0].object.userData.featureId);
    };
    renderer.domElement.addEventListener("pointerdown", handleClick);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      markerMeshes.forEach((marker) => {
        marker.material.color.set(marker.userData.featureId === selectedRef.current ? 0xf59e0b : 0x3b82f6);
        marker.material.emissive.set(marker.userData.featureId === selectedRef.current ? 0xf59e0b : 0x3b82f6);
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const observer = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handleClick);
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [terrain, features]);

  return (
    <div className={cn("relative h-[360px] w-full overflow-hidden rounded-2xl border border-border/70 sm:h-[440px]")}>
      <div ref={mountRef} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-muted-foreground">
          {error}
        </div>
      )}
      <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] text-white/70">
        Scientific terrain visualisation · not a real elevation dataset · drag to orbit, scroll to zoom
      </p>
    </div>
  );
}