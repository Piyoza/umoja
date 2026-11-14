import { BarChart3, BookOpen, Siren, Sparkles } from "lucide-react";
import SectionHeading from "@/components/welcome/SectionHeading";

const FEATURES = [
  {
    title: "Learning Academy",
    description: "Discover space science, astronomy, planets and spacecraft.",
    icon: BookOpen,
  },
  {
    title: "ASTRA AI Instructor",
    description: "Interact with your intelligent AI space instructor.",
    icon: Sparkles,
  },
  {
    title: "Space Mission Experiences",
    description: "Experience educational space simulations and decision-making challenges.",
    icon: Siren,
  },
  {
    title: "Mission Progress",
    description: "Monitor learning progress and celebrate achievements.",
    icon: BarChart3,
  },
];

export default function AboutPlatform() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        kicker="About the platform"
        title="Your gateway to space exploration"
        description="The Junior Astronaut Mission Trainer is an interactive educational platform designed to introduce young learners to astronomy, space exploration and the exciting challenges of astronaut missions."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="panel group relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/35">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 font-heading text-sm font-semibold">{feature.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}