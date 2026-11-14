
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const OFFICIAL_GAME_URL =
  "https://store.steampowered.com/app/39000/Moonbase_Alpha/";

export const Route = createFileRoute("/_authed/games/moonbase")({
  component: MoonbaseRedirect,
  head: () => ({
    meta: [
      {
        title: "Moonbase Alpha | Junior Astronaut Mission Trainer",
      },
    ],
  }),
});

function MoonbaseRedirect() {
  useEffect(() => {
    window.location.replace(OFFICIAL_GAME_URL);
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">
        Opening Official Moonbase Alpha
      </h1>

      <p className="text-sm text-muted-foreground">
        Redirecting you to the official Steam game page...
      </p>

      <a
        href={OFFICIAL_GAME_URL}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Continue to Moonbase Alpha
      </a>
    </div>
  );
}
