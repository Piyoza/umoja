import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import WelcomeBrand from "@/components/welcome/WelcomeBrand";

export default function InfoPage({ kicker, title, intro, sections }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/welcome" aria-label="Junior Astronaut Mission Trainer home">
            <WelcomeBrand />
          </Link>
          <Link
            to="/welcome"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="eyebrow">{kicker}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <section key={section.heading} className="panel p-5">
              <h2 className="font-heading text-sm font-semibold">{section.heading}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}