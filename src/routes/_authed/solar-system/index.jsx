import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Orbit, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SolarNav from "@/components/solar/SolarNav";
import SolarSystemScene from "@/components/solar/SolarSystemScene";
import PlanetDetail from "@/components/solar/PlanetDetail";
import SolarQuiz from "@/components/solar/SolarQuiz";
import { PLANETS, getPlanet } from "@/lib/solar-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/")({
  component: SolarSystemPage,
  head: () => ({ meta: [{ title: "3D Solar System Explorer · Junior Astronaut Mission Trainer" }] }),
});

const SPEEDS = [
  { value: 0.4, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 2.6, label: "3×" },
];

function SolarSystemPage() {
  const [selectedId, setSelectedId] = useState("earth");
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const planet = getPlanet(selectedId);

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Module 02 · 3D exploration</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">3D Solar System Explorer</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Rotate the system, zoom in on a world and follow its orbit. Select any planet to open its
          scientific profile. Planet sizes and orbits are compressed for visibility.
        </p>
      </div>

      <SolarNav />

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          <SolarSystemScene
            selectedId={selectedId}
            onSelect={setSelectedId}
            showOrbits={showOrbits}
            speed={speed}
            paused={paused}
          />

          <div className="panel flex flex-wrap items-center gap-4 p-4">
            <Button size="sm" variant="secondary" onClick={() => setPaused((value) => !value)}>
              {paused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
              {paused ? "Orbit motion off" : "Orbit motion on"}
            </Button>
            <div className="flex gap-1 rounded-full border border-border/70 bg-background/40 p-1">
              {SPEEDS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSpeed(option.value)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] transition-colors",
                    speed === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Switch checked={showOrbits} onCheckedChange={setShowOrbits} /> Show orbits
            </label>
          </div>

          <div className="panel p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Orbit className="h-3.5 w-3.5 text-primary" /> Select a planet
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PLANETS.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    selectedId === entry.id
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

        <div className="space-y-4">
          {planet && <PlanetDetail planet={planet} />}
          <SolarQuiz />
          <p className="rounded-xl border border-border/60 bg-card/50 p-3 text-[10px] leading-relaxed text-muted-foreground">
            Planetary figures come from NASA Solar System Exploration fact sheets and NASA mission pages. Planet
            sizes, orbits and textures in the 3D scene are compressed for visibility and are not to scale.
          </p>
        </div>
      </div>
    </div>
  );
}