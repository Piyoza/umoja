import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, Siren, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCENARIOS } from "@/lib/simulation/scenarios";
import { DIFFICULTIES } from "@/lib/simulation/engine";
import { loadTraineeStats } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/simulator/")({
  component: SimulatorHome,
  head: () => ({ meta: [{ title: "Space Emergency Simulator · Junior Astronaut Mission Trainer" }] }),
});

function SimulatorHome() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("beginner");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadTraineeStats().then(setStats).catch(() => setStats({ attemptsList: [] }));
  }, []);

  const bestFor = (scenarioId) => {
    const scores = (stats?.attemptsList || [])
      .filter((attempt) => attempt.scenario_id === scenarioId)
      .map((attempt) => attempt.score || 0);
    return scores.length ? Math.max(...scores) : null;
  };

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Siren className="h-3 w-3" /> Real-time emergency training
          </span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Space Emergency Simulator</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Take the flight engineer's seat aboard ASTRA-1. Each simulation runs in real time: telemetry
            changes while you decide, delays make the emergency worse, and every choice branches the
            storyline. ASTRA debriefs your decision timeline at the end.
          </p>
          <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            Educational simulations using illustrative values. These are not official NASA flight procedures
            or real spacecraft emergency instructions.
          </p>
        </div>
      </div>

      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Select difficulty</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{DIFFICULTIES[difficulty].description}</p>
          </div>
          <div className="flex gap-1 rounded-full border border-border/70 bg-background/50 p-1">
            {Object.values(DIFFICULTIES).map((level) => (
              <button
                key={level.key}
                onClick={() => setDifficulty(level.key)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  difficulty === level.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SCENARIOS.map((scenario) => {
          const best = bestFor(scenario.id);
          return (
            <article
              key={scenario.id}
              className="flex flex-col rounded-2xl border border-border/80 bg-card/70 p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {scenario.code}
                </span>
                {best !== null && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Best {best}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug">{scenario.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-primary">
                <ShieldAlert className="h-3 w-3" /> {scenario.system}
              </p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{scenario.tagline}</p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Timer className="h-3 w-3" /> {Math.round(scenario.duration / 60)} min
                </span>
                <span>{scenario.principles.length} science concepts</span>
              </div>
              <Button
                className="mt-4 w-full justify-between"
                onClick={() =>
                  navigate({ to: "/simulator/$scenarioId", params: { scenarioId: scenario.id }, search: { difficulty } })
                }
              >
                Launch simulation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </article>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Looking for structured learning first?{" "}
        <Link to="/academy" className="text-primary hover:underline">
          Open the Learning Academy
        </Link>
        .
      </p>
    </div>
  );
}