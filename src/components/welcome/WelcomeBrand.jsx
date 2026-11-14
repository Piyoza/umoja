import { Rocket } from "lucide-react";

export default function WelcomeBrand() {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
        <Rocket className="h-5 w-5 text-primary" />
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground">
          Junior Astronaut
        </span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Mission Trainer</span>
      </span>
    </span>
  );
}