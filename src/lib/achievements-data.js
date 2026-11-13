import { TOTAL_LESSONS } from "@/lib/academy-data";

export const ACHIEVEMENTS = [
  {
    key: "first_mission",
    title: "First Light",
    description: "Complete your first emergency simulation.",
    icon: "star",
    test: (s) => s.attempts >= 1,
  },
  {
    key: "mission_commander",
    title: "Mission Commander",
    description: "Score 90 or higher in an emergency simulation.",
    icon: "award",
    test: (s) => s.bestScore >= 90,
  },
  {
    key: "crisis_veteran",
    title: "Crisis Veteran",
    description: "Complete all eight emergency scenarios.",
    icon: "shield",
    test: (s) => s.distinctScenarios >= 8,
  },
  {
    key: "planet_explorer",
    title: "Planet Explorer",
    description: "Explore all eight planets in the 3D solar system.",
    icon: "sparkles",
    test: (s) => s.planets >= 8,
  },
  {
    key: "moonwalker",
    title: "Moonwalker",
    description: "Explore three moons, asteroids or comets.",
    icon: "star",
    test: (s) => s.smallBodies >= 3,
  },
  {
    key: "gravity_pilot",
    title: "Gravity Pilot",
    description: "Run an experiment in the Gravity Laboratory.",
    icon: "award",
    test: (s) => s.experiments >= 1,
  },
  {
    key: "comparative_scientist",
    title: "Comparative Scientist",
    description: "Complete a planetary comparison in the explorer.",
    icon: "shield",
    test: (s) => s.comparisons >= 1,
  },
  {
    key: "quiz_master",
    title: "Quiz Master",
    description: "Pass three solar system activities.",
    icon: "sparkles",
    test: (s) => s.quizzes >= 3,
  },
  {
    key: "landing_specialist",
    title: "Landing Specialist",
    description: "Choose a landing site on Mars and the Moon.",
    icon: "star",
    test: (s) => s.landings >= 2,
  },
  {
    key: "academy_graduate",
    title: "Academy Graduate",
    description: "Complete every Learning Academy lesson.",
    icon: "award",
    test: (s) => s.lessons >= TOTAL_LESSONS,
  },
];