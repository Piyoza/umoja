export const DIFFICULTIES = {
  beginner: {
    key: "beginner",
    label: "Beginner",
    drift: 0.65,
    hintLimit: Infinity,
    window: 65,
    margin: 6,
    description: "Guided scenario. Slower system drift, hints always available, generous decision window.",
  },
  intermediate: {
    key: "intermediate",
    label: "Intermediate",
    drift: 1,
    hintLimit: 3,
    window: 42,
    margin: 0,
    description: "Limited guidance. Three hints per run and a tighter decision window.",
  },
  advanced: {
    key: "advanced",
    label: "Advanced",
    drift: 1.35,
    hintLimit: 1,
    window: 26,
    margin: -4,
    description: "Fast drift, one hint, short decision window and compounding complications.",
  },
};

export const METRICS = [
  { key: "oxygen", label: "Cabin Oxygen", unit: "%", safe: 18, ceiling: 100 },
  { key: "pressure", label: "Cabin Pressure", unit: "%", safe: 80, ceiling: 100 },
  { key: "power", label: "Electrical Power", unit: "%", safe: 30, ceiling: 100 },
  { key: "temperature", label: "Cabin Temperature", unit: "°C", safe: 18, ceiling: 30, band: [18, 26] },
  { key: "comms", label: "Comm Link", unit: "%", safe: 40, ceiling: 100 },
];

export const QUALITY_SCORE = { good: 0, ok: 11, poor: 24 };
export const QUALITY_LABEL = { good: "Effective", ok: "Partly effective", poor: "Ineffective" };

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function createState(scenario, difficultyKey = "beginner") {
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.beginner;
  const metrics = {};
  for (const metric of METRICS) {
    const base = scenario.start?.[metric.key] ?? 90;
    const margin = metric.key === "temperature" ? 0 : diff.margin;
    metrics[metric.key] = clamp(base + margin);
  }
  return {
    scenarioId: scenario.id,
    status: "running",
    elapsed: 0,
    remaining: scenario.duration,
    metrics,
    severityBias: Math.round((scenario.startSeverity ?? 20) * 0.45),
    crewSafety: 100,
    nodeId: scenario.startNode,
    nodeEnteredAt: 0,
    log: [],
    hintsUsed: 0,
    notes: [],
    endedReason: null,
    finalOutcome: null,
  };
}

export function severityOf(state) {
  const m = state.metrics;
  const risk =
    Math.max(0, 60 - m.oxygen) / 60 +
    Math.max(0, 70 - m.pressure) / 70 +
    Math.max(0, 45 - m.power) / 45 +
    Math.max(0, 45 - m.comms) / 45 +
    Math.max(0, Math.abs(m.temperature - 21) - 4) / 12;
  return Math.round(clamp(risk * 42 + state.severityBias + 6));
}

export function tick(state, scenario, diff) {
  if (state.status !== "running") return state;
  const delayed = state.elapsed - state.nodeEnteredAt > diff.window;
  const factor = diff.drift * (delayed ? 1.3 : 1);
  const metrics = { ...state.metrics };
  for (const [key, rate] of Object.entries(scenario.drift || {})) {
    if (key in metrics) metrics[key] = clamp(Number((metrics[key] + rate * factor).toFixed(2)));
  }
  const stress =
    Math.max(0, 55 - metrics.oxygen) * 0.05 +
    Math.max(0, 50 - metrics.pressure) * 0.05 +
    Math.max(0, Math.abs(metrics.temperature - 21) - 8) * 0.35;
  const crewSafety = clamp(Number((state.crewSafety - stress * diff.drift).toFixed(2)));
  const remaining = Math.max(0, state.remaining - 1);
  let status = "running";
  let endedReason = state.endedReason;
  if (metrics.oxygen <= 0 || metrics.pressure <= 0 || crewSafety <= 0) {
    status = "ended";
    endedReason = "failure";
  } else if (remaining <= 0) {
    status = "ended";
    endedReason = "timeout";
  }
  return { ...state, metrics, crewSafety, remaining, elapsed: state.elapsed + 1, status, endedReason };
}

export function currentNode(state, scenario) {
  return scenario.nodes?.[state.nodeId] || null;
}

