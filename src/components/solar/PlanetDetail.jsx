import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Globe2, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanetViewer from "@/components/solar/PlanetViewer";
import { MOONS } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";

const fmt = (value, digits = 0) =>
  Number(value).toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });

export default function PlanetDetail({ planet }) {
  const recorded = useRef(null);

  useEffect(() => {
    if (!planet || recorded.current === planet.id) return;
    recorded.current = planet.id;
    recordExploration({
      itemType: "planet",
      itemId: planet.id,
      itemName: planet.name,
      kind: "explored",
      detail: `Explored ${planet.name} in the 3D solar system`,
    }).catch(() => {});
  }, [planet]);

  const stats = [
    { label: "Diameter", value: `${fmt(planet.facts.diameterKm)} km` },
    { label: "Surface gravity", value: `${fmt(planet.facts.gravity, 2)} m/s²` },
    { label: "Average temperature", value: `${fmt(planet.facts.tempC)} °C` },
    { label: "Distance from Sun", value: `${fmt(planet.facts.distanceAU, 2)} AU` },
    { label: "Distance", value: `${fmt(planet.facts.distanceKm / 1000000, 1)} million km` },
    { label: "Rotation period", value: `${fmt(Math.abs(planet.facts.rotationHours), 1)} h` },
    { label: "Orbital period", value: `${fmt(planet.facts.orbitalDays)} days` },
    { label: "Known moons", value: fmt(planet.facts.moons) },
  ];

  const moons = MOONS.filter((moon) => moon.parent === planet.name);

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-border/60 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{planet.type}</p>
            <h2 className="mt-1 text-2xl font-semibold">{planet.name}</h2>
          </div>
          <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {planet.facts.distanceAU} AU
          </span>
        </div>
        <div className="mt-4">
          <PlanetViewer planet={planet} height={200} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border/60 bg-background/40 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{stat.label}</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 px-5 pb-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Globe2 className="h-3.5 w-3.5 text-primary" /> Atmospheric composition
          </p>
          <div className="mt-2 space-y-1.5">
            {planet.facts.atmosphere.map((entry) => (
              <div key={entry.gas}>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{entry.gas}</span>
                  <span>{entry.pct}%</span>
                </div>
                <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-cyan-400/70" style={{ width: `${Math.min(100, entry.pct)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Telescope className="h-3.5 w-3.5 text-primary" /> Scientific discoveries
          </p>
          <ul className="mt-2 space-y-1.5">
            {planet.discoveries.map((item, index) => (
              <li key={index} className="text-[11px] leading-relaxed text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground">Major features</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {planet.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-border/70 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {moons.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-foreground">Notable moons</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {moons.map((moon) => (
                <Link
                  key={moon.id}
                  to="/solar-system/objects"
                  className="rounded-full border border-border/70 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {moon.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="secondary">
            <Link
              to="/solar-system/compare"
              search={{ planets: planet.id === "earth" ? "earth,mars" : `${planet.id},earth` }}
            >
              Compare <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/solar-system/gravity" search={{ planet: planet.id }}>
              <Compass className="mr-1.5 h-3.5 w-3.5" /> Gravity lab
            </Link>
          </Button>
        </div>

        <p className="text-[10px] leading-relaxed text-muted-foreground">Source: {planet.source}</p>
      </div>
    </div>
  );
}