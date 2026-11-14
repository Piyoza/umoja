import { createFileRoute } from "@tanstack/react-router";
import WelcomeNav from "@/components/welcome/WelcomeNav";
import WelcomeHero from "@/components/welcome/WelcomeHero";
import AboutPlatform from "@/components/welcome/AboutPlatform";
import ExploreFeatures from "@/components/welcome/ExploreFeatures";
import HowItWorks from "@/components/welcome/HowItWorks";
import WhyAstronaut from "@/components/welcome/WhyAstronaut";
import AstraIntro from "@/components/welcome/AstraIntro";
import FinalCallToAction from "@/components/welcome/FinalCallToAction";
import WelcomeFooter from "@/components/welcome/WelcomeFooter";
import CinematicBackdrop from "@/components/welcome/CinematicBackdrop";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
  head: () => ({
    meta: [
      { title: "Welcome to the Junior Astronaut Mission Trainer" },
      {
        name: "description",
        content:
          "Discover the universe, explore the science of space and experience astronaut missions with the Junior Astronaut Mission Trainer.",
      },
    ],
  }),
});

function WelcomePage() {
  const scrollTo = (id) => {
    if (typeof document === "undefined") return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <CinematicBackdrop />
      <WelcomeNav onNavigate={scrollTo} />
      <main>
        <WelcomeHero onExplore={() => scrollTo("about")} />
        <AboutPlatform />
        <ExploreFeatures />
        <HowItWorks />
        <WhyAstronaut />
        <AstraIntro />
        <FinalCallToAction />
      </main>
      <WelcomeFooter onNavigate={scrollTo} />
    </div>
  );
}