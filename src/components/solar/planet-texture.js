import * as THREE from "three";

// Procedural planet texture: base colour with low-frequency patches plus
// bands for the gas giants. Keeps the 3D scene dependency-free of image files.
export function buildPlanetTexture(planet, width = 512, height = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const base = new THREE.Color(planet.color || "#888888");
  const accent = new THREE.Color(planet.color2 || planet.color || "#666666");
  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, width, height);

  if (planet.bands) {
    for (let i = 0; i < 26; i += 1) {
      const y = (i / 26) * height;
      const h = height / 26 + 2;
      const mix = base.clone().lerp(accent, (i % 2 === 0 ? 0.35 : 0.12) + Math.random() * 0.25);
      ctx.fillStyle = `#${mix.getHexString()}`;
      ctx.fillRect(0, y, width, h);
    }
  }

  for (let i = 0; i < 140; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 6 + Math.random() * (planet.bands ? 22 : 42);
    const mix = base.clone().lerp(accent, Math.random() * 0.6);
    ctx.beginPath();
    ctx.fillStyle = `#${mix.getHexString()}`;
    ctx.globalAlpha = 0.16 + Math.random() * 0.24;
    ctx.ellipse(x, y, r, r * (planet.bands ? 0.35 : 0.9), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Polar caps for the rocky worlds.
  if (["earth", "mars"].includes(planet.id)) {
    const cap = ctx.createLinearGradient(0, 0, 0, height * 0.16);
    cap.addColorStop(0, "rgba(255,255,255,0.85)");
    cap.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cap;
    ctx.fillRect(0, 0, width, height * 0.16);
    const cap2 = ctx.createLinearGradient(0, height, 0, height * 0.86);
    cap2.addColorStop(0, "rgba(255,255,255,0.85)");
    cap2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cap2;
    ctx.fillRect(0, height * 0.86, width, height * 0.14);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}