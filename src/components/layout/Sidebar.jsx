
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ChartNoAxesCombined,
  Gamepad2,
  Home,
  LogOut,
  Orbit,
  Rocket,
  Settings,
  ShieldAlert,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  {
    label: "Mission Headquarters",
    to: "/",
    icon: Home,
    section: "Start",
  },
  {
    label: "Learn & Discover",
    to: "/academy",
    icon: BookOpen,
    section: "Discover",
  },
  {
    label: "Explore the Solar System",
    to: "/solar-system",
    icon: Orbit,
    section: "Discover",
  },
  {
    label: "Mission Training",
    to: "/simulator",
    icon: Target,
    section: "Train",
  },
  {
    label: "Games & Challenges",
    to: "/simulation",
    icon: Gamepad2,
    section: "Train",
  },
  {
    label: "My Progress",
    to: "/progress",
    icon: ChartNoAxesCombined,
    section: "My Journey",
  },
  {
    label: "Achievements",
    to: "/achievements",
    icon: Trophy,
    section: "My Journey",
  },
  {
    label: "Accessibility & Settings",
    to: "/settings",
    icon: Settings,
    section: "Personalise",
  },
];

const NAV_SECTIONS = [
  "Start",
  "Discover",
  "Train",
  "My Journey",
  "Personalise",
];

export default function Sidebar({ open, onClose }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const { logout, user } = useAuth();

  const isActive = (to) =>
    to === "/"
      ? pathname === "/"
      : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}
      <aside
        id="main-sidebar"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Branding */}
        <div className="flex items-start gap-3 px-5 pb-6 pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
            <Rocket className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="font-heading text-[13px] font-semibold uppercase leading-tight tracking-[0.14em] text-foreground">
              Junior Astronaut
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Discover · Learn · Explore
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation sections */}
        <nav
          aria-label="Mission navigation"
          className="flex-1 space-y-5 overflow-y-auto px-3 pb-4"
        >
          {NAV_SECTIONS.map((section) => {
            const items = NAV_ITEMS.filter(
              (item) => item.section === section,
            );

            return (
              <div key={section} className="space-y-1">
                <p className="eyebrow px-3 pb-1">
                  {section}
                </p>

                {items.map((item) => {
                  const active = isActive(item.to);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${item.section}-${item.label}`}
                      to={item.to}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_hsl(221_83%_53%/0.9)]"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          active
                            ? ""
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />

                      <span className="truncate">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Admin navigation */}
          {user?.role === "admin" && (
            <div className="space-y-1">
              <p className="eyebrow px-3 pb-1">
                Administration
              </p>

              <Link
                to="/admin"
                onClick={onClose}
                aria-current={
                  pathname.startsWith("/admin")
                    ? "page"
                    : undefined
                }
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Settings className="h-[18px] w-[18px] shrink-0" />
                Admin Dashboard
              </Link>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
