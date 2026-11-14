import { BarChart3, BookOpen, Orbit, Siren, Sparkles, Trophy } from "lucide-react";
import SectionHeading from "@/components/welcome/SectionHeading";

const MODULES = [
  {
    tag: "Academy",
    title: "Learning Academy",
    description:
      "Structured lessons and knowledge checks covering astronomy, planets, spacecraft systems and the science behind space travel.",
    icon: BookOpen,
  },
  {
    tag: "AI guide",
    title: "ASTRA AI Instructor",
    description:
      "Ask questions in your own words and get clear explanations of scientific concepts from the onboard AI instructor.",
    icon: Sparkles,
  },
  {
    tag: "Simulator",
    title: "Space Emergency Simulator",
    description:
      "Work through simulated spacecraft emergencies with live telemetry, timed decisions and an instructor debrief at the end of every run.",
    icon: Siren,
  },
  {
    tag: "3D lab",
    title: "3D Solar System Explorer",
    description:
      "Orbit an interactive 3D solar system, open a planet's scientific profile and compare worlds side by side.",
    icon: Orbit,
  },
  {
    tag: "Tracker",
    title: "My Progress",
    description:
      "See the missions you have flown, planets you have explored and lessons you have completed, with your overall completion level.",
    icon: BarChart3,
  },
  {
    tag: "Badges",
    title: "Achievements",
    description:
      "Unlock mission badges as you complete lessons, landings and simulations, and collect them in your achievements panel.",
    icon: Trophy,
  },
];

export default function ExploreFeatures() {
  return (
    <section id="explore" className="relative scroll-mt-20 border-y border-border/30">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          kicker="Explore the platform"
          title="Six training modules, one mission station"
          description="Everything inside the trainee app, built around real space science and guided practice."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <article
              key={module.title}
              className="panel relative overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-transparent ring-1 ring-primary/30">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {module.tag}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold">{module.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{module.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}