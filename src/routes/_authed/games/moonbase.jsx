
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Moon, Rocket, Compass } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const OFFICIAL_GAME_URL =
  "https://store.steampowered.com/app/39000/Moonbase_Alpha/";

export const Route = createFileRoute("/_authed/games/moonbase")({
  component: MoonbaseMission,
  head: () => ({
    meta: [
      {
        title: "Moonbase Alpha | Junior Astronaut Mission Trainer",
      },
    ],
  }),
});

function MoonbaseMission() {
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
            <Moon className="h-5 w-5" />
            <p className="eyebrow">Lunar exploration mission</p>
          </div>

          <h1 className="mt-3 text-3xl font-bold">Moonbase Alpha</h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Imagine living and working on the Moon. Explore a lunar
            outpost, respond to mission challenges and discover some of
            the problems astronauts must solve when establishing a
            human presence beyond Earth.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={OFFICIAL_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Visit official game page
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
            The game is hosted externally. Availability, installation
            and system requirements are determined by its publisher
            and Steam.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-semibold">Your learning objectives</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Understand the challenges of living on the Moon.</li>
            <li>• Explore the importance of habitats and life support.</li>
            <li>• Consider how astronauts work together during missions.</li>
            <li>• Think about the resources needed for lunar exploration.</li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold">Think like a lunar explorer</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Before starting, consider these questions:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• How would you provide oxygen to a Moon habitat?</li>
            <li>• How would you protect astronauts from extreme temperatures?</li>
            <li>• What resources would a lunar base need to survive?</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
