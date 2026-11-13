import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Info } from "lucide-react";
import AstraChat from "@/components/astra/AstraChat";
import DecisionLog from "@/components/simulator/DecisionLog";
import DecisionPanel from "@/components/simulator/DecisionPanel";
import MissionBar from "@/components/simulator/MissionBar";
import ReportView from "@/components/simulator/ReportView";
import TelemetryGauge from "@/components/simulator/TelemetryGauge";
import useSimulation from "@/hooks/useSimulation";
import { debriefSimulation } from "@/lib/server-fns";
import { DIFFICULTIES, METRICS } from "@/lib/simulation/engine";
import { recordAttempt } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function SimulatorRun({ scenario, initialDifficulty = "beginner" }) {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [runKey, setRunKey] = useState(0);

  return (
    <Session
      key={`${scenario.id}-${difficulty}-${runKey}`}
      scenario={scenario}
      difficulty={difficulty}
      onDifficulty={setDifficulty}
      onRestart={() => setRunKey((key) => key + 1)}
    />
  );
}

function Session({ scenario, difficulty, onDifficulty, onRestart }) {
  const { state, node, diff, report, severity, secondsOnNode, decide, pause, resume, hint, hintsLeft } =
    useSimulation(scenario, difficulty);
  const [aiDebrief, setAiDebrief] = useState(null);
  const [debriefLoading, setDebriefLoading] = useState(false);
  const savedRef = useRef(false);
  const runDebrief = useServerFn(debriefSimulation);

  useEffect(() => {
    if (!report || savedRef.current) return;
    savedRef.current = true;
    setDebriefLoading(true);
    (async () => {
      let text = "";
      try {
        const res = await runDebrief({
          data: {
            scenarioTitle: scenario.title,
            difficulty: report.difficulty,
            score: report.score,
            status: report.status,
            decisions: report.timeline.map((entry) => ({
              action: entry.action,
              quality: entry.quality,
              result: entry.result,
            })),
          },
        });
        setAiDebrief(res.debrief);
        const d = res.debrief || {};
        text = [d.analysis, ...(d.strengths || []), ...(d.improvements || [])].filter(Boolean).join("\n");
      } catch {
        setAiDebrief(null);
      } finally {
        setDebriefLoading(false);
      }
      await recordAttempt({ scenario, difficulty: diff.key, report, debrief: text });
    })();
  }, [report, scenario, diff.key, runDebrief]);

  const astraContext = [
    `Educational simulation: ${scenario.title} (${scenario.system}).`,
    `Difficulty: ${diff.label}. Mission time remaining: ${state.remaining}s.`,
    `Telemetry — oxygen ${state.metrics.oxygen.toFixed(0)}%, pressure ${state.metrics.pressure.toFixed(0)}%, power ${state.metrics.power.toFixed(0)}%, temperature ${state.metrics.temperature.toFixed(1)}°C, comms ${state.metrics.comms.toFixed(0)}%, crew safety ${state.crewSafety.toFixed(0)}%.`,
    node ? `Current decision point: ${node.title}. Options: ${node.options.map((o) => o.label).join(" / ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{scenario.code} · {scenario.system} · Educational simulation</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{scenario.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{scenario.objective}</p>
        </div>
        <div className="flex gap-1 rounded-full border border-border/70 bg-card/70 p-1">
          {Object.values(DIFFICULTIES).map((level) => (
            <button
              key={level.key}
              onClick={() => onDifficulty(level.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors",
                diff.key === level.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {report ? (
        <ReportView
          report={report}
          scenario={scenario}
          aiDebrief={aiDebrief}
          debriefLoading={debriefLoading}
          onRestart={onRestart}
        />
      ) : (
        <>
          <MissionBar
            remaining={state.remaining}
            elapsed={state.elapsed}
            severity={severity}
            status={state.status}
            onPause={pause}
            onResume={resume}
            onRestart={onRestart}
          />

          {severity > 55 && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
              <AlertTriangle className="h-3.5 w-3.5 animate-pulse-warn" />
              Master alarm active — emergency severity {severity}/100. Act now.
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
            <div className="space-y-4">
              <div className="panel p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Spacecraft control panel</h2>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Simulated telemetry
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {METRICS.map((metric) => (
                    <TelemetryGauge
                      key={metric.key}
                      metric={metric}
                      value={state.metrics[metric.key]}
                      hidden={diff.key === "advanced" && metric.key === "comms"}
                    />
                  ))}
                  <div className="rounded-xl border border-border/70 bg-background/50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Crew safety
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 font-mono text-sm font-semibold",
                        state.crewSafety > 75 ? "text-emerald-400" : state.crewSafety > 45 ? "text-amber-400" : "text-red-400",
                      )}
                    >
                      {Math.round(state.crewSafety)}%
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          state.crewSafety > 75 ? "bg-emerald-500" : state.crewSafety > 45 ? "bg-amber-500" : "bg-red-500",
                        )}
                        style={{ width: `${Math.max(3, state.crewSafety)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">3 crew aboard</p>
                  </div>
                </div>
                <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 h-3 w-3 shrink-0" />
                  Educational simulation with illustrative values — not official NASA procedures or real
                  spacecraft emergency instructions.
                </p>
              </div>

              {state.status === "paused" ? (
                <div className="panel p-8 text-center">
                  <p className="text-sm font-semibold">Simulation paused</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The emergency clock is stopped. Resume when you are ready.
                  </p>
                </div>
              ) : (
                <DecisionPanel
                  node={node}
                  onDecide={decide}
                  secondsOnNode={secondsOnNode}
                  window={diff.window}
                  onHint={hint}
                  hintsLeft={hintsLeft}
                  disabled={state.status !== "running"}
                />
              )}

              <DecisionLog log={state.log} />
            </div>

            <div className="space-y-4">
              <div className="panel p-4">
                <h2 className="text-sm font-semibold">ASTRA · Emergency instructor</h2>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Ask about the systems, request a hint, or explore the science. ASTRA will not reveal
                  answers unless you ask for a hint.
                </p>
                <div className="mt-3">
                  <AstraChat
                    mode="simulator"
                    context={astraContext}
                    compact
                    suggestions={["Explain what is happening", "Give me a hint", "Why does pressure behave this way?"]}
                  />
                </div>
              </div>

              <div className="panel p-4">
                <h2 className="text-sm font-semibold">Mission profile</h2>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{scenario.brief}</p>
                <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
                  <p>
                    <span className="text-foreground">Difficulty:</span> {diff.label}
                  </p>
                  <p>{diff.description}</p>
                  <p>
                    <span className="text-foreground">Decision window:</span> {diff.window}s before delays
                    add complications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}