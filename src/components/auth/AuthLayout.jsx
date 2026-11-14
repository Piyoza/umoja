import CinematicBackdrop from "@/components/welcome/CinematicBackdrop";

// Full-screen card shared by the auth pages; it sets its own color tokens so it stays readable under any theme.
export function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="dark relative isolate min-h-screen overflow-x-hidden text-foreground">
      <CinematicBackdrop />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-8 text-card-foreground shadow-lg backdrop-blur-md">
            {children}
          </div>
          {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </div>
    </div>
  );
}