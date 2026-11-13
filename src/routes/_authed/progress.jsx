import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, BookOpen, Compass, Globe2, Siren, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { ACADEMY_MODULES, TOTAL_LESSONS } from "@/lib/academy-data";
import { SCENARIOS } from "@/lib/simulation/scenarios";
import { PLANETS } from "@/lib/solar-data";
import { completionPercent, loadTraineeStats } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/progress")({
  component: ProgressPage,
  head: () => ({ meta: [{ title: "My Progress · Junior Astronaut Mission Trainer" }] }),
});

function ProgressPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadTraineeStats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <div className="panel p-10 text-center text-sm text-muted-foreground">Loading your training record…</div>;
  }

  const percent = completionPercent(stats);
  const chart = [...stats.attemptsList]
    .reverse()
    .map((attempt, index) => ({ name: `#${index + 1}`, score: attempt.score || 0 }));

  const exploredPlanets = new Set(
    stats.exploration.filter((r) => r.item_type === "planet" && r.kind === "explored").map((r) => r.item_id),
  );
  const completedLessons = new Set(stats.lessonsList.map((lesson) => lesson.lesson_id));
  const earned = new Set(stats.achievements.map((achievement) => achievement.key));

  const cards = [
    { label: "Simulations", value: stats.attempts, icon: Siren },
    { label: "Best score", value: stats.bestScore, icon: Trophy },
    { label: "Planets explored", value: `${exploredPlanets.size}/8`, icon: Globe2 },
    { label: "Comparisons", value: stats.comparisons, icon: Compass },
    { label: "Experiments", value: stats.experiments, icon: Compass },
    { label: "Lessons complete", value: `${completedLessons.size}/${TOTAL_LESSONS}`, icon: BookOpen },
  ];

  const activity = [...stats.exploration, ...stats.lessonsList]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Training record</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">My Progress</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every simulation, exploration and lesson feeds this dashboard.
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-4xl font-bold">{percent}%</p>
            <p className="text-[11px] text-muted-foreground">overall training complete</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700"
            style={{ width: `${Math.max(2, percent)}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="panel p-4">
            <card.icon className="h-4 w-4 text-primary" />
            <p className="mt-2 font-heading text-2xl font-semibold leading-none">{card.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <BarChart3 className="h-4 w-4 text-primary" /> Simulation scores
            </h2>
            <span className="text-[11px] text-muted-foreground">Average {stats.averageScore}</span>
          </div>
          {chart.length < 2 ? (
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Complete at least two simulations to see your score trend.
            </p>
          ) : (
            <div className="mt-3 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#11161d", border: "1px solid #24303f", borderRadius: 8, fontSize: 11 }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Recommended next steps</h2>
          <div className="mt-3 space-y-2">
            {SCENARIOS.filter((scenario) => !stats.attemptsList.some((a) => a.scenario_id === scenario.id))
              .slice(0, 3)
              .map((scenario) => (
                <Link
                  key={scenario.id}
                  to="/simulator/$scenarioId"
                  params={{ scenarioId: scenario.id }}
                  search={{ difficulty: "beginner" }}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-2 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  <span className="truncate">Try: {scenario.title}</span>
                  <span className="shrink-0 text-primary">Start</span>
                </Link>
              ))}
            {exploredPlanets.size < PLANETS.length && (
              <Link
                to="/solar-system"
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-2 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <span>{PLANETS.length - exploredPlanets.size} planets still to explore</span>
                <span className="text-primary">Explore</span>
              </Link>
            )}
            {completedLessons.size < TOTAL_LESSONS && (
              <Link
                to="/academy"
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-2 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <span>Continue the Learning Academy</span>
                <span className="text-primary">Study</span>
              </Link>
            )}
          </div>

          <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Badges earned
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ACHIEVEMENTS.slice(0, 5).map((achievement) => (
              <span
                key={achievement.key}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px]",
                  earned.has(achievement.key)
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "border-border/60 text-muted-foreground",
                )}
              >
                {achievement.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Modules explored</h2>
          <div className="mt-3 space-y-1.5">
            {ACADEMY_MODULES.slice(0, 6).map((module) => {
              const done = module.lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
              return (
                <div key={module.id} className="flex items-center justify-between rounded-lg bg-background/40 px-2.5 py-1.5">
                  <span className="truncate text-[11px] text-muted-foreground">{module.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {done}/{module.lessons.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">Nothing recorded yet — start a mission or open a planet.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {activity.map((entry) => (
                <li key={entry.id} className="rounded-lg bg-background/40 px-2.5 py-1.5">
                  <p className="text-[11px] text-foreground">{entry.item_name || entry.lesson_title}</p>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {entry.kind || "lesson"} ·{" "}
                    {new Date(entry.created_date).toLocaleDateString("en-GB", { timeZone: "UTC" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/simulator">Start a simulation</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/achievements">View achievements</Link>
        </Button>
      </div>
    </div>
  );
}