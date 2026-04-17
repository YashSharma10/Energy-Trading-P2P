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
import Slide13_FutureScope from './slides/Slide13_FutureScope';
import Slide14_Closing from './slides/Slide14_Closing';
import Slide15_ThankYou from './slides/Slide15_ThankYou';

const slides = [
  { component: Slide01_Hook, label: 'The Hook' },
  { component: Slide02_Story, label: 'The Story' },
  { component: Slide03_Conflict, label: 'The Conflict' },
  { component: Slide04_Problem, label: 'The Problem' },
  { component: Slide05_Dilemma, label: 'The Dilemma' },
  { component: Slide06_Solution, label: 'CarbonEase' },
  { component: Slide07_HowItSolves, label: 'How It Works' },
  { component: Slide08_Walkthrough, label: 'Platform' },
  { component: Slide09_AIPower, label: 'AI Power' },
  { component: Slide10_TechStack, label: 'Tech Stack' },
  { component: Slide11_Impact, label: 'Impact' },
  { component: Slide12_MarketVision, label: 'Market' },
  { component: Slide13_FutureScope, label: 'Future' },
  { component: Slide14_Closing, label: 'Closing' },
  { component: Slide15_ThankYou, label: 'Thank You' },
];

const slideVariants = {
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.45, 0, 0.15, 1],
    },
  },
  exit: (direction) => ({
    y: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.5,
      ease: [0.45, 0, 0.15, 1],
    },
  }),
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const touchStart = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    if (index < 0 || index >= slides.length) return;
    
    setIsTransitioning(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
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
      
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 1000);

      if (e.deltaY > 30) nextSlide();
      else if (e.deltaY < -30) prevSlide();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSlide, prevSlide]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStart.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      touchStart.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const CurrentSlideComponent = slides[currentSlide].component;
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Progress bar */}
      <div className="slide-progress" style={{ width: `${progress}%` }} />

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="nav-container">
        {slides.map((slide, i) => (
          <button
            key={i}
            className={`nav-dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide: ${slide.label}`}
          >
            <span className="tooltip">{slide.label}</span>
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="slide-counter">
        <span className="current">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span> / {String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Keyboard hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="keyboard-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
