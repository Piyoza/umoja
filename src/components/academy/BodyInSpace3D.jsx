
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// =====================================================
// BODY PART INFORMATION
// =====================================================

const bodyParts = {
  skull: {
    name: "Head and brain",
    subtitle: "The brain's protective structure",
    description:
      "Your skull protects your brain. During spaceflight, body fluids shift towards the upper body and head because gravity no longer pulls them downwards in the usual way.",
    effect:
      "Fluid shifts towards the head, which can contribute to facial puffiness.",
    fact:
      "Astronauts sometimes develop puffy faces during the first days of spaceflight.",
    narration:
      "Welcome to the UMOJA Human Body Explorer. Let's begin with the head. Your skull protects your brain. In microgravity, fluids shift towards your head. This can make astronauts' faces appear puffy.",
  },
  spine: {
    name: "Spine and torso",
    subtitle: "Your body's central support",
    description:
      "The spine supports the body and protects the spinal cord. In microgravity, the spine experiences reduced gravitational loading. The spaces between vertebrae can expand slightly.",
    effect:
      "Astronauts can temporarily become taller while in space.",
    fact:
      "Some astronauts experience back discomfort during spaceflight.",
    narration:
      "Now let's explore the spine. On Earth, gravity constantly loads your spine. In microgravity, this loading is reduced. The spaces between vertebrae can expand slightly, causing astronauts to temporarily become taller. Some astronauts also experience back discomfort.",
  },
  ribs: {
    name: "Chest and ribs",
    subtitle: "Protection for your vital organs",
    description:
      "The rib cage protects the heart and lungs. These organs continue working normally in space, although the body experiences changes in fluid distribution and mechanical loading.",
    effect:
      "The body experiences different mechanical loading in microgravity.",
    fact: "The heart and lungs continue functioning in space.",
    narration:
      "Here we have the chest and rib cage. They protect your heart and lungs. Even though gravity changes how the body experiences movement and mechanical loading, your heart and lungs continue functioning in space.",
  },
  arms: {
    name: "Arms and hands",
    subtitle: "Maintaining muscle strength",
    description:
      "In space, muscles do not need to support the body against gravity in the same way. Without regular exercise, astronauts can experience muscle atrophy.",
    effect: "Muscle strength and size can decrease without exercise.",
    fact:
      "Astronauts use specialised resistance equipment aboard the International Space Station.",
    narration:
      "Look at the arms and hands. Muscles are important for movement and strength. In microgravity, astronauts use their muscles differently. Without regular exercise, muscles can become weaker. Resistance training helps astronauts maintain their strength.",
  },
  pelvis: {
    name: "Pelvis and hips",
    subtitle: "Supporting your body's structure",
    description:
      "The pelvis connects the spine to the lower limbs. Bones experience less mechanical loading in microgravity, which can contribute to bone mineral density loss.",
    effect:
      "Bone mineral density can decrease during long-duration spaceflight.",
    fact:
      "Exercise and nutrition are important for protecting astronaut bone health.",
    narration:
      "Next is the pelvis and hips. Your pelvis connects your spine to your legs. In space, bones experience less mechanical loading. Over time, astronauts can lose bone mineral density. Exercise and proper nutrition help protect their bones.",
  },
  legs: {
    name: "Legs and feet",
    subtitle: "Movement in microgravity",
    description:
      "On Earth, your leg muscles work against gravity when standing and walking. In space, this loading decreases. Astronauts need specialised exercise equipment to maintain their fitness.",
    effect:
      "Leg muscles and weight-bearing bones are at risk of deconditioning.",
    fact:
      "Astronauts use treadmills, cycle ergometers and resistance devices on the ISS.",
    narration:
      "Finally, let's examine the legs and feet. On Earth, your leg muscles work against gravity every day. In space, they receive less loading. Astronauts use specialised treadmills and resistance machines to maintain their physical fitness. That completes our anatomy tour. Excellent work, astronaut!",
  },
};

const tourStops = ["skull", "spine", "ribs", "arms", "pelvis", "legs"];

// =====================================================
// 3D HUMAN BUILDING COMPONENTS
// =====================================================

