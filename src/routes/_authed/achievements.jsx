import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Lock, ShieldCheck, Sparkles, Star, Trophy } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { loadTraineeStats } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/achievements")({
  component: AchievementsPage,
  head: () => ({ meta: [{ title: "Achievements · Junior Astronaut Mission Trainer" }] }),
});

const ICONS = { star: Star, award: Award, shield: ShieldCheck, sparkles: Sparkles };

function AchievementsPage() {
  const [earned, setEarned] = useState(null);

  useEffect(() => {
    loadTraineeStats()
      .then((stats) => setEarned(new Set(stats.achievements.map((achievement) => achievement.key))))
      .catch(() => setEarned(new Set()));
  }, []);

  const unlocked = earned ? ACHIEVEMENTS.filter((achievement) => earned.has(achievement.key)) : [];

  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <p className="eyebrow">Training awards</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Achievements</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Badges are awarded automatically for genuine learning milestones — completed simulations, explored
          worlds, experiments and lessons.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-400" />
          <p className="text-sm text-foreground">
            {earned ? unlocked.length : "—"} of {ACHIEVEMENTS.length} badges earned
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isEarned = earned?.has(achievement.key);
          const Icon = ICONS[achievement.icon] || Star;
          return (
            <div
              key={achievement.key}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                isEarned ? "border-amber-400/40 bg-amber-400/5" : "border-border/70 bg-card/60",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border",
                    isEarned ? "border-amber-400/40 bg-amber-400/10" : "border-border/70 bg-background/40",
                  )}
                >
                  {isEarned ? (
                    <Icon className="h-5 w-5 text-amber-300" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em]",
                    isEarned
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-border/60 text-muted-foreground",
                  )}
                >
                  {isEarned ? "Earned" : "Locked"}
                </span>
              </div>
              <h2 className="mt-3 text-sm font-semibold">{achievement.title}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{achievement.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}