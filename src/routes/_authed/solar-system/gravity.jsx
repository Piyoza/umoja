import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SolarNav from "@/components/solar/SolarNav";
import { PLANETS, getPlanet } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/gravity")({
  validateSearch: (search) => ({ planet: typeof search.planet === "string" ? search.planet : undefined }),
  component: GravityPage,
  head: () => ({ meta: [{ title: "Gravity Laboratory · Junior Astronaut Mission Trainer" }] }),
});

const EARTH_GRAVITY = 9.81;

function GravityPage() {
  const search = Route.useSearch();
  const [planeId, setPlanetId] = useState(getPlanet(search.planet) ? search.planet : "mars");
  const [mass, setMass] = useState("60");
  const [logged, setLogged] = useState(false);
  const planet = getPlanet(planeId);
  const massValue = Math.max(1, Math.min(300, Number(mass) || 0));
  const weight = massValue * planet.facts.gravity;
  const earthWeight = massValue * EARTH_GRAVITY;

  const rows = useMemo(
    () =>
      PLANETS.map((entry) => ({
        ...entry,
        weight: massValue * entry.facts.gravity,
        ratio: entry.facts.gravity / EARTH_GRAVITY,
      })),
    [massValue],
  );

  async function logExperiment() {
    await recordExploration({
      itemType: "activity",
      itemId: `gravity-${planet.id}`,
      itemName: `Gravity experiment on ${planet.name}`,
      kind: "experiment",
      score: 100,
      detail: `${massValue} kg has a weight of ${weight.toFixed(1)} N on ${planet.name}`,
    }).catch(() => {});
    setLogged(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Gravity laboratory</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">How gravity changes your weight</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Your mass stays the same wherever you travel. Your weight is the force gravity exerts on that mass:
          weight = mass × gravitational acceleration.
        </p>
      </div>

      <SolarNav />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="panel p-5">
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Your mass (kg)</Label>
              <Input
                type="number"
                min={1}
                max={300}
                value={mass}
                onChange={(event) => {
                  setMass(event.target.value);
                  setLogged(false);
                }}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Planet</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PLANETS.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setPlanetId(entry.id);
                      setLogged(false);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                      planeId === entry.id
                        ? "border-primary/60 bg-primary/15 text-foreground"
                        : "border-border/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              <Calculator className="h-3.5 w-3.5" /> Result on {planet.name}
            </p>
            <p className="mt-2 font-heading text-3xl font-bold">
              {weight.toFixed(1)} <span className="text-base font-medium text-muted-foreground">N</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Gravity {planet.facts.gravity} m/s² · {(planet.facts.gravity / EARTH_GRAVITY).toFixed(2)}× Earth ·
              equivalent Earth weight {earthWeight.toFixed(0)} N
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              On {planet.name} the same {massValue} kg body would feel{" "}
              <span className="text-foreground">{(weight / earthWeight * 100).toFixed(0)}%</span> of its Earth
              weight. Mass is unchanged everywhere.
            </p>
            <Button size="sm" className="mt-3" onClick={logExperiment} disabled={logged}>
              {logged ? "Experiment logged" : "Log this experiment"}
            </Button>
          </div>

          <div className="mt-4 rounded-xl border border-border/70 bg-background/40 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Rocket className="h-3.5 w-3.5 text-primary" /> Mass vs weight
            </p>
            <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <li>• Mass measures how much matter you contain, measured in kilograms. It does not change with location.</li>
              <li>• Weight is a force, measured in newtons: mass × gravitational acceleration.</li>
              <li>• In orbit you are in continuous free fall, so you feel weightless even though gravity is still acting.</li>
              <li>• Lower gravity also changes movement: jumps go higher, and walking becomes bouncy on the Moon.</li>
            </ul>
          </div>
        </div>

        <div className="panel p-5">
          <p className="text-sm font-semibold">Your weight across the solar system</p>
          <div className="mt-3 space-y-2">
            {rows.map((entry) => {
              const percent = Math.min(100, (entry.weight / (massValue * 24.79)) * 100);
              return (
                <div key={entry.id} className="rounded-lg border border-border/60 bg-background/40 p-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {entry.weight.toFixed(0)} N · {entry.ratio.toFixed(2)}×
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: entry.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            Surface gravity values from NASA planetary fact sheets. Values are for a body of {massValue} kg.
          </p>
        </div>
      </div>
    </div>
  );
}