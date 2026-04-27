import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, BarChart3, Users, Check, Thermometer, Sun, Cpu, Recycle, Network } from 'lucide-react';

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

// SDGs from poster — official UN colors
const sdgs = [
  { number: '13', label: 'Climate\nAction',             color: '#3F7E44', icon: Thermometer },
  { number: '7',  label: 'Affordable &\nClean Energy',  color: '#FCC30B', icon: Sun         },
  { number: '9',  label: 'Industry,\nInnovation',       color: '#FD6925', icon: Cpu         },
  { number: '12', label: 'Responsible\nConsumption',    color: '#BF8B2E', icon: Recycle     },
  { number: '17', label: 'Partnerships\nfor the Goals', color: '#19486A', icon: Network     },
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
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 16,
            justifyContent: 'center',
          }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.3))' }} />
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(74,222,128,0.8)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              SDGs Covered
            </div>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: 'linear-gradient(to left, transparent, rgba(34,197,94,0.3))' }} />
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {sdgs.map(({ number, label, color, icon: Icon }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.04 }}
                style={{
                  width: 130,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: `1px solid ${color}50`,
                  boxShadow: `0 4px 24px ${color}18`,
                  cursor: 'default',
                  flexShrink: 0,
                }}
              >
                {/* Colored header block */}
                <div style={{
                  background: color,
                  padding: '14px 12px 10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '2rem',
                    color: '#fff',
                    lineHeight: 1,
                    letterSpacing: '-1px',
                  }}>
                    {number}
                  </div>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color="#fff" strokeWidth={2} />
                  </div>
                </div>

                {/* Label block */}
                <div style={{
                  background: `${color}18`,
                  padding: '10px 12px',
                  minHeight: 52,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-line',
                    textAlign: 'left',
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
