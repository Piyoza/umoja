import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WelcomeBrand from "@/components/welcome/WelcomeBrand";

const LINKS = [
  { label: "Home", target: "top" },
  { label: "About", target: "about" },
  { label: "How It Works", target: "how-it-works" },
  { label: "Explore Training", target: "explore" },
];

export default function WelcomeNav({ onNavigate }) {
  const [open, setOpen] = useState(false);

  const go = (target) => {
    setOpen(false);
    onNavigate(target);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button type="button" onClick={() => go("top")} aria-label="Junior Astronaut Mission Trainer — back to top">
          <WelcomeBrand />
        </button>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => go(link.target)}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0 md:pl-2">
          <Button asChild size="sm" className="shadow-[0_10px_30px_-14px_hsl(221_83%_53%/0.9)]">
            <Link to="/login">Login</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            className="rounded-lg border border-border/70 p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 md:hidden">
          <div className="flex flex-col">
            {LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => go(link.target)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}