
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AstraChat from "@/components/astra/AstraChat";
import { ALL_LESSONS, getLesson, getModule } from "@/lib/academy-data";
import { recordLesson } from "@/lib/progress";
import BodyInSpace3D from "@/components/academy/BodyInSpace3D";


export const Route = createFileRoute("/_authed/academy/$lessonId")({
  component: LessonPage,
  head: () => ({
    meta: [{ title: "Lesson · Junior Astronaut Mission Trainer" }],
  }),
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const lesson = getLesson(lessonId);

  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!lesson) {
    return (
      <div className="panel p-8 text-center">
        <h1 className="text-lg font-semibold">Lesson not found</h1>
        <Button asChild className="mt-4">
          <Link to="/academy">Back to the Academy</Link>
        </Button>
      </div>
    );
  }

  const module = getModule(lesson.moduleId);
  const index = ALL_LESSONS.findIndex((entry) => entry.id === lesson.id);
  const next = ALL_LESSONS[index + 1];

  async function complete() {
    if (done || saving) return;

    setSaving(true);

    try {
      await recordLesson({
        moduleId: lesson.moduleId,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      });
      setDone(true);
    } catch (error) {
      console.error("Could not record lesson completion:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0 space-y-4">
      <Link
        to="/academy"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Learning Academy
      </Link>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article className="panel p-6">
          <p className="eyebrow">{module?.title}</p>
          <h1 className="mt-1 text-2xl font-semibold">{lesson.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" /> {lesson.minutes} minute lesson
          </p>

          <div className="mt-4 space-y-3">
            {lesson.body.map((paragraph, index_) => (
              <p key={index_} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        {lesson.component === "BodyInSpace3D" && (
  <div className="mt-6 w-full">
    <BodyInSpace3D />
  </div>
)}

          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/10 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              <BookOpen className="h-3.5 w-3.5" /> Key points
            </p>
            <ul className="mt-2 space-y-1.5">
              {lesson.keyPoints.map((point) => (
                <li key={point} className="text-xs leading-relaxed text-foreground/85">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button onClick={complete} disabled={done || saving}>
              {done || saving ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Lesson complete
                </>
              ) : (
                "Mark lesson complete"
              )}
            </Button>
            {next && (
              <Button
                variant="secondary"
                onClick={() => {
                  setDone(false);
                  navigate({ to: "/academy/$lessonId", params: { lessonId: next.id } });
                }}
              >
                Next: {next.title} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </article>

        <div className="panel h-fit p-5">
          <h2 className="text-sm font-semibold">Ask ASTRA about this lesson</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Your AI instructor can explain any part of this lesson with a worked example.
          </p>
          <div className="mt-3">
            <AstraChat
              mode="academy"
              context={`Lesson: ${lesson.title}. Module: ${module?.title}. Key points: ${lesson.keyPoints.join(" ")}`}
              compact
              suggestions={["Explain this simply", "Give me an example", "How does this apply in space?"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
