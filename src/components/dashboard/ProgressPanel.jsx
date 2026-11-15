
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Orbit,
  Rocket,
} from "lucide-react";

const STAT_ICONS = {
  Missions: Rocket,
  Planets: Orbit,
  Lessons: BookOpen,
};

export default function ProgressPanel({
  percent = 0,
  stats = [],
  loading = false,
}) {
  const safePercent = Math.min(100, Math.max(0, Number(percent) || 0));

  return (
    <section
      aria-labelledby="astronaut-progress-heading"
      className="panel p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          <div>
            <p className="eyebrow">Your development</p>
            <h2
              id="astronaut-progress-heading"
              className="text-base font-semibold"
            >
              Your Astronaut Journey
            </h2>
          </div>
        </div>

        <Link
          to="/progress"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View journey
        </Link>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold">
          {loading ? "—" : `${safePercent}%`}
        </span>
        <span className="text-xs text-muted-foreground">
          overall progress
        </span>
      </div>

      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label="Overall astronaut journey progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={loading ? 0 : safePercent}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700"
          style={{ width: `${safePercent}%` }}
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Every lesson, discovery and completed mission moves you
        forward on your journey.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((stat) => {
          const Icon = STAT_ICONS[stat.label] || Compass;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <Icon className="mb-2 h-4 w-4 text-primary" />

              <p className="font-heading text-lg font-semibold leading-none">
                {loading ? "—" : stat.value}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        to="/progress"
        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
      >
        Explore your achievements and progress
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
