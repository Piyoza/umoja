import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SolarNav from "@/components/solar/SolarNav";
import { LANDING_SITES } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/landing")({
  component: LandingPage,
  head: () => ({ meta: [{ title: "Landing Site Exploration · Junior Astronaut Mission Trainer" }] }),
});

const WORLDS = [
  { id: "mars", label: "Mars", accent: "text-orange-300" },
  { id: "moon", label: "The Moon", accent: "text-slate-200" },
];

function LandingPage() {
  const [world, setWorld] = useState("mars");
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const sites = LANDING_SITES[world];
  const site = sites.find((entry) => entry.id === choice);

  function submit() {
    if (!site) return;
    setSubmitted(true);
    recordExploration({
      itemType: "activity",
      itemId: `landing-${world}-${site.id}`,
      itemName: `Landing site: ${site.name}`,
      kind: "landing",
      score: site.best ? 100 : 70,
      detail: site.feedback,
    }).catch(() => {});
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Educational site selection</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Choose a landing site</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Examine candidate locations and pick the one you would choose for a first crewed landing. Weigh
          terrain, slope, temperature, scientific interest and hazards — then read the feedback.
        </p>
      </div>

      <SolarNav />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {WORLDS.map((entry) => (
            <button
              key={entry.id}
              onClick={() => {
                setWorld(entry.id);
                setChoice(null);
                setSubmitted(false);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                world === entry.id
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border/70 text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Educational exercise — not real mission planning
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {sites.map((entry) => (
          <button
            key={entry.id}
            onClick={() => {
              setChoice(entry.id);
              setSubmitted(false);
            }}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              choice === entry.id
                ? "border-primary/60 bg-primary/10"
                : "border-border/80 bg-card/70 hover:border-primary/40",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {entry.name}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{entry.region}</p>
              </div>
              {choice === entry.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <dt className="text-muted-foreground">Terrain slope</dt>
                <dd className="text-foreground">{entry.slope}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Temperature</dt>
                <dd className="text-foreground">{entry.temperature}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Scientific interest</dt>
                <dd className="text-foreground">{entry.science} / 5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Resources</dt>
                <dd className="text-foreground">{entry.resources}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Landing hazards</dt>
                <dd className="text-foreground">{entry.hazard}</dd>
              </div>
            </dl>
          </button>
        ))}
      </div>

      <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-xs text-muted-foreground">
          {site ? `Selected: ${site.name}. Confirm when you're ready for feedback.` : "Select a site to continue."}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={submit} disabled={!site || submitted}>
            {submitted ? "Choice recorded" : "Confirm landing choice"}
          </Button>
          {submitted && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setChoice(null);
              }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Try another
            </Button>
          )}
        </div>
      </div>

      {submitted && site && (
        <div
          className={cn(
            "panel border p-5",
            site.best ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5",
          )}
        >
          <p className={cn("text-sm font-semibold", site.best ? "text-emerald-300" : "text-amber-300")}>
            {site.best ? "Strong site selection" : "A reasonable site — with trade-offs"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{site.feedback}</p>
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            Real mission planners weigh engineering constraints, communications geometry, energy budget and
            planetary protection rules. This activity teaches the trade-offs, not the procedure.
          </p>
        </div>
      )}
    </div>
  );
}