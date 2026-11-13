import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mountain } from "lucide-react";
import SolarNav from "@/components/solar/SolarNav";
import TerrainViewer from "@/components/solar/TerrainViewer";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/surfaces")({
  component: SurfacesPage,
  head: () => ({ meta: [{ title: "Surface Explorer · Junior Astronaut Mission Trainer" }] }),
});

const SURFACES = {
  mars: {
    label: "Mars",
    blurb: "A cold desert world of iron-oxide dust, giant volcanoes and a canyon system that would span a continent.",
    features: [
      { id: "olympus", name: "Olympus Mons", info: "The tallest volcano in the solar system at roughly 22 km — about two and a half times the height of Mount Everest. It is so wide that its slopes are almost imperceptible from the surface." },
      { id: "valles", name: "Valles Marineris", info: "A canyon system about 4,000 km long and up to 7 km deep. It would stretch across the United States." },
      { id: "jezero", name: "Jezero Crater", info: "An ancient lake basin with a river delta, where NASA's Perseverance rover is collecting samples that may preserve signs of past microbial life." },
      { id: "hellas", name: "Hellas Planitia", info: "An impact basin over 2,000 km across and about 7 km deep — one of the largest known impact structures in the solar system." },
    ],
  },
  moon: {
    label: "The Moon",
    blurb: "Airless, heavily cratered and covered in fine regolith dust. No wind or water has smoothed its surface for billions of years.",
    features: [
      { id: "tranquility", name: "Sea of Tranquility", info: "Basaltic lava plain where Apollo 11 landed in July 1969. The regolith here is a few metres deep and rich in glassy fragments." },
      { id: "tycho", name: "Tycho Crater", info: "A young, bright crater about 85 km wide with a central peak and a ray system that spreads thousands of kilometres." },
      { id: "shackleton", name: "Shackleton Crater", info: "A polar crater whose floor is permanently shadowed, holding water ice that could supply future crews." },
      { id: "imbrium", name: "Mare Imbrium", info: "One of the largest impact basins on the Moon, later flooded with basalt lava to form a dark, flat plain." },
    ],
  },
  asteroid: {
    label: "Asteroid Surface",
    blurb: "Irregular, low-gravity terrain built from loose rubble and boulders — an asteroid's surface is more like a pile of debris than solid ground.",
    features: [
      { id: "craters", name: "Impact craters", info: "Without an atmosphere, micrometeoroids hit the surface at full speed, building a dense population of overlapping craters." },
      { id: "rubble", name: "Boulder fields", info: "OSIRIS-REx found Bennu's surface covered in boulders, with particles occasionally lifting off the surface entirely." },
      { id: "scarp", name: "Bennu's ridge", info: "A ridge running along Bennu's equator suggests the asteroid may be slowly spinning apart." },
    ],
  },
};

function SurfacesPage() {
  const [kind, setKind] = useState("mars");
  const [featureId, setFeatureId] = useState(SURFACES.mars.features[0].id);
  const surface = SURFACES[kind];
  const feature = surface.features.find((entry) => entry.id === featureId) || surface.features[0];

  function changeSurface(next) {
    setKind(next);
    setFeatureId(SURFACES[next].features[0].id);
    recordExploration({
      itemType: "surface",
      itemId: next,
      itemName: `${SURFACES[next].label} surface`,
      kind: "activity",
      score: 100,
      detail: `Viewed ${SURFACES[next].label} terrain and features`,
    }).catch(() => {});
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Planetary surfaces</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Surface explorer</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Explore terrain visualisations of Mars, the Moon and an asteroid. Select a marked feature to learn
          what shapes it.
        </p>
      </div>

      <SolarNav />

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(SURFACES).map(([key, entry]) => (
          <button
            key={key}
            onClick={() => changeSurface(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
              kind === key
                ? "border-primary/60 bg-primary/15 text-foreground"
                : "border-border/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <TerrainViewer terrain={kind} features={surface.features} selected={feature.id} onSelect={setFeatureId} />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-5">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Mountain className="h-4 w-4 text-primary" /> {feature.name}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{feature.info}</p>
          <p className="mt-3 rounded-lg border border-border/60 bg-background/40 p-2.5 text-[10px] leading-relaxed text-muted-foreground">
            Terrain shown is a generated visualisation for educational purposes, not a measured elevation
            dataset. NASA publishes the underlying imagery and topography through its planetary data archives.
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-xs font-semibold">Marked features on {surface.label}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{surface.blurb}</p>
          <div className="mt-3 space-y-1.5">
            {surface.features.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setFeatureId(entry.id)}
                className={cn(
                  "w-full rounded-lg border px-2.5 py-2 text-left text-[11px] transition-colors",
                  entry.id === feature.id
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {entry.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}