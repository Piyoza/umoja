
import { AlertTriangle, Clock, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const clock = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
};

function severityStatus(severity) {
  if (severity > 65) {
    return {
      label: "High",
      description: "The simulated emergency needs urgent attention.",
      color: "text-red-400",
      bar: "bg-red-500",
    };
  }

  if (severity > 40) {
    return {
      label: "Elevated",
      description: "Some spacecraft systems need attention.",
      color: "text-amber-400",
      bar: "bg-amber-500",
    };
  }

  return {
    label: "Low",
    description: "The simulated emergency is currently less severe.",
    color: "text-emerald-400",
    bar: "bg-emerald-500",
  };
}

export default function MissionBar({
  remaining,
  elapsed,
  severity,
  status,
  onPause,
  onResume,
  onRestart,
}) {
  const critical = remaining <= 60;
  const severityInfo = severityStatus(severity);

  return (
    <div className="panel flex flex-wrap items-center gap-4 p-4">
      <div className="flex items-center gap-2.5">
        <Clock
          className={cn(
            "h-4 w-4",
            critical ? "text-red-400 animate-pulse-warn" : "text-primary",
          )}
        />
        <div>
          <p className="eyebrow">Time remaining</p>
          <p
            className={cn(
              "font-mono text-2xl font-semibold leading-none tabular-nums",
              critical ? "text-red-400" : "text-foreground",
            )}
            aria-live="off"
          >
            {clock(remaining)}
          </p>
          {critical && (
            <p className="mt-1 text-[10px] text-red-400">
              Less than one minute remaining
            </p>
          )}
        </div>
      </div>

      <div className="min-w-[110px]">
        <p className="eyebrow">Mission elapsed</p>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">
          {clock(elapsed)}
        </p>
      </div>

      <div className="min-w-[190px] flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow flex items-center gap-1.5">
            <AlertTriangle
              className={cn("h-3 w-3", severityInfo.color)}
            />
            Emergency severity
          </p>

          <span className={cn("text-xs font-semibold", severityInfo.color)}>
            {severityInfo.label} · {severity}/100
          </span>
        </div>

        <div
          className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary"
          role="meter"
          aria-label="Simulated emergency severity"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={severity}
          aria-valuetext={`${severityInfo.label}, ${severity} out of 100`}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              severityInfo.bar,
            )}
            style={{ width: `${Math.max(0, Math.min(100, severity))}%` }}
          />
        </div>

        <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
          {severityInfo.description}
        </p>
        <p className="mt-1 text-[9px] text-muted-foreground">
          Illustrative training indicator, not a real spacecraft measurement.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {status === "paused" ? (
          <Button size="sm" variant="secondary" onClick={onResume}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Resume
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={onPause}
            disabled={status !== "running"}
          >
            <Pause className="mr-1.5 h-3.5 w-3.5" />
            Pause
          </Button>
        )}

        <Button size="sm" variant="outline" onClick={onRestart}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Restart
        </Button>
      </div>
    </div>
  );
}
