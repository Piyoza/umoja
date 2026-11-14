
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  Activity,
  Brain,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Dumbbell,
  Headphones,
  RotateCcw,
  Sparkles,
  Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// =====================================================
// BODY PART INFORMATION
// =====================================================

const bodyParts = {
  skull: {
    name: "Skull",
    subtitle: "The brain's protective structure",
    description:
      "Your skull protects your brain. During spaceflight, body fluids shift towards the upper body and head because gravity no longer pulls them downwards in the usual way.",
    effect:
      "Fluid shifts towards the head, which can contribute to facial puffiness.",
    fact:
      "Astronauts sometimes develop puffy faces during the first days of spaceflight.",
    narration:
      "Welcome to the UMOJA Human Body Explorer. Let's begin with the skull. Your skull protects your brain. In microgravity, fluids shift towards your head. This can make astronauts' faces appear puffy.",
    icon: Brain,
  },

  spine: {
    name: "Spine",
    subtitle: "Your body's central support",
    description:
      "The spine supports the body and protects the spinal cord. In microgravity, the spine experiences reduced gravitational loading. The spaces between vertebrae can expand slightly.",
    effect:
      "Astronauts can temporarily become taller while in space.",
    fact:
      "Some astronauts experience back discomfort during spaceflight.",
    narration:
      "Now let's explore the spine. On Earth, gravity constantly loads your spine. In microgravity, this loading is reduced. The spaces between vertebrae can expand slightly, causing astronauts to temporarily become taller. Some astronauts also experience back discomfort.",
    icon: Activity,
  },

  ribs: {
    name: "Rib cage",
    subtitle: "Protection for your vital organs",
    description:
      "The rib cage protects the heart and lungs. These organs continue working normally in space, although the body experiences changes in fluid distribution and mechanical loading.",
    effect:
      "The body experiences different mechanical loading in microgravity.",
    fact:
      "The heart and lungs continue functioning in space.",
    narration:
      "Here we have the rib cage. It protects your heart and lungs. Even though gravity changes how the body experiences movement and mechanical loading, your heart and lungs continue functioning in space.",
    icon: HeartIcon,
  },

  arms: {
    name: "Arms and muscles",
    subtitle: "Maintaining muscle strength",
    description:
      "In space, muscles do not need to support the body against gravity in the same way. Without regular exercise, astronauts can experience muscle atrophy.",
    effect:
      "Muscle strength and size can decrease without exercise.",
    fact:
      "Astronauts use specialised resistance equipment aboard the International Space Station.",
    narration:
      "Look at the arms. Muscles are important for movement and strength. In microgravity, astronauts use their muscles differently. Without regular exercise, muscles can become weaker. Resistance training helps astronauts maintain their strength.",
    icon: Dumbbell,
  },

  pelvis: {
    name: "Pelvis",
    subtitle: "Supporting your body's structure",
    description:
      "The pelvis connects the spine to the lower limbs. Bones experience less mechanical loading in microgravity, which can contribute to bone mineral density loss.",
    effect:
      "Bone mineral density can decrease during long-duration spaceflight.",
    fact:
      "Exercise and nutrition are important for protecting astronaut bone health.",
    narration:
      "Next is the pelvis. Your pelvis connects your spine to your legs. In space, bones experience less mechanical loading. Over time, astronauts can lose bone mineral density. Exercise and proper nutrition help protect their bones.",
    icon: Activity,
  },

  legs: {
    name: "Legs and muscles",
    subtitle: "Movement in microgravity",
    description:
      "On Earth, your leg muscles work against gravity when standing and walking. In space, this loading decreases. Astronauts need specialised exercise equipment to maintain their fitness.",
    effect:
      "Leg muscles and weight-bearing bones are at risk of deconditioning.",
    fact:
      "Astronauts use treadmills, cycle ergometers and resistance devices on the ISS.",
    narration:
      "Finally, let's examine the legs. On Earth, your leg muscles work against gravity every day. In space, they receive less loading. Astronauts use specialised treadmills and resistance machines to maintain their physical fitness. That completes our anatomy tour. Excellent work, astronaut!",
    icon: Activity,
  },
};

// Small icon component for the rib cage lesson
function HeartIcon(props) {
  return <Waves {...props} />;
}

// =====================================================
// ASTRA GUIDED TOUR
// =====================================================

const tourStops = [
  "skull",
  "spine",
  "ribs",
  "arms",
  "pelvis",
  "legs",
];

