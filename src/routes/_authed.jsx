import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import AppLayout from "@/components/layout/AppLayout";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: async (ctx) => {
    try {
      return await requireSignedIn(ctx);
    } catch (err) {
      // Logged-out visitors opening the root URL see the welcome page
      if (ctx.location.pathname === "/") {
        throw redirect({ to: "/welcome" });
      }
      // Any other protected page keeps the original behavior (login)
      throw err;
    }
  },
  errorComponent: AuthGateError,
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}