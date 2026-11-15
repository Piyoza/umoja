
import { useState } from "react";
import { ChevronRight, Lightbulb, Radio, Timer, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DecisionPanel({
  node,
  onDecide,
  secondsOnNode,
  window,
  onHint,
  hintsLeft,
  disabled,
}) {
  const [revealedHints, setRevealedHints] = useState({});
  const [openHints, setOpenHints] = useState({});
  const delayed = secondsOnNode > window;

  if (!node) return null;

  const toggleHint = (optionId) => {
    const alreadyRevealed = revealedHints[optionId];

    if (!alreadyRevealed && hintsLeft <= 0) return;

    if (!alreadyRevealed) {
      setRevealedHints((all) => ({ ...all, [optionId]: true }));
      onHint?.();
    }

    setOpenHints((all) => ({
      ...all,
      [optionId]: !all[optionId],
    }));
  };

  return (
    <div className="panel p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Your next mission decision</p>
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
          <Timer className="h-3 w-3" />
          {secondsOnNode}s / {window}s
        </span>
      </div>

      <div className="rounded-xl border border-border/70 bg-background/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          Situation
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {node.brief}
        </p>
      </div>

      {node.note && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
            <Radio className="h-3.5 w-3.5" />
            Telemetry clue
          </p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-cyan-200/90">
            {node.note}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Brain className="h-4 w-4 text-primary" />
          Think it through
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Look at the situation and telemetry. What system needs attention?
          Which action could protect the crew and help stabilise the spacecraft?
        </p>
      </div>

      {delayed && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300">
          Decision delay detected. In this educational simulation, waiting
          allows the emergency conditions to worsen.
        </p>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Choose your action
        </p>

        {node.options.map((option) => {
          const hintRevealed = Boolean(revealedHints[option.id]);
          const hintOpen = Boolean(openHints[option.id]);

          return (
            <div
              key={option.id}
              className="rounded-xl border border-border/70 bg-background/40 p-3"
            >
              <p className="text-sm font-medium text-foreground">
                {option.label}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {option.detail}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleHint(option.id)}
                  disabled={disabled || (!hintRevealed && hintsLeft <= 0)}
                  aria-expanded={hintOpen}
                  className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {hintOpen
                    ? "Hide learning hint"
                    : hintRevealed
                      ? "Show learning hint again"
                      : hintsLeft === Infinity
                        ? "Need a hint?"
                        : hintsLeft > 0
                          ? `Need a hint? (${hintsLeft} left)`
                          : "No hints left"}
                </button>

                <Button
                  size="sm"
                  disabled={disabled}
                  onClick={() => onDecide(option.id)}
                  className="shrink-0"
                >
                  Choose action
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>

              {hintOpen && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
                      ASTRA learning hint
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-foreground">
                      {option.hint || "Review the telemetry and consider how this action affects the spacecraft systems and crew."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
