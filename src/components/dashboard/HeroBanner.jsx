import { Link } from "@tanstack/react-router";
import { ArrowRight, Orbit, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

const HERO = "https://media.base44.com/images/public/6af6deaf5e5d3e920213d9ee/8451f2b42_generated_image.png";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-border/70">
      <Image
        src={HERO}
        alt="Junior astronaut floating above Earth in orbit"
        className="h-[420px] w-full sm:h-[460px]"
        fittingType="fill"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05080d]/95 via-[#05080d]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080d]/80 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3 w-3" /> Training Cycle 04 · Active
        </span>
        <h1 className="max-w-xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          Train. Play. Explore.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          Your journey to becoming a junior astronaut starts here. Fly real emergencies, walk the
          surface of Mars and learn the science behind every mission.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-6 font-semibold">
            <Link to="/simulator">
              Start a Mission <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/15 hover:text-white"
          >
            <Link to="/solar-system">
              <Orbit className="mr-2 h-4 w-4" /> Solar System
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}