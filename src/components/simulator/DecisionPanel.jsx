import { useState } from "react";
import { ChevronRight, Lightbulb, Radio, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DecisionPanel({ node, onDecide, secondsOnNode, window, onHint, hintsLeft, disabled }) {
  const [hints, setHints] = useState({});
  const delayed = secondsOnNode > window;

  if (!node) return null;

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Decision point</p>
          <h3 className="mt-1 text-lg font-semibold">{node.title}</h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
            delayed
              ? "border-red-500/40 bg-red-500/10 text-red-400"
              : "border-border/70 bg-secondary/60 text-muted-foreground",
          )}
        >
          <Timer className="h-3 w-3" /> {secondsOnNode}s / {window}s window
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{node.brief}</p>
      {node.note && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-border/60 bg-background/50 p-2.5 font-mono text-[11px] text-cyan-300/90">
          <Radio className="mt-0.5 h-3 w-3 shrink-0" /> {node.note}
        </p>
      )}

      {delayed && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300">
          Decision delay detected — the emergency is degrading faster while you wait.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {node.options.map((option) => (
          <div key={option.id} className="rounded-xl border border-border/70 bg-background/40 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{option.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{option.detail}</p>
              </div>
              <Button size="sm" disabled={disabled} onClick={() => onDecide(option.id)} className="shrink-0">
                Execute <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
            {hints[option.id] && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-primary/10 p-2 text-[11px] leading-relaxed text-primary">
                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" /> {option.hint}
              </p>
            )}
            <button
              onClick={() => {
                setHints((all) => ({ ...all, [option.id]: !all[option.id] }));
                if (!hints[option.id]) onHint();
              }}
              disabled={hintsLeft <= 0}
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <Lightbulb className="h-3 w-3" />
              {hintsLeft <= 0 ? "No hints left on this difficulty" : hintsLeft === Infinity ? "Show hint" : `Show hint (${hintsLeft} left)`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}