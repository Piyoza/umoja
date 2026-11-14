
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Dumbbell,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  Waves,
} from "lucide-react";

import AstraChat from "@/components/astra/AstraChat";
import { Button } from "@/components/ui/button";
import BodyInSpace3D from "@/components/academy/BodyInSpace3D";

const lessons = [
  {
    id: "muscles",
    title: "Muscles and Bones",
    subtitle: "Why astronauts become weaker in space",
    icon: Dumbbell,
    color: "text-orange-400",
    background: "bg-orange-400/10",
    image: "💪",
    facts: [
      "On Earth, gravity constantly challenges our muscles and bones.",
      "In microgravity, astronauts do not need to support their body weight in the same way.",
      "Without regular exercise, muscles become weaker and bones can lose density.",
    ],
    science:
      "Astronauts can experience muscle atrophy and bone loss because their muscles and skeleton experience less mechanical loading in microgravity.",
    activity:
      "Imagine spending six months floating aboard the International Space Station. Which parts of your body would need extra exercise?",
  },
  {
    id: "fluids",
    title: "Body Fluids",
    subtitle: "Why astronauts get puffy faces",
    icon: Waves,
    color: "text-blue-400",
    background: "bg-blue-400/10",
    image: "💧",
    facts: [
      "Gravity normally pulls body fluids towards the lower parts of the body.",
      "In microgravity, fluids shift towards the chest and head.",
      "This can make astronauts' faces look puffier than normal.",
    ],
    science:
      "The upward fluid shift can also contribute to nasal congestion and changes in fluid distribution throughout the body.",
    activity:
      "Why might an astronaut's face look different after spending several days in space?",
  },
  {
    id: "balance",
    title: "Balance and Orientation",
    subtitle: "Why astronauts feel dizzy",
    icon: Brain,
    color: "text-purple-400",
    background: "bg-purple-400/10",
    image: "🧠",
    facts: [
      "Your inner ear helps your brain understand movement and orientation.",
      "Microgravity changes the signals your brain receives about movement.",
      "Astronauts may experience space motion sickness while adapting.",
    ],
    science:
      "The vestibular system uses structures in the inner ear to detect movement and orientation. Microgravity changes how these signals are interpreted.",
    activity:
      "What happens when your brain receives unfamiliar movement signals while you are floating?",
  },
  {
    id: "exercise",
    title: "Exercise in Space",
    subtitle: "How astronauts protect their bodies",
    icon: Activity,
    color: "text-green-400",
    background: "bg-green-400/10",
    image: "🏃",
    facts: [
      "Astronauts exercise for approximately two hours each day.",
      "The International Space Station has specialised exercise equipment.",
      "Resistance and aerobic exercise help maintain muscle and cardiovascular fitness.",
    ],
    science:
      "The ISS uses equipment such as the Advanced Resistive Exercise Device (ARED), cycle ergometers and treadmills to help astronauts maintain physical fitness.",
    activity:
      "Why is exercising in space important even when astronauts are not walking or running normally?",
  },
];

const questions = [
  {
    question: "Why do astronauts lose muscle strength in space?",
    options: [
      "Because there is no oxygen",
      "Because their muscles experience less loading",
      "Because their muscles stop working completely",
      "Because space is too cold",
    ],
    answer: 1,
    explanation:
      "Correct! In microgravity, muscles work differently because they no longer need to support the body against Earth's gravity.",
  },
  {
    question: "Why do astronauts sometimes have puffy faces?",
    options: [
      "Fluids shift towards the head",
      "Their bodies absorb more oxygen",
      "Their bones become larger",
      "Their helmets push their faces",
    ],
    answer: 0,
    explanation:
      "Correct! Without Earth's usual gravitational pull, body fluids shift towards the upper body and head.",
  },
  {
    question: "Which body system helps astronauts maintain balance?",
    options: [
      "Digestive system",
      "Respiratory system",
      "Vestibular system",
      "Immune system",
    ],
    answer: 2,
    explanation:
      "Correct! The vestibular system in the inner ear helps the brain understand movement and orientation.",
  },
  {
    question: "What is the purpose of exercise equipment on the ISS?",
    options: [
      "To make astronauts move faster",
      "To maintain muscle and cardiovascular fitness",
      "To create artificial gravity",
      "To help astronauts sleep",
    ],
    answer: 1,
    explanation:
      "Correct! Exercise helps astronauts maintain muscle strength, bone health and cardiovascular fitness.",
  },
  {
    question: "Approximately how much time do astronauts exercise each day?",
    options: [
      "10 minutes",
      "30 minutes",
      "2 hours",
      "6 hours",
    ],
    answer: 2,
    explanation:
      "Correct! Astronauts typically spend around two hours per day exercising, including preparation and equipment setup.",
  },
];

