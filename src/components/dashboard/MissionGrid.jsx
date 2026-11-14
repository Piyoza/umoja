
import { Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, Play } from "lucide-react";
import { Image } from "@/components/ui/image";

export const MISSIONS = [
  {
    id: "moonbase-alpha",
    title: "Moonbase Alpha",
    description:
      "Explore the official NASA lunar exploration game and experience life on a lunar outpost.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/202fb4a6a_generated_image.png",
    route: "/games/moonbase",
    cta: "Launch Game",
    meta: "Lunar exploration · NASA",
  },
  {
    id: "humans-in-space",
    title: "NASA Science: Humans in Space",
    description:
      "Experience microgravity, explore the International Space Station and discover its effects on the human body.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/f114abdd5_generated_image.png",
    route: "/games/humans-in-space",
    cta: "Launch Game",
    meta: "Human spaceflight · NASA",
  },
  {
    id: "space-travel-hazards",
    title: "NASA Space Travel Hazards",
    description:
      "Learn about radiation hazards and test your decisions during a simulated journey to Mars.",
    image:
      "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/e2ac7afb6_generated_image.png",
    route: "/games/space-travel-hazards",
    cta: "Explore Game",
    meta: "Space safety · NASA",
  },
];

export default function MissionGrid() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Gamepad2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            Official Space Games
          </h2>
        </div>

        <Link
          to="/simulation"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((mission) => (
          <a
            key={mission.id}
            href={mission.route}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/70 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

              <h3 className="mt-1 text-base font-semibold leading-snug">
                {mission.title}
              </h3>

              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                {mission.description}
              </p>

              <span className="mt-4 flex w-full items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm font-medium transition-colors group-hover:bg-secondary/80">
                {mission.cta}
                <Play className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
