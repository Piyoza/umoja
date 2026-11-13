import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimulatorRun from "@/components/simulator/SimulatorRun";
import { getScenario } from "@/lib/simulation/scenarios";
import { DIFFICULTIES } from "@/lib/simulation/engine";

export const Route = createFileRoute("/_authed/simulator/$scenarioId")({
  validateSearch: (search) => ({
    difficulty: ["beginner", "intermediate", "advanced"].includes(search.difficulty)
      ? search.difficulty
      : undefined,
  }),
  component: ScenarioPage,
  head: () => ({ meta: [{ title: "Emergency Simulation · Junior Astronaut Mission Trainer" }] }),
});

function ScenarioPage() {
  const { scenarioId } = Route.useParams();
  const { difficulty } = Route.useSearch();
  const scenario = getScenario(scenarioId);

  if (!scenario) {
    return (
      <div className="panel p-8 text-center">
        <h1 className="text-lg font-semibold">Simulation not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">That emergency scenario is not in the training library.</p>
        <Button asChild className="mt-4">
          <Link to="/simulator">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to the simulator
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/simulator" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All emergencies
      </Link>
      <SimulatorRun scenario={scenario} initialDifficulty={DIFFICULTIES[difficulty] ? difficulty : "beginner"} />
    </div>
  );
}