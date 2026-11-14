import { Brain, Compass, Lightbulb, Rocket, Target, Telescope } from "lucide-react";
import SectionHeading from "@/components/welcome/SectionHeading";

const REASONS = [
  {
    title: "Scientific thinking",
    description: "Ask questions, form hypotheses and reason from evidence.",
    icon: Brain,
  },
  {
    title: "Critical thinking",
    description: "Weigh information about space and question what you read.",
    icon: Lightbulb,
  },
  {
    title: "Problem-solving",
    description: "Work through simulated failures and find a safe way forward.",
    icon: Target,
  },
  {
    title: "Astronomy knowledge",
    description: "Build a real understanding of planets, moons and orbits.",
    icon: Telescope,
  },
  {
    title: "Space exploration",
    description: "Follow how humans explore space and what missions involve.",
    icon: Rocket,
  },
  {
    title: "Decision-making",
    description: "Practise timed decisions with limited information.",
    icon: Compass,
  },
];

export default function WhyAstronaut() {
  return (
    <section className="relative border-y border-border/30">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          kicker="Why become a junior astronaut?"
          title="Skills that reach far beyond the launchpad"
          description="Astronaut training is really training in how to think — carefully, creatively and under pressure."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <article
              key={reason.title}
              className="group flex items-start gap-4 rounded-2xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                <reason.icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold">{reason.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{reason.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}