function HologramMaterial({ active = false, opacity = 0.48 }) {
  return (
    <meshPhysicalMaterial
      color={active ? "#b8faff" : "#279db7"}
      emissive={active ? "#00b9d4" : "#07536b"}
      emissiveIntensity={active ? 1.25 : 0.55}
      transparent
      opacity={opacity}
      roughness={0.42}
      metalness={0.22}
      clearcoat={0.6}
      clearcoatRoughness={0.2}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );
}

function BodyShape({
  position,
  scale,
  active,
  rotation = [0, 0, 0],
  opacity = 0.48,
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <HologramMaterial active={active} opacity={opacity} />
    </mesh>
  );
}

function HumanLimb({ start, end, radius, active }) {
  const geometry = useMemo(() => {
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
    <group position={geometry.position} quaternion={geometry.quaternion}>
      <mesh>
        <cylinderGeometry
          args={[radius * 0.86, radius, geometry.length, 24, 1]}
        />
        <HologramMaterial active={active} />
      </mesh>

      <mesh position={[0, geometry.length / 2, 0]}>
        <sphereGeometry args={[radius * 0.86, 20, 20]} />
        <HologramMaterial active={active} />
      </mesh>

      <mesh position={[0, -geometry.length / 2, 0]}>
        <sphereGeometry args={[radius, 20, 20]} />
        <HologramMaterial active={active} />
      </mesh>
    </group>
  );
}

function HumanJoint({ position, radius = 0.07, active }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 20, 20]} />
      <meshBasicMaterial
        color={active ? "#ffffff" : "#42c9dd"}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// =====================================================
// 3D HUMAN HOLOGRAM
// =====================================================

