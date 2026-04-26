import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

import Slide01_Hook from './slides/Slide01_Hook';
import Slide02_Story from './slides/Slide02_Story';
import Slide03_Conflict from './slides/Slide03_Conflict';
import Slide04_Problem from './slides/Slide04_Problem';
import Slide05_Dilemma from './slides/Slide05_Dilemma';
import Slide06_Solution from './slides/Slide06_Solution';
import Slide07_HowItSolves from './slides/Slide07_HowItSolves';
import Slide08_Walkthrough from './slides/Slide08_Walkthrough';
import Slide09_AIPower from './slides/Slide09_AIPower';
import Slide10_TechStack from './slides/Slide10_TechStack';
import Slide11_Impact from './slides/Slide11_Impact';
import Slide12_MarketVision from './slides/Slide12_MarketVision';
import Slide14_Closing from './slides/Slide14_Closing';

const slides = [
  { component: Slide01_Hook,       label: 'The Hook' },
  { component: Slide02_Story,      label: 'The Story' },
  { component: Slide03_Conflict,   label: 'The Conflict' },
  { component: Slide05_Dilemma,    label: 'The Dilemma' },
  { component: Slide04_Problem,    label: 'The Problem' },
  { component: Slide06_Solution,   label: 'CarbonEase' },
  { component: Slide07_HowItSolves,label: 'How It Works' },
  { component: Slide08_Walkthrough,label: 'Platform' },
  { component: Slide09_AIPower,    label: 'AI Power' },
  { component: Slide10_TechStack,  label: 'Tech Stack' },
  { component: Slide11_Impact,     label: 'Impact' },
  { component: Slide12_MarketVision,label: 'Market' },
  { component: Slide14_Closing,    label: 'Closing' },
];

// Story-flow transition: outgoing page drifts away softly,
// incoming page rises in cleanly — like turning a page in a book.
const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    y: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.32, 0.72, 0, 1], // fast-out: snappy settle
      opacity: { duration: 0.3, ease: 'easeOut' },
    },
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction > 0 ? -30 : 30,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1], // fast-in: quick departure
      opacity: { duration: 0.18, ease: 'easeIn' },
    },
  }),
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection]       = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHint, setShowHint]         = useState(true);
  const touchStart = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    if (index < 0 || index >= slides.length) return;
    setIsTransitioning(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 460);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown': case 'ArrowRight': case ' ': case 'PageDown':
          e.preventDefault(); nextSlide(); break;
        case 'ArrowUp': case 'ArrowLeft': case 'PageUp':
          e.preventDefault(); prevSlide(); break;
        case 'Home': e.preventDefault(); goToSlide(0); break;
        case 'End':  e.preventDefault(); goToSlide(slides.length - 1); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide]);

  // Mouse wheel navigation
  useEffect(() => {
    let wheelTimeout = null;
    const handleWheel = (e) => {
      e.preventDefault();
      if (wheelTimeout) return;
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 480);
      if (e.deltaY > 20) nextSlide();
      else if (e.deltaY < -20) prevSlide();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSlide, prevSlide]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
    const handleTouchEnd   = (e) => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
      touchStart.current = null;
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend',   handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  // Hide hint after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Keyboard / scroll hint — fades out after 4s */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="keyboard-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="key">↑</span>
            <span className="key">↓</span>
            <span>or scroll to navigate</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
