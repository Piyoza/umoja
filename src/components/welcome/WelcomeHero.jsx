import { Link } from "@tanstack/react-router";
import { ArrowRight, Orbit, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/9b76d48f1_generated_image.png";

export default function WelcomeHero({ onExplore }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Orbit className="h-3 w-3" />
            Junior Astronaut Mission Trainer
          </span>

          <h1 className="mt-5 font-heading text-[2rem] font-bold uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Your journey to the <span className="text-primary">stars</span> starts here
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Discover the universe, explore the science of space, experience astronaut missions and
            develop the skills needed to think like a junior astronaut.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="uppercase tracking-[0.12em] shadow-[0_18px_50px_-18px_hsl(221_83%_53%/0.95)]">
              <Link to="/login">
                <Rocket className="mr-1.5 h-4 w-4" />
                Begin your journey
              </Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={onExplore}
              className="uppercase tracking-[0.12em]"
            >
              Explore the platform
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>Learning Academy</span>
            <span className="hidden h-1 w-1 rounded-full bg-primary/60 sm:block" />
            <span>ASTRA AI instructor</span>
            <span className="hidden h-1 w-1 rounded-full bg-primary/60 sm:block" />
            <span>Mission simulator</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/25 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/25 bg-card/60 shadow-[0_40px_100px_-40px_hsl(221_83%_53%/0.85)]">
            <Image
              src={HERO_IMAGE}
              alt="Earth seen from orbit with an astronaut and spacecraft among the stars"
              className="h-[280px] w-full sm:h-[380px] lg:h-[440px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-warn" />
              Low Earth orbit · Training station
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}