export default function BodyInSpaceLesson() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const lesson = lessons[activeLesson];
  const question = questions[questionIndex];

  const progress = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  function completeLesson() {
    setCompletedLessons((previous) =>
      previous.includes(lesson.id)
        ? previous
        : [...previous, lesson.id]
    );
  }

  function nextLesson() {
    completeLesson();

    if (activeLesson < lessons.length - 1) {
      setActiveLesson((previous) => previous + 1);
    }
  }

  function previousLesson() {
    if (activeLesson > 0) {
      setActiveLesson((previous) => previous - 1);
    }
  }

  function startQuiz() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinalScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizStarted(true);
  }

  function chooseAnswer(index) {
    if (showExplanation) return;

    setSelectedAnswer(index);
    setShowExplanation(true);
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;

    const updatedAnswers = [...answers, selectedAnswer];
    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const correctAnswers = updatedAnswers.reduce(
        (total, answer, index) =>
          total + (answer === questions[index].answer ? 1 : 0),
        0
      );

      setFinalScore(correctAnswers);
      setQuizFinished(true);
    }
  }

  function restartQuiz() {
    startQuiz();
  }

  const quizScore = Math.round(
    (finalScore / questions.length) * 100
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10 text-foreground">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="absolute right-5 top-5 text-6xl opacity-20">
          🧑‍🚀
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            UMOJA SPACE ACADEMY
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            The Human Body in Space
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Discover how microgravity changes the human body.
            Explore real astronaut science, complete learning
            challenges and test your knowledge.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-border px-3 py-1.5 text-xs">
              🧬 Human Biology
            </span>
            <span className="rounded-full border border-border px-3 py-1.5 text-xs">
              🚀 Microgravity
            </span>
            <span className="rounded-full border border-border px-3 py-1.5 text-xs">
              ⏱️ 15–20 minutes
            </span>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">
            Learning progress
          </span>
          <span className="text-sm font-bold text-primary">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {completedLessons.length} of {lessons.length} lessons completed
        </p>
      </div>

      {/* 3D HUMAN BODY EXPLORER */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Interactive science lab
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            Explore the Human Body in Space
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the astronaut skeleton in 3D. Rotate the model,
            select body parts and listen to the explanations.
          </p>
        </div>

        <BodyInSpace3D />
      </div>

      {/* LESSON NAVIGATION */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {lessons.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveLesson(index)}
              className={`rounded-xl border p-4 text-left transition-all ${
                activeLesson === index
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${item.color}`} />
                {completedLessons.includes(item.id) && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </div>

              <p className="mt-3 text-sm font-semibold">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Lesson {index + 1}
              </p>
            </button>
          );
        })}
      </div>

      {/* LESSON CONTENT */}
      {!quizStarted && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5 md:p-7">
            <div className="flex items-center gap-4">
              <div className={`rounded-2xl p-4 ${lesson.background}`}>
                <span className="text-4xl">{lesson.image}</span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Lesson {activeLesson + 1}
                </p>
                <h2 className="mt-1 text-xl font-bold md:text-2xl">
                  {lesson.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lesson.subtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What you need to know</h3>

              {lesson.facts.map((fact, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-border/70 bg-background/40 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6">{fact}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-5 w-5 text-primary" />
                The Science Behind It
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {lesson.science}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-5">
              <p className="text-sm font-semibold">
                🚀 Mission Challenge
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {lesson.activity}
              </p>
            </div>

            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={previousLesson}
                disabled={activeLesson === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {activeLesson < lessons.length - 1 ? (
                <Button onClick={nextLesson}>
                  Complete & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    completeLesson();
                    startQuiz();
                  }}
                >
                  Start Knowledge Check
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* ASTRA INSTRUCTOR */}
          <div className="h-fit rounded-2xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="font-bold">Ask ASTRA</h3>
                <p className="text-xs text-muted-foreground">
                  Your AI space science instructor
                </p>
              </div>
            </div>

            <AstraChat
              mode="education"
              compact
              context={`UMOJA Space Academy: Human Body in Space.
Current lesson: ${lesson.title}.
Topic: ${lesson.subtitle}.
Scientific explanation: ${lesson.science}.
Learning facts: ${lesson.facts.join(" ")}.
Explain concepts at a learner-friendly level.
Use scientifically accurate explanations.
Encourage critical thinking.`}
              suggestions={[
                "Explain this lesson simply.",
                "Give me a real astronaut example.",
                "Why does this happen in microgravity?",
              ]}
            />
          </div>
        </div>
      )}

      {/* QUIZ */}
      {quizStarted && (
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 md:p-8">
          {!quizFinished ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Mission Knowledge Check
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Test Your Knowledge
                  </h2>
                </div>

                <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold">
                  {questionIndex + 1}/{questions.length}
                </div>
              </div>

              <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${((questionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <h3 className="mb-5 text-lg font-semibold leading-relaxed">
                {question.question}
              </h3>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isCorrect = index === question.answer;
                  const isSelected = index === selectedAnswer;

                  let style = "border-border hover:border-primary/60";

                  if (showExplanation && isCorrect) {
                    style = "border-green-500 bg-green-500/10";
                  } else if (showExplanation && isSelected) {
                    style = "border-red-500 bg-red-500/10";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => chooseAnswer(index)}
                      disabled={showExplanation}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${style}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-5 rounded-xl border border-border bg-background/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {selectedAnswer === question.answer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                    )}

                    {selectedAnswer === question.answer
                      ? "Excellent work!"
                      : "Let's learn from this!"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {question.explanation}
                  </p>
                </div>
              )}

              <Button
                className="mt-6 w-full"
                disabled={selectedAnswer === null}
                onClick={nextQuestion}
              >
                {questionIndex === questions.length - 1
                  ? "Finish Mission"
                  : "Next Question"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="py-8 text-center">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500" />

              <h2 className="mt-5 text-3xl font-bold">
                Mission Completed!
              </h2>

              <p className="mt-2 text-muted-foreground">
                You have completed the Human Body in Space knowledge check.
              </p>

              <div className="mx-auto my-7 max-w-xs rounded-2xl border border-border bg-background p-6">
                <p className="text-sm text-muted-foreground">
                  Your final score
                </p>

                <p className="my-2 text-5xl font-bold text-primary">
                  {quizScore}%
                </p>

                <p className="text-sm font-semibold">
                  {finalScore} out of {questions.length} correct
                </p>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">
                {quizScore >= 80
                  ? "Outstanding! You are developing excellent space science knowledge."
                  : quizScore >= 60
                    ? "Good work! Review the lessons to strengthen your knowledge."
                    : "Keep exploring! Review the lessons and try the mission again."}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={restartQuiz}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry Mission
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setQuizStarted(false)}
                >
                  Review Lessons
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
