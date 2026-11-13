import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { ACHIEVEMENTS } from "@/lib/achievements-data";
import { TOTAL_LESSONS } from "@/lib/academy-data";

function currentUserId() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("You must be signed in to save progress.");
  return uid;
}

function sortNewestFirst(items) {
  return items.sort((a, b) => {
    const dateA = a.created_date?.toMillis?.() ?? 0;
    const dateB = b.created_date?.toMillis?.() ?? 0;
    return dateB - dateA;
  });
}

export async function recordAttempt({ scenario, difficulty, report, debrief = "" }) {
  const uid = currentUserId();

  return addDoc(collection(db, "simulation_attempts"), {
    user_id: uid,
    scenario_id: scenario?.id ?? "",
    scenario_title: scenario?.title ?? "",
    difficulty: difficulty ?? "",
    score: Number(report?.score ?? 0),
    status: report?.status ?? "",
    debrief,
    created_date: serverTimestamp(),
  });
}

export async function recordExploration({
  itemType,
  itemId,
  itemName,
  kind,
  score,
  detail = "",
}) {
  const uid = currentUserId();

  return addDoc(collection(db, "exploration_progress"), {
    user_id: uid,
    item_type: itemType ?? "",
    item_id: itemId ?? "",
    item_name: itemName ?? "",
    kind: kind ?? "",
    ...(score === undefined ? {} : { score }),
    detail,
    created_date: serverTimestamp(),
  });
}

export async function recordLesson({ moduleId, lessonId, lessonTitle }) {
  const uid = currentUserId();
  const safeLessonId = encodeURIComponent(String(lessonId));

  return setDoc(
    doc(db, "lesson_progress", `${uid}_${safeLessonId}`),
    {
      user_id: uid,
      module_id: moduleId ?? "",
      lesson_id: String(lessonId),
      lesson_title: lessonTitle ?? "",
      created_date: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function loadTraineeStats() {
  const uid = currentUserId();

  const [attemptSnapshot, explorationSnapshot, lessonSnapshot] =
    await Promise.all([
      getDocs(
        query(
          collection(db, "simulation_attempts"),
          where("user_id", "==", uid)
        )
      ),
      getDocs(
        query(
          collection(db, "exploration_progress"),
          where("user_id", "==", uid)
        )
      ),
      getDocs(
        query(
          collection(db, "lesson_progress"),
          where("user_id", "==", uid)
        )
      ),
    ]);

  const attemptsList = sortNewestFirst(
    attemptSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  );

  const exploration = sortNewestFirst(
    explorationSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  );

  const lessonsList = sortNewestFirst(
    lessonSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
  );

  const exploredPlanets = new Set(
    exploration
      .filter((item) => item.item_type === "planet" && item.kind === "explored")
      .map((item) => item.item_id)
  );

  const smallBodies = new Set(
    exploration
      .filter((item) =>
        ["moon", "small_body", "asteroid", "comet"].includes(item.item_type)
      )
      .map((item) => item.item_id)
  );

  const scores = attemptsList.map((item) => Number(item.score) || 0);
  const attempts = attemptsList.length;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const distinctScenarios = new Set(
    attemptsList.map((item) => item.scenario_id).filter(Boolean)
  ).size;

  const countKind = (kind) =>
    exploration.filter((item) => item.kind === kind).length;

  const stats = {
    attempts,
    bestScore,
    averageScore,
    attemptsList,
    exploration,
    lessonsList,
    planets: exploredPlanets.size,
    lessons: lessonsList.length,
    smallBodies: smallBodies.size,
    distinctScenarios,
    comparisons: countKind("comparison"),
    experiments: countKind("experiment"),
    quizzes: countKind("quiz"),
    landings: countKind("landing"),
  };

  stats.achievements = ACHIEVEMENTS
    .filter((achievement) => achievement.test(stats))
    .map(({ test, ...achievement }) => achievement);

  return stats;
}

export function completionPercent(stats) {
  if (!stats) return 0;

  const total = 8 + TOTAL_LESSONS + 8;
  const completed =
    (Number(stats.planets) || 0) +
    (Number(stats.lessons) || 0) +
    (Number(stats.distinctScenarios) || 0);

  return Math.min(100, Math.round((completed / total) * 100));
}