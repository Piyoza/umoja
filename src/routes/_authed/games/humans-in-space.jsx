
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const OFFICIAL_GAME_URL =
  "https://play.google.com/store/apps/details?id=gov.nasa.jsc.igoal.SSIHRP";

export const Route = createFileRoute(
  "/_authed/games/humans-in-space"
)({
  component: HumansInSpaceRedirect,
  head: () => ({
    meta: [
      { title: "NASA Humans in Space | Junior Astronaut Mission Trainer" },
    ],
  }),
});

function HumansInSpaceRedirect() {
  useEffect(() => {
    window.location.replace(OFFICIAL_GAME_URL);
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">
        Opening NASA Humans in Space
      </h1>
      <p className="text-sm text-muted-foreground">
        Redirecting to the official Google Play game listing...
      </p>
      <a href={OFFICIAL_GAME_URL}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
        Continue to Game
      </a>
    </div>
  );
}
