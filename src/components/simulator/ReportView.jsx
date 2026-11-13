import { Link } from "@tanstack/react-router";
import { Award, BookOpen, CheckCircle2, Gauge, Lightbulb, Loader2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getModule } from "@/lib/academy-data";
import { METRICS, QUALITY_LABEL } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";

const TONE = { good: "text-emerald-400", ok: "text-amber-400", poor: "text-red-400" };

function List({ title, items, icon: Icon, tone = "text-muted-foreground", empty }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
        <Icon className="h-3.5 w-3.5" /> {title}
      </p>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => (
            <li key={index} className={cn("text-xs leading-relaxed", tone)}>
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReportView({ report, scenario, aiDebrief, debriefLoading, onRestart }) {
  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-background/50 px-8 py-6">
            <p className="eyebrow">Performance score</p>
            <p className="font-heading text-5xl font-bold leading-none">{report.score}</p>
            <p className="mt-1 text-xs text-muted-foreground">out of 100</p>
            <span className="mt-3 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              {report.grade}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                  report.status === "stabilised"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : report.status === "partial"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300",
                )}
              >
                {report.statusLabel}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {report.difficulty} · {Math.round(report.durationSeconds / 60)} min {report.durationSeconds % 60}s
                elapsed · severity {report.severity}/100
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold">{report.headline}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {scenario.title} — educational debrief for a simulated emergency. Scores reflect the training
              criteria for this scenario, not real operational performance.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {METRICS.map((metric) => (
                <div key={metric.key} className="rounded-lg border border-border/60 bg-background/40 p-2">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{metric.label}</p>
                  <p className="font-mono text-sm text-foreground">
                    {Number(report.metrics[metric.key]).toFixed(metric.key === "temperature" ? 1 : 0)}
                    {metric.unit}
                  </p>
                </div>
              ))}
              <div className="rounded-lg border border-border/60 bg-background/40 p-2">
                <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Crew safety</p>
                <p className="font-mono text-sm text-foreground">{report.crewSafety}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> ASTRA debrief
          {debriefLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
        </p>
        {aiDebrief ? (
          <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>{aiDebrief.analysis}</p>
            {aiDebrief.next_steps?.length > 0 && (
              <p>
                <span className="text-foreground">Recommended next training:</span> {aiDebrief.next_steps.join(" · ")}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {debriefLoading
              ? "ASTRA is reviewing your decision timeline…"
              : "The structured report below is generated from your decision timeline."}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <List
          title="What you did correctly"
          icon={CheckCircle2}
          items={report.strengths}
          tone="text-emerald-300"
          empty="No fully effective decisions in this run — the debrief below explains what to try instead."
        />
        <List
          title="What could be improved"
          icon={XCircle}
          items={report.corrections}
          tone="text-red-300"
          empty="No ineffective decisions were recorded."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <List title="Areas requiring improvement" icon={Gauge} items={report.improvements} tone="text-amber-200" empty="—" />
        <List title="The science behind this emergency" icon={BookOpen} items={report.principles} tone="text-muted-foreground" empty="—" />
      </div>

      <div className="panel p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-amber-400" /> Recommended learning modules
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {report.recommendations.map((moduleId) => {
            const module = getModule(moduleId);
            if (!module) return null;
            return (
              <Button key={moduleId} asChild size="sm" variant="secondary">
                <Link to="/academy/$lessonId" params={{ lessonId: module.lessons[0].id }}>
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" /> {module.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="panel p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Award className="h-4 w-4 text-primary" /> Decision timeline
        </p>
        <ol className="mt-3 space-y-2">
          {report.timeline.length === 0 && (
            <li className="text-xs text-muted-foreground">No decisions were made before the simulation ended.</li>
          )}
          {report.timeline.map((entry, index) => (
            <li key={index} className="rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">{entry.action}</p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {entry.time} · {entry.title}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{entry.result}</p>
              <p className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.1em]", TONE[entry.quality])}>
                {QUALITY_LABEL[entry.quality]}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onRestart}>
          <RotateCcw className="mr-1.5 h-4 w-4" /> Run this simulation again
        </Button>
        <Button asChild variant="outline">
          <Link to="/simulator">Back to emergency simulator</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/progress">View my progress</Link>
        </Button>
      </div>
    </div>
  );
}