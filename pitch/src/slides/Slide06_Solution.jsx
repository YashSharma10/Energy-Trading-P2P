import { motion } from 'framer-motion';
import { Leaf, BarChart3, ShoppingCart, Bot, Sparkles } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const features = [
  {
    icon: BarChart3,
    title: 'Track Emissions',
    desc: 'Real-time carbon footprint monitoring across all operations',
  },
  {
    icon: ShoppingCart,
    title: 'Trade Credits',
    desc: 'Buy & sell verified carbon credits on a transparent marketplace',
  },
  {
    icon: Bot,
    title: 'AI Insights',
    desc: 'Intelligent recommendations for optimal offset strategies',
  },
];

export default function Slide06_Solution() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      {/* Clean green ambient — contrast from dark red slides */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(34, 197, 94, 0.08), transparent 65%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <div className="bg-grid" />
      <div className="bg-noise" />

      {/* Floating green particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: `rgba(34, 197, 94, ${0.1 + Math.random() * 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 30, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Transition badge */}
        <motion.div
          variants={fadeUp}
          className="badge badge-green mb-24"
        >
          <Sparkles size={14} /> THE SOLUTION
        </motion.div>

        {/* Main question */}
        <motion.h2
          variants={fadeUp}
          className="slide-title md"
          style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
        >
          What if they could{' '}
          <span className="text-gradient-green" style={{ fontWeight: 800 }}>offset emissions</span>
          <br />instead of immediately eliminating them?
        </motion.h2>

        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, type: 'spring', stiffness: 100 }}
          className="mt-48"
          style={{ position: 'relative' }}
        >
          {/* Glow ring */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -30,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 40px',
            background: 'rgba(34, 197, 94, 0.06)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 20,
            position: 'relative',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'var(--gradient-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Leaf size={28} color="#fff" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 900,
                background: 'var(--gradient-green)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                CarbonEase
              </h1>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--green-400)',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}>
                AI-Powered Carbon Credit Trading
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={fadeUp}
          className="mt-48 grid-3"
          style={{ maxWidth: 900, width: '100%' }}
        >
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.2, duration: 0.6 }}
              whileHover={{
                y: -6,
                borderColor: 'rgba(34, 197, 94, 0.3)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)',
              }}
              style={{ textAlign: 'left' }}
            >
              <div className="icon-circle icon-circle-green">
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>
                {title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
