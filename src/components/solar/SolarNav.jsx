import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Globe2, Layers, Mountain, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export const SOLAR_SECTIONS = [
  { to: "/solar-system", label: "3D Explorer", icon: Globe2 },
  { to: "/solar-system/compare", label: "Compare", icon: Layers },
  { to: "/solar-system/gravity", label: "Gravity Lab", icon: Compass },
  { to: "/solar-system/objects", label: "Moons & Objects", icon: Rocket },
  { to: "/solar-system/surfaces", label: "Surface Explorer", icon: Mountain },
  { to: "/solar-system/landing", label: "Landing Sites", icon: Rocket },
];

export default function SolarNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {SOLAR_SECTIONS.map((section) => {
        const active = pathname === section.to;
        return (
          <Link
            key={section.to}
            to={section.to}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
              active
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <section.icon className="h-3.5 w-3.5" />
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}