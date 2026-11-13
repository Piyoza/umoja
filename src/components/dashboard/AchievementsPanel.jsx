import { Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Sparkles, Star } from "lucide-react";

const ICONS = { star: Star, award: Award, shield: ShieldCheck, sparkles: Sparkles };

export default function AchievementsPanel({ badges = [], loading = false }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold">Your Achievements</h3>
        </div>
        <Link to="/achievements" className="text-[11px] text-muted-foreground hover:text-foreground">
          All
        </Link>
      </div>

      <p className="mt-4 font-heading text-3xl font-bold">
        {loading ? "—" : badges.length} <span className="text-sm font-medium text-muted-foreground">badges</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {loading && (
          <div className="h-12 w-12 animate-pulse rounded-full bg-secondary" />
        )}
        {!loading && badges.length === 0 && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            No badges yet. Complete a simulation or explore a planet to earn your first one.
          </p>
        )}
        {badges.slice(0, 5).map((badge) => {
          const Icon = ICONS[badge.icon] || Star;
          return (
            <div
              key={badge.id || badge.key}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10"
              title={badge.title}
            >
              <Icon className="h-5 w-5 text-amber-300" />
            </div>
          );
        })}
      </div>

      {!loading && badges.length > 0 && (
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Latest: {badges[0]?.title}
        </p>
      )}

      <Link
        to="/achievements"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        View all badges
      </Link>
    </div>
  );
}