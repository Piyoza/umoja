
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  Rocket,
  Radiation,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFICIAL_GAME_URL =
  "https://lws-set.gsfc.nasa.gov/documents/radiation_game/SpaceTravelGameBd.pdf";

export const Route = createFileRoute(
  "/_authed/games/space-travel-hazards"
)({
  component: SpaceTravelHazardsMission,
  head: () => ({
    meta: [
      {
        title: "NASA Space Travel Hazards | Junior Astronaut Mission Trainer",
      },
    ],
  }),
});

function SpaceTravelHazardsMission() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/simulation"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Games & Challenges
      </Link>

      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />

        <div className="relative">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <p className="eyebrow">Deep-space safety mission</p>
          </div>

          <h1 className="mt-3 text-3xl font-bold">
            Surviving the Journey
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Space is an exciting place to explore, but travelling beyond
            Earth comes with serious challenges. Investigate space
            radiation and other hazards, and discover how scientists
            work to protect astronauts on long journeys through space.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={OFFICIAL_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Open NASA game board
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button asChild variant="secondary">
              <Link to="/academy">
                <Compass className="mr-2 h-4 w-4" />
                Explore space science
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This experience opens NASA's original PDF game board in a
            new tab. You may need a PDF reader to view it.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-semibold">Your learning objectives</h2>

          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Understand what space radiation is.</li>
            <li>• Discover why astronauts face radiation exposure.</li>
            <li>• Explore how spacecraft shielding can help.</li>
            <li>• Learn why mission planners monitor space weather.</li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold">Think like a space safety officer</h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Before starting, consider these questions:
          </p>

          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Where does space radiation come from?</li>
            <li>• How can solar storms affect astronauts?</li>
            <li>• Why might a spacecraft need a sheltered area?</li>
            <li>• How could scientists prepare for a journey to Mars?</li>
          </ul>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Radiation className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">Your mission challenge</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Imagine your crew is preparing for a journey to Mars.
              What information would you need about radiation, and
              what protection strategies would you consider before
              leaving Earth?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
