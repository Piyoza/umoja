
import { useState } from "react";
import { Menu } from "lucide-react";
import AstraDock from "@/components/astra/AstraDock";
import Sidebar from "@/components/layout/Sidebar";
import UserMenu from "@/components/layout/UserMenu";
import { useAuth } from "@/lib/AuthContext";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();

  const preferences = profile?.preferences ?? {};

  return (
    <div
      className="min-h-screen"
      data-high-contrast={String(!!preferences.highContrast)}
      data-reduced-motion={String(!!preferences.reducedMotion)}
      data-plain-language={String(!!preferences.plainLanguage)}
      data-captions-enabled={String(!!preferences.captions)}
      data-audio-narration={String(!!preferences.audioNarration)}
      data-sound-effects={String(!!preferences.soundEffects)}
      data-haptic-feedback={String(!!preferences.hapticFeedback)}
    >
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-border/70 p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <p className="hidden text-xs uppercase tracking-[0.22em] text-muted-foreground md:block">
              Mission Control · Orbital Training Station
            </p>

            <div className="ml-auto flex items-center gap-2">
              <UserMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <AstraDock />
    </div>
  );
}
