import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bot, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AstraChat from "@/components/astra/AstraChat";

export default function AstraDock() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mode = pathname.startsWith("/simulator")
    ? "simulator"
    : pathname.startsWith("/solar-system")
      ? "solar"
      : pathname.startsWith("/academy")
        ? "academy"
        : "general";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-14px_hsl(221_83%_53%)] transition-transform hover:scale-105"
      >
        <Bot className="h-4 w-4" /> Ask ASTRA
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col border-border bg-card sm:max-w-md">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2 text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </span>
              ASTRA · AI Instructor
            </SheetTitle>
            <SheetDescription className="text-xs">
              Your onboard instructor for emergencies, astronomy and mission science.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex-1 overflow-hidden">
            <AstraChat mode={mode} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}