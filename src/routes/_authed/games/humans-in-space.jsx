
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  HeartPulse,
  Rocket,
  Brain,
  Orbit,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFICIAL_GAME_URL =
  "https://play.google.com/store/apps/details?id=gov.nasa.jsc.igoal.SSIHRP";

export const Route = createFileRoute(
  "/_authed/games/humans-in-space"
)({
  component: HumansInSpaceMission,
  head: () => ({
    meta: [
      {
        title: "NASA Humans in Space | Junior Astronaut Mission Trainer",
      },
    ],
  }),
});

function HumansInSpaceMission() {
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
            <HeartPulse className="h-5 w-5" />
            <p className="eyebrow">Human spaceflight mission</p>
          </div>

          <h1 className="mt-3 text-3xl font-bold">
            The Human Body in Space
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            What happens to the human body when astronauts leave Earth?
            Discover how microgravity changes everyday activities and
            why scientists study the effects of spaceflight on human
            health.
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
                <Brain className="mr-2 h-4 w-4" />
                Explore human spaceflight
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            This experience is hosted externally. Availability,
            compatibility and installation are determined by the
            publisher and Google Play.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-semibold">Your learning objectives</h2>

          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Understand how microgravity affects the human body.</li>
            <li>• Explore changes in muscles and bones during spaceflight.</li>
            <li>• Discover why astronauts exercise in space.</li>
            <li>• Learn why scientists monitor astronaut health.</li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold">Think like a space scientist</h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Before starting, consider these questions:
          </p>

          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Why do astronauts appear to float in orbit?</li>
            <li>• Why can muscles become weaker in microgravity?</li>
            <li>• How can exercise help astronauts stay healthy?</li>
            <li>• What might happen when astronauts return to Earth?</li>
          </ul>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Orbit className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">A question to explore</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Astronauts aboard the International Space Station experience
              microgravity. How do you think this changes the way they
              sleep, eat, move and exercise?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
