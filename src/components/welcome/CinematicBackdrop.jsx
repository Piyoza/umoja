import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

/**
 * Full-viewport cinematic backdrop: real NASA photography crossfading behind the
 * welcome page. Fixed, so it sits behind every section; pointer-events are
 * disabled so nothing above it stops being clickable. Holds one still frame and
 * skips the drift animation when the visitor prefers reduced motion.
 */
const SLIDES = [
  {
    src: "https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~large.jpg",
    alt: "Apollo 11 astronaut on the lunar surface beside the deployed flag",
  },
  {
    src: "https://images-assets.nasa.gov/image/iss058e005282/iss058e005282~large.jpg",
    alt: "Earth's limb with an aurora seen from the International Space Station",
  },
  {
    src: "https://images-assets.nasa.gov/image/PIA20840/PIA20840~large.jpg",
    alt: "Curiosity rover panorama of the Murray Buttes on Mars",
  },
  {
    src: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001386/GSFC_20171208_Archive_e001386~large.jpg",
    alt: "Blue Marble view of Earth photographed from space",
  },
  {
    src: "https://images-assets.nasa.gov/image/iss074e0319988/iss074e0319988~large.jpg",
    alt: "Star trails and city lights streaking past the International Space Station",
  },
  {
    src: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~large.jpg",
    alt: "The Lagoon Nebula photographed by the Hubble Space Telescope",
  },
];

const HOLD_MS = 8000;

export default function CinematicBackdrop() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), HOLD_MS);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070d]"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity ease-in-out",
            reducedMotion ? "[transition-duration:0ms]" : "[transition-duration:2000ms]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fittingType="fill"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={cn("h-full w-full object-cover", i === index && !reducedMotion && "backdrop-drift")}
          />
        </div>
      ))}

      {/* Contrast overlay: keeps the existing text readable over every photo. */}
      <div className="absolute inset-0 bg-[#05070d]/45" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,transparent_38%,rgba(5,7,13,0.5)_100%)]" />
    </div>
  );
}