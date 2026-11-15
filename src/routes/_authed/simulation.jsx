
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Orbit,
  Rocket,
  Siren,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MissionGrid from "@/components/dashboard/MissionGrid";
import { loadTraineeStats } from "@/lib/progress";
import { SCENARIOS } from "@/lib/simulation/scenarios";

export const Route = createFileRoute("/_authed/simulation")({
  component: SimulationHub,
  head: () => ({
    meta: [
      {
        title: "Games & Challenges · Junior Astronaut Mission Trainer",
      },
    ],
  }),
});

function SimulationHub() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadTraineeStats()
      .then((result) => {
        if (active) setStats(result);
      })
      .catch(() => {
        if (active) setStats(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const attempts = stats?.attemptsList?.slice(0, 5) || [];
  const totalAttempts = stats?.attemptsList?.length || 0;
  const completedAttempts =
    stats?.attemptsList?.filter(
      (attempt) => attempt.status === "stabilised"
    ).length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <p className="eyebrow">Your space adventure starts here</p>
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Explore. Experiment. Become an Astronaut.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Discover space through interactive experiences and astronaut
            training challenges. Explore other worlds, investigate the
            science of spaceflight and practise making mission decisions.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/simulator">
                <Siren className="mr-2 h-4 w-4" />
                Start astronaut training
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary">
              <Link to="/solar-system">
                <Orbit className="mr-2 h-4 w-4" />
                Explore the Solar System
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning activity summary */}
      <section
        aria-label="Your learning activity"
        className="grid gap-3 sm:grid-cols-3"
      >
        <div className="panel flex items-center gap-3 p-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Gamepad2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">
              Featured experiences
            </p>
          </div>
        </div>

        <div className="panel flex items-center gap-3 p-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Siren className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{SCENARIOS.length}</p>
            <p className="text-xs text-muted-foreground">
              Emergency scenarios
            </p>
          </div>
        </div>

        <div className="panel flex items-center gap-3 p-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {loading ? "—" : completedAttempts}
            </p>
            <p className="text-xs text-muted-foreground">
              Stabilised missions
            </p>
          </div>
        </div>
      </section>

      {/* Existing three games */}
      <MissionGrid />

      {/* Emergency scenario library */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Think like a mission specialist</p>
            <div className="mt-1 flex items-center gap-2">
              <Siren className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                Emergency Scenario Library
              </h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Test your decision-making skills in spacecraft emergencies.
              Start with beginner difficulty and build your confidence.
            </p>
          </div>

          <Link
            to="/simulator"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View training hub
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((scenario, index) => (
            <Link
              key={scenario.id}
              to="/simulator/$scenarioId"
              params={{ scenarioId: scenario.id }}
              search={{ difficulty: "beginner" }}
              className="group rounded-xl border border-border/70 bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {scenario.code}
                </span>
                <span className="text-xs text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                {scenario.title}
              </h3>

              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {scenario.system}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-[11px] text-muted-foreground">
                  Beginner friendly
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity and learning support */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="eyebrow">Your mission history</p>
              <h2 className="mt-1 text-base font-semibold">
                Recent Simulations
              </h2>
            </div>

            <Link
              to="/progress"
              className="text-[11px] font-medium text-primary hover:underline"
            >
              All results
            </Link>
          </div>

          {loading ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Loading your mission history...
            </p>
          ) : attempts.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-border p-4">
              <p className="text-sm font-medium">
                Your first mission awaits!
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Complete an emergency simulation and your score and outcome
                will appear here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {attempts.map((attempt) => (
                <li
                  key={attempt.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {attempt.scenario_title}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {attempt.difficulty} · {attempt.status}
                    </p>
                  </div>

                  <span className="shrink-0 font-heading text-lg font-semibold">
                    {attempt.score}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {!loading && totalAttempts > 0 && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              {totalAttempts} simulation attempt
              {totalAttempts === 1 ? "" : "s"} recorded
            </p>
          )}
        </div>

        <div className="panel flex flex-col justify-between p-5">
          <div>
            <p className="eyebrow">Build your space knowledge</p>
            <div className="mt-1 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">
                Learn Before You Fly
              </h2>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Understand the science behind astronaut missions. Explore
              life-support systems, electrical power, communications,
              navigation, human health and orbital mechanics before
              putting your knowledge into practice.
            </p>
          </div>

          <Button asChild variant="secondary" className="mt-5 w-fit">
            <Link to="/academy">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Explore the Academy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
