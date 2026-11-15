
import { cn } from "@/lib/utils";

const TONE = {
  ok: { bar: "bg-emerald-500", text: "text-emerald-400", label: "Within training range" },
  warn: { bar: "bg-amber-500", text: "text-amber-400", label: "Needs attention" },
  danger: { bar: "bg-red-500", text: "text-red-400", label: "Outside training range" },
};

const EXPLANATIONS = {
  oxygen: "Shows the amount of oxygen available in the simulated cabin atmosphere. The crew needs oxygen to breathe.",
  pressure: "Shows the simulated cabin pressure. A spacecraft cabin needs controlled pressure to support the crew.",
  power: "Shows the electrical energy available to spacecraft systems such as life support, lighting and communication.",
  temperature: "Shows the cabin temperature. The environmental control system helps keep the cabin within a suitable range.",
  comms: "Shows the strength of the simulated communication link with mission control.",
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

  const percent = isTemperature
    ? Math.min(100, Math.max(0, ((value + 20) / 60) * 100))
    : value;

  const reference = isTemperature
    ? `Training reference band: ${metric.band[0]}–${metric.band[1]} °C`
    : `Training reference: ${metric.safe}${metric.unit} minimum`;

  return (
    <div
      className="rounded-xl border border-border/70 bg-background/50 p-3"
      aria-label={`${metric.label} telemetry`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {metric.label}
        </p>

        <span
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            hidden ? "text-muted-foreground" : colors.text,
          )}
        >
          {hidden ? "—" : `${value.toFixed(isTemperature ? 1 : 0)}${metric.unit}`}
        </span>
      </div>

      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="meter"
        aria-label={metric.label}
        aria-valuemin={isTemperature ? -20 : 0}
        aria-valuemax={isTemperature ? 40 : 100}
        aria-valuenow={hidden ? undefined : value}
        aria-valuetext={hidden ? "Sensor unavailable" : `${value.toFixed(isTemperature ? 1 : 0)} ${metric.unit}`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            hidden ? "bg-muted-foreground/40" : colors.bar,
          )}
          style={{ width: `${Math.min(100, Math.max(3, percent))}%` }}
        />
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        {EXPLANATIONS[metric.key] || "Monitors a spacecraft system during this training scenario."}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[9px] text-muted-foreground">
          {hidden ? "Sensor unavailable on this difficulty" : reference}
        </span>

        {!hidden && (
          <span className={cn("text-[9px] font-semibold", colors.text)}>
            {colors.label}
          </span>
        )}
      </div>

      <p className="mt-2 border-t border-border/50 pt-2 text-[9px] leading-relaxed text-muted-foreground">
        Training values are illustrative and are not real spacecraft safety limits.
      </p>
    </div>
  );
}
