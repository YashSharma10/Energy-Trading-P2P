import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaLinkedin,
  FaUsers,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaMagic,
} from "react-icons/fa";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

// Sparkle positions fixed per card (no random on render)
const SPARKLES = [
  { top: "8%",  left: "12%", delay: 0 },
  { top: "15%", left: "80%", delay: 0.3 },
  { top: "75%", left: "5%",  delay: 0.6 },
  { top: "85%", left: "75%", delay: 0.15 },
  { top: "45%", left: "92%", delay: 0.45 },
  { top: "55%", left: "2%",  delay: 0.9 },
  { top: "30%", left: "50%", delay: 0.2 },
  { top: "70%", left: "40%", delay: 0.7 },
];

const SparkleParticle = ({ top, left, delay }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top, left }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.4, 0],
      opacity: [0, 1, 0],
      rotate: [0, 90, 180],
    }}
    transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5Z" fill="url(#sg)" />
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="12" y2="12">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

const WandAnimation = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Wand sweep */}
        <motion.div
          className="absolute"
          initial={{ x: -60, y: 30, rotate: -30, opacity: 0 }}
          animate={{ x: 20, y: -20, rotate: 20, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Wand stick */}
            <line x1="8" y1="40" x2="36" y2="12" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
            {/* Wand tip glow */}
            <circle cx="36" cy="12" r="4" fill="#a78bfa" opacity="0.9" />
            <circle cx="36" cy="12" r="7" fill="#a78bfa" opacity="0.3" />
          </svg>
        </motion.div>

        {/* Burst of light at tip */}
        <motion.div
          className="absolute"
          style={{ top: "22%", right: "22%" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="w-8 h-8 rounded-full bg-violet-400 blur-md" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const WizardCard = ({ name, role, initials, linkedin, index }) => {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showWand, setShowWand] = useState(false);

  const handleHoverStart = () => {
    setHovered(true);
    setShowWand(true);
    setTimeout(() => {
      setShowWand(false);
      setRevealed(true);
    }, 750);
  };

  const handleHoverEnd = () => {
    setHovered(false);
    setRevealed(false);
    setShowWand(false);
  };

  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      style={{ perspective: 1000 }}
      className="relative group h-full"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Animated border */}
      <div className="absolute -inset-[1px] rounded-[1.6rem] overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute inset-[-100%]"
          style={{
            background: hovered
              ? "conic-gradient(from 0deg, transparent 0deg, transparent 100deg, #a78bfa 180deg, transparent 260deg, transparent 360deg)"
              : "none",
          }}
          animate={hovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Sparkles on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -inset-4 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {SPARKLES.map((s, i) => (
              <SparkleParticle key={i} {...s} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wand sweep */}
      <WandAnimation visible={showWand} />

      <Card
        className="h-full max-w-[280px] mx-auto rounded-[1.5rem] border border-violet-500/20 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 overflow-hidden relative z-10"
        style={{
          boxShadow: hovered
            ? "0 0 40px rgba(139,92,246,0.25), 0 25px 50px -12px rgba(0,0,0,0.2)"
            : undefined,
        }}
      >
        <CardContent className="flex h-full flex-col items-center justify-center gap-6 py-10 px-6 text-center relative z-20 font-sans">
          {/* Avatar */}
          <motion.div
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-muted/30 border border-violet-500/20 shadow-inner"
            style={{
              background: hovered
                ? "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent)"
                : undefined,
              boxShadow: hovered ? "0 0 24px rgba(139,92,246,0.4)" : undefined,
            }}
          >
            <motion.span
              className="text-3xl font-black tracking-tighter"
              animate={hovered ? { color: "#a78bfa", filter: "drop-shadow(0 0 10px rgba(167,139,250,0.8))" } : { color: undefined, filter: "none" }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {initials}
            </motion.span>
          </motion.div>

          <div className="space-y-2">
            <motion.p
              className="text-xl font-bold tracking-tight"
              animate={hovered ? { color: "#a78bfa" } : {}}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {name}
            </motion.p>

            {/* Role reveal after wand */}
            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {revealed ? (
                  <motion.span
                    key="role"
                    className="flex items-center gap-2 text-[11px] font-black tracking-[0.25em] uppercase"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaMagic style={{ color: "#a78bfa" }} />
                    </motion.span>
                    {"THE WIZARD".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        style={{
                          background: "linear-gradient(90deg, #7c3aed, #4f46e5)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          display: "inline-block",
                          whiteSpace: char === " " ? "pre" : "normal",
                        }}
                        initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.25, delay: i * 0.06, ease: "easeOut" }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                ) : (
                  <motion.span
                    key="hidden"
                    className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/30"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    • • • • •
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-1 px-7 py-2.5 rounded-full border border-violet-500/30 text-[13px] font-bold text-foreground/70 transition-all duration-500 hover:bg-violet-500/10 hover:text-violet-400 active:scale-95 shadow-sm"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <FaLinkedin size={14} /> Profile
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const teamMembers = [
  { name: "Yash Sharma", role: "Full-Stack Developer", initials: "YS", linkedin: "https://in.linkedin.com/in/yashsharma0406" },
  { name: "Mukul Yadav", role: "The Wizard", initials: "MY", linkedin: "https://www.linkedin.com/in/rao-mukul/" },
  { name: "Nilesh Sharma", role: "Backend Developer", initials: "NS", linkedin: "https://www.linkedin.com/in/nxtnilesh/" },
  { name: "Mohit Ghanghas", role: "UI/UX Designer", initials: "MG", linkedin: "#" },
];


const ContactUs = () => {
  return (
    <div className="bg-gradient-to-br from-background via-brandMainColor/5 to-emerald-500/5 dark:via-brandSubColor/5 dark:to-lime-400/5 min-h-screen relative font-sans pt-20 pb-16 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandMainColor/10 dark:bg-brandSubColor/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-lime-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto flex max-w-2xl flex-col px-6 relative z-10 w-full flex-1 justify-center py-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="w-full"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {teamMembers.map(({ name, role, initials, linkedin }, index) => {
              const isMukul = name === "Mukul Yadav";
              if (isMukul) {
                return <WizardCard key={name} name={name} role={role} initials={initials} linkedin={linkedin} index={index} />;
              }
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative group h-full"
                >
                  <Card className="h-full max-w-[280px] mx-auto rounded-[1.5rem] border border-border/30 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 overflow-hidden relative z-10 group-hover:border-foreground/20 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                    <CardContent className="flex h-full flex-col items-center justify-center gap-6 py-10 px-6 text-center relative z-20 font-sans">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-muted/30 text-foreground/80 shadow-inner group-hover:scale-110 transition-all duration-700 border border-transparent group-hover:bg-brandMainColor/10 dark:group-hover:bg-brandSubColor/10 group-hover:text-brandMainColor dark:group-hover:text-brandSubColor group-hover:border-brandMainColor/20"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        <span className="text-3xl font-black tracking-tighter">{initials}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-foreground tracking-tight transition-colors group-hover:text-brandMainColor dark:group-hover:text-brandSubColor"
                          style={{ fontFamily: "'Outfit', sans-serif" }}>{name}</p>
                        <p className="text-[12px] font-semibold tracking-[0.15em] uppercase opacity-50 transition-opacity group-hover:opacity-100"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{role}</p>
                      </div>
                      <a href={linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-1 px-7 py-2.5 rounded-full border border-border/60 text-[13px] font-bold text-foreground/70 transition-all duration-500 hover:bg-foreground hover:text-background active:scale-95 shadow-sm"
                        style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <FaLinkedin size={14} /> Profile
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
