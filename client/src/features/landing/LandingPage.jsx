import AccordionSection from "./sections/AccordionSection";
import FactSection from "./sections/FactSection";
import FeatureSection from "./sections/FeatureSection";
import GlobeSection from "./sections/GlobeSection";
import StatsSection from "./sections/StatsSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ImpactSection from "./sections/ImpactSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import GeminiChatbot from "@/components/common/GeminiChatbot";

const LandingPage = () => {
  return (
    <main className="w-full relative overflow-x-hidden">
      <GlobeSection />
      <FactSection />
      <HowItWorksSection />
      <ImpactSection />
      <StatsSection />
      <FeatureSection />
      <TestimonialsSection />
      <AccordionSection />
      {/* <GeminiChatbot /> */}
      <GeminiChatbot />
    </main>
  );
};

export default LandingPage;
