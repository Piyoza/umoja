import { Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

export const MISSIONS = [
  {
    scenarioId: "cabin-pressure-loss",
    title: "Moonbase Alpha",
    description: "Survive a hull breach and rebuild cabin pressure on the lunar surface.",
    image: "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/202fb4a6a_generated_image.png",
    cta: "Launch simulation",
    meta: "Pressure · Beginner friendly",
  },
  {
    scenarioId: "medical-emergency",
    title: "NASA Science: Humans in Space",
    description: "Experience life in microgravity and stabilise a crew medical emergency.",
    image: "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/f114abdd5_generated_image.png",
    cta: "Launch simulation",
    meta: "Life support · Intermediate",
  },
  {
    scenarioId: "solar-storm",
    title: "NASA Space Travel Hazards",
    description: "Make smart decisions when a solar particle event hits the spacecraft.",
    image: "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/e2ac7afb6_generated_image.png",
    cta: "Launch simulation",
    meta: "Radiation · Advanced",
  },
];

export default function MissionGrid() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Gamepad2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Games &amp; Simulations</h2>
        </div>
        <Link
          to="/simulation"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((mission) => (
          <article
            key={mission.scenarioId}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/70 transition-colors hover:border-primary/50"
          >
            <div className="relative h-36 overflow-hidden">
              <Image
                src={mission.image}
                alt={mission.title}
                className="h-36 w-full transition-transform duration-500 group-hover:scale-105"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="eyebrow">{mission.meta}</p>
              <h3 className="mt-1 text-base font-semibold leading-snug">{mission.title}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                {mission.description}
              </p>
              <Button asChild size="sm" variant="secondary" className="mt-4 w-full justify-between">
                <Link to="/simulator/$scenarioId" params={{ scenarioId: mission.scenarioId }}>
                  {mission.cta}
                  <Play className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}