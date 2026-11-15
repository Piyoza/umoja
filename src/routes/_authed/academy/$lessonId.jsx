
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  PlayCircle,
  Telescope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ALL_LESSONS,
  getLesson,
  getModule,
  getModuleResources,
} from "@/lib/academy-data";
import { recordLesson } from "@/lib/progress";
import BodyInSpace3D from "@/components/academy/BodyInSpace3D";

export const Route = createFileRoute("/_authed/academy/$lessonId")({
  component: LessonPage,
  head: () => ({
    meta: [{ title: "Lesson · Junior Astronaut Mission Trainer" }],
  }),
});

const RESOURCE_GROUPS = [
  {
    title: "Watch and learn",
    description: "Videos and visual explanations to help you understand the topic.",
    types: ["video"],
    icon: PlayCircle,
  },
  {
    title: "Read and discover",
    description: "Articles and reference documents for deeper learning.",
    types: ["pdf", "article"],
    icon: FileText,
  },
  {
    title: "Explore real data",
    description: "Discover scientific information and resources used by researchers.",
    types: ["data", "library"],
    icon: Telescope,
  },
  {
    title: "Try an activity",
    description: "Put your knowledge into practice with learning activities.",
    types: ["activity", "lesson"],
    icon: GraduationCap,
  },
];

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
  const resources = getModuleResources(lesson.moduleId) || [];
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
    <div className="min-w-0 space-y-5">
      <Link
        to="/academy"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Learning Academy
      </Link>

      <article className="panel p-6">
        <p className="eyebrow">{module?.title}</p>

        <h1 className="mt-1 text-2xl font-semibold">
          {lesson.title}
        </h1>

        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {lesson.minutes} minute lesson
        </p>

        <div className="mt-5 space-y-3">
          {lesson.body.map((paragraph, index_) => (
            <p
              key={index_}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {lesson.component === "BodyInSpace3D" && (
          <div className="mt-6 w-full">
            <BodyInSpace3D />
          </div>
        )}

        <div className="mt-6 rounded-xl border border-primary/25 bg-primary/10 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Key points
          </p>

          <ul className="mt-2 space-y-1.5">
            {lesson.keyPoints.map((point) => (
              <li
                key={point}
                className="text-xs leading-relaxed text-foreground/85"
              >
                • {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button onClick={complete} disabled={done || saving}>
            {saving ? (
              "Saving progress..."
            ) : done ? (
              <>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Lesson complete
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
                navigate({
                  to: "/academy/$lessonId",
                  params: { lessonId: next.id },
                });
              }}
            >
              Next: {next.title}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </article>

      {resources.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="eyebrow">Continue your discovery</p>
            <h2 className="mt-1 text-xl font-semibold">
              NASA learning resources
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Explore additional videos, articles, activities and scientific
              resources related to this module.
            </p>
          </div>

          {RESOURCE_GROUPS.map((group) => {
            const groupResources = resources.filter((resource) =>
              group.types.includes(resource.type?.toLowerCase())
            );

            if (groupResources.length === 0) return null;

            const GroupIcon = group.icon;

            return (
              <div key={group.title} className="space-y-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <GroupIcon className="h-4 w-4 text-primary" />
                    {group.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {groupResources.map((resource) => (
                    <article
                      key={resource.id}
                      className="flex flex-col rounded-xl border border-border/70 bg-card/60 p-4"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold leading-snug">
                          {resource.title}
                        </h4>

                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {resource.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                          {resource.source && (
                            <span className="rounded-full border border-border/70 px-2 py-1">
                              {resource.source}
                            </span>
                          )}

                          {resource.audience && (
                            <span className="rounded-full border border-border/70 px-2 py-1">
                              {resource.audience}
                            </span>
                          )}
                        </div>
                      </div>

                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          Explore resource
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
        External learning resources are provided for educational purposes.
        Junior Astronaut Mission Trainer is not affiliated with or endorsed by NASA.
      </p>
    </div>
  );
}
