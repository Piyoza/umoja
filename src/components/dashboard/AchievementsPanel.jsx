
import { Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Sparkles, Star, ArrowRight } from "lucide-react";

const ICONS = {
  star: Star,
  award: Award,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

export default function AchievementsPanel({ badges = [], loading = false }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold">Discoveries & Milestones</h3>
        </div>

        <Link
          to="/achievements"
          className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Every new discovery, skill and completed mission is part of your journey
        as a space explorer.
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold">
          {loading ? "—" : badges.length}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          milestones earned
        </span>
      </div>

      <div className="mt-4 flex min-h-12 flex-wrap items-center gap-2.5">
        {loading && (
          <>
            <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
            <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
            <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
          </>
        )}

        {!loading && badges.length === 0 && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your journey is just beginning. Explore a new topic, investigate a
            planet or complete a training activity to record your first
            milestone.
          </p>
        )}

        {!loading &&
          badges.slice(0, 5).map((badge) => {
            const Icon = ICONS[badge.icon] || Star;

            return (
              <div
                key={badge.id || badge.key}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10"
                title={badge.title}
                aria-label={badge.title}
              >
                <Icon className="h-5 w-5 text-amber-300" />
              </div>
            );
          })}
      </div>

      {!loading && badges.length > 0 && (
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Most recent milestone:{" "}
          <span className="font-medium text-foreground">
            {badges[0]?.title}
          </span>
        </p>
      )}

      <Link
        to="/achievements"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
      >
        Explore your milestones
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
