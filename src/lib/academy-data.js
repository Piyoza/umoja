export const ACADEMY_MODULES = [
  {
    id: "life-support",
    title: "Life Support & Oxygen",
    summary: "How spacecraft make breathable air and keep it breathable.",
    lessons: [
      {
        id: "life-support-1",
        title: "Making oxygen in orbit",
        minutes: 6,
        body: [
          "Most crewed spacecraft do not carry all their oxygen as tanks. The International Space Station's Oxygen Generation Assembly takes recycled water and splits it with electricity through electrolysis, producing oxygen for the cabin and hydrogen that is either vented or fed back into the carbon dioxide removal system.",
          "That means oxygen supply is tied to power and water. If electrical power falls, oxygen generation falls with it — which is why life support is wired to the essential electrical bus.",
        ],
        keyPoints: [
          "Electrolysis of water produces breathable oxygen and hydrogen.",
          "Oxygen generation depends on electrical power and a water supply.",
          "Cabin oxygen is recycled: exhaled CO2 is removed and the water is recovered.",
        ],
      },
      {
        id: "life-support-2",
        title: "Partial pressure and the oxygen safety band",
        minutes: 5,
        body: [
          "Crew health depends on the partial pressure of oxygen — the share of total cabin pressure that oxygen contributes. A cabin at a lower total pressure can still be safe if the oxygen fraction is high enough, and a cabin at sea-level pressure can still be dangerous if the oxygen fraction is too low.",
          "Training simulators often use a 16–18% oxygen threshold as a simplified crew-safety limit. Below that, judgement and physical performance degrade before a crew member notices.",
        ],
        keyPoints: [
          "Partial pressure of oxygen, not percentage alone, determines breathing safety.",
          "Hypoxia symptoms appear gradually and reduce decision quality.",
          "Adding gas to a leaking cabin increases the leak rate.",
        ],
      },
    ],
  },
  {
    id: "pressure-atmosphere",
    title: "Pressure & Atmosphere",
    summary: "Pressure differentials, hull breaches and isolating a damaged module.",
    lessons: [
      {
        id: "pressure-1",
        title: "What a hull breach really does",
        minutes: 6,
        body: [
          "A spacecraft cabin holds roughly one atmosphere against the vacuum outside. When the hull is breached, gas rushes out until the pressures equalise — fast for a large hole, slow for a micrometeoroid puncture.",
          "The first response is almost always the same: isolate the volume. Closing a hatch on an empty module saves the atmosphere in the rest of the spacecraft, and the repair can be planned without racing the leak.",
        ],
        keyPoints: [
          "Leak rate depends on the size of the hole and the pressure difference.",
          "Isolate the damaged volume before attempting a repair.",
          "Expanding gas cools the cabin, so temperature is a useful leak indicator.",
        ],
      },
      {
        id: "pressure-2",
        title: "Prebreathe and pressure changes",
        minutes: 5,
        body: [
          "Before a spacewalk, crew members reduce the nitrogen in their bodies by breathing pure oxygen — a protocol called prebreathe. Without it, nitrogen bubbles can form in tissue when pressure drops, causing decompression sickness.",
          "Joint pain, tingling and fatigue after a pressure change are warning signs that need oxygen and medical advice, not rest.",
        ],
        keyPoints: [
          "Prebreathe removes nitrogen before low-pressure exposure.",
          "Decompression sickness is caused by nitrogen bubbles forming in tissue.",
          "High-flow oxygen and pressure treatment are the standard responses.",
        ],
      },
    ],
  },
  {
    id: "power-systems",
    title: "Electrical Power Systems",
    summary: "Solar arrays, batteries, buses and load shedding.",
    lessons: [
      {
        id: "power-1",
        title: "How spacecraft power is organised",
        minutes: 6,
        body: [
          "Solar arrays generate power in sunlight and batteries carry the spacecraft through eclipse. Power is distributed across buses — separate electrical paths — so a fault on one bus cannot take down everything at once.",
          "Essential loads such as life support, guidance and communications are grouped on protected buses. Non-essential loads like experiment racks and spare heaters are the first things to switch off when power becomes scarce.",
        ],
        keyPoints: [
          "Batteries are sized for eclipse periods, not for indefinite supply.",
          "Bus separation prevents single faults from cascading.",
          "Shedding non-essential loads is the fastest way to buy time.",
        ],
      },
      {
        id: "power-2",
        title: "Diagnosing a tripped bus",
        minutes: 5,
        body: [
          "A bus that trips repeatedly is telling you something is still wrong. Resetting it without removing the cause just repeats the trip and costs battery charge.",
          "Look for the parameter that changed first: a warm regulator, a spiking motor current or an array current that fluctuates. Restore power gradually, essential loads first.",
        ],
        keyPoints: [
          "Repeated trips indicate an uncorrected fault.",
          "Temperature and current are the earliest fault indicators.",
          "Restore loads in stages to avoid voltage spikes.",
        ],
      },
    ],
  },
  {
    id: "comms-systems",
    title: "Communications",
    summary: "Antennas, pointing, loss of signal and backup paths.",
    lessons: [
      {
        id: "comms-1",
        title: "Antennas and why links drop",
        minutes: 5,
        body: [
          "A high-gain antenna concentrates signal into a narrow beam: it carries high data rates but must be pointed precisely. A low-gain antenna spreads signal widely and works without fine pointing, at much lower bandwidth.",
          "Most loss-of-signal events come from pointing, power or a hardware fault, not from the ground station disappearing.",
        ],
        keyPoints: [
          "High-gain antennas need accurate pointing for high data rates.",
          "Low-gain antennas are the usual backup path.",
          "Check pointing, power and hardware before assuming a ground fault.",
        ],
      },
      {
        id: "comms-2",
        title: "Working without the ground",
        minutes: 5,
        body: [
          "When contact is lost, the crew still has onboard navigation data, stored command sequences and the fault log. Resetting a system can erase the evidence needed to diagnose it.",
          "Establish any working link as soon as possible, even a weak one, because the ground team can then help plan the recovery.",
        ],
        keyPoints: [
          "Onboard navigation data can confirm whether a manoeuvre completed.",
          "Preserve fault logs before resetting hardware.",
          "Restore even a low-bandwidth link to regain ground support.",
        ],
      },
    ],
  },
  {
    id: "navigation-guidance",
    title: "Navigation & Guidance",
    summary: "Star trackers, attitude solutions and certified burns.",
    lessons: [
      {
        id: "nav-1",
        title: "How a spacecraft knows where it is",
        minutes: 6,
        body: [
          "Attitude and position come from several sensors combined in a navigation filter: star trackers for orientation, sun sensors for coarse attitude, gyroscopes for rate and accelerometers for velocity change.",
          "When one sensor fails, the filter keeps running on the others, but the uncertainty in the solution grows. Uncertainty is a number the crew watches, not a feeling.",
        ],
        keyPoints: [
          "Navigation combines multiple sensors, not one.",
          "Uncertainty grows when a sensor is lost.",
          "A backup star tracker plus calibration restores the solution.",
        ],
      },
      {
        id: "nav-2",
        title: "Certifying a burn",
        minutes: 5,
        body: [
          "A manoeuvre is only executed once the navigation solution meets a defined accuracy threshold. Burning on a degraded solution can put a spacecraft into an orbit it was never designed for.",
          "Aborting a burn is a legitimate outcome. A delayed manoeuvre costs mission time; an uncertified one can cost the mission.",
        ],
        keyPoints: [
          "Never burn on an uncertified state vector.",
          "Calibration lets the filter converge after a sensor switch.",
          "Abort and replan is a safe, professional decision.",
        ],
      },
    ],
  },
  {
    id: "crew-health",
    title: "Crew Health in Space",
    summary: "Medical emergencies, decompression sickness and crew workload.",
    lessons: [
      {
        id: "health-1",
        title: "Medical emergencies far from help",
        minutes: 6,
        body: [
          "The flight surgeon on the ground is a crew member's most important medical resource, but they are minutes to hours away. Crew members are trained to stabilise first: oxygen, position, monitoring and communication.",
          "In microgravity, fluids shift toward the head and the body's normal warning signs can look different, which makes early symptoms easy to underestimate.",
        ],
        keyPoints: [
          "Stabilise the patient before diagnosing.",
          "High-flow oxygen and monitoring are common first steps.",
          "Contact the flight surgeon early rather than late.",
        ],
      },
      {
        id: "health-2",
        title: "Workload after an injury",
        minutes: 4,
        body: [
          "A spacecraft designed for three crew does not become easy with two. When one crew member is recovering, the safe response is to reduce the task list and ask the ground for schedule relief.",
          "Pushing a reduced crew through a full task list increases the chance of a second, avoidable failure.",
        ],
        keyPoints: [
          "Reduce tasks when the crew is below full strength.",
          "Fatigue is a safety hazard, not a personal weakness.",
          "Ground support can rebalance the schedule.",
        ],
      },
    ],
  },
  {
    id: "human-spaceflight",
    title: "Human Spaceflight Fundamentals",
    summary: "Microgravity, the body in orbit and life aboard a station.",
    lessons: [
      {
        id: "human-1",
        title: "Living without weight",
        minutes: 5,
        body: [
          "Weightlessness is continuous free fall around Earth, not the absence of gravity. Astronauts still have mass, so moving a heavy object still requires force — only its weight disappears.",
          "Bones and muscles weaken without load, which is why crews exercise roughly two hours a day to limit bone density loss.",
        ],
        keyPoints: [
          "Orbiting is free fall, not zero gravity.",
          "Mass stays the same; weight changes with gravitational acceleration.",
          "Exercise limits bone and muscle loss.",
        ],
      },
      {
        id: "human-2",
        title: "Working as a crew",
        minutes: 4,
        body: [
          "Long-duration crews rely on clear roles, closed-loop communication and cross-checking. In an emergency, the person flying the response announces what they are doing so the rest of the crew can support or challenge it.",
          "This is exactly the behaviour an emergency simulation rewards: state the problem, check the data, then act.",
        ],
        keyPoints: [
          "Closed-loop communication prevents duplicate and missed actions.",
          "Announce actions so others can cross-check.",
          "Data first, then decision.",
        ],
      },
    ],
  },
  {
    id: "space-weather",
    title: "Space Weather",
    summary: "Solar flares, particle events and how spacecraft shelter.",
    lessons: [
      {
        id: "weather-1",
        title: "Solar particle events",
        minutes: 6,
        body: [
          "Solar flares can launch energetic particles that reach a spacecraft within minutes. The particles are stopped by mass, so the best shelter is usually wherever the most water, propellant or equipment surrounds the crew.",
          "Storms also heat Earth's upper atmosphere, which increases drag on spacecraft in low orbit and slowly lowers their altitude.",
        ],
        keyPoints: [
          "Particle events arrive minutes to hours after a flare.",
          "Mass shields crews; water stowage is a common shelter.",
          "Increased atmospheric drag lowers low orbits.",
        ],
      },
      {
        id: "weather-2",
        title: "Protecting electronics and the mission",
        minutes: 5,
        body: [
          "Energetic particles can flip bits in electronics, causing single-event upsets. Operators power down non-essential systems and rely on error-correcting memory during a storm.",
          "The crew stays sheltered until dose rates return to nominal — leaving early means absorbing radiation for no operational gain.",
        ],
        keyPoints: [
          "Single-event upsets are radiation-induced electronics faults.",
          "Powering down systems reduces exposure and risk.",
          "Shelter until dose rates normalise.",
        ],
      },
    ],
  },
  {
    id: "radiation",
    title: "Radiation & Shielding",
    summary: "Dose, dose rate and why shielding is a mass problem.",
    lessons: [
      {
        id: "radiation-1",
        title: "Dose and dose rate",
        minutes: 5,
        body: [
          "Dose is the total energy deposited in tissue; dose rate is how fast it arrives. A short, intense event can deliver more biological damage than a long, weak one.",
          "Spacecraft carry dosimeters so the crew can see the dose rate in real time and decide when to shelter.",
        ],
        keyPoints: [
          "Dose rate matters as much as total dose.",
          "Dosimeters give real-time radiation readings.",
          "Shelter decisions are driven by measured dose rate.",
        ],
      },
      {
        id: "radiation-2",
        title: "Shielding with what you have",
        minutes: 4,
        body: [
          "In deep space there is no atmosphere to absorb radiation. Shielding works by putting mass between the crew and the source: water, food, propellant tanks and structure all count.",
          "This is why future deep-space habitats place sleeping quarters inside or behind the largest water tanks.",
        ],
        keyPoints: [
          "Mass is shielding; water is especially effective.",
          "Deep space has no atmospheric protection.",
          "Habitat layout is a radiation-protection decision.",
        ],
      },
    ],
  },
  {
    id: "orbital-mechanics",
    title: "Orbital Mechanics",
    summary: "Velocity, altitude and why a small push moves the whole orbit.",
    lessons: [
      {
        id: "orb-1",
        title: "Speed decides altitude",
        minutes: 6,
        body: [
          "In orbit, adding velocity raises the far side of the orbit and lowers the near side. That is why a small engine burn changes the whole trajectory rather than just moving the spacecraft sideways.",
          "Orbital period follows the size of the orbit: lower orbits are faster, higher orbits slower. A spacecraft in a very low orbit can complete a revolution in about 90 minutes.",
        ],
        keyPoints: [
          "A prograde burn raises the opposite side of the orbit.",
          "A retrograde burn lowers it.",
          "Lower orbits have shorter periods.",
        ],
      },
      {
        id: "orb-2",
        title: "Unexplained delta-v",
        minutes: 5,
        body: [
          "Velocity changes have causes: a burn, a vent, a leak, a thruster failure or drag. Before correcting a drift, find the cause — otherwise the correction is planned against a moving target.",
          "Once the source is stopped, a verified state vector makes the correction a simple calculation.",
        ],
        keyPoints: [
          "Every unexplained delta-v has a physical cause.",
          "Stop the source before planning a correction.",
          "Correct only against a verified state vector.",
        ],
      },
    ],
  },
  {
    id: "systems-thinking",
    title: "Systems Thinking",
    summary: "How spacecraft systems depend on each other during an emergency.",
    lessons: [
      {
        id: "systems-1",
        title: "Everything is connected",
        minutes: 5,
        body: [
          "Oxygen generation needs power and water. Power needs arrays, regulators and thermal control. Communications need power and pointing. An emergency in one system rarely stays in that system.",
          "Systems thinking means asking what your next action will do to the systems that are still healthy.",
        ],
        keyPoints: [
          "Fixing one system can stress another.",
          "Trace dependencies before acting.",
          "Protect essential systems first.",
        ],
      },
      {
        id: "systems-2",
        title: "Prioritising under pressure",
        minutes: 5,
        body: [
          "A simple and reliable triage order works in most spacecraft emergencies: crew safety first, then containment of the fault, then recovery of the mission.",
          "Delaying a decision is itself a decision, because most emergencies get worse with time.",
        ],
        keyPoints: [
          "Crew safety, containment, recovery — in that order.",
          "Delay has a cost measured in system performance.",
          "Act on the best available data and keep monitoring.",
        ],
      },
    ],
  },
  {
    id: "astronomy-101",
    title: "Solar System Science",
    summary: "Planets, moons and the physics that shapes them.",
    lessons: [
      {
        id: "astro-1",
        title: "Two kinds of planet",
        minutes: 6,
        body: [
          "The four inner planets — Mercury, Venus, Earth and Mars — are small, rocky and dense. The four outer giants — Jupiter, Saturn, Uranus and Neptune — are much larger, less dense and made mostly of hydrogen, helium and ices.",
          "Gravity follows mass: Jupiter's surface gravity is about 2.5 times Earth's, while Mars has about 38% of Earth's gravity.",
        ],
        keyPoints: [
          "Terrestrial planets are rocky; giant planets are gas and ice rich.",
          "Surface gravity scales with mass and radius.",
          "Distance from the Sun drives surface temperature.",
        ],
      },
      {
        id: "astro-2",
        title: "Atmospheres and habitability",
        minutes: 5,
        body: [
          "Venus has a thick carbon dioxide atmosphere and a runaway greenhouse effect, making it hotter than Mercury despite being farther from the Sun. Mars has a thin CO2 atmosphere that cannot hold much heat.",
          "Earth's nitrogen–oxygen atmosphere and liquid water make it the only planet known to support life.",
        ],
        keyPoints: [
          "A thick CO2 atmosphere can trap heat far above expectations.",
          "Thin atmospheres cannot retain heat or block radiation well.",
          "Liquid water is a key habitability indicator.",
        ],
      },
    ],
  },

{
  
  id: "human-body-space",
  title: "The Human Body in Space",
  summary: "Discover how microgravity changes the human body through an interactive narrated 360-degree anatomy lesson.",
  lessons: [
    {
      id: "body-space-1",
      title: "What Happens to Your Body in Space?",
      minutes: 12,

      // This tells the lesson page which 3D component to render.
      component: "BodyInSpace3D",
      interactive: true,

      body: [
        "Space is an extraordinary environment. Without Earth's normal gravitational loading, the human body begins to adapt.",
        "Fluids shift toward the upper body, muscles and bones experience less loading, and the balance system must adapt to microgravity.",
        "Astronauts follow exercise programmes and medical monitoring to help manage these changes."
      ],

      keyPoints: [
        "Microgravity causes fluids to shift toward the head.",
        "Bones can lose density during long-duration spaceflight.",
        "Muscles weaken without regular exercise and loading.",
        "The balance system adapts to a new environment.",
        "Astronauts use exercise and medical monitoring to protect their health."
      ]
    }
  ]
},


];

