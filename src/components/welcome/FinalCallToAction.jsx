import { Link } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCallToAction() {
  return (
    <section className="relative overflow-hidden border-y border-primary/20">
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-heading text-2xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
          The universe is waiting. Are you ready?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Start your journey into space exploration and discover what it means to become a junior
          astronaut.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 uppercase tracking-[0.14em] shadow-[0_20px_60px_-18px_hsl(221_83%_53%/0.95)]"
        >
          <Link to="/login">
            <Rocket className="mr-1.5 h-4 w-4" />
            Enter the mission
          </Link>
        </Button>
      </div>
    </section>
  );
}