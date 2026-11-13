import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { ACADEMY_MODULES, TOTAL_LESSONS } from "@/lib/academy-data";
import { loadTraineeStats } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/academy/")({
  component: AcademyPage,
  head: () => ({ meta: [{ title: "Learning Academy · Junior Astronaut Mission Trainer" }] }),
});

function AcademyPage() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    loadTraineeStats()
      .then((stats) => setCompleted(stats.lessonsList.map((lesson) => lesson.lesson_id)))
      .catch(() => setCompleted([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Learning academy</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Mission science, one lesson at a time</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          {completed.length} of {TOTAL_LESSONS} lessons complete. Every module links directly to the emergencies
          and exploration activities that use the same science.
        </p>
        <div className="mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700"
            style={{ width: `${Math.max(2, (completed.length / TOTAL_LESSONS) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ACADEMY_MODULES.map((module) => {
          const done = module.lessons.filter((lesson) => completed.includes(lesson.id)).length;
          return (
            <article key={module.id} className="flex flex-col rounded-2xl border border-border/80 bg-card/70 p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                  <BookOpen className="h-4 w-4 text-primary" />
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    done === module.lessons.length
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-border/70 text-muted-foreground",
                  )}
                >
                  {done}/{module.lessons.length}
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold leading-snug">{module.title}</h2>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{module.summary}</p>
              <div className="mt-3 space-y-1.5">
                {module.lessons.map((lesson) => {
                  const isDone = completed.includes(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      to="/academy/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/40 px-2.5 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <span className="flex items-center gap-1.5">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5" />
                        )}
                        {lesson.title}
                      </span>
                      <span className="shrink-0 text-[10px]">{lesson.minutes} min</span>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/academy/$lessonId"
                params={{ lessonId: module.lessons[0].id }}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                Start module <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}