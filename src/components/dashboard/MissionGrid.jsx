
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Play, Rocket } from "lucide-react";
import { Image } from "@/components/ui/image";

export const MISSIONS = [
  {
    id: "moonbase-alpha",
    title: "Life on the Moon",
    originalTitle: "Moonbase Alpha",
    description:
      "Discover what it takes to establish and maintain a lunar outpost. Explore the challenges of living and working on another world.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/202fb4a6a_generated_image.png",
    route: "/games/moonbase",
    cta: "Explore experience",
    meta: "LUNAR EXPLORATION",
    learning: "Moon habitats and exploration",
  },
  {
    id: "humans-in-space",
    title: "The Human Body in Space",
    originalTitle: "NASA Science: Humans in Space",
    description:
      "Investigate how microgravity affects the human body and discover what astronauts experience aboard the International Space Station.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/f114abdd5_generated_image.png",
    route: "/games/humans-in-space",
    cta: "Explore experience",
    meta: "HUMAN SPACEFLIGHT",
    learning: "Microgravity and human biology",
  },
  {
    id: "space-travel-hazards",
    title: "Surviving the Journey",
    originalTitle: "NASA Space Travel Hazards",
    description:
      "Discover the dangers of deep-space travel, investigate radiation and consider how astronauts can protect themselves on a journey to Mars.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/e2ac7afb6_generated_image.png",
    route: "/games/space-travel-hazards",
    cta: "Explore experience",
    meta: "SPACE SAFETY",
    learning: "Radiation and astronaut protection",
  },
];

export default function MissionGrid() {
  return (
    <section aria-labelledby="experiences-heading" className="space-y-5">
      <div className="space-y-2">
        <p className="eyebrow">Learn by experiencing</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="experiences-heading" className="text-xl font-semibold">
              Featured Space Experiences
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Choose an experience, explore a space science topic and discover
              what it takes to think like an astronaut.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Rocket className="h-3.5 w-3.5" />
            3 experiences
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((mission, index) => (
          <Link
            key={mission.id}
            to={mission.route}
            aria-label={`${mission.title}: ${mission.learning}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative h-44 overflow-hidden">
              <Image
                src={mission.image}
                alt={mission.originalTitle}
                className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
                fittingType="fill"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xs font-bold text-white">
                0{index + 1}
              </span>

              <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {mission.meta}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                {mission.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {mission.description}
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold text-foreground">
                    Learning focus
                  </span>
                  <span className="mt-0.5 block">{mission.learning}</span>
                </span>
              </div>

              <span className="mt-4 flex w-full items-center justify-between rounded-lg bg-secondary px-3 py-3 text-sm font-semibold transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {mission.cta}
                <Play className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/simulation"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        Discover more training experiences
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