function HumanModel({ selected, onSelect, isRotating }) {
  const modelRef = useRef();
  const scanRef = useRef();
  const glowRef = useRef();

  const active = (part) => selected === part;

  function choose(event, part) {
    event.stopPropagation();
    onSelect(part);
  }

  useFrame((state, delta) => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += delta * 0.16;
    }

    if (scanRef.current) {
      scanRef.current.position.y += delta * 1.1;

      if (scanRef.current.position.y > 3.2) {
        scanRef.current.position.y = -1.7;
      }
    }

    if (glowRef.current) {
      glowRef.current.intensity =
        0.9 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  const fingerPositions = [-0.14, -0.07, 0, 0.07, 0.14];

  return (
    <group ref={modelRef} position={[0, -0.65, 0]} scale={0.95}>
      <pointLight
        ref={glowRef}
        position={[0, 1.3, 1]}
        color="#00bfd8"
        intensity={1}
        distance={5}
      />

      {/* HEAD AND FACE */}
      <group onClick={(e) => choose(e, "skull")}>
        <BodyShape
          position={[0, 2.68, 0]}
          scale={[0.29, 0.38, 0.26]}
          active={active("skull")}
        />

        <BodyShape
          position={[0, 2.46, 0.025]}
          scale={[0.22, 0.17, 0.23]}
          active={active("skull")}
        />

        <BodyShape
          position={[0, 2.36, 0.04]}
          scale={[0.13, 0.075, 0.13]}
          active={active("skull")}
        />

        <mesh position={[0, 2.82, 0.218]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshBasicMaterial
            color="#70dce5"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.105, 2.72, 0.238]}>
              <sphereGeometry args={[0.043, 20, 20]} />
              <meshBasicMaterial color="#d5ffff" />
            </mesh>

            <mesh position={[side * 0.105, 2.72, 0.273]}>
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshBasicMaterial color="#00c7dc" />
            </mesh>

            <BodyShape
              position={[side * 0.105, 2.785, 0.235]}
              scale={[0.075, 0.018, 0.018]}
              active={active("skull")}
            />

            <BodyShape
              position={[side * 0.29, 2.65, 0]}
              scale={[0.055, 0.105, 0.07]}
              active={active("skull")}
            />
          </group>
        ))}

        <BodyShape
          position={[0, 2.625, 0.29]}
          scale={[0.045, 0.09, 0.07]}
          active={active("skull")}
        />

        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.025, 2.59, 0.335]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color="#c8ffff" />
          </mesh>
        ))}

        <mesh position={[0, 2.49, 0.245]}>
          <boxGeometry args={[0.105, 0.018, 0.018]} />
          <meshBasicMaterial color="#9fffff" />
        </mesh>

        <BodyShape
          position={[0, 2.19, 0]}
          scale={[0.115, 0.22, 0.13]}
          active={active("skull")}
        />
      </group>

      {/* CHEST AND RIB CAGE */}
      <group onClick={(e) => choose(e, "ribs")}>
        <BodyShape
          position={[0, 1.78, 0]}
          scale={[0.43, 0.42, 0.23]}
          active={active("ribs")}
        />

        {[-1, 1].map((side) => (
          <BodyShape
            key={side}
            position={[side * 0.22, 1.86, 0.07]}
            scale={[0.22, 0.2, 0.19]}
            active={active("ribs")}
          />
        ))}

        {[1.95, 1.78, 1.61, 1.46].map((y, index) => (
          <mesh
            key={index}
            position={[0, y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 0.72, 0.7]}
          >
            <torusGeometry args={[0.4 - index * 0.035, 0.009, 8, 48]} />
            <meshBasicMaterial
              color="#68cbd8"
              transparent
              opacity={0.65}
            />
          </mesh>
        ))}

        <HumanLimb
          start={[0, 2.02, 0.205]}
          end={[0, 1.52, 0.2]}
          radius={0.025}
          active={active("ribs")}
        />
      </group>

      {/* SPINE AND ABDOMEN */}
      <group onClick={(e) => choose(e, "spine")}>
        <BodyShape
          position={[0, 1.22, 0]}
          scale={[0.32, 0.43, 0.2]}
          active={active("spine")}
        />

        <BodyShape
          position={[0, 0.91, 0]}
          scale={[0.29, 0.2, 0.19]}
          active={active("spine")}
        />

        <HumanLimb
          start={[0, 2.15, -0.16]}
          end={[0, 0.75, -0.12]}
          radius={0.045}
          active={active("spine")}
        />

        {Array.from({ length: 12 }, (_, i) => (
          <HumanJoint
            key={i}
            position={[0, 2.1 - i * 0.11, -0.145]}
            radius={0.035}
            active={active("spine")}
          />
        ))}

        {[1.4, 1.28, 1.16].map((y, index) => (
          <mesh key={index} position={[0, y, 0.19]}>
            <boxGeometry args={[0.2, 0.012, 0.01]} />
            <meshBasicMaterial
              color="#8cfaff"
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ARMS AND HANDS */}
      <group onClick={(e) => choose(e, "arms")}>
        {[-1, 1].map((side) => {
          const shoulder = [side * 0.43, 2.02, 0];
          const elbow = [side * 0.69, 1.43, 0.015];
          const wrist = [side * 0.79, 0.83, 0.04];
          const palm = [side * 0.82, 0.64, 0.08];

          return (
            <group key={side}>
              <BodyShape
                position={shoulder}
                scale={[0.2, 0.2, 0.2]}
                active={active("arms")}
              />

              <HumanLimb
                start={shoulder}
                end={elbow}
                radius={0.115}
                active={active("arms")}
              />

              <HumanJoint
                position={elbow}
                radius={0.105}
                active={active("arms")}
              />

              <HumanLimb
                start={elbow}
                end={wrist}
                radius={0.082}
                active={active("arms")}
              />

              <HumanJoint
                position={wrist}
                radius={0.065}
                active={active("arms")}
              />

              <BodyShape
                position={palm}
                scale={[0.105, 0.15, 0.055]}
                active={active("arms")}
              />

              {fingerPositions.map((offset, index) => {
                const length =
                  index === 0 ? 0.12 : 0.17 - Math.abs(offset) * 0.3;
                const x = side * (0.82 + offset);

                return (
                  <group key={index}>
                    <HumanLimb
                      start={[x, 0.57, 0.085]}
                      end={[
                        x + side * offset * 0.15,
                        0.57 - length,
                        0.09,
                      ]}
                      radius={index === 0 ? 0.025 : 0.018}
                      active={active("arms")}
                    />

                    <HumanJoint
                      position={[
                        x + side * offset * 0.15,
                        0.57 - length,
                        0.09,
                      ]}
                      radius={0.018}
                      active={active("arms")}
                    />
                  </group>
                );
              })}

              <HumanLimb
                start={[side * 0.73, 0.65, 0.09]}
                end={[side * 0.67, 0.52, 0.1]}
                radius={0.025}
                active={active("arms")}
              />
            </group>
          );
        })}
      </group>

      {/* PELVIS AND HIPS */}
      <group onClick={(e) => choose(e, "pelvis")}>
        <BodyShape
          position={[0, 0.66, 0]}
          scale={[0.36, 0.25, 0.22]}
          active={active("pelvis")}
        />

        {[-1, 1].map((side) => (
          <BodyShape
            key={side}
            position={[side * 0.3, 0.57, 0]}
            scale={[0.15, 0.18, 0.19]}
            active={active("pelvis")}
          />
        ))}

        <mesh position={[0, 0.63, 0.205]}>
          <torusGeometry args={[0.23, 0.018, 8, 32]} />
          <meshBasicMaterial color="#8afaff" />
        </mesh>
      </group>

      {/* LEGS AND FEET */}
      <group onClick={(e) => choose(e, "legs")}>
        {[-1, 1].map((side) => {
          const hip = [side * 0.22, 0.48, 0];
          const knee = [side * 0.24, -0.38, 0.015];
          const ankle = [side * 0.25, -1.15, 0.015];

          return (
            <group key={side}>
              <BodyShape
                position={[side * 0.23, 0.06, 0]}
                scale={[0.16, 0.48, 0.17]}
                active={active("legs")}
              />

              <HumanLimb
                start={hip}
                end={knee}
                radius={0.12}
                active={active("legs")}
              />

              <BodyShape
                position={knee}
                scale={[0.115, 0.13, 0.13]}
                active={active("legs")}
              />

              <HumanLimb
                start={knee}
                end={ankle}
                radius={0.09}
                active={active("legs")}
              />

              <BodyShape
                position={[side * 0.25, -0.76, -0.005]}
                scale={[0.11, 0.3, 0.12]}
                active={active("legs")}
              />

              <HumanJoint
                position={ankle}
                radius={0.07}
                active={active("legs")}
              />

              <BodyShape
                position={[side * 0.25, -1.27, 0.13]}
                scale={[0.13, 0.09, 0.25]}
                active={active("legs")}
              />

              {[-0.08, -0.04, 0, 0.04, 0.08].map((offset, index) => (
                <BodyShape
                  key={index}
                  position={[side * 0.25 + offset, -1.29, 0.33]}
                  scale={[0.025, 0.035, 0.09 - index * 0.009]}
                  active={active("legs")}
                />
              ))}
            </group>
          );
        })}
      </group>

      {/* SCANNING BEAM */}
      <mesh
        ref={scanRef}
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.2, 2.4]} />
        <meshBasicMaterial
          color="#00c5dc"
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* HOLOGRAM BASE */}
      <mesh
        position={[0, -1.43, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.75, 0.012, 12, 80]} />
        <meshBasicMaterial
          color="#00bfd8"
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function BodyInSpace3D() {
  const [selected, setSelected] = useState("spine");
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [voiceError, setVoiceError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tourRun, setTourRun] = useState(0);

  const currentPart = bodyParts[selected];

  // ===================================================
  // NARRATION
  // ===================================================

  useEffect(() => {
    if (!isTourPlaying) return;

    if (!("speechSynthesis" in window)) {
      setVoiceError("Your browser does not support voice narration.");
      setIsTourPlaying(false);
      return;
    }

    const partId = tourStops[tourIndex];
    const part = bodyParts[partId];

    setSelected(partId);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(part.narration);

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);

      if (tourIndex < tourStops.length - 1) {
        setTourIndex((current) => current + 1);
      } else {
        setIsTourPlaying(false);
        setIsPaused(false);
        setIsRotating(false);
        setTourIndex(0);
      }
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);

      if (event.error === "canceled" || event.error === "interrupted") {
        return;
      }

      setIsTourPlaying(false);
      setIsRotating(false);
      setVoiceError("Voice narration could not be played.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isTourPlaying, tourIndex, tourRun]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ===================================================
  // TOUR CONTROLS
  // ===================================================

  function startTour(fromPart = "skull") {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Your browser does not support voice narration.");
      return;
    }

    const startIndex = tourStops.indexOf(fromPart);

    window.speechSynthesis.cancel();

    setVoiceError("");
    setTourIndex(startIndex >= 0 ? startIndex : 0);
    setIsPaused(false);
    setIsTourPlaying(true);
    setIsRotating(true);
    setTourRun((run) => run + 1);
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
    window.speechSynthesis?.cancel();
    setIsTourPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setIsRotating(false);
    setTourIndex(0);
  }

  function restartTour() {
    window.speechSynthesis?.cancel();

    setIsPaused(false);
    setIsSpeaking(false);
    setIsTourPlaying(false);
    setIsRotating(true);
    setTourIndex(0);
    setTourRun((run) => run + 1);
    setIsTourPlaying(true);
  }

  function choosePart(id) {
    setSelected(id);

    if (isTourPlaying) {
      startTour(id);
    }
  }

  // ===================================================
  // INTERFACE
  // ===================================================

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-[#08111d] text-white shadow-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,116,144,0.12),_transparent_55%)]" />

      <div className="relative space-y-5 p-4 sm:p-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
             Human physiology laboratory
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              The Human Body <span className="text-cyan-300">in Space</span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Investigate how microgravity affects the human body. Select an
              anatomical region or follow ASTRA through the guided lesson.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsRotating((value) => !value)}
              className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-500 hover:bg-slate-700"
            >
              {isRotating ? "Rotation on" : "Rotation off"}
            </button>

            {!isTourPlaying ? (
              <button
                onClick={() => startTour("skull")}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500"
              >
                Start ASTRA tour
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                {!isPaused ? (
                  <button
                    onClick={pauseTour}
                    className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeTour}
                    className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                  >
                    Resume
                  </button>
                )}

                <button
                  onClick={restartTour}
                  className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  Restart
                </button>

                <button
                  onClick={stopTour}
                  className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/10"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TOUR STATUS */}
        {isTourPlaying && (
          <div className="rounded-xl border border-cyan-800/70 bg-cyan-950/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  ASTRA guided lesson
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {isPaused
                    ? "Tour paused"
                    : `Now exploring: ${currentPart.name}`}
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs text-slate-300">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPaused
                      ? "bg-amber-400"
                      : "animate-pulse bg-emerald-400"
                  }`}
                />
                {isPaused
                  ? "Paused"
                  : isSpeaking
                    ? "ASTRA speaking"
                    : "Preparing narration"}
              </span>
            </div>

            <div className="mt-4 flex gap-1.5">
              {tourStops.map((part, index) => (
                <div
                  key={part}
                  className={`h-1 flex-1 rounded-full ${
                    index <= tourIndex ? "bg-cyan-400" : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-right text-[10px] text-slate-400">
              Part {tourIndex + 1} of {tourStops.length}
            </p>
          </div>
        )}

        {voiceError && (
          <p className="rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-200">
            {voiceError}
          </p>
        )}

        {/* THREE COLUMN EXPLORER */}
        <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)_270px]">
          {/* LEFT: BODY NAVIGATION */}
          <aside className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
            <div className="mb-3 px-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Anatomical systems
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
              {Object.entries(bodyParts).map(([id, part], index) => {
                const active = selected === id;

                return (
                  <button
                    key={id}
                    onClick={() => choosePart(id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-cyan-500/60 bg-cyan-950/50"
                        : "border-slate-700/60 bg-slate-950/50 hover:border-slate-500 hover:bg-slate-800/70"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${
                        active
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      0{index + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs font-medium ${
                          active ? "text-cyan-200" : "text-slate-200"
                        }`}
                      >
                        {part.name}
                      </span>

                      <span className="mt-0.5 block text-[10px] text-slate-500">
                        Anatomical region
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden rounded-lg border border-slate-700/60 bg-slate-950/50 p-3 xl:block">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                How to explore
              </p>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Select an anatomical region or click the 3D human model to
                investigate how it responds to microgravity.
              </p>
            </div>
          </aside>

          {/* CENTRE: 3D HUMAN */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-700/70 bg-[#071321]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Anatomical visualisation
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Interactive 3D human model
                </p>
              </div>

              <span className="rounded-md border border-slate-600 bg-slate-800/70 px-3 py-1 text-[10px] text-slate-300">
                {isSpeaking ? "ASTRA active" : "System ready"}
              </span>
            </div>

            <div className="relative h-[430px] w-full sm:h-[530px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,116,144,0.16),_transparent_65%)]" />

              <Canvas
                camera={{ position: [0, 0.8, 7.5], fov: 42 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true }}
              >
                <color attach="background" args={["#071321"]} />
                <fog attach="fog" args={["#071321", 7, 15]} />

                <ambientLight intensity={1.4} />

                <directionalLight
                  position={[4, 6, 5]}
                  intensity={2}
                  color="#b7faff"
                />

                <pointLight
                  position={[-4, 2, 3]}
                  intensity={1.4}
                  color="#009dff"
                />

                <pointLight
                  position={[0, -1, -3]}
                  intensity={1.2}
                  color="#00b9d4"
                />

                <HumanModel
                  selected={selected}
                  onSelect={choosePart}
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
                  target={[0, 0.75, 0]}
                />
              </Canvas>

              <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="rounded-md border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-[10px] text-slate-400 backdrop-blur">
                  Drag to rotate | Scroll to zoom | Select a body section
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-slate-950/50 px-4 py-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Selected region: {currentPart.name}
              </div>

              <button
                onClick={() => setIsRotating((value) => !value)}
                className="text-[10px] font-medium text-cyan-300 hover:text-cyan-100"
              >
                {isRotating
                  ? "Disable auto-rotation"
                  : "Enable auto-rotation"}
              </button>
            </div>
          </div>

          {/* RIGHT: ASTRA INSTRUCTOR */}
          <aside className="flex flex-col rounded-xl border border-slate-700/70 bg-slate-900/70 p-4">
            <div className="border-b border-white/10 pb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Mission instructor
              </p>

              <div className="mt-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-wide">ASTRA</h3>

                <span className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Human physiology specialist
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Selected anatomical region
              </p>

              <h4 className="mt-2 text-sm font-semibold text-cyan-200">
                {currentPart.name}
              </h4>

              <p className="mt-1 text-[10px] text-slate-500">
                {currentPart.subtitle}
              </p>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-300">
              {currentPart.description}
            </p>

            <div className="mt-4 rounded-lg border border-slate-700/70 bg-slate-950/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                Microgravity effect
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                {currentPart.effect}
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-slate-700/70 bg-slate-950/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                Scientific fact
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                {currentPart.fact}
              </p>
            </div>

            <div className="mt-auto pt-4">
              {!isTourPlaying && (
                <button
                  onClick={() => startTour(selected)}
                  className="w-full rounded-lg border border-cyan-700/70 bg-cyan-950/50 px-3 py-3 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-900/60"
                >
                  Listen to ASTRA
                </button>
              )}

              {isTourPlaying && (
                <p className="rounded-lg border border-cyan-800/60 bg-cyan-950/40 px-3 py-3 text-center text-[10px] text-cyan-200">
                  {isPaused
                    ? "ASTRA narration is paused"
                    : "ASTRA is guiding your lesson"}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* LEARNING SUMMARY */}
        <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Current region
            </p>

            <p className="mt-2 text-sm font-medium text-white">
              {currentPart.name}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Learning objective
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-300">
              Understand how microgravity affects the human body.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Lesson progress
            </p>

            <p className="mt-2 text-sm font-medium text-cyan-200">
              {tourIndex + 1} / {tourStops.length} anatomy sections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