// =====================================================
// 3D BONE COMPONENT
// =====================================================

function Bone({
  start,
  end,
  color,
  radius = 0.065,
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);

    const direction = new THREE.Vector3().subVectors(b, a);

    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      ),
      length: direction.length(),
    };
  }, [start, end]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry
        args={[radius * 0.72, radius, length, 12]}
      />

      <meshStandardMaterial
        color={color}
        roughness={0.65}
        metalness={0.05}
        emissive={color}
        emissiveIntensity={color === "#39c6ff" ? 0.35 : 0}
      />
    </mesh>
  );
}

// =====================================================
// 3D JOINT COMPONENT
// =====================================================

function Joint({ position, color, radius = 0.09 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />

      <meshStandardMaterial
        color={color}
        roughness={0.6}
        emissive={color}
        emissiveIntensity={color === "#39c6ff" ? 0.35 : 0}
      />
    </mesh>
  );
}

// =====================================================
// INTERACTIVE 3D SKELETON
// =====================================================

function SkeletonModel({
  selected,
  onSelect,
  isRotating,
}) {
  const modelRef = useRef();

  const normalColor = "#e8e2d2";
  const highlightColor = "#39c6ff";

  function partColor(part) {
    return selected === part
      ? highlightColor
      : normalColor;
  }

  useFrame((state, delta) => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  function selectPart(event, part) {
    event.stopPropagation();
    onSelect(part);
  }

  return (
    <group
      ref={modelRef}
      position={[0, -0.5, 0]}
      scale={0.95}
    >
      {/* SKULL */}

      <group onClick={(e) => selectPart(e, "skull")}>
        <mesh position={[0, 2.85, 0]} castShadow>
          <sphereGeometry args={[0.29, 32, 32]} />

          <meshStandardMaterial color={partColor("skull")} />
        </mesh>

        <mesh position={[0, 2.58, 0.04]}>
          <boxGeometry args={[0.24, 0.16, 0.22]} />

          <meshStandardMaterial color={partColor("skull")} />
        </mesh>

        <Joint
          position={[0, 2.49, 0]}
          color={partColor("skull")}
        />
      </group>

      {/* SPINE */}

      <group onClick={(e) => selectPart(e, "spine")}>
        <Bone
          start={[0, 2.35, 0]}
          end={[0, 0.95, 0]}
          color={partColor("spine")}
        />

        {Array.from({ length: 10 }, (_, i) => (
          <Joint
            key={i}
            position={[0, 2.35 - i * 0.145, 0]}
            color={partColor("spine")}
            radius={0.075}
          />
        ))}
      </group>

      {/* RIB CAGE */}

      <group onClick={(e) => selectPart(e, "ribs")}>
        {[1.95, 1.78, 1.61, 1.44].map((y, index) => (
          <mesh
            key={index}
            position={[0, y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 0.72, 0.7]}
          >
            <torusGeometry
              args={[0.43 - index * 0.025, 0.035, 8, 32]}
            />

            <meshStandardMaterial color={partColor("ribs")} />
          </mesh>
        ))}
      </group>

      {/* ARMS */}

      <group onClick={(e) => selectPart(e, "arms")}>
        {[-1, 1].map((side) => {
          const shoulder = [side * 0.48, 2.17, 0];
          const elbow = [side * 0.78, 1.55, 0];
          const wrist = [side * 0.94, 0.95, 0];

          return (
            <group key={side}>
              <Bone
                start={[0, 2.22, 0]}
                end={shoulder}
                color={partColor("arms")}
              />

              <Bone
                start={shoulder}
                end={elbow}
                color={partColor("arms")}
                radius={0.085}
              />

              <Bone
                start={elbow}
                end={wrist}
                color={partColor("arms")}
                radius={0.065}
              />

              <Bone
                start={wrist}
                end={[side * 1, 0.68, 0]}
                color={partColor("arms")}
                radius={0.055}
              />

              <Joint
                position={shoulder}
                color={partColor("arms")}
              />

              <Joint
                position={elbow}
                color={partColor("arms")}
              />

              <Joint
                position={wrist}
                color={partColor("arms")}
              />
            </group>
          );
        })}
      </group>

      {/* PELVIS */}

      <group onClick={(e) => selectPart(e, "pelvis")}>
        <mesh position={[0, 0.77, 0]} scale={[0.53, 0.25, 0.3]}>
          <sphereGeometry args={[1, 24, 24]} />

          <meshStandardMaterial color={partColor("pelvis")} />
        </mesh>

        <Joint
          position={[-0.34, 0.72, 0]}
          color={partColor("pelvis")}
        />

        <Joint
          position={[0.34, 0.72, 0]}
          color={partColor("pelvis")}
        />
      </group>

      {/* LEGS */}

      <group onClick={(e) => selectPart(e, "legs")}>
        {[-1, 1].map((side) => {
          const hip = [side * 0.29, 0.65, 0];
          const knee = [side * 0.34, -0.25, 0];
          const ankle = [side * 0.36, -1.05, 0];

          return (
            <group key={side}>
              <Bone
                start={hip}
                end={knee}
                color={partColor("legs")}
                radius={0.105}
              />

              <Bone
                start={knee}
                end={ankle}
                color={partColor("legs")}
                radius={0.075}
              />

              <Bone
                start={ankle}
                end={[side * 0.36, -1.28, 0.13]}
                color={partColor("legs")}
                radius={0.06}
              />

              <Joint position={hip} color={partColor("legs")} />
              <Joint position={knee} color={partColor("legs")} />
              <Joint position={ankle} color={partColor("legs")} />
            </group>
          );
        })}
      </group>

    </group>
  );
}

// =====================================================
// MAIN BODY IN SPACE COMPONENT
// =====================================================

export default function BodyInSpace3D() {
  const [selected, setSelected] = useState("spine");

  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [tourIndex, setTourIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const [voiceError, setVoiceError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentPart = bodyParts[selected];

  // ===================================================
  // SPEECH SUPPORT
  // ===================================================

  function speakPart(index) {
    if (!window.speechSynthesis) {
      setVoiceError("Your browser does not support voice narration.");
      return;
    }

    const partId = tourStops[index];

    const part = bodyParts[partId];

    setSelected(partId);
    setIsSpeaking(true);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      part.narration
    );

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);

      if (isTourPlaying && !isPaused) {
        if (index < tourStops.length - 1) {
          setTourIndex(index + 1);
        } else {
          setIsTourPlaying(false);
          setIsRotating(false);
          setTourIndex(0);
        }
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsTourPlaying(false);
      setIsRotating(false);
      setVoiceError("Voice narration could not be played.");
    };

    window.speechSynthesis.speak(utterance);
  }

  // ===================================================
  // TOUR CONTROL
  // ===================================================

  function startTour() {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Your browser does not support voice narration.");
      return;
    }

    window.speechSynthesis.cancel();

    setVoiceError("");
    setTourIndex(0);
    setIsTourPlaying(true);
    setIsPaused(false);
    setIsRotating(true);
  }

  function pauseTour() {
    window.speechSynthesis.pause();

    setIsPaused(true);
    setIsSpeaking(false);
    setIsRotating(false);
  }

  function resumeTour() {
    window.speechSynthesis.resume();

    setIsPaused(false);
    setIsSpeaking(true);
    setIsRotating(true);
  }

  function stopTour() {
    window.speechSynthesis.cancel();

    setIsTourPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setIsRotating(false);
    setTourIndex(0);
  }

  function restartTour() {
    stopTour();

    setTimeout(() => {
      startTour();
    }, 100);
  }

  // ===================================================
  // AUTOMATIC NARRATION
  // ===================================================

  useEffect(() => {
    if (!isTourPlaying || isPaused) return;

    speakPart(tourIndex);

    return () => {
      window.speechSynthesis?.cancel();
    };

    // Narration runs when the guided tour advances.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTourPlaying, isPaused, tourIndex]);

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ===================================================
  // USER INTERFACE
  // ===================================================

  return (
    <section className="space-y-5">

      {/* INTRODUCTION */}

      <div>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />

          <p className="text-xs font-semibold uppercase tracking-widest">
            UMOJA Interactive Anatomy Lab
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-bold md:text-3xl">
          Explore the Human Body in Space
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Meet your AI instructor ASTRA. Watch the skeleton rotate
          while ASTRA explains how microgravity affects the human body.
        </p>
      </div>

      {/* ASTRA TOUR CONTROLS */}

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-3">
              <Headphones className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h3 className="font-bold">
                ASTRA Guided Anatomy Tour
              </h3>

              <p className="text-xs text-muted-foreground">
                AI instructor voice and interactive highlights
              </p>
            </div>
          </div>

          {!isTourPlaying ? (
            <Button onClick={startTour}>
              <CirclePlay className="mr-2 h-4 w-4" />
              Start Guided Tour
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">

              {!isPaused ? (
                <Button variant="outline" onClick={pauseTour}>
                  <CirclePause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeTour}>
                  <CirclePlay className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              )}

              <Button variant="outline" onClick={restartTour}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>

              <Button variant="destructive" onClick={stopTour}>
                Stop
              </Button>
            </div>
          )}
        </div>

        {isTourPlaying && (
          <div className="mt-5 rounded-xl border border-border bg-card p-4">

            <div className="flex items-center justify-between gap-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {isPaused ? "Tour paused" : "ASTRA is teaching"}
                </p>

                <h4 className="mt-1 font-bold">
                  {currentPart.name}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isSpeaking ? (
                  <>
                    <span className="animate-pulse text-green-500">●</span>
                    Speaking
                  </>
                ) : isPaused ? (
                  "Paused"
                ) : (
                  "Preparing"
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-1.5">
              {tourStops.map((part, index) => (
                <div
                  key={part}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= tourIndex
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Part {tourIndex + 1} of {tourStops.length}
            </p>
          </div>
        )}

        {voiceError && (
          <p className="mt-3 text-sm text-red-500">
            {voiceError}
          </p>
        )}
      </div>

      {/* 3D SKELETON VIEWER */}

      <div className="overflow-hidden rounded-2xl border border-border bg-[#080e1b]">

        <div className="flex items-center justify-between gap-2 px-4 py-3">

          <div>
            <p className="text-xs font-semibold tracking-widest text-white">
              3D HUMAN SKELETON
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {isRotating ? "Automatic rotation active" : "Manual exploration"}
            </p>
          </div>

          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
            {isSpeaking ? "ASTRA speaking" : "Interactive model"}
          </span>
        </div>

        <div className="h-[460px] w-full md:h-[560px]">

          <Canvas
            camera={{
              position: [0, 0.8, 7],
              fov: 42,
            }}
            dpr={[1, 1.5]}
            gl={{ antialias: true }}
          >
            <color attach="background" args={["#080e1b"]} />

            <ambientLight intensity={1.5} />

            <directionalLight
              position={[4, 6, 5]}
              intensity={2.2}
            />

            <pointLight
              position={[-4, 2, 3]}
              intensity={1.5}
              color="#3c9eff"
            />

            <SkeletonModel
              selected={selected}
              onSelect={(part) => {
                if (isTourPlaying) {
                  stopTour();
                }

                setSelected(part);
              }}
              isRotating={isRotating}
            />

            <OrbitControls
              enablePan={false}
              enableZoom
              enableRotate
              minDistance={4}
              maxDistance={10}
              minPolarAngle={0.4}
              maxPolarAngle={2.7}
              target={[0, 0.8, 0]}
            />
          </Canvas>
        </div>

        <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-slate-400">
          Drag to rotate · Scroll to zoom · Select a body part to explore
        </div>
      </div>

      {/* BODY PART SELECTOR */}

      <div>
        <h3 className="mb-3 text-sm font-bold">
          Explore individual body parts
        </h3>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {Object.entries(bodyParts).map(([id, part]) => {
            const Icon = part.icon;

            return (
              <button
                key={id}
                onClick={() => {
                  if (isTourPlaying) stopTour();

                  setSelected(id);
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  selected === id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold">
                    {part.name}
                  </span>

                  {selected === id && (
                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {part.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SCIENCE INFORMATION PANEL */}

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">

        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          ASTRA Science Explanation
        </p>

        <h3 className="mt-2 text-xl font-bold">
          {currentPart.name}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {currentPart.description}
        </p>

        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-primary">
            EFFECT OF MICROGRAVITY
          </p>

          <p className="mt-2 text-sm leading-6">
            {currentPart.effect}
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-primary">
            DID YOU KNOW?
          </p>

          <p className="mt-2 text-sm leading-6">
            {currentPart.fact}
          </p>
        </div>

        {!isTourPlaying && (
          <Button
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              setIsTourPlaying(true);
              setIsPaused(false);
              setTourIndex(
                tourStops.indexOf(selected) >= 0
                  ? tourStops.indexOf(selected)
                  : 0
              );
              setIsRotating(true);
            }}
          >
            <Headphones className="mr-2 h-4 w-4" />
            Listen to ASTRA explain this part
          </Button>
        )}
      </div>

    </section>
  );
}
