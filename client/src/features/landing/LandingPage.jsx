import { useState, useCallback } from "react";
import AccordionSection from "./sections/AccordionSection";
import FactSection from "./sections/FactSection";
import FeatureSection from "./sections/FeatureSection";
import GlobeSection from "./sections/GlobeSection";
import StatsSection from "./sections/StatsSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import GeminiChatbot from "@/components/common/GeminiChatbot";
import video1 from "@/assets/video 1.mp4";
import video2 from "@/assets/video 2.mp4";
import video3 from "@/assets/video 3.mp4";

const VIDEOS = [video1, video2, video3];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
  }, []);

  return (
    <main className="w-full relative overflow-x-hidden">
      <GlobeSection />

      {/* Video playlist section — cycles through all 3 videos in order */}
      <FactSection />
      <section
        style={{
          padding: "0",
          lineHeight: 0,
          display: "block",
          background: "transparent",
          // marginTop: "2rem",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          // maskImage:
          //   "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <video
          key={currentIndex}
          src={VIDEOS[currentIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          style={{
            display: "block",
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            borderRadius: "1.5rem",
          }}
        />
      </section>
      <HowItWorksSection />
      <StatsSection />
      <FeatureSection />
      <TestimonialsSection />
      <AccordionSection />
      <GeminiChatbot />
    </main>
  );
};

export default LandingPage;
