import { useState } from "react";
import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUIZ } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function SolarQuiz() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);
  const question = QUIZ[index];
  const answered = choice !== null;

  function answer(optionIndex) {
    if (answered) return;
    setChoice(optionIndex);
    const correct = optionIndex === question.answer;
    if (correct) setScore((value) => value + 1);
    recordExploration({
      itemType: "activity",
      itemId: question.id,
      itemName: question.question,
      kind: "quiz",
      score: correct ? 100 : 0,
      detail: correct ? "Answered correctly" : "Answered incorrectly",
    }).catch(() => {});
  }

  function next() {
    if (index + 1 < QUIZ.length) {
      setIndex((value) => value + 1);
      setChoice(null);
    } else {
      setIndex(0);
      setChoice(null);
      setScore(0);
    }
  }

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Knowledge check</p>
          <h3 className="mt-1 text-sm font-semibold">Solar system activity</h3>
        </div>
        <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] text-muted-foreground">
          {index + 1} / {QUIZ.length} · {score} correct
        </span>
      </div>

      <p className="mt-3 text-sm text-foreground">{question.question}</p>

      <div className="mt-3 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === question.answer;
          const selected = choice === optionIndex;
          return (
            <button
              key={option}
              onClick={() => answer(optionIndex)}
              disabled={answered}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                !answered && "border-border/70 bg-background/40 hover:border-primary/50",
                answered && isCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
                answered && selected && !isCorrect && "border-red-500/50 bg-red-500/10 text-red-300",
                answered && !isCorrect && !selected && "border-border/50 bg-background/20 text-muted-foreground",
              )}
            >
              {option}
              {answered && isCorrect && <CheckCircle2 className="h-4 w-4" />}
              {answered && selected && !isCorrect && <XCircle className="h-4 w-4" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Lightbulb className="h-3.5 w-3.5" /> Why
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-foreground/80">{question.explanation}</p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={next}>
            {index + 1 < QUIZ.length ? "Next activity" : "Restart activities"}
          </Button>
        </div>
      )}
    </div>
  );
}