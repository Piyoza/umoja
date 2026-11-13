import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import HeroBanner from "@/components/dashboard/HeroBanner";
import ModuleCards from "@/components/dashboard/ModuleCards";
import MissionGrid from "@/components/dashboard/MissionGrid";
import ProgressPanel from "@/components/dashboard/ProgressPanel";
import AchievementsPanel from "@/components/dashboard/AchievementsPanel";
import { completionPercent, loadTraineeStats } from "@/lib/progress";

export const Route = createFileRoute("/_authed/")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Mission Control · Junior Astronaut Mission Trainer" }] }),
});

function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTraineeStats()
      .then((result) => setStats(result))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const percent = completionPercent(stats);
  const panels = [
    { label: "Missions", value: stats?.attempts ?? 0 },
    { label: "Planets", value: `${stats?.planets ?? 0}/8` },
    { label: "Lessons", value: stats?.lessons ?? 0 },
  ];

  return (
    <div className="space-y-7">
      <HeroBanner />
      <ModuleCards />
      <MissionGrid />
      <div className="grid gap-4 lg:grid-cols-2">
        <ProgressPanel percent={percent} stats={panels} loading={loading} />
        <AchievementsPanel badges={stats?.achievements || []} loading={loading} />
      </div>
    </div>
  );
}