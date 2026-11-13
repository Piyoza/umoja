import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Gamepad2, Orbit, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import MissionGrid from "@/components/dashboard/MissionGrid";
import { loadTraineeStats } from "@/lib/progress";
import { SCENARIOS } from "@/lib/simulation/scenarios";

export const Route = createFileRoute("/_authed/simulation")({
  component: SimulationHub,
  head: () => ({ meta: [{ title: "Gaming & Simulation · Junior Astronaut Mission Trainer" }] }),
});

function SimulationHub() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadTraineeStats().then(setStats).catch(() => setStats(null));
  }, []);

  const attempts = stats?.attemptsList?.slice(0, 5) || [];

  return (
    <div className="space-y-7">
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />
        <div className="relative">
          <p className="eyebrow">Gaming &amp; simulation</p>
          <h1 className="mt-1 text-3xl font-bold">Play the mission, learn the science</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every simulation runs real system logic: telemetry changes while you decide, wrong choices make the
            emergency worse and delays add complications. Pick a mission brief and fly it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/simulator">
                <Siren className="mr-2 h-4 w-4" /> Emergency simulator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/solar-system">
                <Orbit className="mr-2 h-4 w-4" /> 3D solar system
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <MissionGrid />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Emergency scenario library</h2>
          </div>
          <Link to="/simulator" className="text-xs text-muted-foreground hover:text-foreground">
            Open simulator
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((scenario) => (
            <Link
              key={scenario.id}
              to="/simulator/$scenarioId"
              params={{ scenarioId: scenario.id }}
              search={{ difficulty: "beginner" }}
              className="rounded-xl border border-border/70 bg-card/70 p-3 transition-colors hover:border-primary/50"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {scenario.code}
              </p>
              <p className="mt-1 text-[13px] font-medium leading-snug text-foreground">{scenario.title}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-primary">{scenario.system}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent simulations</h2>
            <Link to="/progress" className="text-[11px] text-muted-foreground hover:text-foreground">
              All results
            </Link>
          </div>
          {attempts.length === 0 ? (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              No simulations recorded yet. Your first run will appear here with its score and outcome.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {attempts.map((attempt) => (
                <li
                  key={attempt.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-foreground">{attempt.scenario_title}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {attempt.difficulty} · {attempt.status}
                    </p>
                  </div>
                  <span className="font-heading text-lg font-semibold">{attempt.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel flex flex-col justify-between p-5">
          <div>
            <h2 className="text-sm font-semibold">Learn before you fly</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The Learning Academy explains the systems behind every emergency — life support, power,
              communications, navigation and orbital mechanics — so the decisions in a simulation make sense
              rather than being guesses.
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-4 w-fit">
            <Link to="/academy">
              <BookOpen className="mr-1.5 h-4 w-4" /> Open the Academy
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}