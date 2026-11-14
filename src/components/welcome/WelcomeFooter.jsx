import { Link } from "@tanstack/react-router";
import WelcomeBrand from "@/components/welcome/WelcomeBrand";

export default function WelcomeFooter({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <WelcomeBrand />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              An interactive educational platform for astronomy, space exploration and astronaut mission
              training.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-1">
            <button
              type="button"
              onClick={() => onNavigate("about")}
              className="text-left text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </button>
            <Link to="/help" className="text-muted-foreground transition-colors hover:text-foreground">
              Help and Support
            </Link>
            <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/login" className="text-muted-foreground transition-colors hover:text-foreground">
              Login
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border/60 pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Junior Astronaut Mission Trainer. All rights reserved.</p>
          <p className="uppercase tracking-[0.16em]">Educational simulations · Not official flight procedure</p>
        </div>
      </div>
    </footer>
  );
}