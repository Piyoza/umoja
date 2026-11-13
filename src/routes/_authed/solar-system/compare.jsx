import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SolarNav from "@/components/solar/SolarNav";
import { COMPARISON_FIELDS, PLANETS, getPlanet } from "@/lib/solar-data";
import { recordExploration } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/solar-system/compare")({
  validateSearch: (search) => ({ planets: typeof search.planets === "string" ? search.planets : undefined }),
  component: ComparePage,
  head: () => ({ meta: [{ title: "Compare Planets · Junior Astronaut Mission Trainer" }] }),
});

function ComparePage() {
  const search = Route.useSearch();
  const initial = (search.planets || "earth,mars")
    .split(",")
    .filter((id) => getPlanet(id))
    .slice(0, 3);
  const [selected, setSelected] = useState(initial.length ? initial : ["earth", "mars"]);
  const [saved, setSaved] = useState(false);

  const planets = selected.map(getPlanet).filter(Boolean);

  function toggle(id) {
    setSaved(false);
    setSelected((current) => {
      if (current.includes(id)) {
        return current.length > 1 ? current.filter((entry) => entry !== id) : current;
      }
      return [...current, id].slice(-3);
    });
  }

  async function save() {
    await recordExploration({
      itemType: "activity",
      itemId: `compare-${selected.join("-")}`,
      itemName: `Compared ${planets.map((p) => p.name).join(" vs ")}`,
      kind: "comparison",
      score: 100,
      detail: COMPARISON_FIELDS.map((field) => `${field.label}: ${planets.map((p) => `${p.name} ${p.facts[field.key]}`).join(", ")}`).join(" | "),
    }).catch(() => {});
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Planetary comparison</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Compare planets</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Select up to three worlds and compare their size, gravity, temperature, atmosphere and orbital
          periods side by side. All values from NASA planetary fact sheets.
        </p>
      </div>

      <SolarNav />

      <div className="panel p-4">
        <p className="text-xs font-semibold">Choose planets</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PLANETS.map((planet) => {
            const active = selected.includes(planet.id);
            return (
              <button
                key={planet.id}
                onClick={() => toggle(planet.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                  active ? "border-primary/60 bg-primary/15 text-foreground" : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: planet.color }} />
                {planet.name}
                {active && <Check className="h-3 w-3 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {COMPARISON_FIELDS.map((field) => {
          const data = planets.map((planet) => ({ name: planet.name, value: planet.facts[field.key] }));
          return (
            <div key={field.key} className="panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {field.label}
              </p>
              <div className="mt-2 h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} width={46} />
                    <Tooltip
                      contentStyle={{ background: "#11161d", border: "1px solid #24303f", borderRadius: 8, fontSize: 11 }}
                      labelStyle={{ color: "#f8fafc" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={entry.name} fill={planets[index]?.color || "#3b82f6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="pb-2">Property</th>
              {planets.map((planet) => (
                <th key={planet.id} className="pb-2">{planet.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr>
              <td className="py-2 text-muted-foreground">Classification</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">{planet.type}</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Diameter</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">{planet.facts.diameterKm.toLocaleString("en-US")} km</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Gravity</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">{planet.facts.gravity} m/s²</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Average temperature</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">{planet.facts.tempC} °C</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Atmosphere (main gas)</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">
                  {planet.facts.atmosphere[0].gas} {planet.facts.atmosphere[0].pct}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Length of day</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">
                  {Math.abs(planet.facts.rotationHours).toFixed(1)} h{planet.facts.rotationHours < 0 ? " (retrograde)" : ""}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Length of year</td>
              {planets.map((planet) => (
                <td key={planet.id} className="py-2 text-foreground">{planet.facts.orbitalDays.toLocaleString("en-US")} days</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
          Temperature differences are driven mostly by distance from the Sun and by atmospheres: Venus is
          hotter than Mercury because its thick CO2 atmosphere traps heat in a runaway greenhouse effect.
        </p>
        <Button size="sm" onClick={save} disabled={saved}>
          {saved ? "Comparison saved" : "Save this comparison"}
        </Button>
      </div>
    </div>
  );
}