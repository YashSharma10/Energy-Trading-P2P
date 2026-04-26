import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, BarChart3, Users, Check } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Key Outcomes from poster
const outcomes = [
  {
    icon: Target,
    title: 'Clear Path to Net-Zero',
    desc: 'Defined net-zero strategies with transparent reporting.',
    color: '#22c55e',
    stat: 'Net-Zero',
  },
  {
    icon: TrendingUp,
    title: 'Streamlined Trading',
    desc: 'Efficient credit exchange, reducing transaction time and complexity.',
    color: '#3b82f6',
    stat: 'Faster',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & Transparent',
    desc: 'Immutable, auditable records ensuring trust in credit validity.',
    color: '#a855f7',
    stat: 'Trusted',
  },
  {
    icon: BarChart3,
    title: 'Measurable Decarbonisation',
    desc: 'Direct impact measurement against verified baselines.',
    color: '#fbbf24',
    stat: 'Measured',
  },
  {
    icon: Users,
    title: 'Affordable for All',
    desc: 'Access for small-scale players, democratising carbon markets.',
    color: '#22c55e',
    stat: 'Inclusive',
  },
];

// SDGs from poster
const sdgs = [
  { number: '13', label: 'Climate Action', color: '#3d7a3d', emoji: '🌍' },
  { number: '7',  label: 'Affordable & Clean Energy', color: '#f5a623', emoji: '☀️' },
  { number: '9',  label: 'Industry, Innovation & Infrastructure', color: '#e05c2a', emoji: '🏗️' },
  { number: '12', label: 'Responsible Consumption', color: '#c4922a', emoji: '♻️' },
  { number: '17', label: 'Partnerships for the Goals', color: '#1a5276', emoji: '🤝' },
];

export default function Slide11_Impact() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          CarbonEase Project — Key Outcomes
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Real <span className="text-gradient-green">Impact</span>
        </motion.h2>

        {/* Outcomes grid */}
        <motion.div
          variants={fadeUp}
          className="mt-32"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12,
            maxWidth: 1000,
            width: '100%',
          }}
        >
          {outcomes.map(({ icon: Icon, title, desc, color, stat }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              whileHover={{ y: -5 }}
              style={{
                padding: '18px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${color}22`,
                borderRadius: 14,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 2, background: color,
              }} />
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                fontWeight: 800,
                color,
                marginBottom: 6,
              }}>
                {stat}
              </div>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: 1.5 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* SDGs */}
        <motion.div variants={fadeUp} className="mt-32" style={{ width: '100%', maxWidth: 1000 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 14,
          }}>
            SDGs Covered
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {sdgs.map(({ number, label, color, emoji }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  borderRadius: 10,
                  cursor: 'default',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    color,
                    lineHeight: 1,
                  }}>
                    {number}
                  </div>
                  <div style={{
                    fontSize: '0.62rem',
                    color: 'var(--text-muted)',
                    maxWidth: 100,
                    lineHeight: 1.3,
                  }}>
                    {label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
