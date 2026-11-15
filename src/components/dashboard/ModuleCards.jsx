
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Orbit,
  Sparkles,
} from "lucide-react";

const MODULES = [
  {
    to: "/academy",
    icon: BookOpen,
    tag: "DISCOVER · LEARN · INVESTIGATE",
    title: "Become a Space Scientist",
    description:
      "Explore astronaut life, the human body in space, planetary science and the discoveries that help us understand our universe.",
    action: "Explore learning",
    accent: "from-primary/25 via-primary/5",
    ring: "group-hover:border-primary/60",
  },
  {
    to: "/solar-system",
    icon: Orbit,
    tag: "EXPLORE · EXPERIMENT · DISCOVER",
    title: "Explore Other Worlds",
    description:
      "Travel through our solar system, compare planets, investigate gravity and discover what makes every world unique.",
    action: "Explore the planets",
    accent: "from-cyan-500/20 via-indigo-500/10",
    ring: "group-hover:border-cyan-400/60",
  },
];

export default function ModuleCards() {
  return (
    <section aria-labelledby="discovery-heading" className="space-y-4">
      <div>
        <p className="eyebrow">Your universe awaits</p>
        <h2 id="discovery-heading" className="text-2xl font-semibold">
          Where will your curiosity take you?
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Start with a question. Discover the science. Explore the possibilities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.to}
              to={module.to}
              className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-0.5 ${module.ring}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.accent} to-transparent opacity-70`}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/60">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <p className="eyebrow mt-5">{module.tag}</p>

                <h3 className="mt-1.5 text-xl font-semibold">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {module.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  {module.action}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
