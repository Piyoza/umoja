import { AlertTriangle, Clock, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const clock = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safe / 60)).padStart(2, "0");
  const s = String(safe % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export default function MissionBar({ remaining, elapsed, severity, status, onPause, onResume, onRestart }) {
  const critical = remaining <= 60;
  return (
    <div className="panel flex flex-wrap items-center gap-4 p-4">
      <div className="flex items-center gap-2.5">
        <Clock className={cn("h-4 w-4", critical ? "text-red-400 animate-pulse-warn" : "text-primary")} />
        <div>
          <p className="eyebrow">Mission countdown</p>
          <p
            className={cn(
              "font-mono text-2xl font-semibold leading-none tabular-nums",
              critical ? "text-red-400" : "text-foreground",
            )}
          >
            {clock(remaining)}
          </p>
        </div>
      </div>

      <div className="min-w-[140px]">
        <p className="eyebrow">Elapsed</p>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">{clock(elapsed)}</p>
      </div>

      <div className="min-w-[190px] flex-1">
        <div className="flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5">
            <AlertTriangle className={cn("h-3 w-3", severity > 65 ? "text-red-400" : "text-amber-400")} />
            Emergency severity
          </p>
          <span className="font-mono text-xs text-muted-foreground">{severity}/100</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              severity > 65 ? "bg-red-500" : severity > 40 ? "bg-amber-500" : "bg-emerald-500",
            )}
            style={{ width: `${Math.max(2, severity)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === "paused" ? (
          <Button size="sm" variant="secondary" onClick={onResume}>
            <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={onPause} disabled={status !== "running"}>
            <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onRestart}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restart
        </Button>
      </div>
    </div>
  );
}