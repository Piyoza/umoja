import { Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3 } from "lucide-react";

export default function ProgressPanel({ percent = 0, stats = [], loading = false }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Your Progress</h3>
        </div>
        <Link to="/progress" className="text-[11px] text-muted-foreground hover:text-foreground">
          Details
        </Link>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold">{loading ? "—" : `${percent}%`}</span>
        <span className="text-xs text-muted-foreground">training complete</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700"
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/60 bg-background/40 p-2.5">
            <p className="font-heading text-lg font-semibold leading-none">{stat.value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <Link
        to="/progress"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Open progress dashboard <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}