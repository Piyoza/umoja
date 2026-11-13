import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sparkles } from "lucide-react";
import SolarNav from "@/components/solar/SolarNav";
import { MOONS, SMALL_BODIES, getSmallBody } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/objects")({
  component: ObjectsPage,
  head: () => ({ meta: [{ title: "Moons, Asteroids & Comets · Junior Astronaut Mission Trainer" }] }),
});

const typeFor = (body) => (MOONS.some((moon) => moon.id === body.id) ? "moon" : body.kind === "Comet" ? "comet" : "asteroid");

function ObjectsPage() {
  const [selectedId, setSelectedId] = useState("europa");
  const body = getSmallBody(selectedId);

  useEffect(() => {
    if (!body) return;
    recordExploration({
      itemType: typeFor(body),
      itemId: body.id,
      itemName: body.name,
      kind: "explored",
      detail: `Explored ${body.name}${body.parent ? ` (moon of ${body.parent})` : ""}`,
    }).catch(() => {});
  }, [body]);

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Small bodies & moons</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Moons, asteroids and comets</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          The solar system's most interesting destinations are often not planets. Select an object to see its
          scientific profile.
        </p>
      </div>

      <SolarNav />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div className="panel p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Moon className="h-3.5 w-3.5 text-primary" /> Moons
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MOONS.map((moon) => (
                <button
                  key={moon.id}
                  onClick={() => setSelectedId(moon.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors",
                    selectedId === moon.id ? "border-primary/60 bg-primary/10" : "border-border/70 hover:border-primary/40",
                  )}
                >
                  <span
                    className="h-7 w-7 shrink-0 rounded-full border border-white/10"
                    style={{ backgroundColor: moon.color }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-foreground">{moon.name}</span>
                    <span className="block text-[10px] text-muted-foreground">Moon of {moon.parent}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Asteroids and comets
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SMALL_BODIES.map((small) => (
                <button
                  key={small.id}
                  onClick={() => setSelectedId(small.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-colors",
                    selectedId === small.id ? "border-primary/60 bg-primary/10" : "border-border/70 hover:border-primary/40",
                  )}
                >
                  <span
                    className="h-7 w-7 shrink-0 rounded-full border border-white/10"
                    style={{ backgroundColor: small.color }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-foreground">{small.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{small.kind}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {body && (
          <div className="panel h-fit p-5">
            <p className="eyebrow">{body.parent ? `Moon of ${body.parent}` : body.kind}</p>
            <h2 className="mt-1 text-xl font-semibold">{body.name}</h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {body.radiusKm !== undefined && (
                <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Mean radius</p>
                  <p className="text-[13px] text-foreground">{body.radiusKm.toLocaleString("en-US")} km</p>
                </div>
              )}
              {body.diameterKm !== undefined && (
                <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Diameter</p>
                  <p className="text-[13px] text-foreground">{body.diameterKm.toLocaleString("en-US")} km</p>
                </div>
              )}
              <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Surface gravity</p>
                <p className="text-[13px] text-foreground">{body.gravity} m/s²</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Temperature</p>
                <p className="text-[13px] text-foreground">{body.tempC} °C</p>
              </div>
              {body.orbitalDays !== undefined && (
                <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Orbital period</p>
                  <p className="text-[13px] text-foreground">{body.orbitalDays} days</p>
                </div>
              )}
              {body.distanceKm !== undefined && (
                <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Distance from parent</p>
                  <p className="text-[13px] text-foreground">{body.distanceKm.toLocaleString("en-US")} km</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold">Scientific highlights</p>
              <ul className="mt-2 space-y-1.5">
                {(body.facts || []).map((fact, index) => (
                  <li key={index} className="text-[11px] leading-relaxed text-muted-foreground">
                    • {fact}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-[10px] text-muted-foreground">
              Source: NASA Solar System Exploration and NASA mission pages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}