export const ACADEMY_RESOURCES = {
  "life-support": [
    {
      id: "nasa-eclss",
      title: "Environmental Control and Life Support Systems",
      type: "pdf",
      description: "NASA explains oxygen generation, air cleaning, water recovery and cabin environmental control.",
      url: "https://www.nasa.gov/wp-content/uploads/2022/06/508318main_iss_ref_guide_nov2010.pdf",
      source: "NASA",
      audience: "Grades 6–12 and independent learners",
    },
    {
      id: "nasa-eclss-reference",
      title: "Environmental Control and Life Support Systems",
      type: "article",
      description: "Explore how the ISS recycles water, removes carbon dioxide and produces oxygen.",
      url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/",
      source: "NASA",
      audience: "All learners",
    },
  ],

  "pressure-atmosphere": [
    {
      id: "nasa-pressure-video",
      title: "Is There Pressure in Outer Space?",
      type: "video",
      description: "A NASA scientist explains pressure in the space environment.",
      url: "https://science.nasa.gov/eclips/videos/is-there-pressure-in-outer-space/",
      source: "NASA eClips",
      audience: "All learners",
    },
    {
      id: "nasa-pressure-activity",
      title: "Dressing for Altitude: Why Do We Need Pressure Suits?",
      type: "pdf",
      description: "Hands-on lessons about pressure, gases, vacuum and protective suits.",
      url: "https://www.nasa.gov/stem-content/dressing-for-altitude-why-do-we-really-need-pressure-suits/",
      source: "NASA STEM",
      audience: "Grades 5–12",
    },
  ],

  "power-systems": [
    {
      id: "nasa-solar-energy",
      title: "STEMonstrations: Solar Energy",
      type: "video",
      description: "An astronaut explains how solar arrays provide energy to the International Space Station.",
      url: "https://www.nasa.gov/stem-content/stemonstrations-solar-energy/",
      source: "NASA STEM",
      audience: "Grades 9–12",
    },
    {
      id: "nasa-iss-power-pdf",
      title: "International Space Station Reference Guide: Electrical Power",
      type: "pdf",
      description: "Technical diagrams and explanations of solar arrays, batteries and electrical distribution.",
      url: "https://www.nasa.gov/wp-content/uploads/2022/06/508318main_iss_ref_guide_nov2010.pdf",
      source: "NASA",
      audience: "Advanced learners",
    },
  ],

  "comms-systems": [
    {
      id: "nasa-dsn-communication",
      title: "How Do We Communicate With Faraway Spacecraft?",
      type: "video",
      description: "Learn how NASA sends commands and receives information using the Deep Space Network.",
      url: "https://www.nasa.gov/stem-content/deep-space-network-explainer-video-how-do-we-communicate-with-faraway-spacecraft/",
      source: "NASA",
      audience: "Grades 5–12",
    },
    {
      id: "nasa-dsn-kids",
      title: "How Does NASA Communicate with Spacecraft in Deep Space?",
      type: "lesson",
      description: "A learner-friendly explanation of radio antennas and deep-space communication.",
      url: "https://spaceplace.nasa.gov/dsn-antennas/en/",
      source: "NASA Space Place",
      audience: "Younger learners",
    },
  ],

  "navigation-guidance": [
    {
      id: "nasa-spacecraft-tracking",
      title: "How Do We Know Where Faraway Spacecraft Are?",
      type: "video",
      description: "Discover how NASA tracks distant spacecraft using radio signals and the Doppler effect.",
      url: "https://www.nasa.gov/stem-content/deep-space-network-explainer-video-how-do-we-know-where-faraway-spacecraft-are/",
      source: "NASA",
      audience: "Grades 5–12",
    },
    {
      id: "nasa-gravity-radio",
      title: "How NASA Uses Gravity and Radio Waves to Study Planets and Moons",
      type: "video",
      description: "See how scientists use radio signals to investigate planetary motion and gravity.",
      url: "https://www.nasa.gov/stem-content/how-nasa-uses-gravity-and-radio-waves-to-study-planets-and-moons-video/",
      source: "NASA",
      audience: "Grades 5–12",
    },
  ],

  "crew-health": [
    {
      id: "nasa-fluid-shifts",
      title: "Our World: Fluid Shift",
      type: "video",
      description: "Learn how microgravity changes fluid movement in the human body.",
      url: "https://science.nasa.gov/eclips/videos/fluid-shift/",
      source: "NASA eClips",
      audience: "Grades K–12",
    },
    {
      id: "nasa-human-research",
      title: "NASA Human Research Program Videos",
      type: "video",
      description: "Explore astronaut exercise, blood studies, health, pressure changes and long-duration spaceflight research.",
      url: "https://www.nasa.gov/hrp/hrp-videos/",
      source: "NASA Human Research Program",
      audience: "All learners",
    },
  ],

  "human-spaceflight": [
    {
      id: "nasa-train-astronaut",
      title: "Train Like an Astronaut",
      type: "activity",
      description: "Physical and inquiry-based activities inspired by astronaut training.",
      url: "https://www.nasa.gov/stem-content/train-like-an-astronaut/",
      source: "NASA STEM",
      audience: "Grades 5–12",
    },
    {
      id: "nasa-astronaut-health",
      title: "NASA Human Research Program Videos",
      type: "video",
      description: "See how NASA studies the effects of spaceflight on the human body.",
      url: "https://www.nasa.gov/hrp/hrp-videos/",
      source: "NASA",
      audience: "All learners",
    },
  ],

  "space-weather": [
    {
      id: "nasa-space-weather-video",
      title: "Real World: Space Weather",
      type: "video",
      description: "Understand solar activity and how space weather affects Earth and spacecraft.",
      url: "https://science.nasa.gov/eclips/videos/space-weather/",
      source: "NASA eClips",
      audience: "Grades K–8",
    },
    {
      id: "nasa-donki",
      title: "NASA DONKI Space Weather Database",
      type: "data",
      description: "Explore recorded solar flares, coronal mass ejections, solar energetic particles and geomagnetic storms.",
      url: "https://ccmc.gsfc.nasa.gov/tools/DONKI/",
      source: "NASA Community Coordinated Modeling Center",
      audience: "Advanced learners",
    },
  ],

  "radiation": [
    {
      id: "nasa-ray-shielding",
      title: "Ray Shielding Activity",
      type: "pdf",
      description: "Investigate how different materials can shield against simulated radiation.",
      url: "https://www.nasa.gov/stem-content/ray-shielding-activity/",
      source: "NASA STEM",
      audience: "Grades K–8",
    },
    {
      id: "nasa-radiation-activity",
      title: "Activity One: Radiation",
      type: "activity",
      description: "Investigate radiation exposure and why shielding matters for deep-space astronauts.",
      url: "https://www.nasa.gov/stem-content/activity-one-radiation/",
      source: "NASA STEM",
      audience: "Grades 5–8",
    },
    {
      id: "nasa-radiation-math",
      title: "Space Math: Radiation Problems",
      type: "pdf",
      description: "Practice mathematical problems involving radiation exposure, rates and shielding.",
      url: "https://science.nasa.gov/learn/heat/resource/space-math-at-nasa-math-problems-related-to-radiation/",
      source: "NASA Space Math",
      audience: "Grades K–12+",
    },
  ],

  "orbital-mechanics": [
    {
      id: "nasa-orbital-mechanics",
      title: "Space Flight: The Application of Orbital Mechanics",
      type: "video",
      description: "A detailed NASA primer on orbital mechanics, originally intended for college-level physics students.",
      url: "https://plus.nasa.gov/video/space-flight-the-application-of-orbital-mechanics/",
      source: "NASA+",
      audience: "Advanced learners",
    },
    {
      id: "nasa-orbits",
      title: "STEMonstrations: Orbits",
      type: "lesson",
      description: "An astronaut demonstrates spacecraft orbits with a related classroom mathematics activity.",
      url: "https://www.nasa.gov/stem-content/stemonstrations-orbits/",
      source: "NASA STEM",
      audience: "Grades 9–12",
    },
    {
      id: "jpl-horizons",
      title: "NASA JPL Horizons",
      type: "data",
      description: "Explore real solar-system positions, velocities and orbital information for planets, moons and other objects.",
      url: "https://ssd.jpl.nasa.gov/horizons/app.html",
      source: "NASA Jet Propulsion Laboratory",
      audience: "Advanced learners",
    },
  ],

  "systems-thinking": [
    {
      id: "nasa-stem-catalogue",
      title: "NASA Science Educational Resource Catalogue",
      type: "library",
      description: "Search NASA's educational resources for engineering, science, technology and mission-related learning.",
      url: "https://www.nasa.gov/stem-content/science-educational-resource-catalog/",
      source: "NASA STEM",
      audience: "Educators and learners",
    },
    {
      id: "nasa-iss-reference",
      title: "International Space Station Reference Guide",
      type: "pdf",
      description: "Study how real station systems connect, including power, life support, communications and thermal control.",
      url: "https://www.nasa.gov/wp-content/uploads/2022/06/508318main_iss_ref_guide_nov2010.pdf",
      source: "NASA",
      audience: "Advanced learners",
    },
  ],

  "astronomy-101": [
    {
      id: "nasa-solar-system",
      title: "NASA Solar System Exploration",
      type: "data",
      description: "Explore NASA information, images and facts about planets, moons, asteroids and comets.",
      url: "https://science.nasa.gov/solar-system/",
      source: "NASA Science",
      audience: "All learners",
    },
    {
      id: "jpl-planet-data",
      title: "JPL Planetary Orbits and Ephemerides",
      type: "data",
      description: "Explore accurate planetary positions, orbital information and ephemeris data.",
      url: "https://ssd.jpl.nasa.gov/planets/orbits.html",
      source: "NASA Jet Propulsion Laboratory",
      audience: "Advanced learners",
    },
  ],

  "human-body-space": [
    {
      id: "nasa-fluid-shift-body",
      title: "Our World: Fluid Shift",
      type: "video",
      description: "Watch how fluid movement changes in microgravity and how NASA studies those changes.",
      url: "https://science.nasa.gov/eclips/videos/fluid-shift/",
      source: "NASA eClips",
      audience: "Grades K–12",
    },
    {
      id: "nasa-bone-muscle",
      title: "How Space Exploration Affects Bones and Muscles",
      type: "video",
      description: "Explore the effects of microgravity on bones, muscles and astronaut fitness.",
      url: "https://www.nasa.gov/hrp/hrp-videos/",
      source: "NASA Human Research Program",
      audience: "All learners",
    },
    {
      id: "nasa-exercise",
      title: "Physically Fit on Earth and Beyond",
      type: "video",
      description: "Explore how exercise helps astronauts maintain strength and health in reduced gravity.",
      url: "https://science.nasa.gov/eclips/videos/physically-fit-on-earth-and-beyond/",
      source: "NASA eClips",
      audience: "Grades 3–12",
    },
  ],
};

export function getModuleResources(moduleId) {
  return ACADEMY_RESOURCES[moduleId] || [];
}


export const ALL_LESSONS = ACADEMY_MODULES.flatMap((module) =>
  module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id, moduleTitle: module.title })),
);

export const TOTAL_LESSONS = ALL_LESSONS.length;

export function getLesson(id) {
  return ALL_LESSONS.find((lesson) => lesson.id === id) || null;
}

export function getModule(id) {
  return ACADEMY_MODULES.find((module) => module.id === id) || null;
}