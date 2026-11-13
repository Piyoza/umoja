import { ChevronDown, ChevronUp, Clock3, ClipboardList } from "lucide-react";
import { useState } from "react";

const QUALITY = {
  good: {
    label: "Effective",
    style: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  ok: {
    label: "Partly effective",
    style: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  poor: {
    label: "Ineffective",
    style: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

const METRIC_LABELS = {
  oxygen: "Oxygen",
  pressure: "Pressure",
  power: "Power",
  temperature: "Temperature",
  comms: "Communication",
};

export default function DecisionLog({ log = [] }) {
  const [expanded, setExpanded] = useState(false);
  const entries = Array.isArray(log) ? log : [];

  return (
    <section className="rounded-xl border border-border bg-card p-4 space-y-4">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2 font-semibold">
          <ClipboardList className="h-5 w-5 text-primary" />
          Decision Log
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {entries.length}
          </span>
        </span>
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {expanded && (
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your decisions will appear here as the mission progresses.
            </p>
          ) : (
            entries.map((entry, index) => {
              const quality = QUALITY[entry.quality] || {
                label: "Recorded",
                style: "bg-muted text-muted-foreground border-border",
              };

              return (
                <article
                  key={entry.index ?? index}
                  className="rounded-lg border border-border p-3 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {entry.index ?? index + 1}. {entry.nodeId || "Decision"}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs ${quality.style}`}
                    >
                      {quality.label}
                    </span>
                  </div>

                  <p className="text-sm font-medium">
                    {entry.optionLabel || "Decision recorded"}
                  </p>

                  {entry.consequence && (
                    <p className="text-sm text-muted-foreground">
                      {entry.consequence}
                    </p>
                  )}

                  {entry.effects && Object.keys(entry.effects).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(entry.effects).map(([key, value]) => (
                        <span
                          key={key}
                          className="rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {METRIC_LABELS[key] || key}:{" "}
                          {Number(value) > 0 ? "+" : ""}
                          {value}
                          {key === "temperature" ? "°C" : "%"}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    Mission time: T+{entry.at ?? 0}s
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}