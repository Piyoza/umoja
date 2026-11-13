import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  DIFFICULTIES,
  applyOption,
  buildReport,
  createState,
  currentNode,
  severityOf,
  tick,
} from "@/lib/simulation/engine";

function reducer(state, action) {
  switch (action.type) {
    case "tick":
      return tick(state, action.scenario, action.diff);
    case "decide":
      return applyOption(state, action.scenario, action.optionId);
    case "hint":
      return { ...state, hintsUsed: state.hintsUsed + 1 };
    case "resume":
      return state.status === "paused" ? { ...state, status: "running" } : state;
    case "pause":
      return state.status === "running" ? { ...state, status: "paused" } : state;
    default:
      return state;
  }
}

export default function useSimulation(scenario, difficultyKey) {
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.beginner;
  const [state, dispatch] = useReducer(reducer, null, () => createState(scenario, diff.key));
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.status !== "running") return;
    timerRef.current = setInterval(() => dispatch({ type: "tick", scenario, diff }), 1000);
    return () => clearInterval(timerRef.current);
  }, [state.status, scenario, diff]);

  const decide = useCallback((optionId) => dispatch({ type: "decide", scenario, optionId }), [scenario]);
  const hint = useCallback(() => dispatch({ type: "hint" }), []);
  const pause = useCallback(() => dispatch({ type: "pause" }), []);
  const resume = useCallback(() => dispatch({ type: "resume" }), []);

  const node = useMemo(() => currentNode(state, scenario), [state, scenario]);
  const report = useMemo(
    () => (state.status === "ended" ? buildReport(state, scenario, diff.key) : null),
    [state, scenario, diff.key],
  );

  return {
    state,
    node,
    diff,
    report,
    severity: severityOf(state),
    secondsOnNode: state.elapsed - state.nodeEnteredAt,
    decide,
    hint,
    pause,
    resume,
    hintsLeft: diff.hintLimit === Infinity ? Infinity : Math.max(0, diff.hintLimit - state.hintsUsed),
  };
}