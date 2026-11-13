// Educational simulation content. Values are illustrative training figures,
// not operational spacecraft procedures.

const opt = (id, label, detail, quality, next, extra = {}) => ({
  id,
  label,
  detail,
  quality,
  next,
  effects: {},
  severity: 0,
  timeCost: 20,
  ...extra,
});

export const SCENARIOS = [
  {
    id: "oxygen-malfunction",
    code: "SIM-01",
    title: "Oxygen System Malfunction",
    system: "Life Support",
    tagline: "Oxygen reserves are falling faster than the generator can replace them.",
    brief:
      "You are the duty flight engineer aboard training vessel ASTRA-1 with three crew on board. Early in a routine orbital maintenance cycle the cabin oxygen monitor begins a steady downward trend while the O2 generator still reports NOMINAL.",
    objective:
      "Find where the oxygen is going, restore generation and keep cabin oxygen above the 16% crew safety threshold.",
    duration: 300,
    startSeverity: 22,
    start: { oxygen: 88, pressure: 97, power: 94, temperature: 21.5, comms: 92 },
    drift: { oxygen: -0.09, pressure: -0.03, power: -0.04, temperature: 0.004, comms: 0 },
    principles: [
      "Oxygen generation aboard a spacecraft usually splits water by electrolysis into O2 and hydrogen — it adds gas to the cabin but cannot fix a leak.",
      "Crew breathing depends on the partial pressure of oxygen, not just the percentage, so both cabin pressure and O2 concentration matter.",
      "Gas flows from high to low pressure: raising cabin pressure on a leaking hull increases the leak rate.",
    ],
    recommendedModules: ["life-support", "pressure-atmosphere"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Oxygen trend detected",
        brief:
          "The O2 monitor has fallen 3% in six minutes. The generator reads NOMINAL, so oxygen is probably leaving the cabin rather than failing to be produced. An amber caution light is pulsing.",
        note: "O2 generation: NOMINAL · Leak sensors: 3 of 4 online",
        options: [
          opt("manifold", "Run an isolation leak check on the O2 feed manifold", "Close the starboard feed valve and watch the pressure-decay signature.", "good", "manifold-leak", {
            effects: { oxygen: -1.5, pressure: -1 },
            severity: -4,
            consequence: "The isolation test shows a steady pressure decay on the starboard feed line — there is a leak.",
            hint: "Generation is nominal, so find the escape path before adding more gas.",
          }),
          opt("maxflow", "Command the O2 generator to maximum output", "Push generation to 100% to out-run the loss.", "poor", "overpressure", {
            effects: { oxygen: 3, pressure: 4, power: -4 },
            severity: 8,
            consequence: "Feed pressure rises and the leak widens. Cabin oxygen gains briefly, then falls faster than before.",
            hint: "Adding oxygen to a leaking cabin raises pressure and increases the leak rate.",
          }),
          opt("wait", "Log the trend and wait for the next telemetry cycle", "The reading may be a sensor glitch.", "poor", "symptoms", {
            effects: { oxygen: -5, crew: -5 },
            severity: 10,
            consequence: "Three more minutes pass, oxygen drops another 4% and a crew member reports a headache.",
            hint: "A persistent trend in several parameters is real data, not a glitch.",
          }),
        ],
      },
      "manifold-leak": {
        title: "Leak located on the starboard feed",
        brief:
          "Decay data points to a slow leak in the starboard O2 feed. Oxygen is now below the planned reserve. You must stop the loss without starving the crew of breathable gas.",
        note: "Starboard feed line: isolated · Cabin O2: 79%",
        options: [
          opt("cap-feed", "Close the starboard feed and switch to the backup supply", "Isolate the damaged line and bring the reserve tank online.", "good", null, {
            effects: { oxygen: 9, pressure: 2, power: -2 },
            severity: -16,
            consequence: "The leak is isolated. Reserve oxygen brings the cabin back above the safety threshold.",
            ending: { status: "stabilised", summary: "Leak isolated and oxygen restored from the reserve supply." },
          }),
          opt("patch", "Send a crew member outside to patch the line now", "An EVA repair would remove the leak at its source.", "ok", "eva", {
            effects: { oxygen: -4, pressure: -2, power: -3 },
            severity: 3,
            consequence: "An unscheduled EVA costs time and cabin gas before the repair even begins.",
            hint: "Ask whether the backup systems can stabilise the cabin first.",
          }),
        ],
      },
      eva: {
        title: "EVA preparation",
        brief:
          "The crew is preparing for a spacewalk. The airlock cycle itself vents cabin gas, and every minute outside costs oxygen you do not have to spare.",
        note: "Airlock prep 40% · Cabin O2: 71%",
        options: [
          opt("delay-eva", "Stand down the EVA and use the reserve supply", "Stabilise the cabin first; repair the line on the next maintenance window.", "good", null, {
            effects: { oxygen: 8, pressure: 2 },
            severity: -12,
            consequence: "Reserve oxygen restores the cabin. The failed line is capped for later repair.",
            ending: { status: "stabilised", summary: "Crew kept safe by prioritising cabin oxygen over an immediate repair." },
          }),
          opt("continue-eva", "Continue the EVA as planned", "Finish the repair even though the airlock cycle costs oxygen.", "poor", null, {
            effects: { oxygen: -7, pressure: -5, crew: -8 },
            severity: 14,
            consequence: "The airlock cycle vents gas, the cabin drops further and the crew returns to a depleted atmosphere.",
            ending: { status: "critical", summary: "Repair completed, but the cabin was dangerously depleted during the spacewalk." },
          }),
        ],
      },
      overpressure: {
        title: "Leak rate increasing",
        brief:
          "Cabin pressure is now above nominal because of the extra oxygen, and the leak has grown with it. Two warning indicators are active.",
        note: "Cabin pressure: 104% · O2: 76% · Leak rate: rising",
        options: [
          opt("reduce-and-isolate", "Reduce generator output, then isolate the starboard feed", "Back off generation and test the feed line for the leak.", "good", "manifold-leak", {
            effects: { oxygen: -1, pressure: -3, power: 1 },
            severity: -6,
            consequence: "Generation is reduced and the manifold test confirms a starboard feed leak.",
          }),
          opt("vent", "Vent cabin gas to space to bring pressure down", "Open the pressure relief valve to reduce overpressure.", "poor", null, {
            effects: { oxygen: -9, pressure: -9, crew: -6 },
            severity: 18,
            consequence: "Venting dumps breathable oxygen overboard and pressure falls below the safe band.",
            ending: { status: "critical", summary: "Overpressure was treated by venting breathable gas, leaving the cabin critically depleted." },
          }),
        ],
      },
      symptoms: {
        title: "Crew reporting hypoxia symptoms",
        brief:
          "One crew member is light-headed and breathing quickly. Oxygen is now clearly below the safe band and the generator cannot keep up with the loss.",
        note: "Cabin O2: 68% · Crew status: 2 nominal, 1 affected",
        options: [
          opt("oxygen-masks", "Fit oxygen masks, then isolate the feed manifold", "Protect the crew first, then find the leak.", "good", "manifold-leak", {
            effects: { oxygen: 2, crew: 4 },
            severity: -8,
            consequence: "Masks stabilise the affected crew member while the leak check proceeds.",
          }),
          opt("ignore", "Tell the crew to rest and continue monitoring", "Symptoms may pass once the crew settles.", "poor", null, {
            effects: { oxygen: -6, crew: -12 },
            severity: 20,
            consequence: "Symptoms worsen and the crew can no longer perform the leak check safely.",
            ending: { status: "critical", summary: "Hypoxia was allowed to progress while the leak stayed unlocated." },
          }),
        ],
      },
    },
  },
  {
    id: "power-failure",
    code: "SIM-02",
    title: "Spacecraft Power Failure",
    system: "Electrical",
    tagline: "A solar array fault has taken one power bus offline.",
    brief:
      "One of two main power buses has tripped after an array regulator fault. The spacecraft is running on a single bus with limited battery reserve and several systems drawing more than planned.",
    objective: "Keep the essential bus powered, shed non-critical loads and restore a stable supply before the batteries drain.",
    duration: 280,
    startSeverity: 26,
    start: { oxygen: 95, pressure: 98, power: 62, temperature: 23, comms: 88 },
    drift: { oxygen: 0, pressure: -0.01, power: -0.16, temperature: 0.02, comms: -0.02 },
    principles: [
      "Spacecraft electrical buses separate essential loads (life support, guidance) from non-essential ones so a fault cannot cascade.",
      "Batteries are sized for eclipse periods; an unexpected load can drain them before the next sunlight pass.",
      "Electrical faults often produce heat, so temperature is a useful early indicator of a failing regulator.",
    ],
    recommendedModules: ["power-systems", "systems-thinking"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Power bus trip",
        brief:
          "Bus A has tripped. Bus B is carrying the whole spacecraft and battery state of charge is 58% and falling. The regulator that failed is warm but not yet overheating.",
        note: "Bus A: OFFLINE · Bus B: 91% load · Battery: 58%",
        options: [
          opt("shed", "Shed non-essential loads before attempting a restart", "Switch off experiment racks, non-critical lighting and spare heaters first.", "good", "shed-done", {
            effects: { power: 8, temperature: -0.5 },
            severity: -8,
            consequence: "Bus B load drops to 63%, buying time to diagnose the regulator.",
          }),
          opt("restart", "Reset the tripped bus immediately", "Re-energise Bus A to restore redundancy now.", "ok", "restart-try", {
            effects: { power: -4 },
            severity: 6,
            consequence: "The bus trips again on reset, and the retry costs battery charge.",
            hint: "A fault that persists will re-trip the bus — remove the cause or the load first.",
          }),
          opt("nothing", "Let the battery drain while planning", "Review procedures before touching the electrical system.", "poor", "restart-try", {
            effects: { power: -10 },
            severity: 10,
            consequence: "Battery state falls another 6% while the bus stays overloaded.",
          }),
        ],
      },
      "shed-done": {
        title: "Loads reduced, cause still unknown",
        brief:
          "With non-essential loads off there is margin again. The failed regulator is warm and the array current is fluctuating, which suggests the regulator caused the trip.",
        note: "Bus B: 63% load · Battery: 66% · Regulator temp: elevated",
        options: [
          opt("isolate-regulator", "Isolate the faulty regulator and cross-tie the arrays", "Route the working array through the healthy regulator.", "good", "cross-tie", {
            effects: { power: 6, temperature: -0.5 },
            severity: -10,
            consequence: "Array current stabilises on the healthy regulator. Bus A can be restored.",
          }),
          opt("force-array", "Force full array output through the warm regulator", "Get maximum charging to recover the battery quickly.", "poor", null, {
            effects: { power: -8, temperature: 6 },
            severity: 16,
            consequence: "The regulator overheats and shuts down, taking the remaining array offline.",
            ending: { status: "critical", summary: "An overheating regulator was pushed further, losing the last working array." },
          }),
        ],
      },
      "cross-tie": {
        title: "Power restored — pick the recovery plan",
        brief:
          "Bus A is ready to be re-energised with the arrays cross-tied. The battery needs a controlled recharge, and life support must stay on the essential bus.",
        note: "Both buses ready · Battery 64% · Essential loads isolated",
        options: [
          opt("controlled", "Bring Bus A back gradually and recharge at a safe rate", "Restore essential loads first, then non-essential ones in stages.", "good", null, {
            effects: { power: 12 },
            severity: -12,
            consequence: "Power returns to a stable margin with life support protected.",
            ending: { status: "stabilised", summary: "Electrical system recovered with a staged, controlled load restoration." },
          }),
          opt("everything", "Restore every load at once", "Return the spacecraft to its full configuration immediately.", "ok", null, {
            effects: { power: -6, temperature: 1 },
            severity: 6,
            consequence: "The sudden load spike drops the bus voltage and the battery takes the strain.",
            ending: { status: "partial", summary: "Power survived, but an all-at-once restoration stressed the bus." },
          }),
        ],
      },
      "restart-try": {
        title: "Bus keeps tripping",
        brief:
          "The battery is now below 45% and the bus is still overloaded. Life support is drawing emergency power from the reserve.",
        note: "Bus A: tripped · Battery: 45% · Reserve: engaged",
        options: [
          opt("shed-now", "Shed non-essential loads and isolate the regulator", "Cut the load, then remove the faulty hardware from the circuit.", "good", "cross-tie", {
            effects: { power: 9, temperature: -1 },
            severity: -10,
            consequence: "Loads drop and the arrays stabilise, giving room to recover the bus.",
          }),
          opt("bypass", "Bypass all protection and draw everything from the battery", "Keep flying and worry about the batteries later.", "poor", null, {
            effects: { power: -14, temperature: 3 },
            severity: 22,
            consequence: "Protection is bypassed and the battery drains below its safe depth of discharge.",
            ending: { status: "critical", summary: "Protective systems were bypassed, leaving the battery damaged and reserve power gone." },
          }),
        ],
      },
    },
  },
  {
    id: "comms-blackout",
    code: "SIM-03",
    title: "Communication Blackout",
    system: "Communications",
    tagline: "The ground station has gone silent mid-manoeuvre.",
    brief:
      "During a planned orbital adjustment the spacecraft loses its high-gain antenna link. The crew can no longer confirm manoeuvre completion and the next ground pass is 24 minutes away.",
    objective: "Re-establish a communications path, confirm the manoeuvre state and keep the crew informed.",
    duration: 260,
    startSeverity: 20,
    start: { oxygen: 96, pressure: 97, power: 88, temperature: 22, comms: 22 },
    drift: { oxygen: 0, pressure: 0, power: -0.03, temperature: 0, comms: 0 },
    principles: [
      "Spacecraft often carry several communication paths: high-gain antennas, low-gain omni antennas and a UHF backup.",
      "Antenna pointing is critical — a high-gain antenna mispointed by a fraction of a degree loses the link.",
      "Loss of signal during a manoeuvre means the burn state must be reconstructed from onboard navigation data.",
    ],
    recommendedModules: ["comms-systems", "navigation-guidance"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Loss of signal",
        brief:
          "Telemetry shows the high-gain antenna drive motor current spiking at the same moment the link dropped. The low-gain antenna is available but untested since launch.",
        note: "HGA link: NO SIGNAL · Drive motor current: high · LGA: available",
        options: [
          opt("lga", "Switch to the low-gain antenna and re-point", "Bring the omni antenna online and listen for the ground beacon.", "good", "lga-check", {
            effects: { comms: 25 },
            severity: -8,
            consequence: "The low-gain antenna detects the carrier wave from the ground station.",
          }),
          opt("reset", "Power-cycle the entire communications package", "A hard reset may clear the fault.", "ok", "reset-cost", {
            effects: { comms: -5, power: -3 },
            severity: 5,
            consequence: "The reset clears the fault log you needed for diagnosis and the link stays down.",
            hint: "Resetting a subsystem also erases the evidence of why it failed.",
          }),
          opt("wait", "Wait for the next scheduled ground pass", "Do nothing until the ground contacts the spacecraft.", "poor", "wait-pass", {
            effects: { comms: -2 },
            severity: 10,
            consequence: "The pass arrives with the antenna still mispointed and no recovery plan.",
          }),
        ],
      },
      "lga-check": {
        title: "Carrier detected — verify manoeuvre state",
        brief:
          "The low-gain link carries a weak but readable signal. The manoeuvre burn may or may not have completed; navigation data can tell you.",
        note: "LGA link: 32% quality · Burn confirmation: unknown",
        options: [
          opt("nav-check", "Compare onboard navigation state with the planned burn profile", "Use the star trackers and accelerometers to confirm the delta-v.", "good", "comm-restore", {
            effects: { comms: 8 },
            severity: -8,
            consequence: "Navigation shows a complete burn with a delta-v match to within 0.3%.",
          }),
          opt("burn-again", "Re-run the manoeuvre in case it did not complete", "Repeat the burn to be safe.", "poor", null, {
            effects: { comms: 4, power: -6 },
            severity: 18,
            consequence: "Without confirmation the second burn doubles the planned velocity change and the orbit is overshot.",
            ending: { status: "critical", summary: "An unconfirmed manoeuvre was repeated, overshooting the target orbit." },
          }),
        ],
      },
      "comm-restore": {
        title: "Ground acquired",
        brief:
          "The ground station has the weak signal. To restore full data you can hold the low-gain link while troubleshooting, or attempt to reuse the high-gain antenna.",
        note: "LGA: locked · HGA drive: still suspect",
        options: [
          opt("steady-lga", "Stay on the low-gain link and file a full fault report", "Accept lower bandwidth for the rest of the shift.", "good", null, {
            effects: { comms: 14 },
            severity: -12,
            consequence: "Communications are restored with a documented fault for maintenance.",
            ending: { status: "stabilised", summary: "Communications restored on the backup link with the fault correctly documented." },
          }),
          opt("hga-test", "Attempt the high-gain antenna again while keeping the backup", "Try to recover full bandwidth.", "ok", null, {
            effects: { comms: -4 },
            severity: 3,
            consequence: "The high-gain test briefly drops the link before the backup reacquires.",
            ending: { status: "partial", summary: "Backup link held, but an untested high-gain retry interrupted communications." },
          }),
        ],
      },
      "reset-cost": {
        title: "Backup path needed",
        brief:
          "The communications package is rebooting and the link is still down. You have time to prepare a backup path before the next pass.",
        note: "Comms reboot in progress · Ground pass in 12 minutes",
        options: [
          opt("lga-now", "Bring the low-gain antenna online before the pass", "Use the backup path to be ready when the ground calls.", "good", "lga-check", {
            effects: { comms: 22 },
            severity: -8,
            consequence: "The backup antenna is ready and acquires the carrier as the ground station rises.",
          }),
          opt("idle", "Wait for the reboot to finish", "Let the system come back on its own.", "poor", "wait-pass", {
            effects: { comms: -3 },
            severity: 7,
            consequence: "The reboot completes with the antenna still mispointed and the pass is missed.",
          }),
        ],
      },
      "wait-pass": {
        title: "Ground pass missed",
        brief:
          "The scheduled pass has come and gone with no lock. The crew has now been out of contact for almost 20 minutes and the next opportunity is much later.",
        note: "Comms: NO SIGNAL · Next pass: 47 minutes",
        options: [
          opt("lga-late", "Configure the low-gain antenna for the next pass", "Accept the delay and prepare the backup path properly.", "good", "lga-check", {
            effects: { comms: 18 },
            severity: -4,
            consequence: "The backup antenna is configured and locks on at the next opportunity.",
          }),
          opt("continue", "Continue the mission without ground contact", "Proceed on the standing plan.", "poor", null, {
            effects: { comms: -6 },
            severity: 14,
            consequence: "Operating without contact leaves the crew guessing the manoeuvre state and delays any ground support.",
            ending: { status: "critical", summary: "The spacecraft continued without contact and missed its recovery window." },
          }),
        ],
      },
    },
  },
  {
    id: "cabin-pressure-loss",
    code: "SIM-04",
    title: "Cabin Pressure Loss",
    system: "Structure & Life Support",
    tagline: "A micrometeoroid strike has opened a small breach in the hull.",
    brief:
      "A short, sharp pressure drop is followed by a continuous hiss from the forward module. Pressure is falling steadily while the crew is working in the rear lab.",
    objective: "Locate and isolate the breach, protect the crew, and restore a habitable cabin pressure.",
    duration: 240,
    startSeverity: 34,
    start: { oxygen: 93, pressure: 84, power: 92, temperature: 20, comms: 90 },
    drift: { oxygen: -0.06, pressure: -0.24, power: -0.02, temperature: -0.06, comms: 0 },
    principles: [
      "Pressure differential drives the leak: the faster the cabin empties, the less time the crew has to react.",
      "Isolating the damaged module preserves the breathable atmosphere in the rest of the spacecraft.",
      "Rapid decompression also cools the cabin as gas expands, so temperature is a clue to leak severity.",
    ],
    recommendedModules: ["pressure-atmosphere", "life-support"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Rapid pressure decay",
        brief:
          "Cabin pressure has fallen 12% in under a minute. The hiss is coming from the forward module, which is currently empty. The crew is in the rear lab with the hatch between them.",
        note: "Cabin pressure: 84% and falling · Forward module: unoccupied",
        options: [
          opt("seal", "Seal the forward module hatch immediately", "Isolate the damaged volume to save the rest of the cabin.", "good", "sealed", {
            effects: { pressure: 6, temperature: -1 },
            severity: -12,
            consequence: "The hatch seals and cabin pressure stabilises almost immediately.",
          }),
          opt("search", "Send a crew member into the forward module to find the puncture", "Locate the hole before sealing it off.", "ok", "search-leak", {
            effects: { pressure: -8, crew: -6 },
            severity: 8,
            consequence: "The search costs air and exposes the crew member to the fastest decompression.",
            hint: "An empty module can be sealed first; nothing needs to be found before that.",
          }),
          opt("repressurise", "Open the reserve gas tanks to hold pressure", "Fight the leak by adding gas.", "poor", "gas-drain", {
            effects: { pressure: 2, oxygen: -4, power: -2 },
            severity: 10,
            consequence: "Reserve gas flows straight out of the breach and the tank is depleted.",
            hint: "Adding gas to an open hull only empties the tanks faster.",
          }),
        ],
      },
      sealed: {
        title: "Module isolated — hull breach confirmed",
        brief:
          "Pressure in the rear cabin is holding. The forward module is at vacuum and the breach is behind a panel near the docking ring.",
        note: "Forward module: sealed, vacuum · Rear cabin: 92%",
        options: [
          opt("patch-plan", "Plan a controlled EVA patch with the crew tethered", "Repair from outside without opening the cabin.", "good", "repair", {
            effects: { pressure: 2 },
            severity: -8,
            consequence: "A tethered EVA plan is approved and the patch kit is prepared.",
          }),
          opt("open-hatch", "Reopen the hatch to inspect the breach from inside", "Take a look at the damage directly.", "poor", null, {
            effects: { pressure: -22, crew: -10 },
            severity: 20,
            consequence: "Reopening the hatch reconnects the cabin to vacuum and pressure collapses again.",
            ending: { status: "critical", summary: "The isolated module was reopened, losing the atmosphere the seal had saved." },
          }),
        ],
      },
      repair: {
        title: "Patch applied",
        brief:
          "The patch is holding. The forward module can be repressurised slowly, watching for any decay that would mean a poor seal.",
        note: "Patch: applied · Forward module: vacuum · Leak: no decay",
        options: [
          opt("slow", "Repressurise slowly and monitor the leak rate", "Bring the module back in stages.", "good", null, {
            effects: { pressure: 10, oxygen: -1 },
            severity: -14,
            consequence: "The module repressurises cleanly with no pressure decay.",
            ending: { status: "stabilised", summary: "Breach patched and cabin pressure fully restored." },
          }),
          opt("fast", "Repressurise at maximum flow", "Restore the cabin quickly.", "ok", null, {
            effects: { pressure: 4, temperature: -2 },
            severity: 3,
            consequence: "Rapid repressurisation stresses the patch and the module cools sharply.",
            ending: { status: "partial", summary: "Pressure restored, but the fast repressurisation left the patch marginal." },
          }),
        ],
      },
      "search-leak": {
        title: "Crew in the decompressing module",
        brief:
          "The crew member reports the breach behind a service panel but is short of breath and the module pressure is now very low.",
        note: "Forward module: 41% · Crew status: strain",
        options: [
          opt("withdraw-seal", "Withdraw the crew member and seal the hatch", "Get the crew out, then isolate the module.", "good", "sealed", {
            effects: { pressure: 4, crew: 5 },
            severity: -8,
            consequence: "The crew member returns safely and the hatch seals behind them.",
          }),
          opt("stay", "Keep the crew member in there to finish the repair", "They are close to the panel.", "poor", null, {
            effects: { pressure: -10, crew: -18 },
            severity: 22,
            consequence: "The crew member is exposed to near-vacuum and has to be evacuated, repair unfinished.",
            ending: { status: "critical", summary: "A crew member was kept in a decompressing module, putting the crew at risk." },
          }),
        ],
      },
      "gas-drain": {
        title: "Reserve gas depleted",
        brief:
          "The reserve tanks are nearly empty and the cabin is still losing pressure. The forward module has not been isolated.",
        note: "Reserve gas: 12% · Cabin pressure: 68%",
        options: [
          opt("seal-now", "Seal the forward module and stop the loss", "Isolate the breach now.", "good", "sealed", {
            effects: { pressure: -2 },
            severity: -10,
            consequence: "Sealing the module halts the pressure loss, though the reserve is nearly spent.",
          }),
          opt("keep-venting", "Continue feeding gas and search for the breach", "Buy time to find the hole.", "poor", null, {
            effects: { pressure: -14, crew: -10 },
            severity: 20,
            consequence: "The last reserve gas escapes through the breach and the cabin cannot be held.",
            ending: { status: "critical", summary: "Reserve gas was exhausted before the breach was isolated." },
          }),
        ],
      },
    },
  },
  {
    id: "navigation-failure",
    code: "SIM-05",
    title: "Navigation System Failure",
    system: "Guidance & Navigation",
    tagline: "The star tracker has dropped out minutes before a critical burn.",
    brief:
      "The primary star tracker has failed and the navigation computer is reporting an attitude solution with growing uncertainty. A deorbit burn is scheduled in 18 minutes.",
    objective: "Restore a trustworthy attitude and position solution, then complete or safely abort the burn.",
    duration: 250,
    startSeverity: 30,
    start: { oxygen: 96, pressure: 97, power: 90, temperature: 22, comms: 86 },
    drift: { oxygen: 0, pressure: 0, power: -0.04, temperature: 0, comms: -0.02 },
    principles: [
      "Attitude is usually derived from star trackers, sun sensors, gyroscopes and accelerometers combined in a navigation filter.",
      "A burn must not begin until the position and velocity solution meets a known accuracy threshold.",
      "Aborting a burn is a legitimate, safe outcome that preserves the crew and spacecraft.",
    ],
    recommendedModules: ["navigation-guidance", "systems-thinking"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Attitude solution degraded",
        brief:
          "Star tracker 1 is offline and the filter has fallen back to gyroscope propagation. Attitude uncertainty is climbing at about 0.4° per minute.",
        note: "Star tracker 1: FAILED · Uncertain: 2.1° · Burn in 18 min",
        options: [
          opt("tracker2", "Switch to the backup star tracker and re-initialise the filter", "Load the second tracker and reset the attitude solution.", "good", "tracker-check", {
            effects: { comms: 2 },
            severity: -10,
            consequence: "Star tracker 2 acquires the guide stars and uncertainty begins to fall.",
          }),
          opt("manual", "Attempt a manual attitude update from the window view", "Use visual references to correct attitude.", "poor", "manual-error", {
            effects: {},
            severity: 10,
            consequence: "Visual references give a rough attitude that conflicts with the filter.",
            hint: "Manual sightings are not accurate enough to certify a burn solution.",
          }),
          opt("burn-anyway", "Proceed with the burn on the degraded solution", "The schedule matters; go with the current data.", "poor", null, {
            effects: { power: -4 },
            severity: 24,
            consequence: "The burn vector is off and the spacecraft ends up in an unplanned orbit.",
            ending: { status: "critical", summary: "A burn was executed on an uncertified navigation solution, reaching the wrong orbit." },
          }),
        ],
      },
      "tracker-check": {
        title: "Backup tracker acquired",
        brief:
          "Star tracker 2 is working. The navigation filter needs a clean calibration run before the solution can be certified for the burn.",
        note: "Uncertainty: 0.7° and falling · Burn window: 11 minutes",
        options: [
          opt("calibrate", "Run the calibration and certify the solution", "Give the filter time to converge, then verify against ground ephemeris.", "good", "certified", {
            effects: { comms: 3 },
            severity: -10,
            consequence: "Calibration converges and the solution matches the expected ephemeris.",
          }),
          opt("rush", "Skip calibration and start the burn sequence", "Use the improving solution as it stands.", "ok", "certified", {
            effects: {},
            severity: 8,
            consequence: "The burn starts with a partially converged solution and a larger pointing error.",
          }),
        ],
      },
      certified: {
        title: "Solution certified — burn window open",
        brief:
          "The navigation solution is within tolerance. The burn window opens now and closes in six minutes; a no-burn decision is also valid.",
        note: "Uncertainty: 0.2° · Window: 6 minutes",
        options: [
          opt("burn", "Execute the burn on the certified solution", "Proceed with the planned manoeuvre.", "good", null, {
            effects: {},
            severity: -14,
            consequence: "The burn executes accurately and the orbit matches the plan.",
            ending: { status: "stabilised", summary: "Navigation recovered and the burn executed on a certified solution." },
          }),
          opt("abort", "Abort the burn and replan with the ground", "A safe orbit today is better than an unplanned one.", "ok", null, {
            effects: { comms: -1 },
            severity: -4,
            consequence: "The burn is deferred and the ground team plans a new window.",
            ending: { status: "partial", summary: "A cautious abort kept the crew safe at the cost of the mission timeline." },
          }),
        ],
      },
      "manual-error": {
        title: "Conflicting attitude data",
        brief:
          "The manually entered attitude disagrees with the gyro propagation. The filter is now rejecting updates and uncertainty is higher than before.",
        note: "Uncertainty: 4.8° · Burn window: 7 minutes",
        options: [
          opt("revert", "Revert the manual update and bring up the backup tracker", "Undo the bad data and use proper sensors.", "good", "tracker-check", {
            effects: {},
            severity: -8,
            consequence: "The manual update is discarded and tracker 2 restores a usable solution.",
          }),
          opt("trust-manual", "Trust the manual attitude and continue", "Override the filter.", "poor", null, {
            effects: {},
            severity: 18,
            consequence: "The conflicting solution drives the burn in the wrong direction and attitude control is lost briefly.",
            ending: { status: "critical", summary: "Manual attitude data was trusted over sensor fusion, producing a bad burn." },
          }),
        ],
      },
    },
  },
  {
    id: "medical-emergency",
    code: "SIM-06",
    title: "Medical Emergency",
    system: "Crew Health",
    tagline: "A crew member shows signs of decompression sickness after an EVA.",
    brief:
      "Twenty minutes after returning from a spacewalk, a crew member reports joint pain, tingling in the hands and fatigue. The other two crew are fit for duty and the ground medical team is available.",
    objective: "Stabilise the affected crew member, protect the rest of the crew and use the ground medical support correctly.",
    duration: 240,
    startSeverity: 28,
    start: { oxygen: 94, pressure: 95, power: 90, temperature: 22, comms: 90 },
    drift: { oxygen: -0.02, pressure: 0, power: -0.02, temperature: 0, comms: 0 },
    principles: [
      "Decompression sickness comes from nitrogen bubbles forming in tissue when ambient pressure falls too quickly.",
      "Treatment relies on restoring pressure and delivering high-flow oxygen while monitoring the patient.",
      "Microgravity changes how fluids and the body behave, which makes early symptoms easy to dismiss.",
    ],
    recommendedModules: ["crew-health", "human-spaceflight"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Crew member unwell after EVA",
        brief:
          "Symptoms began after the airlock cycle. Joint pain and tingling after a spacewalk are classic decompression sickness indicators and can worsen quickly.",
        note: "Heart rate: elevated · SpO2: 94% · Air lock cycle: complete",
        options: [
          opt("oxygen", "Provide high-flow oxygen and contact the flight surgeon", "Start oxygen and get medical advice immediately.", "good", "treatment", {
            effects: { crew: 8, oxygen: -2 },
            severity: -10,
            consequence: "Oxygen is started and the ground flight surgeon joins the loop.",
          }),
          opt("rest", "Let the crew member rest and observe", "The symptoms may be fatigue from the EVA.", "poor", "worsen", {
            effects: { crew: -10 },
            severity: 14,
            consequence: "Symptoms worsen as bubbles continue to form — the patient now has blurred vision.",
            hint: "Tingling and joint pain after a pressure change need treatment, not rest.",
          }),
          opt("meds", "Give painkillers and return the crew member to duty", "Manage the pain and continue the shift.", "poor", null, {
            effects: { crew: -16 },
            severity: 22,
            consequence: "Pain relief masks the condition while it progresses into a neurological emergency.",
            ending: { status: "critical", summary: "A decompression injury was masked with painkillers instead of treated." },
          }),
        ],
      },
      treatment: {
        title: "Patient stable on oxygen",
        brief:
          "The patient is breathing oxygen and the surgeon advises pressure treatment plus continuous monitoring. The airlock can be used as a treatment volume in this simulation.",
        note: "SpO2: 97% · Symptoms: improving · Surgeon: on channel",
        options: [
          opt("pressure", "Begin the advised pressure treatment and monitor vitals", "Follow the surgeon's plan while the other crew cover the affected tasks.", "good", "recover", {
            effects: { crew: 10, power: -3 },
            severity: -12,
            consequence: "Pressure treatment reduces symptoms and vitals stabilise.",
          }),
          opt("partial", "Give oxygen only and delay pressure treatment", "See whether oxygen alone is enough.", "ok", "recover", {
            effects: { crew: 2 },
            severity: 4,
            consequence: "Symptoms improve slightly but linger, and the delay lengthens recovery.",
          }),
        ],
      },
      recover: {
        title: "Crew readiness decision",
        brief:
          "The patient is stable but not fit for physical tasks. Two crew remain for a workload designed for three.",
        note: "Crew: 2 fit, 1 recovering · Task load: high",
        options: [
          opt("reduce", "Reduce the task list and ask the ground for support", "Protect the recovering crew member and reprioritise.", "good", null, {
            effects: { crew: 6 },
            severity: -14,
            consequence: "The workload is reduced, the patient recovers safely and the ground shifts the schedule.",
            ending: { status: "stabilised", summary: "Medical emergency treated and tasks safely reprioritised around a reduced crew." },
          }),
          opt("push", "Keep the full schedule with the remaining crew", "Push through with two crew.", "poor", null, {
            effects: { crew: -10, oxygen: -3 },
            severity: 12,
            consequence: "The remaining crew are fatigued and the patient is left unattended while symptoms return.",
            ending: { status: "partial", summary: "The patient recovered slowly while the crew worked beyond a safe load." },
          }),
        ],
      },
      worsen: {
        title: "Symptoms progressing",
        brief:
          "The crew member now has blurred vision and unsteady movement. This is a serious decompression injury that needs immediate treatment.",
        note: "SpO2: 91% · Neurological symptoms: present",
        options: [
          opt("emergency", "Start emergency oxygen and pressure treatment now", "Treat aggressively and call the flight surgeon.", "good", "recover", {
            effects: { crew: 6, power: -4 },
            severity: -10,
            consequence: "Emergency treatment begins and the symptoms stop progressing.",
          }),
          opt("observe", "Continue observing and reassess in ten minutes", "Watch for more signs before treating.", "poor", null, {
            effects: { crew: -18 },
            severity: 20,
            consequence: "The condition deteriorates further and emergency treatment is delayed past the safest window.",
            ending: { status: "critical", summary: "A progressing decompression injury was observed instead of treated." },
          }),
        ],
      },
    },
  },
  {
    id: "solar-storm",
    code: "SIM-07",
    title: "Solar Storm",
    system: "Environment & Radiation",
    tagline: "A solar particle event is raising radiation levels across the spacecraft.",
    brief:
      "A solar flare has launched a particle storm expected to peak within 12 minutes. Radiation monitors are climbing, high-latitude passes are unusable and the crew must shelter without losing life support.",
    objective: "Protect the crew from radiation, safeguard critical electronics and keep the mission viable through the peak.",
    duration: 260,
    startSeverity: 32,
    start: { oxygen: 95, pressure: 96, power: 86, temperature: 24, comms: 70 },
    drift: { oxygen: 0, pressure: 0, power: -0.05, temperature: 0.03, comms: -0.06 },
    principles: [
      "Solar energetic particles arrive minutes to hours after a flare and are stopped by mass — water, propellant or dense shielding.",
      "Geomagnetic storms heat the upper atmosphere, increasing drag on spacecraft in low orbit.",
      "Sensitive electronics are vulnerable to single-event upsets, so non-essential systems are powered down.",
    ],
    recommendedModules: ["space-weather", "radiation"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Radiation levels rising",
        brief:
          "The radiation monitor has tripled in five minutes. The storm shelter is the water-stowage bay in the service module, which is unheated but well shielded.",
        note: "Dose rate: 3× nominal · Peak: 12 min · Shelter: available",
        options: [
          opt("shelter", "Move the crew to the water-stowage shelter and power down non-essential systems", "Shelter behind mass and reduce exposure of electronics.", "good", "sheltered", {
            effects: { crew: 12, power: 4, temperature: -1 },
            severity: -14,
            consequence: "The crew is behind the best shielding available and sensitive systems are off.",
          }),
          opt("partial", "Shelter only while monitoring from the console", "Keep one crew member at the console during the peak.", "ok", "sheltered", {
            effects: { crew: 4 },
            severity: 4,
            consequence: "One crew member stays exposed at the console during the highest dose rates.",
          }),
          opt("continue", "Continue normal operations and monitor", "The storm may not be as strong as predicted.", "poor", "exposed", {
            effects: { crew: -14 },
            severity: 18,
            consequence: "Dose accumulates quickly and two crew members reach their daily exposure limit.",
          }),
        ],
      },
      sheltered: {
        title: "Crew sheltered — storm still rising",
        brief:
          "The crew is safe behind shielding, but cabin temperature is dropping in the unheated bay and communications are degraded by ionospheric disturbance.",
        note: "Dose rate: 5× nominal · Bay temp: 16°C and falling · UHF: degraded",
        options: [
          opt("heat", "Route a heater to the shelter and keep comms on the backup band", "Balance crew comfort and contact with the ground.", "good", "peak", {
            effects: { temperature: 3, power: -4, comms: 5 },
            severity: -8,
            consequence: "The bay warms to a safe temperature and the backup band holds a weak link.",
          }),
          opt("ignore-cold", "Leave the heater off to save power", "Cold is survivable; power is precious.", "ok", "peak", {
            effects: { temperature: -3, power: 2 },
            severity: 4,
            consequence: "The bay cools further and the crew works less effectively.",
          }),
        ],
      },
      peak: {
        title: "Storm peak passing",
        brief:
          "Dose rates have peaked and are starting to fall. The spacecraft has lost some orbital altitude from increased atmospheric drag.",
        note: "Dose rate: falling · Altitude: −1.2 km · Systems: nominal",
        options: [
          opt("assess", "Keep the crew sheltered until dose rates return to nominal, then check systems", "Wait out the tail of the storm, then inspect the spacecraft.", "good", null, {
            effects: { crew: 4, comms: 4 },
            severity: -14,
            consequence: "The crew stays protected through the tail and returns to a healthy spacecraft.",
            ending: { status: "stabilised", summary: "Crew shielded through the storm peak with systems checked afterwards." },
          }),
          opt("early", "Bring the crew out immediately to prepare a reboost", "Recover altitude as soon as possible.", "poor", null, {
            effects: { crew: -8, power: -3 },
            severity: 10,
            consequence: "The crew leaves shelter during elevated dose rates and accumulates avoidable exposure.",
            ending: { status: "partial", summary: "The crew left shelter early, absorbing unnecessary radiation dose." },
          }),
        ],
      },
      exposed: {
        title: "Crew over exposure limit",
        brief:
          "Dose readings now exceed the daily limit for two crew members. The storm still has several minutes to run.",
        note: "Dose rate: 6× nominal · Crew exposure: above limit",
        options: [
          opt("shelter-now", "Move the crew to the shelter immediately", "Get behind mass now, even mid-task.", "good", "peak", {
            effects: { crew: 6 },
            severity: -10,
            consequence: "The crew reaches the shelter and exposure stops accumulating.",
          }),
          opt("stay", "Finish the current task first", "A few more minutes will not matter.", "poor", null, {
            effects: { crew: -18 },
            severity: 22,
            consequence: "Exposure climbs well past the limit and the crew's health is compromised.",
            ending: { status: "critical", summary: "Crew stayed exposed during a solar particle event, exceeding safe dose limits." },
          }),
        ],
      },
    },
  },
  {
    id: "orbital-change",
    code: "SIM-08",
    title: "Unexpected Orbital Changes",
    system: "Flight Dynamics",
    tagline: "The orbit is drifting after an unexplained velocity change.",
    brief:
      "Tracking shows the spacecraft has gained 1.4 m/s since the last ephemeris update. Nothing in the timeline accounts for it, and a docked cargo vehicle just completed a propellant transfer.",
    objective: "Identify the cause of the velocity change, re-establish the orbit and decide whether a correction burn is safe.",
    duration: 300,
    startSeverity: 24,
    start: { oxygen: 95, pressure: 97, power: 88, temperature: 23, comms: 84 },
    drift: { oxygen: 0, pressure: 0, power: -0.03, temperature: 0.01, comms: -0.02 },
    principles: [
      "Orbital velocity determines altitude: a small extra velocity raises the orbit on the far side and lowers it near the burn point.",
      "Propellant transfer shifts the combined centre of mass and can produce a measurable velocity change through venting or leaks.",
      "A correction burn must be planned against a verified state vector, not a guess.",
    ],
    recommendedModules: ["orbital-mechanics", "navigation-guidance"],
    startNode: "assess",
    nodes: {
      assess: {
        title: "Unexplained velocity change",
        brief:
          "The state vector is off by 1.4 m/s. The cargo vehicle completed a propellant transfer an hour ago and its vent valve telemetry looks unusual.",
        note: "Delta-v: +1.4 m/s · Cargo vehicle vent valve: anomalous · Tracking: 2 passes",
        options: [
          opt("investigate", "Inspect the cargo vehicle vent valve and propellant logs", "Find the source before planning any burn.", "good", "cause", {
            effects: { comms: 3 },
            severity: -10,
            consequence: "Logs show a slow propellant vent from the cargo vehicle lasting several minutes.",
          }),
          opt("burn", "Immediately burn to correct the drift", "Correct the orbit before it degrades further.", "poor", "wrong-burn", {
            effects: { power: -5 },
            severity: 14,
            consequence: "The correction burn targets a drift whose source is still active, so the error grows.",
            hint: "Correcting an orbit while the cause is still acting will not converge.",
          }),
          opt("wait", "Wait for another tracking pass before deciding", "Collect more data on the drift rate.", "ok", "cause", {
            effects: { comms: -2 },
            severity: 3,
            consequence: "The next pass confirms a steady drift consistent with a venting source.",
          }),
        ],
      },
      cause: {
        title: "Venting cargo vehicle confirmed",
        brief:
          "The vent is still open a crack. Every minute it stays open adds velocity. You can close the valve remotely and then plan a correction.",
        note: "Vent valve: partially open · Drift: +0.05 m/s per minute",
        options: [
          opt("close", "Close the vent valve, then replan the orbit", "Stop the source, then correct once with a verified state vector.", "good", "correction", {
            effects: { power: -1 },
            severity: -10,
            consequence: "The valve closes and the drift stops, giving a stable state vector for correction.",
          }),
          opt("leave", "Leave the valve and burn against the drift", "Compensate continuously with the main engine.", "poor", null, {
            effects: { power: -10, oxygen: -3 },
            severity: 18,
            consequence: "Propellant is spent fighting an active source and the orbit remains unpredictable.",
            ending: { status: "critical", summary: "A correction was attempted while propellant was still venting, wasting propellant and destabilising the orbit." },
          }),
        ],
      },
      correction: {
        title: "Stable state vector — correction options",
        brief:
          "The drift has stopped. Two options are on the table: a small trim burn now, or a coast and a combined burn at the next node.",
        note: "Drift: 0.0 m/s · Propellant margin: adequate · Next node: 34 min",
        options: [
          opt("trim", "Execute a small trim burn and verify with tracking", "Correct now and confirm with the next pass.", "good", null, {
            effects: { power: -2 },
            severity: -14,
            consequence: "The trim burn lands within tolerance and tracking confirms the target orbit.",
            ending: { status: "stabilised", summary: "Drift source closed and the orbit corrected with a verified trim burn." },
          }),
          opt("coast", "Coast to the next node and combine the burn", "Save propellant with a single combined burn.", "ok", null, {
            effects: { power: -1 },
            severity: -4,
            consequence: "The combined burn is efficient but leaves the orbit slightly outside the tightest tolerance.",
            ending: { status: "partial", summary: "An efficient combined burn left a small residual orbit error." },
          }),
        ],
      },
      "wrong-burn": {
        title: "Drift increasing after correction",
        brief:
          "The burn made the error larger. The vent is still active and the spacecraft is now 2.3 m/s off the planned orbit.",
        note: "Delta-v error: 2.3 m/s · Vent: still open",
        options: [
          opt("stop-then-fix", "Close the vent valve and replan from a fresh state vector", "Stop the source first, then correct properly.", "good", "correction", {
            effects: { power: -2 },
            severity: -8,
            consequence: "The valve closes and a fresh solution gives a usable correction plan.",
          }),
          opt("burn-harder", "Burn harder to force the orbit back", "Overpower the error.", "poor", null, {
            effects: { power: -12 },
            severity: 20,
            consequence: "The larger burn overshoots and propellant is consumed without fixing the underlying drift.",
            ending: { status: "critical", summary: "Repeated burns against an active drift left the spacecraft on an unsafe orbit with little propellant." },
          }),
        ],
      },
    },
  },
];

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}