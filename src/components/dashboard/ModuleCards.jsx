import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Orbit, Siren } from "lucide-react";

const MODULES = [
  {
    to: "/simulator",
    icon: Siren,
    tag: "Module 01 · Live Simulation",
    title: "Space Emergency Simulator",
    description:
      "Eight branching spacecraft emergencies with live telemetry, decision consequences and an ASTRA performance debrief.",
    accent: "from-primary/25 via-primary/5",
    ring: "group-hover:border-primary/60",
  },
  {
    to: "/solar-system",
    icon: Orbit,
    tag: "Module 02 · 3D Exploration",
    title: "3D Solar System Explorer",
    description:
      "Fly through an interactive solar system, compare planets, run gravity experiments and choose a Mars landing site.",
    accent: "from-cyan-500/20 via-indigo-500/10",
    ring: "group-hover:border-cyan-400/60",
  },
];

export default function ModuleCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {MODULES.map((module) => (
        <Link
          key={module.to}
          to={module.to}
          className={`group relative overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-0.5 ${module.ring}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} to-transparent opacity-70`} />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/60">
                <module.icon className="h-5 w-5 text-foreground" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <p className="eyebrow mt-5">{module.tag}</p>
            <h3 className="mt-1.5 text-xl font-semibold">{module.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{module.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}