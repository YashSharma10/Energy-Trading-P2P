import { motion } from 'framer-motion';
import { TrendingUp, Target, Layers, Search, AlertTriangle } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const problems = [
  {
    icon: TrendingUp,
    number: '01',
    title: 'Rising Global Carbon Emissions',
    desc: 'Industrial growth is accelerating emissions faster than reduction efforts can keep pace.',
    color: '#ef4444',
  },
  {
    icon: Target,
    number: '02',
    title: 'Net-Zero Difficult to Achieve',
    desc: 'Companies lack the tools, data, and marketplace access to realistically hit net-zero targets.',
    color: '#f59e0b',
  },
  {
    icon: Layers,
    number: '03',
    title: 'Complex Carbon Credit Systems',
    desc: 'Fragmented, opaque markets make buying and selling credits slow, expensive, and unreliable.',
    color: '#f87171',
  },
  {
    icon: Search,
    number: '04',
    title: 'Lack of Transparency & Analytics',
    desc: 'No real-time visibility into emission data, credit validity, or compliance status.',
    color: '#fbbf24',
  },
];

export default function Slide04_Problem() {
  return (
    <div className="slide" style={{ background: '#0b0911' }}>
      <div className="bg-noise" />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.04), transparent 70%)',
        }}
      />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="badge badge-red mb-24">
          <AlertTriangle size={14} /> MARKET PROBLEM &amp; MISSION
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Enabling Net-Zero Through{' '}
          <span className="text-gradient-red">Smart Carbon Markets</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          Four systemic failures blocking the world from reaching net-zero.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-48 grid-2"
          style={{ maxWidth: 860, width: '100%' }}
        >
          {problems.map(({ icon: Icon, number, title, desc, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.18 }}
              whileHover={{ y: -4 }}
              style={{
                display: 'flex',
                gap: 18,
                padding: '22px 24px',
                background: `${color}06`,
                border: `1px solid ${color}22`,
                borderRadius: 14,
                textAlign: 'left',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color,
                  letterSpacing: 2,
                  marginBottom: 6,
                }}>
                  {number}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
