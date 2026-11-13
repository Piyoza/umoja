import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldAlert, Users } from "lucide-react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { getIdTokenResult } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ACHIEVEMENTS } from "@/lib/achievements";

export const Route = createFileRoute("/_authed/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin Dashboard · Junior Astronaut Mission Trainer" }],
  }),
});

function AdminPage() {
  const [data, setData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAdminData() {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          if (active) setAccessDenied(true);
          return;
        }

        const tokenResult = await getIdTokenResult(currentUser, true);

        if (!tokenResult.claims.admin) {
          if (active) setAccessDenied(true);
          return;
        }

        const [attemptsRes, explorationRes, usersRes] = await Promise.all([
          getDocs(
            query(
              collection(db, "simulation_attempts"),
              orderBy("created_date", "desc"),
              limit(100)
            )
          ),
          getDocs(
            query(
              collection(db, "exploration_progress"),
              orderBy("created_date", "desc"),
              limit(200)
            )
          ),
          getDocs(collection(db, "users")),
        ]);

        if (!active) return;

        setData({
          attempts: attemptsRes.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          exploration: explorationRes.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          users: usersRes.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);
        if (active) {
          setError(
            "Could not load programme data. Check your Firebase permissions and configuration."
          );
        }
      }
    }

    loadAdminData();

    return () => {
      active = false;
    };
  }, []);

  if (accessDenied) {
    return (
      <div className="panel p-8 text-center">
        <ShieldAlert className="mx-auto h-6 w-6 text-amber-400" />
        <h1 className="mt-2 text-lg font-semibold">
          Flight Director access only
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This dashboard is available to administrators of the training
          programme.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-8 text-center">
        <ShieldAlert className="mx-auto h-6 w-6 text-amber-400" />
        <h1 className="mt-2 text-lg font-semibold">
          Programme data unavailable
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel p-10 text-center text-sm text-muted-foreground">
        Loading programme data…
      </div>
    );
  }

  const avg = data.attempts.length
    ? Math.round(
        data.attempts.reduce(
          (sum, attempt) => sum + (Number(attempt.score) || 0),
          0
        ) / data.attempts.length
      )
    : 0;

  const scenarioCounts = data.attempts.reduce((acc, attempt) => {
    const scenario = attempt.scenario_title || "Unknown scenario";
    acc[scenario] = (acc[scenario] || 0) + 1;
    return acc;
  }, {});

  const topScenario = Object.entries(scenarioCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Programme oversight</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggregate training activity across the programme. Individual reports
          are visible below.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Trainees", value: data.users.length },
          { label: "Simulations run", value: data.attempts.length },
          { label: "Average score", value: avg },
          { label: "Exploration records", value: data.exploration.length },
        ].map((card) => (
          <div key={card.label} className="panel p-4">
            <p className="font-heading text-2xl font-semibold">
              {card.value}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel overflow-x-auto p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> Recent simulations
          </h2>

          {data.attempts.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              No simulations recorded yet.
            </p>
          ) : (
            <table className="mt-3 w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="pb-2">Trainee</th>
                  <th className="pb-2">Scenario</th>
                  <th className="pb-2">Difficulty</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.attempts.slice(0, 12).map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="py-2 text-foreground">
                      {attempt.created_by || attempt.user_id || "Trainee"}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {attempt.scenario_title}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {attempt.difficulty}
                    </td>
                    <td className="py-2 font-medium text-foreground">
                      {attempt.score}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {attempt.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Programme insights</h2>
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted-foreground">
            <li>
              • Most-run scenario:{" "}
              <span className="text-foreground">
                {topScenario
                  ? `${topScenario[0]} (${topScenario[1]} runs)`
                  : "—"}
              </span>
            </li>
            <li>
              • Planets explored:{" "}
              <span className="text-foreground">
                {
                  new Set(
                    data.exploration
                      .filter((r) => r.item_type === "planet")
                      .map((r) => r.item_id)
                  ).size
                }
              </span>
            </li>
            <li>
              • Activities completed:{" "}
              <span className="text-foreground">
                {
                  data.exploration.filter((r) =>
                    ["activity", "comparison", "experiment", "landing"].includes(
                      r.kind
                    )
                  ).length
                }
              </span>
            </li>
            <li>
              • Badge types available:{" "}
              <span className="text-foreground">
                {ACHIEVEMENTS.length}
              </span>
            </li>
          </ul>

          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
            Admins can view all trainee records. Simulation content is
            educational and uses illustrative spacecraft values.
          </p>
        </div>
      </div>
    </div>
  );
}