import { BarChart3, BookOpen, LogIn, Rocket, Sparkles } from "lucide-react";
import SectionHeading from "@/components/welcome/SectionHeading";

const STEPS = [
  { title: "Access Your Mission", description: "Log in to your trainee account.", icon: LogIn },
  {
    title: "Meet ASTRA",
    description: "Discover your AI instructor and learn how to use the platform.",
    icon: Sparkles,
  },
  {
    title: "Enter the Learning Academy",
    description: "Explore educational space science modules.",
    icon: BookOpen,
  },
  {
    title: "Experience Space Exploration",
    description: "Discover interactive space experiences and educational simulations.",
    icon: Rocket,
  },
  {
    title: "Track Your Progress",
    description: "Monitor your learning journey and achievements.",
    icon: BarChart3,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        kicker="How it works"
        title="Five steps from cadet to junior astronaut"
        description="A guided path through the training station, one mission stage at a time."
        align="center"
      />

      <ol className="relative mt-12 space-y-4 lg:grid lg:grid-cols-5 lg:gap-4 lg:space-y-0">
        <div className="pointer-events-none absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 lg:block" />
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 lg:block">
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background shadow-[0_0_30px_-8px_hsl(221_83%_53%/0.9)]">
              <step.icon className="h-5 w-5 text-primary" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {index + 1}
              </span>
            </div>
            <div className="panel flex-1 p-4 lg:mt-4">
              <h3 className="font-heading text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}