import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildPlanetTexture } from "@/components/solar/planet-texture";

export default function PlanetViewer({ planet, height = 220 }) {
  const mountRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setError(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 6.4);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xfff3df, 2.1);
    key.position.set(5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 0.9);
    rim.position.set(-6, -2, -4);
    scene.add(rim);

    const radius = 2.1;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 48),
      new THREE.MeshStandardMaterial({
        map: buildPlanetTexture(planet),
        roughness: 0.82,
        metalness: 0.03,
      }),
    );
    scene.add(sphere);

    if (planet.ring) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * planet.ring.inner, radius * planet.ring.outer, 96),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(planet.ring.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: planet.ring.opacity,
        }),
      );
      ring.rotation.x = Math.PI / 2.4;
      scene.add(ring);
    } else if (planet.id === "uranus") {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.35, radius * 1.5, 96),
        new THREE.MeshBasicMaterial({ color: 0x9ad8dd, side: THREE.DoubleSide, transparent: true, opacity: 0.35 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = Math.PI / 2.4;
      scene.add(ring);
    }

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      sphere.rotation.y += 0.0035;
      renderer.render(scene, camera);
    };
    animate();

    const observer = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const size = mount.clientHeight;
      renderer.setSize(width, size);
      camera.aspect = width / size;
      camera.updateProjectionMatrix();
    });
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sphere.geometry.dispose();
      sphere.material.map?.dispose();
      sphere.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [planet]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-[#04070d]"
      style={{ height }}
    >
      <div ref={mountRef} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] text-muted-foreground">
          3D view unavailable in this browser.
        </div>
      )}
    </div>
  );
}