export function applyOption(state, scenario, optionId) {
  const node = currentNode(state, scenario);
  const option = node?.options.find((o) => o.id === optionId);
  if (!node || !option || state.status !== "running") return state;

  const metrics = { ...state.metrics };
  for (const [key, delta] of Object.entries(option.effects || {})) {
    if (key in metrics) metrics[key] = clamp(Number((metrics[key] + delta).toFixed(2)));
  }

  const log = [
    ...state.log,
    {
      index: state.log.length + 1,
      at: state.elapsed,
      nodeId: node.title,
      optionLabel: option.label,
      quality: option.quality,
      consequence: option.consequence || "",
      effects: option.effects || {},
    },
  ];

  const ended = !option.next;
  const nextState = {
    ...state,
    metrics,
    log,
    severityBias: clamp(state.severityBias + (option.severity || 0), -45, 70),
    nodeId: option.next || state.nodeId,
    nodeEnteredAt: state.elapsed,
    status: ended ? "ended" : "running",
    endedReason: ended ? "resolved" : state.endedReason,
    finalOutcome: ended ? option.ending || { status: "partial", summary: option.consequence } : null,
  };

  return nextState;
}

export function outcomeLabel(state) {
  if (state.endedReason === "timeout") return { status: "timeout", label: "Time expired" };
  if (state.endedReason === "failure") return { status: "critical", label: "Mission failure" };
  const status = state.finalOutcome?.status || "partial";
  const labels = {
    stabilised: "Emergency stabilised",
    partial: "Partially resolved",
    critical: "Critical outcome",
  };
  return { status, label: labels[status] || "Simulation ended" };
}

export function buildReport(state, scenario, difficultyKey) {
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.beginner;
  const m = state.metrics;
  const outcome = outcomeLabel(state);

  let score = 100;
  for (const entry of state.log) score -= QUALITY_SCORE[entry.quality] ?? 0;
  score -= state.hintsUsed * 2;
  score -= Math.max(0, 18 - m.oxygen) * 1.2;
  score -= Math.max(0, 80 - m.pressure) * 0.55;
  score -= Math.max(0, 30 - m.power) * 0.5;
  score -= Math.max(0, 40 - m.comms) * 0.35;
  score -= (100 - state.crewSafety) * 0.22;
  if (state.endedReason === "timeout") score -= 16;
  if (outcome.status === "stabilised") score += 4;
  score = Math.round(clamp(score));

  const grade =
    score >= 90
      ? "Mission Commander"
      : score >= 75
        ? "Flight Engineer"
        : score >= 60
          ? "Mission Cadet"
          : "Needs Review";

  const good = state.log.filter((entry) => entry.quality === "good");
  const weak = state.log.filter((entry) => entry.quality === "poor");
  const partial = state.log.filter((entry) => entry.quality === "ok");

  const strengths = good.map((entry) => `${entry.optionLabel} — ${entry.consequence}`);
  const corrections = weak.map((entry) => `${entry.optionLabel} — ${entry.consequence}`);
  const consequences = state.log.map(
    (entry) => `T+${entry.at}s · ${entry.optionLabel}: ${entry.consequence}`,
  );

  const improvements = [];
  if (weak.length) {
    improvements.push(
      `${weak.length} decision${weak.length > 1 ? "s" : ""} made the emergency harder to resolve. Re-read the telemetry before acting.`,
    );
  }
  if (state.endedReason === "timeout") {
    improvements.push(`You ran out of time — the decision window on ${diff.label} is ${diff.window}s per decision.`);
  }
  if (m.oxygen < 30) improvements.push("Cabin oxygen was left near the safety limit: prioritise the crew's breathing gas earlier.");
  if (m.pressure < 85) improvements.push("Pressure control needs work — isolate before you add gas.");
  if (m.power < 45) improvements.push("Power management is a weak point: shed non-essential loads early.");
  if (m.comms < 55) improvements.push("Keep a communication path open so the ground team can help.");
  if (state.crewSafety < 80) improvements.push("Crew safety dropped. Treat crew protection as the first priority in every emergency.");
  if (!improvements.length) improvements.push("Strong run. Repeat it at a higher difficulty to sharpen the same skills.");

  return {
    score,
    grade,
    status: outcome.status,
    statusLabel: outcome.label,
    severity: severityOf(state),
    metrics: m,
    crewSafety: Math.round(state.crewSafety),
    durationSeconds: state.elapsed,
    difficulty: diff.label,
    headline:
      outcome.status === "stabilised"
        ? `You stabilised the ${scenario.title.toLowerCase()}.`
        : `The simulation ended: ${outcome.label.toLowerCase()}.`,
    strengths,
    corrections,
    partial,
    consequences,
    improvements,
    principles: scenario.principles,
    recommendations: scenario.recommendedModules,
    timeline: state.log.map((entry) => ({
      time: `T+${entry.at}s`,
      title: entry.nodeId,
      action: entry.optionLabel,
      quality: entry.quality,
      result: entry.consequence,
    })),
  };
}
