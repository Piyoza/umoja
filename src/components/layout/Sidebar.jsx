import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Gamepad2,
  Home,
  LogOut,
  Orbit,
  Rocket,
  Settings,
  Siren,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Gaming & Simulation", to: "/simulation", icon: Gamepad2 },
  { label: "Space Emergency Simulator", to: "/simulator", icon: Siren },
  { label: "3D Solar System Explorer", to: "/solar-system", icon: Orbit },
  { label: "Learning Academy", to: "/academy", icon: BookOpen },
  { label: "My Progress", to: "/progress", icon: BarChart3 },
  { label: "Achievements", to: "/achievements", icon: Trophy },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout, user } = useAuth();

  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start gap-3 px-5 pb-6 pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/40">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-[13px] font-semibold uppercase leading-tight tracking-[0.14em] text-foreground">
              Junior Astronaut
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Mission Trainer</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          <p className="eyebrow px-3 pb-2">Mission Control</p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_hsl(221_83%_53%/0.9)]"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px] shrink-0", active ? "" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Settings className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
              <span className="truncate">Admin Dashboard</span>
            </Link>
          )}
        </nav>

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
