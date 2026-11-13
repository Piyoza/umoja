import { cn } from "@/lib/utils";

const TONE = {
  ok: { bar: "bg-emerald-500", text: "text-emerald-400" },
  warn: { bar: "bg-amber-500", text: "text-amber-400" },
  danger: { bar: "bg-red-500", text: "text-red-400" },
};

function toneFor(metric, value) {
  if (metric.key === "temperature") {
    const [low, high] = metric.band;
    if (value < low - 6 || value > high + 8) return "danger";
    if (value < low || value > high) return "warn";
    return "ok";
  }
  if (value <= metric.safe) return "danger";
  if (value <= metric.safe * 1.25) return "warn";
  return "ok";
}

export default function TelemetryGauge({ metric, value, hidden = false }) {
  const tone = toneFor(metric, value);
  const colors = TONE[tone];
  const isTemperature = metric.key === "temperature";
  const percent = isTemperature ? Math.min(100, Math.max(0, ((value + 20) / 60) * 100)) : value;

  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {metric.label}
        </p>
        <span className={cn("font-mono text-sm font-semibold tabular-nums", hidden ? "text-muted-foreground" : colors.text)}>
          {hidden ? "—" : `${value.toFixed(isTemperature ? 1 : 0)}${metric.unit}`}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-700", hidden ? "bg-muted-foreground/40" : colors.bar)}
          style={{ width: `${Math.min(100, Math.max(3, percent))}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        {hidden ? "Sensor offline on this difficulty" : isTemperature ? "Safe band 18–26 °C" : `Minimum safe ${metric.safe}${metric.unit}`}
      </p>
    </div>
  );
}