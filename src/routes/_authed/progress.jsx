
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Compass,
  FlaskConical,
  Globe2,
  GraduationCap,
  Medal,
  Rocket,
  Siren,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { ACADEMY_MODULES, TOTAL_LESSONS } from "@/lib/academy-data";
import { SCENARIOS } from "@/lib/simulation/scenarios";
import { PLANETS } from "@/lib/solar-data";
import { completionPercent, loadTraineeStats } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/progress")({
  component: ProgressPage,
  head: () => ({
    meta: [{ title: "My Progress · Junior Astronaut Mission Trainer" }],
  }),
});

function dateValue(value) {
  if (!value) return 0;

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value) {
  const timestamp = dateValue(value);
  if (!timestamp) return "Date unavailable";

  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readable(value) {
  if (!value) return "Not recorded";

  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ProgressBar({ value, color = "bg-primary" }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-all duration-700", color)}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="panel min-w-0 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 shrink-0 text-primary" />
      </div>
      <p className="mt-3 font-heading text-2xl font-bold leading-none">
        {value}
      </p>
      {detail && (
        <p className="mt-2 text-[10px] text-muted-foreground">{detail}</p>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, detail }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">{children}</h2>
      </div>
      {detail && (
        <span className="text-[10px] text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}

function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshStats() {
    setLoading(true);
    setError("");

    try {
      const result = await loadTraineeStats();
      setStats(result);
    } catch (err) {
      console.error("Unable to load trainee progress:", err);
      setError("Your training record could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshStats();
  }, []);

  const analytics = useMemo(() => {
    if (!stats) return null;

    const attempts = stats.attemptsList ?? [];
    const exploration = stats.exploration ?? [];
    const lessons = stats.lessonsList ?? [];

    const completedLessons = new Set(
      lessons.map((lesson) => lesson.lesson_id).filter(Boolean),
    );

    const exploredPlanets = new Set(
      exploration
        .filter(
          (item) =>
            item.item_type === "planet" && item.kind === "explored",
        )
        .map((item) => item.item_id)
        .filter(Boolean),
    );

    const earnedKeys = new Set(
      (stats.achievements ?? []).map((item) => item.key),
    );

    const scores = attempts.map((item) => Number(item.score) || 0);

    const chart = [...attempts]
      .reverse()
      .map((attempt, index) => ({
        name: `#${index + 1}`,
        score: Number(attempt.score) || 0,
      }));

    const difficultyGroups = ["beginner", "intermediate", "advanced"].map(
      (difficulty) => {
        const matching = attempts.filter(
          (attempt) =>
            String(attempt.difficulty).toLowerCase() === difficulty,
        );

        const average = matching.length
          ? Math.round(
              matching.reduce(
                (sum, attempt) => sum + (Number(attempt.score) || 0),
                0,
              ) / matching.length,
            )
          : 0;

        return {
          difficulty,
          attempts: matching.length,
          average,
          best: matching.length
            ? Math.max(...matching.map((item) => Number(item.score) || 0))
            : 0,
        };
      },
    );

    const outcomes = Object.entries(
      attempts.reduce((result, attempt) => {
        const status = attempt.status || "not recorded";
        result[status] = (result[status] || 0) + 1;
        return result;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);

    const scenarioReports = SCENARIOS.map((scenario) => {
      const matching = attempts.filter(
        (attempt) => attempt.scenario_id === scenario.id,
      );

      const average = matching.length
        ? Math.round(
            matching.reduce(
              (sum, attempt) => sum + (Number(attempt.score) || 0),
              0,
            ) / matching.length,
          )
        : 0;

      return {
        ...scenario,
        attempts: matching.length,
        average,
        best: matching.length
          ? Math.max(...matching.map((item) => Number(item.score) || 0))
          : 0,
        latest: matching[0] ?? null,
      };
    });

    const modules = ACADEMY_MODULES.map((module) => {
      const done = module.lessons.filter((lesson) =>
        completedLessons.has(lesson.id),
      ).length;

      return {
        ...module,
        done,
        total: module.lessons.length,
        percent: module.lessons.length
          ? Math.round((done / module.lessons.length) * 100)
          : 0,
      };
    });

    const activity = [
      ...attempts.map((item) => ({
        id: `attempt-${item.id}`,
        title: item.scenario_title || "Simulation",
        type: "Mission",
        detail: `${item.score ?? 0}% score · ${readable(item.status)}`,
        created_date: item.created_date,
      })),
      ...exploration.map((item) => ({
        id: `exploration-${item.id}`,
        title: item.item_name || "Space exploration",
        type: readable(item.kind || item.item_type),
        detail: readable(item.item_type),
        created_date: item.created_date,
      })),
      ...lessons.map((item) => ({
        id: `lesson-${item.id}`,
        title: item.lesson_title || "Academy lesson",
        type: "Lesson completed",
        detail: item.module_id ? readable(item.module_id) : "Academy",
        created_date: item.created_date,
      })),
    ]
      .sort(
        (a, b) =>
          dateValue(b.created_date) - dateValue(a.created_date),
      )
      .slice(0, 10);

    const weakestScenario = scenarioReports
      .filter((item) => item.attempts > 0)
      .sort((a, b) => a.average - b.average)[0];

    const strongestScenario = scenarioReports
      .filter((item) => item.attempts > 0)
      .sort((a, b) => b.average - a.average)[0];

    const bestScore = scores.length ? Math.max(...scores) : 0;
    const averageScore = scores.length
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : 0;

    const completion = completionPercent(stats);

    return {
      attempts,
      exploration,
      lessons,
      scores,
      chart,
      difficultyGroups,
      outcomes,
      scenarioReports,
      modules,
      activity,
      completedLessons,
      exploredPlanets,
      earnedKeys,
      weakestScenario,
      strongestScenario,
      bestScore,
      averageScore,
      completion,
      missionCoverage: Math.round(
        (new Set(attempts.map((item) => item.scenario_id).filter(Boolean)).size /
          Math.max(SCENARIOS.length, 1)) *
          100,
      ),
      lessonCoverage: Math.round(
        (completedLessons.size / Math.max(TOTAL_LESSONS, 1)) * 100,
      ),
      planetCoverage: Math.round(
        (exploredPlanets.size / Math.max(PLANETS.length, 1)) * 100,
      ),
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="panel p-10 text-center">
        <Rocket className="mx-auto h-7 w-7 animate-pulse text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">
          Loading your astronaut training report…
        </p>
      </div>
    );
  }

  if (error || !stats || !analytics) {
    return (
      <div className="panel p-8 text-center">
        <Activity className="mx-auto h-7 w-7 text-muted-foreground" />
        <h1 className="mt-3 text-lg font-semibold">
          Training report unavailable
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || "No training record is available."}
        </p>
        <Button className="mt-5" onClick={refreshStats}>
          Try again
        </Button>
      </div>
    );
  }

  const {
    attempts,
    exploration,
    lessons,
    chart,
    difficultyGroups,
    outcomes,
    scenarioReports,
    modules,
    activity,
    completedLessons,
    exploredPlanets,
    earnedKeys,
    weakestScenario,
    strongestScenario,
    bestScore,
    averageScore,
    completion,
    missionCoverage,
    lessonCoverage,
    planetCoverage,
  } = analytics;

  const unattemptedScenarios = scenarioReports.filter(
    (scenario) => scenario.attempts === 0,
  );

  const lockedAchievements = ACHIEVEMENTS.filter(
    (achievement) => !earnedKeys.has(achievement.key),
  );

  const nextScenario = unattemptedScenarios[0];

  const recommendations = [];

  if (nextScenario) {
    recommendations.push({
      title: `Try ${nextScenario.title}`,
      detail: "Complete a mission you have not attempted yet.",
      to: "/simulator/$scenarioId",
      params: { scenarioId: nextScenario.id },
      search: { difficulty: "beginner" },
      action: "Start mission",
      icon: Siren,
    });
  }

  if (completedLessons.size < TOTAL_LESSONS) {
    recommendations.push({
      title: "Continue your Academy training",
      detail: `${TOTAL_LESSONS - completedLessons.size} lessons remain.`,
      to: "/academy",
      action: "Continue learning",
      icon: BookOpen,
    });
  }

  if (exploredPlanets.size < PLANETS.length) {
    recommendations.push({
      title: "Explore the Solar System",
      detail: `${PLANETS.length - exploredPlanets.size} planets remain.`,
      to: "/solar-system",
      action: "Explore",
      icon: Globe2,
    });
  }

  if (weakestScenario && weakestScenario.average < 70) {
    recommendations.push({
      title: `Practise ${weakestScenario.title}`,
      detail: `Your current average is ${weakestScenario.average}%. Try another attempt.`,
      to: "/simulator/$scenarioId",
      params: { scenarioId: weakestScenario.id },
      search: { difficulty: "beginner" },
      action: "Practise",
      icon: Target,
    });
  }

  const metricCards = [
    {
      label: "Mission attempts",
      value: attempts.length,
      detail: `${missionCoverage}% of scenarios attempted`,
      icon: Siren,
    },
    {
      label: "Average score",
      value: `${averageScore}%`,
      detail: "Across recorded simulations",
      icon: BarChart3,
    },
    {
      label: "Highest score",
      value: `${bestScore}%`,
      detail: "Personal best",
      icon: Trophy,
    },
    {
      label: "Planets explored",
      value: `${exploredPlanets.size}/${PLANETS.length}`,
      detail: `${planetCoverage}% exploration coverage`,
      icon: Globe2,
    },
    {
      label: "Lessons completed",
      value: `${completedLessons.size}/${TOTAL_LESSONS}`,
      detail: `${lessonCoverage}% academy coverage`,
      icon: BookOpen,
    },
    {
      label: "Achievements",
      value: earnedKeys.size,
      detail: `${lockedAchievements.length} still to unlock`,
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="eyebrow">Astronaut development record</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              My Training Report
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Track your mission performance, learning achievements and
              exploration progress as you develop your astronaut skills.
            </p>
          </div>

          <div className="min-w-[120px] text-right">
            <p className="font-heading text-4xl font-bold">
              {completion}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Overall completion
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={completion} color="bg-gradient-to-r from-primary to-cyan-400" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Mission coverage", value: missionCoverage },
            { label: "Academy completion", value: lessonCoverage },
            { label: "Planet exploration", value: planetCoverage },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-background/40 p-3">
              <div className="mb-2 flex justify-between gap-2 text-[10px]">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold">{item.value}%</span>
              </div>
              <ProgressBar value={item.value} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Performance overview</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel min-w-0 p-5">
          <SectionTitle
            icon={TrendingUp}
            detail={`${attempts.length} recorded attempts`}
          >
            Simulation performance trend
          </SectionTitle>

          {chart.length < 2 ? (
            <div className="flex min-h-[190px] items-center justify-center text-center">
              <div>
                <BarChart3 className="mx-auto h-7 w-7 text-muted-foreground" />
                <p className="mt-3 text-xs text-muted-foreground">
                  Complete at least two simulations to see your score trend.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chart}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Score"]}
                    contentStyle={{
                      background: "#11161d",
                      border: "1px solid #24303f",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#3b82f6" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-4 border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
            <span>Average: {averageScore}%</span>
            <span>Best: {bestScore}%</span>
            <span>Attempts: {attempts.length}</span>
          </div>
        </div>

        <div className="panel p-5">
          <SectionTitle icon={Target}>Performance by difficulty</SectionTitle>

          <div className="space-y-4">
            {difficultyGroups.map((group) => (
              <div key={group.difficulty}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">
                    {readable(group.difficulty)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {group.attempts} attempts
                  </span>
                </div>
                <ProgressBar
                  value={group.average}
                  color="bg-gradient-to-r from-primary to-cyan-400"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>Average: {group.attempts ? `${group.average}%` : "—"}</span>
                  <span>Best: {group.attempts ? `${group.best}%` : "—"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-border/60 pt-4">
            <h3 className="text-xs font-semibold">Recorded mission outcomes</h3>

            {outcomes.length === 0 ? (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Mission outcomes will appear after your first simulation.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {outcomes.map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between gap-3 text-[11px]"
                  >
                    <span className="text-muted-foreground">
                      {readable(status)}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <SectionTitle
          icon={Siren}
          detail={`${scenarioReports.filter((item) => item.attempts > 0).length}/${SCENARIOS.length} attempted`}
        >
          Mission performance report
        </SectionTitle>

        <div className="space-y-3">
          {scenarioReports.map((scenario) => (
            <div
              key={scenario.id}
              className="rounded-lg border border-border/60 bg-background/30 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">
                    {scenario.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {scenario.attempts
                      ? `${scenario.attempts} attempt${scenario.attempts === 1 ? "" : "s"} recorded`
                      : "Not attempted yet"}
                  </p>
                </div>

                {scenario.attempts ? (
                  <div className="text-right">
                    <p className="text-lg font-bold">{scenario.average}%</p>
                    <p className="text-[9px] text-muted-foreground">
                      Average score
                    </p>
                  </div>
                ) : (
                  <Link
                    to="/simulator/$scenarioId"
                    params={{ scenarioId: scenario.id }}
                    search={{ difficulty: "beginner" }}
                    className="text-[10px] font-semibold text-primary hover:underline"
                  >
                    Start mission
                  </Link>
                )}
              </div>

              {scenario.attempts > 0 && (
                <div className="mt-3">
                  <ProgressBar value={scenario.average} />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Best: {scenario.best}%</span>
                    <span>
                      Latest outcome:{" "}
                      {readable(scenario.latest?.status)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <SectionTitle
            icon={GraduationCap}
            detail={`${completedLessons.size}/${TOTAL_LESSONS} lessons`}
          >
            Learning Academy report
          </SectionTitle>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-xs font-medium">
                    {module.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {module.done}/{module.total}
                  </span>
                </div>
                <ProgressBar value={module.percent} />
              </div>
            ))}
          </div>

          <Link
            to="/academy"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            Continue Academy training <BookOpen className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="panel p-5">
          <SectionTitle icon={Globe2}>Exploration and practical work</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Planets explored", value: exploredPlanets.size, icon: Globe2 },
              { label: "Comparisons", value: stats.comparisons ?? 0, icon: Compass },
              { label: "Experiments", value: stats.experiments ?? 0, icon: FlaskConical },
              { label: "Quizzes", value: stats.quizzes ?? 0, icon: CheckCircle2 },
              { label: "Landings", value: stats.landings ?? 0, icon: Rocket },
              { label: "Small bodies", value: stats.smallBodies ?? 0, icon: Zap },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-background/40 p-3"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xl font-bold">{item.value}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-[10px]">
              <span className="text-muted-foreground">Planet exploration</span>
              <span>{planetCoverage}%</span>
            </div>
            <ProgressBar value={planetCoverage} />
          </div>

          <Link
            to="/solar-system"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            Continue exploring <Globe2 className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-5">
          <SectionTitle icon={Medal}>Achievement record</SectionTitle>

          <p className="mb-3 text-[11px] text-muted-foreground">
            {earnedKeys.size} earned · {lockedAchievements.length} remaining
          </p>

          <div className="space-y-2">
            {ACHIEVEMENTS.map((achievement) => {
              const earned = earnedKeys.has(achievement.key);

              return (
                <div
                  key={achievement.key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3",
                    earned
                      ? "border-amber-400/30 bg-amber-400/5"
                      : "border-border/60 bg-background/30 opacity-70",
                  )}
                >
                  <Award
                    className={cn(
                      "h-5 w-5 shrink-0",
                      earned ? "text-amber-400" : "text-muted-foreground",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">
                      {achievement.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {earned ? "Achievement earned" : "Not unlocked yet"}
                    </p>
                  </div>
                  {earned && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                  )}
                </div>
              );
            })}
          </div>

          <Link
            to="/achievements"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            View achievements <Trophy className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="panel p-5">
          <SectionTitle icon={Target}>Training insights and next steps</SectionTitle>

          {attempts.length === 0 ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your first simulation will help identify your strongest skills
              and the areas where you can improve.
            </p>
          ) : (
            <div className="space-y-3">
              {strongestScenario && (
                <div className="rounded-lg bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Strongest mission
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {strongestScenario.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Average score: {strongestScenario.average}%
                  </p>
                </div>
              )}

              {weakestScenario && weakestScenario.id !== strongestScenario?.id && (
                <div className="rounded-lg bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Opportunity to improve
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {weakestScenario.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Average score: {weakestScenario.average}%
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {recommendations.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Excellent progress. Keep practising and exploring to maintain
                your training momentum.
              </p>
            ) : (
              recommendations.slice(0, 4).map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{item.title}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <Link
                      to={item.to}
                      params={item.params}
                      search={item.search}
                      className="shrink-0 text-[10px] font-semibold text-primary hover:underline"
                    >
                      {item.action}
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <SectionTitle
          icon={Activity}
          detail={`${activity.length} most recent records`}
        >
          Recent training activity
        </SectionTitle>

        {activity.length === 0 ? (
          <div className="py-6 text-center">
            <Rocket className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 text-xs text-muted-foreground">
              No training activity recorded yet. Start a mission or explore
              the Academy to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-background/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {item.type} · {item.detail}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatDate(item.created_date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/simulator">Start mission training</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/academy">Open Learning Academy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/achievements">All achievements</Link>
        </Button>
      </div>
    </div>
  );
}
